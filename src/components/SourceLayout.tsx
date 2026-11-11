import Header from "./shared/Header";
import Footer from "./shared/Footer";
import { renderNode } from "./shared/SourceNode";
export { renderNode } from "./shared/SourceNode";
import { Fragment, type ReactNode } from "react";
import type { SitePage } from "@/lib/site-model";
import SiteInteractions from "./SiteInteractions";
import ArticleInteractions from "./ArticleInteractions";
import ContactForms from "./ContactForms";
import IOSAssessment from "./IOSAssessment";
import { mediaIndex } from "@/lib/static-media";
import backgroundFitRules from "../../content/background-fit-rules.json";
import { normalizeRootSelectors } from "@/lib/selector-scope";
import { correctedSchema } from "@/lib/seo-policy";
import { sharedBlogStyles } from "@/lib/shared-blog-styles";

export default function SourceLayout({
  page,
  mainContent,
  homepageCaseStudySlider = false,
  formSourcePath,
}: {
  page: SitePage;
  mainContent?: ReactNode;
  homepageCaseStudySlider?: boolean;
  formSourcePath?: string;
}) {
  const css = normalizeRootSelectors(
    page.css + ((backgroundFitRules as Record<string, string>)[page.key] || ""),
    page.bodyClass,
  ).replace(/url\("([^\"]+)"\)/g, (all, url) =>
    mediaIndex[url]?.optimized ? `url("${mediaIndex[url].optimized}")` : all,
  );
  const sharedStylesheet = sharedBlogStyles(page.path, css);
  return (
    <div
      className={"migrated-page " + page.bodyClass}
      data-source-path={page.path}
      data-form-source-path={formSourcePath ?? (/^\/(?:blog|press-release)(?:\/|$)|^\/(?:category|author)\/|^\/\d{4}\/\d{2}\/\d{2}(?:\/|$)/.test(page.path) ? "/contact-us" : undefined)}
    >
      {sharedStylesheet ? <link rel="stylesheet" href={sharedStylesheet} /> : <style>{css}</style>}
      {page.nodes.map((node, i) =>
        typeof node !== "string" && node.tag === "main" && mainContent
          ? <Fragment key={"main-" + i}>{mainContent}</Fragment>
          : typeof node !== "string" && /(?:ekit-template-content-header|migrated-location-header)/.test(String(node.props.className || ""))
            ? <Header key={i} node={node} index={i} homepage={homepageCaseStudySlider && page.path === "/"} />
          : typeof node !== "string" && (node.tag === "footer" || /migrated-location-footer/.test(String(node.props.className || "")))
            ? <Footer key={i} node={node} index={i} />
          : renderNode(
              node,
              i,
              undefined,
              false,
              homepageCaseStudySlider && page.path === "/",
            ),
      )}
      <SiteInteractions pageKey={page.key} />
      <ContactForms pageKey={page.key} />
      {page.path === "/ios-app-development" && <IOSAssessment />}
      {page.articleInteractions && (
        <ArticleInteractions
          canonical={page.meta.canonical}
          title={page.meta.title}
        />
      )}
      {page.meta.metadata
        .filter(
          (m) =>
            !m.name.startsWith("og:") &&
            !m.name.startsWith("twitter:") &&
            !["article:published_time", "article:modified_time"].includes(
              m.name,
            ) &&
            m.name !== "google-site-verification",
        )
        .map((m) => (
          <meta key={m.name} property={m.name} content={m.content} />
        ))}
      {page.meta.schema.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(correctedSchema(schema)).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
      ))}
    </div>
  );
}
