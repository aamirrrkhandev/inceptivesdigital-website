import fs from 'node:fs';
import assert from 'node:assert/strict';
import {expect} from '@playwright/test';
const dir='audit/callrail-cloudflare';
export async function installCallRailFixture(context,options={}){
 fs.mkdirSync(dir,{recursive:true});
 const files=[['swap.js','https://cdn.callrail.com/companies/691547027/8acc5c6cc37011b7cee7/12/swap.js'],['external-forms.js','https://js.callrail.com/companies/691547027/external_forms.js']];
 for(const [file,url] of files)if(!fs.existsSync(dir+'/'+file)){const r=await fetch(url);assert.equal(r.status,200);fs.writeFileSync(dir+'/'+file,await r.text())}
 const captures=[],accepted=[];
 const assignment={a:{'691547027':{'4697888527':{national:'(202) 555-0199',national_string:'2025550199',international:'+1 202-555-0199',e164:'+12025550199',formats:{},sms_enabled:false}}},r:{},domless:false,number_assignment:true,integration_retry:false,integration_retries:[]};
 await context.route('https://*.callrail.com/**',async route=>{
  const url=new URL(route.request().url());
  const headers={'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type,accept'};
  if(url.pathname.endsWith('/swap.js'))return route.fulfill({body:fs.readFileSync(dir+'/swap.js','utf8'),contentType:'text/javascript',headers});
  if(url.pathname.endsWith('/external_forms.js')){if(options.moduleDelay)await new Promise(r=>setTimeout(r,options.moduleDelay));return route.fulfill({body:fs.readFileSync(dir+'/external-forms.js','utf8'),contentType:'text/javascript',headers});}
  if(url.pathname.includes('swap_session'))return route.fulfill({json:assignment,headers});
  if(url.pathname.endsWith('/form_capture.json')&&route.request().method()==='POST'){captures.push(JSON.parse(route.request().postData()));if(options.captureDelay)await new Promise(r=>setTimeout(r,options.captureDelay));await route.fulfill({json:{success:true},headers});accepted.push(Date.now());return;}
  return route.fulfill({json:{success:true},headers});
 });
 return {captures,accepted};
}
export async function verifyCallRailCapture(fixture,id){
 await expect.poll(()=>fixture.captures.length,{timeout:15000}).toBeGreaterThan(0);
 assert.equal(new Set(fixture.captures.map(c=>c.uuid)).size,1,id+' one vendor submission UUID (persisted retry may repeat the same UUID)');
 const capture=fixture.captures[0];
 assert.ok(JSON.stringify(capture.form).includes('migration-qa@example.invalid'),id+' email captured');
 assert.ok(!JSON.stringify(capture.form).includes('isolated-token'));
 assert.ok(!Object.keys(capture.form).some(k=>/captcha|turnstile|post_id|form_id|referer_title/i.test(k)),id+' excludes backend/challenge controls');
 fs.writeFileSync(dir+'/capture-'+id+'.json',JSON.stringify(capture,null,2));
 return {formId:id,callRailSdk:true,uniqueSubmissionUUIDs:1,transport:'Native GHL and CallRail SDKs; both remote delivery destinations and WordPress mocked'};
}
