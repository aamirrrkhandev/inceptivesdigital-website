import fs from 'node:fs';
import * as cheerio from 'cheerio';
const origin='https://inceptives.vercel.app';
const queue=['/'],seen=new Set(queue),results=[];
const existing=new Set([...JSON.parse(fs.readFileSync('content/routes.json')).map(entry=>entry.path),...Object.keys(JSON.parse(fs.readFileSync('content/editable-pages-index.json')))]);
const redirects=JSON.parse(fs.readFileSync('content/redirects.json'));
const dir='audit/secondary-site';fs.mkdirSync(dir,{recursive:true});
const csv=value=>'"'+String(value??'').replaceAll('"','""')+'"';
function add(input,base=origin) {
  let url;try{url=new URL(input,base);}catch{return;}
  if(!['inceptives.vercel.app','inceptivesdigital.com','www.inceptivesdigital.com'].includes(url.hostname))return;
  const path=url.pathname.replace(/\/$/,'')||'/';
  if(/^\/(?:_next|wp-content|media|restored-assets|api)(?:\/|$)/.test(path)||/\.(?:png|jpe?g|webp|gif|svg|mp4|webm|pdf|woff2?|ico|css|js|xml|txt)$/i.test(path))return;
  if(seen.size>=5000)throw Error('Unexpected secondary crawl scope');
  if(!seen.has(path)){seen.add(path);queue.push(path);}
}
async function sitemap(path,visited=new Set()) {
  if(visited.has(path)||visited.size>30)return;visited.add(path);
  const response=await fetch(origin+path,{signal:AbortSignal.timeout(20000)});if(!response.ok)return;
  const $=cheerio.load(await response.text(),{xmlMode:true});
  if($('sitemapindex').length){for(const el of $('sitemap loc').toArray())await sitemap(new URL($(el).text(),origin).pathname,visited);}
  else $('url loc').each((_,el)=>add($(el).text()));
}
if(fs.existsSync('content/secondary-route-manifest.json'))for(const path of JSON.parse(fs.readFileSync('content/secondary-route-manifest.json')).routes)if(!path.includes('[')&&!path.startsWith('/_'))add(path);
await Promise.allSettled(['/sitemap.xml','/sitemap_index.xml'].map(path=>sitemap(path)));
let position=0;
while(position<queue.length) {
  const batch=queue.slice(position,position+6);position+=batch.length;
  await Promise.all(batch.map(async path=>{
    try {
      const response=await fetch(origin+path,{signal:AbortSignal.timeout(30000),redirect:'manual'});
      const html=await response.text(),$=cheerio.load(html);
      if(response.status>=300&&response.status<400){const location=response.headers.get('location');if(location)add(location,origin+path);results.push({path,status:response.status,location});return;}
      if(response.status===200)$('a[href]').each((_,el)=>add($(el).attr('href'),origin+path));
      const type=/^\/(?:blog|press-release|author|category)(?:\/|$)/.test(path)?'wordpress-managed':existing.has(path)?'already-present':redirects.some(entry=>entry.source===path)?'existing-approved-redirect':path==='/startup-product-development'?'previously-held':'missing-page';
      const title=$('title').first().text(),h1=$('h1').first().text().trim();
      const record={path,status:response.status,title,h1,type,canonical:$('link[rel=canonical]').attr('href')||'',description:$('meta[name=description]').attr('content')||''};
      results.push(record);
      if(response.status===200&&['missing-page','previously-held'].includes(type))fs.writeFileSync(dir+'/'+path.slice(1).replaceAll('/','--')+'.html',html);
    }catch(error){results.push({path,status:0,error:error.message});}
  }));
  fs.writeFileSync(dir+'/inventory.json',JSON.stringify(results,null,2));
}
const rows=[['path','source_status','classification','title','h1','canonical'],...results.sort((a,b)=>a.path.localeCompare(b.path)).map(entry=>[entry.path,entry.status,entry.type,entry.title,entry.h1,entry.canonical])];
fs.writeFileSync('SECONDARY_URL_INVENTORY.csv',rows.map(row=>row.map(csv).join(',')).join('\n')+'\n');
const missing=results.filter(entry=>entry.status===200&&entry.type==='missing-page');
console.log(JSON.stringify({urls:results.length,missing:missing.map(entry=>({path:entry.path,title:entry.title})),held:results.filter(entry=>entry.type==='previously-held').map(entry=>entry.path),failed:results.filter(entry=>entry.status===0)}));
