import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { spawnSync } from "node:child_process";
import wawoff from "wawoff2";
const auditRoot = process.env.MIGRATION_AUDIT_DIR || "audit/full";
const incremental = process.argv.includes("--incremental");
const sources = JSON.parse(fs.readFileSync(auditRoot + "/asset-sources.json"));
const urls = JSON.parse(fs.readFileSync(auditRoot + "/asset-map.json"));
const index = incremental ? JSON.parse(fs.readFileSync("content/media-index.json")) : {};
const report = [];
const failures = [];
let number = incremental ? Math.max(...Object.values(index).map(e=>e.pack)) + 1 : 0,
  offset = 0;
fs.mkdirSync("content/media", { recursive: true });
let fd = null;
let reused = 0;
function sameBytes(key, bytes) {
  const old = index[key];if (!old || old.size !== bytes.length) return false;
  const previous = Buffer.alloc(old.size);const handle=fs.openSync(`content/media/${old.pack}.pack`, "r");
  try { fs.readSync(handle,previous,0,old.size,old.offset); } finally { fs.closeSync(handle); }
  return previous.equals(bytes);
}
const limit = 12 * 1024 * 1024;
function append(key, bytes, type, metadata = {}) {
  if (sameBytes(key,bytes)) return index[key];
  if (offset + bytes.length > limit && offset > 0) {
    if(fd!==null)fs.closeSync(fd);
    number++;
    offset = 0;
    fd = null;
  }
  if(fd===null)fd=fs.openSync("content/media/"+number+".pack",incremental?"wx":"w");
  fs.writeSync(fd, bytes);
  index[key] = { pack: number, offset, size: bytes.length, type, ...metadata };
  offset += bytes.length;
  return index[key];
}
const types = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
  ttf: "font/ttf",
  woff: "font/woff",
  woff2: "font/woff2",
};
const ffmpeg = path.resolve(
  "node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe",
);
const optimized = auditRoot + "/optimized";
fs.mkdirSync(optimized, { recursive: true });
for (let i = 0; i < sources.length; i++) {
  const url = sources[i];
  const hash = crypto.createHash("sha1").update(url).digest("hex");
  const file = auditRoot + "/assets/" + hash + ".bin";
  if (!fs.existsSync(file)) {
    failures.push({ url, status: "missing_original" });
    continue;
  }
  const b = fs.readFileSync(file);
  const local = urls[url];
  if(incremental && sameBytes(local,b)){reused++;continue;}
  const outputHash = crypto.createHash("sha1").update(b).digest("hex");
  const ext = new URL(url).pathname.split(".").pop().toLowerCase();
  let meta = {};
  if (/^(png|jpe?g|webp|avif|svg|gif)$/.test(ext)) {
    try {
      const m = await sharp(b).metadata();
      meta = { width: m.width, height: m.height };
      if (/^(png|jpe?g)$/.test(ext) && b.length > 12000) {
        const dest = optimized + "/" + hash + ".webp";
        if (!fs.existsSync(dest)) {
          const pipeline = sharp(b);
          await pipeline
            .webp({ quality: 90, lossless: m.width < 350 && ext === "png" })
            .toFile(dest);
        }
        const bytes = fs.readFileSync(dest);
        if (bytes.length < b.length * 0.9) {
          const key = "/media/" + outputHash + "-optimized.webp";
          append(key, bytes, "image/webp", meta);
          meta.optimized = key;
          report.push({
            url,
            originalBytes: b.length,
            optimizedBytes: bytes.length,
            kind: "image",
          });
        }
      }
    } catch (e) {
      failures.push({ url, status: "image_metadata_error", error: e.message });
    }
  }
  const entry = append(
    local,
    b,
    types[ext] || "application/octet-stream",
    meta,
  );
  if (ext === "ttf") {
    try {
      const dest = optimized + "/" + hash + ".woff2";
      if (!fs.existsSync(dest))
        fs.writeFileSync(dest, Buffer.from(await wawoff.compress(b)));
      const bytes = fs.readFileSync(dest);
      append(local.replace(/\.ttf$/, ".woff2"), bytes, "font/woff2");
      report.push({
        url,
        originalBytes: b.length,
        optimizedBytes: bytes.length,
        kind: "font",
      });
    } catch (e) {
      failures.push({
        url,
        status: "font_compression_error",
        error: e.message,
      });
    }
  }
  if (ext === "mp4") {
    const poster = optimized + "/" + hash + "-poster.webp";
    if (!fs.existsSync(poster)) {
      const result = spawnSync(
        ffmpeg,
        [
          "-hide_banner",
          "-loglevel",
          "error",
          "-y",
          "-ss",
          "0.1",
          "-i",
          path.resolve(file),
          "-frames:v",
          "1",
          "-vf",
          "scale=640:-1",
          "-c:v",
          "libwebp",
          "-quality",
          "85",
          path.resolve(poster),
        ],
        { encoding: "utf8" },
      );
      if (result.status !== 0)
        failures.push({ url, status: "poster_error", error: result.stderr });
    }
    if (fs.existsSync(poster)) {
      const key = "/media/" + outputHash + "-poster.webp";
      append(key, fs.readFileSync(poster), "image/webp");
      entry.poster = key;
    }
    const mobile = optimized + "/" + hash + "-mobile.mp4";
    if (!fs.existsSync(mobile)) {
      const result = spawnSync(
        ffmpeg,
        [
          "-hide_banner",
          "-loglevel",
          "error",
          "-y",
          "-i",
          path.resolve(file),
          "-vf",
          "scale=720:-2",
          "-c:v",
          "libx264",
          "-preset",
          "fast",
          "-crf",
          "24",
          "-c:a",
          "aac",
          "-b:a",
          "96k",
          "-movflags",
          "+faststart",
          path.resolve(mobile),
        ],
        { encoding: "utf8" },
      );
      if (result.status !== 0)
        failures.push({
          url,
          status: "video_encode_error",
          error: result.stderr,
        });
    }
    if (fs.existsSync(mobile)) {
      const key = "/media/" + outputHash + "-mobile.mp4";
      const bytes = fs.readFileSync(mobile);
      append(key, bytes, "video/mp4");
      entry.mobileVideo = key;
      report.push({
        url,
        originalBytes: b.length,
        optimizedBytes: bytes.length,
        kind: "mobile_video",
      });
    }
  }
  if (i % 250 === 0) console.log("Optimized", i, "of", sources.length);
}
if(fd!==null)fs.closeSync(fd);
fs.writeFileSync("content/media-index.json", JSON.stringify(index));
fs.writeFileSync(
  auditRoot + "/MEDIA_OPTIMIZATION.json",
  JSON.stringify(
    { report, failures, reused, packs: number + 1, assets: Object.keys(index).length },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({
    assets: Object.keys(index).length,
    packs: number + 1,
    failures: failures.length,
    savings: report.reduce((n, r) => n + r.originalBytes - r.optimizedBytes, 0),
  }),
);
