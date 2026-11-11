import {readSitemapXML} from './read-sitemap.mjs';
import fs from 'node:fs';
import zlib from 'node:zlib';
import * as cheerio from 'cheerio';
const base=process.argv[2]||'http://localhost:3100';
const auditRoot=process.env.MIGRATION_AUDIT_DIR||'audit/full';
const routes=JSON.parse(fs.readFileSync('content/routes.json'));
fs.mkdirSync(auditRoot,{recursive:true});
const crawl=JSON.parse(fs.existsSync(auditRoot+'/crawl.json')?fs.readFileSync(auditRoot+'/crawl.json'):zlib.brotliDecompressSync(fs.readFileSync('audit/seo-baseline.json.br')));
const csv=rows=>rows.map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
// A failed disk write must not truncate an existing report.
function write(file,value){const temporary=file+'.tmp';fs.writeFileSync(temporary,value);fs.renameSync(temporary,file)}
const results=[];
for(let i=0;i<routes.length;i+=8){await Promise.all(routes.slice(i,i+8).map(async route=>{
 const original=crawl.find(r=>r.key===route.key);
 if(!original)throw Error('Missing source baseline: '+route.path);
 const res=await fetch(base+route.path,{redirect:'manual'});const html=await res.text();const $=cheerio.load(html);
 const headings=$('h1,h2,h3,h4,h5,h6').map((_,e)=>({level:e.tagName,text:$(e).text().replace(/\s+/g,' ').trim()})).get();
 const canonical=$('link[rel="canonical"]').attr('href')||'';
 const errors=[];
 if(res.status!==200)errors.push('HTTP '+res.status);
 if($('head > title').text()!==route.title)errors.push('title');
 if(canonical!==route.canonical)errors.push('canonical');
 if(($('meta[name="description"]').attr('content')||'')!==(original.description||''))errors.push('description');
 if(JSON.stringify(headings)!==JSON.stringify(original.headings))errors.push('headings');
 const previewRobots=$('meta[name="robots"]').attr('content')||'';
 if(!/noindex/.test(previewRobots))errors.push('preview indexing');
 const schema=$('script[type="application/ld+json"]').map((_,e)=>{try{return JSON.parse($(e).text())}catch{errors.push('invalid schema');return null}}).get();
 if(JSON.stringify(schema)!==JSON.stringify(original.schema))errors.push('schema');
 results.push({path:route.path,status:res.status,canonical,sourceRobots:route.robots,previewRobots,errors});
 }));}
const missing=await fetch(base+'/migration-verification-nonexistent-page',{redirect:'manual'});
const robots=await(await fetch(base+'/robots.txt')).text();
const sitemap=await readSitemapXML(base);
const output={base,checkedAt:new Date().toISOString(),pages:results,notFoundStatus:missing.status,robots,sitemapUrls:[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1])};
write(auditRoot+'/http-verification.json',JSON.stringify(output,null,2));
write('SEO_COMPARISON.csv',csv([['path','http_status','canonical','source_robots','staging_robots','result','differences'],...results.map(r=>[r.path,r.status,r.canonical,r.sourceRobots,r.previewRobots,r.errors.length?'FAIL':'PASS',r.errors.join('; ')])]));
write('URL_INVENTORY.csv',csv([['source_url','final_url','status','classification','canonical','title','robots','discovered_from'],...crawl.map(r=>[r.url,r.finalUrl,r.status,r.classification,r.canonical,r.title,r.robots,r.source])]));
write('SEO_BASELINE.csv',csv([['url','status','title','description','canonical','robots','headings_json','social_metadata_json','schema_json','images_json'],...crawl.map(r=>[r.url,r.status,r.title,r.description,r.canonical,r.robots,JSON.stringify(r.headings),JSON.stringify(r.metadata),JSON.stringify(r.schema),JSON.stringify(r.images)])]));
const redirects=JSON.parse(fs.readFileSync('content/redirects.json'));
write('REDIRECT_MAP.csv',csv([['source','destination','status'],...redirects.map(r=>[r.source,r.destination,r.statusCode])]));
console.log(JSON.stringify({pages:results.length,failures:results.filter(r=>r.errors.length),notFoundStatus:missing.status,sitemapUrls:output.sitemapUrls.length},null,2));
