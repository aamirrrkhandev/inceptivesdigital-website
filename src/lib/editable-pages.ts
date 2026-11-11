import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { brotliDecompressSync } from "node:zlib";
import index from "../../content/editable-pages-index.json";
import type { LayoutNode, SitePage } from "./site-model";

type Entry = { folder: string; type: string };
export const editablePageIndex = index as Record<string, Entry>;
const production = process.env.NODE_ENV === "production";
const root = production
  ? path.join(process.cwd(), "content", "editable-runtime")
  : path.join(process.cwd(), "src", "page-content");
const readText = cache((file: string) => production
  ? brotliDecompressSync(fs.readFileSync(path.join(root, file + ".br"))).toString("utf8")
  : fs.readFileSync(path.join(root, file), "utf8"));
const readJSON = (file: string): any => JSON.parse(readText(file));
export function readEditableConfig(pagePath: string, file: string) {
  const entry = editablePageIndex[pagePath];
  if (!entry || !/^[a-z0-9/-]+$/.test(entry.folder) || !/^[a-z-]+\.json$/.test(file)) throw new Error("Unknown editable configuration");
  return readJSON(entry.folder + "/" + file);
}

export const getEditablePage = cache((pathname: string): SitePage | undefined => {
  const pagePath = pathname.replace(/\/$/, "") || "/";
  const entry = editablePageIndex[pagePath];
  if (!entry || entry.type === "wordpress") return;
  const prefix = entry.folder + "/";
  const layout = readJSON(prefix + "layout.json");
  const content = readJSON(prefix + "content.json");
  const assets = readJSON(prefix + "assets.json");
  const expand = (raw: any): any => {
    if (typeof raw === "string") return raw;
    if (raw.shared) {
      if (!/^[a-f0-9]{24}$/.test(raw.shared)) throw new Error("Invalid shared layout reference");
      return expand(readJSON("_shared/layout-nodes/" + raw.shared + ".json"));
    }
    if (raw.content) return expand(content[raw.content]);
    if (raw.section) {
      if (!content.sections?.[raw.section]) throw new Error("Missing section: " + raw.section);
      return expand(content.sections[raw.section]);
    }
    return { ...raw, props: { ...raw.props }, children: raw.children.map(expand) };
  };
  const nodes = layout.nodes.map(expand) as LayoutNode[];
  const sections = content.secondarySections?.map(expand) as LayoutNode[] | undefined;
  const images = new Map((assets.images as any[]).map(image => [image.id, image]));
  const replacements = (assets.backgrounds as { sourceUrl: string; src: string }[]).filter(asset => typeof asset.src === "string" && asset.src !== asset.sourceUrl);
  const resourceURLs = new Map(replacements.map(asset => [asset.sourceUrl, asset.src]));
  const resourcePattern = resourceURLs.size ? new RegExp("(?:" + [...resourceURLs.keys()].sort((a, b) => b.length - a.length).map(source => RegExp.escape(source)).join("|") + ")(?=[\\s\"'(),]|$)", "g") : undefined;
  const replace = (value: string) => {
    return resourcePattern ? value.replace(resourcePattern, source => resourceURLs.get(source)!) : value;
  };
  const visit = (node: LayoutNode) => {
    if (typeof node === "string") return;
    for (const [name, value] of Object.entries(node.props)) {
      if (typeof value === "string") node.props[name] = replace(value);
      else if (name === "style" && value && typeof value === "object")
        node.props[name] = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, typeof item === "string" ? replace(item) : item]));
    }
    const internal = node as typeof node & { assetId?: string };
    const asset = internal.assetId && images.get(internal.assetId);
    if (asset) {
      const changed = typeof asset.src === "string" && asset.src !== asset.sourceUrl;
      if (changed) node.props.src = asset.src;
      if (asset.alt !== null && typeof asset.alt === "string") node.props.alt = asset.alt;
      for (const key of ["width", "height"])
        if (asset[key] !== null && asset[key] !== undefined) node.props[key] = asset[key];
      if (changed && asset.srcSet === asset.sourceSrcSet) delete node.props.srcSet;
      else if (typeof asset.srcSet === "string") node.props.srcSet = asset.srcSet;
    }
    delete internal.assetId;
    node.children.forEach(visit);
  };
  nodes.forEach(visit);
  sections?.forEach(visit);
  const { nodes: references, ...settings } = layout;
  return {
    ...settings,
    nodes,
    css: replace(readText(prefix + "styles.css")),
    meta: { ...readJSON(prefix + "seo.json"), schema: readJSON(prefix + "schema.json") },
    ...(sections ? { editableSections: sections, secondaryStyles: replace(readText(prefix + "secondary-styles.css")) } : {}),
  } as SitePage;
});
