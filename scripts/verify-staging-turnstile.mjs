import assert from 'node:assert/strict';
import fs from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
const source = fs.readFileSync('src/lib/staging-turnstile.ts', 'utf8').replace('import "server-only";', '');
const code = stripTypeScriptTypes(source);
const {verifyStagingTurnstile,stagingFormsEnabled} = await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const request = new Request('https://inceptives-homepage-review.vercel.app/api/forms');
const original = globalThis.fetch;
process.env.STAGING_TURNSTILE_SECRET_KEY='isolated-test-secret';
process.env.STAGING_FORMS_DELIVERY='ghl';
let calls=0;
const respond = (result,status=200) => globalThis.fetch=async(url,options)=>{
  calls++;
  assert.equal(url,'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  assert.equal(JSON.parse(options.body).secret,'isolated-test-secret');
  assert.equal(options.cache,'no-store');
  return Response.json(result,{status});
};
try {
  assert.equal(stagingFormsEnabled(),true);
  respond({success:true,hostname:new URL(request.url).hostname,action:'elementor-form'});
  assert.equal(await verifyStagingTurnstile(request,'valid-fixture'),true);
  for(const result of [{success:false},{success:true,hostname:'attacker.example',action:'elementor-form'},{success:true,hostname:new URL(request.url).hostname,action:'unrelated'}]){
    respond(result);assert.equal(await verifyStagingTurnstile(request,'invalid-fixture'),false);
  }
  const before=calls;
  assert.equal(await verifyStagingTurnstile(request,''),false);
  assert.equal(await verifyStagingTurnstile(request,'x'.repeat(2049)),false);
  assert.equal(calls,before);
  await assert.rejects(()=>verifyStagingTurnstile(new Request('https://inceptivesdigital.com/api/forms'),'fixture'));
  respond({},502);await assert.rejects(()=>verifyStagingTurnstile(request,'fixture'));
  globalThis.fetch=async()=>{throw Error('offline')};await assert.rejects(()=>verifyStagingTurnstile(request,'fixture'));
  delete process.env.STAGING_TURNSTILE_SECRET_KEY;
  await assert.rejects(()=>verifyStagingTurnstile(request,'fixture'));
  console.log(JSON.stringify({passed:true,checks:11,scope:'isolated server verification; no real CAPTCHA or delivery'}));
} finally { globalThis.fetch=original; }
