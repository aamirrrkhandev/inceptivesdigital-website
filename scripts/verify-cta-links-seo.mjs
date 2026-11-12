import fs from 'node:fs/promises';
import {load} from 'cheerio';
const base=process.env.TEST_BASE_URL||'http://localhost:3104';
const audit=JSON.parse(await fs.readFile('audit/cta-calendar/site-fixed.json','utf8'));
const paths=[...new Set(audit.results.flatMap(r=>(r.checks||[]).filter(c=>c.kind==='link'&&c.destination.startsWith(base)).map(c=>new URL(c.destination).pathname)))];
const links=[];let cursor=0;
await Promise.all(Array.from({length:4},async()=>{while(cursor<paths.length){const path=paths[cursor++];try{const r=await fetch(base+path);await r.body?.cancel();links.push({path,status:r.status});}catch(e){links.push({path,error:e.message});}}}));
const seo=[];
function metadata(html){const dom=load(html);return {title:dom('title').text(),description:dom('meta[name="description"]').attr('content'),canonical:dom('link[rel="canonical"]').attr('href'),robots:dom('meta[name="robots"]').attr('content'),headings:dom('h1').map((i,e)=>dom(e).text()).get(),schema:dom('script[type="application/ld+json"]').map((i,e)=>dom(e).text()).get()};}
for(const path of ['/','/mobile-app-development','/ios-app-development','/fitness-app-development','/food-delivery-app-development','/ar-app-development','/virtual-reality-development','/iot-app-development','/mobile-game-development','/web-development','/staff-augmentation','/custom-mobile-application-development']){
 const [local,live]=await Promise.all([fetch(base+path).then(r=>r.text()),fetch('https://inceptivesdigital.com'+path).then(r=>r.text())]);
 const a=metadata(local),b=metadata(live),differences=Object.keys(a).filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k]));
 const expectedLocalNoindex=differences.length===1&&differences[0]==='robots'&&/noindex/.test(a.robots||'')&&!/noindex/.test(b.robots||'');
 seo.push({path,preserved:differences.length===0||expectedLocalNoindex,expectedLocalNoindex,differences,localRobots:a.robots,productionRobots:b.robots});
}
await fs.writeFile('audit/cta-calendar/links-seo-verification.json',JSON.stringify({links,seo},null,2));console.log(JSON.stringify({links:links.length,linkFailures:links.filter(l=>l.status>=400||l.error),seo},null,2));
if(links.some(l=>l.status>=400||l.error)||seo.some(s=>!s.preserved))process.exitCode=1;
