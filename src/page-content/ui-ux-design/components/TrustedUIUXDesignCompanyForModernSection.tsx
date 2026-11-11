import { renderNode } from "@/components/shared/SourceNode";
import type { LayoutNode } from "@/lib/site-model";

export default function TrustedUIUXDesignCompanyForModernSection({ node, index }: { node: LayoutNode; index: number }) {
  return renderNode(node, index, undefined, false, false);
}
