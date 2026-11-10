import fs from "node:fs";
import zlib from "node:zlib";
import * as cheerio from "cheerio";
import { approvedCanonical, correctedSchema } from "../src/lib/seo-policy.ts";
const base = process.argv[2];
if (!base) throw Error("Provide target URL");
const dir = process.env.SEO_INVENTORY_QA_DIR || "audit/approved-seo-inventory";
fs.mkdirSync(dir, { recursive: true });
const source = JSON.parse(
  fs.readFileSync("audit/seo-review-2026-11-10/results.json"),
);
const restored = JSON.parse(fs.readFileSync("content/secondary-pages.json"));
const items = [
  ...source.map((r) => ({ path: r.path, source: r.source })),
  ...Object.entries(restored).map(([path, p]) => ({
    path,
    source: p.meta,
    restored: true,
  })),
];
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let next = 0;
const rows = [];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (next < items.length) {
      const item = items[next++];
      const errors = [];
      try {
        const response = await fetch(base + item.path, {
          redirect: "manual",
          signal: AbortSignal.timeout(60000),
        });
        const $ = cheerio.load(await response.text());
        if (response.status !== 200) errors.push("HTTP " + response.status);
        if ($("head title").first().text() !== item.source.title)
          errors.push("title");
        if (
          ($("meta[name=description]").attr("content") || "") !==
          item.source.description
        )
          errors.push("description");
        const expected =
          /^(?:\/category\/|\/\d{4}\/\d{2}\/\d{2}$)/.test(item.path) &&
          item.source.robots.includes("noindex")
            ? ""
            : approvedCanonical(item.source.canonical) || "";
        if (($("link[rel=canonical]").attr("href") || "") !== expected)
          errors.push("canonical");
        if ($('meta[name="twitter:card"]').length !== 1)
          errors.push("Twitter card count");
        if (!/noindex/.test(response.headers.get("x-robots-tag") || ""))
          errors.push("preview header");
        if (!/noindex/.test($("meta[name=robots]").attr("content") || ""))
          errors.push("preview meta");
        const schemas = $('script[type="application/ld+json"]')
          .map((i, e) => {
            try {
              return JSON.parse($(e).text());
            } catch {
              errors.push("invalid schema");
              return null;
            }
          })
          .get();
        const stable = (v) =>
          Array.isArray(v)
            ? v.map(stable)
            : v && typeof v === "object"
              ? Object.fromEntries(
                  Object.keys(v)
                    .sort()
                    .map((k) => [k, stable(v[k])]),
                )
              : v;
        if (
          !equal(stable(schemas), stable(correctedSchema(item.source.schema)))
        )
          errors.push("schema");
        if (!item.restored) {
          const headings = $("h1,h2,h3,h4,h5,h6")
            .map((i, e) => ({
              level: e.tagName,
              text: $(e).text().replace(/\s+/g, " ").trim(),
            }))
            .get();
          if (!equal(headings, item.source.headings)) errors.push("headings");
        }
        rows.push({
          path: item.path,
          status: response.status,
          canonical: expected,
          result: errors.length ? "FAIL" : "PASS",
          errors,
        });
      } catch (e) {
        rows.push({ path: item.path, result: "FAIL", errors: [e.message] });
      }
      if (rows.length % 40 === 0)
        console.log("Checked " + rows.length + "/" + items.length);
    }
  }),
);
const xml = await (await fetch(base + "/sitemap.xml")).text();
const sitemap = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const sitemapFailures = [];
next = 0;
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (next < sitemap.length) {
      const url = sitemap[next++];
      const r = await fetch(base + new URL(url).pathname, {
        redirect: "manual",
      });
      if (r.status !== 200) sitemapFailures.push({ url, status: r.status });
    }
  }),
);
const startup = await fetch(base + "/startup-product-development", {
  redirect: "manual",
});
if (startup.status !== 404) throw Error("Deferred startup page changed");
const csv = (rows) =>
  rows
    .map((row) =>
      row
        .map((v) => '"' + String(v ?? "").replaceAll('"', '""') + '"')
        .join(","),
    )
    .join("\n") + "\n";
fs.writeFileSync(
  dir + "/results.json",
  JSON.stringify(
    {
      base,
      checkedAt: new Date().toISOString(),
      rows,
      sitemapCount: sitemap.length,
      sitemapFailures,
      startupStatus: startup.status,
    },
    null,
    2,
  ),
);
fs.writeFileSync(
  "SEO_COMPARISON.csv",
  csv([
    ["path", "http_status", "expected_canonical", "result", "differences"],
    ...rows.map((r) => [
      r.path,
      r.status,
      r.canonical,
      r.result,
      r.errors.join("; "),
    ]),
  ]),
);
fs.writeFileSync(
  "REDIRECT_MAP.csv",
  csv([
    ["source", "destination", "status"],
    ...JSON.parse(fs.readFileSync("content/redirects.json")).map((r) => [
      r.source,
      r.destination,
      r.statusCode,
    ]),
  ]),
);
console.log(
  JSON.stringify(
    {
      pages: rows.length,
      failures: rows.filter((r) => r.errors.length),
      sitemapCount: sitemap.length,
      sitemapFailures,
      startupStatus: startup.status,
    },
    null,
    2,
  ),
);
if (rows.some((r) => r.errors.length) || sitemapFailures.length)
  process.exitCode = 1;
