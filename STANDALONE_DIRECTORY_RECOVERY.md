# Standalone WordPress directory recovery — 12 November 2026

Recovered public files from the original WP Engine origin with valid TLS, using a per-request origin lookup. No system DNS, domain records, WordPress settings, or live deployments were changed.

## Files and URL compatibility

| Local directory | Files recovered | Bytes | Purpose |
|---|---:|---:|---|
| `public/email-signature/` | 15 | 10,125,765 | Existing company email signature image URLs; original names and case retained |
| `public/reviews/` | 13 | 1,399,924 | HTML, CSS, JS, logo, three fonts and six review platform icons |
| `public/custom-mobile-application-development/` | 116 | 5,606,729 | Landing HTML and referenced local styles, scripts and images, including dynamically generated galleries |

Email signature filenames were enumerated in the authenticated Advanced File Manager of the preserved `inceptivesdstg` WordPress environment. Files were then recovered from the original production WP Engine public origin. These are public HTTP representations, not a byte-for-byte private filesystem backup. No signature URL was renamed or redirected.

Next.js route handlers serve `/reviews` and `/custom-mobile-application-development` as independent recovered documents. They do not inherit the main site's CSS or header. Relative asset paths work on slashless URLs. The original custom-mobile canonical has no trailing slash. Reviews retains `noindex,follow`. A transient Cloudflare origin challenge script is removed from the served document; authored scripts remain.

## Verification

- TypeScript: passed.
- Local server: `http://localhost:3101` (3100 already occupied by another server).
- 144 recovered files: HTTP 200, byte length matches recovery manifest.
- Both pages: HTTP 200 at 390px and 1440px.
- All page images decoded successfully after exercising lazy loading.
- No horizontal overflow or browser JavaScript exceptions in these checks.
- Title, canonical and robots match the recovered original documents.
- Reviews rendered all six platform cards.
- Screenshots, per-file SHA-256 hashes, and detailed results: `audit/html-file-manager-2026-11-12/` (local, ignored by Git).

## Limits / remaining release checks

- No Vercel deploy or Git push performed. Production therefore still serves its previous deployment, including its existing missing routes/assets.
- Full local production build passed, including 4,915 generated entries. The production build is running at `http://localhost:3102`. Both pages and all 144 recovered files were rechecked against that build.
- External integrations were blocked during browser QA to avoid sending telemetry or creating real submissions. Video recording/upload, Turnstile authorization, and real lead delivery are not verified by this report.
- The original landing's Zapier-only, optimistic-success submission callback has now been replaced in the served document with the shared GHL/CallRail/Turnstile integration. See follow-up delivery checks below; real CRM delivery remains unverified.
- Reviews retains its existing external Cloudflare Worker upload service. No video was submitted and no camera permission requested.
- Two inherited CSS references return 404 at the original host: `fonts/Stroke-Gap-Icons-Webfont/style.css` and `images/general-elements/overlay-pattern.png`. Neither caused broken rendered images or JavaScript exceptions in the tested scenarios. No replacement artwork was invented.
- This recovers the two requested directories and the missing landing page's referenced assets; it is not an exhaustive export of the original private server filesystem or a React component rebuild.

## Follow-up interaction QA

Tested at 390px and 1440px against the development server and the local production build:

- Landing: CTA modal opens, Escape closes it, FAQ toggles, testimonial selection, portfolio next control, and required-field validation passed.
- Reviews: six platform cards, progress marking/persistence/reset, invalid upload rejection, selected-video clearing, and missing-Turnstile-token submission prevention passed.
- No real customer data, camera/microphone access, uploads, or live lead submissions were used. All external browser requests were blocked during these tests.
- Confirmed and fixed one inherited interaction defect: `.id-mid-cta::before` covered the landing Contact button and intercepted clicks. The added `recovery.css` sets `pointer-events: none` only on that decorative pseudo-element. Colors, type, layout, text and metadata are unchanged.
- Production-only image lookup defect: the Smart Device & Wearable Apps icon's literal ampersand was rejected by the production static-file matcher. Its served HTML reference now encodes the filename correctly; the original local filename is retained.
- Read-only upload-service CORS preflight: production origin `https://inceptivesdigital.com` returns 204 with the matching allowed origin and POST/PUT methods. Vercel staging and localhost return 403. Actual uploads cannot be claimed working on those origins until the existing external Worker's origin allowlist is updated; no Worker configuration was changed.
- The original landing's Zapier-only delivery and optimistic success/error redirect were identified as release limitations and have now been replaced locally, as described below.

