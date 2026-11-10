import { createElement, type ReactNode } from "react";
import type { LayoutNode, SitePage } from "@/lib/site-model";
import SiteInteractions from "./SiteInteractions";
import ArticleInteractions from "./ArticleInteractions";
import ContactForms from "./ContactForms";
import IOSAssessment from "./IOSAssessment";
import { mediaIndex } from "@/lib/static-media";
import backgroundFitRules from "../../content/background-fit-rules.json";
import { normalizeRootSelectors } from "@/lib/selector-scope";
import CaseStudySliderComponent from "./casestudy-slider-component";
import ScheduleMeetingSection from "./ScheduleMeetingSection";
import BlogInteractions from "./BlogInteractions";
import { prepareBlogListing } from "@/lib/blog-listing";
const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
function renderNode(
  node: LayoutNode,
  index: number,
  backgroundVideoSrc?: string,
  svgContext = false,
  homepageCaseStudySlider = false,
): ReactNode {
  if (typeof node === "string") return node;
  const { tag, props, children } = node;
  const safeProps: Record<string, unknown> = { ...props, key: index };
  if (String(props["data-id-blog-listing"]) === "1") {
    return (
      <BlogInteractions
        key={index}
        wrapperProps={props}
        initialContent={prepareBlogListing(children).map((child, i) =>
          renderNode(child, i),
        )}
      />
    );
  }
  if (homepageCaseStudySlider && props["data-id"] === "6b826671") {
    return (
      <div id="schedule" key={index}>
        <ScheduleMeetingSection />
      </div>
    );
  }
  if (homepageCaseStudySlider && props["data-id"] === "151f972") {
    const elements = children.filter(
      (child): child is Exclude<LayoutNode, string> =>
        typeof child !== "string",
    );
    const carousel = elements.find((child) =>
      String(child.props.className || "")
        .split(/\s+/)
        .includes("e-n-carousel"),
    );
    const wrapper = carousel?.children.find(
      (child): child is Exclude<LayoutNode, string> =>
        typeof child !== "string" &&
        String(child.props.className || "").includes("swiper-wrapper"),
    );
    const icon = (name: string) =>
      elements
        .find((child) => String(child.props.className || "").includes(name))
        ?.children.map((child, i) => renderNode(child, i));
    if (wrapper)
      return (
        <CaseStudySliderComponent
          key={index}
          wrapperProps={props}
          slides={wrapper.children
            .filter((child) => typeof child !== "string")
            .map((slide, i) => renderNode(slide, i))}
          previousIcon={icon("swiper-button-prev")}
          nextIcon={icon("swiper-button-next")}
        />
      );
  }
  if (tag === "title") {
    if (!svgContext) return null; // Embedded HTML widgets must not create a second page title.
    // React hoists title elements into document metadata; keep diagram text in SVG.
    return createElement(
      "desc",
      safeProps,
      children.filter((child) => typeof child === "string").join(""),
    );
  }
  if (tag === "svg" && !props["aria-hidden"]) {
    const title = children.find(
      (child) => typeof child !== "string" && child.tag === "title",
    );
    if (
      title &&
      typeof title !== "string" &&
      !props["aria-label"] &&
      !props["aria-labelledby"]
    ) {
      safeProps["aria-label"] = title.children
        .filter((child) => typeof child === "string")
        .join("");
      safeProps.role = props.role || "img";
    }
  }
  if (
    tag === "button" &&
    String(props.className || "")
      .split(/\s+/)
      .includes("sitekit-menu-close")
  ) {
    safeProps["aria-label"] = "Close menu";
    return createElement(
      "button",
      safeProps,
      createElement(
        "svg",
        {
          viewBox: "0 0 24 24",
          width: 24,
          height: 24,
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          "aria-hidden": true,
          focusable: false,
        },
        createElement("path", { d: "M6 6l12 12M18 6L6 18" }),
      ),
    );
  }
  const background = String(
    props["data-background-video"] || backgroundVideoSrc || "",
  );
  if (tag === "video") {
    const source = children.find(
      (n) => typeof n !== "string" && n.tag === "source",
    );
    const uri = String(
      props["data-media-src"] ||
        (typeof source === "object" && source?.props["data-media-src"]) ||
        background ||
        "",
    );
    const media = mediaIndex[uri];
    if (uri) safeProps["data-media-src"] = uri;
    if (media?.poster && !safeProps.poster) safeProps.poster = media.poster;
    if (media?.mobileVideo) safeProps["data-mobile-src"] = media.mobileVideo;
  }
  if (tag === "img") {
    const src = String(props.src || "");
    const media = mediaIndex[src];
    if (media?.width && !safeProps.width) safeProps.width = media.width;
    if (media?.height && !safeProps.height) safeProps.height = media.height;
    if (typeof safeProps.srcSet === "string")
      safeProps.srcSet = safeProps.srcSet
        .split(",")
        .map((part) => {
          const [url, ...size] = part.trim().split(/\s+/);
          return (mediaIndex[url]?.optimized || url) + " " + size.join(" ");
        })
        .join(", ");
    else if (media?.optimized)
      safeProps.srcSet = media.optimized + " " + (media.width || 1000) + "w";
  }
  if (tag === "textarea") {
    safeProps.defaultValue = children
      .filter((c) => typeof c === "string")
      .join("");
    return createElement(tag, safeProps);
  }
  if (tag === "img" && !safeProps.alt) safeProps.alt = "";
  if (
    tag === "iframe" &&
    String(safeProps["data-embed-src"] || "").includes("calendly")
  )
    safeProps.title = "Calendly Scheduling Page";
  return createElement(
    tag,
    safeProps,
    voidElements.has(tag)
      ? undefined
      : children.map((child, i) =>
          renderNode(
            child,
            i,
            background,
            svgContext || tag === "svg",
            homepageCaseStudySlider,
          ),
        ),
  );
}
export default function SourceLayout({
  page,
  mainContent,
  homepageCaseStudySlider = false,
}: {
  page: SitePage;
  mainContent?: ReactNode;
  homepageCaseStudySlider?: boolean;
}) {
  const css = normalizeRootSelectors(
    page.css + ((backgroundFitRules as Record<string, string>)[page.key] || ""),
    page.bodyClass,
  ).replace(/url\("([^\"]+)"\)/g, (all, url) =>
    mediaIndex[url]?.optimized ? `url("${mediaIndex[url].optimized}")` : all,
  );
  return (
    <div
      className={"migrated-page " + page.bodyClass}
      data-source-path={page.path}
    >
      <style>{css}</style>
      {page.nodes.map((node, i) =>
        typeof node !== "string" && node.tag === "main" && mainContent
          ? mainContent
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
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </div>
  );
}
