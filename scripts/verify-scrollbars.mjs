import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.argv[2]||'http://localhost:3100';
const routes=JSON.parse(fs.readFileSync('content/routes.json'));
const results=[];const browser=await chromium.launch();
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 // Check layout scroll ownership without downloading videos or firing tracking scripts.
 await context.route('**/*',route=>{const r=route.request();const url=new URL(r.url());return ['image','media'].includes(r.resourceType())||url.origin!==base?route.abort():route.continue()});
 let index=0;
 await Promise.all(Array.from({length:2},async()=>{const page=await context.newPage();while(index<routes.length){const route=routes[index++];const response=await page.goto(base+route.path,{waitUntil:'domcontentloaded'});const state=await page.locator('.migrated-page[data-source-path]').first().evaluate(el=>({overflowY:getComputedStyle(el).overflowY,overflowX:getComputedStyle(el).overflowX,documentWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth}));results.push({path:route.path,status:response.status(),...state,pass:response.status()===200&&state.overflowY==='visible'&&state.overflowX==='clip'&&state.documentWidth<=state.viewportWidth+1})}await page.close()}));
 await context.close();
 const page=await browser.newPage({viewport:{width:390,height:900}});await page.goto(base+'/blockchain-development');await page.locator('[data-interactions-ready=true]').waitFor();await page.locator('.sitekit-menu-hamburger').click();const close=page.locator('.sitekit-menu-close');assert.equal(await close.locator('svg path').count(),1);assert.equal(await close.getAttribute('aria-label'),'Close menu');assert.equal(await close.textContent(),'');const arrow=await page.locator('.sitekit-submenu-indicator').first().evaluate(el=>({tag:el.tagName.toLowerCase(),width:el.getBoundingClientRect().width,border:getComputedStyle(el).borderWidth}));assert.equal(arrow.tag,'svg');assert.equal(arrow.width,18);assert.equal(arrow.border,'0px');await page.screenshot({path:'audit/browser/submenu-svg-fixed-390.png'});await close.click();await page.close();
}finally{await browser.close();fs.writeFileSync('audit/browser/scrollbar-verification.json',JSON.stringify({results,failures:results.filter(r=>!r.pass)},null,2))}
console.log(JSON.stringify({checked:results.length,failures:results.filter(r=>!r.pass),mobileSvgCheck:'PASS'}));
