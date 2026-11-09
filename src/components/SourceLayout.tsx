import { createElement, type ReactNode } from "react";
import type { LayoutNode, SitePage } from "@/lib/site-model";
import SiteInteractions from "./SiteInteractions";
import { mediaIndex } from "@/lib/static-media";
const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
function LayoutElement({
  node,
  index,
  backgroundVideoSrc,
}: {
  node: LayoutNode;
  index: number;
  backgroundVideoSrc?: string;
}): ReactNode {
  if (typeof node === "string") return node;
  const { tag, props, children } = node;
  const safeProps: Record<string, unknown> = { ...props, key: index };
  const background = String(
    props["data-background-video"] || backgroundVideoSrc || "",
  );
  if (tag === "video") {
    const source = children.find(
      (n) => typeof n !== "string" && n.tag === "source",
    );
    const uri = String(
      props["data-media-src"] ||
        (typeof source === "object" && source?.props["data-media-src"]) ||
        background ||
        "",
    );
    const media = mediaIndex[uri];
    if (uri) safeProps["data-media-src"] = uri;
    if (media?.poster && !safeProps.poster) safeProps.poster = media.poster;
    if (media?.mobileVideo) safeProps["data-mobile-src"] = media.mobileVideo;
  }
  if (tag === "img") {
    const src = String(props.src || "");
    const media = mediaIndex[src];
    if (media?.width && !safeProps.width) safeProps.width = media.width;
    if (media?.height && !safeProps.height) safeProps.height = media.height;
    if (typeof safeProps.srcSet === "string")
      safeProps.srcSet = safeProps.srcSet
        .split(",")
        .map((part) => {
          const [url, ...size] = part.trim().split(/\s+/);
          return (mediaIndex[url]?.optimized || url) + " " + size.join(" ");
        })
        .join(", ");
    else if (media?.optimized)
      safeProps.srcSet = media.optimized + " " + (media.width || 1000) + "w";
  }
  if (tag === "textarea") {
    safeProps.defaultValue = children
      .filter((c) => typeof c === "string")
      .join("");
    return createElement(tag, safeProps);
  }
  if (tag === "img" && !safeProps.alt) safeProps.alt = "";
  if (
    tag === "iframe" &&
    String(safeProps["data-embed-src"] || "").includes("calendly")
  )
    safeProps.title = "Calendly Scheduling Page";
  return createElement(
    tag,
    safeProps,
    voidElements.has(tag)
      ? undefined
      : children.map((child, i) => (
          <LayoutElement
            node={child}
            index={i}
            backgroundVideoSrc={background}
            key={i}
          />
        )),
  );
}
export default function SourceLayout({ page }: { page: SitePage }) {
  const css = page.css.replace(/url\("([^\"]+)"\)/g, (all, url) =>
    mediaIndex[url]?.optimized ? `url("${mediaIndex[url].optimized}")` : all,
  );
  return (
    <div
      className={"migrated-page " + page.bodyClass}
      data-source-path={page.path}
    >
      <style>{css}</style>
      {page.nodes.map((node, i) => (
        <LayoutElement node={node} index={i} key={i} />
      ))}
      <SiteInteractions pageKey={page.key} />
      {page.meta.metadata
        .filter(
          (m) =>
            !m.name.startsWith("og:") &&
            !m.name.startsWith("twitter:") &&
            m.name !== "google-site-verification",
        )
        .map((m) => (
          <meta key={m.name} property={m.name} content={m.content} />
        ))}
      {page.meta.schema.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </div>
  );
}
