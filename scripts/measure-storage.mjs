import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import crypto from 'node:crypto';
const tracked=execFileSync('git',['ls-files','-z'],{encoding:'utf8',maxBuffer:32*1024*1024}).split('\0').filter(Boolean);
const totals={trackedFiles:tracked.length,trackedBytes:0,publicFiles:0,publicBytes:0,pageAssetFiles:0,pageAssetBytes:0,sharedAssetFiles:0,sharedAssetBytes:0,packedMediaBytes:0,otherSourceBytes:0};const kinds={};
for(const file of tracked){
 if(!fs.existsSync(file))continue;const bytes=fs.statSync(file).size;totals.trackedBytes+=bytes;
 if(file.startsWith('public/')){
  totals.publicFiles++;totals.publicBytes+=bytes;const ext=file.split('.').pop().toLowerCase();(kinds[ext]??={files:0,bytes:0}).files++;kinds[ext].bytes+=bytes;
  if(file.startsWith('public/assets/pages/')){totals.pageAssetFiles++;totals.pageAssetBytes+=bytes;}
  if(file.startsWith('public/assets/shared/')){totals.sharedAssetFiles++;totals.sharedAssetBytes+=bytes;}
 }else if(file.startsWith('content/media/'))totals.packedMediaBytes+=bytes;else totals.otherSourceBytes+=bytes;
}
const unique=new Set(),seen=new Set();let uniqueBytes=0;const ix=JSON.parse(fs.readFileSync('content/editable-pages-index.json'));
for(const e of Object.values(ix)){
 if(e.type==='wordpress')continue;
 for(const a of JSON.parse(fs.readFileSync('src/page-content/'+e.folder+'/assets.json')).files){
  if(seen.has(a.file))continue;seen.add(a.file);const b=fs.readFileSync(a.file),key=crypto.createHash('sha256').update(b).digest('hex');if(!unique.has(key)){unique.add(key);uniqueBytes+=b.length;}
 }
}
const directoryBytes=folder=>{
 if(!fs.existsSync(folder))return 0;
 let total=0;for(const item of fs.readdirSync(folder,{withFileTypes:true})){const p=folder+'/'+item.name;total+=item.isDirectory()?directoryBytes(p):item.isFile()?fs.statSync(p).size:0;}return total;
};
const cacheFolders=fs.readdirSync('.').filter(n=>/^\.next(?:-|$)/.test(n)&&fs.statSync(n).isDirectory());
const cacheBytes=Object.fromEntries(cacheFolders.map(n=>[n,directoryBytes(n)]));
const report={measuredAt:new Date().toISOString(),...totals,activeManifestFiles:seen.size,activeUniqueFiles:unique.size,activeUniqueBytes:uniqueBytes,kinds,localBuildCaches:cacheBytes,localBuildCacheBytes:Object.values(cacheBytes).reduce((a,b)=>a+b,0),nodeModulesBytes:directoryBytes('node_modules'),gitBytes:directoryBytes('.git'),note:'Logical local/tracked file bytes, not compressed Git transfer or Vercel billed storage. Packed media retain legacy URLs. Blogs remain API-managed. Local caches/node_modules/.git are not public website downloads.'};
fs.mkdirSync('audit/page-assets',{recursive:true});fs.writeFileSync('audit/page-assets/storage.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
