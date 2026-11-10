import fs from "node:fs";
import assert from "node:assert/strict";
import { chromium } from "playwright";
const base = process.argv[2];
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [320, 375, 640, 820, 1024, 1366, 1920]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    // Deterministic embed transport; actual third-party rendering is checked separately.
    await page.route("https://calendly.com/**", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: '<html style="background:#111;color:white"><body>Calendar transport test</body></html>',
      }),
    );
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.locator("[data-interactions-ready=true]").waitFor();
    const section = page.locator("#schedule-meeting");
    assert.equal(await section.count(), 1);
    assert.equal(
      await section.locator("iframe").count(),
      0,
      "Calendar must not load above the fold",
    );
    await section.scrollIntoViewIfNeeded();
    const frame = section.locator("iframe");
    await frame.waitFor();
    const state = await section.evaluate((el) => {
      const left = el
        .querySelector(".id-schedule-left")
        .getBoundingClientRect();
      const right = el
        .querySelector(".id-schedule-right")
        .getBoundingClientRect();
      const iframe = el.querySelector("iframe").getBoundingClientRect();
      return {
        background: getComputedStyle(el).backgroundColor,
        left: left.toJSON(),
        right: right.toJSON(),
        iframe: iframe.toJSON(),
        source: el.querySelector("iframe").src,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
    assert.equal(state.background, "rgb(0, 0, 0)");
    assert.equal(state.overflow, false);
    assert.ok(state.iframe.width > 250 && state.iframe.height >= 580);
    assert.ok(state.iframe.left >= 0 && state.iframe.right <= width + 1);
    assert.match(state.source, /background_color=111111/);
    assert.match(state.source, /text_color=ffffff/);
    if (width < 1024) assert.ok(state.right.top >= state.left.bottom - 1);
    else assert.ok(Math.abs(state.right.top - state.left.top) < 2);
    assert.equal(await section.locator(".id-schedule-feature-item").count(), 3);
    results.push({ width, ...state, pass: true });
    await page.close();
  }
  for (const width of (
    process.env.SCHEDULE_ACTUAL_WIDTHS || "320,375,640,820,1024,1366,1920"
  )
    .split(",")
    .map(Number)) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.locator("#schedule-meeting").scrollIntoViewIfNeeded();
    const frame = page.frameLocator("#schedule-meeting iframe");
    const result = { actualThirdParty: true, width };
    try {
      await frame
        .getByRole("heading", { name: /Select a (?:Day|Date)/i })
        .waitFor({ timeout: 45000 });
      const decline = frame.getByRole("button", {
        name: "Decline",
        exact: true,
      });
      try {
        await decline.waitFor({ timeout: 4000 });
        await decline.click();
        await decline.waitFor({ state: "hidden", timeout: 5000 });
      } catch {}
      const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        new Date(),
      );
      const dates = frame.getByRole("button", { name: new RegExp(month) });
      await dates.first().waitFor({ state: "visible", timeout: 15000 });
      assert.ok((await dates.count()) >= 28, "Real calendar date grid missing");
      await dates.first().scrollIntoViewIfNeeded();
      result.calendarDates = await dates.count();
      result.loaded = true;
      result.headings = await frame.locator("h1,h2,h3").allTextContents();
    } catch (error) {
      result.loaded = false;
      result.error = error.message;
    }
    if ([375, 820, 1366].includes(width))
      await page
        .locator("#schedule-meeting")
        .screenshot({ path: `audit/browser/schedule-meeting-${width}.png` });
    results.push(result);
    await page.close();
  }
  const fallback = await browser.newPage();
  await fallback.addInitScript(() => {
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });
  await fallback.route("https://calendly.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "Calendar fallback transport test",
    }),
  );
  await fallback.goto(base, { waitUntil: "domcontentloaded" });
  const load = fallback.getByRole("button", {
    name: "Load Interactive Calendar",
    exact: true,
  });
  await load.focus();
  await load.press("Enter");
  await fallback.locator("#schedule-meeting iframe").waitFor();
  results.push({ keyboardLoadFallback: true, pass: true });
  await fallback.close();
} finally {
  await browser.close();
  fs.writeFileSync(
    "audit/browser/schedule-meeting-verification.json",
    JSON.stringify({ base, results }, null, 2),
  );
}
console.log(JSON.stringify({ base, results }));
