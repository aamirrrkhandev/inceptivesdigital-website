import type { MetadataRoute } from "next";
import routes from "../../content/routes.json";
import { getWordPressSitemapPosts } from "@/lib/wordpress-content";
export const revalidate = 30;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getWordPressSitemapPosts().catch((error) => {
    console.error("WordPress sitemap refresh failed", error.message);
    return null;
  });
  return [
    ...new Map([
      ...routes
        .filter(
          (r) =>
            !r.robots.includes("noindex") &&
            (!posts || !/^\/blog\/[^/]+$/.test(r.path)),
        )
        .map((r) => [r.canonical, { url: r.canonical }] as const),
      ...(posts || []).map((url) => [url, { url }] as const),
    ]).values(),
  ];
}
