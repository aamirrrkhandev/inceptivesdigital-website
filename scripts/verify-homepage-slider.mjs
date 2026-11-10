import fs from 'node:fs';import assert from 'node:assert/strict';import {chromium}from'playwright';import * as cheerio from'cheerio';
const base=process.argv[2]||'http://localhost:3100';const browser=await chromium.launch();const results=[];
try{
 for(const width of[375,820,1366,1920]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto(base+'/');const slider=page.locator('[data-component="casestudy-slider-component"]');await slider.waitFor();await slider.scrollIntoViewIfNeeded();await page.evaluate(()=>document.fonts.ready);assert.equal(await slider.locator('.swiper-slide').count(),8);
  const titles=[];
  for(let index=0;index<8;index++){
   const active=slider.locator('.swiper-slide-active');await active.locator('img').evaluateAll(images=>Promise.all(images.filter(img=>img.getBoundingClientRect().width>0).map(img=>img.decode())));await page.waitForTimeout(80);
   const state=await active.evaluate(el=>{const viewport=el.closest('[data-managed-carousel]');const rect=el.getBoundingClientRect(),box=viewport.getBoundingClientRect();const heading=el.querySelector('h3,h2');return{left:rect.left,viewportLeft:box.left,width:rect.width,viewportWidth:box.width,title:heading?.textContent.trim(),inert:el.inert,trackOverflow:getComputedStyle(el.parentElement).overflow,broken:[...el.querySelectorAll('img')].filter(img=>img.getBoundingClientRect().width>0&&(!img.complete||!img.naturalWidth)).length}});
   assert.ok(Math.abs(state.left-state.viewportLeft)<2);assert.ok(Math.abs(state.width-state.viewportWidth)<2);assert.equal(state.inert,false);assert.equal(state.trackOverflow,'visible');assert.equal(state.broken,0);assert.ok(state.title);titles.push(state.title);
   if(index===1&&[375,1366].includes(width))await slider.screenshot({path:`audit/browser/casestudy-component-${width}.png`});
   await slider.getByRole('button',{name:'Next case study'}).click();
  }
  assert.equal(new Set(titles).size,8);await slider.getByRole('button',{name:'Previous case study'}).click();assert.equal(await slider.locator('.swiper-slide-active').getAttribute('aria-label'),'8 of 8');assert.equal(errors.length,0,errors.join('\n'));results.push({width,slides:8,uniqueTitles:titles,imagesLoaded:true,navigationWraps:true,pass:true});await page.close();
 }
 const before=JSON.parse(fs.readFileSync('audit/non-home-before-case-component.json'));for(const [path,expected]of Object.entries(before)){const $=cheerio.load(await(await fetch(base+path)).text());const actual={headings:$('h1,h2,h3,h4,h5,h6').map((_,e)=>({tag:e.tagName,text:$(e).text().replace(/\s+/g,' ').trim()})).get(),title:$('head>title').text(),canonical:$('link[rel=canonical]').attr('href'),caseSliders:$('[data-component="casestudy-slider-component"]').length};assert.deepEqual(actual,expected);results.push({path,otherPageContentUnchanged:true,homepageComponentAbsent:true,pass:true})}
 const page=await browser.newPage({viewport:{width:1366,height:1000}});await page.goto(base+'/');assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'smooth');await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');results.push({smoothScroll:true,reducedMotionRespected:true,pass:true});await page.close();
}finally{await browser.close();fs.writeFileSync('audit/browser/homepage-slider-verification.json',JSON.stringify({base,results},null,2))}
console.log(JSON.stringify({base,passed:results.length,results}));
