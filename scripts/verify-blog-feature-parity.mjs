import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import {sourceFetch} from './source-fetch.mjs';
const base=process.argv[2]||'http://localhost:3106';
const results=[];
const pathOf=href=>new URL(href,'https://inceptivesdigital.com').pathname.replace(/\/$/,'');
async function html(path,source=false) {
  const response=await (source?sourceFetch:fetch)((source?'https://inceptivesdigital.com':base)+path);
  assert.equal(response.status,200,path);return cheerio.load(await response.text());
}
const source=await html('/blog',true),target=await html('/blog');
const pins=$=>$('[data-blog-grid] .filtered-post-card.is-pinned .post-title a').toArray().map(el=>pathOf($(el).attr('href')));
assert.deepEqual(pins(target),pins(source));assert.ok(pins(source).length,'Source has a pinned fixture');
assert.deepEqual(target('[data-blog-grid] .filtered-post-card').slice(0,pins(source).length).toArray().map(el=>pathOf(target(el).find('.post-title a').attr('href'))),pins(source));
assert.equal(target('.id-pinned-label').first().text().trim(),'Pinned');
for(const view of ['desktop','tablet','mobile']) {
  const response=await fetch(base+`/api/blog-listing?blog_view=${view}`);assert.equal(response.status,200);
  const json=await response.json();const nodes=[];const walk=node=>{if(typeof node==='string')return;nodes.push(node);node.children.forEach(walk);};json.nodes.forEach(walk);
  const cards=nodes.filter(node=>String(node.props.className||'').split(' ').includes('filtered-post-card'));
  assert.equal(cards.length,view==='desktop'?15:view==='tablet'?9:6);
  assert.ok(String(cards[0].props.className).includes('is-pinned'));
  results.push({check:'Pinned first, original badge and page size',view,cards:cards.length,pass:true});
}
const srcPress=await html('/press-release',true),dstPress=await html('/press-release');
const pressLinks=$=>[...new Set($('main a[href]').toArray().map(el=>$(el).attr('href')).filter(href=>/\/press-release\/[^/]+/.test(href)).map(pathOf))];
assert.deepEqual(pressLinks(dstPress),pressLinks(srcPress));
assert.equal(dstPress('title').text(),srcPress('title').text());
assert.equal(dstPress('link[rel=canonical]').attr('href')?.replace(/\/$/,''),srcPress('link[rel=canonical]').attr('href')?.replace(/\/$/,''));
results.push({check:'Live category-fed Press Release cards/order/metadata',articles:pressLinks(dstPress).length,pass:true});
const article='/blog/mobile-app-development-cost-austin';
const a=await html(article,true),b=await html(article);
const reviewed=$=>{const text=$('body').text().replace(/\s+/g,' ');return text.match(/Reviewed by:\s*Muhammad Usman/)?.[0]};
assert.equal(reviewed(b),reviewed(a));assert.ok(reviewed(a));
results.push({check:'WordPress reviewer approval label',path:article,label:reviewed(b),pass:true});
assert.equal((await fetch(base+'/startup-product-development')).status,404);
fs.mkdirSync('audit/page-structure',{recursive:true});fs.writeFileSync('audit/page-structure/blog-parity.json',JSON.stringify({base,results},null,2));
console.log(JSON.stringify({base,checks:results.length,results}));
