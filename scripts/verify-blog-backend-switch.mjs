import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import {sourceFetch} from './source-fetch.mjs';
import {approvedCanonical} from '../src/lib/seo-policy.ts';
const base=process.argv[2]||'http://localhost:3100';
const source='https://nextincep.wpenginepowered.com';
const posts=[];for(let page=1;page<=100;page++){const r=await sourceFetch(source+`/wp-json/wp/v2/posts?status=publish&per_page=100&page=${page}&_fields=id,link,slug,yoast_head_json`);assert.equal(r.status,200);const batch=await r.json();posts.push(...batch);if(batch.length<100)break;}
const cr=await sourceFetch(source+'/wp-json/wp/v2/categories?per_page=100');assert.equal(cr.status,200);const categories=await cr.json();
const sitemap=await (await fetch(base+'/sitemap.xml')).text();const errors=[],results=[];
let cursor=0;await Promise.all(Array.from({length:4},async()=>{while(cursor<posts.length){const post=posts[cursor++];const path=new URL(post.link).pathname.replace(/\/$/,'');const r=await fetch(base+path);const $=cheerio.load(await r.text());const canonical=$('link[rel=canonical]').attr('href');if(r.status!==200||!canonical?.startsWith('https://inceptivesdigital.com/')||canonical.endsWith('/'))errors.push({path,status:r.status,canonical});results.push({path,status:r.status,canonical});}}));
for(const category of categories){const r=await fetch(base+'/api/blog-listing?blog_cat='+encodeURIComponent(category.slug)+'&blog_view=desktop');if(r.status!==200)errors.push({category:category.slug,status:r.status});}
for(const post of posts){if(post.yoast_head_json?.robots?.index !== 'index')continue;const u=new URL(post.yoast_head_json.canonical||post.link);u.host='inceptivesdigital.com';u.pathname=u.pathname.replace(/\/$/,'')||'/';const expected=approvedCanonical(u.href);if(!sitemap.includes(expected))errors.push({sitemapMissing:expected});}
fs.mkdirSync('audit/page-structure',{recursive:true});fs.writeFileSync('audit/page-structure/blog-backend-switch.json',JSON.stringify({base,source,posts:posts.length,categories:categories.length,results,errors},null,2));assert.deepEqual(errors,[]);console.log(JSON.stringify({posts:posts.length,categories:categories.length,errors:errors.length}));
