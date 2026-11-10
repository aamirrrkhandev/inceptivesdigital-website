import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const base=process.argv[2]||'http://localhost:3100';
const browser=await chromium.launch();const results=[];
// Isolated provider fixture: no real challenge is solved and no enquiry is delivered.
const fixture=`window.qaWidgets=new Map();window.qaRenders=[];window.qaRemoved=[];window.qaResets=[];
window.turnstile={render(el,options){const id='qa-'+window.qaRenders.length;window.qaRenders.push({id,size:options.size});const input=document.createElement('input');input.type='hidden';input.name='cf-turnstile-response';el.append(input);const box=document.createElement('div');box.style.width=(options.size==='compact'?150:300)+'px';box.style.height=(options.size==='compact'?140:65)+'px';el.append(box);window.qaWidgets.set(id,{el,options,input,box});setTimeout(()=>{input.value='isolated-token';options.callback()},0);return id},reset(id){window.qaResets.push(id);const w=window.qaWidgets.get(id);if(w){w.input.value='';setTimeout(()=>{w.input.value='isolated-refreshed-token';w.options.callback()},0)}},remove(id){window.qaRemoved.push(id);const w=window.qaWidgets.get(id);w?.input.remove();w?.box.remove();window.qaWidgets.delete(id)}};`;
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:1000}});let scripts=0,requests=0;
 await ctx.route('https://challenges.cloudflare.com/turnstile/v0/api.js**',r=>++scripts===1?r.abort():r.fulfill({body:fixture,contentType:'text/javascript'}));
 await ctx.route('https://*.callrail.com/**',r=>r.abort());
 await ctx.route('https://clients.inceptivesdigital.com/**',r=>r.abort());
 await ctx.route('**/api/forms',r=>{requests++;return r.fulfill({status:422,json:{success:false,data:{message:'Isolated rejection'}}})});
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/contact-us',{waitUntil:'domcontentloaded'});
 const form=page.locator('#website-contact-page-enquiry');const protection=form.locator('[data-contact-verification]');
 await protection.locator(':scope').waitFor();await page.waitForFunction(()=>document.querySelector('#website-contact-page-enquiry [data-contact-verification]')?.dataset.verificationState==='error');
 await form.locator('input[type=email]').fill('qa@example.invalid');await form.locator('input[type=tel]').fill('2025550123');await form.locator('button[type=submit]').click();
 await page.waitForFunction(()=>document.querySelector('#website-contact-page-enquiry [data-contact-verification]')?.dataset.verificationState==='ready');
 assert.equal(scripts,2,'Failed script load can retry');assert.equal(requests,0,'Missing verification is never delivered');
 assert.equal(await protection.locator('input[name="cf-turnstile-response"]').getAttribute('data-cr-no-capture'),'');
 assert.equal(await page.evaluate(()=>window.qaRenders[0].size),'normal');
 results.push({check:'Script failure recovers on retry; single shared loader; token excluded from analytics',pass:true});
 await protection.evaluate(el=>{const w=[...window.qaWidgets.values()].find(w=>w.el===el);w.input.value='';w.options['expired-callback']()});
 await form.locator('button[type=submit]').click();await page.waitForFunction(()=>window.qaResets.length>0);assert.equal(requests,0);
 await page.setViewportSize({width:320,height:900});await page.waitForFunction(()=>window.qaRenders.some(w=>w.size==='compact'));
 assert.equal(await form.locator('input[type=email]').inputValue(),'qa@example.invalid','Resize retains enquiry');
 results.push({check:'Expired token is refreshed without delivery; narrow layout uses compact widget and retains entered values',pass:true});
 const before=await page.evaluate(()=>window.qaRenders.length);
 await page.evaluate(()=>{const f=document.createElement('form');f.id='qa-dynamic-form';f.dataset.contactForm='true';const c=document.createElement('div');c.dataset.contactVerification='true';c.dataset.sitekey='isolated-fixture';f.append(c);document.querySelector('.migrated-page').append(f);f.scrollIntoView()});
 await page.waitForFunction(n=>window.qaRenders.length>n,before);const dynamicId=await page.evaluate(()=>window.qaRenders.at(-1).id);
 await page.locator('#qa-dynamic-form').evaluate(el=>el.remove());await page.waitForFunction(id=>window.qaRemoved.includes(id),dynamicId);
 assert.equal(errors.length,0,errors.join('\n'));assert.equal(requests,0);
 results.push({check:'New form widgets mount automatically and release provider resources on removal',pass:true});
 await ctx.close();
}finally{await browser.close();fs.mkdirSync('audit/callrail-cloudflare',{recursive:true});fs.writeFileSync('audit/callrail-cloudflare/turnstile-tests.json',JSON.stringify(results,null,2))}
console.log(JSON.stringify(results));
