import fs from "node:fs";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const base = process.argv[2] || "http://localhost:3100";
const directory =
  process.env.SECONDARY_QA_DIR || "audit/secondary-vercel/qa-local";
fs.mkdirSync(directory, { recursive: true });
const data = JSON.parse(fs.readFileSync("content/secondary-pages.json"));
const browser = await chromium.launch();
const results = [];
try {
  if (!process.env.SECONDARY_SKIP_RENDER)
    for (const [path, model] of Object.entries(data))
      for (const width of [375, 768, 1366, 1920]) {
        const page = await browser.newPage({
          viewport: { width, height: 1000 },
          reducedMotion: "reduce",
        });
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        const response = await page.goto(base + path);
        assert.equal(response.status(), 200, path);
        const main = page.locator(".secondary-service-page");
        await page.locator("[data-secondary-ready=true]").waitFor();
        assert.equal(await page.locator("h1").count(), 1);
        assert.equal(await page.title(), model.meta.title);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          path + " overflow",
        );
        await page.screenshot({
          path: directory + "/" + path.slice(1) + "-" + width + ".png",
        });
        for (const widget of await main
          .locator("[data-secondary-tabs]")
          .all()) {
          const tabs = widget.locator("[data-secondary-tab]");
          for (let i = 0; i < (await tabs.count()); i++) {
            await tabs.nth(i).click();
            const panel = widget.locator('[data-secondary-panel="' + i + '"]');
            await panel.waitFor({ state: "visible" });
            await panel
              .locator("img")
              .evaluateAll((images) =>
                images.forEach((img) => (img.loading = "eager")),
              );
            await page.waitForFunction(
              (el) =>
                [...el.querySelectorAll("img")].every(
                  (img) => img.complete && img.naturalWidth > 0,
                ),
              await panel.elementHandle(),
            );
          }
        }
        const faq = main.locator("[data-secondary-faq]").first();
        assert.ok(await faq.count(), path + " FAQ wiring");
        await faq.click();
        assert.equal(await faq.getAttribute("aria-expanded"), "true");
        assert.equal(
          await faq.evaluate((e) => e.nextElementSibling.hidden),
          false,
        );
        await faq.press("Enter");
        assert.equal(await faq.getAttribute("aria-expanded"), "false");
        assert.equal(errors.length, 0, errors.join("\n"));
        results.push({ path, width, pass: true, tabs: true, faq: true });
        await page.close();
      }
  const context = await browser.newContext({
    viewport: { width: 1366, height: 1000 },
  });
  await context.addInitScript(() => {
    window.turnstile = {
      render(el) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "cf-turnstile-response";
        input.value = "mock-ui-only";
        el.append(input);
        return "test";
      },
      remove() {},
      reset() {},
    };
  });
  await context.route("https://challenges.cloudflare.com/**", (r) => r.abort());
  let submissions = 0;
  await context.route("**/api/forms", async (r) => {
    submissions++;
    const body = r.request().postData();
    assert.match(body, /source_path/);
    assert.match(body, /contact-us/);
    assert.match(body, /developer/);
    assert.match(body, /Duration/);
    await r.fulfill({
      json:
        submissions === 1
          ? { success: false, data: { message: "Isolated failure test" } }
          : { success: true, data: { message: "Isolated success test" } },
      status: submissions === 1 ? 422 : 200,
    });
  });
  context.setDefaultTimeout(20000);
  const page = await context.newPage();
  await page.goto(base + "/staff-augmentation");
  await page.locator("[data-secondary-ready=true]").waitFor();
  const quiz = page.locator("[data-secondary-team-form]");
  await quiz.getByRole("button", { name: "Next", exact: true }).click();
  assert.equal(await quiz.locator("input[type=email]:visible").count(), 0);
  for (const [label, value] of [
    ["Duration", "1-2"],
    ["Number of Specialists", "1"],
    ["Seniority", "Junior"],
    ["Language", "javascript"],
  ])
    await quiz
      .getByLabel("developer " + label, { exact: true })
      .selectOption(value);
  await quiz.getByRole("button", { name: "Next", exact: true }).click();
  await quiz.getByLabel("Full Name", { exact: true }).fill("Isolated QA");
  await quiz.getByLabel("Company", { exact: true }).fill("QA");
  await quiz
    .getByLabel("Work Email", { exact: true })
    .fill("qa@example.invalid");
  await quiz.getByLabel("Phone", { exact: true }).fill("5550101234");
  for (const input of await quiz
    .locator("input[required][type=checkbox]")
    .all())
    await input.check();
  await quiz.locator("[data-contact-verification]").scrollIntoViewIfNeeded();
  await quiz
    .locator('input[name="cf-turnstile-response"]')
    .waitFor({ state: "attached" });
  await quiz.getByRole("button", { name: "Submit Now" }).click();
  await quiz.getByText("Isolated failure test", { exact: true }).waitFor();
  assert.equal(new URL(page.url()).pathname, "/staff-augmentation");
  await quiz.getByRole("button", { name: "Submit Now" }).click();
  await page.waitForURL(base + "/thank-you");
  assert.equal(submissions, 2);
  results.push({
    check:
      "Staff roles, required selections, contact details, failure retains form, success redirects",
    transport: "mocked; no email sent",
    pass: true,
  });
  await context.close();
} finally {
  await browser.close();
  fs.writeFileSync(
    directory + "/results.json",
    JSON.stringify({ base, results }, null, 2),
  );
}
console.log(JSON.stringify({ base, checks: results.length, pass: true }));
