// Deliberate authoring migration, never run automatically during a build.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {loadEditableModels} from './editable-model-loader.mjs';
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const index=read('content/editable-pages-index.json');
const existing=read('src/page-content/_shared/asset-map.json');
for(const entry of Object.values(index)){
 const file=`src/page-content/${entry.folder}/assets.json`;
 if(fs.existsSync(file))for(const asset of read(file).files||[])if(asset.sourceUrl&&!existing[asset.sourceUrl]&&fs.existsSync(asset.file))existing[asset.sourceUrl]=asset;
}
const media=read('content/media-index.json');
const parts=read('content/file-parts.json');
const {getEditablePage}=loadEditableModels();
const aliases={},report={pages:[],failures:[]};
const exported=new Map();
const remoteBytes=new Map();
const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,10);
const sharedSources=new Set(Object.keys(media).filter(source=>/logo|icon|clutch|bark|trustpilot|badge|award|\.(woff2?|ttf|otf|eot)$/i.test(source)));
for(const source of sharedSources)for(const key of ['optimized','poster','mobileVideo'])if(media[source]?.[key])sharedSources.add(media[source][key]);
const packed=entry=>{
 const file=`content/media/${entry.pack}.pack`,out=Buffer.alloc(entry.size);let skip=entry.offset,written=0;
 for(const part of parts[file]||[file]){
  const size=fs.statSync(part).size;if(skip>=size){skip-=size;continue;}
  const length=Math.min(size-skip,out.length-written),fd=fs.openSync(part,'r');
  try{let done=0;while(done<length){const n=fs.readSync(fd,out,written+done,length-done,skip+done);if(!n)throw Error('Truncated media');done+=n;}}finally{fs.closeSync(fd);}
  written+=length;skip=0;if(written===out.length)break;
 }
 if(written!==out.length)throw Error('Incomplete media');return out;
};
async function materialize(source,folder){
 const key=folder+'|'+source;if(exported.has(key))return exported.get(key);
 const promise=(async()=>{
  const old=existing[source],entry=media[source];let bytes;
  if(old?.file&&fs.existsSync(old.file))bytes=fs.readFileSync(old.file);
  else if(source==='https://businessfirms.co/images/bfirms-certified.png'&&fs.existsSync('audit/page-assets/originals/bfirms-certified.png'))bytes=fs.readFileSync('audit/page-assets/originals/bfirms-certified.png');
  else if(entry)bytes=packed(entry);
  else if(source.startsWith('/')&&fs.existsSync('public'+decodeURI(source)))bytes=fs.readFileSync('public'+decodeURI(source));
  else if(/^https:\/\//.test(source)){
   if(!remoteBytes.has(source))remoteBytes.set(source,(async()=>{
    const response=await fetch(source,{signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw Error('Remote image unavailable: '+response.status);
    const bytes=Buffer.from(await response.arrayBuffer());
    // Some original badge hosts omit Content-Type. Validate the actual image.
    await sharp(bytes).metadata();
    return bytes;
   })());
   bytes=await remoteBytes.get(source);
  }else throw Error('No local original');
  const pathname=new URL(source,'https://local.invalid').pathname;
  const kind=/\.(woff2?|ttf|otf|eot)$/i.test(pathname)?'fonts':/\.(mp4|webm|mov)$/i.test(pathname)?'videos':'images';
  let name=decodeURIComponent(path.basename(pathname)).replace(/[<>:"/\\|?*\x00-\x1f]/g,'-').slice(-150);
  if(!name.includes('.'))name+='.png';
  // Repeated brand marks and fonts stay shared. Main illustrations are page-owned.
  const shared=sharedSources.has(source)||kind==='fonts'||/logo|icon|clutch|bark|trustpilot|badge|award/i.test(name);
  const file=`public/assets/${shared?'shared':'pages/'+folder}/${kind}/${hash(source)}-${name}`;
  fs.mkdirSync(path.dirname(file),{recursive:true});
  if(fs.existsSync(file)){
   if(!fs.readFileSync(file).equals(bytes))throw Error('Preserving edited asset: '+file);
  }else fs.writeFileSync(file,bytes);
  return {sourceUrl:source,file,publicUrl:encodeURI('/'+file.slice(7)),kind,bytes:bytes.length};
 })();exported.set(key,promise);return promise;
}
for(const [url,entry]of Object.entries(index)){
 if(entry.type==='wordpress')continue;
 console.log('Mapping '+url);
 const folder='src/page-content/'+entry.folder,file=folder+'/assets.json',assets=read(file),page=getEditablePage(url);
 const used=new Set([...assets.images.map(a=>a.sourceUrl),...assets.backgrounds.map(a=>a.sourceUrl),...assets.files.map(a=>a.sourceUrl).filter(Boolean)]);
 const text=JSON.stringify(page.nodes)+' '+JSON.stringify(page.editableSections||[])+' '+page.css+' '+(page.secondaryStyles||'');
 for(const source of Object.keys(media))if(text.includes(source))used.add(source);
 for(const source of [...used])for(const property of ['optimized','poster','mobileVideo'])if(media[source]?.[property])used.add(media[source][property]);
 const map={};
 for(const source of used){
  if(!source||source.startsWith('data:'))continue;
  try{map[source]=await materialize(source,entry.folder);}catch(error){report.failures.push({url,source,error:error.message});}
 }
 const replacements={...map};
 for(const old of assets.files)if(map[old.sourceUrl]&&old.publicUrl)replacements[old.publicUrl]=map[old.sourceUrl];
 const replace=value=>Object.entries(replacements).sort(([a],[b])=>b.length-a.length).reduce((v,[source,target])=>v.replace(new RegExp(RegExp.escape(source)+'(?=[\\s"\'(),]|$)','g'),()=>target.publicUrl),value);
 for(const image of assets.images){
  const target=map[image.sourceUrl];if(!target)continue;
  Object.assign(image,target,{src:target.publicUrl});
  if(typeof image.srcSet==='string')image.srcSet=replace(image.srcSet);
 }
 assets.backgrounds=Object.entries(map).map(([source,target])=>({...target,sourceUrl:source,src:target.publicUrl}));
 assets.files=Object.values(map);
 fs.writeFileSync(file,JSON.stringify(assets,null,2)+'\n');
 for(const [source,target]of Object.entries(map))if(media[source]){
  aliases[target.publicUrl]={...media[source]};
  for(const property of ['optimized','poster','mobileVideo'])if(media[source][property])aliases[target.publicUrl][property]=map[media[source][property]]?.publicUrl||media[source][property];
 }
 for(const kind of ['images','videos']){
  const dir=`public/assets/pages/${entry.folder}/${kind}`;fs.mkdirSync(dir,{recursive:true});
  if(!fs.readdirSync(dir).length)fs.writeFileSync(dir+'/.gitkeep','');
 }
 report.pages.push({url,folder:entry.folder,mappedAssets:Object.keys(map).length});
}
fs.writeFileSync('content/page-media-aliases.json',JSON.stringify(aliases)+'\n');
fs.mkdirSync('audit/page-assets',{recursive:true});fs.writeFileSync('audit/page-assets/migration.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({pages:report.pages.length,aliases:Object.keys(aliases).length,failures:report.failures}));
if(report.failures.length)process.exitCode=1;
