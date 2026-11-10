import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base=process.argv[2]||'http://localhost:3102';
const browser=await chromium.launch();const results=[];
try {
 for(const width of [375,390,519,820]) for(const path of ['/', '/ios-app-development']) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  await page.goto(base+path,{waitUntil:'domcontentloaded'});
  await page.locator('[data-interactions-ready=true]').waitFor();
  await page.evaluate(()=>document.fonts.ready);
  const menu=page.locator('.sitekit-menu-container').first();
  const hamburger=page.locator('.sitekit-menu-hamburger').first();
  const close=menu.locator('.sitekit-menu-close');
  const header=page.locator('.ekit-template-content-header').first();
  const initial=await header.boundingBox();
  for(let cycle=0;cycle<3;cycle++) {
   await hamburger.click();
   await page.waitForFunction(()=>document.querySelector('.sitekit-menu-container')?.classList.contains('active'));
   const opened=await menu.boundingBox();assert.ok(opened&&opened.x>=-1&&opened.x<width);
   if(cycle===1){const submenu=menu.locator('.sitekit-megamenu-has > a').first();await submenu.click()}
   await close.click();
   await page.waitForTimeout(450);
   const state=await menu.evaluate(el=>({cls:el.className,position:getComputedStyle(el).position,rect:el.getBoundingClientRect().toJSON(),openSubmenus:el.querySelectorAll('.migration-menu-open').length}));
   assert.ok(state.cls.includes('sitekit-menu-offcanvas-elements'));
   assert.equal(state.position,'fixed');assert.ok(!state.cls.split(' ').includes('active'));
   assert.ok(state.rect.right<=1||state.rect.left>=width-1,'Closed drawer must be outside the viewport');
   assert.equal(state.openSubmenus,0);
   assert.equal(await hamburger.getAttribute('aria-expanded'),'false');
   const after=await header.boundingBox();assert.ok(Math.abs(after.height-initial.height)<1,'Header expanded after closing menu');
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false);
  if(path==='/ios-app-development'&&width===390)await page.screenshot({path:'audit/browser/mobile-close-fixed-390.png'});
  results.push({path,width,cycles:3,pass:true});await page.close();
 }
} finally {await browser.close();fs.writeFileSync('audit/browser/mobile-close-verification.json',JSON.stringify(results,null,2))}
console.log(JSON.stringify(results));
