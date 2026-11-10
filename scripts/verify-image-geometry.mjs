import fs from "node:fs";
import { chromium } from "playwright";
const base = process.argv[2] || "http://localhost:3100";
const routes = JSON.parse(fs.readFileSync("content/routes.json"));
const jobs = [375, 820, 1366, 1920].flatMap((width) =>
  routes.map((route) => ({ width, path: route.path })),
);
const browser = await chromium.launch();
const results = [];
let cursor = 0;
try {
  await Promise.all(
    [0, 1].map(async () => {
      const page = await browser.newPage({ reducedMotion: "reduce" });
      while (cursor < jobs.length) {
        const job = jobs[cursor++];
        try {
          await page.setViewportSize({ width: job.width, height: 900 });
          await page.goto(base + job.path, {
            waitUntil: "domcontentloaded",
            timeout: 45000,
          });
          const geometry = await page.evaluate(() => {
            const main = document.querySelector("main") || document.body;
            const issues = [];
            let checked = 0;
            for (const image of main.querySelectorAll("img")) {
              const rect = image.getBoundingClientRect();
              if (
                rect.width < 2 ||
                rect.height < 2 ||
                !image.getClientRects().length
              )
                continue;
              const style = getComputedStyle(image);
              checked++;
              const naturalRatio = image.naturalWidth / image.naturalHeight;
              const displayedRatio = rect.width / rect.height;
              // Contain/cover fit inside an authored box without stretching pixels.
              if (
                image.naturalWidth &&
                style.objectFit === "fill" &&
                Math.abs(displayedRatio / naturalRatio - 1) > 0.08
              ) {
                issues.push({
                  type: "stretched",
                  src: image.currentSrc || image.src,
                  fit: style.objectFit,
                  naturalRatio,
                  displayedRatio,
                });
              }
              // Inactive carousel panels intentionally sit outside the viewport.
              if (
                !image.closest('.swiper, [hidden], [aria-hidden="true"]') &&
                (rect.left < -2 || rect.right > innerWidth + 2)
              ) {
                issues.push({
                  type: "outside-viewport",
                  src: image.currentSrc || image.src,
                  left: rect.left,
                  right: rect.right,
                });
              }
            }
            return { checked, issues };
          });
          results.push({ ...job, ...geometry });
        } catch (error) {
          results.push({ ...job, error: error.message });
        }
        if (results.length % 80 === 0)
          console.log(
            JSON.stringify({ completed: results.length, total: jobs.length }),
          );
      }
      await page.close();
    }),
  );
} finally {
  await browser.close();
  fs.writeFileSync(
    "audit/browser/image-geometry-verification.json",
    JSON.stringify({ base, results }, null, 2),
  );
}
console.log(
  JSON.stringify({
    checks: results.length,
    images: results.reduce((sum, row) => sum + (row.checked || 0), 0),
    issues: results.filter((row) => row.error || row.issues?.length),
  }),
);
