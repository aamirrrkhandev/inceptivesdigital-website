import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
const map = JSON.parse(fs.readFileSync("src/content/assets.json"));
const grouped = {};
for (const [u, l] of Object.entries(map)) (grouped[l] ??= []).push(u);
for (const [local, urls] of Object.entries(grouped)) {
  if (urls.length < 2) continue;
  for (const url of urls) {
    const destination = local.replace(
      "/assets/",
      "/assets/" +
        new URL(url).pathname.split("/").slice(-3, -1).join("-") +
        "-",
    );
    const r = await fetch(url);
    if (!r.ok) throw Error(url);
    fs.writeFileSync(
      "public" + destination,
      Buffer.from(await r.arrayBuffer()),
    );
    map[url] = destination;
  }
}
fs.writeFileSync("src/content/assets.json", JSON.stringify(map, null, 2));
const dimensions = {};
const manifest = [];
for (const [url, local] of Object.entries(map)) {
  const b = fs.readFileSync("public" + local);
  manifest.push({
    source_url: url,
    local_path: local,
    bytes: b.length,
    sha256: crypto.createHash("sha256").update(b).digest("hex"),
  });
  if (!/\.(png|jpe?g|webp|avif|svg)$/i.test(local)) continue;
  try {
    const m = await sharp(b).metadata();
    const item = { width: m.width, height: m.height, srcSet: "" };
    if (m.width > 400 && !local.endsWith(".svg")) {
      const versions = [];
      for (const width of [480, 960, 1440].filter((w) => w < m.width)) {
        const dest = local.replace(/\.[^.]+$/, `-${width}.webp`);
        await sharp(b)
          .resize({ width })
          .webp({ quality: 88 })
          .toFile("public" + dest);
        versions.push(`${dest} ${width}w`);
      }
      versions.push(`${local} ${m.width}w`);
      item.srcSet = versions.join(", ");
    }
    dimensions[local] = item;
  } catch (e) {
    console.log(local, e.message);
  }
}
fs.writeFileSync("src/content/dimensions.json", JSON.stringify(dimensions));
fs.writeFileSync(
  "audit/ASSET_MANIFEST.json",
  JSON.stringify(manifest, null, 2),
);
console.log(
  "Manifest",
  manifest.length,
  "dimensioned images",
  Object.keys(dimensions).length,
);
