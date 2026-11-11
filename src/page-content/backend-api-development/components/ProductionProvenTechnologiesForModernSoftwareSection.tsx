import { renderNode } from "@/components/shared/SourceNode";
import type { LayoutNode } from "@/lib/site-model";

export default function ProductionProvenTechnologiesForModernSoftwareSection({ node, index }: { node: LayoutNode; index: number }) {
  return renderNode(node, index, undefined, false, false);
}
