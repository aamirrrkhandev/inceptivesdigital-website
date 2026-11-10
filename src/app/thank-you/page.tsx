import SourceLayout from "@/components/SourceLayout";
import { getPage } from "@/lib/site-model";
import { getWordPressThankYouMetadata } from "@/lib/wordpress-content";
import { pageMetadata } from "@/lib/site-metadata";

export const revalidate = 30;
async function completionPage() {
  const source = getPage("/contact-us");
  if (!source) throw new Error("Shared contact layout unavailable");
  return {
    ...source,
    path: "/thank-you",
    meta: await getWordPressThankYouMetadata(),
  };
}
export async function generateMetadata() {
  return pageMetadata(await completionPage());
}

export default async function ThankYouPage() {
  const page = await completionPage();
  return (
    <SourceLayout
      page={page}
      mainContent={
        <main
          style={{
            minHeight: "65svh",
            padding: "180px 24px 100px",
            textAlign: "center",
            maxWidth: 960,
            margin: "0 auto",
          }}
        >
          <h2 style={{ color: "#00ce44", fontSize: "clamp(36px, 7vw, 64px)" }}>
            Thank You! 🎉
          </h2>
          <p>We’ve received your submission successfully.</p>
          <p>Our team will review your details and get back to you soon.</p>
          <p>Meanwhile, feel free to explore more on our website 🚀</p>
          <a
            href="/"
            style={{
              display: "inline-block",
              background: "#00ce44",
              color: "#111",
              padding: "14px 28px",
              marginTop: 24,
              borderRadius: 8,
            }}
          >
            Back to Home
          </a>
        </main>
      }
    />
  );
}
