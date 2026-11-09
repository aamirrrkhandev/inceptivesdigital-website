import type { Metadata } from "next";
import type { SitePage } from "./site-model";
export function pageMetadata(page: SitePage): Metadata {
  const values = new Map(page.meta.metadata.map((x) => [x.name, x.content]));
  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: {
      canonical: page.meta.canonical,
      languages: Object.fromEntries(
        page.meta.hreflang.map((x) => [x.lang, x.href]),
      ),
    },
    robots:
      process.env.ALLOW_INDEXING === "true"
        ? page.meta.robots
        : { index: false, follow: false },
    other: Object.fromEntries(
      page.meta.metadata
        .filter(
          (m) =>
            m.name.startsWith("twitter:") ||
            m.name === "google-site-verification",
        )
        .map((m) => [m.name, m.content]),
    ),
    openGraph: {
      title: values.get("og:title"),
      description: values.get("og:description"),
      url: values.get("og:url"),
      siteName: values.get("og:site_name"),
      locale: values.get("og:locale"),
      type: values.get("og:type") === "article" ? "article" : "website",
      images: values.get("og:image")
        ? [
            {
              url: values.get("og:image")!,
              width: Number(values.get("og:image:width")) || undefined,
              height: Number(values.get("og:image:height")) || undefined,
              type: values.get("og:image:type"),
            },
          ]
        : [],
    },
  };
}
