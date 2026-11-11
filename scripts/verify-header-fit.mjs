import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.argv[2],local=process.argv.includes('--local-css'),results=[],browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1366,height:950}});
 if(local)await page.route('**/assets/styles/site-typography.css',r=>r.fulfill({path:'public/assets/styles/site-typography.css',contentType:'text/css'}));
 for(const url of ['/','/mobile-game-development','/ios-app-development'])for(const width of [1025,1100,1280,1366,1920]){
  await page.setViewportSize({width,height:950});await page.goto(base+url);
  await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,5000))]));
  const metrics=await page.locator('.header-containers').first().evaluate(el=>{
   const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width};};
   const links=[...el.querySelectorAll('.sitekit-navbar-nav > li > a')].filter(a=>a.getBoundingClientRect().width).map(rect);
   const logo=rect(el.querySelector('[data-id="4eeda28c"]'));
   const right=rect(el.querySelector('[data-id="4128428c"]'));
   const phone=[...el.querySelectorAll('a[href^="tel:"]')].find(a=>a.getBoundingClientRect().width),cta=el.querySelector('.getintouch a');
   return {links,logo,right,phone:phone&&rect(phone),cta:cta&&rect(cta),overflow:document.documentElement.scrollWidth>innerWidth+1};
  });
  const pass=!metrics.overflow&&metrics.links.every((l,i)=>!i||l.left>=metrics.links[i-1].right-1)&&metrics.links[0].left>=metrics.logo.right+7&&metrics.links.at(-1).right<=metrics.right.left-7&&(!metrics.phone||metrics.phone.right<=metrics.cta.left-7);
  results.push({url,width,...metrics,pass});
 }
}finally{await browser.close();fs.writeFileSync('audit/page-assets/header-final.json',JSON.stringify({base,localStylesheetOverride:local,results,failures:results.filter(r=>!r.pass)},null,2));}
console.log(JSON.stringify({checks:results.length,failures:results.filter(r=>!r.pass)}));assert.ok(results.every(r=>r.pass));
