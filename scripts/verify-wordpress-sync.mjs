import fs from "node:fs";
import assert from "node:assert/strict";
import * as cheerio from "cheerio";
import { chromium } from "playwright";
import { sourceFetch } from "./source-fetch.mjs";
const base = process.argv[2] || "http://localhost:3103";
const results = [];
const posts = await (
  await sourceFetch(
    "https://inceptivesdigital.com/wp-json/wp/v2/posts?per_page=1&_embed=1",
  )
).json();
const latest = posts[0];
const path = new URL(latest.link).pathname;
const response = await fetch(base + path);
const html = await response.text();
const $ = cheerio.load(html);
assert.equal(response.status, 200);
assert.equal($("head > title").text(), latest.yoast_head_json.title);
assert.equal(
  $("link[rel=canonical]").attr("href"),
  latest.yoast_head_json.canonical,
);
assert.match($("meta[name=robots]").attr("content"), /noindex/);
assert.ok(
  $(".id-article-body")
    .text()
    .includes(
      cheerio.load(latest.content.rendered).text().trim().slice(0, 150),
    ),
);
const schema = $('script[type="application/ld+json"]')
  .map((_, el) => JSON.parse($(el).text()))
  .get();
assert.deepEqual(schema, [latest.yoast_head_json.schema]);
results.push({
  latestPost: path,
  status: response.status,
  titleCanonicalContentSchema: true,
});
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
assert.ok(sitemap.includes(latest.yoast_head_json.canonical));
assert.equal(
  (await fetch(base + "/blog/migration-qa-unpublished-nonexistent")).status,
  404,
);
results.push({ sitemapIncludesLatest: true, missingPost404: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1366, height: 900 },
  });
  await page.goto(base + "/blog");
  await page.locator('[data-id-blog-listing][data-view="desktop"]').waitFor();
  const grid = page.locator("[data-blog-grid]");
  assert.equal(await grid.locator("article").count(), 15);
  assert.ok(await grid.locator(`a[href="${path}"]`).count());
  const categories = await page
    .locator(".btn-tabs")
    .evaluateAll((tabs) =>
      tabs.map((tab) => ({
        slug: tab.dataset.filter,
        title: tab.textContent.trim(),
      })),
    );
  for (const category of categories.filter(
    (category) => category.slug !== "all",
  )) {
    await page.locator("[data-blog-interactions-ready=true]").waitFor();
    await page.locator(`.btn-tabs[data-filter="${category.slug}"]`).click();
    await page.waitForURL(
      (url) => url.searchParams.get("blog_cat") === category.slug,
      { waitUntil: "domcontentloaded" },
    );
    await page
      .locator(`[data-id-blog-listing][data-category="${category.slug}"]`)
      .waitFor();
    assert.equal(
      await page
        .locator(`.btn-tabs[data-filter="${category.slug}"]`)
        .getAttribute("aria-pressed"),
      "true",
    );
    const cardCategories = await grid
      .locator("article")
      .evaluateAll((cards) => cards.map((card) => card.dataset.category));
    assert.ok(cardCategories.every((slug) => slug === category.slug));
    results.push({
      category: category.slug,
      cards: cardCategories.length,
      pass: true,
    });
  }
  await page.locator("[data-blog-interactions-ready=true]").waitFor();
  // The source intentionally hides this search widget at every breakpoint.
  await page
    .locator(".blogssearch-inner .e-search-form")
    .evaluate((form, query) => {
      form.querySelector("input[type=search]").value = query;
      form.requestSubmit();
    }, latest.slug);
  await page.waitForURL(
    (url) =>
      url.searchParams.get("blog_search") === latest.slug &&
      !url.searchParams.has("blog_cat"),
  );
  await page.locator('[data-id-blog-listing][data-category="all"]').waitFor();
  assert.ok(await grid.locator(`a[href="${path}"]`).count());
  results.push({ searchFindsLatestAndClearsCategory: true });
  await page.goto(base + "/blog?pagination_page=2&blog_view=desktop");
  await page
    .locator('.id-page-number[aria-current="page"]')
    .filter({ hasText: "2" })
    .waitFor();
  assert.equal(await grid.locator("article").count(), 15);
  results.push({ secondPage: true });
  await page.close();
  for (const [width, view, count] of [
    [375, "mobile", 6],
    [820, "tablet", 9],
  ]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(base + "/blog");
    await page.locator(`[data-id-blog-listing][data-view="${view}"]`).waitFor();
    assert.equal(await page.locator("[data-blog-grid] article").count(), count);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
      false,
    );
    results.push({ width, view, count, pass: true });
    await page.screenshot({ path: `audit/browser/blog-sync-${width}.png` });
    await page.close();
  }
} finally {
  await browser.close();
  fs.writeFileSync(
    "audit/browser/wordpress-sync-verification.json",
    JSON.stringify({ base, results }, null, 2),
  );
}
console.log(JSON.stringify({ base, results }));
