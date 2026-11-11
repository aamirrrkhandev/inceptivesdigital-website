import fs from 'node:fs';
const base=process.argv[2]||'http://localhost:3100';
const entries=Object.entries(JSON.parse(fs.readFileSync('content/media-index.json')));
let position=0;const failed=[];
await Promise.all(Array.from({length:6},async()=>{
  while(position<entries.length){
    const [url,asset]=entries[position++];
    try {
      const response=await fetch(base+url,{method:'HEAD',signal:AbortSignal.timeout(30000)});
      if(response.status!==200)failed.push({url,status:response.status});
      else if(response.headers.has('content-length')&&Number(response.headers.get('content-length'))!==asset.size)failed.push({url,error:'Original byte length differs',length:response.headers.get('content-length'),expected:asset.size});
    }catch(error){failed.push({url,error:error.message});}
  }
}));
fs.mkdirSync('audit/page-structure',{recursive:true});fs.writeFileSync('audit/page-structure/original-media.json',JSON.stringify({base,media:entries.length,failed},null,2));
console.log(JSON.stringify({base,media:entries.length,failed}));if(failed.length)process.exitCode=1;
