import fs from "node:fs";
import assert from "node:assert/strict";
import * as cheerio from "cheerio";
import { sourceFetch } from "./source-fetch.mjs";
const base = process.argv[2] || "http://localhost:3100";
const output = process.env.SEO_QA_DIR || "audit/approved-seo-local";
fs.mkdirSync(output, { recursive: true });
const evidence = [];
async function page(path, source = false) {
  const response = await (source ? sourceFetch : fetch)(
    (source ? (/^\/(?:blog|press-release|category|author)(?:\/|$)/.test(path) ? "https://nextincep.wpenginepowered.com" : "https://inceptivesdigital.com") : base) + path,
    { redirect: "manual" },
  );
  return { response, $: cheerio.load(await response.text()) };
}
for (const path of [
  "/",
  "/blog",
  "/author/inceptivesdigital",
  "/category/mobile-game-development",
  "/blog/mobile-app-monetization-strategies",
  "/thank-you",
  "/press-release/rightfirms-top-artificial-intelligence-company-2026",
]) {
  const { response, $ } = await page(path);
  assert.equal(response.status, 200, path);
  assert.equal(
    $('meta[name="twitter:card"]').length,
    1,
    path + " Twitter duplication",
  );
  assert.match(response.headers.get("x-robots-tag"), /noindex/);
  if (path.startsWith("/author/"))
    assert.equal($('meta[property="og:type"]').attr("content"), "profile");
  const source = await page(path, true);
  assert.equal(
    $("head title").text(),
    source.$("head title").text(),
    path + " title",
  );
  assert.equal(
    $("meta[name=description]").attr("content") || "",
    source.$("meta[name=description]").attr("content") || "",
    path + " description",
  );
  if (
    path.startsWith("/author/") ||
    path.startsWith("/category/") ||
    path.includes("monetization")
  ) {
    const headings = (d) =>
      d("h1,h2,h3,h4,h5,h6")
        .map((i, e) => ({
          level: e.tagName,
          text: d(e).text().replace(/\s+/g, " ").trim(),
        }))
        .get();
    assert.deepEqual(headings($), headings(source.$), path + " fresh headings");
  }
  evidence.push({
    path,
    status: response.status,
    title: $("head title").text(),
    canonical: $("link[rel=canonical]").attr("href"),
    schedule: $("h2")
      .map((i, e) => $(e).text())
      .get()
      .filter((t) => t.includes("Schedule")),
    pass: true,
  });
}
for (const item of JSON.parse(fs.readFileSync("content/redirects.json"))) {
  const response = await fetch(base + item.source, { redirect: "manual" });
  assert.equal(response.status, 301, item.source);
  const destination = new URL(response.headers.get("location"), base);
  assert.equal(destination.pathname, item.destination);
  const final = await fetch(destination, { redirect: "manual" });
  assert.equal(final.status, 200, item.source + " one-hop target");
}
const xml = await (await fetch(base + "/sitemap.xml")).text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
assert.ok(urls.length >= 224);
assert.ok(
  !urls.includes(
    "https://inceptivesdigital.com/blog/rightfirms-top-artificial-intelligence-company-2026",
  ),
);
assert.ok(
  urls.includes(
    "https://inceptivesdigital.com/press-release/rightfirms-top-artificial-intelligence-company-2026",
  ),
);
assert.equal(new Set(urls.map((u) => u.replace(/\/$/, ""))).size, urls.length);
const robots = await (await fetch(base + "/robots.txt")).text();
assert.match(robots, /Disallow: \//);
const missing = await fetch(base + "/seo-approved-missing-page", {
  redirect: "manual",
});
assert.equal(missing.status, 404);
fs.writeFileSync(
  output + "/verification.json",
  JSON.stringify(
    {
      base,
      evidence,
      redirects: JSON.parse(fs.readFileSync("content/redirects.json")).length,
      sitemapURLs: urls.length,
      robots,
      missingStatus: missing.status,
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({
    base,
    pages: evidence.length,
    redirects: JSON.parse(fs.readFileSync("content/redirects.json")).length,
    sitemapURLs: urls.length,
    pass: true,
  }),
);
