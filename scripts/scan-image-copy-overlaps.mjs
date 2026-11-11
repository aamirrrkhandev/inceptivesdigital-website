import fs from 'node:fs';
import {chromium} from 'playwright';
const base=process.argv[2],local=process.argv.includes('--local-css');
const index=JSON.parse(fs.readFileSync('content/editable-pages-index.json'));
const urls=Object.entries(index).filter(([,e])=>e.type!=='wordpress').map(([url])=>url);
const browser=await chromium.launch(),results=[];
try{
 const page=await browser.newPage({viewport:{width:755,height:950},reducedMotion:'reduce'});
 await page.route(/googletagmanager\.com|google-analytics\.com|leadsy\.ai|livechatinc\.com|callrail\.com|leadconnectorhq\.com|clients\.inceptivesdigital\.com|challenges\.cloudflare\.com|calendly\.com/,r=>r.abort());
 if(local)await page.route('**/assets/styles/site-typography.css',r=>r.fulfill({path:'public/assets/styles/site-typography.css',contentType:'text/css'}));
 for(const url of urls){
  try{await page.goto(base+url,{waitUntil:'domcontentloaded',timeout:45000});}
  catch{await page.goto(base+url,{waitUntil:'domcontentloaded',timeout:45000});}
  await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,4000))]));
  const issues=await page.evaluate(()=>{
   const visible=el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return r.width&&r.height&&s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0;};
   const texts=[...document.querySelectorAll('main h1,main h2,main h3,main p,main .migrated-widget-text-editor')].filter(visible).map(el=>{
    const range=document.createRange();range.selectNodeContents(el);return {el,text:el.textContent.trim().replace(/\s+/g,' ').slice(0,90),rects:[...range.getClientRects()].filter(r=>r.width>8&&r.height>8)};
   });
   const issues=[];
   for(const widget of document.querySelectorAll('main .migrated-widget-image')){
    if(!visible(widget))continue;const img=widget.querySelector('img');if(!img||!visible(img))continue;
    const image=img.getBoundingClientRect(),box=widget.getBoundingClientRect();
    if(image.width<100||image.height<100||image.bottom<=box.bottom+8)continue;
    const overlap=texts.find(t=>t.text&&!t.el.contains(img)&&t.rects.some(r=>Math.min(image.right,r.right)-Math.max(image.left,r.left)>12&&Math.min(image.bottom,r.bottom)-Math.max(image.top,r.top)>6));
    if(overlap)issues.push({image:img.getAttribute('src'),imageWidget:widget.getAttribute('data-id'),text:overlap.text,overflowPixels:Math.round(image.bottom-box.bottom)});
   }
   return issues;
  });results.push({url,issues});
  fs.writeFileSync('audit/page-assets/lower-section-overlaps.json',JSON.stringify({base,width:755,localStylesheetOverride:local,results},null,2));
  if(issues.length)console.log(JSON.stringify({url,issues}));
 }
}finally{await browser.close();}
console.log(JSON.stringify({scanned:results.length,candidatePages:results.filter(r=>r.issues.length).length}));
