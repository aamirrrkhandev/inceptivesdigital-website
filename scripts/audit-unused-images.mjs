import fs from 'node:fs';import path from 'node:path';import zlib from 'node:zlib';import crypto from 'node:crypto';
const root=process.cwd(),publicRoot=path.resolve('public'),index=JSON.parse(fs.readFileSync('content/media-index.json'));
const catalog=JSON.parse(zlib.brotliDecompressSync(fs.readFileSync('content/site-catalog.json.br')));
const maps={};for(const file of['audit/full/asset-map.json','audit/refresh-2026-11-10/asset-map.json'])if(fs.existsSync(file))Object.assign(maps,JSON.parse(fs.readFileSync(file)));
const refs=new Map();
function add(raw,where){if(!raw||raw.startsWith('data:'))return;let candidate=maps[raw]||raw;try{const url=new URL(candidate,'https://inceptivesdigital.com');if(url.origin==='https://inceptivesdigital.com')candidate=url.pathname;else if(!maps[raw])return;}catch{return}candidate=candidate.split(/[?#]/)[0];for(const key of new Set([candidate,decodeURI(candidate)])){if(!refs.has(key))refs.set(key,new Set());refs.get(key).add(where)}}
function scan(value,where){if(typeof value==='string'){
 if(value.startsWith('data:'))return;
 if(/^(?:https?:\/\/|\/(?:assets|media|wp-content\/uploads)\/)[^\r\n]+$/.test(value)&&!/[<>]/.test(value))add(value,where);
 for(const match of value.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/g))add(match[1]||match[2]||match[3],where);
 for(const match of value.matchAll(/(?:https?:\/\/|\/(?:assets|media|wp-content\/uploads)\/)[^\s"'<>\\),;]+/g))add(match[0],where);
 }else if(Array.isArray(value))value.forEach(v=>scan(v,where));else if(value&&typeof value==='object')Object.values(value).forEach(v=>scan(v,where))}
for(const entry of Object.values(catalog)){const page=JSON.parse(zlib.brotliDecompressSync(Buffer.from(entry.data,'base64')));scan(page,page.path)}
function walk(dir){if(!fs.existsSync(dir))return[];return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{const file=path.join(dir,entry.name);if(entry.isSymbolicLink())return[];return entry.isDirectory()?walk(file):[file]})}
// Client build chunks include active PDF/script asset references, without counting the full server media registry as usage.
for(const file of walk('.next-parity/static/chunks').filter(f=>f.endsWith('.js')))scan(fs.readFileSync(file,'utf8'),'active-client-script');
for(const file of['src/app/layout.tsx','src/app/site.css','src/components/ios-assessment.js'])scan(fs.readFileSync(file,'utf8'),'active-source:'+file);
let changed=true;while(changed){changed=false;for(const [url,entry]of Object.entries(index)){if(!refs.has(url))continue;for(const dependency of[entry.optimized,entry.poster,entry.mobileVideo])if(dependency&&!refs.has(dependency)){add(dependency,'asset-dependency:'+url);changed=true}}}
const image=/\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i;
const physical=walk('public').filter(file=>image.test(file)).map(file=>{const relative=path.relative(publicRoot,path.resolve(file)).replaceAll('\\','/');const url='/'+relative;const used=refs.has(url)||refs.has(encodeURI(url));return{file:path.resolve(file),url,bytes:fs.statSync(file).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),used,references:[...(refs.get(url)||refs.get(encodeURI(url))||[])]}});
const packed=Object.entries(index).filter(([,entry])=>entry.type.startsWith('image/')).map(([url,entry])=>({url,...entry,used:refs.has(url)||refs.has(decodeURI(url)),references:[...(refs.get(url)||refs.get(decodeURI(url))||[])]}));
const report={checkedAt:new Date().toISOString(),pages:Object.keys(catalog).length,scope:'Current page catalog, CSS, metadata, responsive variants, active client scripts and derived asset dependencies. Audit snapshots are excluded.',physical,packed,unusedPhysical:physical.filter(f=>!f.used),unusedPacked:packed.filter(f=>!f.used)};
fs.writeFileSync('audit/unused-image-inventory.json',JSON.stringify(report,null,2));console.log(JSON.stringify({pages:report.pages,physical:physical.length,unusedPhysical:report.unusedPhysical.length,unusedPhysicalBytes:report.unusedPhysical.reduce((s,f)=>s+f.bytes,0),packed:packed.length,unusedPacked:report.unusedPacked.length,unusedPackedBytes:report.unusedPacked.reduce((s,f)=>s+f.size,0),unusedPhysicalSample:report.unusedPhysical.slice(0,8).map(f=>f.url),unusedPackedSample:report.unusedPacked.slice(0,8).map(f=>f.url)}));
