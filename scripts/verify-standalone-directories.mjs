import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import {load} from 'cheerio';
const base=process.env.TEST_BASE_URL||'http://localhost:3101';
const manifest=JSON.parse(await fs.readFile('audit/html-file-manager-2026-11-12/recovery-manifest.json','utf8'));
const assets=[];
for(const item of manifest.files.filter(f=>f.status===200)) {
  if(item.path.endsWith('/index.html')) {
    const response=await fetch(base+item.path,{redirect:'manual'});
    assets.push({path:item.path,status:response.status,pass:response.status===301&&response.headers.get('location')===item.path.replace('/index.html','')});
    continue;
  }
  const encodedPath=item.path.split('/').map(segment=>encodeURIComponent(decodeURIComponent(segment))).join('/');
  const response=await fetch(base+encodedPath);
  const bytes=Buffer.from(await response.arrayBuffer());
  assets.push({path:item.path,status:response.status,bytes:bytes.length,expectedBytes:item.bytes,pass:response.status===200&&bytes.length===item.bytes});
}
const browser=await chromium.launch();const results=[];
for(const slug of ['reviews','custom-mobile-application-development'])for(const width of [390,1440]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  // No customer data, pixel hits, uploads, or real submissions during local QA.
  await page.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
  const response=await page.goto(base+'/'+slug,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,35));}scrollTo(0,0);});
  await page.waitForLoadState('networkidle');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(async image=>{image.loading='eager';try{await image.decode();}catch{}}));});
  const original=load(await fs.readFile('public/'+slug+'/index.html','utf8'));
  const result=await page.evaluate(()=>({title:document.title,canonical:document.querySelector('link[rel="canonical"]')?.getAttribute('href')||null,robots:document.querySelector('meta[name="robots"]')?.getAttribute('content')||null,forms:document.forms.length,headings:[...document.querySelectorAll('h1')].map(e=>e.textContent),brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.getAttribute('src')),overflow:document.documentElement.scrollWidth>innerWidth}));
  if(slug==='reviews') {await page.locator('.platform-grid button').first().count().then(n=>result.platformButtons=n);result.platformCards=await page.locator('.platform-card').count();}
  await page.screenshot({path:`audit/html-file-manager-2026-11-12/${slug}-${width}.png`,fullPage:true});
  results.push({slug,width,status:response.status(),...result,metadataPreserved:result.title===original('title').text()&&result.canonical===(original('link[rel="canonical"]').attr('href')||null)&&result.robots===(original('meta[name="robots"]').attr('content')||null),errors});await page.close();
}
await browser.close();
const output={base,assets,results,realSubmissionsTested:false,externalServicesBlockedDuringQA:true};
await fs.writeFile('audit/html-file-manager-2026-11-12/local-verification.json',JSON.stringify(output,null,2));
console.log(JSON.stringify({assets:assets.length,assetFailures:assets.filter(a=>!a.pass),results:results.map(r=>({...r,brokenImages:[...new Set(r.brokenImages)]}))},null,2));
if(assets.some(a=>!a.pass)||results.some(r=>r.status!==200||!r.metadataPreserved||r.brokenImages.length||r.overflow||r.errors.length))process.exitCode=1;
