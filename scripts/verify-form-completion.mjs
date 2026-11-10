import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const base = process.argv[2] || 'http://localhost:3100';
const browser = await chromium.launch();
try {
  for (const id of ['06b8e60', '12967acf', '786fcf9']) {
    const context = await browser.newContext();
    await context.addInitScript(() => {
      window.turnstile = { render(el) { const input = document.createElement('input'); input.type = 'hidden'; input.name = 'cf-turnstile-response'; input.value = 'ui-test-only'; el.append(input); return 'test'; }, reset() {}, remove() {} };
    });
    await context.route('https://challenges.cloudflare.com/**', r => r.abort());
    let requests = 0;
    await context.route('**/api/forms', r => { requests++; return r.fulfill({ json: { success: true, data: { message: 'Test success' } } }); });
    const page = await context.newPage();
    await page.goto(base + '/contact-us');
    await page.locator('[data-interactions-ready=true]').waitFor();
    const form = page.locator(`form:has(input[name=form_id][value="${id}"])`).first();
    await form.evaluate(el => {
      for (const field of el.querySelectorAll('input,textarea')) {
        if (field.type === 'checkbox') field.checked = true;
        else if (field.type === 'email') field.value = 'qa@example.invalid';
        else if (field.type === 'tel') field.value = '5550101234';
        else if (['text', 'textarea'].includes(field.type)) field.value = 'Isolated QA test';
      }
      const token = document.createElement('input'); token.type = 'hidden'; token.name = 'cf-turnstile-response'; token.value = 'ui-test-only'; el.append(token);
      el.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    });
    await page.waitForURL(base + '/thank-you');
    await page.getByRole('heading', { name: 'Thank You! 🎉' }).waitFor();
    assert.equal(requests, 1);
    console.log(JSON.stringify({ formId: id, redirect: page.url(), success: true, transport: 'mocked; no email sent' }));
    await context.close();
  }
  for (const width of [375, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const response = await page.goto(base + '/thank-you');
    assert.equal(response.status(), 200);
    assert.match(await page.locator('meta[name=robots]').getAttribute('content'), /noindex/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.close();
  }
} finally { await browser.close(); }
