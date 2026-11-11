import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import * as cheerio from 'cheerio';
import {sourceFetch} from './source-fetch.mjs';
import {execFileSync} from 'node:child_process';

if(!process.argv.includes('--initialize'))throw Error('One-time export only: pass --initialize. Never run this during builds.');
const resume=process.argv.includes('--resume');
if(fs.existsSync('content/editable-pages-index.json')||(fs.existsSync('src/page-content')&&!resume))throw Error('Editable content already exists; refusing to overwrite user edits.');
if(!fs.existsSync('audit/page-structure/before.json'))throw Error('Capture the pre-refactor baseline first.');
const parts=JSON.parse(fs.readFileSync('content/file-parts.json'));
const read=file=>fs.existsSync(file)?fs.readFileSync(file):Buffer.concat(parts[file].map(p=>fs.readFileSync(p)));
const catalog=JSON.parse(zlib.brotliDecompressSync(read('content/site-catalog.json.br')));
const titles=new Map(JSON.parse(fs.readFileSync('content/routes.json')).map(r=>[r.path,r.title]));
const media=JSON.parse(fs.readFileSync('content/media-index.json'));
const secondary=JSON.parse(fs.readFileSync('content/secondary-pages.json'));
const secondaryCss=JSON.parse(fs.readFileSync('content/secondary-styles.json'));
const clone=value=>JSON.parse(JSON.stringify(value));
const hash=value=>crypto.createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex');
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])])):value;
const write=(file,value)=>{const bytes=Buffer.isBuffer(value)?value:Buffer.from(typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');if(fs.existsSync(file)){const previous=fs.readFileSync(file);if(previous.equals(bytes))return;if(resume&&!file.startsWith('src/app/')&&!bytes.subarray(0,previous.length).equals(previous))throw Error('Existing export differs; preserving possible user edit: '+file);}fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes)};
const folder=p=>p==='/'?'home':p.slice(1);
const managed=p=>/^\/(?:blog(?:\/|$)|press-release(?:\/|$)|author\/|category\/|\d{4}\/)/.test(p);
const original=p=>{const data=JSON.parse(zlib.brotliDecompressSync(Buffer.from(catalog[p].data,'base64')));data.meta.title=titles.get(p)||data.meta.title;return data};
const models=new Map();
for(const p of Object.keys(catalog))if(!managed(p))models.set(p,{page:original(p),type:'static'});
for(const [p,data]of Object.entries(secondary))models.set(p,{type:'secondary',page:{...original('/contact-us'),path:p,key:'restored-'+p.slice(1),meta:data.meta},secondarySections:data.sections,secondaryCss});

const thankHtml=await(await sourceFetch('https://inceptivesdigital.com/thank-you')).text();const $=cheerio.load(thankHtml);
const thankMeta={title:$('head > title').text(),description:$('meta[name=description]').attr('content')||'',canonical:$('link[rel=canonical]').attr('href')||'',robots:$('meta[name=robots]').attr('content')||'index, follow',metadata:$('meta[property],meta[name^=twitter],meta[name=google-site-verification]').map((_,e)=>({name:$(e).attr('property')||$(e).attr('name')||'',content:$(e).attr('content')||''})).get(),schema:$('script[type="application/ld+json"]').toArray().map(e=>JSON.parse($(e).text())),headings:$('h1,h2,h3,h4,h5,h6').map((_,e)=>({level:e.tagName,text:$(e).text().replace(/\s+/g,' ').trim()})).get(),hreflang:$('link[hreflang]').map((_,e)=>({lang:$(e).attr('hreflang'),href:$(e).attr('href')})).get()};
models.set('/thank-you',{type:'thank-you',page:{...original('/contact-us'),path:'/thank-you',meta:thankMeta}});
const thankComponent=execFileSync('git',['show','HEAD:src/app/thank-you/page.tsx'],{encoding:'utf8'});
const ownership=new Map();
for(const [p,bundle]of models){
 const source=JSON.stringify(bundle.page)+' '+JSON.stringify(bundle.secondarySections||[])+' '+(bundle.secondaryCss||'');const used=new Set();
 for(const match of source.matchAll(/\/(?:wp-content\/uploads|media)\/[^"'\\\s<>)?,]+/g)){const url=match[0],m=media[url];if(!m)continue;used.add(url);for(const key of ['optimized','poster','mobileVideo'])if(m[key])used.add(m[key]);}
 bundle.urls=[...used];for(const url of used){const owners=ownership.get(url)||new Set();owners.add(p);ownership.set(url,owners)}
}
const assetMap={};let exportedBytes=0;
function packedBytes(entry){const file=`content/media/${entry.pack}.pack`;const list=parts[file]||[file];const out=Buffer.alloc(entry.size);let skip=entry.offset,written=0;for(const part of list){const size=fs.statSync(part).size;if(skip>=size){skip-=size;continue}const length=Math.min(size-skip,out.length-written);const fd=fs.openSync(part,'r');try{let done=0;while(done<length){const received=fs.readSync(fd,out,written+done,length-done,skip+done);if(!received)throw Error('Incomplete asset');done+=received}}finally{fs.closeSync(fd)}written+=length;skip=0;if(written===out.length)break}if(written!==out.length)throw Error('Incomplete packed asset');return out;}
for(const [url,owners]of ownership){const entry=media[url];if(!entry)continue;const kind=/\.(woff2?|ttf|otf|eot)$/i.test(url)?'fonts':entry.type.startsWith('video/')?'videos':'images';let basename;try{basename=decodeURIComponent(url.split('/').pop())}catch{basename=url.split('/').pop()}basename=basename.replace(/[<>:"/\\|?*\x00-\x1f]/g,'-').slice(-150);const group=owners.size>1?'shared':`pages/${folder([...owners][0])}`;const publicUrl=`/assets/${group}/${kind}/${hash(url).slice(0,10)}-${basename}`;const file='public'+publicUrl;const bytes=packedBytes(entry);if(fs.existsSync(file)&&!fs.readFileSync(file).equals(bytes))throw Error('Asset destination already edited: '+file);if(!fs.existsSync(file))write(file,bytes);assetMap[url]={sourceUrl:url,file,publicUrl,kind,bytes:entry.size};exportedBytes+=entry.size;}

const index={};const sourceHashes={};let sectionCount=0;
function walk(node,fn,location='root'){if(typeof node==='string')return;fn(node,location);node.children.forEach((n,i)=>walk(n,fn,location+'.'+i));}
function heading(node){if(typeof node==='string')return'';if(/^h[1-6]$/.test(node.tag))return text(node);for(const n of node.children){const found=heading(n);if(found)return found}return'';}
function text(node){return typeof node==='string'?node:node.children.map(text).join('');}
const componentName=(value,fallback)=>{const words=value.replace(/[^a-zA-Z0-9 ]/g,' ').trim().split(/\s+/).filter(Boolean).slice(0,7);let name=words.map(w=>w[0].toUpperCase()+w.slice(1)).join('').slice(0,60)||fallback;return(/^\d/.test(name)?'Section'+name:name)+'Section';};
for(const [p,bundle]of models){
 const page=clone(bundle.page);sourceHashes[p]=hash(canonical({...page,...(bundle.secondarySections?{editableSections:bundle.secondarySections,secondaryStyles:bundle.secondaryCss}:{})}));
 const images=[];const roots=[...page.nodes,...clone(bundle.secondarySections||[])];
 roots.forEach((root,i)=>walk(root,(node,location)=>{if(node.tag!=='img')return;node.assetId='image-'+hash(location+'|'+JSON.stringify(node.props)).slice(0,14);const src=String(node.props.src||'');images.push({id:node.assetId,sourceUrl:src,src,file:assetMap[src]?.file||null,publicUrl:assetMap[src]?.publicUrl||null,alt:node.props.alt??null,width:node.props.width??null,height:node.props.height??null,sourceSrcSet:node.props.srcSet??null,srcSet:node.props.srcSet??null});},String(i)));
 const target='src/page-content/'+folder(p);const main=page.nodes.find(n=>typeof n!=='string'&&n.tag==='main');
 if(!main)throw Error('Missing main: '+p);
 const sections={};const componentIds={};let number=0;
 function split(node){if(typeof node==='string')return node;if(node!==main&&node.props['data-id']&&/\be-parent\b/.test(String(node.props.className||''))){let key=number===0?'Hero':componentName(heading(node),'Content'+number).replace(/Section$/,'');while(sections[key])key+='More';number++;sections[key]=node;componentIds[key]=String(node.props['data-id']);return{section:key}}return{...node,children:node.children.map(split)}}
 const content=bundle.type==='static'?{main:split(main),sections}:bundle.type==='secondary'?{secondarySections:roots.slice(page.nodes.length)}:{main:main};
 const nodes=page.nodes.map(node=>{if(node===main&&bundle.type==='static')return{content:'main'};const ref=hash(node).slice(0,24);write('src/page-content/_shared/layout-nodes/'+ref+'.json',JSON.stringify(node,null,2)+'\n');return{shared:ref}});
 const {nodes:discardNodes,css,meta,...settings}=page;const {schema,...seo}=meta;
 write(target+'/content.json',content);write(target+'/layout.json',{...settings,nodes});write(target+'/seo.json',seo);write(target+'/schema.json',schema);write(target+'/styles.css',css);
 write(target+'/assets.json',{images,backgrounds:bundle.urls.map(url=>({sourceUrl:url,src:url,file:assetMap[url]?.file||null,publicUrl:assetMap[url]?.publicUrl||null})),files:bundle.urls.map(url=>assetMap[url]).filter(Boolean)});
 index[p]={folder:folder(p),type:bundle.type};
 const route=p==='/'?'src/app/page.tsx':'src/app'+p+'/page.tsx';
 const pageImport='@/page-content/'+folder(p)+'/Page';
 write(route,(p==='/'?'import "./homepage-responsive.css";\n':'')+`export { default, generateMetadata } from ${JSON.stringify(pageImport)};\nexport const revalidate = 30;\n`);
 if(bundle.type==='static'){
  for(const key of Object.keys(sections)){const name=key+'Section';write(target+'/components/'+name+'.tsx',`import { renderNode } from "@/components/shared/SourceNode";\nimport type { LayoutNode } from "@/lib/site-model";\n\nexport default function ${name}({ node, index }: { node: LayoutNode; index: number }) {\n  return renderNode(node, index, undefined, false, ${p==='/'});\n}\n`);sectionCount++;}
  const imports=Object.keys(sections).map(key=>`import ${key}Section from "./${key}Section";`).join('\n');
  const map=Object.keys(sections).map(key=>`${JSON.stringify(componentIds[key])}: ${key}Section`).join(',\n  ');
  write(target+'/components/Sections.tsx',`import type { ReactNode } from "react";\nimport { renderEditableSections } from "@/components/shared/EditableSections";\nimport type { SitePage } from "@/lib/site-model";\n${imports}\n\nexport default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {\n  return renderEditableSections(page, {\n  ${map}\n  }, ${p==='/'}, children);\n}\n`);
  write(target+'/Page.tsx',`import SourceLayout from "@/components/SourceLayout";\nimport { getPage } from "@/lib/site-model";\nimport { pageMetadata } from "@/lib/site-metadata";\nimport Sections from "./components/Sections";\n\nexport function generateMetadata() { return pageMetadata(getPage(${JSON.stringify(p)})!); }\n\nexport default function Page() {\n  const page = getPage(${JSON.stringify(p)})!;\n  return <SourceLayout page={page} homepageCaseStudySlider={${p==='/'}} mainContent={<Sections page={page} />} />;\n}\n`);
 }else if(bundle.type==='secondary'){
  write(target+'/secondary-styles.css',bundle.secondaryCss);
  write(target+'/components/Sections.tsx',`import type { ReactNode } from "react";\nimport SecondaryServicePage from "@/components/SecondaryServicePage";\nimport type { SitePage } from "@/lib/site-model";\n\nexport default function Sections({page, children}: {page: SitePage; children?: ReactNode}) {\n  return <SecondaryServicePage path=${JSON.stringify(p)} editablePage={page} sections={page.editableSections} stylesheet={page.secondaryStyles}>{children}</SecondaryServicePage>;\n}\n`);
  write(target+'/Page.tsx',`import { getPage } from "@/lib/site-model";\nimport { pageMetadata } from "@/lib/site-metadata";\nimport Sections from "./components/Sections";\nexport function generateMetadata(){ return pageMetadata(getPage(${JSON.stringify(p)})!); }\nexport default function Page(){ return <Sections page={getPage(${JSON.stringify(p)})!} />; }\n`);
 }else{
  let source=thankComponent.replace('import { getWordPressThankYouMetadata } from "@/lib/wordpress-content";\n','');
  source=source.replace(/async function completionPage\(\) \{[\s\S]*?\n\}/,'function completionPage() { return getPage("/thank-you")!; }');
  const start=source.indexOf('        <main');const end=source.indexOf('        </main>',start)+'        </main>'.length;
  write(target+'/components/CompletionMessage.tsx','export default function CompletionMessage() {\n  return (\n'+source.slice(start,end)+'\n  );\n}\n');
  source=source.slice(0,start)+'        <CompletionMessage />'+source.slice(end);source='import CompletionMessage from "./components/CompletionMessage";\n'+source;
  write(target+'/Page.tsx',source);
 }
 for(const kind of ['images','videos'])write(`public/assets/pages/${folder(p)}/${kind}/.gitkeep`,'');
 write(target+'/README.md',`# ${p}\n\nEdit Page.tsx to compose components; components/ contains this page's sections. Edit content.json for text/links/section order, seo.json for metadata, schema.json for JSON-LD, and styles.css for existing scoped styles. assets.json binds image IDs to src/alt/dimensions and points to physical files. Shared files are not duplicated. Never run the initializer again over these edits.\n`);
}
write('content/editable-pages-index.json',index);write('content/editable-pages-source-hashes.json',sourceHashes);write('src/page-content/_shared/asset-map.json',assetMap);
const csv=v=>'"'+String(v??'').replaceAll('"','""')+'"';
const rows=[['url','management','route_file','page_file','content_file','seo_file','schema_file','assets_file','asset_folder']];
const allPaths=new Set([...Object.keys(catalog),...models.keys(),'/press-release']);
for(const p of allPaths){const entry=index[p];rows.push(entry?[p,'editable',p==='/'?'src/app/page.tsx':`src/app${p}/page.tsx`,`src/page-content/${entry.folder}/Page.tsx`,...['content','seo','schema','assets'].map(f=>`src/page-content/${entry.folder}/${f}.json`),`public/assets/pages/${entry.folder}`]:[p,'wordpress-api',p.startsWith('/blog/')?'src/app/blog/[postSlug]/page.tsx':p==='/blog'?'src/app/blog/page.tsx':'src/app/[...slug]/page.tsx','src/lib/wordpress-content.ts','','WordPress / Yoast','WordPress JSON-LD','WordPress media API','WordPress uploads']);}
write('PAGE_DIRECTORY.csv',rows.map(row=>row.map(csv).join(',')).join('\n')+'\n');
write('ASSET_DIRECTORY.csv',[['source_url','local_file','public_url','kind','bytes','used_by_pages'],...Object.entries(assetMap).map(([url,a])=>[url,a.file,a.publicUrl,a.kind,a.bytes,[...ownership.get(url)].join(' | ')])].map(row=>row.map(csv).join(',')).join('\n')+'\n');
console.log(JSON.stringify({editablePages:models.size,sectionComponents:sectionCount,assets:Object.keys(assetMap).length,assetBytes:exportedBytes,wordpressPaths:[...allPaths].filter(p=>!index[p]).length}));
