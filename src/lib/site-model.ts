import "server-only";
import { readPackedFile } from "./packed-file";
import zlib from "node:zlib";
import { cache } from "react";
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
};
export const readCatalog = cache((): Record<string, { data: string }> =>
  JSON.parse(
    zlib
      .brotliDecompressSync(
        readPackedFile("content/site-catalog.json.br"),
      )
      .toString("utf8"),
  ),
);
export const getPage = cache((pathname: string): SitePage | undefined => {
  const catalog = readCatalog();
  const entry =
    catalog[pathname] ||
    catalog[pathname.replace(/\/$/, "")] ||
    catalog[pathname + "/"];
  if (!entry) return;
  return JSON.parse(
    zlib
      .brotliDecompressSync(Buffer.from(entry.data, "base64"))
      .toString("utf8"),
  );
});
