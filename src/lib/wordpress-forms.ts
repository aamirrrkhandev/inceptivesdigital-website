import "server-only";
import https from "node:https";
import { Resolver } from "node:dns/promises";
import { lookup as systemLookup } from "node:dns";
import { brotliDecompressSync, gunzipSync, inflateSync } from "node:zlib";
import blogSource from "../../content/wordpress-blog-source.json";
import formContracts from "../../content/form-contracts.json";
const sourceAgent = new https.Agent({ keepAlive: true, maxSockets: 16 });

export async function readWordPressBlogPage(path: string) {
  if (!/^\/(?:wp-json\/wp\/v2\/(?:posts|categories|users)(?:\?|$)|(?:blog|press-release|category|author)(?:\/|\?|$))/.test(path))
    throw new Error("Invalid blog source path");
  const url = new URL(path, blogSource.origin);
  // Bust upstream page/API caches without changing the public URL or canonical.
  url.searchParams.set("_migration_fresh", String(Date.now()));
  return sourceRequest(url.href);
}
// Keep TLS/SNI verification on the hostname, even when the local OS resolver fails.
async function sourceRequest(url: string) {
  const resolver = new Resolver();
  resolver.setServers(["1.1.1.1", "8.8.8.8"]);
  return new Promise<string>((resolve, reject) => {
    const request = https.request(
      url,
      {
        method: "GET",
        agent: sourceAgent,
        headers: { "Cache-Control": "no-cache, no-store", Pragma: "no-cache", "Accept-Encoding": "br, gzip, deflate" },
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
        response.on("end", () => {
          if (response.statusCode !== 200) {
            reject(Object.assign(new Error("Blog source unavailable"), { statusCode: response.statusCode }));
            return;
          }
          try {
            const bytes = Buffer.concat(chunks), encoding = response.headers["content-encoding"];
            const limit = { maxOutputLength: 10_000_000 };
            const decoded = encoding === "br" ? brotliDecompressSync(bytes, limit) : encoding === "gzip" ? gunzipSync(bytes, limit) : encoding === "deflate" ? inflateSync(bytes, limit) : bytes;
            resolve(decoded.toString("utf8"));
          } catch { reject(new Error("Invalid compressed blog response")); }
        });
        response.on("error", reject);
      },
    );
    request.on("timeout", () =>
      request.destroy(new Error("Blog source timed out")),
    );
    request.on("error", reject);
    request.end();
  });
}

export async function loadFormContract(path: string, formId: string) {
  type Contract = { fields: { name: string; type: string; required: boolean; value: string }[] };
  return (formContracts as Record<string, Record<string, Contract>>)[path]?.[formId] || null;
}

