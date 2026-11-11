# OpenAI Ads measurement — 12 November 2026

Requested account: `adacct_6a1481e7b45c8198946897a0933d85ed`.
New data source: **Inceptives Digital — Website & Landing Pages**.
New public Pixel ID: `21BtPQD1FG7KoRGMsezNw5`.
Conversion definition: **Website Lead Confirmed**, base event `lead_created`.

## Architecture

Both sites already install `GTM-5BV286F5`. Vendor initialization stays in GTM; do not install another OpenAI pixel in React. GTM draft updates the existing OpenAI base/lead tags, removes debug mode, restricts OpenAI measurement to the production apex/www/app hosts, measures initial/SPA pathname views, and honors browser Global Privacy Control by denying OpenAI measurement. Existing stored SDK consent denial remains authoritative. No new consent UI or manual identity collection is added.

Main site now emits `lead_submitted` only after its handler, GHL and CallRail acknowledgement paths succeed. The iOS assessment uses the same helper. The data layer contains a random event ID, form ID, pathname and conversion category; no form answers, names, email or phone. GTM dispatch waits at most 200ms before the existing thank-you flow continues; analytics exceptions are suppressed.

Landing-page repository: `inceptivesdigital/healthcare-landing-page`. Existing shared consultation component previously posted through a hidden iframe and immediately announced success. The tracking patch forwards the same existing provider fields through `/api/lead`, and emits the existing lead event only after provider HTTP acceptance. This verifies provider acceptance, not downstream CRM/email processing. No real provider submission is required for automated tests.

## Audited existing configuration

- GA4 property 504214863, stream 12132751870, measurement `G-5HF96FEJHZ`: active in GA4 and observed collecting on the main site. Existing GTM lead event maps to `generate_lead`.
- Existing Google tag `G-1QVWWN2VC3` remains; runtime requests reach the active stream. Do not replace IDs based on tag display names alone.
- Meta base pixel `1311118190948804` active; older `1818395585777251` template paused. Existing Meta lead trigger is `lead_submitted`.
- Duplicate `AW-18137474214` Google Ads base tag named “Google Tag” paused in draft; specifically named base retained.
- Google Ads lead conversion previously fired on any URL containing `thank-you`. Draft changes it to the actual `lead_submitted` success event.
- WordPress bridge selectors repaired for migrated form focus/attempt events, and disabled on the app subdomain where React already emits equivalent events.
- CallRail, conversion linker, LiveChat, Leadfeeder and Clarity tags preserved. Presence/configuration does not establish end-to-end provider delivery.

## Coverage and intentional limits

Pixel-only setup. No CAPI secret created, requested or stored. No browser/server event deduplication required; event IDs remain available for a future approved CAPI integration. SDK owns attribution cookies and `oppref`; no hand-generated attribution identifiers.

`page_viewed` and `lead_created` are in scope. `contents_viewed` is deferred because service-page views already use page measurement; cart, checkout, purchase, signup, subscription and trial events are not applicable to the inspected marketing forms. Appointment measurement is deferred to a separately verified booking success boundary; calendar-button clicks are not bookings. No app-native events are appropriate for this web subdomain.

Manual hashed user matching is intentionally omitted: no approved identity-sharing/measurement-consent hook exists in either repository. Do not scrape raw form details into GTM. Account-level automatic matching, if enabled by the advertiser, is controlled by the SDK/account setting.

Old data source `KsRhBg7EwMEAh6iCAY7WVf` has historical events and its conversion is referenced by two campaigns. Removal needs explicit action-time confirmation if permanent; do not silently delete campaign dependencies.

## Verification

TypeScript check passes. `node scripts/verify-conversion-tracking.mjs` tests production-only main-site dispatch without sending network traffic. With an optional landing endpoint file argument it additionally tests accepted/rejected delivery, invalid email, untrusted origin, unsupported method and network error (10 checks total). Landing Vercel preview build READY; authenticated GET `/api/lead` returns 405 JSON as expected.

Publication and real received-event verification must be recorded after execution; a saved GTM draft is not a published installation. No real customer data or genuine enquiry was submitted in these automated tests.

Before deploying, the advertiser should review that this implementation satisfies their privacy, security, consent and data-handling requirements.
