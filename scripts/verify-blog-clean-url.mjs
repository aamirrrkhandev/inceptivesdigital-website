import fs from "node:fs";
import assert from "node:assert/strict";
import { chromium } from "playwright";
const base = process.argv[2];
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1366, height: 950 },
  });
  await page.goto(base + "/blog?blog_cat=fitness-app-development");
  const listing = page.locator("[data-id-blog-listing]");
  await page
    .locator(
      '[data-id-blog-listing][data-category="fitness-app-development"][data-blog-interactions-ready=true][aria-busy=false]',
    )
    .waitFor();
  assert.equal(new URL(page.url()).search, "");
  assert.match(
    await page.locator("meta[name=robots]").getAttribute("content"),
    /noindex/,
  );
  assert.equal(
    await page.locator("link[rel=canonical]").getAttribute("href"),
    "https://inceptivesdigital.com/blog",
  );
  let failed = false;
  await page.route("**/api/blog-listing?**", async (route) => {
    if (
      !failed &&
      new URL(route.request().url()).searchParams.get("blog_search") ===
        "migration-qa-empty-result"
    ) {
      failed = true;
      return route.fulfill({
        status: 503,
        contentType: "application/json",
        body: '{"error":"Unavailable"}',
      });
    }
    return route.continue();
  });
  await page.locator(".blogssearch-inner .e-search-form").evaluate((form) => {
    form.querySelector("input[type=search]").value =
      "migration-qa-empty-result";
    form.requestSubmit();
  });
  await listing.getByRole("alert").waitFor();
  await listing.getByRole("button", { name: "Retry", exact: true }).click();
  await page
    .locator(
      '[data-id-blog-listing][data-search="migration-qa-empty-result"][aria-busy=false]',
    )
    .waitFor();
  assert.equal(await page.locator("[data-blog-grid] article").count(), 0);
  assert.equal(await listing.getByRole("alert").count(), 0);
  const api = await fetch(
    base + "/api/blog-listing?blog_cat=fitness-app-development",
  );
  assert.match(api.headers.get("x-robots-tag"), /noindex/);
  const data = await api.json();
  assert.equal(data.category, "fitness-app-development");
  assert.ok(!JSON.stringify(data.nodes).includes("blog_cat="));
  assert.equal(new URL(page.url()).search, "");
  const results = {
    base,
    legacyUrlCleans: true,
    filteredNoindex: true,
    canonicalBlog: true,
    failedRequestRetry: true,
    apiNoindex: true,
    noCategoryLinks: true,
  };
  fs.writeFileSync(
    "audit/browser/blog-clean-url-seo-verification.json",
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
