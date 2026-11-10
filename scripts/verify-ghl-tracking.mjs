import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {installCallRailFixture,verifyCallRailCapture} from './callrail-fixture.mjs';
const nativeCallRail=process.env.QA_CALLRAIL_NATIVE==='1';const callRailEvidence=[];
const local=process.argv[2]||'http://localhost:3100';
const host='https://inceptives-homepage-review.vercel.app';
const sdkPath='audit/ghl-external-tracking.js';
if(!fs.existsSync(sdkPath)){
 const response=await fetch('https://clients.inceptivesdigital.com/js/external-tracking.js',{signal:AbortSignal.timeout(20000)});
 assert.equal(response.status,200,'Official public GHL SDK available');
 fs.mkdirSync('audit',{recursive:true});fs.writeFileSync(sdkPath,await response.text());
}
const sdk=fs.readFileSync(sdkPath,'utf8');
const browser=await chromium.launch();
const evidence=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});context.setDefaultTimeout(30000);
 await context.addInitScript(()=>{window.turnstile={render(el){const input=document.createElement('input');input.type='hidden';input.name='cf-turnstile-response';input.value='isolated-ui-test';el.append(input);return'test'},reset(){},remove(){}}});
 await context.route('https://challenges.cloudflare.com/**',r=>r.abort());
 const callRail=nativeCallRail?await installCallRailFixture(context):undefined;
 if(!nativeCallRail)await context.route('https://*.callrail.com/**',r=>r.abort());
 await context.route('https://clients.inceptivesdigital.com/js/external-tracking.js',r=>r.fulfill({body:sdk,contentType:'text/javascript'}));
 const events=[];let failBackend=true,failGhl=false,backendCalls=0,acceptedGhl=0;
 await context.route('https://backend.leadconnectorhq.com/**',async r=>{
  let submission=false;if(r.request().method()==='POST'){const e=JSON.parse(r.request().postData());events.push(e);submission=e.type==='external_form_submission';if(submission&&!failGhl)acceptedGhl++}
  await r.fulfill({status:submission&&failGhl?502:200,json:{success:!failGhl},headers:{'access-control-allow-origin':'*','access-control-allow-methods':'POST,OPTIONS','access-control-allow-headers':'content-type'}});
 });
 await context.route(host+'/**',async r=>{
  const u=new URL(r.request().url());
  if(u.pathname==='/api/forms'){backendCalls++;await r.fulfill({status:failBackend?422:200,json:failBackend?{success:false,data:{message:'Isolated backend failure'}}:{success:true,data:{message:'Accepted'}}});return}
  const headers={...r.request().headers()};delete headers.origin;delete headers.host;
  const response=await r.fetch({url:local+u.pathname+u.search,headers});await r.fulfill({response});
 });
 const page=await context.newPage();const errors=[],consoleErrors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')consoleErrors.push(e.text().slice(0,500))});
 await page.goto(host+'/contact-us?utm_source=migration-qa&utm_medium=integration-test&gclid=qa-not-a-real-ad-click');
 await page.locator('html[data-ghl-tracking=ready]').waitFor().catch(async error=>{fs.mkdirSync('audit/ghl-tests',{recursive:true});fs.writeFileSync('audit/ghl-tests/debug.json',JSON.stringify({url:page.url(),errors,consoleErrors,dom:await page.locator('html').getAttribute('data-ghl-tracking'),scripts:await page.locator('script[src]').evaluateAll(nodes=>nodes.map(n=>n.src))},null,2));throw error});
 const form=page.locator('#website-contact-page-enquiry');await form.scrollIntoViewIfNeeded();
 if(nativeCallRail){
  await page.waitForFunction(()=>[...document.querySelectorAll('a[href^="tel:"]')].filter(a=>a.getAttribute('href')?.replace(/\D/g,'')==='12025550199').length>=3);
  const phones=await page.locator('a[href^="tel:"]').evaluateAll(ns=>ns.map(n=>({text:n.textContent,href:n.getAttribute('href')})));
  assert.ok(phones.every(n=>!n.href.replace(/\D/g,'').endsWith('4697888527')),'Every business click target swaps, including empty icon links');
  assert.equal(await page.locator('script#inceptives-callrail').count(),1,'One official snippet per document');
  assert.equal(await form.getAttribute('data-cr-no-capture'),'','Automatic premature capture excluded');
 }
 assert.equal(await form.locator('input[type=checkbox]').count(),0,'Removed consent controls');
 await form.locator('button[type=submit]').click();await page.waitForTimeout(200);
 assert.equal(backendCalls,0);assert.equal(events.filter(e=>e.type==='external_form_submission').length,0,'Invalid click must not count');
 for(const input of await form.locator('input[type=text]').all())await input.fill('Isolated QA');
 await form.locator('input[type=email]').fill('migration-qa@example.invalid');await form.locator('input[type=tel]').fill('2025550123');
 await form.locator('textarea').fill('Isolated native SDK integration test');
 await form.locator('input[name="cf-turnstile-response"]').waitFor({state:'attached'});
 await form.locator('button[type=submit]').click();await form.getByText('Isolated backend failure',{exact:true}).waitFor();await page.waitForTimeout(200);
 assert.equal(events.filter(e=>e.type==='external_form_submission').length,0,'Backend error must not count');
 failBackend=false;failGhl=true;await form.locator('button[type=submit]').click();await form.getByText('GHL could not accept your enquiry. Please retry.',{exact:true}).waitFor();
 assert.equal(backendCalls,2);assert.equal(await form.locator('input[type=email]').inputValue(),'migration-qa@example.invalid');
 failGhl=false;await form.locator('button[type=submit]').click();await page.waitForURL(host+'/thank-you');
 assert.equal(backendCalls,2,'GHL-only retry must not repeat successful WordPress delivery');assert.equal(acceptedGhl,1,'Exactly one accepted native GHL submission');
 const submissions=events.filter(e=>e.type==='external_form_submission');
 const submission=submissions.at(-1);assert.equal(submission.formId,'website-contact-page-enquiry');assert.ok(JSON.stringify(submission).includes('migration-qa@example.invalid'));
 if(callRail)callRailEvidence.push(await verifyCallRailCapture(callRail,'website-contact-page-enquiry'));
 assert.ok(JSON.stringify(submission).includes('utm_source=migration-qa'));assert.ok(JSON.stringify(submission).includes('qa-not-a-real-ad-click'));
 assert.ok(!Object.keys(submission.formData).some(k=>/consent|terms|field_37e8e1c|field_6c96fc9/.test(k)));
 assert.ok(submission.sessionId,'Native attribution session');assert.equal(errors.length,0,errors.join('\n'));
 evidence.push({check:'Real vendor SDK; invalid/backend-failed attempts excluded; GHL outage retains fields; CRM-only retry avoids duplicate WordPress delivery; acknowledgement precedes thank-you; attribution and no opt-in',formId:submission.formId,sessionPresent:true,pass:true,transport:'WordPress and GHL POST endpoints mocked; no real CRM record/email'});
 fs.mkdirSync('audit/ghl-tests',{recursive:true});fs.writeFileSync('audit/ghl-tests/native-payload.json',JSON.stringify(submission,null,2));
 await context.unrouteAll({behavior:"wait"});await context.close();
 for(const [path,id] of [
  ['/services','website-footer-enquiry'],
  ['/services','website-popup-enquiry'],
  ...['web-development','staff-augmentation','iot-development','virtual-reality-development','ar-app-development'].map(slug=>['/'+slug,'website-'+slug+'-enquiry']),
  ['/staff-augmentation','website-staff-assessment'],
  ['/ios-app-development','id-ios-form'],
 ]) {
  const ctx=await browser.newContext();const captured=[];let deliveries=0;
  await ctx.addInitScript(()=>{window.turnstile={render(el){const input=document.createElement('input');input.type='hidden';input.name='cf-turnstile-response';input.value='isolated-ui-test';el.append(input);return'test'},reset(){},remove(){}}});
  await ctx.route('https://challenges.cloudflare.com/**',r=>r.abort());
  const callRail=nativeCallRail?await installCallRailFixture(ctx):undefined;
  if(!nativeCallRail)await ctx.route('https://*.callrail.com/**',r=>r.abort());
  await ctx.route('https://clients.inceptivesdigital.com/js/external-tracking.js',r=>r.fulfill({body:sdk,contentType:'text/javascript'}));
  await ctx.route('https://backend.leadconnectorhq.com/**',async r=>{if(r.request().method()==='POST')captured.push(JSON.parse(r.request().postData()));await r.fulfill({json:{success:true},headers:{'access-control-allow-origin':'*','access-control-allow-methods':'POST,OPTIONS','access-control-allow-headers':'content-type'}})});
  await ctx.route(host+'/**',async r=>{const u=new URL(r.request().url());if(u.pathname==='/api/forms'){deliveries++;return r.fulfill({json:{success:true,data:{message:'Accepted'}}})}if(u.pathname==='/api/ios-assessment'){deliveries++;return r.fulfill({json:{success:true,data:{result:{title:'Isolated QA result',body:'Test only',native:90,cross:60,reasons:['Test']},answers:{platform:'iPhone only',hardware:'No',performance:'High',timeline:'6+ months'},contact:{name:'Isolated QA',email:'migration-qa@example.invalid'}}}})}try{return await r.fulfill({response:await r.fetch({url:local+u.pathname+u.search,maxRetries:2})})}catch{await r.abort().catch(()=>{})}});
  const p=await ctx.newPage();await p.goto(host+path+'?utm_source=isolated-all-forms');await p.locator('html[data-ghl-tracking=ready]').waitFor();await p.locator('[data-interactions-ready=true]').waitFor();
  const f=p.locator('form#'+id);assert.equal(await f.count(),1,id+' unique');assert.equal(await f.getByText(/I consent to receive/).count(),0,id+' no consent');
  if(id==='website-staff-assessment'){
   await p.locator('[data-secondary-ready=true]').waitFor();
   for(const [label,value] of [['Duration','1-2'],['Number of Specialists','1'],['Seniority','Junior'],['Language','javascript']])await f.getByLabel('developer '+label,{exact:true}).selectOption(value);
   await f.getByRole('button',{name:'Next',exact:true}).click();
   for(const [label,value] of [['Full Name','Isolated QA'],['Company','QA'],['Work Email','migration-qa@example.invalid'],['Phone','2025550123']])await f.getByLabel(label,{exact:true}).fill(value);
   await f.locator('[data-contact-verification]').scrollIntoViewIfNeeded();await f.locator('input[name="cf-turnstile-response"]').waitFor({state:'attached'});
   await f.getByRole('button',{name:'Submit Now'}).click();
  }else if(id==='id-ios-form'){
   const q=p.locator('#id-ios-348952[data-ios-ready=true]');await q.waitFor();
   for(let i=0;i<4;i++){await q.locator('.id-ios-step:visible input[type=radio]').first().check();await q.locator('.id-ios-next').click()}
   await f.locator('input[name=full_name]').fill('Isolated QA');await f.locator('input[name=email]').fill('migration-qa@example.invalid');await q.locator('.id-ios-send').click();
  }else await f.evaluate(el=>{for(const field of el.querySelectorAll('input,textarea')){if(field.type==='email')field.value='migration-qa@example.invalid';else if(field.type==='tel')field.value='2025550123';else if(['text','textarea'].includes(field.type))field.value='Isolated QA'}const t=document.createElement('input');t.type='hidden';t.name='cf-turnstile-response';t.value='isolated';el.append(t);el.dispatchEvent(new SubmitEvent('submit',{bubbles:true,cancelable:true}))});
  await p.waitForURL(host+'/thank-you');const submissions=captured.filter(e=>e.type==='external_form_submission');assert.equal(submissions.length,1,id);assert.equal(submissions[0].formId,id);assert.equal(deliveries,1);assert.ok(submissions[0].url.includes('utm_source=isolated-all-forms'));
  if(id==='website-staff-assessment'){assert.equal(submissions[0].formData.team_developer_duration,'1-2');assert.ok(JSON.stringify(submissions[0].formData.team_roles).includes('developer'))}
  if(id==='id-ios-form')for(const key of ['platform','hardware','performance','timeline','full_name','email'])assert.ok(submissions[0].formData[key],key+' retained in native CRM payload');
  if(callRail)callRailEvidence.push(await verifyCallRailCapture(callRail,id));
  fs.writeFileSync('audit/ghl-tests/'+id+'.json',JSON.stringify(submissions[0],null,2));
  evidence.push({formId:id,pass:true,nativeSdk:true,transport:'Both destinations mocked; no real CRM record/email'});await ctx.unrouteAll({behavior:"wait"});await ctx.close();
 }
}finally{await browser.close();fs.mkdirSync('audit/ghl-tests',{recursive:true});fs.writeFileSync('audit/ghl-tests/results.json',JSON.stringify(evidence,null,2));if(nativeCallRail)fs.writeFileSync('audit/callrail-cloudflare/sdk-tests.json',JSON.stringify(callRailEvidence,null,2))}
console.log(JSON.stringify(evidence));
