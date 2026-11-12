import fs from 'node:fs';
import path from 'node:path';
import {load} from 'cheerio';
const files=fs.readdirSync('src/page-content',{recursive:true}).filter(file=>file.endsWith('page.html')&&!/^(?:portfolio|blog|press-release)[\\/]/.test(file)).map(file=>path.join('src/page-content',file));
files.push('public/custom-mobile-application-development/index.html');
const rows=[];
const metric=label=>/developers|engineers/i.test(label)?'developers':/downloads/i.test(label)?'downloads':/revenue/i.test(label)?'revenue':/retention/i.test(label)?'retention':/uptime/i.test(label)?'uptime':/apps|applications/i.test(label)?'apps':null;
for(const file of files){const dom=load(fs.readFileSync(file,'utf8'));dom('.migrated-counter,.id-success-metric').each((i,element)=>{
 const el=dom(element),label=el.find('.migrated-counter-title').text()||el.find('span').last().text();
 const number=el.find('[data-to-value]').attr('data-to-value')||el.find('strong').text();
 const suffix=el.find('.migrated-counter-number-suffix').text();const kind=metric(label),value=Number(number.replace(/[^\d.]/g,''))*(/m/i.test(number+suffix)?1e6:1);
 if(kind&&Number.isFinite(value))rows.push({file,metric:kind,label,display:number+suffix,value,validUnit:kind!=='uptime'||/%/.test(number+suffix)});
 });dom('img[alt]').each((i,element)=>{const label=dom(element).attr('alt'),kind=metric(label);if(!kind)return;const match=label.match(/^\s*(\d+(?:\.\d+)?)\s*(M|million)?\s*[+%]?/i);if(match)rows.push({file,metric:kind,label,display:match[0],value:Number(match[1])*(match[2]?1e6:1),validUnit:kind!=='uptime'||/%/.test(label),evidence:'existing asset alt'});});}
const maxima=Object.fromEntries(['apps','downloads','developers','revenue','retention','uptime'].map(kind=>[kind,rows.filter(row=>row.metric===kind&&row.validUnit).sort((a,b)=>b.value-a.value)[0]]));
fs.mkdirSync('audit/phase-b',{recursive:true});fs.writeFileSync('audit/phase-b/proof-metrics.json',JSON.stringify({filesScanned:files.length,scope:'Company metric widgets and descriptive asset alts; excludes project-case and blog results',maxima,rows},null,2));console.log(JSON.stringify(maxima,null,2));
