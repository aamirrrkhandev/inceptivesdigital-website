import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
import {installCallRailFixture} from './callrail-fixture.mjs';
const local=process.env.TEST_BASE_URL||'http://localhost:3101';
const host='https://inceptivesdigital.com';
const sdk=await fs.readFile('audit/ghl-external-tracking.js','utf8');
const qualification=JSON.parse(await fs.readFile('content/lead-qualification.json','utf8'));
const browser=await chromium.launch();const results=[];
try {
 for(const [index,id] of ['custom-mobile-hero-enquiry','custom-mobile-footer-enquiry','custom-mobile-modal-enquiry','custom-mobile-hero-enquiry','custom-mobile-footer-enquiry','custom-mobile-modal-enquiry'].entries()) {
  const context=await browser.newContext();let backendFailure=true,ghlReject=false,submissions=0,legacyCalls=0;
  const ghlPayloads=[];
  await context.addInitScript(()=>{
   window.dataLayer=[];window.__qaConversions=[];
   const push=window.dataLayer.push.bind(window.dataLayer);window.dataLayer.push=(...events)=>{for(const e of events)if(e.event==='lead_submitted'){window.__qaConversions.push(e);sessionStorage.setItem('qa-conversions',String(Number(sessionStorage.getItem('qa-conversions')||0)+1));}return push(...events);};
  });
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());
   // Simulate GTM's published Call Rail tag; use the native vendor SDK with
   // isolated assignment/capture responses, never a real tracking submission.
   if(url.hostname==='www.googletagmanager.com'&&url.pathname==='/gtm.js')return route.fulfill({contentType:'text/javascript',body:`const s=document.createElement('script');s.src='https://cdn.callrail.com/companies/691547027/8acc5c6cc37011b7cee7/12/swap.js';document.head.append(s);`});
   if(url.href==='https://clients.inceptivesdigital.com/js/external-tracking.js')return route.fulfill({body:sdk,contentType:'text/javascript'});
   if(url.hostname==='backend.leadconnectorhq.com') {
    if(route.request().method()==='POST') {
     const payload=route.request().postDataJSON();
     if(payload.type==='external_form_submission'){submissions++;ghlPayloads.push(payload);}
    }
    return route.fulfill({status:ghlReject?502:200,json:{success:!ghlReject},headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type','Access-Control-Allow-Methods':'POST,OPTIONS'}});
   }
   if(url.hostname==='hooks.zapier.com'){legacyCalls++;return route.abort();}
   if(url.origin!==host)return route.abort();
   if(url.pathname==='/api/standalone-enquiry')return route.fulfill({status:backendFailure?400:200,json:backendFailure?{success:false,message:'Isolated validation failure'}:{success:true,delivery:'ghl-pending'}});
   if(url.pathname==='/thank-you')return route.fulfill({body:'<!doctype html><title>QA thank you</title><h1>Thank you</h1>',contentType:'text/html'});
   const response=await route.fetch({url:local+url.pathname+url.search});return route.fulfill({response});
  });
  const callrail=await installCallRailFixture(context);
  const page=await context.newPage();await page.goto(host+'/custom-mobile-application-development?utm_source=isolated-qa');
  await expect(page.locator('html')).toHaveAttribute('data-ghl-tracking','ready');
  if(id.endsWith('modal-enquiry'))await page.locator('[data-open-modal]').first().click();
  const form=page.locator('#'+id);await form.scrollIntoViewIfNeeded();
  await form.locator('[name="name"]').fill('Isolated QA');await form.locator('[name="email"]').fill('qa@example.invalid');await form.locator('[name="phone"]').fill('2025550199');
  assert.equal(await form.locator('[name="budget"]').evaluate(e=>e.required),true);
  assert.equal(await form.locator('[name="timeline"]').evaluate(e=>e.required),true);
  await form.locator('[type="submit"]').click();assert.equal(submissions,0);
  const budget=qualification.budgetOptions[index],timeline=qualification.timelineOptions[index%qualification.timelineOptions.length];
  await form.locator('[name="budget"]').selectOption(budget);await form.locator('[type="submit"]').click();assert.equal(submissions,0);
  await form.locator('[name="timeline"]').selectOption(timeline);
  await expect(form.locator('[name="cf-turnstile-response"]')).toHaveCount(0);
  await expect(form.locator('[name="website_confirmation"]')).toHaveCount(1);
  await form.locator('[type="submit"]').click();await expect(form.locator('[data-form-status]')).toHaveText('Isolated validation failure');
  assert.equal(submissions,0);assert.equal(callrail.captures.length,0);assert.equal(await page.evaluate(()=>window.__qaConversions.length),0);await expect(form.locator('[name="email"]')).toHaveValue('qa@example.invalid');
  backendFailure=false;
  if(index===0) {
   ghlReject=true;await form.locator('[type="submit"]').click();await expect(form.locator('[data-form-status]')).toContainText('GHL could not accept',{timeout:25000});
   assert.equal(await page.evaluate(()=>window.__qaConversions.length),0);assert(!page.url().includes('/thank-you'));submissions=0;ghlReject=false;
  }
  await form.locator('[type="submit"]').click();await page.waitForURL('**/thank-you',{timeout:30000});
  assert.equal(submissions,1);assert.equal(legacyCalls,0);
  assert.equal(callrail.captures.length,1,'one native CallRail capture');
  assert(JSON.stringify(ghlPayloads.at(-1)).includes(budget),'GHL receives budget');
  assert(JSON.stringify(ghlPayloads.at(-1)).includes(timeline),'GHL receives timeline');
  assert(JSON.stringify(callrail.captures.at(-1)).includes(budget),'CallRail receives budget');
  assert(JSON.stringify(callrail.captures.at(-1)).includes(timeline),'CallRail receives timeline');
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('qa-conversions')),'1');
  // Capture the conversion before navigation destroys the page via an init-script session marker.
  results.push({id,budget,timeline,backendFailurePreventedDelivery:true,ghlFailureChecked:index===0,successAcknowledged:true,ghlSubmissions:submissions,callrailCaptures:callrail.captures.length,legacyWebhookCalls:legacyCalls});
  await context.close();
 }
 const security=[];
 for(const [origin,fields] of [[null,{}],[local,{form_id:'unknown'}],[local,{form_id:'custom-mobile-hero-enquiry',source_path:'/custom-mobile-application-development',name:'QA',email:'invalid',phone:'2025550199'}]]) {
  const data=new FormData();for(const [key,value]of Object.entries(fields))data.set(key,value);
  const response=await fetch(local+'/api/standalone-enquiry',{method:'POST',headers:origin?{Origin:origin}:{},body:data});
  assert(response.status>=400);security.push({originProvided:Boolean(origin),status:response.status});
 }
 await fs.writeFile('audit/html-file-manager-2026-11-12/delivery-verification.json',JSON.stringify({results,security,realSubmissions:false,vendorResponsesMocked:true},null,2));
 console.log(JSON.stringify({results,security},null,2));
}finally{await browser.close();}
