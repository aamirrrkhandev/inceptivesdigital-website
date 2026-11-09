import fs from "node:fs";
import assert from "node:assert/strict";
import * as cheerio from "cheerio";
const base = process.argv[2] || "http://localhost:3100";
const results = [];
const check = async (name, run) => {
  try {
    await run();
    results.push({ name, status: "PASS" });
  } catch (e) {
    results.push({ name, status: "FAIL", detail: e.message });
  }
};
const r = await fetch(base);
const html = await r.text();
const $ = cheerio.load(html);
if (
  new URL(r.url).hostname !== new URL(base).hostname ||
  $("title").text().includes("Login – Vercel")
) {
  console.error(
    "BLOCKED: Vercel authentication returned a login page. No app assertions were run. Use authenticated browser checks or an approved authenticated HTTP session.",
  );
  process.exit(2);
}
const source = JSON.parse(fs.readFileSync("src/content/source.json"));
await check("Homepage status", () => assert.equal(r.status, 200));
await check("Server-rendered title", () =>
  assert.equal($("title").text(), source.meta.title),
);
await check("Description parity", () =>
  assert.equal(
    $("meta[name=description]").attr("content"),
    source.meta.description,
  ),
);
await check("Canonical parity", () =>
  assert.equal($("link[rel=canonical]").attr("href"), source.meta.canonical),
);
await check("Noindex HTML", () =>
  assert.match($("meta[name=robots]").attr("content"), /noindex/),
);
await check("Noindex response header", () =>
  assert.match(r.headers.get("x-robots-tag"), /noindex/),
);
await check("Single H1", () => assert.equal($("h1").length, 1));
await check("No Elementor runtime", () =>
  assert.equal($('script[src*="elementor"],link[href*="elementor"]').length, 0),
);
await check("JSON-LD parses", () => {
  for (const e of $('script[type="application/ld+json"]').toArray())
    JSON.parse($(e).text());
});
await check("No fake page routes", async () =>
  assert.equal(
    (await fetch(base + "/migration-route-that-does-not-exist")).status,
    404,
  ),
);
await check("Robots blocks staging", async () =>
  assert.match(
    await (await fetch(base + "/robots.txt")).text(),
    /Disallow: \/(?:\r?\n|$)/,
  ),
);
const assetUrls = [
  ...new Set([
    ...$("img[src],video source[src],picture source[srcset]")
      .map((i, e) => $(e).attr("src") || $(e).attr("srcset"))
      .get(),
    ...Object.values(JSON.parse(fs.readFileSync("src/content/assets.json"))),
  ]),
].filter((x) => x.startsWith("/assets/"));
for (let i = 0; i < assetUrls.length; i += 8)
  await Promise.all(
    assetUrls.slice(i, i + 8).map((u) =>
      check("Asset " + u, async () => {
        const res = await fetch(base + u);
        assert.equal(res.status, 200);
        assert.ok((await res.arrayBuffer()).byteLength > 0);
      }),
    ),
  );
const visibleSourceBlocks = Object.values(source.sections)
  .flatMap((s) => s.blocks)
  .filter((b) =>
    [
      "heading.default",
      "text-editor.default",
      "theme-post-title.default",
    ].includes(b.type),
  );
const targetText = $("body").text().replace(/\s+/g, " ").trim();
for (const b of visibleSourceBlocks) {
  if (!b.text) continue;
  await check("Content " + b.text.slice(0, 70), () =>
    assert.ok(
      targetText.includes(b.text.replace(/\s+/g, " ").trim()),
      "Exact content not found",
    ),
  );
}
const file =
  "audit/http-" + (base.includes("localhost") ? "local" : "staging") + ".json";
fs.writeFileSync(file, JSON.stringify({ base, results }, null, 2));
console.log(
  JSON.stringify(
    {
      checks: results.length,
      passed: results.filter((x) => x.status === "PASS").length,
      failed: results.filter((x) => x.status === "FAIL"),
    },
    null,
    2,
  ),
);
if (results.some((x) => x.status === "FAIL")) process.exitCode = 1;
