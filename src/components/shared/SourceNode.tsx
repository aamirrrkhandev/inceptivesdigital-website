import { createElement, type ReactNode } from "react";
import type { LayoutNode } from "@/lib/site-model";
import { mediaIndex } from "@/lib/static-media";
import CaseStudySliderComponent from "../casestudy-slider-component";
import ScheduleMeetingSection from "../ScheduleMeetingSection";
import BlogInteractions from "../BlogInteractions";
import { prepareBlogListing } from "@/lib/blog-listing";
import linkFixes from "../../../content/approved-link-fixes.json";
import { getCaseStudyShowcase, hasPortfolioLink, homepageExcludedCase } from "@/lib/case-study-showcase";
import {
  isConsentControl,
  contactFormIdentifier,
  contactTrackingIds,
} from "@/lib/form-policy";
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
// Elementor repeats field IDs in the contact popup and footer. Keep field names
// and CRM form IDs intact, but scope label/description targets to their form.
function scopeFormFields(children: LayoutNode[], formId: string): LayoutNode[] {
  const ids = new Map<string, string>();
  const collect = (node: LayoutNode) => {
    if (typeof node === "string") return;
    const id = String(node.props.id || "");
    if (id.startsWith("form-field-")) ids.set(id, `${formId}-${id}`);
    node.children.forEach(collect);
  };
  children.forEach(collect);
  const rewrite = (node: LayoutNode): LayoutNode => {
    if (typeof node === "string") return node;
    const props = { ...node.props };
    for (const attr of ["id", "htmlFor", "for", "aria-labelledby", "aria-describedby"]) {
      if (typeof props[attr] === "string")
        props[attr] = (props[attr] as string).split(/\s+/).map(id => ids.get(id) || id).join(" ");
    }
    return { ...node, props, children: node.children.map(rewrite) };
  };
  return children.map(rewrite);
}
export function renderNode(
  node: LayoutNode,
  index: number,
  backgroundVideoSrc?: string,
  svgContext = false,
  homepageCaseStudySlider = false,
  customRender?: (
    node: Exclude<LayoutNode, string>,
    index: number,
  ) => ReactNode | undefined,
): ReactNode {
  if (typeof node === "string") return node;
  if (isConsentControl(node)) return null;
  const custom = customRender?.(node, index);
  if (custom !== undefined) return custom;
  const { tag, props, children } = node;
  if (tag === 'meta' && String(props.name || props.property).toLowerCase() === 'generator' && /elementor/i.test(String(props.content || ''))) return null;
  const safeProps: Record<string, unknown> = { ...props, key: index };
  if (tag === "a" && props.role === "button" && !props.href && props.tabIndex === undefined)
    safeProps.tabIndex = 0;
  for (const [source, react] of [["controlslist", "controlsList"], ["fetchpriority", "fetchPriority"], ["frameborder", "frameBorder"], ["allowfullscreen", "allowFullScreen"], ["referrerpolicy", "referrerPolicy"]]) {
    if (source in safeProps) { safeProps[react] = safeProps[source]; delete safeProps[source]; }
  }
  if ((tag === "select" || (tag === "input" && !["hidden", "radio", "checkbox", "submit", "button"].includes(String(safeProps.type)))) && "value" in safeProps) {
    safeProps.defaultValue = safeProps.value;
    delete safeProps.value;
  }
  // Capture confirmed leads explicitly; never capture search/invalid attempts.
  if (tag === "form") safeProps["data-cr-no-capture"] = "";
  if (
    tag === "a" &&
    typeof safeProps.href === "string" &&
    safeProps.href.startsWith("tel:")
  ) {
    try {
      const digits = decodeURIComponent(safeProps.href.slice(4)).replace(
        /\D/g,
        "",
      );
      // Percent-encoded source hrefs prevent the vendor from swapping click targets.
      if (["4697888527", "14697888527"].includes(digits))
        safeProps.href = "tel:+14697888527";
    } catch {
      /* Keep any unrelated/invalid source phone link intact. */
    }
  }
  if (tag === "form" && !safeProps.id) {
    if (
      String(props.className || "")
        .split(/\s+/)
        .includes("id-ios-form")
    )
      safeProps.id = "id-ios-form";
    const identifier = contactFormIdentifier(node);
    if (identifier && contactTrackingIds[identifier])
      safeProps.id = contactTrackingIds[identifier];
  }
  if (tag === "a" && typeof safeProps.href === "string") {
    const text = (nodes: LayoutNode[]): string => nodes.map(child =>
      typeof child === "string" ? child : String(child.props.alt || "") + text(child.children),
    ).join("").trim();
    if (!safeProps["aria-label"] && !safeProps["aria-labelledby"] && !text(children)) {
      const href = safeProps.href;
      if (href === "/") safeProps["aria-label"] = "Inceptives Digital home";
      else if (href.startsWith("tel:")) safeProps["aria-label"] = "Call " + href.slice(4);
      else if (href.startsWith("https://play.google.com/")) safeProps["aria-label"] = "View on Google Play";
      else if (href.startsWith("https://techbehemoths.com/")) safeProps["aria-label"] = "Inceptives Digital on TechBehemoths";
    }
    try {
      const url = new URL(safeProps.href, "https://inceptivesdigital.com");
      const destination =
        url.origin === "https://inceptivesdigital.com" &&
        (linkFixes as Record<string, string>)[url.pathname.replace(/\/$/, "")];
      if (destination) safeProps.href = destination + url.search + url.hash;
    } catch {
      /* Keep invalid source links visible for auditing. */
    }
  }
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
  const secondaryShowcase = !!props["data-secondary-carousel"] && hasPortfolioLink(node);
  if (String(props.className || "").split(/\s+/).includes("casestudy-slider") || secondaryShowcase) {
    const source = getCaseStudyShowcase();
    const slides = homepageCaseStudySlider ? source.slides.filter(slide => !homepageExcludedCase(slide)) : source.slides;
    return (
      <div key={index} className="shared-case-study-showcase migrated migrated-21112"
        data-original-case-widget={String(props["data-id"] || "secondary")}
        data-replaced-secondary-showcase={secondaryShowcase ? "true" : undefined}>
        <style>{source.css}</style>
        <CaseStudySliderComponent
          wrapperProps={source.widget.props}
          slides={slides.map((slide, i) => renderNode(slide, i))}
          previousIcon={source.previousIcon.map((child, i) => renderNode(child, i))}
          nextIcon={source.nextIcon.map((child, i) => renderNode(child, i))}
        />
      </div>
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
    if (/mobile-brand[1-4]|seo-page-sec2-icon[1-6]|kaefer-img|bookwave-img/i.test(src))
      safeProps["data-client-logo"] = "true";
    // Mark actual pictogram assets, not photographs, badges or brand wordmarks.
    const iconName = /icon(?:[-_.\d]|$)/i.test(src);
    const logoOrBadge = /logo|brand|review|award|badge|favicon|slider/i.test(src + " " + String(props.alt || ""));
    const width = Number(media?.width || props.width), height = Number(media?.height || props.height);
    const technologyIcon = /(?:delogo|balogo|datalogo|cloudlogo|ailogo)\d/i.test(src);
    const statisticIcon = /(?:apps-launch|app-downloads|active-developer|developer-resize|[-/]rating\.svg)/i.test(src);
    if (!safeProps["data-client-logo"] && ((iconName && !logoOrBadge) || technologyIcon || statisticIcon) && width > 0 && height > 0 && width / height >= .6 && width / height <= 1.7)
      safeProps["data-standard-icon"] = "true";
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
      safeProps.srcSet = media.optimized + " " + (media.optimizedWidth || media.width || 1000) + "w";
    if (safeProps["data-article-hero"] === "true") {
      safeProps.loading = "eager";
      safeProps.fetchPriority = "high";
      delete safeProps.fetchpriority;
      // Keep the existing compressed local variant / current WordPress srcset.
      // This project's image endpoint passes originals through unchanged.
    }
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
      : (tag === "form" && safeProps.id ? scopeFormFields(children, String(safeProps.id)) : children).map((child, i) =>
          renderNode(
            child,
            i,
            background,
            svgContext || tag === "svg",
            homepageCaseStudySlider,
            customRender,
          ),
        ),
  );
}
