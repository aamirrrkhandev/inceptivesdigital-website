import type { MetadataRoute } from "next";
import { indexingAllowed } from "@/lib/seo-policy";
import source from "../../content/source-wordpress-robots.json";

export default function robots(): MetadataRoute.Robots {
  if (!indexingAllowed) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: source.rules,
    sitemap: [...new Set([...source.sitemap, "https://inceptivesdigital.com/sitemap.xml"])],
  };
}
