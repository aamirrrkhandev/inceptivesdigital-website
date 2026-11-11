# Production forms preparation — 11 November 2026

Separate Cloudflare widget: Inceptives Website — Next.js Production. Managed mode, inceptivesdigital.com hostname (Cloudflare includes its subdomains), no pre-clearance. Existing WordPress and staging widgets are unchanged. No DNS, live application or production deployment changes.

Prepared only in the migration Vercel project prj_LjTmsq5OcdsUnkV4tEKe2n4U6r0b: NEXT_PUBLIC_PRODUCTION_TURNSTILE_SITE_KEY (public config), PRODUCTION_TURNSTILE_SECRET_KEY (Production secret), PRODUCTION_FORMS_DELIVERY=ghl (Production config). Public production site key is also available to Preview builds; staging still selects its independent widget and secret. Private recovery copy .env.production-forms.local is ignored and not automatically loaded by Next.js. Never commit or publish it.

Runtime selects the production widget on apex/www only and checks Cloudflare success, exact request hostname and elementor-form action. Unrecognized hostnames, staging tokens on production, production tokens on staging, invalid actions and missing secrets fail closed. Existing GHL and CallRail host lists already include apex/www. Their native submission flows and existing UI are retained. Calendly unchanged.

Verified: TypeScript; 12 security/configuration cases against actual validation code with mocked Cloudflare responses; 157 source form contracts; 81 original PHP scoring fixtures. These are not real production-domain submission tests. Most recent real staging iOS test is confirmed in GHL and CallRail event 835320901, with seven fields, current URL/source/medium and thank-you.

Production-host browser challenge, native GHL domain-specific field mappings and CallRail capture MUST still be smoke-tested immediately after the separately approved cutover. Production domain is currently served by WordPress, so a real Next.js form journey there cannot be honestly certified now without changing routing. At cutover verify contact, footer, popup, assessment and six restored-service forms; rejected/expired challenge; GHL field mapping/UTM; CallRail form URL and attribution; thank-you and keyboard/mobile UI. Production GHL may create domain-specific external form records; review each mapping rather than assuming staging mappings apply. Do not shut down nextincep.wpenginepowered.com or its media/backend.

## Approved IoT slug change

301 redirects /iot-development and /iot-development/ to /iot-app-development. Canonical/schema/sitemap/navigation and editable page metadata use the new URL with no trailing slash. Existing image files/aliases, UI, content, GHL DOM form identity website-iot-development-enquiry and original form contract remain unchanged. Production source WordPress is not modified.

## Additional verification
Cloudflare Siteverify was called with the separate production secret and a deliberately invalid QA token. HTTP 200 / success=false / invalid-input-response confirms the negative challenge path, not a successful production-domain solve. No real production lead was submitted.

Deployment status: production-capable runtime is now present in READY staging deployment dpl_sMAJHqKBgrnti5ff1wmyyozuTUTS (428eee44). Production environment values remain prepared-only; no production deployment, DNS, WordPress code or domain attachment occurred. Stable staging form security behavior is preserved. Live production-host successful Turnstile/GHL/CallRail mapping tests remain explicitly pending cutover.
