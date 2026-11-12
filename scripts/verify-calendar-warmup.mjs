import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';
const base=process.env.TEST_BASE_URL||'http://localhost:3104';
const browser=await chromium.launch(),results=[];
try{for(const saveData of [false,true]){
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});let requests=0;
 if(saveData)await page.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,effectiveType:'4g'}}));
 await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.hostname==='calendly.com'){requests++;return route.fulfill({contentType:'text/html',body:'<h1>Select a Date &amp; Time</h1>'});}return u.origin===base?route.continue():route.abort();});
 await page.goto(base+'/mobile-app-development');await page.locator('[data-interactions-ready=true]').waitFor();
 const popup=page.locator('#schedulePopup'),frame=popup.locator('iframe');
 if(!saveData){await frame.waitFor({state:'attached'});await page.waitForFunction(()=>!!document.querySelector('#schedulePopup iframe')?.getAttribute('src'));assert.equal(await popup.isVisible(),false);assert.equal(await popup.evaluate(e=>e.inert),true);assert((await frame.evaluate(e=>e.getBoundingClientRect().width))>280,'warm frame has usable layout');}
 else{await page.waitForTimeout(3200);assert.equal(await frame.getAttribute('src'),null);}
 assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('id-cp-lock')),false);
 await page.getByRole('button',{name:'Schedule A Call',exact:true}).first().click();
 await popup.waitFor({state:'visible'});assert.equal(await popup.evaluate(e=>e.inert),false);
 await page.frameLocator('#schedulePopup iframe').getByRole('heading',{name:'Select a Date & Time'}).waitFor();
 await page.keyboard.press('Escape');assert.equal(await popup.isVisible(),false);
 await page.getByRole('button',{name:'Schedule A Call',exact:true}).first().click();assert.equal(requests,1);
 results.push({saveData,requests,warmLayout:!saveData,hiddenUntilOpened:true,focusNotTrappedWhileWarming:true,reopensWithoutReload:true});await page.close();
}}finally{await browser.close();await fs.writeFile('audit/cta-calendar/warmup-verification.json',JSON.stringify(results,null,2));}
console.log(JSON.stringify(results));
