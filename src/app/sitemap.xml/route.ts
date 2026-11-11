import { sitemapResponse } from "@/lib/sitemap-response";
export const dynamic = "force-dynamic";
export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  return sitemapResponse(["page-sitemap.xml", "post-sitemap.xml", "author-sitemap.xml"].map(file => origin + "/" + file), true);
}
