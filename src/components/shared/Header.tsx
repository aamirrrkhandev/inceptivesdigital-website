import type { LayoutNode } from "@/lib/site-model";
import { renderNode } from "./SourceNode";
import { withAddedNavigation } from "@/lib/navigation-additions";
export default function Header({node,index,homepage=false}: {node:LayoutNode;index:number;homepage?:boolean}) { return renderNode(withAddedNavigation(node),index,undefined,false,homepage); }
