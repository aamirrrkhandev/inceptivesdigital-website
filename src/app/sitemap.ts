import type { MetadataRoute } from "next";
import routes from "../../content/routes.json";
import { getWordPressSitemapURLs } from "@/lib/wordpress-content";
import { approvedCanonical } from "@/lib/seo-policy";
import secondaryPages from "../../content/secondary-pages.json";
export const revalidate = 30;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls = await getWordPressSitemapURLs().catch((error) => {
    console.error("WordPress sitemap refresh failed", error.message);
    return null;
  });
  const restored = Object.keys(secondaryPages).map(
    (path) => "https://inceptivesdigital.com" + path,
  );
  if (urls) return [...new Set([...urls, ...restored])].map((url) => ({ url }));
  return [
    ...new Map([
      ...restored.map((url) => [url, { url }] as const),
      ...routes
        .filter((r) => !r.robots.includes("noindex"))
        .map((r) => {
          const url = approvedCanonical(r.canonical)!;
          return [url, { url }] as const;
        }),
    ]).values(),
  ];
}
