import fs from 'node:fs';
import {chromium} from 'playwright';
const base=process.argv[2]||'http://localhost:3100';
const index=JSON.parse(fs.readFileSync('content/editable-pages-index.json'));
const paths=Object.entries(index).filter(([,e])=>e.type!=='wordpress').map(([p])=>p);
const browser=await chromium.launch(),results=[];
const progress='audit/page-assets/local-banner-progress.json';
if(process.argv.includes('--resume')&&fs.existsSync(progress)){const old=JSON.parse(fs.readFileSync(progress));if(old.base===base)results.push(...old.results);}
const done=new Set(results.map(r=>r.path));
const bounded=(promise,ms,label)=>Promise.race([promise,new Promise((_,reject)=>{const timer=setTimeout(()=>reject(Error(label+' timed out')),ms);timer.unref();})]);
try{
 const context=await browser.newContext({reducedMotion:'reduce'});
 await context.route(/googletagmanager\.com|google-analytics\.com|leadsy\.ai|livechatinc\.com|callrail\.com|leadconnectorhq\.com|clients\.inceptivesdigital\.com|challenges\.cloudflare\.com|calendly\.com/,r=>r.abort());
 for(const path of paths){
  if(done.has(path))continue;
  console.log(JSON.stringify({path,state:'starting'}));
  const page=await context.newPage(),errors=[],row={path,errors,viewports:[]};page.setDefaultTimeout(12000);
  page.on('console',m=>{if(m.type()==='error'&&/unique.*key|Invalid DOM property|hydration/i.test(m.text()))errors.push(m.text());});
  page.on('pageerror',e=>errors.push(e.message));
  try{
   row.status=(await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:45000})).status();
   for(const width of[320,375,820,1440]){
    await bounded(page.setViewportSize({width,height:950}),15000,'Viewport');
    await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2500))]));
    row.viewports.push(await page.evaluate(({path,width})=>{
     const visible=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
     const heading=[...document.querySelectorAll('main h1,main h2')].find(visible);
     const header=document.querySelector('.header-containers');
     const h1s=[...document.querySelectorAll('main h1')].filter(visible);
     const paragraphs=[...document.querySelectorAll('.migrated-page p')].filter(visible);
     const logos=[...document.querySelectorAll('main img[data-client-logo=true]')].filter(visible);
     return{width,headingTop:heading?.getBoundingClientRect().top,headerBottom:header?.getBoundingClientRect().bottom,overlap:!!heading&&!!header&&heading.getBoundingClientRect().top<header.getBoundingClientRect().bottom-1,overflow:document.documentElement.scrollWidth>innerWidth+1,h1Failures:h1s.filter(e=>path!=='/'&&(getComputedStyle(e).fontSize!=='18px'||getComputedStyle(e).fontWeight!=='600')).map(e=>({text:e.textContent.slice(0,60),size:getComputedStyle(e).fontSize,weight:getComputedStyle(e).fontWeight})),paragraphs:paragraphs.length,paragraphFailures:paragraphs.filter(e=>getComputedStyle(e).fontSize!==(width<768?'14px':'16px')).map(e=>({text:e.textContent.slice(0,50),size:getComputedStyle(e).fontSize})),logos:logos.length,logoFailures:logos.filter(e=>Math.abs(e.getBoundingClientRect().width-100)>1||Math.abs(e.getBoundingClientRect().height-100)>1).map(e=>({src:e.getAttribute('src'),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))};
    },{path,width}));
   }
  }catch(error){row.error=error.message;}
  results.push(row);
  fs.writeFileSync('audit/page-assets/local-banner-progress.json',JSON.stringify({base,results},null,2));
  await bounded(page.close(),10000,'Page cleanup').catch(()=>{});
  console.log(JSON.stringify({path,completed:results.length,total:paths.length,error:row.error}));
 }
 await context.close();
}finally{await browser.close();}
const failures=results.filter(r=>r.status!==200||r.error||r.errors.length||r.viewports.some(v=>v.overlap||v.overflow||v.h1Failures.length||v.paragraphFailures.length||v.logoFailures.length));
fs.writeFileSync('audit/page-assets/local-banner-typography.json',JSON.stringify({base,results,failures},null,2));
console.log(JSON.stringify({pages:results.length,checks:results.reduce((n,r)=>n+r.viewports.length,0),failures}));
if(failures.length)process.exitCode=1;
