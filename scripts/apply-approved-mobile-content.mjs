import fs from 'node:fs';
import {loadEditableModels} from './editable-model-loader.mjs';
import {pageHTML,sourceHashes,hash} from './page-html-utils.mjs';
const folder='src/page-content/mobile-app-development',file=folder+'/content.json';
const data=JSON.parse(fs.readFileSync(file,'utf8'));
const text=node=>typeof node==='string'?node:(node.children||[]).map(text).join(' ');
function visit(value){
 if(typeof value==='string')return value.replaceAll('SSL/TLSS','SSL/TLS').replaceAll('Kirk Flaming','Kirk Fleming');
 if(Array.isArray(value))return value.map(visit);
 if(!value||typeof value!=='object')return value;
 if(value.props?.className?.split(/\s+/).includes('swiper-slide')){
  const source=JSON.stringify(value);
  const pair=source.includes('/portfolio/my-tango-event')?['A real-time workforce management platform that cut manual paperwork by 90%, streamlining operations and improving accuracy.','Building the Infrastructure Behind a Global Dance Community']:source.includes('/portfolio/stakbread')?['Real-Time Workforce Operations Platform','Social Commerce Platform']:source.includes('/portfolio/pets-b4-profit')?['Automated Experience Capture and Delivery','AI-Powered Veterinary Cost Transparency Platform']:null;
  if(pair){const replace=v=>typeof v==='string'?v.replaceAll(...pair):Array.isArray(v)?v.map(replace):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,replace(x)])):v;value=replace(value);}
 }
 if(value.props?.className==='migrated-counter'&&text(value).includes('Infrastructure Uptime')){
  const fix=node=>{if(typeof node==='string')return;if(node.props?.['data-to-value']!==undefined)node.props['data-to-value']='99.9';if(node.props?.className==='migrated-counter-number-suffix')node.children=['%'];node.children?.forEach(fix);};fix(value);
 }
 return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,visit(item)]));
}
fs.writeFileSync(file,JSON.stringify(visit(data),null,2)+'\n');
const {getEditablePage}=loadEditableModels(),html=await pageHTML(getEditablePage('/mobile-app-development'),'static');
fs.writeFileSync(folder+'/page.html',html);
const manifestFile='content/page-html-index.json',manifest=JSON.parse(fs.readFileSync(manifestFile));
manifest['/mobile-app-development']={...manifest['/mobile-app-development'],htmlHash:hash(html),sourceHashes:sourceHashes(folder)};
fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n');
const qualification=JSON.parse(fs.readFileSync('content/lead-qualification.json'));
const select=(name,label,options)=>`<div class="form-group"><select name="${name}" class="form-control" aria-label="${label}" required><option value="" selected disabled>${label} *</option>${options.map(value=>`<option value="${value}">${value}</option>`).join('')}</select></div>\n`;
const standalone='public/custom-mobile-application-development/index.html';let source=fs.readFileSync(standalone,'utf8');
if(!source.includes('name="budget"')){let count=0;source=source.replace(/(<div class="form-group">\s*<textarea name="message")/g,match=>{count++;return select('budget','Development budget',qualification.budgetOptions)+select('timeline','When do you want to start?',qualification.timelineOptions)+match;});if(count!==3)throw Error('Expected exactly three landing forms, found '+count);fs.writeFileSync(standalone,source);}
console.log('Applied only approved mobile content and the two qualification selects on three landing forms.');
