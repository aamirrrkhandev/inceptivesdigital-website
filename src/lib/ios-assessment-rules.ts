// Exact rule port from original WordPress Code Snippets #25, captured 2026-11-11.
export const iosOptions = {
  platform: ["iPhone only", "iPhone first, Android later", "iOS and Android simultaneously"],
  hardware: ["Yes (ARKit, LiDAR, HealthKit, Apple Intelligence)", "Maybe one or two standard device features", "No, standard cloud features only"],
  performance: ["High performance", "Standard consumer UX with smooth scrolling", "Content-driven forms or business dashboards"],
  timeline: ["6+ months", "3 to 6 months", "Under 3 months"],
} as const;
export type IOSAnswers = Record<keyof typeof iosOptions, string>;
export function scoreIOSAssessment(answers: IOSAnswers) {
  const { platform: p, hardware: h, performance: f, timeline: t } = answers;
  let n = 35, c = 35;
  if (p === "iPhone only") { n += 25; c -= 5; }
  else if (p === "iPhone first, Android later") { n += 12; c += 13; }
  else c += 25;
  if (h.startsWith("Yes (")) { n += 25; c -= 8; }
  else if (h.startsWith("Maybe")) { n += 8; c += 4; }
  else c += 18;
  if (f === "High performance") { n += 18; c -= 7; }
  else if (f.includes("smooth scrolling")) { n += 7; c += 9; }
  else c += 17;
  if (t === "6+ months") n += 5;
  else if (t === "3 to 6 months") { n += 2; c += 3; }
  else c += 7;
  const native = (p === "iPhone only" && (h.startsWith("Yes (") || f === "High performance")) ||
    (p === "iPhone only" && h.startsWith("Maybe") && f.includes("smooth scrolling") && t !== "Under 3 months");
  const cross = p === "iOS and Android simultaneously" && h === "No, standard cloud features only" && f !== "High performance";
  const kind = native ? "native" : cross ? "cross" : "review";
  const texts = {
    native: ["Native iOS Development Is Your Stronger Starting Point", "Your Apple integration and performance priorities make native iOS worth assessing first. Swift and SwiftUI provide direct access to the capabilities your product may require."],
    cross: ["Cross-Platform Development Is Worth Prioritizing", "Your platform plans and feature requirements suggest Flutter or React Native could support shared development. Platform-specific integrations still require review."],
    review: ["Your App Needs a Closer Architecture Review", "Your answers contain competing requirements. A short questionnaire cannot settle the choice between native iOS and cross-platform development."],
  };
  return { kind, title: texts[kind][0], body: texts[kind][1], native: Math.max(5, Math.min(99, n)), cross: Math.max(5, Math.min(99, c)), reasons: ["Launch: " + p, "Apple capabilities: " + h, "Performance: " + f, "Timeline: " + t] };
}
export function evaluateIOSAssessment(fields: URLSearchParams) {
  const answers = {} as IOSAnswers;
  for (const key of Object.keys(iosOptions) as (keyof typeof iosOptions)[]) {
    const value = fields.get(key) || "";
    if (!(iosOptions[key] as readonly string[]).includes(value)) throw new Error("Please complete all four questions.");
    answers[key] = value;
  }
  const name = (fields.get("full_name") || "").trim();
  const email = (fields.get("email") || "").trim();
  const company = (fields.get("company") || "").trim();
  if (!name || Buffer.byteLength(name) > 120 || Buffer.byteLength(company) > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid name and email address.");
  return { success: true, delivery: "ghl-pending", data: { result: scoreIOSAssessment(answers), answers, contact: { name, email, company } } };
}
