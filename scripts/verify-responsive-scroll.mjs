import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.argv[2]||'http://localhost:3100';
const browser=await chromium.launch();const results=[];
try{
 for(const width of [320,375,390,519,768,820,1024]) {
  const height=width<390?568:900;
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  await page.goto(base+'/blockchain-development',{waitUntil:'domcontentloaded'});await page.locator('[data-interactions-ready=true]').waitFor();
  await page.locator('.sitekit-menu-hamburger').click();
  const menu=page.locator('.sitekit-menu-container').first();
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).overflowY),'hidden');
  const triggers=menu.locator('.sitekit-megamenu-has > a');
  for(let index=0;index<await triggers.count();index++) {
   await menu.evaluate(el=>el.scrollTop=0);
   await triggers.nth(index).click();
   await menu.locator('.migration-menu-open .sitekit-megamenu-panel a[href]').last().waitFor({state:'visible'});
   await page.waitForTimeout(100);
   const state=await menu.evaluate(el=>{
    const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return r.width&&r.height&&s.visibility!=='hidden'&&s.display!=='none'};
    return {overflowY:getComputedStyle(el).overflowY,scrollbarWidth:getComputedStyle(el).scrollbarWidth,h:el.clientHeight,sh:el.scrollHeight,w:el.clientWidth,sw:el.scrollWidth,nested:[...el.querySelectorAll('*')].filter(e=>visible(e)&&['auto','scroll'].includes(getComputedStyle(e).overflowY)&&e.scrollHeight>e.clientHeight+2).map(e=>({tag:e.tagName,cls:String(e.className)}))};
   });
   assert.equal(state.overflowY,'auto');assert.equal(state.scrollbarWidth,'none');assert.deepEqual(state.nested,[],`Nested scroll at ${width}, submenu ${index}`);assert.ok(state.sw<=state.w+1,`Menu horizontal overflow at ${width}`);
   if(index===0&&state.sh>state.h+10){const before=await page.evaluate(()=>scrollY);const rect=await menu.boundingBox();await page.mouse.move(rect.x+rect.width/2,Math.min(height-50,rect.y+200));await page.mouse.wheel(0,400);await page.waitForTimeout(150);assert.ok(await menu.evaluate(el=>el.scrollTop)>0,'Drawer must remain scrollable by wheel');assert.equal(await page.evaluate(()=>scrollY),before,'Background must stay still');}
   await menu.evaluate(el=>el.scrollTop=el.scrollHeight);
   const reachedBottom=await menu.evaluate(el=>el.scrollHeight-el.clientHeight-el.scrollTop<=2);assert.ok(reachedBottom);
   await menu.evaluate(el=>el.scrollTop=0);await triggers.nth(index).click();
  }
  if(width===390){await triggers.nth(1).click();await menu.locator('.migration-menu-open .sitekit-megamenu-panel a[href]').last().waitFor({state:'visible'});await page.waitForTimeout(300);await page.screenshot({path:'audit/browser/mobile-single-scroll-390.png'})}
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('migration-mobile-menu-open')),false);assert.equal(await menu.evaluate(el=>el.classList.contains('active')),false);
  await page.setViewportSize({width:1440,height:900});assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).overflowY),'auto');
  results.push({width,height,allSubmenus:true,nestedScrollbars:0,drawerScrollsToBottom:true,pageUnlocks:true,pass:true});await page.close();
 }
 for(const width of[1280,1440,1920])for(const path of['/','/services','/blockchain-development','/ios-app-development','/blog']) {
  const page=await browser.newPage({viewport:{width,height:900}});await page.goto(base+path,{waitUntil:'domcontentloaded'});await page.locator('[data-interactions-ready=true]').waitFor();
  const state=await page.evaluate(()=>({owner:document.scrollingElement?.tagName,rootOverflow:getComputedStyle(document.documentElement).overflowY,bodyOverflow:getComputedStyle(document.body).overflowY,nested:[...document.querySelectorAll('*')].filter(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return el!==document.documentElement&&['auto','scroll'].includes(s.overflowY)&&el.scrollHeight>el.clientHeight+2&&r.width>=innerWidth*.9&&r.height>=innerHeight*.9&&r.right>0&&r.left<innerWidth&&s.visibility!=='hidden'&&Number(s.opacity)!==0}).map(el=>String(el.className)),width:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert.equal(state.owner,'HTML');assert.equal(state.rootOverflow,'auto');assert.equal(state.bodyOverflow,'visible');assert.deepEqual(state.nested,[]);assert.ok(state.width<=state.viewport+1);results.push({width,path,...state,pass:true});
  if(width===1920&&path==='/')await page.screenshot({path:'audit/browser/desktop-single-scroll-1920.png'});
  await page.close();
 }
}finally{await browser.close();fs.writeFileSync('audit/browser/responsive-scroll-verification.json',JSON.stringify(results,null,2))}
console.log(JSON.stringify({passed:results.length,results}));
