import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
const source='src/page-content',destination='content/editable-runtime';
let files=0,inputBytes=0,outputBytes=0;
function visit(folder) {
  for(const item of fs.readdirSync(folder,{withFileTypes:true})) {
    const file=path.join(folder,item.name);
    if(item.isDirectory()){visit(file);continue;}
    if(!/\.(json|css)$/.test(item.name))continue;
    const bytes=fs.readFileSync(file);
    const compressed=zlib.brotliCompressSync(bytes,{params:{[zlib.constants.BROTLI_PARAM_QUALITY]:5}});
    const output=path.join(destination,path.relative(source,file)+'.br');
    fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,compressed);
    files++;inputBytes+=bytes.length;outputBytes+=compressed.length;
  }
}
visit(source);
console.log(JSON.stringify({editableRuntimeFiles:files,inputBytes,outputBytes}));