Production QA logs: `audit/html-file-manager-2026-11-12/production-build.log`, `production-verification.log`, `production-interactions.log`. Detailed verification JSON and screenshots are in the same local folder.

## Standalone landing form integration

- Hero, footer and modal retain the recovered form layout, labels and fields. Stable GHL form IDs: `custom-mobile-hero-enquiry`, `custom-mobile-footer-enquiry`, `custom-mobile-modal-enquiry`.
- Served HTML removes only the old submit callback; original input tracking and other page interactions remain. The archived source document is retained unchanged.
- `/api/standalone-enquiry` checks same origin, payload shape, allowed form/path, required fields, email and existing server-side Turnstile verification. It returns `ghl-pending`, never a delivery acknowledgement.
- Browser integration uses the existing shared GHL, CallRail, conversion and Turnstile modules. Generated browser copies contain public widget IDs only. `scripts/prepare-standalone-form-runtime.mjs` runs during development/build to keep these copies synchronized. Secret keys remain server-side.
- GHL acknowledgement is required before conversion or `/thank-you`. Failure preserves entered fields, shows a retryable message, re-enables the button and resets the security widget. No legacy Zapier request is made by the new handler.
- Local delivery is deliberately blocked outside configured staging/production hosts. Local QA intercepts vendor requests rather than creating real records or bypassing live CAPTCHA.
- Isolated native-GHL-SDK tests passed for all three forms: validation failure produces zero GHL submissions/conversions; success produces one GHL submission, one conversion and the thank-you redirect. The hero test also exercises GHL rejection and confirms zero conversions/no redirect. Same-origin/unknown-form/invalid-email API rejection checks passed.
- These are mocked transport acknowledgements, not proof of real GHL inbox delivery, native CallRail capture, or live Turnstile completion. No real customer data or test enquiry was submitted.
- Reviews video upload retains its original external Worker. The Worker source is not in this repository; no Cloudflare account or origin allowlist changes were made.

## Authorized real delivery and release follow-up

The earlier recovery notes describe checkpoints in time. The following supersedes their remaining-delivery limitations:

- User explicitly authorized real GHL and CallRail test submissions. Real native SDK transports were exercised without deploying the website, using clearly marked synthetic test enquiries, reserved example.invalid emails and test phone numbers. This isolates vendor delivery; it does not prove a real browser CAPTCHA-to-submit journey.
- All three standalone form types received actual GHL and CallRail HTTP 200 acknowledgements. All three retest records (`20261112005150`) were confirmed in both dashboards, including names in GHL.
- GHL initially captured raw submissions without a name/contact mapping. Explicit Full Name mapping was saved for hero/footer/modal on staging; Email and Phone mappings retained. The existing production-domain popup had zero mapped fields; its first name, last name, email and phone mappings were corrected in GHL without changing website content.
- The initial multi-form transport probe reused one page/session and did not establish a separate hero dashboard record. Retests used isolated contexts and confirmed three distinct dashboard records. Initial and retest evidence is retained separately under the ignored audit directory.
- User separately authorized the upload-service security settings change. Cloudflare Worker version `c513b889` (ALLOWED_ORIGINS only) was activated; previous version `ce9c5568` is available for rollback. Existing production origins were retained, and staging plus localhost ports 3101/3102 were added. Preflights now return 204 for each authorized origin; an untrusted origin still returns 403.
- The existing video Turnstile widget retained its key and mode. Staging hostname and localhost were added, increasing the configured hostnames from two to four. No secrets were displayed, copied or rotated.
- A synthetic video was prepared, but the Chrome extension blocked file attachment without its file-URL permission. The user subsequently asked to defer video testing and release the remaining website work. No video was uploaded, no consent checkbox accepted, no CAPTCHA completed by the agent, and no real upload success is claimed.
- The user then authorized the website production release. Website/Vercel deployment was not performed during the earlier recovery/transport checks; release outcome will be recorded separately.
- Original index.html aliases redirect to the restored slashless routes; this prevents direct access to the archived legacy submit callback. The recovered indexable landing canonical is included in the pages sitemap. Reviews remains noindex and excluded from that sitemap.
- Production hostname transport tests also returned actual GHL/CallRail acknowledgements. Explicit Full Name mappings were then saved for all three production-host standalone forms (3/5 mapped: name, email, phone; message and source_path remain raw submission fields). Both production and staging domain mappings are prepared before release.
- Final local production build and regression checks passed, including original index aliases returning 301, all 144 recovered-file/alias checks, both pages at 390px/1440px, and page-sitemap inclusion/exclusion. Original recovered directory bytes are protected from Git newline rewriting using `.gitattributes`.
