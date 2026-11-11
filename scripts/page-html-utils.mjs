import fs from 'node:fs';
import crypto from 'node:crypto';
import * as cheerio from 'cheerio';
import postcss from 'postcss';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import prettier from 'prettier';

export const readJSON=file=>JSON.parse(fs.readFileSync(file,'utf8'));
export const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
export const sourceHashes=folder=>Object.fromEntries(['content.json','layout.json','assets.json'].map(name=>[name,hash(fs.readFileSync(folder+'/'+name))]));
const voidTags=new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
function reactNode(node,key){
 if(typeof node==='string')return node;
 const props={...node.props,key};
 if((node.tag==='select'||node.tag==='input'&&!['hidden','radio','checkbox','submit','button'].includes(String(props.type)))&&'value' in props){props.defaultValue=props.value;delete props.value;}
 for(const [old,current]of[['controlslist','controlsList'],['fetchpriority','fetchPriority'],['frameborder','frameBorder'],['allowfullscreen','allowFullScreen'],['referrerpolicy','referrerPolicy']])if(old in props){props[current]=props[old];delete props[old];}
 if(node.tag==='textarea'){props.defaultValue=node.children.filter(c=>typeof c==='string').join('');return createElement(node.tag,props);}
 return createElement(node.tag,props,...(voidTags.has(node.tag)?[]:node.children.map(reactNode)));
}
export async function pageHTML(page,type){
 const main=type==='secondary'?{tag:'main',props:{className:'secondary-service-page','data-secondary-path':page.path},children:page.editableSections}:page.nodes.find(n=>typeof n!=='string'&&n.tag==='main');
 if(!main)throw Error('Missing main content: '+page.path);
 const $=cheerio.load(renderToStaticMarkup(reactNode(main,0)),null,false);
 $('link[rel=preload]').remove();
 const header=`<!-- Editable page content for ${page.path}.\nEdit text and image/icon src + alt here, then run: npm run pages:html:import -- --page ${page.path}\nSEO: seo.json and schema.json. Images/videos: public/assets/pages/${page.path==='/'?'home':page.path.slice(1)}/\nKeep form field names, hidden values, IDs and data-* hooks intact. Blogs remain managed by WordPress API. -->\n`;
 return header+await prettier.format($.html(),{parser:'html',printWidth:110,tabWidth:2,htmlWhitespaceSensitivity:'strict'});
}
const attributes={class:'className',for:'htmlFor',tabindex:'tabIndex',readonly:'readOnly',autofocus:'autoFocus',autocomplete:'autoComplete',srcset:'srcSet',crossorigin:'crossOrigin',fetchpriority:'fetchPriority',controlslist:'controlsList',frameborder:'frameBorder',allowfullscreen:'allowFullScreen',referrerpolicy:'referrerPolicy',playsinline:'playsInline',autoplay:'autoPlay',contenteditable:'contentEditable',colspan:'colSpan',rowspan:'rowSpan',maxlength:'maxLength',minlength:'minLength','stroke-width':'strokeWidth','stroke-linecap':'strokeLinecap','stroke-linejoin':'strokeLinejoin','stroke-miterlimit':'strokeMiterlimit','stroke-dasharray':'strokeDasharray','stroke-dashoffset':'strokeDashoffset','fill-rule':'fillRule','fill-opacity':'fillOpacity','stroke-opacity':'strokeOpacity','clip-rule':'clipRule','clip-path':'clipPath','xlink:href':'xlinkHref','xmlns:xlink':'xmlnsXlink'};
const booleans=new Set('disabled checked selected multiple muted loop controls open required hidden readonly autofocus autoplay playsinline'.split(' '));
const camel=name=>name.startsWith('--')?name:name.replace(/^-ms-/,'ms-').replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
export function parsePageHTML(html){
 const $=cheerio.load(html,null,false),main=$('main');
 if(main.length!==1)throw Error('The file must contain exactly one <main> element.');
 if($('script').length)throw Error('Keep JavaScript in the React components; inline scripts are not imported from page.html.');
 function convert(node,parent=''){
  if(node.type==='comment')return null;
  if(node.type==='text'){
   if(!node.data.trim()&&!['pre','code','textarea','style'].includes(parent))return node.data.includes('\n')?null:node.data;
   return node.data;
  }
  if(!node.tagName)return null;
  const props={};
  for(const [name,value]of Object.entries(node.attribs||{})){
   if(/^on[a-z]/i.test(name))throw Error('Inline event handlers are not supported; keep interactions in React components.');
   if(name==='style'){
    const style={};postcss.parse('x{'+value+'}').walkDecls(d=>{style[camel(d.prop)]=d.value+(d.important?' !important':'');});props.style=style;
   }else props[attributes[name]||name]=booleans.has(name)?true:value;
  }
  return{tag:node.tagName,props,children:(node.children||[]).map(child=>convert(child,node.tagName)).filter(n=>n!==null)};
 }
 return convert(main[0]);
}
function formsSignature(main){
 const $=cheerio.load(renderToStaticMarkup(reactNode(main,0)),null,false);
 return $('form').toArray().map(form=>({id:$(form).attr('id')||'',fields:$(form).find('input,select,textarea').toArray().map(e=>({tag:e.tagName,name:$(e).attr('name')||'',type:$(e).attr('type')||'',required:$(e).attr('required')!==undefined,...($(e).attr('type')==='hidden'?{value:$(e).attr('value')||''}:{})}))}));
}
export function planHTMLImport(folder,html,entry,page){
 const content=readJSON(folder+'/content.json'),layout=readJSON(folder+'/layout.json'),assets=readJSON(folder+'/assets.json');
 const main=parsePageHTML(html);
 const original=entry.type==='secondary'?{tag:'main',props:{},children:page.editableSections}:page.nodes.find(n=>typeof n!=='string'&&n.tag==='main');
 if(JSON.stringify(formsSignature(main))!==JSON.stringify(formsSignature(original)))throw Error('Form field names/types/required flags/hidden values changed. Keep form contracts intact; edit their UI text only.');
 const originalImages=[];
 const collect=node=>{if(typeof node==='string')return;if(node.tag==='img')originalImages.push(node.props);node.children.forEach(collect);};collect(original);
 let count=0;
 function visit(node){
  if(typeof node==='string')return;
  if(node.tag==='img'){
   const src=String(node.props.src||'');
   if(!src.startsWith('/assets/pages/'+entry.folder+'/')&&!src.startsWith('/assets/shared/'))throw Error('Use this page’s local assets folder or /assets/shared/ for images: '+src);
   if(!fs.existsSync('public'+src))throw Error('Image file is missing: public'+src);
   const previous=originalImages[count],normalize=value=>String(value||'').replace(/\s+/g,' ').trim();
   if(previous&&src!==previous.src&&normalize(node.props.srcSet)===normalize(previous.srcSet))delete node.props.srcSet;
   const id='html-image-'+hash(entry.folder+':'+(++count)).slice(0,16),existing=assets.images.find(a=>a.id===id);
   const asset={id,sourceUrl:src,src,publicUrl:src,file:'public'+src,alt:String(node.props.alt||''),width:node.props.width??null,height:node.props.height??null,sourceSrcSet:node.props.srcSet??null,srcSet:node.props.srcSet??null,kind:'images',bytes:fs.statSync('public'+src).size};
   if(existing)Object.assign(existing,asset);else assets.images.push(asset);
   if(!assets.files.some(file=>file.publicUrl===src))assets.files.push({sourceUrl:src,file:asset.file,publicUrl:src,kind:"images",bytes:asset.bytes});
   node.assetId=id;
  }
  node.children.forEach(visit);
 }
 visit(main);
 if(entry.type==='secondary')content.secondarySections=main.children;
 else{
  const mainIndex=page.nodes.findIndex(n=>typeof n!=='string'&&n.tag==='main');
  content.htmlMain=main;layout.nodes[mainIndex]={content:'htmlMain'};
 }
 return{'content.json':content,'layout.json':layout,'assets.json':assets};
}
