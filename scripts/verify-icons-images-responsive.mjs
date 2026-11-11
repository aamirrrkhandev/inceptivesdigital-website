import fs from 'node:fs';
import {chromium} from 'playwright';
const base=process.argv[2];
if(!base)throw Error('Pass deployment URL');
const entries=JSON.parse(fs.readFileSync('content/editable-pages-index.json'));
const paths=Object.entries(entries).filter(([,v])=>v.type!=='wordpress').map(([k])=>k);
const browser=await chromium.launch(),results=[];
try{
 const context=await browser.newContext({reducedMotion:'reduce'});
 await context.route(/googletagmanager\.com|google-analytics\.com|leadsy\.ai|livechatinc\.com|callrail\.com|leadconnectorhq\.com|clients\.inceptivesdigital\.com|challenges\.cloudflare\.com|calendly\.com/,r=>r.abort());
 for(const path of paths){
  const page=await context.newPage(),resources=[];
  page.on('response',r=>{if(r.url().startsWith(base+'/assets/')&&r.status()>=400)resources.push({url:r.url(),status:r.status()});});
  const row={path,viewports:[],resources};
  try{
   row.status=(await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:45000})).status();
   for(const width of [1440,375]){
    await page.setViewportSize({width,height:950});
    await page.evaluate(()=>{
     document.querySelectorAll('.e-con.e-parent').forEach(e=>e.classList.add('e-lazyloaded'));
     for(const img of document.images)if(img.getBoundingClientRect().width&&img.getBoundingClientRect().height)img.loading='eager';
    });
    await page.waitForFunction(()=>[...document.images].filter(i=>i.getBoundingClientRect().width&&i.getBoundingClientRect().height).every(i=>i.complete),{},{timeout:10000}).catch(()=>{});
    await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2500))]));
    row.viewports.push(await page.evaluate(({path,width})=>{
     const visible=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
     const headings=[...document.querySelectorAll('main h1')].filter(visible).map(e=>({text:e.textContent.slice(0,65),size:getComputedStyle(e).fontSize,weight:getComputedStyle(e).fontWeight}));
     const icons=[...document.querySelectorAll('main img[data-standard-icon=true],main .migrated-icon-box-icon .migrated-icon')].filter(visible).map(e=>{const r=e.getBoundingClientRect();return{width:r.width,height:r.height,src:e.getAttribute('src')}});
     const logos=[...document.querySelectorAll('main .e-con:has(> .globle-logo),main .e-con-inner:has(> .globle-logo)')].filter(visible).map(e=>({display:getComputedStyle(e).display,wrap:getComputedStyle(e).flexWrap,overflow:e.scrollWidth>e.clientWidth+2}));
     return{width,overflow:document.documentElement.scrollWidth>innerWidth+1,headings,icons,logos,broken:[...document.images].filter(i=>visible(i)&&i.complete&&!i.naturalWidth).map(i=>i.currentSrc||i.src),pending:[...document.images].filter(i=>visible(i)&&!i.complete).map(i=>i.currentSrc||i.src),headingFailures:headings.filter(h=>path!=='/'&&(h.size!=='18px'||h.weight!=='600')),iconFailures:icons.filter(i=>Math.abs(i.width-(width<768?30:45))>1||Math.abs(i.height-(width<768?30:45))>1),logoFailures:logos.filter(l=>l.display!=='flex'||l.wrap!=='wrap'||l.overflow)};
    },{path,width}));
   }
  }catch(error){row.error=error.message;}
  results.push(row);await page.close();
  fs.writeFileSync('audit/page-assets/icons-images-progress.json',JSON.stringify({base,results},null,2));
  console.log(JSON.stringify({path,completed:results.length,total:paths.length,error:row.error}));
 }
 await context.close();
}finally{await browser.close();}
const failures=results.filter(r=>r.status!==200||r.error||r.resources.length||r.viewports.some(v=>v.overflow||v.broken.length||v.pending.length||v.headingFailures.length||v.iconFailures.length||v.logoFailures.length));
fs.writeFileSync('audit/page-assets/icons-images-responsive.json',JSON.stringify({base,results,failures},null,2));
console.log(JSON.stringify({pages:results.length,failures:failures.map(r=>({path:r.path,error:r.error,resources:r.resources,viewports:r.viewports.filter(v=>v.overflow||v.broken.length||v.pending.length||v.headingFailures.length||v.iconFailures.length||v.logoFailures.length)}))}));
if(failures.length)process.exitCode=1;
