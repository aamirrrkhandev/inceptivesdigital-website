import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const split=JSON.parse(fs.readFileSync('content/file-parts.json'));const skip=new Set(Object.keys(split));const files=[];
function add(file){const bytes=fs.readFileSync(file);files.push({file,sha:crypto.createHash('sha1').update(bytes).digest('hex'),size:bytes.length})}
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.posix.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(!skip.has(file)&&!file.endsWith('.tsbuildinfo')&&!(file.startsWith('public/')&&/\.(mp4|webm)$/i.test(file)))add(file)}}
for(const dir of['src','content','public'])walk(dir);
for(const file of['package.json','package-lock.json','next.config.ts','tsconfig.json','next-env.d.ts','scripts/split-content.mjs','scripts/prepare-large-assets.mjs','scripts/prepare-responsive-backgrounds.mjs'])add(file);
let position=0;await Promise.all(Array.from({length:8},async()=>{while(position<files.length){const file=files[position++];try{const response=await fetch('https://dmmcy0pwk6bqi.cloudfront.net/'+file.sha,{method:'HEAD'});file.available=response.status===200&&Number(response.headers.get('content-length'))===file.size}catch{file.available=false}}}));
fs.writeFileSync('audit/deployment-manifest-current.json',JSON.stringify(files));console.log(JSON.stringify({files:files.length,missing:files.filter(f=>!f.available).map(f=>({file:f.file,size:f.size})),uploadBytes:files.filter(f=>!f.available).reduce((s,f)=>s+f.size,0)}));
