import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.argv[2]||'http://localhost:3100',browser=await chromium.launch(),results=[];
try{
 const context=await browser.newContext({reducedMotion:'reduce'});
 // Layout fixture only: no challenge token, API submission or CRM record.
 await context.addInitScript(()=>{let count=0;window.turnstile={render(container,options){const id='layout-'+(++count),box=document.createElement('div');container.dataset.qaWidgetSize=options.size;box.dataset.layoutFixture=id;box.style.cssText=options.size==='flexible'?'width:100%;min-width:300px;height:65px':'width:150px;height:140px';container.append(box);return id;},remove(id){document.querySelector('[data-layout-fixture="'+id+'"]')?.remove();},reset(){}};});
 await context.route(/challenges\.cloudflare\.com|googletagmanager\.com|google-analytics\.com|leadsy\.ai|livechatinc\.com|callrail\.com|leadconnectorhq\.com|clients\.inceptivesdigital\.com/,r=>r.abort());
 const page=await context.newPage();page.setDefaultTimeout(12000);
 for(const width of[320,375,519,820,1024,1440]){
  await page.setViewportSize({width,height:950});await page.goto(base+'/contact-us',{waitUntil:'domcontentloaded',timeout:45000});
  for(const id of['website-contact-page-enquiry','website-footer-enquiry']){
   if(id==='website-footer-enquiry')await page.goto(base+'/services',{waitUntil:'domcontentloaded',timeout:45000});
   const form=page.locator('#'+id),container=form.locator('[data-contact-verification]');await form.scrollIntoViewIfNeeded();await container.locator('[data-layout-fixture]').waitFor({state:'attached'});
   const result=await container.evaluate(e=>{const p=e.parentElement,s=getComputedStyle(p),expected=p.clientWidth-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight);return{size:e.dataset.qaWidgetSize,width:e.getBoundingClientRect().width,parentContentWidth:expected,overflow:document.documentElement.scrollWidth>innerWidth+1};});
   assert.ok(Math.abs(result.width-result.parentContentWidth)<=2,JSON.stringify({width,id,...result}));assert.equal(result.size,result.width<300?'compact':'flexible');assert.equal(result.overflow,false);results.push({width,id,...result});
  }
 }
 await context.close();
}finally{await browser.close();fs.writeFileSync('audit/page-assets/turnstile-layout.json',JSON.stringify({transport:'SDK layout fixture; no real CAPTCHA solve or submission',results},null,2));}
console.log(JSON.stringify({checks:results.length,results}));
