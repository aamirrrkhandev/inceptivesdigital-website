import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.argv[2]||'.next-editable';
const results=[];
function visit(folder) {
  for(const item of fs.readdirSync(folder,{withFileTypes:true})) {
    const file=path.join(folder,item.name);
    if(item.isDirectory()){visit(file);continue;}
    if(!item.name.endsWith('.js.nft.json'))continue;
    const trace=JSON.parse(fs.readFileSync(file));
    const runtimeFiles=trace.files.map(entry=>path.resolve(path.dirname(file),entry));
    if(/(?:media|wp-content)/.test(file))continue; // Fully prerendered static media routes.
    assert.ok(runtimeFiles.every(entry=>!entry.includes(path.join('content','media')+path.sep)),file+' includes packed media');
    assert.ok(runtimeFiles.every(entry=>!entry.includes(path.join('src','page-content')+path.sep)),file+' includes raw authoring data');
    let bytes=0;for(const entry of runtimeFiles)bytes+=fs.statSync(entry).size;
    results.push({file,files:runtimeFiles.length,bytes});
  }
}
visit(path.join(root,'server','app'));
assert.ok(results.length>=80);
const largest=results.reduce((a,b)=>a.bytes>b.bytes?a:b);
fs.mkdirSync('audit/page-structure',{recursive:true});fs.writeFileSync('audit/page-structure/deployment-traces.json',JSON.stringify({functions:results.length,largest,results},null,2));
console.log(JSON.stringify({functions:results.length,largestBytes:largest.bytes,packedMediaInPageFunctions:0,rawPageDataInPageFunctions:0}));
