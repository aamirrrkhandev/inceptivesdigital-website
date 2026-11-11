import fs from 'node:fs';
const base=process.argv[2]||'http://localhost:3100';
const aliases=process.argv.includes('--aliases');
const restored=process.argv.includes('--restored');
const entries=restored
  ? Object.entries(JSON.parse(fs.readFileSync('src/page-content/_shared/asset-map.json'))).filter(([url])=>url.startsWith('/restored-assets/')).map(([url,asset])=>[url,{size:asset.bytes}])
  : aliases
  ? Object.values(JSON.parse(fs.readFileSync('src/page-content/_shared/asset-map.json'))).map(asset=>[asset.publicUrl,{size:asset.bytes}])
  : Object.entries(JSON.parse(fs.readFileSync('content/media-index.json')));
let position=0;const failed=[];
await Promise.all(Array.from({length:Math.min(20,Math.max(1,Number(process.env.MEDIA_QA_CONCURRENCY)||6))},async()=>{
  while(position<entries.length){
    const [url,asset]=entries[position++];
    try {
      const response=await fetch(base+url,{method:'HEAD',signal:AbortSignal.timeout(30000)});
      if(response.status!==200)failed.push({url,status:response.status});
      else if(!response.headers.get('content-encoding')&&response.headers.has('content-length')&&Number(response.headers.get('content-length'))!==asset.size)failed.push({url,error:'Original byte length differs',length:response.headers.get('content-length'),expected:asset.size});
    }catch(error){failed.push({url,error:error.message});}
  }
}));
fs.mkdirSync('audit/page-structure',{recursive:true});fs.writeFileSync(`audit/page-structure/${restored?'restored-media-http':aliases?'editable-assets-http':'original-media'}.json`,JSON.stringify({base,media:entries.length,failed},null,2));
console.log(JSON.stringify({base,aliases,restored,media:entries.length,failed}));if(failed.length)process.exitCode=1;
