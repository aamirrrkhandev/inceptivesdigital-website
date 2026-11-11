import { getPublishedPosts, getWordPressSitemapPosts } from "@/lib/wordpress-content";
import { approvedCanonical } from "@/lib/seo-policy";
import { liveSitemapResponse } from "@/lib/sitemap-response";
export const dynamic = "force-dynamic";
export async function GET() {
  return liveSitemapResponse(async () => {
    const [urls, posts] = await Promise.all([getWordPressSitemapPosts(), getPublishedPosts()]);
    const versions = new Map(posts.map(post => [approvedCanonical(post.yoast_head_json?.canonical || post.link), post.modified_gmt]));
    return urls.map(url => {
      const modified = versions.get(url), date = modified && Date.parse(modified + "Z");
      return { url, ...(typeof date === "number" && Number.isFinite(date) ? { lastModified: new Date(date).toISOString() } : {}) };
    });
  });
}
