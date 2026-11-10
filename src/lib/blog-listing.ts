import "server-only";
import type { LayoutNode } from "./site-model";
import { mediaIndex } from "./static-media";

export function findBlogListing(
  nodes: LayoutNode[],
): Exclude<LayoutNode, string> | undefined {
  for (const node of nodes) {
    if (typeof node === "string") continue;
    if (String(node.props["data-id-blog-listing"]) === "1") return node;
    const found = findBlogListing(node.children);
    if (found) return found;
  }
}

export function prepareBlogListing(nodes: LayoutNode[]): LayoutNode[] {
  return nodes.map((node) => {
    if (typeof node === "string") return node;
    const props = { ...node.props };
    if (node.tag === "img") {
      const media = mediaIndex[String(props.src || "")];
      props.width ||= media?.width;
      props.height ||= media?.height;
      if (typeof props.srcSet === "string")
        props.srcSet = props.srcSet
          .split(",")
          .map((part) => {
            const [url, ...size] = part.trim().split(/\s+/);
            return [mediaIndex[url]?.optimized || url, ...size].join(" ");
          })
          .join(", ");
      else if (media?.optimized)
        props.srcSet = `${media.optimized} ${media.width || 1000}w`;
    }
    if (
      node.tag === "a" &&
      /\bid-page-(?:number|nav)\b/.test(String(props.className || ""))
    ) {
      const page =
        new URL(
          String(props.href),
          "https://inceptivesdigital.com",
        ).searchParams.get("pagination_page") || "1";
      props["data-blog-page"] = page;
      // Keep crawlable unfiltered pagination; category state stays in browser history.
      props.href =
        page === "1"
          ? "/blog"
          : "/blog?pagination_page=" + encodeURIComponent(page);
    }
    return { ...node, props, children: prepareBlogListing(node.children) };
  });
}
