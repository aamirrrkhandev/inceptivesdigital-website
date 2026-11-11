import "server-only";
import { cache } from "react";
import postcss from "postcss";
import { getPage, type LayoutNode } from "./site-model";

type ElementNode = Exclude<LayoutNode, string>;
const find = (nodes: LayoutNode[], test: (node: ElementNode) => boolean): ElementNode | undefined => {
  for (const node of nodes) {
    if (typeof node === "string") continue;
    if (test(node)) return node;
    const nested = find(node.children, test);
    if (nested) return nested;
  }
};
export const hasPortfolioLink = (node: ElementNode) => !!find([node], child =>
  child.tag === "a" && /\/(?:portfolio\/|dps-airem|pulse-check-timer)/.test(String(child.props.href || "")),
);
export const getCaseStudyShowcase = cache(() => {
  const home = getPage("/");
  if (!home) throw new Error("Homepage showcase source is unavailable");
  const widget = find(home.nodes, node => node.props["data-id"] === "151f972");
  if (!widget) throw new Error("Homepage case-study widget is unavailable");
  const carousel = find(widget.children, node => String(node.props.className || "").split(/\s+/).includes("e-n-carousel"));
  const wrapper = carousel && find(carousel.children, node => String(node.props.className || "").split(/\s+/).includes("swiper-wrapper"));
  if (!wrapper) throw new Error("Homepage case-study slides are unavailable");
  const inlineClasses = new Set<string>();
  const collect = (node: LayoutNode) => {
    if (typeof node === "string") return;
    String(node.props.className || "").split(/\s+/).filter(name => name.startsWith("inline-")).forEach(name => inlineClasses.add(name));
    node.children.forEach(collect);
  };
  collect(widget);
  const css = postcss.parse(home.css);
  css.walkRules(rule => {
    const selectors = rule.selectors.filter(selector => selector.includes(".migrated-21112") || [...inlineClasses].some(name => selector.includes("." + name)));
    if (selectors.length) rule.selectors = selectors;
    else rule.remove();
  });
  css.walkAtRules(rule => {
    if (!["media", "supports", "layer", "container"].includes(rule.name) || !rule.nodes?.length) rule.remove();
  });
  const icon = (name: string) => widget.children.find((child): child is ElementNode =>
    typeof child !== "string" && String(child.props.className || "").includes(name),
  )?.children || [];
  const slides = wrapper.children.filter((node): node is ElementNode => typeof node !== "string");
  return { widget, slides, css: css.toString(), previousIcon: icon("swiper-button-prev"), nextIcon: icon("swiper-button-next") };
});
export const homepageExcludedCase = (node: ElementNode) => !!find([node], child =>
  child.tag === "a" && /\/(?:portfolio\/)?(?:dps-airem|pulse-check-timer)(?:\/|$)/.test(String(child.props.href || "")),
);
