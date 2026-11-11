import { getWordPressAuthorSitemapURLs } from "@/lib/wordpress-content";
import { liveSitemapResponse } from "@/lib/sitemap-response";
export const dynamic = "force-dynamic";
export async function GET() { return liveSitemapResponse(getWordPressAuthorSitemapURLs); }
