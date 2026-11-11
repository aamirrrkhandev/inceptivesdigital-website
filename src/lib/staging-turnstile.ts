import "server-only";

export const stagingFormsEnabled = (request?: Request) => {
  const hostname = request && new URL(request.url).hostname;
  return hostname && productionHosts.has(hostname)
    ? process.env.PRODUCTION_FORMS_DELIVERY === "ghl"
    : process.env.STAGING_FORMS_DELIVERY === "ghl";
};
const stagingHostname = "inceptives-homepage-review.vercel.app";
const productionHosts = new Set(["inceptivesdigital.com", "www.inceptivesdigital.com"]);

// Staging and future production use independent widget/secret pairs.
// Never forward tokens to the original WordPress site or trust a client hostname.
export async function verifyStagingTurnstile(request: Request, token: string) {
  const hostname = new URL(request.url).hostname;
  const production = productionHosts.has(hostname);
  const secret = production
    ? process.env.PRODUCTION_TURNSTILE_SECRET_KEY
    : hostname === stagingHostname ? process.env.STAGING_TURNSTILE_SECRET_KEY : undefined;
  if (!secret || (production && process.env.PRODUCTION_FORMS_DELIVERY !== "ghl"))
    throw new Error("Security verification is not configured for this hostname.");
  if (!token || token.length > 2048) return false;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token }),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Security verification service unavailable.");
  const result = await response.json();
  return result.success === true && result.hostname === hostname && result.action === "elementor-form";
}
