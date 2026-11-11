import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {installCallRailFixture} from './callrail-fixture.mjs';
const base=process.argv[2]||'http://localhost:3103';
const host='https://inceptives-homepage-review.vercel.app';
const results=[];const browser=await chromium.launch();
try{for(const id of ['website-footer-enquiry','website-popup-enquiry']){
 const ctx=await browser.newContext();
 await ctx.addInitScript(()=>{window.turnstile={render(el){const input=document.createElement('input');input.type='hidden';input.name='cf-turnstile-response';input.value='isolated';el.append(input);return'test'},reset(){},remove(){}}});
 await ctx.route('https://challenges.cloudflare.com/**',r=>r.abort());
 await ctx.route('https://clients.inceptivesdigital.com/js/external-tracking.js',r=>r.fulfill({body:fs.readFileSync('audit/ghl-external-tracking.js','utf8'),contentType:'text/javascript'}));
 await ctx.route('https://backend.leadconnectorhq.com/**',r=>r.fulfill({json:{success:true},headers:{'access-control-allow-origin':'*','access-control-allow-methods':'POST,OPTIONS','access-control-allow-headers':'content-type'}}));
 const fixture=await installCallRailFixture(ctx,{moduleDelay:3500,captureDelay:2000});
 await ctx.route(host+'/**',async r=>{const u=new URL(r.request().url());if(u.pathname==='/api/forms')return r.fulfill({json:{success:true,data:{message:'Isolated'}}});const response=await r.fetch({url:base+u.pathname+u.search});await r.fulfill({response});});
 const page=await ctx.newPage();await page.goto(host+'/?utm_source=isolated-timing');await page.locator('html[data-ghl-tracking=ready]').waitFor();await page.locator('[data-interactions-ready=true]').waitFor();
 if(id.includes('popup'))await page.getByRole('link',{name:'Get In Touch',exact:true}).click();
 const f=page.locator('#'+id);for(const input of await f.locator('input:not([type=hidden]),textarea').all()){const name=await input.getAttribute('name');if(!name||/captcha|turnstile/i.test(name))continue;const type=await input.getAttribute('type');await input.fill(type==='email'?'migration-qa@example.invalid':type==='tel'?'2025550123':'Isolated timing QA');}
 await f.locator('button[type=submit]').click();await page.waitForURL(host+'/thank-you');const navigatedAt=Date.now();
 const pass=fixture.captures.length===1&&fixture.accepted.length===1&&fixture.accepted[0]<=navigatedAt;
 results.push({formId:id,moduleDelay:3500,responseDelay:2000,requests:fixture.captures.length,acceptedBeforeThankYou:pass,transport:'All endpoints isolated; no real CRM/email/CallRail record'});
 await ctx.unrouteAll({behavior:'wait'});await ctx.close();
 if(!process.env.CALLRAIL_BASELINE)assert.ok(pass,id+' must await capture acceptance before leaving');
}}finally{await browser.close();fs.writeFileSync('audit/callrail-cloudflare/homepage-timing-'+(process.env.CALLRAIL_BASELINE?'before':'after')+'.json',JSON.stringify(results,null,2));}
console.log(JSON.stringify(results));
