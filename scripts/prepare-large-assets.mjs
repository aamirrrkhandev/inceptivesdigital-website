import fs from 'node:fs';import path from 'node:path';
const index=JSON.parse(fs.readFileSync('content/media-index.json'));
const mapping=JSON.parse(fs.readFileSync('content/file-parts.json'));
const publicRoot=path.resolve('public');
for(const [url,entry] of Object.entries(index)){
 // Static files support byte ranges; video seeking/demuxing cannot use prerendered route bodies.
 if(entry.size<=20_000_000&&!entry.type.startsWith('video/'))continue;
 const file=`content/media/${entry.pack}.pack`;
 const bytes=Buffer.concat((mapping[file]||[file]).map(part=>fs.readFileSync(part))).subarray(entry.offset,entry.offset+entry.size);
 if(bytes.length!==entry.size)throw Error('Incomplete original asset: '+url);
 const destination=path.resolve(publicRoot,'.'+decodeURI(url));
 if(path.relative(publicRoot,destination).startsWith('..'))throw Error('Invalid public asset path');
 fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,bytes);
 console.log(`Prepared original static asset: ${url} (${bytes.length} bytes)`);
}
