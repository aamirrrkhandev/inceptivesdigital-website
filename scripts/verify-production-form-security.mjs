import fs from 'node:fs';
import assert from 'node:assert/strict';
import {stripTypeScriptTypes} from 'node:module';
const code=stripTypeScriptTypes(fs.readFileSync('src/lib/staging-turnstile.ts','utf8')).replace('import "server-only";','').replaceAll('export ','');
const {verifyStagingTurnstile,stagingFormsEnabled}=new Function(code+';return {verifyStagingTurnstile,stagingFormsEnabled};')();
process.env.STAGING_FORMS_DELIVERY='ghl';process.env.PRODUCTION_FORMS_DELIVERY='ghl';process.env.STAGING_TURNSTILE_SECRET_KEY='qa-staging';process.env.PRODUCTION_TURNSTILE_SECRET_KEY='qa-production';
const original=global.fetch;let responseHost='',action='elementor-form',success=true,calls=0,lastSecret='';
global.fetch=async(url,options)=>{assert.equal(url,'https://challenges.cloudflare.com/turnstile/v0/siteverify');calls++;lastSecret=JSON.parse(options.body).secret;return Response.json({success,hostname:responseHost,action});};
const req=host=>new Request('https://'+host+'/api/forms');let passed=0;
try {
 for(const host of ['inceptivesdigital.com','www.inceptivesdigital.com','inceptives-homepage-review.vercel.app']){responseHost=host;assert.equal(stagingFormsEnabled(req(host)),true);assert.equal(await verifyStagingTurnstile(req(host),'qa-token'),true);assert.equal(lastSecret,host.includes('vercel')?'qa-staging':'qa-production');passed++;}
 responseHost='inceptives-homepage-review.vercel.app';assert.equal(await verifyStagingTurnstile(req('inceptivesdigital.com'),'qa-token'),false);passed++;
 responseHost='inceptivesdigital.com';assert.equal(await verifyStagingTurnstile(req('inceptives-homepage-review.vercel.app'),'qa-token'),false);passed++;
 action='wrong';assert.equal(await verifyStagingTurnstile(req('inceptivesdigital.com'),'qa-token'),false);passed++;action='elementor-form';success=false;assert.equal(await verifyStagingTurnstile(req('inceptivesdigital.com'),'qa-token'),false);passed++;
 await assert.rejects(verifyStagingTurnstile(req('evil.example'),'qa-token'));passed++;
 assert.equal(await verifyStagingTurnstile(req('inceptivesdigital.com'),''),false);passed++;assert.equal(await verifyStagingTurnstile(req('inceptivesdigital.com'),'x'.repeat(2049)),false);passed++;
 delete process.env.PRODUCTION_TURNSTILE_SECRET_KEY;await assert.rejects(verifyStagingTurnstile(req('inceptivesdigital.com'),'qa-token'));passed++;
 process.env.PRODUCTION_FORMS_DELIVERY='';assert.equal(stagingFormsEnabled(req('inceptivesdigital.com')),false);passed++;
 console.log(JSON.stringify({passed,calls,transport:'Cloudflare response mocked; actual hostname/key/action validation code',liveRequests:0}));
} finally {global.fetch=original;}
