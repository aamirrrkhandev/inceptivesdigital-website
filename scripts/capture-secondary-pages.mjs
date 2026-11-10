import fs from "node:fs";
import { chromium } from "@playwright/test";
const pages = process.argv[2]
  ? [process.argv[2]]
  : [
      "web-development",
      "staff-augmentation",
      "iot-development",
      "virtual-reality-development",
      "ar-app-development",
    ];
const browser = await chromium.launch();
try {
  for (const slug of pages) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    await page.goto("https://inceptives.vercel.app/" + slug, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(1800);
    if (slug === "staff-augmentation") {
      const script = await page.locator('script[src*="/app/staff-augmentation/page-"]').first().getAttribute("src");
      if (!script) throw new Error("Original staff questionnaire script missing");
      const response = await fetch(new URL(script, "https://inceptives.vercel.app"));
      if (!response.ok) throw new Error("Original staff questionnaire script unavailable");
      fs.writeFileSync("audit/secondary-vercel/staff-augmentation-page.js", await response.text());
    }
    const groups = await page.evaluate(() =>
      [...document.querySelectorAll("button")]
        .filter((b) => b.textContent.trim() === "Platforms")
        .map((b, i) => {
          const root = b.parentElement.parentElement;
          root.dataset.secondaryTabs = "tabs-" + i;
          const panel = root.children[1];
          panel.dataset.secondaryTabPanel = "true";
          return {
            id: "tabs-" + i,
            labels: [...b.parentElement.children]
              .filter((e) => e.tagName === "BUTTON")
              .map((e) => e.textContent.trim()),
          };
        }),
    );
    const variants = {};
    if (slug === "staff-augmentation") {
      const labels = await page.evaluate(() => {
        const first = [...document.querySelectorAll("span")].find(
          (e) => e.textContent.trim() === "01.",
        );
        if (!first) return [];
        const control = first.parentElement.parentElement;
        const row = control.parentElement;
        const widget = row.parentElement.parentElement;
        widget.dataset.secondaryTabs = "process-0";
        widget.dataset.secondaryProcess = "true";
        widget.lastElementChild.dataset.secondaryTabPanel = "true";
        return [...row.children].map((el, i) => {
          el.dataset.secondaryTab = String(i);
          return el.textContent.trim();
        });
      });
      variants["process-0"] = [];
      for (let i = 0; i < labels.length; i++) {
        const widget = page.locator('[data-secondary-tabs="process-0"]');
        await widget.locator('[data-secondary-tab="' + i + '"]').click();
        await page.waitForTimeout(450);
        variants["process-0"].push({
          label: labels[i],
          html: await widget.locator("[data-secondary-tab-panel]").innerHTML(),
        });
      }
      await page
        .locator('[data-secondary-tabs="process-0"] [data-secondary-tab="0"]')
        .click();
    }
    for (const group of groups) {
      variants[group.id] = [];
      for (const label of group.labels) {
        const root = page.locator('[data-secondary-tabs="' + group.id + '"]');
        await root.getByRole("button", { name: label, exact: true }).click();
        await page.waitForTimeout(450);
        variants[group.id].push({
          label,
          html: await root.locator("[data-secondary-tab-panel]").innerHTML(),
        });
      }
      await page
        .locator('[data-secondary-tabs="' + group.id + '"]')
        .getByRole("button", { name: group.labels[0], exact: true })
        .click();
    }
    const html = await page.content();
    fs.writeFileSync("audit/secondary-vercel/" + slug + "-rendered.html", html);
    fs.writeFileSync(
      "audit/secondary-vercel/" + slug + "-tabs.json",
      JSON.stringify(variants),
    );
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({
      path: "audit/secondary-vercel/" + slug + "-desktop.png",
    });
    console.log(JSON.stringify({ slug, groups: groups.length }));
    await page.close();
  }
} finally {
  await browser.close();
}
