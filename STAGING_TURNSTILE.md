# Isolated staging forms — 11 November 2026

The user explicitly authorized a new widget in the accessible Cloudflare account, with no live WordPress or DNS changes.

## Configuration and boundaries

- Widget: **Inceptives Website — Staging Forms**, Managed, pre-clearance off.
- Sole allowed hostname: `inceptives-homepage-review.vercel.app`.
- Public site key: `0x4AAAAAAF8W_dplhFI7dPcc`.
- Existing Video Testimonial widget and WordPress widget were not modified.
- Vercel project: `prj_LjTmsq5OcdsUnkV4tEKe2n4U6r0b`; Preview variables only. `STAGING_TURNSTILE_SECRET_KEY` is sensitive/server-only; `NEXT_PUBLIC_STAGING_TURNSTILE_SITE_KEY` is public; `STAGING_FORMS_DELIVERY=ghl` selects the isolated enquiry flow. No secrets are committed.
- The local ignored `.env.staging.local` is used explicitly for local production-build verification. It is not automatically loaded by Next.js.

## Delivery behavior

The old WordPress Elementor handler validates its own independent key/secret pair. A token from this staging widget cannot be forwarded to it successfully. Accordingly the staged enquiry route validates required fields against the current source contract, validates the token through Cloudflare Siteverify, and returns **GHL pending**, not a persisted-delivery receipt. The existing native GHL External Forms SDK must acknowledge delivery before CallRail capture and `/thank-you`. On GHL failure, values remain for retry. **Staged Elementor enquiries now deliver to GHL; they do not invoke WordPress email actions.**

The iOS assessment is different: its existing PHP scoring handler has no Turnstile contract. Staging adds validation before calling that unchanged handler, preserving scoring/PDF behavior and then waiting for GHL acknowledgement. Its PHP handler may send the existing assessment email. Calendly is unchanged.

The Next.js validator checks token length, Siteverify success, exact hostname and expected action, has a ten-second timeout and fails closed. No test keys or CAPTCHA bypass are used in the deployed configuration. Non-staging configuration retains the previous integration. Immutable deployment hostnames are not authorized for real form submissions.

## Verification

- Production build and TypeScript passed.
- Eleven isolated server checks cover success, rejected/oversized/missing tokens, unexpected hostname/action, missing configuration and provider failure.
- Three isolated browser groups cover script retry, expiry, compact mobile sizing, retained values, dynamic mount/cleanup and exclusion of tokens from analytics.
- All ten native GHL SDK journeys passed with intercepted delivery, including failed delivery/retry and thank-you behavior. These tests do **not** establish real CRM or email delivery.
- Local client-bundle scan found no staging secret in fifteen static files.
- Final Preview `dpl_69v8cJrEP2uM7tdKhVEjhD4mpQto` (runtime commit `63a1ef8149426f3ac5ec2a7bee2078c2eedcaba4`) is READY and assigned only to the existing staging alias. Contact returns 200, the expected title and `noindex, nofollow, noarchive`. All ten isolated native GHL journeys passed against this final build with delivery intercepted.
- Genuine contact and web enquiries passed: real widget/token, deployed validation, GHL acknowledgement and thank-you. Both records were observed in GHL External Forms. Contact detail includes fields, page title/URL, form ID, UTM source/medium and campaign in the original URL. CallRail shows both captures and thank-you visits; the web record contains 5/5 fields and its source URL. Existing first-touch attribution persists across the reused QA session.
- Deployed negative checks: missing token 400, forged token 400, wrong Origin 403. Rejected attempts do not produce delivery.
- **All ten genuine form types passed**: contact, footer, popup, web, staff enquiry, IoT, VR, AR, staff assessment and iOS. Each reached thank-you and each new record was observed in GHL External Forms (total increased from 18 to 28). The user completed the interactive IoT and staff assessment challenges; no CAPTCHA was bypassed. iOS used its real PHP scoring handler. GHL staff/iOS detail retains role/options, all four quiz answers, identity/company and attribution. Email inbox delivery and a real PDF download were not independently observed in this batch.
- CallRail limitation: the filtered dashboard showed nine QA events including the preceding run's original event, so eight new captures are confirmed, not ten. Successful GHL delivery does not imply a CallRail acknowledgement. The optional SDK capture/transport remains best effort; no routing, pool, paid or production settings were changed. Investigate the two unconfirmed analytics captures separately rather than resubmitting accepted leads.
- Local proof remains in ignored `audit/callrail-cloudflare/`, including `staging-widget-created.png`, `staging-turnstile-ghl-all-ten.png`, `staging-turnstile-ghl-ios.png`, `staging-turnstile-ghl-staff.png` and the sanitized real-result JSON. Challenge-pending screenshots are historical handoff evidence. No secrets are versioned.

Rollback: assign the stable staging alias back to `dpl_7FMvA7SDroaU8t9VJr5Wjjy8Wxk1`. This restores the old staging integration (which still has the original hostname-authorization blocker); it does not affect WordPress or DNS.

Provider reference: [Cloudflare server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
