import { test, expect } from "@playwright/test";

// Current migrated homepage contract. External providers and all submissions are
// isolated so this suite cannot send leads, messages or calendar bookings.
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    Object.assign(window, { turnstile: {
      render(container: HTMLElement) {
        const input = document.createElement("input");
        input.type = "hidden"; input.name = "cf-turnstile-response";
        input.value = "isolated-homepage-ui-test"; container.append(input);
        return "isolated-widget";
      }, remove() {}, reset() {},
    } });
  });
  await context.route("**/*", route => {
    const request = route.request();
    if (request.method() === "POST" || /googletagmanager|google-analytics|callrail|leadconnectorhq|livechatinc|cloudflare|calendly|clients\.inceptivesdigital/.test(request.url())) return route.abort();
    return route.continue();
  });
});

test("homepage metadata and page-owned original media", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Inceptives Digital | Digital Product Studio");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://inceptivesdigital.com");
  const hero = page.locator('video[data-media-src*="comp-bannerhero"]').first();
  await expect(hero).toHaveAttribute("data-media-src", /^\/assets\/pages\/home\/videos\//);
  await expect(hero).toHaveAttribute("poster", /^\/assets\/pages\/home\/images\//);
  await expect(hero).toHaveAttribute("data-mobile-src", /home-hero-mobile-540\.mp4$/);
});

test("case study navigation, keyboard tabs and FAQ", async ({ page }) => {
  await page.goto("/");
  const slider = page.locator('[data-component="casestudy-slider-component"]');
  await slider.getByRole("button", { name: "Next case study", exact: true }).click();
  await expect(slider.locator(".swiper-slide-active")).toContainText("State of the art chiropractic");
  const design = page.getByRole("tab", { name: /02.*Design/ });
  await design.click();
  await expect(design).toHaveAttribute("aria-selected", "true");
  const panel = page.locator('[id="' + await design.getAttribute("aria-controls") + '"]');
  await expect(panel).toBeVisible();
  await design.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /03.*Engineering/ })).toHaveAttribute("aria-selected", "true");
  const summary = page.locator("main summary").first();
  const wasOpen = await summary.evaluate(e => (e.parentElement as HTMLDetailsElement).open);
  await summary.click();
  await expect.poll(() => summary.evaluate(e => (e.parentElement as HTMLDetailsElement).open)).toBe(!wasOpen);
});

test("scheduling opens and closes without booking", async ({ page }) => {
  await page.route("https://calendly.com/**", route => route.fulfill({ contentType: "text/html", body: '<html><body><button>Choose a time</button></body></html>' }));
  await page.goto("/");
  await page.locator('[data-interactions-ready="true"]').waitFor();
  const trigger = page.locator("a:visible,button:visible").filter({ hasText: /^\s*Schedule A Call\s*$/i }).first();
  await trigger.click();
  await expect(page.locator("#schedulePopup")).toBeVisible();
  await page.locator("#schedulePopup .schedule-popup-close").click();
  await expect(page.locator("#schedulePopup")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("footer form validation and retry without sending leads", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/forms", route => {
    requests++;
    return route.fulfill({ status: 422, json: { success: false, data: { message: "Isolated test: service unavailable." } } });
  });
  await page.goto("/");
  await page.locator('[data-interactions-ready="true"]').waitFor();
  const form = page.locator("footer [data-contact-form]").first();
  await form.locator('button[type="submit"]').click();
  expect(requests).toBe(0);
  await form.locator('input[type="email"]').fill("qa@example.invalid");
  await form.locator('input[type="tel"]').fill("2125550100");
  await form.locator('input[name="cf-turnstile-response"]').waitFor({ state: "attached" });
  await form.locator('button[type="submit"]').click();
  await expect(form.locator("[data-form-status]")).toContainText("Isolated test: service unavailable.");
  await expect(form.locator('button[type="submit"]')).toBeEnabled();
  expect(requests).toBe(1);
});

test("responsive geometry and diagnostic screenshot", async ({ page }, info) => {
  await page.goto("/");
  await page.locator('[data-interactions-ready="true"]').waitFor();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  // Diagnostic capture, not an assertion against an unapproved pixel baseline.
  await page.screenshot({ path: info.outputPath("homepage.png"), animations: "disabled", mask: [page.locator("video"), page.locator("iframe")] });
});
