import "server-only";
import exclusions from "../../content/migration-exclusions.json";
const xml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
type SitemapEntry = string | { url: string; lastModified?: string };
export function sitemapResponse(urls: SitemapEntry[], index = false) {
  const entries = urls.map(entry => typeof entry === "string" ? { url: entry } : entry);
  const permitted = [...new Map(entries.map(entry => [entry.url, entry])).values()].filter(entry => !(new URL(entry.url).pathname.replace(/\/$/, "") in exclusions));
  const root = index ? "sitemapindex" : "urlset", item = index ? "sitemap" : "url";
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><${root} xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${permitted.map(entry => `<${item}><loc>${xml(entry.url)}</loc>${entry.lastModified ? `<lastmod>${xml(entry.lastModified)}</lastmod>` : ""}</${item}>`).join("")}</${root}>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "no-store" },
  });
}
export async function liveSitemapResponse(load: () => Promise<SitemapEntry[]>) {
  try { return sitemapResponse(await load()); }
  catch { return new Response("Sitemap temporarily unavailable", { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "60" } }); }
}
