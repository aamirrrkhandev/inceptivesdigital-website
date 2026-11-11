import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.argv[2],local=process.argv.includes('--local-css'),results=[],browser=await chromium.launch();
try{for(const width of [320,375,519,755,820,1024,1366,1920]){
 const page=await browser.newPage({viewport:{width,height:1200},reducedMotion:'reduce'});
 if(local)await page.route('**/assets/styles/site-typography.css',r=>r.fulfill({path:'public/assets/styles/site-typography.css',contentType:'text/css'}));
 await page.goto(base+'/portfolio');await page.locator('[data-interactions-ready=true]').waitFor();
 const frames=page.locator('main .position-relative:has(.migrated-widget-image img)');
 for(let i=0;i<await frames.count();i++){
  const frame=frames.nth(i),card=frame.locator('..');if(!await card.locator('h2').count())continue;
  await frame.scrollIntoViewIfNeeded();
  await frame.locator('img').evaluateAll(images=>Promise.all(images.map(img=>img.decode().catch(()=>{}))));
  const metrics=await card.evaluate(el=>{
   const title=el.querySelector('h2'),copy=title.getBoundingClientRect();
   return {title:title.textContent.trim().replace(/\s+/g,' '),copyTop:copy.top,images:[...el.querySelectorAll('.position-relative img')].map(img=>({source:img.getAttribute('src'),loaded:img.complete&&img.naturalWidth>0,bottom:img.getBoundingClientRect().bottom,right:img.getBoundingClientRect().right})),width:innerWidth,scrollWidth:document.documentElement.scrollWidth};
  });
  metrics.pass=metrics.images.every(img=>img.loaded&&img.bottom<=metrics.copyTop-10)&&metrics.scrollWidth<=width+1;
  results.push({width,...metrics});
  if(metrics.title==='Pulse Check Timer'&&width===755)await page.screenshot({path:'audit/page-assets/portfolio-pulse-fixed-755.png',clip:await card.boundingBox(),animations:'disabled'});
 }
 await page.close();console.log(JSON.stringify({width,checked:results.filter(r=>r.width===width).length,failed:results.filter(r=>r.width===width&&!r.pass).map(r=>r.title)}));
}}finally{await browser.close();fs.writeFileSync('audit/page-assets/portfolio-overlaps.json',JSON.stringify({base,localStylesheetOverride:local,results,failures:results.filter(r=>!r.pass)},null,2));}
assert.ok(results.length>0&&results.every(r=>r.pass),'Portfolio image/copy overlap or missing image');
