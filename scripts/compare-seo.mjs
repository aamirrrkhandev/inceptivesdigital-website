import fs from "node:fs";
import * as cheerio from "cheerio";
const base = process.argv[2] || "http://localhost:3100";
const source = cheerio.load(fs.readFileSync("audit/raw/home.html", "utf8"));
const response = await fetch(base);
if (!response.ok) throw Error("Target returned " + response.status);
const target = cheerio.load(await response.text());
const rows = [];
const add = (field, a, b, expected = false) => {
  const equivalent =
    field === "og:url" ? new URL(a).href === new URL(b).href : a === b;
  rows.push([
    base,
    field,
    a,
    b,
    equivalent
      ? "MATCH"
      : expected
        ? "EXPECTED_STAGING_DIFFERENCE"
        : "DIFFERENCE",
  ]);
};
add("title", source("title").text(), target("title").text());
add(
  "canonical",
  source("link[rel=canonical]").attr("href"),
  target("link[rel=canonical]").attr("href"),
);
for (const e of source(
  'meta[name=description],meta[name=robots],meta[name^="twitter:"],meta[name=google-site-verification]',
).toArray()) {
  const name = source(e).attr("name");
  add(
    name,
    source(e).attr("content"),
    target(`meta[name="${name}"]`).attr("content"),
    name === "robots",
  );
}
for (const e of source('meta[property^="og:"]').toArray()) {
  const name = source(e).attr("property");
  add(
    name,
    source(e).attr("content"),
    target(`meta[property="${name}"]`).attr("content"),
  );
}
const quote = (x) => '"' + String(x ?? "").replaceAll('"', '""') + '"';
fs.writeFileSync(
  "SEO_COMPARISON.csv",
  [
    ["target_environment", "field", "source_value", "target_value", "result"],
    ...rows,
  ]
    .map((r) => r.map(quote).join(","))
    .join("\n") + "\n",
);
console.log(
  JSON.stringify(
    {
      fields: rows.length,
      differences: rows.filter((r) => r.at(-1) === "DIFFERENCE"),
    },
    null,
    2,
  ),
);
