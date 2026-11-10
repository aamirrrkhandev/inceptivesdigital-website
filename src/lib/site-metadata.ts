import type { Metadata } from "next";
import type { SitePage } from "./site-model";
import { indexingAllowed, approvedCanonical } from "./seo-policy";
export function pageMetadata(page: SitePage): Metadata {
  const values = new Map(page.meta.metadata.map((x) => [x.name, x.content]));
  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: {
      canonical:
        /^(?:\/category\/|\/\d{4}\/\d{2}\/\d{2}$)/.test(page.path) &&
        page.meta.robots.includes("noindex")
          ? undefined
          : approvedCanonical(page.meta.canonical),
      languages: Object.fromEntries(
        page.meta.hreflang.map((x) => [x.lang, x.href]),
      ),
    },
    robots: indexingAllowed
      ? page.meta.robots
      : { index: false, follow: false },
    other: Object.fromEntries(
      page.meta.metadata
        .filter(
          (m) =>
            (m.name.startsWith("twitter:") && m.name !== "twitter:card") ||
            m.name === "google-site-verification",
        )
        .map((m) => [m.name, m.content]),
    ),
    twitter: {
      card:
        values.get("twitter:card") === "summary" || !values.get("og:image")
          ? "summary"
          : "summary_large_image",
    },
    openGraph: {
      title: values.get("og:title") || page.meta.title,
      description: values.get("og:description") || page.meta.description,
      url: approvedCanonical(values.get("og:url") || page.meta.canonical),
      siteName: values.get("og:site_name"),
      locale: values.get("og:locale"),
      type:
        values.get("og:type") === "article"
          ? "article"
          : values.get("og:type") === "profile"
            ? "profile"
            : "website",
      ...(values.get("og:type") === "article"
        ? {
            publishedTime: values.get("article:published_time"),
            modifiedTime: values.get("article:modified_time"),
          }
        : {}),
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
