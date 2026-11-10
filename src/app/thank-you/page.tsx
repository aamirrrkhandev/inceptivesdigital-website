import type { Metadata } from "next";
import SourceLayout from "@/components/SourceLayout";
import { getPage } from "@/lib/site-model";

export const metadata: Metadata = {
  title: "Thank You - Inceptives Digital",
  alternates: { canonical: "https://inceptivesdigital.com/thank-you" },
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  const source = getPage("/contact-us");
  if (!source) throw new Error("Shared contact layout unavailable");
  const page = {
    ...source,
    path: "/thank-you",
    meta: { ...source.meta, schema: [], metadata: [] },
  };
  return <SourceLayout page={page} mainContent={
    <main style={{ minHeight: "65svh", padding: "180px 24px 100px", textAlign: "center", maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ color: "#00ce44", fontSize: "clamp(36px, 7vw, 64px)" }}>Thank You! 🎉</h1>
      <p>We’ve received your submission successfully.</p>
      <p>Our team will review your details and get back to you soon.</p>
      <p>Meanwhile, feel free to explore more on our website 🚀</p>
      <a href="/" style={{ display: "inline-block", background: "#00ce44", color: "#111", padding: "14px 28px", marginTop: 24, borderRadius: 8 }}>Back to Home</a>
    </main>
  } />;
}
