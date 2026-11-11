import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import sharp from 'sharp';
const before=process.argv[2]||'http://localhost:3105',after=process.argv[3]||'http://localhost:3106';
const browser=await chromium.launch();const results=[];fs.mkdirSync('audit/page-structure/visuals',{recursive:true});
try {
  for(const path of ['/','/ios-app-development','/blockchain-development','/web-development'])for(const width of [390,768,1366,1920]) {
    const context=await browser.newContext({viewport:{width,height:950},reducedMotion:'reduce'});
    await context.route(/callrail\.com|leadconnectorhq\.com|clients\.inceptivesdigital\.com|challenges\.cloudflare\.com|calendly\.com/,route=>route.abort());
    const buffers=[];
    for(const [label,base]of [['before',before],['after',after]]) {
      const page=await context.newPage();await page.goto(base+path,{waitUntil:'load'});await page.locator('[data-interactions-ready=true]').waitFor();await page.evaluate(()=>document.fonts.ready);
      await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}video{visibility:hidden!important}'});
      await page.evaluate(()=>{document.querySelectorAll('video').forEach(video=>video.pause());});
      await page.waitForTimeout(500);
      const name=(path==='/'?'home':path.slice(1))+'-'+width+'-'+label+'.png';
      buffers.push(await page.screenshot({path:'audit/page-structure/visuals/'+name,animations:'disabled'}));await page.close();
    }
    const [a,b]=await Promise.all(buffers.map(buffer=>sharp(buffer).ensureAlpha().raw().toBuffer()));let changed=0;
    for(let i=0;i<a.length;i+=4)if(Math.max(Math.abs(a[i]-b[i]),Math.abs(a[i+1]-b[i+1]),Math.abs(a[i+2]-b[i+2]))>10)changed++;
    const ratio=changed/(a.length/4);results.push({path,width,changedPixelRatio:ratio,pass:ratio<=0.001});
    await context.close();
  }
} finally {await browser.close();fs.writeFileSync('audit/page-structure/visuals.json',JSON.stringify(results,null,2));}
console.log(JSON.stringify({comparisons:results.length,failed:results.filter(result=>!result.pass)}));assert.ok(results.every(result=>result.pass),'Meaningful visual differences require review');
