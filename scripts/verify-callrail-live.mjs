import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
if(process.env.CALLRAIL_QA_LIVE!=='confirmed')throw Error('Requires explicit authorization for real CallRail QA records');
const host='https://inceptives-homepage-review.vercel.app';
const run=Date.now();const email=`migration-callrail-${run}@example.invalid`;
const results=[];const browser=await chromium.launch();
const cases=[['/contact-us','website-contact-page-enquiry'],['/','website-footer-enquiry'],['/','website-popup-enquiry'],...['web-development','staff-augmentation','iot-development','virtual-reality-development','ar-app-development'].map(s=>['/'+s,'website-'+s+'-enquiry']),['/staff-augmentation','website-staff-assessment'],['/ios-app-development','id-ios-form']];
try{for(const [path,id] of cases){
 const ctx=await browser.newContext({viewport:{width:1440,height:1000}});const captures=[],accepted=[];
 // Only CallRail is live. These isolated browser fixtures never alter the deployed app.
 await ctx.addInitScript(()=>{window.turnstile={render(el){const input=document.createElement('input');input.type='hidden';input.name='cf-turnstile-response';input.value='isolated-callrail-qa';el.append(input);return'test'},reset(){},remove(){}}});
 await ctx.route('https://challenges.cloudflare.com/**',r=>r.abort());
 await ctx.route('https://clients.inceptivesdigital.com/js/external-tracking.js',r=>r.fulfill({body:fs.readFileSync('audit/ghl-external-tracking.js','utf8'),contentType:'text/javascript'}));
 await ctx.route('https://backend.leadconnectorhq.com/**',r=>r.fulfill({json:{success:true},headers:{'access-control-allow-origin':'*','access-control-allow-methods':'POST,OPTIONS','access-control-allow-headers':'content-type'}}));
 await ctx.route(host+'/api/forms',r=>r.fulfill({json:{success:true,data:{message:'Isolated backend fixture'}}}));
 await ctx.route(host+'/api/ios-assessment',r=>r.fulfill({json:{success:true,data:{result:{title:'Isolated tracking QA',body:'Not a genuine assessment result',native:90,cross:60,reasons:['Tracking test']},answers:{platform:'iPhone only',hardware:'Yes',performance:'High',timeline:'6+ months'},contact:{name:'CallRail QA iOS',email}}}}));
 const p=await ctx.newPage();
 p.on('request',r=>{if(r.method()==='POST'&&r.url().includes('/form_capture.json'))captures.push(JSON.parse(r.postData()))});
 p.on('response',r=>{if(r.url().includes('/form_capture.json'))accepted.push({status:r.status(),at:Date.now()})});
 await p.goto(host+path+'?utm_source=migration-qa&utm_medium=integration-test&utm_campaign=callrail-fix-'+run);
 await p.locator('html[data-ghl-tracking=ready]').waitFor();await p.locator('[data-interactions-ready=true]').waitFor();
 if(id==='website-popup-enquiry')await p.getByRole('link',{name:'Get In Touch',exact:true}).click();
 const f=p.locator('#'+id);
 if(id==='website-staff-assessment'){
  for(const [label,value] of [['Duration','1-2'],['Number of Specialists','1'],['Seniority','Junior'],['Language','javascript']])await f.getByLabel('developer '+label,{exact:true}).selectOption(value);
  await f.getByRole('button',{name:'Next',exact:true}).click();
  for(const [label,value] of [['Full Name','CallRail QA Staff Assessment'],['Company','Migration QA'],['Work Email',email],['Phone','2025550123']])await f.getByLabel(label,{exact:true}).fill(value);
 }else if(id==='id-ios-form'){
  for(let i=0;i<4;i++){await f.locator('.id-ios-step:visible input[type=radio]').first().check();await f.locator('.id-ios-next').click()}
  await f.locator('[name=full_name]').fill('CallRail QA iOS');await f.locator('[name=email]').fill(email);
 }else{
  for(const input of await f.locator('input:not([type=hidden]),textarea').all()){
   const name=await input.getAttribute('name');if(!name||/captcha|turnstile/i.test(name))continue;
   const type=await input.getAttribute('type');await input.fill(type==='email'?email:type==='tel'?'2025550123':'CallRail QA '+id);
  }
 }
 await f.locator('[name="cf-turnstile-response"]').waitFor({state:'attached'});
 await f.locator('button[type=submit]').click();await p.waitForURL(host+'/thank-you',{timeout:30000});const navigated=Date.now();
 assert.equal(new Set(captures.map(c=>c.uuid)).size,1,id+' one native UUID');
 assert.ok(accepted.some(a=>a.status===200&&a.at<=navigated),id+' real acceptance before thank-you');
 assert.equal(captures[0].form_metadata.id,id);
 assert.ok(!JSON.stringify(captures[0].form).includes('isolated-callrail-qa'));
 results.push({formId:id,email,uuid:captures[0].uuid,url:captures[0].url,sessionPresent:Boolean(captures[0].session_uuid),acceptedBeforeThankYou:true,statuses:accepted.map(a=>a.status),transport:'Real CallRail SDK/destination; challenge, backend and GHL isolated; no CRM record/email'});
 await ctx.close();
}}finally{await browser.close();fs.writeFileSync('audit/callrail-cloudflare/live-all-forms.json',JSON.stringify({run,email,results},null,2));}
console.log(JSON.stringify({run,email,results}));
