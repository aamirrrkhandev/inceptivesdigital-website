import fs from 'node:fs';
import {chromium} from 'playwright';
if(process.env.LIVE_FORM_QA!=='confirmed')throw Error('Real production lead creation requires explicit user authorization');
const base='https://inceptivesdigital.com',run=Date.now(),output='audit/live-production-forms';
fs.mkdirSync(output,{recursive:true});
const cases=[['/services','website-footer-enquiry'],['/','website-popup-enquiry'],['/contact-us','website-contact-page-enquiry'],...['web-development','staff-augmentation','iot-app-development','virtual-reality-development','ar-app-development','mobile-game-development'].map(s=>['/'+s,'website-'+(s==='iot-app-development'?'iot-development':s)+'-enquiry']),['/staff-augmentation','website-staff-assessment'],['/ios-app-development','id-ios-form']];
const browser=await chromium.launch({headless:false,args:['--host-resolver-rules=MAP inceptivesdigital.com 216.150.1.1','--force-renderer-accessibility']});
const context=await browser.newContext({viewport:{width:1440,height:950}}),results=[];
try{
 for(const [path,id]of cases){
  const page=await context.newPage(),events=[];
  const label=id.replace('website-','').replace('-enquiry',''),email=`migration-qa-${label}-${run}@example.invalid`;
  const row={path,id,email,label,events,transport:'Real production API, real Cloudflare widget, real GHL and CallRail; no delivery mocks'};
  page.on('response',r=>{
   const u=r.url();
   if(u.startsWith(base+'/api/'))events.push({kind:'website-api',status:r.status(),endpoint:new URL(u).pathname});
   if(u.includes('/external-tracking/events')&&r.request().method()==='POST'){
    try{const e=JSON.parse(r.request().postData());if(e.type==='external_form_submission')events.push({kind:'ghl-submission',status:r.status(),formId:e.form?.id||e.form_id||e.formId});}catch{}
   }
   if(u.includes('/form_capture.json'))events.push({kind:'callrail',status:r.status()});
  });
  try{
   await page.goto(base+path+`?utm_source=migration-qa&utm_medium=live-form-test&utm_campaign=production-${run}`,{waitUntil:'domcontentloaded'});
   if(id==='website-popup-enquiry')await page.getByRole('link',{name:'Get In Touch',exact:true}).first().click();
   const form=page.locator('#'+id);
   await form.waitFor({state:'attached'});
   if(id==='website-staff-assessment'){
    for(const [name,value]of[['Duration','1-2'],['Number of Specialists','1'],['Seniority','Junior'],['Language','javascript']])await form.getByLabel('developer '+name,{exact:true}).selectOption(value);
    await form.getByRole('button',{name:'Next',exact:true}).click();
    for(const [name,value]of[['Full Name','Migration QA Live Staff Assessment'],['Company','Migration QA Test'],['Work Email',email],['Phone','2025550123']])await form.getByLabel(name,{exact:true}).fill(value);
   }else if(id==='id-ios-form'){
    for(let step=0;step<4;step++){await form.locator('.id-ios-step:visible input[type=radio]').first().check();await form.locator('.id-ios-next').click();}
    await form.locator('[name=full_name]').fill('Migration QA Live iOS');await form.locator('[name=email]').fill(email);await form.locator('[name=company]').fill('Migration QA Test');
   }else{
    for(const input of await form.locator('input:not([type=hidden]),textarea').all()){
     const name=await input.getAttribute('name'),type=await input.getAttribute('type');if(!name||/captcha|turnstile/i.test(name)||['checkbox','radio','submit','button'].includes(type))continue;
     await input.fill(type==='email'?email:type==='tel'?'2025550123':/message|subject/i.test(name)?'Migration QA Test: production form verification. Please disregard this test enquiry.':'Migration QA Live '+label);
    }
   }
   await form.scrollIntoViewIfNeeded();
   console.log(JSON.stringify({state:'AWAITING_REAL_SECURITY_VERIFICATION',id,path,run}));
   await page.screenshot({path:output+'/'+label+'-ready.png'});
   // Never solve, replace or bypass CAPTCHA. The genuine widget must succeed
   // normally or the user must complete its visible interactive challenge.
   await form.locator('[data-verification-state=ready]').waitFor({state:'attached',timeout:240000});
   const submit=id==='id-ios-form'?form.locator('.id-ios-send'):form.locator('button[type=submit]');
   await submit.click();
   await page.waitForURL(base+'/thank-you',{timeout:65000});
   row.thankYou=true;row.apiAccepted=events.some(e=>e.kind==='website-api'&&e.status===200);row.ghlAcknowledged=events.some(e=>e.kind==='ghl-submission'&&e.status>=200&&e.status<300);row.callrailAcknowledged=events.some(e=>e.kind==='callrail'&&e.status===200);
   await page.screenshot({path:output+'/'+label+'-thank-you.png'});
  }catch(error){row.error=error.message;row.visibleStatus=await page.locator('[data-form-status],.id-ios-status').allTextContents().catch(()=>[]);await page.screenshot({path:output+'/'+label+'-failure.png'}).catch(()=>{});}
  results.push(row);fs.writeFileSync(output+'/results.json',JSON.stringify({run,results},null,2));console.log(JSON.stringify(row));
  if(row.error){console.log('PAUSED_ON_FAILURE: browser retained for inspection');await new Promise(resolve=>browser.on('disconnected',resolve));break;}
  await page.close();
 }
}finally{await browser.close();}
