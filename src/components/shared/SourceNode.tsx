import { createElement, type ReactNode } from "react";
import type { LayoutNode } from "@/lib/site-model";
import { mediaIndex } from "@/lib/static-media";
import CaseStudySliderComponent from "../casestudy-slider-component";
import ScheduleMeetingSection from "../ScheduleMeetingSection";
import BlogInteractions from "../BlogInteractions";
import { prepareBlogListing } from "@/lib/blog-listing";
import linkFixes from "../../../content/approved-link-fixes.json";
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
  const safeProps: Record<string, unknown> = { ...props, key: index };
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
    // Mark actual pictogram assets, not photographs, badges or brand wordmarks.
    const iconName = /(?:^|[-_/])icon(?:[-_.\d]|$)/i.test(src);
    const logoOrBadge = /logo|brand|review|award|badge|favicon|slider/i.test(src);
    const width = Number(media?.width || props.width), height = Number(media?.height || props.height);
    if (iconName && !logoOrBadge && width > 0 && height > 0 && width / height >= .6 && width / height <= 1.7)
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
      safeProps.srcSet = media.optimized + " " + (media.width || 1000) + "w";
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
      : children.map((child, i) =>
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
