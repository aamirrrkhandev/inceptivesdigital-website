import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import * as cheerio from 'cheerio';
const base=process.argv[2];if(!base)throw Error('Specify preview URL');
const index=JSON.parse(fs.readFileSync('content/editable-pages-index.json'));
const paths=Object.entries(index).filter(([,e])=>e.type!=='wordpress').map(([url])=>url);
const browser=await chromium.launch(),results=[];let cursor=0;
try{await Promise.all(Array.from({length:3},async()=>{
 const context=await browser.newContext({reducedMotion:'reduce'});
 // Isolate layout checks from third-party widgets. Integrations are checked separately.
 await context.route(/googletagmanager\.com|google-analytics\.com|leadsy\.ai|livechatinc\.com|callrail\.com|leadconnectorhq\.com|clients\.inceptivesdigital\.com|challenges\.cloudflare\.com|calendly\.com/,r=>r.abort());
 while(cursor<paths.length){
  const url=paths[cursor++],page=await context.newPage(),row={url,viewports:[],failedResources:[]};
  page.on('response',r=>{if(r.url().startsWith(base+'/assets/')&&r.status()>=400)row.failedResources.push({url:r.url(),status:r.status()});});
  try{
   const response=await page.goto(base+url,{waitUntil:'domcontentloaded',timeout:60000});row.status=response.status();
   await page.locator('[data-interactions-ready=true]').first().waitFor({timeout:30000});
   await page.evaluate(()=>document.fonts.ready);
   for(const width of [1920,1366,820,375]){
    await page.setViewportSize({width,height:900});
    await page.waitForTimeout(180);
    await page.waitForFunction(()=>[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.width&&r.height&&r.top<innerHeight&&r.bottom>0&&r.left<innerWidth&&r.right>0;}).every(i=>i.complete),{},{timeout:20000}).catch(()=>{});
    const state=await page.evaluate(()=>({
     width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
     broken:[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.width&&r.height&&r.top<innerHeight&&r.bottom>0&&r.left<innerWidth&&r.right>0&&i.complete&&!i.naturalWidth;}).map(i=>i.currentSrc||i.src),
     oldImages:[...document.images].map(i=>i.getAttribute('src')).filter(s=>s&&/\/(wp-content\/uploads|restored-assets|media)\//.test(s)),
     oldVideos:[...document.querySelectorAll('video,source')].flatMap(v=>['src','data-media-src','data-mobile-src','poster'].map(k=>v.getAttribute(k))).filter(s=>s&&/\/(wp-content\/uploads|restored-assets|media)\//.test(s)),
     textIssues:[...document.querySelectorAll('main h1,main h2,main h3,main p,button,.sitekit-navbar-nav a')].filter(el=>{
      const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width&&r.height&&s.visibility!=='hidden'&&s.display!=='none'&&el.scrollWidth>el.clientWidth+2&&['hidden','clip'].includes(s.overflowX);
     }).slice(0,20).map(el=>({text:el.textContent.trim().slice(0,90),width:el.clientWidth,scrollWidth:el.scrollWidth})),
     fontFamilies:[...new Set([...document.querySelectorAll('main h1,main h2,main p,header a,button')].filter(el=>el.getBoundingClientRect().width).map(el=>getComputedStyle(el).fontFamily))],
     headingSizes:[...document.querySelectorAll('main h1,main h2')].filter(el=>el.getBoundingClientRect().width).map(el=>({tag:el.tagName,size:parseFloat(getComputedStyle(el).fontSize)})),
     oversizedContainers:innerWidth>=1700?[...document.querySelectorAll('.e-con.e-parent.e-con-boxed > .e-con-inner,.header-containers > .e-con-inner')].filter(el=>el.getBoundingClientRect().width>1601).map(el=>Math.round(el.getBoundingClientRect().width)):[],
    }));row.viewports.push(state);
    if(state.broken.length||state.scrollWidth>width+1)await page.screenshot({path:`audit/page-assets/failure-${url.replaceAll('/','-')||'home'}-${width}.png`});
   }
   const $=cheerio.load(await page.content());row.canonical=$('link[rel=canonical]').attr('href');
   row.schemaValid=$('script[type="application/ld+json"]').toArray().every(e=>{try{JSON.parse($(e).text());return true;}catch{return false;}});
  }catch(error){row.error=error.message;}
  results.push(row);await page.close();console.log(JSON.stringify({url,status:row.status,completed:results.length,total:paths.length,error:row.error}));
 }
 await context.close();
}));}finally{await browser.close();}
const failures=results.filter(r=>r.status!==200||r.error||!r.schemaValid||r.failedResources.length||r.viewports.some(v=>v.scrollWidth>v.width+1||v.broken.length||v.oldImages.length||v.oldVideos.length||v.textIssues.length||v.fontFamilies.some(f=>!f.includes('Plus Jakarta Sans'))||v.oversizedContainers.length));
fs.writeFileSync('audit/page-assets/browser.json',JSON.stringify({results,failures},null,2));
console.log(JSON.stringify({pages:results.length,viewports:results.reduce((n,r)=>n+r.viewports.length,0),failures:failures.map(r=>({url:r.url,error:r.error,viewports:r.viewports,failedResources:r.failedResources}))}));
assert.equal(failures.length,0,'Review responsive/resource failures');
