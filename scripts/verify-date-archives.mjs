import fs from 'node:fs';
import assert from 'node:assert/strict';
import {stripTypeScriptTypes} from 'node:module';
import * as cheerio from 'cheerio';
import safeParser from 'postcss-safe-parser';
import {prepareSourceDom} from '../src/lib/source-enhancements.js';
const code=stripTypeScriptTypes(fs.readFileSync('src/lib/wordpress-content.ts','utf8')).replace(/import "server-only";/g,'').replace(/import[\s\S]*?from\s*["'][^"']+["'];/g,'').replaceAll('export ','');
const template={path:'/2026/09/14',key:'date-template',css:'',bodyClass:'archive date',nodes:[{tag:'main',props:{id:'content',className:'site-main'},children:['Saved archive']}],meta:{title:'Saved',description:'',canonical:'',robots:'noindex, follow',metadata:[],schema:[],headings:[],hreflang:[]}};
let missing=false,reads=0;
const read=async path=>{
 reads++;if(missing)throw Object.assign(Error('Missing date'),{statusCode:404});
 assert.match(path,/^\/2026\/\d{2}\/\d{2}$/);
 return '<html><head><title>Fresh date archive</title><meta name="robots" content="noindex, follow"></head><body class="archive date"><main id="content"><article><h2>Fresh date archive</h2><p>Current published content</p></article></main></body></html>';
};
const api=new Function('cache','readWordPressBlogPage','blogSource','nonBlogSitemap','savedRoutes','getPage','cheerio','mediaIndex','readCurrentArticleHTML','beginColdArticleRead','articleHTMLMatchesRecord','prepareSourceDom','safeParser',code+';return {getWordPressPage};')(fn=>fn,read,{origin:'https://nextincep.wpenginepowered.com',publicOrigin:'https://inceptivesdigital.com'},{urls:[]},[],()=>structuredClone(template),cheerio,{},()=>undefined,()=>undefined,()=>false,prepareSourceDom,safeParser);
for(const path of ['/2026/09/14','/2026/09/18','/2026/10/02']){
 const page=await api.getWordPressPage(path);assert.equal(page.meta.title,'Fresh date archive');assert.match(page.meta.robots,/noindex/);assert.ok(JSON.stringify(page.nodes).includes('Current published content'));assert.ok(!JSON.stringify(page.nodes).includes('Saved archive'));
}
missing=true;assert.equal(await api.getWordPressPage('/2026/09/14'),undefined);
console.log(JSON.stringify({nativeDateTemplates:3,freshContent:true,noindexPreserved:true,missingDate404:true,reads,pass:true}));
