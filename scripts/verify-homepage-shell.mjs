import fs from "node:fs";
import assert from "node:assert/strict";
import { chromium } from "playwright";
const base = process.argv[2];
const inject = process.env.INJECT_HOME_CSS === "1";
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [
    320, 375, 480, 600, 767, 768, 820, 880, 1024, 1025, 1100, 1280, 1366, 1440,
    1920, 2560,
  ]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    await page.goto(base + "/", { waitUntil: "domcontentloaded" });
    if (inject)
      await page.addStyleTag({
        content: fs.readFileSync("src/app/homepage-responsive.css", "utf8"),
      });
    await page.locator("[data-interactions-ready=true]").waitFor();
    await page.evaluate(() => document.fonts.ready);
    const state = await page.evaluate(() => {
      const visible = (el) => {
        const r = el.getBoundingClientRect();
        return (
          r.width > 1 &&
          r.height > 1 &&
          getComputedStyle(el).visibility !== "hidden"
        );
      };
      const box = (el) => ({
        id: el.dataset.id,
        rect: el.getBoundingClientRect().toJSON(),
      });
      const children = (selector) =>
        [...document.querySelector(selector).children].filter(visible).map(box);
      return {
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        logo: document
          .querySelector('[data-id="4eeda28c"] img')
          .getBoundingClientRect().width,
        header: children('[data-id="29c3b1be"]'),
        footerColumns: children('footer [data-id="8aa487c"]'),
        locations: children('footer [data-id="18ca075"]'),
        containers: [
          ...document.querySelectorAll(
            ".migrated-14263 > .e-con-boxed > .e-con-inner,footer > .e-con-boxed > .e-con-inner",
          ),
        ]
          .filter(visible)
          .map(box),
      };
    });
    assert.equal(state.overflow, false, `Overflow ${width}`);
    assert.ok(state.logo >= 100, `Unreadable header logo ${width}`);
    for (const group of ["header", "footerColumns", "locations"]) {
      for (let i = 0; i < state[group].length; i++) {
        const a = state[group][i].rect;
        assert.ok(
          a.left >= -1 && a.right <= width + 1,
          `${group} outside viewport ${width}`,
        );
        for (const b of state[group].slice(i + 1).map((item) => item.rect))
          assert.ok(
            Math.min(a.right, b.right) - Math.max(a.left, b.left) <= 1 ||
              Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) <= 1,
            `${group} overlap ${width}`,
          );
      }
    }
    for (const { rect } of state.containers)
      assert.ok(
        rect.width <= 1601 && rect.left >= -1 && rect.right <= width + 1,
        `Container boundary ${width}`,
      );
    assert.equal(state.locations.length, 9);
    const social = await page
      .locator("footer .migrated-social-icon")
      .evaluateAll((icons) =>
        icons.map((icon) => icon.getBoundingClientRect().toJSON()),
      );
    assert.equal(social.length, 3);
    for (let index = 0; index < social.length; index++) {
      assert.ok(social[index].width >= 44 && social[index].height >= 44);
      if (index)
        assert.ok(
          social[index].left - social[index - 1].right >= 11,
          `Social icon gap ${width}`,
        );
    }
    if ([1025, 1280, 1920].includes(width)) {
      for (const name of ["Services", "Industries", "Locations", "Company"]) {
        const link = page
          .locator(".header-containers .ekit-menu-nav-link")
          .filter({ hasText: new RegExp("^" + name + "$") })
          .first();
        await link.hover();
        const panel = page.locator(
          "#" + (await link.getAttribute("aria-controls")),
        );
        await panel.waitFor({ state: "visible" });
        const rect = await panel.evaluate((el) =>
          el.getBoundingClientRect().toJSON(),
        );
        assert.ok(
          rect.left >= -1 && rect.right <= width + 1,
          `Desktop submenu boundary ${name} ${width}`,
        );
      }
      await page.mouse.move(0, 0);
    }
    if ([320, 820, 1024].includes(width)) {
      await page.locator(".sitekit-menu-hamburger:visible").click();
      await page.locator(".sitekit-menu-container.active").waitFor();
      await page.locator(".sitekit-menu-close:visible").click();
      await page.waitForFunction(
        () => !document.querySelector(".sitekit-menu-container.active"),
      );
      assert.equal(
        await page.evaluate(() =>
          document.documentElement.classList.contains(
            "migration-mobile-menu-open",
          ),
        ),
        false,
      );
    }
    if ([320, 820, 1280, 1920].includes(width)) {
      await page.screenshot({
        path: `audit/browser/home-shell-header-${width}.png`,
      });
      const nav = page.locator('footer [data-id="8aa487c"]');
      await nav.scrollIntoViewIfNeeded();
      await nav
        .locator("img")
        .evaluateAll((images) =>
          Promise.all(images.map((image) => image.decode().catch(() => {}))),
        );
      await nav.screenshot({
        path: `audit/browser/home-shell-footer-${width}.png`,
      });
    }
    results.push({ width, ...state, pass: true });
    await page.close();
  }
} finally {
  await browser.close();
  fs.writeFileSync(
    "audit/browser/homepage-shell-verification.json",
    JSON.stringify({ base, injected: inject, results }, null, 2),
  );
}
console.log(JSON.stringify({ base, checks: results.length, pass: true }));
