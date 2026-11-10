import fs from "node:fs";
import assert from "node:assert/strict";
import { chromium } from "playwright";
const base = process.argv[2];
const browser = await chromium.launch();
const results = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1366, height: 950 },
    reducedMotion: "reduce",
  });
  await page.goto(base + "/blog", { waitUntil: "domcontentloaded" });
  await page.locator("[data-blog-interactions-ready=true]").waitFor();
  const nonce = await page.evaluate(
    () => (window.__blogDocumentNonce = crypto.randomUUID()),
  );
  let documents = 0;
  page.on("request", (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      documents++;
  });
  const ready = async (category) => {
    await page
      .locator(
        `[data-id-blog-listing][data-category="${category}"][data-blog-interactions-ready=true]`,
      )
      .waitFor();
    await page.locator("[data-blog-grid][aria-busy=false]").waitFor();
    assert.equal(
      await page.evaluate(() => window.__blogDocumentNonce),
      nonce,
      "Document was reloaded",
    );
    assert.equal(documents, 0, "A top-level document request occurred");
  };
  const categories = await page
    .locator(".btn-tabs")
    .evaluateAll((tabs) =>
      tabs.map((tab) => tab.dataset.filter).filter((value) => value !== "all"),
    );
  for (const category of categories) {
    const tab = page.locator(`.btn-tabs[data-filter="${category}"]`);
    await tab.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => scrollY);
    await tab.click();
    await page.waitForURL(
      (url) => url.searchParams.get("blog_cat") === category,
      { waitUntil: "domcontentloaded" },
    );
    await ready(category);
    assert.equal(await tab.getAttribute("aria-pressed"), "true");
    const values = await page
      .locator("[data-blog-grid] article")
      .evaluateAll((cards) => cards.map((card) => card.dataset.category));
    assert.ok(values.every((value) => value === category));
    assert.ok(
      Math.abs((await page.evaluate(() => scrollY)) - before) < 5,
      "Tab change jumped scroll position",
    );
    results.push({
      category,
      cards: values.length,
      noReload: true,
      scrollPreserved: true,
    });
  }
  await page.locator('.btn-tabs[data-filter="all"]').click();
  await ready("all");
  const firstTitle = await page
    .locator("[data-blog-grid] .post-title")
    .first()
    .innerText();
  await page
    .locator(".id-blog-pagination a")
    .filter({ hasText: /^2$/ })
    .click();
  await page.waitForURL(
    (url) => url.searchParams.get("pagination_page") === "2",
    { waitUntil: "domcontentloaded" },
  );
  await ready("all");
  assert.notEqual(
    await page.locator("[data-blog-grid] .post-title").first().innerText(),
    firstTitle,
  );
  await page.goBack({ waitUntil: "domcontentloaded" });
  await ready("all");
  assert.equal(
    await page.locator("[data-blog-grid] .post-title").first().innerText(),
    firstTitle,
  );
  results.push({ paginationAndBackNoReload: true });
  for (const [width, view, count] of [
    [375, "mobile", 6],
    [820, "tablet", 9],
  ]) {
    await page.setViewportSize({ width, height: 950 });
    await page
      .locator(
        `[data-id-blog-listing][data-view="${view}"][data-blog-interactions-ready=true]`,
      )
      .waitFor();
    await ready("all");
    assert.equal(await page.locator("[data-blog-grid] article").count(), count);
    await page.locator('.btn-tabs[data-filter="ios-app-development"]').click();
    await ready("ios-app-development");
    results.push({ width, view, categoryNoReload: true });
    await page.locator('.btn-tabs[data-filter="all"]').click();
    await ready("all");
  }
  assert.equal(documents, 0);
} finally {
  await browser.close();
  fs.writeFileSync(
    "audit/browser/blog-client-tabs-verification.json",
    JSON.stringify({ base, results }, null, 2),
  );
}
console.log(JSON.stringify({ base, checks: results.length, results }));
