import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const base=process.argv[2]||'http://localhost:3100';
const browser=await chromium.launch();
try {
  const page=await browser.newPage({viewport:{width:1366,height:950}});
  await page.route(/callrail\.com|leadconnectorhq\.com|clients\.inceptivesdigital\.com|challenges\.cloudflare\.com/,route=>route.abort());
  let requests=0,held;
  await page.route('https://calendly.com/**',async route=>{
    requests++;
    if(requests===1){held=route;return;}
    await route.fulfill({contentType:'text/html',body:'<html><body><h1>Select a Date &amp; Time</h1></body></html>'});
  });
  await page.goto(base+'/');await page.locator('[data-interactions-ready=true]').waitFor();await page.clock.install();
  await page.locator('a:visible,button:visible').filter({hasText:/^\s*Schedule A Call\s*$/i}).first().click();
  for(let i=0;!held&&i<100;i++)await new Promise(resolve=>setTimeout(resolve,10));assert.ok(held);
  await page.clock.fastForward(20001);
  const popup=page.locator('#schedulePopup');await popup.locator('.calendly-load-error').waitFor({state:'visible'});
  await popup.locator('#idCalendlyRetry').click();
  await page.waitForTimeout(1000);console.log(JSON.stringify({requests,popup:await popup.getAttribute('class'),frame:await popup.locator('iframe').getAttribute('src'),frames:page.frames().map(frame=>frame.url())}));
  await page.frameLocator('#schedulePopup iframe').getByRole('heading',{name:/Select a Date/}).waitFor({timeout:5000});
  await popup.locator('.calendly-load-error').waitFor({state:'hidden'});
  await popup.locator('.calendly-loader').waitFor({state:'hidden'});assert.equal(requests,2);
  await held.abort().catch(()=>{});
  const result={base,timeoutUi:true,retryLoadsCalendar:true,requests,realBooking:false,pass:true};
  fs.mkdirSync('audit/page-structure',{recursive:true});fs.writeFileSync('audit/page-structure/calendar-retry.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await browser.close();}
