import fs from 'node:fs';import zlib from 'node:zlib';import safeParser from 'postcss-safe-parser';
const mapping=JSON.parse(fs.readFileSync('content/file-parts.json'));
const bytes=fs.existsSync('content/site-catalog.json.br')?fs.readFileSync('content/site-catalog.json.br'):Buffer.concat(mapping['content/site-catalog.json.br'].map(file=>fs.readFileSync(file)));
const catalog=JSON.parse(zlib.brotliDecompressSync(bytes));const rules={},inventory=[];
for(const entry of Object.values(catalog)){
 const page=JSON.parse(zlib.brotliDecompressSync(Buffer.from(entry.data,'base64')));const selectors=new Set(),sizes=new Map(),frames=new Set();
 const css=safeParser(page.css);
 css.walkDecls('background-size',decl=>{if(decl.parent.type!=='rule')return;const key=decl.parent.selector;if(!sizes.has(key))sizes.set(key,[]);sizes.get(key).push(decl.value.trim())});
 css.walkDecls(decl=>{
  if(!/background|overlay-image/.test(decl.prop)||! /url\(["']?(?!data:)[^)]+\.(?:png|jpe?g|webp|avif|gif|svg)/i.test(decl.value))return;
  if(decl.parent.type!=='rule')return;
  selectors.add(decl.parent.selector);if(/container-green-layer/i.test(decl.value))frames.add(decl.parent.selector);inventory.push({path:page.path,selector:decl.parent.selector,property:decl.prop,value:decl.value});
 });
 rules[page.key]=[...selectors].filter(selector=>!frames.has(selector)&&!(sizes.get(selector)||[]).some(size=>! /^(?:cover|auto|auto auto)$/i.test(size))).map(selector=>`${selector}{background-size:contain!important;background-repeat:no-repeat!important}`).join('\n');
}
fs.writeFileSync('content/background-fit-rules.json',JSON.stringify(rules));
if(fs.existsSync('audit'))fs.writeFileSync('audit/background-image-inventory.json',JSON.stringify(inventory,null,2));
console.log(JSON.stringify({pages:Object.keys(rules).length,backgroundRules:inventory.length}));
