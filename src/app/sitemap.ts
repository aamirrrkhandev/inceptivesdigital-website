import type { MetadataRoute } from "next";
import routes from "../../content/routes.json";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...new Map(
      routes
        .filter((r) => !r.robots.includes("noindex"))
        .map((r) => [r.canonical, { url: r.canonical }]),
    ).values(),
  ];
}
