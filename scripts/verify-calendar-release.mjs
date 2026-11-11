import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.argv[2],results=[];const browser=await chromium.launch();
try{for(const width of [1366,820,375]){
 const page=await browser.newPage({viewport:{width,height:950},reducedMotion:'reduce'});
 await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.locator('[data-interactions-ready=true]').first().waitFor();
 const section=page.locator('#schedule-meeting');await section.scrollIntoViewIfNeeded();
 const inline=section.locator('iframe');await inline.waitFor();
 const source=await inline.getAttribute('src');assert.equal(new URL(source).searchParams.get('primary_color'),'00ce44');
 const frame=page.frameLocator('#schedule-meeting iframe');await frame.locator('body').waitFor({timeout:45000});
 const decline=frame.getByRole('button',{name:'Decline',exact:true});
 if(await decline.isVisible())await decline.click();
 await frame.getByText(/Select a Date|Select a time|No times|30 Minute|30 min/i).first().waitFor({timeout:45000});
 const metrics=await frame.locator('body').evaluate(el=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,text:el.innerText.slice(0,350)}));
 assert.ok(metrics.scrollWidth<=metrics.width+1,'Calendar horizontal overflow');
 await page.screenshot({path:`audit/page-assets/calendar-inline-${width}.png`});
 await page.evaluate(()=>scrollTo(0,0));
 const triggers=page.getByText(/^Schedule\s*A?\s*Call$/i);let opened=false;
 for(let i=0;i<await triggers.count();i++)if(await triggers.nth(i).isVisible()){await triggers.nth(i).click();opened=true;break;}
 assert.ok(opened);await page.locator('#schedulePopup.is-open').waitFor();
 const popupFrame=page.frameLocator('#schedulePopup iframe');
 const popupDecline=popupFrame.getByRole('button',{name:'Decline',exact:true});
 if(await popupDecline.isVisible())await popupDecline.click();
 await popupFrame.getByText(/Select a Date|Select a time|No times|30 Minute|30 min/i).first().waitFor({timeout:45000});
 const close=page.locator('#schedulePopup .schedule-popup-close');await close.click();await page.locator('#schedulePopup.is-open').waitFor({state:'hidden'});
 results.push({width,inlineCalendarVisible:true,popupCalendarVisible:true,greenTheme:true,popupCloses:true,metrics,bookingCreated:false});
 await page.close();
}}finally{await browser.close();fs.writeFileSync('audit/page-assets/calendar.json',JSON.stringify(results,null,2));}
console.log(JSON.stringify(results));
