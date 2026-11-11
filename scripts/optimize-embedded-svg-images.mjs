import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
const file='content/page-media-aliases.json',aliases=JSON.parse(fs.readFileSync(file)),cache=new Map(),results=[];
for(const [url,entry]of Object.entries(aliases)){
 const source='public'+url;
 if(!url.startsWith('/assets/pages/')||!url.endsWith('.svg')||!fs.existsSync(source)||fs.statSync(source).size<500000)continue;
 const original=fs.readFileSync(source);
 if(!/data:image\/(png|jpeg);base64/.test(original.toString()))continue;
 const hash=crypto.createHash('sha256').update(original).digest('hex');
 let generated=cache.get(hash);
 if(!generated){
  const metadata=await sharp(original).metadata();
  const width=Math.min(2000,(metadata.width||1000)*2);
  const {data,info}=await sharp(original,{density:144}).resize({width,withoutEnlargement:true}).webp({quality:88}).toBuffer({resolveWithObject:true});
  generated={data,width:info.width,height:info.height};cache.set(hash,generated);
 }
 const target=url.replace(/\.svg$/,'.embedded-optimized.webp');
 fs.writeFileSync('public'+target,generated.data);
 entry.optimized=target;entry.optimizedWidth=generated.width;
 results.push({source:url,optimized:target,before:original.length,after:generated.data.length,width:generated.width,height:generated.height});
}
fs.writeFileSync(file,JSON.stringify(aliases));
fs.writeFileSync('audit/page-assets/embedded-svg-optimization.json',JSON.stringify({results,uniqueSources:cache.size},null,2));
console.log(JSON.stringify({files:results.length,uniqueSources:cache.size,before:results.reduce((n,r)=>n+r.before,0),after:results.reduce((n,r)=>n+r.after,0)}));
