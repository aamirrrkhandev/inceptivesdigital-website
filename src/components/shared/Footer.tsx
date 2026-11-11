import type { LayoutNode } from "@/lib/site-model";
import { renderNode } from "./SourceNode";
export default function Footer({node,index,homepage=false}: {node:LayoutNode;index:number;homepage?:boolean}) { return renderNode(node,index,undefined,false,homepage); }
