import "server-only";

export const stagingFormsEnabled = () => process.env.STAGING_FORMS_DELIVERY === "ghl";
const hostname = "inceptives-homepage-review.vercel.app";

// The staging widget has its own secret. Never forward its token to WordPress,
// whose independent widget/secret pair must remain unchanged.
export async function verifyStagingTurnstile(request: Request, token: string) {
  const secret = process.env.STAGING_TURNSTILE_SECRET_KEY;
  if (!secret || new URL(request.url).hostname !== hostname)
    throw new Error("Staging security verification is not configured for this hostname.");
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
