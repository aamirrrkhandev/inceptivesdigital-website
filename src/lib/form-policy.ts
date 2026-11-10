import type { LayoutNode } from "./site-model";

const consentNames = new Set([
  "consent",
  "terms_and_conditions",
  ...[
    "field_6c96fc9",
    "field_37e8e1c",
    "field_fb90576",
    "field_2f7b11a",
    "field_21207b3",
  ].map((name) => `form_fields[${name}]`),
]);
export function containsConsent(node: LayoutNode): boolean {
  if (typeof node === "string") return false;
  if (
    node.tag === "input" &&
    node.props.type === "checkbox" &&
    consentNames.has(String(node.props.name))
  )
    return true;
  return node.children.some(containsConsent);
}
export function isConsentControl(node: LayoutNode): boolean {
  if (typeof node === "string") return false;
  const classes = String(node.props.className || "");
  return (
    (node.tag === "label" ||
      (node.tag === "div" &&
        node.children.some(
          (child) => typeof child !== "string" && child.tag === "input" && containsConsent(child),
        )) ||
      classes.includes("field-type-checkbox") ||
      classes.includes("field-option")) &&
    containsConsent(node)
  );
}
export function contactFormIdentifier(
  node: Exclude<LayoutNode, string>,
): string | undefined {
  if (node.tag === "input" && node.props.name === "form_id")
    return String(node.props.defaultValue || node.props.value || "");
  for (const child of node.children) {
    if (typeof child === "string") continue;
    const id = contactFormIdentifier(child);
    if (id) return id;
  }
}
export const contactTrackingIds: Record<string, string> = {
  "06b8e60": "website-footer-enquiry",
  "12967acf": "website-popup-enquiry",
  "786fcf9": "website-contact-page-enquiry",
};
