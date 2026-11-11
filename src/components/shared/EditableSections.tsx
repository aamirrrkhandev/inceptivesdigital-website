import { createElement, type ComponentType, type ReactNode } from "react";
import type { LayoutNode, SitePage } from "@/lib/site-model";
import { renderNode } from "./SourceNode";

type Section = ComponentType<{ node: LayoutNode; index: number }>;
export function renderEditableSections(page: SitePage, sections: Record<string, Section>, homepage = false, after?: ReactNode) {
  const index = page.nodes.findIndex(node => typeof node !== "string" && node.tag === "main");
  const main = page.nodes[index];
  if (!main || typeof main === "string") return null;
  const custom = (node: Exclude<LayoutNode, string>, key: number): ReactNode | undefined => {
    if (node === main && after !== undefined)
      return createElement(node.tag, { ...node.props, key }, ...node.children.map((child, i) => renderNode(child, i, undefined, false, homepage, custom)), after);
    const Section = sections[String(node.props["data-id"])];
    return Section ? <Section key={key} node={node} index={key} /> : undefined;
  };
  return renderNode(main, index, undefined, false, homepage, custom);
}
