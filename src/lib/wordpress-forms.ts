import "server-only";
import https from "node:https";
import { Resolver } from "node:dns/promises";
import { lookup as systemLookup } from "node:dns";
import blogSource from "../../content/wordpress-blog-source.json";
import formContracts from "../../content/form-contracts.json";

export async function readWordPressBlogPage(path: string) {
  if (!/^\/(?:wp-json\/wp\/v2\/(?:posts|categories|users)(?:\?|$)|(?:blog|press-release|category|author)(?:\/|\?|$))/.test(path))
    throw new Error("Invalid blog source path");
  return sourceRequest(blogSource.origin + path);
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
    request.end();
  });
}

export async function loadFormContract(path: string, formId: string) {
  type Contract = { fields: { name: string; type: string; required: boolean; value: string }[] };
  return (formContracts as Record<string, Record<string, Contract>>)[path]?.[formId] || null;
}

