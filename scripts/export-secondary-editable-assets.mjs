import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const pages=JSON.parse(fs.readFileSync('content/secondary-pages.json'));
const index=JSON.parse(fs.readFileSync('content/editable-pages-index.json'));
const map=JSON.parse(fs.readFileSync('src/page-content/_shared/asset-map.json'));
const manifest=JSON.parse(fs.readFileSync('content/secondary-assets.json'));
const owners=new Map();const usage=new Map();
for(const [url,page]of Object.entries(pages)) {
  const folder=index[url]?.folder;if(!folder)continue;
  const text=JSON.stringify(page.sections)+fs.readFileSync('src/page-content/'+folder+'/secondary-styles.css','utf8');
  const used=manifest.filter(asset=>text.includes(asset.file));usage.set(url,used);
  for(const asset of used){const set=owners.get(asset.file)||new Set();set.add(url);owners.set(asset.file,set);}
}
for(const source of Object.keys(map))if(source.startsWith('/restored-assets/')&&!owners.has(source))delete map[source];
for(const [source,usedBy]of owners) {
  const kind=/\.(woff2?|ttf|otf|eot)$/i.test(source)?'fonts':/\.(mp4|webm)$/i.test(source)?'videos':'images';
  const group=usedBy.size>1?'shared':'pages/'+index[[...usedBy][0]].folder;
  const name=crypto.createHash('sha256').update(source).digest('hex').slice(0,10)+'-'+decodeURIComponent(path.basename(source));
  const publicPath=`/assets/${group}/${kind}/${name}`,publicUrl=encodeURI(publicPath),file='public'+publicPath;
  fs.mkdirSync(path.dirname(file),{recursive:true});if(!fs.existsSync(file))fs.copyFileSync('public'+source,file);
  map[source]={file,publicUrl,kind,bytes:fs.statSync(file).size,usedByPages:[...usedBy]};
}
for(const [url,used]of usage) {
  const file='src/page-content/'+index[url].folder+'/assets.json';const data=JSON.parse(fs.readFileSync(file));
  for(const image of data.images)if(map[image.sourceUrl])Object.assign(image,{file:map[image.sourceUrl].file,publicUrl:map[image.sourceUrl].publicUrl});
  data.backgrounds=data.backgrounds.filter(item=>!item.sourceUrl.startsWith('/restored-assets/'));
  for(const asset of used)data.backgrounds.push({sourceUrl:asset.file,src:asset.file,file:map[asset.file].file,publicUrl:map[asset.file].publicUrl});
  const files=new Map(data.files.filter(asset=>!asset.usedByPages).map(asset=>[asset.file,asset]));for(const asset of used)files.set(map[asset.file].file,map[asset.file]);data.files=[...files.values()];fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
}
fs.writeFileSync('src/page-content/_shared/asset-map.json',JSON.stringify(map,null,2)+'\n');
const csv=value=>'"'+String(value??'').replaceAll('"','""')+'"';
let rows=fs.readFileSync('ASSET_DIRECTORY.csv','utf8').trimEnd().split(/\r?\n/).filter(line=>!line.startsWith('"/restored-assets/'));
for(const [source,usedBy]of owners){const asset=map[source];rows.push([source,asset.file,asset.publicUrl,asset.kind,asset.bytes,[...usedBy].join(' | ')].map(csv).join(','));}
fs.writeFileSync('ASSET_DIRECTORY.csv',rows.join('\n')+'\n');
console.log(JSON.stringify({restoredAliases:owners.size,totalAliases:Object.keys(map).length,pages:usage.size}));
