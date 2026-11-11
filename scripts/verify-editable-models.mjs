import fs from 'node:fs';
import crypto from 'node:crypto';
import { createRequire, stripTypeScriptTypes } from 'node:module';
const require = createRequire(new URL('../src/lib/editable-pages.ts', import.meta.url));
const output = stripTypeScriptTypes(fs.readFileSync('src/lib/editable-pages.ts', 'utf8'))
  .replace('import "server-only";', '')
  .replace('import fs from "node:fs";', 'const fs=require("node:fs");')
  .replace('import path from "node:path";', 'const path=require("node:path");')
  .replace('import { cache } from "react";', 'const cache=fn=>fn;')
  .replace('import { brotliDecompressSync } from "node:zlib";', 'const {brotliDecompressSync}=require("node:zlib");')
  .replace('import index from "../../content/editable-pages-index.json";', 'const index=require("../../content/editable-pages-index.json");')
  .replaceAll('export const ', 'const ').replaceAll('export function ', 'function ')
  + '\nmodule.exports={getEditablePage,readEditableConfig,editablePageIndex};';
function load() {
  const module = {exports:{}};
  new Function('require','module','exports',output)(name => name === 'server-only' ? {} : name === 'react' ? {cache:fn=>fn} : require(name),module,module.exports);
  return module.exports;
}
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])) : value;
const hash = value => crypto.createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const expected = JSON.parse(fs.readFileSync('content/editable-pages-source-hashes.json'));
const models = load();
const failed = Object.keys(expected).filter(path=>hash(models.getEditablePage(path))!==expected[path]);
if (failed.length) throw Error('Reconstructed source differs: '+failed.join(', '));
const originalEnvironment=process.env.NODE_ENV;
try {
  process.env.NODE_ENV='production';const runtime=load();
  for(const path of Object.keys(expected))if(hash(runtime.getEditablePage(path))!==expected[path])throw Error('Compressed production model differs: '+path);
} finally {if(originalEnvironment===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=originalEnvironment;}
const assetsFile='src/page-content/home/assets.json';
const seoFile='src/page-content/home/seo.json';
const originals = new Map([assetsFile,seoFile].map(file=>[file,fs.readFileSync(file)]));
try {
  const assets=JSON.parse(originals.get(assetsFile)); const target=assets.images[0];
  target.alt='Editable model verification';target.src='/assets/qa-replacement.png';
  fs.writeFileSync(assetsFile,JSON.stringify(assets));
  const seo=JSON.parse(originals.get(seoFile));seo.title='Editable SEO verification';fs.writeFileSync(seoFile,JSON.stringify(seo));
  const page=load().getEditablePage('/');
  let found=false;const visit=node=>{if(typeof node==='string')return;if(node.props.src===target.src && node.props.alt===target.alt && node.props.srcSet===undefined)found=true;node.children.forEach(visit);};page.nodes.forEach(visit);
  if (!found || page.meta.title!==seo.title) throw Error('Editable fields did not reach page model');
  const background=assets.backgrounds.find(asset=>page.css.includes(asset.sourceUrl));
  if (!background) throw Error('No background fixture available');
  background.src='/assets/qa-background.webp';fs.writeFileSync(assetsFile,JSON.stringify(assets));
  if (!load().getEditablePage('/').css.includes(background.src)) throw Error('Background replacement did not reach CSS');
} finally {for(const [file,bytes] of originals) fs.writeFileSync(file,bytes);}
const assets=JSON.parse(fs.readFileSync('src/page-content/_shared/asset-map.json'));
for(const entry of Object.values(assets)) if(fs.statSync(entry.file).size!==entry.bytes) throw Error('Asset size mismatch: '+entry.file);
console.log(JSON.stringify({models:Object.keys(expected).length,exactMatches:Object.keys(expected).length,assets:Object.keys(assets).length,editAndRestore:'pass'}));
