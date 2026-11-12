import fs from 'node:fs/promises';
import path from 'node:path';
import https from 'node:https';
import dns from 'node:dns/promises';
import crypto from 'node:crypto';
import {load} from 'cheerio';

// Read the owner's original hosting without changing system/domain DNS or TLS validation.
const ips = await dns.resolve4('inceptivesdi.wpenginepowered.com');
const root = path.resolve('public');
const report = [];
const queue = [];
const seen = new Set();
const allowed = p => /^\/(email-signature|reviews|custom-mobile-application-development)\//.test(p);
function enqueue(input, base = 'https://inceptivesdigital.com/') {
  const url = new URL(input, base);
  if (url.hostname !== 'inceptivesdigital.com' || !allowed(url.pathname)) return;
  url.hash = ''; url.search = '';
  if (!seen.has(url.pathname)) {seen.add(url.pathname); queue.push(url);}
}
async function get(url, hops = 0) {
  if (hops > 5) throw Error('Origin redirect limit');
  const response = await new Promise((resolve,reject) => {
    const req = https.get(url, {lookup:(_host,options,cb)=> options.all ? cb(null,ips.map(address=>({address,family:4}))) : cb(null,ips[0],4)}, res=>{
      const parts=[];res.on('data',b=>parts.push(b));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(parts)}));res.on('error',reject);
    });req.setTimeout(45000,()=>req.destroy(new Error('Origin timeout')));req.on('error',reject);
  });
  if ([301,302,307,308].includes(response.status) && response.headers.location) { const target = new URL(response.headers.location,url); if(target.hostname !== url.hostname) throw Error('Unexpected redirect host'); return get(target,hops+1); }
  return response;
}
const signatures = ['aaron-francis.jpg','ali-hamza-image.png','calendar-icon.png','clutch-award-2025.png','clutch-review.png','daniel-nelson.jpg','ethan-reed.jpg','google-reviews.png','inceptives-digital-3d-logo.png','Marissa-Williams.jpeg','max-cole.png','nick-johnson.jpg','rightfirms-2025.png','techbehemoths-trusted.png','trustpilot-review.png'];
for(const name of signatures) enqueue('/email-signature/'+name);
for(const dir of ['reviews','custom-mobile-application-development']) enqueue('/'+dir+'/index.html');
while(queue.length) {
  const url=queue.shift();
  const local=path.resolve(root,decodeURIComponent(url.pathname).slice(1));
  const existing=await fs.readFile(local).catch(()=>null);
  const result=existing ? {status:200,headers:{'content-type':/\.html$/.test(url.pathname)?'text/html':/\.css$/.test(url.pathname)?'text/css':'application/octet-stream'},body:existing} : await get(url);
  if(result.status!==200) {report.push({path:url.pathname,status:result.status});continue;}
  const file=path.resolve(root,decodeURIComponent(url.pathname).slice(1));
  if(!file.startsWith(root+path.sep)) throw Error('Unsafe destination');
  const type=result.headers['content-type']||'';
  if(!url.pathname.endsWith('.html') && /text\/html/.test(type)) {report.push({path:url.pathname,status:result.status,error:'Unexpected HTML response'});continue;}
  await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,result.body);
  report.push({path:url.pathname,status:200,bytes:result.body.length,sha256:crypto.createHash('sha256').update(result.body).digest('hex'),type});
  console.log(JSON.stringify({path:url.pathname,bytes:result.body.length}));
  const text=result.body.toString('utf8');
  if(/\.(html|css|js)$/.test(url.pathname)) {
    if(url.pathname.endsWith('.html')) {
      const $=load(text);$('[src],link[href],video[poster],source[srcset],img[srcset]').each((_,el)=>{
        for(const attr of ['src','href','poster']) {const v=$(el).attr(attr);if(v)enqueue(v,url);}
        const set=$(el).attr('srcset');if(set)for(const v of set.split(','))enqueue(v.trim().split(/\s+/)[0],url);
      });
    }
    for(const match of text.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g))enqueue(match[1],url);
    for(const match of text.matchAll(/['"`]((?:\.\/)?images\/[^'"`<>\s]+)['"`]/g))enqueue(match[1],url.pathname.endsWith('.html')?url:new URL('../',url));
    if(url.pathname.endsWith('.js'))for(const match of text.matchAll(/['"`]((?:\.\/)?assets\/[^'"`\s]+)['"`]/g))enqueue(match[1],url);
  }
}
await fs.mkdir('audit/html-file-manager-2026-11-12',{recursive:true});
await fs.writeFile('audit/html-file-manager-2026-11-12/recovery-manifest.json',JSON.stringify({source:'Original WP Engine origin; TLS verified; DNS unchanged',files:report},null,2));
console.log(JSON.stringify({files:report.length,failed:report.filter(r=>r.status!==200||r.error),bytes:report.reduce((a,r)=>a+(r.bytes||0),0)}));
