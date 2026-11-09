import type { Metadata } from "next";
import { data } from "@/lib/content";
import seo from "@/content/seo.json";
import "./globals.css";
export const metadata: Metadata = {
  title: data.meta.title,
  description: data.meta.description,
  metadataBase: new URL("https://inceptivesdigital.com"),
  alternates: { canonical: data.meta.canonical },
  robots: { index: false, follow: false },
  other: seo,
  openGraph: {
    locale: data.meta.og.find((x) => x.name === "og:locale")?.content,
    siteName: data.meta.og.find((x) => x.name === "og:site_name")?.content,
    title: data.meta.og.find((x) => x.name === "og:title")?.content,
    description: data.meta.og.find((x) => x.name === "og:description")?.content,
    url: "https://inceptivesdigital.com/",
    type: "website",
    images: data.meta.og
      .filter((x) => x.name === "og:image")
      .map((x) => x.content),
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body>{children}</body>
    </html>
  );
}
