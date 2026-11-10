import "server-only";
import * as cheerio from "cheerio";
import https from "node:https";
import { Resolver } from "node:dns/promises";
import { lookup as systemLookup } from "node:dns";

const origin = "https://inceptivesdigital.com";
// Keep TLS/SNI verification on the hostname, even when the local OS resolver fails.
async function sourceRequest(url: string, body?: URLSearchParams) {
  const resolver = new Resolver();
  resolver.setServers(["1.1.1.1", "8.8.8.8"]);
  return new Promise<string>((resolve, reject) => {
    const request = https.request(
      url,
      {
        method: body ? "POST" : "GET",
        headers: body
          ? {
              "Content-Type": "application/x-www-form-urlencoded",
              "Content-Length": Buffer.byteLength(body.toString()),
            }
          : {},
        lookup(hostname, options, callback) {
          systemLookup(hostname, { all: true }, (error, resolved) => {
            if (!error && resolved.length) {
              if (options?.all) callback(null, resolved);
              else callback(null, resolved[0].address, resolved[0].family);
              return;
            }
            resolver
              .resolve4(hostname)
              .then((addresses) => {
                if (options?.all)
                  callback(
                    null,
                    addresses.map((address) => ({ address, family: 4 })),
                  );
                else callback(null, addresses[0], 4);
              })
              .catch((error) => callback(error, []));
          });
        },
        timeout: 20000,
      },
      (response) => {
        const chunks: Buffer[] = [];
        let size = 0;
        response.on("data", (chunk: Buffer) => {
          size += chunk.length;
          if (size > 10_000_000)
            request.destroy(new Error("Response too large"));
          else chunks.push(chunk);
        });
        response.on("end", () =>
          response.statusCode === 200
            ? resolve(Buffer.concat(chunks).toString("utf8"))
            : reject(new Error("Form service unavailable")),
        );
        response.on("error", reject);
      },
    );
    request.on("timeout", () =>
      request.destroy(new Error("Form service timed out")),
    );
    request.on("error", reject);
    request.end(body?.toString());
  });
}

export async function loadSearchResults(query: string, page: number) {
  const html = await sourceRequest(
    origin + "/?" + new URLSearchParams({ s: query, paged: String(page) }),
  );
  const $ = cheerio.load(html);
  const local = (value: string) => {
    const url = new URL(value, origin);
    return url.origin === origin ? url.pathname + url.search + url.hash : "";
  };
  return {
    title: $("title").text(),
    results: $("main article.post")
      .toArray()
      .map((el) => {
        const article = $(el),
          image = article.find("img").first();
        return {
          title: article.find("h2").text().trim(),
          href: local(article.find("h2 a").attr("href") || "/"),
          excerpt: article.find("p").text(),
          image: image.length
            ? {
                src: local(image.attr("src") || ""),
                alt: image.attr("alt") || "",
                width: Number(image.attr("width")) || 800,
                height: Number(image.attr("height")) || 370,
              }
            : null,
        };
      }),
    pagination: $("main .pagination a,main nav a")
      .toArray()
      .map((el) => ({
        label: $(el).text().trim(),
        href: local($(el).attr("href") || "/"),
      })),
  };
}

export async function loadFormContract(path: string, formId: string) {
  const html = await sourceRequest(origin + path);
  const $ = cheerio.load(html);
  const form = $("form.elementor-form")
    .filter((_, el) => $(el).find('input[name="form_id"]').val() === formId)
    .first();
  if (!form.length) return null;
  const fields = form
    .find("input[name],textarea[name],select[name]")
    .toArray()
    .map((el) => ({
      name: $(el).attr("name")!,
      type: $(el).attr("type") || el.tagName,
      required: $(el).attr("required") !== undefined,
      value: String($(el).val() || ""),
    }));
  return { fields };
}

export async function sendElementorForm(payload: URLSearchParams) {
  const text = await sourceRequest(
    origin + "/wp-admin/admin-ajax.php",
    payload,
  );
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Form service returned an invalid response");
  }
}

export async function sendIOSAssessment(fields: URLSearchParams) {
  const html = await sourceRequest(origin + "/ios-app-development");
  const $ = cheerio.load(html);
  const code = $("script")
    .toArray()
    .map((el) => $(el).html() || "")
    .find((code) => code.includes("id_ios_quiz_submit"));
  // Guest nonce is refreshed from the authoritative page; never stored in the bundle.
  const nonce = code?.match(/nonce\s*:\s*"([a-zA-Z0-9]+)"/)?.[1];
  if (!nonce) throw new Error("Assessment unavailable");
  const form = $(".id-ios-form");
  for (const group of ["platform", "hardware", "performance", "timeline"]) {
    const options = form
      .find(`input[name="${group}"]`)
      .toArray()
      .map((el) => $(el).attr("value"));
    if (!options.includes(fields.get(group) || ""))
      throw new Error("Invalid assessment answer");
  }
  fields.set("nonce", nonce);
  fields.set("action", "id_ios_quiz_submit");
  return sendElementorForm(fields);
}
