import type { MetadataRoute } from "next";
import { indexingAllowed } from "@/lib/seo-policy";
export default function robots(): MetadataRoute.Robots {
  return indexingAllowed
    ? {
        rules: {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/", "/wp-admin/"],
        },
        sitemap: "https://inceptivesdigital.com/sitemap.xml",
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
