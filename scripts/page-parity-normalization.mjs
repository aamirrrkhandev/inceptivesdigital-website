// Explicit user-approved differences only. Every restored FAQ answer and
// service graph is tested separately against its source and schema rules.
const restored=new Set(['/web-development','/staff-augmentation','/iot-development','/virtual-reality-development','/ar-app-development']);
const attr=(node,key)=>node?.attrs?.find(([name])=>name===key)?.[1];
const text=node=>typeof node==='string'?node:(node?.children||[]).map(text).join('');
function heading(node){if(typeof node==='string'||!node)return;if(node.tag==='h3')return node;for(const child of node.children||[]){const found=heading(child);if(found)return found;}}
export function normalizeSnapshot(snapshot,path) {
  const visit=node=>{
    if(typeof node==='string')return node;
    if(attr(node,'data-migration-nav-added'))return null;
    if(restored.has(path)) {
      if(node.tag==='iframe'&&/recaptcha/i.test((attr(node,'title')||'')+' '+(attr(node,'src')||'')))return null;
      if(node.tag==='textarea'&&attr(node,'name')==='g-recaptcha-response')return null;
      const h=heading(node);
      if(node.tag==='div'&&(attr(node,'class')||'').split(/\s+/).includes('cursor-pointer')&&h&&text(h).trim().endsWith('?'))return null;
    }
    const attrs=node.tag==='a'?node.attrs.map(([key,value])=>[key,key==='href'&&value==='/staff-augmentatione'?'/staff-augmentation':value]):node.attrs;
    return {...node,attrs,children:node.children.map(visit).filter(child=>child!==null)};
  };
  return {...snapshot,schemas:restored.has(path)?[]:snapshot.schemas,body:snapshot.body.map(visit).filter(child=>child!==null)};
}
