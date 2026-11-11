import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.argv[2],browser=await chromium.launch(),results=[];
try{
 for(const width of [320,375,519,820,1024]){
  const context=await browser.newContext({viewport:{width,height:812}}),page=await context.newPage();
  await page.goto(base+'/mobile-app-development');await page.locator('[data-interactions-ready=true]').waitFor();
  await page.locator('.sitekit-menu-hamburger').click();const menu=page.locator('.sitekit-menu-container').first();
  await menu.locator('.sitekit-megamenu-has > a').first().click();
  for(const position of [300,10000]){
   await menu.evaluate((el,top)=>el.scrollTop=top,position);
   const m=await menu.evaluate(el=>{
    const header=el.querySelector('.sitekit-nav-identity-panel'),r=header.getBoundingClientRect(),outer=el.getBoundingClientRect();
    const hit=document.elementFromPoint(outer.left+30,outer.top+6);
    return {headerTop:r.top,drawerTop:outer.top,background:getComputedStyle(header).backgroundColor,headerCoversTop:header===hit||header.contains(hit),scrollTop:el.scrollTop};
   });assert.ok(Math.abs(m.headerTop-m.drawerTop)<=1&&m.headerCoversTop,JSON.stringify({width,...m}));
   results.push({check:'opaque sticky drawer header',width,...m,pass:true});
  }
  if(width===375)await page.screenshot({path:'audit/page-assets/mobile-menu-fixed-top.png'});
  await page.keyboard.press('Escape');assert.ok(!await menu.evaluate(el=>el.classList.contains('active')));
  if(width===375){
   await page.locator('[aria-label="Open chat"]').waitFor({timeout:45000});
   assert.equal(await page.locator('#chat-widget-container').isVisible(),false,'Chat input must be collapsed initially');
   await page.getByRole('button',{name:'Open chat',exact:true}).click();
   await page.locator('html[data-chat-open="true"]').waitFor();
   await page.locator('#chat-widget-container').waitFor({state:'visible'});
   const frame=page.frameLocator('#chat-widget');await frame.locator('input:not([type=hidden]),textarea,[contenteditable=true]').first().waitFor({state:'visible',timeout:30000});
   await page.screenshot({path:'audit/page-assets/chat-open-mobile.png'});
   await page.evaluate(()=>window.LiveChatWidget.call('minimize'));
   await page.getByRole('button',{name:'Open chat',exact:true}).waitFor();
   assert.equal(await page.locator('#chat-widget-container').isVisible(),false);
   results.push({check:'chat icon opens real provider input and minimizes back to icon',width,pass:true,messageSent:false});
  }
  await context.close();
 }
}finally{await browser.close();fs.writeFileSync('audit/page-assets/menu-chat.json',JSON.stringify({base,results},null,2));}
console.log(JSON.stringify({checks:results.length,results}));
