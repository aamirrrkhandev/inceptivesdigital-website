import type { LayoutNode } from "./site-model";
import additions from "../../content/navigation-additions.json";
type Element = Exclude<LayoutNode, string>;
function firstLink(node: LayoutNode): Element | undefined {
  if (typeof node === "string") return;
  if (node.tag === "a") return node;
  for (const child of node.children) { const found=firstLink(child);if(found)return found; }
}
function item(template: Element, link: {path:string;label:string}, category:string): Element {
  const result=structuredClone(template);
  result.props["data-migration-nav-added"]=link.path;
  const anchor=firstLink(result)!;
  anchor.props.href=link.path;
  anchor.props["data-service-category"]=category;
  if(anchor.props.title)anchor.props.title=link.label;
  let replaced=false;
  const label=(node:LayoutNode)=>{
    if(typeof node==='string')return;
    if(String(node.props.className||'').includes('icon-list-text')){node.children=[link.label];replaced=true;return;}
    node.children.forEach(label);
  };
  label(anchor);
  if(!replaced)anchor.children=[link.label];
  return result;
}
// Add requested routes through one shared header adapter, including API-fed
// blog pages, without overwriting page content or their stored source models.
export function withAddedNavigation(node:LayoutNode):LayoutNode {
  if(typeof node==='string')return node.replaceAll('AI Servicess','AI Services');
  const children=node.children.map(withAddedNavigation);
  if(node.tag!=='ul')return {...node,children};
  const present=new Set(children.map(child=>firstLink(child)?.props.href));
  const expanded:LayoutNode[]=[];
  for(const child of children) {
    expanded.push(child);
    if(typeof child==='string')continue;
    const href=firstLink(child)?.props.href;
    const group=additions.find(group=>group.after===href);
    if(group)for(const link of group.links)if(!present.has(link.path)){
      expanded.push(item(child,link,group.category));present.add(link.path);
    }
  }
  return {...node,children:expanded};
}
