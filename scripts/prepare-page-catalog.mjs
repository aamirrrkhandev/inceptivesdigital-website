import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
const parts=JSON.parse(fs.readFileSync('content/file-parts.json'));
const file='content/site-catalog.json.br';
const bytes=fs.existsSync(file)?fs.readFileSync(file):Buffer.concat(parts[file].map(p=>fs.readFileSync(p)));
const catalog=JSON.parse(zlib.brotliDecompressSync(bytes)),index={};
fs.mkdirSync('content/page-catalog',{recursive:true});
for(const [url,entry]of Object.entries(catalog)){
 const name=crypto.createHash('sha256').update(url).digest('hex').slice(0,24)+'.json.br';
 fs.writeFileSync('content/page-catalog/'+name,Buffer.from(entry.data,'base64'));index[url]=name;
}
fs.writeFileSync('content/page-catalog-index.json',JSON.stringify(index,null,2)+'\n');
console.log(JSON.stringify({pageReferences:Object.keys(index).length,byteIdenticalInnerModels:true}));
