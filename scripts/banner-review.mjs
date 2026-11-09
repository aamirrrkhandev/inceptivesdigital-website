import {chromium} from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch();const results=[];
for(const width of [1440,820,390]){const p=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
for(const base of [process.argv[2]||'http://localhost:3100','https://inceptivesdigital.com']){await p.goto(base,{waitUntil:'domcontentloaded'});await p.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,8000))]));await p.waitForTimeout(1000);
results.push({base,width,elements:await p.locator('[data-id="27ec79d3"], [data-id="1c239b24"],main h1').evaluateAll(els=>els.map(e=>{const s=getComputedStyle(e);return{text:e.tagName==='H1'?e.textContent.trim():e.dataset.id,rect:e.getBoundingClientRect().toJSON(),position:s.position,top:s.top,transform:s.transform,parent:e.parentElement.getBoundingClientRect().toJSON()}}))});
await p.screenshot({path:'audit/browser/banner-'+(base.includes('localhost')?'target':'source')+'-'+width+'.png'});
}await p.close()}
await browser.close();fs.writeFileSync('audit/browser/banner-review.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
