import fs from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {parseEnv} from 'node:util';
import env from '@next/env';
const {loadEnvConfig}=env;
loadEnvConfig(process.cwd(),false,{info(){},error(){}});
// Existing local verification files are ignored by Git. Read only public widget IDs.
for(const file of ['.env.staging.local','.env.production-forms.local'])if(fs.existsSync(file)) {
 const local=parseEnv(fs.readFileSync(file,'utf8'));
 for(const key of ['NEXT_PUBLIC_STAGING_TURNSTILE_SITE_KEY','NEXT_PUBLIC_PRODUCTION_TURNSTILE_SITE_KEY'])if(!process.env[key]&&local[key])process.env[key]=local[key];
}
const requiredKey=process.env.VERCEL_ENV==='production'?'NEXT_PUBLIC_PRODUCTION_TURNSTILE_SITE_KEY':process.env.VERCEL_ENV==='preview'?'NEXT_PUBLIC_STAGING_TURNSTILE_SITE_KEY':null;
if(requiredKey&&!process.env[requiredKey])throw Error(`Missing public configuration: ${requiredKey}`);
const destination='public/assets/standalone-forms';
fs.mkdirSync(destination,{recursive:true});
for(const name of ['ghl-tracking','callrail','callrail-transport','conversion-tracking','turnstile']) {
 let source=fs.readFileSync(`src/lib/${name}.ts`,'utf8');
 for(const key of ['NEXT_PUBLIC_STAGING_TURNSTILE_SITE_KEY','NEXT_PUBLIC_PRODUCTION_TURNSTILE_SITE_KEY']) {
  source=source.replaceAll(`process.env.${key}`,JSON.stringify(process.env[key]||''));
 }
 source=source.replace('"./callrail-transport"','"./callrail-transport.js"');
 const output=stripTypeScriptTypes(source,{mode:'strip'}).replace(/[ \t]+$/gm,'');
 fs.writeFileSync(`${destination}/${name}.js`,'// Generated from src/lib/'+name+'.ts; run scripts/prepare-standalone-form-runtime.mjs\n'+output);
}
console.log('Prepared standalone form runtime using shared GHL, CallRail and Turnstile modules.');
