# OpenAI Ads measurement — 12 November 2026

Requested account: `adacct_6a1481e7b45c8198946897a0933d85ed`.
New data source: **Inceptives Digital — Website & Landing Pages**.
New public Pixel ID: `21BtPQD1FG7KoRGMsezNw5`.
Conversion definition: **Website Lead Confirmed**, base event `lead_created`.

## Architecture

Both sites already install `GTM-5BV286F5`. Vendor initialization stays in GTM; do not install another OpenAI pixel in React. Published GTM version **45**, “OpenAI pixel refresh and verified lead tracking,” updates the existing OpenAI base/lead tags, removes debug mode, restricts OpenAI measurement to the production apex/www/app hosts, measures initial/SPA pathname views, and honors browser Global Privacy Control by denying OpenAI measurement. Existing stored SDK consent denial remains authoritative. No new consent UI or manual identity collection is added. Checked-in HTML files under `integrations/google-tag-manager` mirror the published tags; they are documentation/configuration artifacts, not a second runtime installation.

Main site now emits `lead_submitted` only after its handler, GHL and CallRail acknowledgement paths succeed. The iOS assessment uses the same helper. The data layer contains a random event ID, form ID, pathname and conversion category; no form answers, names, email or phone. GTM dispatch waits at most 200ms before the existing thank-you flow continues; analytics exceptions are suppressed.

Landing-page repository: `inceptivesdigital/healthcare-landing-page`. Existing shared consultation component previously posted through a hidden iframe and immediately announced success. The tracking patch forwards the same existing provider fields through `/api/lead`, and emits the existing lead event only after provider HTTP acceptance. This verifies provider acceptance, not downstream CRM/email processing. No real provider submission is required for automated tests.

## Audited existing configuration

- GA4 property 504214863, stream 12132751870, measurement `G-5HF96FEJHZ`: active in GA4 and observed collecting on the main site. Existing GTM lead event maps to `generate_lead`.
- Existing Google tag `G-1QVWWN2VC3` remains; runtime requests reach the active stream. Do not replace IDs based on tag display names alone.
- Meta base pixel `1311118190948804` active; older `1818395585777251` template paused. Existing Meta lead trigger is `lead_submitted`.
- Duplicate `AW-18137474214` Google Ads base tag named “Google Tag” paused in version 45; specifically named base retained.
- Google Ads lead conversion previously fired on any URL containing `thank-you`. Version 45 changes it to the actual `lead_submitted` success event.
- WordPress bridge selectors repaired for migrated form focus/attempt events, and disabled on the app subdomain where React already emits equivalent events.
- CallRail, conversion linker, LiveChat, Leadfeeder and Clarity tags preserved. Presence/configuration does not establish end-to-end provider delivery.

## Coverage and intentional limits

Pixel-only setup. No CAPI secret created, requested or stored. No browser/server event deduplication required; event IDs remain available for a future approved CAPI integration. SDK owns attribution cookies and `oppref`; no hand-generated attribution identifiers.

`page_viewed` and `lead_created` are in scope. `contents_viewed` is deferred because service-page views already use page measurement; cart, checkout, purchase, signup, subscription and trial events are not applicable to the inspected marketing forms. Appointment measurement is deferred to a separately verified booking success boundary; calendar-button clicks are not bookings. No app-native events are appropriate for this web subdomain.

Manual hashed user matching is intentionally omitted: no approved identity-sharing/measurement-consent hook exists in either repository. Do not scrape raw form details into GTM. Account-level automatic matching, if enabled by the advertiser, is controlled by the SDK/account setting.

Old data source `KsRhBg7EwMEAh6iCAY7WVf` is now archived through Ads Manager's supported Archive action. The dialog explicitly states that historical conversion settings remain available. The account now lists one active data source. Two historical campaign references were preserved; no campaigns, budgets or bids were modified. Choose **Website Lead Confirmed** for future campaign conversion setup.

## Verification

TypeScript check passes. `node scripts/verify-conversion-tracking.mjs` tests production-only main-site dispatch without sending network traffic. With an optional landing endpoint file argument it additionally tests accepted/rejected delivery, invalid email, untrusted origin, unsupported method and network error (10 checks total). Landing Vercel preview build READY; authenticated GET `/api/lead` returns 405 JSON as expected.

Published/deployed verification:

- GTM UI confirms **Version 45 is Live**, with 46 tags and 21 triggers inventoried. This is not a claim that every third-party integration or paused tag was exercised end to end.
- Main production deployment `dpl_9HF9JMTKjkcZgUbttqYzFbSEjomS`, application commit `e656648c703abf48c0cab930f7f2552aa1b256ec`: READY. Source pushed to main and qa in `aamirrrkhandev/inceptivesdigital-website`.
- Landing production deployment `dpl_GgzEi7tmZUQSCt5nwPo67Cfv73TF`, commit `89358adbb309325bf13f551a51b2ef328690dcd9`: READY. Source pushed to main and `tracking/openai-ads` in `inceptivesdigital/healthcare-landing-page`.
- Real browser page visits on both production hosts: OpenAI new-pixel endpoint HTTP **202**; GA4 `G-5HF96FEJHZ` collection HTTP **204**. Ads Manager Event Stream independently shows the new pixel's initialization and `page_viewed` events.
- Main footer enquiry and iOS five-step assessment, plus Healthcare, Flutter, React Native, iOS, Android and App Development landing forms: browser checks with all delivery/measurement providers isolated. Failed delivery emitted zero OpenAI leads; accepted delivery emitted exactly one OpenAI `lead_created` and one Meta `Lead`, followed by thank-you navigation. Main footer and App Development additionally verified zero GA4 `generate_lead` requests on failure and exactly one on acceptance. These are mocked conversion-firing checks, not real provider lead acceptance or campaign attribution tests.
- Production landing API: GET returns 405 JSON; invalid-email POST returns 400 and does not reach the delivery provider. Accepted/rejected upstream behavior tested with mocks.
- GTM compiler initially rejected a block-scoped function declaration; corrected to an ES5 function expression, then publication validation passed. Initial browser-harness issues with full-page navigation clearing counters and controlled hidden-select test values were corrected and re-tested; raw diagnostic runs retained under ignored audit files.
- Public DNS resolves apex `216.150.1.1` and app CNAME `84bb9a1416351cce.vercel-dns-016.com`. The local resolver intermittently failed; isolated browser checks used those independently verified public addresses. No system DNS, domain DNS or Cloudflare settings changed.
- Staging alias restored to its separate noindex preview. Production indexing configuration preserved.
- Python-based skill scanners could not run because Python is not installed. TypeScript, script syntax, targeted unit/transport tests, GTM compiler validation and repository diff inspection were run instead. No CAPI credentials or new secret environment variables were added.

Ads Manager Diagnostics reviewed after publication: two account-level warnings remain, **No active campaigns use conversion events** (high) and **No recent server-to-server events** (medium). Diagnostics reports zero sources affected and zero events at risk. The first requires choosing an active campaign/conversion objective; no campaign changes were requested. The second is expected for this Pixel-only setup and is not evidence of a broken browser pixel. Server-side CAPI remains a separate integration requiring an approved secret provisioning plan.

No real customer data or genuine enquiry was submitted in these automated tests. Actual lead receipt in OpenAI/GA4/Meta reporting, ad-click attribution, blocked-browser behavior and third-party CRM delivery remain distinct checks; they are not inferred from an SDK request or a mocked success. Existing GA4/Meta consent behavior was not certified or replaced by this integration.

Before deploying, the advertiser should review that this implementation satisfies their privacy, security, consent and data-handling requirements.
