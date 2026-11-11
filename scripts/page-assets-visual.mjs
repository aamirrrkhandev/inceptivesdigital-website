import fs from 'node:fs';
import {chromium} from 'playwright';
import sharp from 'sharp';
const [base,label]=process.argv.slice(2),dir='audit/page-assets/visuals';fs.mkdirSync(dir,{recursive:true});
const paths=['/','/mobile-app-development','/ios-app-development','/cross-platform-app-development','/blockchain-development','/ar-app-development','/virtual-reality-development','/iot-app-development','/mobile-game-development'];
const browser=await chromium.launch(),results=[];
try{for(const url of paths)for(const width of [1366,820,375]){
 const context=await browser.newContext({viewport:{width,height:950},reducedMotion:'reduce'});
 // This comparison isolates asset rewiring from the separately approved font/layout update.
 await context.route('**/assets/styles/site-typography.css',r=>r.abort());
 await context.route(/googletagmanager\.com|google-analytics\.com|leadsy\.ai|livechatinc\.com|callrail\.com|leadconnectorhq\.com|clients\.inceptivesdigital\.com|challenges\.cloudflare\.com|calendly\.com/,r=>r.abort());
 const page=await context.newPage();await page.goto(base+url,{waitUntil:'domcontentloaded',timeout:60000});
 await page.locator('[data-interactions-ready=true]').first().waitFor();await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.width&&r.height&&r.top<innerHeight&&r.bottom>0&&r.left<innerWidth&&r.right>0;}).every(i=>i.complete),{},{timeout:20000}).catch(()=>{});
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}video{visibility:hidden!important}'});
 const file=dir+'/'+(url==='/'?'home':url.slice(1))+'-'+width;
 const image=await page.screenshot({path:file+'-'+label+'.png',animations:'disabled',mask:[page.locator('a[href^="tel:"]')]});
 if(label==='after'){
  const [a,b]=await Promise.all([fs.readFileSync(file+'-before.png'),image].map(b=>sharp(b).ensureAlpha().raw().toBuffer()));let changed=0;
  for(let i=0;i<a.length;i+=4)if(Math.max(Math.abs(a[i]-b[i]),Math.abs(a[i+1]-b[i+1]),Math.abs(a[i+2]-b[i+2]))>10)changed++;
  results.push({url,width,changedPixels:changed,ratio:changed/(a.length/4),pass:changed/(a.length/4)<=0.001});
 }
 await context.close();console.log(url+' '+width+' '+label);
}}finally{await browser.close();}
if(label==='after'){fs.writeFileSync('audit/page-assets/visuals.json',JSON.stringify(results,null,2));console.log(JSON.stringify({comparisons:results.length,failures:results.filter(r=>!r.pass)}));if(results.some(r=>!r.pass))process.exitCode=1;}
