import fs from 'node:fs';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
const pages=JSON.parse(fs.readFileSync('content/secondary-pages.json'));
const index=JSON.parse(fs.readFileSync('content/editable-pages-index.json'));
const hashes=JSON.parse(fs.readFileSync('content/editable-pages-source-hashes.json'));
const files=JSON.parse(fs.readFileSync('content/file-parts.json'));
const packed=fs.existsSync('content/site-catalog.json.br')?fs.readFileSync('content/site-catalog.json.br'):Buffer.concat(files['content/site-catalog.json.br'].map(file=>fs.readFileSync(file)));
const catalog=JSON.parse(zlib.brotliDecompressSync(packed));
const contact=JSON.parse(zlib.brotliDecompressSync(Buffer.from(catalog['/contact-us'].data,'base64')));
const text=node=>typeof node==='string'?node:node.children.map(text).join('');
const clean=value=>value.replace(/\s+/g,' ').trim();
function find(node,predicate){if(typeof node==='string')return;if(predicate(node))return node;for(const child of node.children){const found=find(child,predicate);if(found)return found;}}
const graph=contact.meta.schema.flatMap(item=>item['@graph']||[item]);
const organization=structuredClone(graph.find(item=>[].concat(item['@type']).includes('Organization')));
const website=structuredClone(graph.find(item=>item['@type']==='WebSite'));
if(!organization||!website)throw Error('Current WordPress organization/website graph missing');
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value;
const reports=[];
for(const [url,page]of Object.entries(pages)) {
  const slug=url.slice(1),folder='src/page-content/'+index[url].folder;
  const faqs=JSON.parse(fs.readFileSync('audit/secondary-vercel/'+slug+'-faqs.json'));
  const faqCards=new Map();
  for(const root of page.sections){const visit=node=>{if(typeof node==='string')return;if(String(node.props.className||'').split(' ').includes('cursor-pointer')){const heading=find(node,child=>child.tag==='h3');if(heading)faqCards.set(clean(text(heading)),node);}node.children.forEach(visit);};visit(root);}
  const content=JSON.parse(fs.readFileSync(folder+'/content.json'));
  if(url==='/mobile-game-development')content.secondarySections=structuredClone(page.sections);
  const replace=node=>{
    if(typeof node==='string')return node;
    if(String(node.props.className||'').split(' ').includes('cursor-pointer')){
      const heading=find(node,child=>child.tag==='h3');const key=heading&&clean(text(heading));
      if(key&&faqCards.has(key))return structuredClone(faqCards.get(key));
    }
    // Captured legacy Google challenges cannot validate the new hostname.
    // Keep the existing server-verified staging Turnstile control instead.
    if(node.tag==='iframe'&&/recaptcha/i.test(String(node.props.src||'')+' '+String(node.props.title||'')))return null;
    if(node.tag==='textarea'&&node.props.name==='g-recaptcha-response')return null;
    return {...node,children:node.children.map(replace).filter(child=>child!==null)};
  };
  content.secondarySections=content.secondarySections.map(replace);
  if(url==='/mobile-game-development'){
    const assets=JSON.parse(fs.readFileSync(folder+'/assets.json'));assets.images=assets.images.filter(image=>!image.id.startsWith('secondary-image-'));
    const visit=(node,position)=>{if(typeof node==='string')return;if(node.tag==='img'){
      node.assetId='secondary-image-'+crypto.createHash('sha256').update(slug+'/'+position+'|'+JSON.stringify(node.props)).digest('hex').slice(0,14);
      const src=String(node.props.src||'');assets.images.push({id:node.assetId,sourceUrl:src,src,file:null,publicUrl:null,alt:node.props.alt??null,width:node.props.width??null,height:node.props.height??null,sourceSrcSet:node.props.srcSet??null,srcSet:node.props.srcSet??null});
    }node.children.forEach((child,i)=>visit(child,position+'/'+i));};content.secondarySections.forEach((node,i)=>visit(node,String(i)));fs.writeFileSync(folder+'/assets.json',JSON.stringify(assets,null,2)+'\n');
  }
  const heading=content.secondarySections.map(root=>find(root,node=>node.tag==='h1')).find(Boolean);const name=clean(text(heading));
  const pageUrl='https://inceptivesdigital.com'+url;
  const webpage={'@type':'WebPage','@id':pageUrl+'#webpage',url:pageUrl,name:page.meta.title,description:page.meta.description,isPartOf:{'@id':website['@id']},about:{'@id':pageUrl+'#service'},breadcrumb:{'@id':pageUrl+'#breadcrumb'},inLanguage:'en-US'};
  const breadcrumb={'@type':'BreadcrumbList','@id':pageUrl+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://inceptivesdigital.com'},{'@type':'ListItem',position:2,name,item:pageUrl}]};
  const service={'@type':'Service','@id':pageUrl+'#service',name,serviceType:name,description:page.meta.description,url:pageUrl,provider:{'@id':organization['@id']},mainEntityOfPage:{'@id':webpage['@id']}};
  const faq={'@type':'FAQPage','@id':pageUrl+'#faq',url:pageUrl,isPartOf:{'@id':webpage['@id']},mainEntity:faqs.map(item=>({'@type':'Question',name:clean(item.question),acceptedAnswer:{'@type':'Answer',text:clean(item.text)}}))};
  const schema=[{'@context':'https://schema.org','@graph':[organization,website,webpage,breadcrumb,service,...(faqs.length?[faq]:[])]}];
  const seo=JSON.parse(fs.readFileSync(folder+'/seo.json'));seo.canonical=pageUrl;
  fs.writeFileSync(folder+'/seo.json',JSON.stringify(seo,null,2)+'\n');fs.writeFileSync(folder+'/schema.json',JSON.stringify(schema,null,2)+'\n');fs.writeFileSync(folder+'/content.json',JSON.stringify(content,null,2)+'\n');
  // Expected model comes from the preserved contact shell plus the explicitly
  // approved service content/FAQ/schema edits, not a copy of runtime output.
  const sections=structuredClone(content.secondarySections);const strip=node=>{if(typeof node==='string')return;delete node.assetId;node.children.forEach(strip);};sections.forEach(strip);
  const expected={...contact,path:url,key:'restored-'+slug,meta:{...seo,schema},editableSections:sections,secondaryStyles:fs.readFileSync(folder+'/secondary-styles.css','utf8')};
  hashes[url]=crypto.createHash('sha256').update(JSON.stringify(canonical(expected))).digest('hex');
  page.meta={...seo,schema};
  page.sections=sections;
  reports.push({path:url,faqQuestions:faqs.length,canonical:pageUrl,schemaTypes:[...schema[0]['@graph'].map(item=>item['@type'])]});
}
fs.writeFileSync('content/editable-pages-source-hashes.json',JSON.stringify(hashes,null,2)+'\n');
fs.writeFileSync('content/secondary-pages.json',JSON.stringify(pages));
fs.writeFileSync('audit/secondary-vercel/parity-preparation.json',JSON.stringify(reports,null,2));
// Common source CSS needs no duplicated page override in the deployment.
const styles=JSON.parse(fs.readFileSync('content/secondary-page-styles.json'));const common=JSON.parse(fs.readFileSync('content/secondary-styles.json'));for(const [url,value]of Object.entries(styles))if(value===common)delete styles[url];fs.writeFileSync('content/secondary-page-styles.json',JSON.stringify(styles));
console.log(JSON.stringify(reports));
