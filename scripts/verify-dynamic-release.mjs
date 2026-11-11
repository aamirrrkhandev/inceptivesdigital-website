import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import {sourceFetch} from './source-fetch.mjs';
import {approvedCanonical} from '../src/lib/seo-policy.ts';
const base=process.argv[2],source='https://nextincep.wpenginepowered.com',paths=new Set(['/blog','/press-release']);
const posts=[];
for(let page=1;page<100;page++){
 const response=await sourceFetch(source+`/wp-json/wp/v2/posts?status=publish&per_page=100&page=${page}&_fields=id,link,yoast_head_json,modified_gmt&_migration_inventory=${Date.now()}`);
 assert.equal(response.status,200);const batch=await response.json();posts.push(...batch);if(batch.length<100)break;
}
for(const post of posts){const link=new URL(post.link);link.host='inceptivesdigital.com';paths.add(new URL(approvedCanonical(link.href)).pathname.replace(/\/$/,''));}
for(const endpoint of ['categories?per_page=100','users?has_published_posts=true&per_page=100']){
 const response=await sourceFetch(source+'/wp-json/wp/v2/'+endpoint+'&_fields=slug');assert.equal(response.status,200);
 for(const item of await response.json())paths.add('/'+(endpoint.startsWith('users')?'author':'category')+'/'+item.slug);
}
const results=[],urls=[...paths];let cursor=0;
await Promise.all(Array.from({length:4},async()=>{
 while(cursor<urls.length){const path=urls[cursor++],start=performance.now();
  try{const response=await fetch(base+path,{redirect:'manual',signal:AbortSignal.timeout(60000)}),html=await response.text(),$=cheerio.load(html);
   const canonical=$('link[rel=canonical]').attr('href');
   const schemaValid=$('script[type="application/ld+json"]').toArray().every(el=>{try{JSON.parse($(el).text());return true;}catch{return false;}});
   results.push({path,status:response.status,ms:Math.round(performance.now()-start),canonical,title:$('title').text(),noindex:/noindex/.test(response.headers.get('x-robots-tag')||''),schemaValid,typography:html.includes('/assets/styles/site-typography.css')});
  }catch(error){results.push({path,error:error.message});}
  if(results.length%20===0)console.log(JSON.stringify({checked:results.length,total:urls.length}));
 }
}));
fs.writeFileSync('audit/page-assets/dynamic-http.json',JSON.stringify({base,source,posts:posts.length,results},null,2));
const sitemapReports=[];for(const map of ['sitemap.xml','page-sitemap.xml','post-sitemap.xml','author-sitemap.xml']){
 const response=await fetch(base+'/'+map),xml=await response.text();assert.equal(response.status,200,map);
 const locations=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&'));
 if(map==='sitemap.xml')assert.deepEqual(locations.map(u=>new URL(u).pathname).sort(),['/author-sitemap.xml','/page-sitemap.xml','/post-sitemap.xml']);
 else{assert.ok(locations.every(u=>u.startsWith('https://inceptivesdigital.com/')));assert.ok(locations.every(u=>u==='https://inceptivesdigital.com/'||!u.endsWith('/')));}
 if(map==='post-sitemap.xml')for(const post of posts.filter(p=>p.yoast_head_json?.robots?.index==='index')){
  const expected=new URL(post.yoast_head_json.canonical||post.link);expected.host='inceptivesdigital.com';expected.pathname=expected.pathname.replace(/\/$/,'');assert.ok(locations.includes(approvedCanonical(expected.href)),expected.href);
 }
 sitemapReports.push({map,status:response.status,entries:locations.length});
}
for(const row of results.filter(r=>!r.canonical&&/^\/(category|author)\//.test(r.path))){
 const response=await sourceFetch(source+row.path);const $=cheerio.load(await response.text());
 row.sourceCanonicalOmission=response.status===200&&!$('link[rel=canonical]').attr('href')&&/noindex/.test($('meta[name=robots]').attr('content')||'');
}
const failures=results.filter(r=>r.status!==200||(!r.sourceCanonicalOmission&&!r.canonical?.startsWith('https://inceptivesdigital.com/'))||!r.noindex||!r.schemaValid||!r.typography);
fs.writeFileSync('audit/page-assets/dynamic.json',JSON.stringify({base,source,publishedPosts:posts.length,results,sitemaps:sitemapReports,failures},null,2));
console.log(JSON.stringify({publishedPosts:posts.length,checked:results.length,sitemaps:sitemapReports,failures}));assert.equal(failures.length,0);
