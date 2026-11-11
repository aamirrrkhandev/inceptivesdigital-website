import {readSitemapXML} from './read-sitemap.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';import * as cheerio from 'cheerio';
const base=process.argv[2];const results=[];
async function get(path){const start=performance.now();const r=await fetch(base+path,{redirect:'manual'});const text=await r.text();results.push({path,status:r.status,ms:Math.round(performance.now()-start),cache:r.headers.get('cache-control'),vercelCache:r.headers.get('x-vercel-cache')});return{r,text,$:cheerio.load(text)};}
for(const p of ['/iot-development','/iot-development/','/iot-app-development/']){const {r}=await get(p);assert.equal(r.status,301);assert.equal(new URL(r.headers.get('location'),base).pathname,'/iot-app-development');}
const io=await get('/iot-app-development');assert.equal(io.r.status,200);assert.equal(io.$('link[rel=canonical]').attr('href'),'https://inceptivesdigital.com/iot-app-development');assert.ok(io.$('#website-iot-development-enquiry').length);
for(let n=0;n<2;n++){const gone=await get('/blog/test');assert.equal(gone.r.status,404,'Deleted real post must stay absent');}
const listing=await get('/api/blog-listing?blog_cat=all&blog_view=desktop');assert.equal(listing.r.status,200);assert.match(listing.r.headers.get('cache-control'),/no-store/);assert.ok(!listing.text.includes('"/blog/test"'));
const index=await get('/sitemap.xml');assert.equal(index.r.status,200);const map={text:await readSitemapXML(base)};assert.ok(!map.text.includes('https://inceptivesdigital.com/blog/test</loc>'));assert.ok(map.text.includes('https://inceptivesdigital.com/iot-app-development</loc>'));assert.ok(!map.text.includes('https://inceptivesdigital.com/iot-development</loc>'));
const live=await get('/blog/no-code-mvp-vs-custom-mvp');assert.equal(live.r.status,200);assert.equal(live.$('link[rel=canonical]').attr('href'),'https://inceptivesdigital.com/blog/no-code-mvp-vs-custom-mvp');assert.match(live.r.headers.get('x-robots-tag'),/noindex/);
fs.writeFileSync('audit/final-offline-release-2026-11-11/freshness-deployed.json',JSON.stringify({base,results,deletedPath:'/blog/test',pass:true},null,2));console.log(JSON.stringify({results,pass:true}));
