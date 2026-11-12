// Explicitly authorized real vendor delivery probe, without deploying the website.
// This isolates the native GHL/CallRail transports; it does not claim CAPTCHA E2E coverage.
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const host=process.env.QA_TRACKING_ORIGIN||'https://inceptives-homepage-review.vercel.app';
const local=process.env.TEST_BASE_URL||'http://localhost:3102';
const stamp=new Date().toISOString().replace(/\D/g,'').slice(0,14);
const browser=await chromium.launch();const results=[];
try {
 const responses=[];
 for(const [index,variant]of ['hero','footer','modal'].entries()) {
 const context=await browser.newContext();
 await context.route(host+'/**',async route=>{
  const url=new URL(route.request().url());
  if(url.pathname.startsWith('/assets/standalone-forms/')) {
   const response=await route.fetch({url:local+url.pathname});return route.fulfill({response});
  }
  return route.fulfill({contentType:'text/html',body:`<!doctype html><title>Authorized migration transport QA</title><h1>Migration QA — vendor delivery only</h1><div id="forms"></div><script type="module">import {ensureGhlTracking,recordGhlSubmission} from '/assets/standalone-forms/ghl-tracking.js';import {loadCallRail,captureCallRailSubmission} from '/assets/standalone-forms/callrail.js';window.probe={ensureGhlTracking,recordGhlSubmission,loadCallRail,captureCallRailSubmission};</script>`});
 });
 const page=await context.newPage();
 page.on('response',response=>{const u=new URL(response.url());if(u.hostname==='backend.leadconnectorhq.com'&&u.pathname==='/external-tracking/events'||u.hostname.endsWith('.callrail.com')&&u.pathname.endsWith('/form_capture.json'))responses.push({variant,vendor:u.hostname.includes('callrail')?'CallRail':'GHL',method:response.request().method(),status:response.status(),at:new Date().toISOString()});});
 await page.goto(host+'/custom-mobile-application-development?utm_source=migration-qa&utm_medium=real-transport-verification');
 await page.waitForFunction(()=>Boolean(window.probe));
  const id=`custom-mobile-${variant}-enquiry`;
  const name=`Migration QA ${stamp} ${variant}`;
  const result=await page.evaluate(async ({id,name,index,stamp})=>{
   const form=document.createElement('form');form.id=id;form.setAttribute('data-contact-form','');
   for(const [key,value] of Object.entries({name,email:`migration-${stamp}-${index}@example.invalid`,phone:`+1202555019${index}`,message:'Authorized migration QA. Test record only. No follow-up requested.',source_path:'/custom-mobile-application-development'})){
    const input=document.createElement('input');input.name=key;input.value=value;input.type=key==='email'?'email':key==='phone'?'tel':'text';form.append(input);
   }
   const button=document.createElement('button');button.type='submit';button.textContent='QA enquiry';form.append(button);document.querySelector('#forms').append(form);
   let ghl='unconfirmed';let error;
   try{await window.probe.ensureGhlTracking();await window.probe.recordGhlSubmission(form);ghl='confirmed';}catch(e){error=e.message;}
   await window.probe.captureCallRailSubmission(form);
   return {id,name,ghl,error,callrail:form.dataset.callrailCapture||'unavailable'};
  },{id,name,index,stamp});
  results.push(result);console.log(JSON.stringify(result));
  await context.close();
 }
 await fs.writeFile('audit/html-file-manager-2026-11-12/real-transports.json',JSON.stringify({stamp,results,responses,realVendorRequests:true,applicationSecurityGateTested:false,websiteDeployed:false},null,2));
}finally{await browser.close();}
