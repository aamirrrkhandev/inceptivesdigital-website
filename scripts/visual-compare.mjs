import fs from "node:fs";
import sharp from "sharp";
// Diagnostic images, not an automatic fidelity approval. Videos and marquees vary over time.
for (const kind of ["desktop", "mobile"]) {
  const source = sharp(`audit/source-${kind}.png`),
    target = sharp(`audit/target-${kind}.png`);
  const sm = await source.metadata(),
    tm = await target.metadata();
  const width = Math.min(sm.width, tm.width),
    height = Math.min(sm.height, tm.height);
  const sb = await source
    .extract({ left: 0, top: 0, width, height })
    .removeAlpha()
    .raw()
    .toBuffer();
  const tb = await target
    .extract({ left: 0, top: 0, width, height })
    .removeAlpha()
    .raw()
    .toBuffer();
  const out = Buffer.alloc(sb.length);
  let changed = 0;
  for (let i = 0; i < sb.length; i += 3) {
    const d = Math.max(
      Math.abs(sb[i] - tb[i]),
      Math.abs(sb[i + 1] - tb[i + 1]),
      Math.abs(sb[i + 2] - tb[i + 2]),
    );
    if (d > 30) {
      changed++;
      out[i] = 255;
      out[i + 1] = 0;
      out[i + 2] = 150;
    } else {
      out[i] = tb[i] * 0.4;
      out[i + 1] = tb[i + 1] * 0.4;
      out[i + 2] = tb[i + 2] * 0.4;
    }
  }
  await sharp(out, { raw: { width, height, channels: 3 } })
    .png()
    .toFile(`audit/visual-diff-${kind}.png`);
  const heroHeight = Math.min(kind === "desktop" ? 840 : 810, height);
  const left = await sharp(`audit/source-${kind}.png`)
    .extract({ left: 0, top: 0, width, height: heroHeight })
    .png()
    .toBuffer();
  const right = await sharp(`audit/target-${kind}.png`)
    .extract({ left: 0, top: 0, width, height: heroHeight })
    .png()
    .toBuffer();
  await sharp({
    create: {
      width: width * 2,
      height: heroHeight,
      channels: 3,
      background: "#000",
    },
  })
    .composite([
      { input: left, left: 0, top: 0 },
      { input: right, left: width, top: 0 },
    ])
    .png()
    .toFile(`audit/comparison-${kind}.png`);
  fs.writeFileSync(
    `audit/visual-diff-${kind}.json`,
    JSON.stringify(
      {
        sourceSize: [sm.width, sm.height],
        targetSize: [tm.width, tm.height],
        comparedSize: [width, height],
        rawChangedPixels: changed,
        rawChangedFraction: changed / (width * height),
        verdict:
          "DIAGNOSTIC_ONLY: dynamic videos, source overflow, different section heights and lazy-loaded source assets are unmasked. No fidelity pass claimed.",
      },
      null,
      2,
    ),
  );
}
console.log("Source/target hero comparisons and raw diagnostic diffs saved.");
