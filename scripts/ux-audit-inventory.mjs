import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const out='audit/ux-2026-11-11';fs.mkdirSync(out,{recursive:true});
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name).replaceAll('\\','/')]);
const protectedFiles=[...walk('content').filter(f=>/\.(json|txt|br)$/.test(f)),...walk('src/app').filter(f=>/sitemap|robots/.test(f)),...['src/lib/seo-policy.ts','src/lib/site-metadata.ts','next.config.ts']];
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
if(!fs.existsSync(out+'/protected-baseline.json'))fs.writeFileSync(out+'/protected-baseline.json',JSON.stringify(Object.fromEntries(protectedFiles.map(f=>[f,hash(f)])),null,2));
const index=JSON.parse(fs.readFileSync('content/editable-pages-index.json'));
const routes=Object.entries(index).map(([url,e])=>({url,type:e.type,source:'editable catalog'}));
const failures=[];const api='https://nextincep.wpenginepowered.com/wp-json/wp/v2/';
const read=async p=>{const r=await fetch(api+p,{signal:AbortSignal.timeout(25000)});if(!r.ok)throw Error(r.status+' '+p);return r.json()};
try{for(let page=1;page<20;page++){const posts=await read('posts?status=publish&per_page=100&page='+page+'&_fields=id,slug,link');for(const p of posts)routes.push({url:new URL(p.link).pathname.replace(/\/$/,''),type:'post',source:'current WordPress API',id:p.id});if(posts.length<100)break;}}catch(e){failures.push('posts: '+e.message)}
for(const [endpoint,prefix,type] of [['categories?per_page=100&_fields=slug,count','/category/','category'],['users?has_published_posts=true&per_page=100&_fields=slug','/author/','author']]){try{for(const p of await read(endpoint))if(p.count===undefined||p.count>0)routes.push({url:prefix+p.slug,type,source:'current WordPress API'})}catch(e){failures.push(type+': '+e.message)}}
for(const url of ['/blog','/press-release','/search?s=mobile'])if(!routes.some(r=>r.url===url))routes.push({url,type:'dynamic',source:'App Router'});
const components=walk('src/components').filter(f=>/\.(tsx|js)$/.test(f));
const appRoutes=walk('src/app').filter(f=>/\/(page|route)\.tsx?$/.test(f));
fs.writeFileSync(out+'/inventory.json',JSON.stringify({at:new Date().toISOString(),framework:JSON.parse(fs.readFileSync('package.json')).dependencies,routes:[...new Map(routes.map(r=>[r.url,r])).values()],appRoutes,components,discoveryFailures:failures},null,2));
console.log(JSON.stringify({routes:routes.length,byType:Object.fromEntries([...new Set(routes.map(r=>r.type))].map(t=>[t,routes.filter(r=>r.type===t).length])),components:components.length,failures}));
