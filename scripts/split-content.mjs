import fs from 'node:fs';
const mapping=JSON.parse(fs.readFileSync('content/file-parts.json'));
for(const file of Object.keys(mapping)){
 if(!fs.existsSync(file))continue; // Staging receives existing parts, not the oversized logical file.
 const bytes=fs.readFileSync(file);const parts=[];
 for(let offset=0,n=0;offset<bytes.length;offset+=8*1024*1024,n++){
  const part=file+'.part'+n;fs.writeFileSync(part,bytes.subarray(offset,offset+8*1024*1024));parts.push(part);
 }
 mapping[file]=parts;
}
fs.writeFileSync('content/file-parts.json',JSON.stringify(mapping,null,2));
