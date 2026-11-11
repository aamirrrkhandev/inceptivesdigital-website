import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {loadEditableModels} from './editable-model-loader.mjs';
const read=p=>JSON.parse(fs.readFileSync(p));
const before=fs.existsSync('audit/page-assets/before-models.json')?read('audit/page-assets/before-models.json'):undefined;
const beforeHashes=read('content/page-assets-original-model-hashes.json');
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value;
const {getEditablePage,editablePageIndex}=loadEditableModels();
const aliases=read('content/page-media-aliases.json');
const media=read('content/media-index.json');
const overrides=fs.existsSync('content/media-optimization-overrides.json')?read('content/media-optimization-overrides.json'):{};
const originalAssets=read('src/page-content/_shared/asset-map.json');
let files=0,variants=0;const results=[];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const [url,entry]of Object.entries(editablePageIndex)){
 if(entry.type==='wordpress')continue;
 const assets=read(`src/page-content/${entry.folder}/assets.json`);
 const reverse=new Map(assets.files.map(a=>[a.publicUrl,a.sourceUrl]));
 const normalize=value=>JSON.parse(JSON.stringify(value).replace(/\/assets\/(?:pages|shared)\/[^"'\\\s()<>,]+/g,match=>reverse.get(match)||match));
 const page=getEditablePage(url);
 if(before)assert.deepEqual(normalize(page),before[url],url+': only mapped resource URLs may change');
 assert.equal(hash(JSON.stringify(canonical(normalize(page)))),beforeHashes[url],url+': asset-normalized model hash');
 for(const asset of assets.files){
  assert.ok(fs.existsSync(asset.file),asset.file);
  assert.equal(fs.statSync(asset.file).size,asset.bytes,asset.file);
  assert.ok(asset.publicUrl.startsWith('/assets/pages/'+entry.folder+'/')||asset.publicUrl.startsWith('/assets/shared/'),asset.publicUrl);
  const original=originalAssets[asset.sourceUrl];
  if(original?.file&&fs.existsSync(original.file))assert.equal(hash(fs.readFileSync(asset.file)),hash(fs.readFileSync(original.file)),asset.file+' bytes');
  const alias=aliases[asset.publicUrl],source=media[asset.sourceUrl];
  if(source){
   assert.equal(alias.width,source.width);assert.equal(alias.height,source.height);
   for(const key of ['optimized','poster','mobileVideo'])if(source[key]){
    const override=overrides[asset.publicUrl]?.[key];
    if(override){assert.equal(alias[key],override.optimized);assert.ok(fs.existsSync('public'+override.original));assert.equal(fs.statSync('public'+override.optimized).size,override.optimizedBytes);assert.ok(override.optimizedBytes<override.sourceBytes);}
    else assert.equal(reverse.get(alias[key]),source[key],asset.publicUrl+' '+key);variants++;
   }
  }
  files++;
 }
 const all=JSON.stringify(page.nodes)+JSON.stringify(page.editableSections||[])+page.css+(page.secondaryStyles||'');
 assert.ok(!/\/(?:wp-content\/uploads|restored-assets|media)\//.test(all),url+': rendered legacy resource remains');
 results.push({url,assets:assets.files.length,exactModelExceptAssetURLs:true,seoUnchanged:true});
}
fs.writeFileSync('audit/page-assets/verification.json',JSON.stringify({pages:results,checkedReferences:files,optimizedVariants:variants},null,2));
console.log(JSON.stringify({pages:results.length,checkedReferences:files,optimizedVariants:variants,exactModelAndSEO:'pass'}));
