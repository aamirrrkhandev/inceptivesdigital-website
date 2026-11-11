import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const base=process.argv[2]||'http://localhost:3100';
const live=process.argv.includes('--live');
const browser=await chromium.launch();const results=[];
fs.mkdirSync('audit/page-structure',{recursive:true});
try {
  for(const width of [390,768,1366]) {
    const page=await browser.newPage({viewport:{width,height:950},reducedMotion:'reduce'});
    await page.route(/callrail\.com|leadconnectorhq\.com|clients\.inceptivesdigital\.com|challenges\.cloudflare\.com/,route=>route.abort());
    let loads=0,release;
    if(live)page.on('request',request=>{if(request.isNavigationRequest()&&request.url().startsWith('https://calendly.com/inceptivesdigital-info/30min'))loads++;});
    if(!live)await page.route('https://calendly.com/**',async route=>{
      loads++;await new Promise(resolve=>release=resolve);
      await route.fulfill({contentType:'text/html',body:'<html><body style="background:#111;color:#fff"><h1>Select a Date &amp; Time</h1><button>24</button></body></html>'});
    });
    await page.goto(base+'/');await page.locator('[data-interactions-ready=true]').waitFor();
    const popup=page.locator('#schedulePopup'),frame=popup.locator('iframe');
    assert.equal(await frame.getAttribute('src'),null,'No popup calendar network before intent');
    await page.locator('a:visible,button:visible').filter({hasText:/^\s*Schedule A Call\s*$/i}).first().click();
    await popup.waitFor({state:'visible'});
    const url=new URL(await frame.getAttribute('src'));assert.equal(url.hostname,'calendly.com');assert.equal(url.searchParams.get('primary_color'),'00ce44');assert.equal(url.searchParams.get('background_color'),'111111');
    assert.equal(await frame.getAttribute('loading'),'eager');
    if(!live){await page.waitForTimeout(150);await popup.locator('.calendly-loader').waitFor({state:'visible'});assert.ok(release);release();}
    await page.frameLocator('#schedulePopup iframe').getByRole('heading',{name:/Select a (?:Day|Date.*Time)/i}).waitFor({timeout:45000});
    await popup.locator('.calendly-loader').waitFor({state:'hidden'});
    const rect=await frame.boundingBox();assert.ok(rect.width>280&&rect.height>400);assert.ok(rect.x>=0&&rect.x+rect.width<=width+1);
    if(live){await page.frameLocator('#schedulePopup iframe').getByRole('button',{name:/ - Times available$/}).first().waitFor({timeout:45000});const decline=page.frameLocator('#schedulePopup iframe').getByRole('button',{name:'Decline',exact:true});if(await decline.isVisible()){await decline.click();await decline.waitFor({state:'hidden'});}}
    await popup.screenshot({path:`audit/page-structure/calendar-${live?'live':'fixture'}-${width}.png`});
    if(live){const calendar=page.frameLocator('#schedulePopup iframe');await calendar.getByRole('button',{name:/ - Times available$/}).first().click();await calendar.getByRole('button',{name:/^\d{1,2}:\d{2}\s*(?:am|pm)$/i}).first().waitFor({timeout:20000});}
    await popup.locator('.schedule-popup-close').click();await popup.waitFor({state:'hidden'});
    await page.locator('a:visible,button:visible').filter({hasText:/^\s*Schedule A Call\s*$/i}).first().click();
    assert.equal(loads,1,'Reuse loaded calendar on reopen');
    results.push({width,calendarVisible:true,availableTimeSlots:live,onDemand:true,greenTheme:true,reusesFrame:true,pass:true});await page.close();
  }
}finally{await browser.close();fs.writeFileSync(`audit/page-structure/calendar-${live?'live':'fixture'}.json`,JSON.stringify(results,null,2));}
console.log(JSON.stringify({base,live,results}));
