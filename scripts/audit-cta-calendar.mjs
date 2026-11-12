import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';
const base=process.env.TEST_BASE_URL||'https://inceptivesdigital.com';
const browser=await chromium.launch();const results=[];
await fs.mkdir('audit/cta-calendar',{recursive:true});
try {
 for(const path of process.argv.slice(2).length?process.argv.slice(2):['/mobile-app-development','/ios-app-development','/fitness-app-development','/','/custom-mobile-application-development']) {
  const page=await browser.newPage({viewport:{width:1366,height:900}});
  await page.route(/callrail\.com|leadconnectorhq\.com|clients\.inceptivesdigital\.com|facebook\.com|googletagmanager\.com|leadsy\.ai|livechatinc\.com/,r=>r.abort());
  const navigations=[];page.on('request',r=>{if(r.isNavigationRequest()&&r.url().includes('calendly.com'))navigations.push({url:r.url(),at:Date.now()});});
  const status=(await page.goto(base+path,{waitUntil:'domcontentloaded'})).status();
  await page.locator('[data-interactions-ready=true]').first().waitFor({timeout:15000}).catch(()=>{});
  if(process.env.WARM_WAIT_MS)await page.waitForTimeout(Number(process.env.WARM_WAIT_MS));
  const ctas=await page.locator('a,button').evaluateAll(nodes=>nodes.filter(n=>/schedule|book|quote|get in touch|start.*project|consultation/i.test(n.textContent)).map(n=>({text:n.textContent.trim().replace(/\s+/g,' '),href:n.getAttribute('href'),class:n.className,visible:!!n.getClientRects().length})));
  const trigger=page.locator('a:visible,button:visible').filter({hasText:/^\s*Schedule\s*A?\s*Call\s*$/i}).first();
  let calendar;
  if(await trigger.count()) {
   const clicked=Date.now();await trigger.click();
   try {
    await page.frameLocator('#schedulePopup iframe').getByRole('heading',{name:/Select a Date.*Time/i}).waitFor({timeout:35000});
    const headingMs=Date.now()-clicked;
    await page.frameLocator('#schedulePopup iframe').getByRole('button',{name:/ - Times available$/}).first().waitFor({timeout:15000});
    calendar={headingMs,availableDatesMs:Date.now()-clicked,requestStartMs:navigations[0]?.at-clicked,requests:navigations.length};
   }catch(e){calendar={error:e.message,requests:navigations.length,frameText:await page.frameLocator('#schedulePopup iframe').locator('body').innerText({timeout:2000}).catch(()=>''),popup:await page.locator('#schedulePopup').getAttribute('class')};}
   await page.screenshot({path:'audit/cta-calendar/'+(path.replaceAll('/','_')||'home')+'-calendar.png'});
  }
  results.push({path,status,ctas,calendar});console.log(JSON.stringify({path,status,calendar}));await page.close();
 }
}finally{await browser.close();await fs.writeFile('audit/cta-calendar/'+(process.env.AUDIT_LABEL||'baseline')+'.json',JSON.stringify(results,null,2));}
