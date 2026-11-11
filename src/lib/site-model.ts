import "server-only";
import { readPackedFile } from "./packed-file";
import zlib from "node:zlib";
import { cache } from "react";
import routes from "../../content/routes.json";
import { getEditablePage } from "./editable-pages";
import pageCatalog from "../../content/page-catalog-index.json";
const routeTitles = new Map(routes.map(route => [route.path, route.title]));
export type LayoutNode =
  | string
  | { tag: string; props: Record<string, unknown>; children: LayoutNode[] };
export type SitePage = {
  path: string;
  key: string;
  sourceUrl: string;
  bodyClass: string;
  nodes: LayoutNode[];
  css: string;
  meta: {
    title: string;
    description: string;
    canonical: string;
    robots: string;
    metadata: { name: string; content: string }[];
    schema: unknown[];
    headings: { level: string; text: string }[];
    hreflang: { lang: string; href: string }[];
  };
  widgets: string[];
  articleInteractions?: boolean;
  editableSections?: LayoutNode[];
  secondaryStyles?: string;
};
export const getPage = cache((pathname: string): SitePage | undefined => {
  const editable = getEditablePage(pathname);
  if (editable) return editable;
  const catalog = pageCatalog as Record<string, string>;
  const entry =
    catalog[pathname] ||
    catalog[pathname.replace(/\/$/, "")] ||
    catalog[pathname + "/"];
  if (!entry) return;
  const page: SitePage = JSON.parse(
    zlib
      .brotliDecompressSync(readPackedFile("content/page-catalog/" + entry))
      .toString("utf8"),
  );
  page.meta.title = routeTitles.get(page.path) || page.meta.title;
  return page;
});
