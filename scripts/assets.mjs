import fs from "node:fs";
import * as cheerio from "cheerio";
const $ = cheerio.load(fs.readFileSync("audit/raw/home.html", "utf8"));
fs.mkdirSync("audit/raw/css", { recursive: true });
let allCSS = "";
for (const e of $('link[rel="stylesheet"]').toArray()) {
  const u = $(e).attr("href");
  if (!u.startsWith("https://inceptivesdigital.com")) continue;
  const r = await fetch(u);
  const text = await r.text();
  allCSS += "\n" + text;
  fs.writeFileSync("audit/raw/css/" + $(e).attr("id") + ".css", text);
}
fs.writeFileSync("audit/raw/all.css", allCSS);
const urls = new Set();
for (const m of allCSS.matchAll(/url\(['"]?(https:[^\s'"\)]+)['"]?\)/g))
  urls.add(m[1]);
for (const e of $("[data-settings]").toArray()) {
  const t = $(e).attr("data-settings");
  for (const m of t.matchAll(/https?:[^"\s]+\.(?:mp4|webm|webp|png|jpg|avif)/g))
    urls.add(m[0].replaceAll("\\/", "/"));
}
for (const e of $("video,source").toArray()) {
  const u = $(e).attr("src");
  if (u) urls.add(u);
}
const map = JSON.parse(fs.readFileSync("src/content/assets.json"));
for (const u of urls) {
  if (map[u] || !u.startsWith("https://inceptivesdigital.com")) continue;
  try {
    const r = await fetch(u);
    if (!r.ok) throw Error(r.status);
    const b = Buffer.from(await r.arrayBuffer());
    const filename = new URL(u).pathname.split("/").pop();
    map[u] = "/assets/" + filename;
    fs.writeFileSync("public" + map[u], b);
    console.log(filename, b.length);
  } catch (e) {
    console.log("failed", u, e.message);
  }
}
fs.writeFileSync("src/content/assets.json", JSON.stringify(map, null, 2));
console.log("All assets", Object.keys(map).length);
