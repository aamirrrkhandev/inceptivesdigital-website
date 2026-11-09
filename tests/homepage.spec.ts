import { test, expect } from "@playwright/test";
test("homepage metadata and original media", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Inceptives Digital | Digital Product Studio");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://inceptivesdigital.com/",
  );
  for (const file of [
    "comp-bannerhero.mp4",
    "homesection-video.mp4",
    "home-video-con.mp4",
    "footer.mp4",
  ])
    await expect(
      page.locator(`video source[src$="${file}"]`).first(),
    ).toHaveAttribute("src", `/assets/${file}`);
});
test("carousel, keyboard tabs and FAQ", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Next slide", exact: true }).click();
  await expect(page.locator(".case-card:not([hidden])")).toContainText(
    "Pulse Check",
  );
  const design = page.getByRole("tab", { name: /02.*Design/ });
  await design.click();
  await expect(page.locator(".process-panel:not([hidden])")).toContainText(
    "Design with Intent",
  );
  await design.press("ArrowRight");
  await expect(page.locator(".process-panel:not([hidden])")).toContainText(
    "Precision Engineering",
  );
  await page.locator("summary").nth(1).click();
  await expect(page.locator(".faq details").nth(1)).toHaveAttribute("open", "");
});
test("scheduling opens and closes", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Schedule A Call", exact: true })
    .filter({ visible: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close scheduling dialog" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("staging form validates without sending leads", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Submit!", exact: true }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
  await page
    .getByRole("textbox", { name: "First Name", exact: true })
    .fill("Migration");
  await page
    .getByRole("textbox", { name: "Last Name", exact: true })
    .fill("Review");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("preview@example.com");
  await page
    .getByRole("textbox", { name: "Phone", exact: true })
    .fill("+15555550100");
  await page
    .getByRole("textbox", { name: "Message", exact: true })
    .fill("Local staging validation test only.");
  await page.getByRole("button", { name: "Submit!", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("has not been sent");
});
test("responsive screenshots and no horizontal overflow", async ({
  page,
}, info) => {
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await expect(page).toHaveScreenshot(`${info.project.name}-home.png`, {
    fullPage: true,
    animations: "disabled",
    mask: [
      page.locator("video"),
      page.locator("iframe"),
      page.locator(".marquee-track"),
    ],
  });
});
