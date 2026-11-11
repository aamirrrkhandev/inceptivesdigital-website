import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.argv[2],local=process.argv.includes('--local-css'),results=[],browser=await chromium.launch();
try{for(const width of [320,375,519,767,820,1024]){
 const page=await browser.newPage({viewport:{width,height:950},reducedMotion:'reduce'});
 if(local)await page.route('**/assets/styles/site-typography.css',r=>r.fulfill({path:'public/assets/styles/site-typography.css',contentType:'text/css'}));
 await page.goto(base+'/');await page.evaluate(()=>document.fonts.ready);
 const cards=page.locator('.home-container-sty');await cards.first().scrollIntoViewIfNeeded();
 const metrics=await cards.evaluateAll(elements=>elements.map(el=>{
  const r=el.getBoundingClientRect(),s=getComputedStyle(el),body=el.querySelector('.homecard-bottom'),b=body.getBoundingClientRect();
  return {height:r.height,padding:s.padding,minHeight:s.minHeight,bodyFits:b.bottom<=r.bottom-19&&b.top>=r.top+19,scrollFits:el.scrollHeight<=el.clientHeight+1};
 }));
 assert.equal(metrics.length,3);assert.ok(metrics.every(m=>m.padding==='20px'&&m.minHeight==='0px'&&m.bodyFits&&m.scrollFits),JSON.stringify({width,metrics}));
 if([375,820].includes(width))await page.screenshot({path:`audit/page-assets/compact-service-card-${width}.png`,clip:await cards.first().boundingBox(),animations:'disabled'});
 results.push({width,metrics,pass:true});await page.close();
}}finally{await browser.close();fs.writeFileSync('audit/page-assets/compact-cards.json',JSON.stringify({base,localStylesheetOverride:local,results},null,2));}
console.log(JSON.stringify({testedWidths:results.length,results}));
