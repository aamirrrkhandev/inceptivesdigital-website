# Migration progress

Current staging: https://inceptives-homepage-review.vercel.app/ (deployment dpl_69v8cJrEP2uM7tdKhVEjhD4mpQto, runtime source commit 63a1ef8149426f3ac5ec2a7bee2078c2eedcaba4).

## Separate staging Turnstile — 11 November 2026

User authorized a new widget: **Inceptives Website — Staging Forms**, sole hostname `inceptives-homepage-review.vercel.app`, Managed, pre-clearance off. Existing widgets, live WordPress, original Vercel project and DNS are unchanged. Preview-only secret/public key configured on the separate project. The old account/key block below is superseded for staging by this independent widget.

Staged Elementor enquiries validate through Next.js Siteverify and deliver through native GHL, not WordPress email actions. GHL acknowledgement precedes CallRail and thank-you. iOS retains original PHP scoring/email/PDF behavior with staging verification added before it. See STAGING_TURNSTILE.md for boundaries and rollback.

Build/typecheck, eleven isolated server checks, three lifecycle/mobile groups and ten native SDK journeys pass, including against the deployed candidate. All ten genuine form types reached thank-you and all ten new records were observed in GHL (18 → 28 total), with staff/iOS answers and attribution confirmed. User completed the IoT and staff human checkboxes. Missing/forged token and wrong Origin reject correctly. CallRail confirms eight new captures; two remain unconfirmed analytics events, not failed GHL deliveries. Email inbox delivery and a real PDF download are not independently certified. Feature branch: `migration/staging-turnstile`. Rollback: `dpl_7FMvA7SDroaU8t9VJr5Wjjy8Wxk1`.

Cloudflare follow-up, 11 November: connected-account sign-in succeeded, but the source/staging widget is absent from its single-widget account. Only the separate Video Testimonial widget is available. User is identifying the original widget owner/account; no hostname or DNS changes were made. Missing-challenge rejection (400) and source/staging key parity were verified.

## CallRail / Cloudflare batch — 11 November 2026

The official source CallRail company snippet now loads from the shared root across staging. Business phone links use a swap-compatible E.164 URI, fixing the observed case where only display text changed. All ten enquiry/assessment types passed with native GHL/CallRail SDKs and intercepted delivery; challenge/hidden control values are excluded, and capture occurs after confirmed delivery. One actual CallRail QA submission received HTTP 200 with native session/landing data and one UUID; all four contact-page phone links matched the assigned display number. No real call was placed. WordPress/GHL endpoints were mocked in that live-CallRail transport test.

Turnstile client recovery, expiry state, responsive sizing and dynamic widget cleanup pass three isolated fixture groups. Real staging widgets still report 110200 (hostname not authorized). Cloudflare login is required to authorize the existing key for the staging host. No CAPTCHA bypass or unconfigured validator was enabled. The user handled CallRail’s Terms notice; dashboard inspection confirms the QA record’s five fields, first/last touch, source/medium, landing URL and thank-you visit. The vendor installation checker is not certified. An existing five-month-old pool warning recommends five numbers; four are listed. No paid/routing changes were made. Neither live WordPress, DNS, original Vercel, CallRail routing nor paid resources changed.

Candidate checks passed: ten native-SDK form journeys, three Turnstile fixture groups, eight representative SEO comparisons, 28 redirects, sitemap/robots (230 entries), and 16 header/footer widths. Rollback: dpl_E6PRXtRvQnM29A43jsZu58yahEyy. See CALLRAIL_CLOUDFLARE_REPORT.md and audit/callrail-release-2026-11-11. Account-side Cloudflare work is explicitly deferred by the user; this batch is not a full protected-form/inbox acceptance claim.

## GHL enquiry/assessment integration — 10 November 2026

All ten enquiry/assessment types use the account's native GHL External Forms capture while retaining their interfaces. Consent controls were removed without asserting opt-in. Invalid/backend-failed attempts are excluded; confirmed GHL acknowledgement precedes completion; retry preserves values and avoids repeating an unchanged accepted WordPress delivery in the current mounted form. Staff roles/options and iOS answers are retained in native named fields. Calendly is explicitly unchanged; the user will provide its replacement link later.

The deployed candidate passed the real vendor SDK tests for all ten types (both destinations mocked), 16 header/footer viewports, 21 restored-page render/interaction checks, eight representative SEO comparisons, 28 redirects and 230 sitemap entries. Eighteen actual GHL QA submissions were accepted and observed in Forms → Submissions → External Forms: ten initial types plus eight post-mapping checks. Six custom contact mappings and the optional iOS company mapping were corrected through GHL's staging-domain settings. The latest eight rows show the expected name/email; staff and iOS details include their answers, mapped company and attribution. Evidence is recorded in GHL_FORMS_INTEGRATION.md and audit/ghl-release. Real WordPress email delivery was mocked in this integration batch; no inbox claim is made. Rollback: dpl_HnSXFGYZA7fzyGc8WkLGJDScbs2x. Live WordPress, original Vercel and DNS remain unchanged.

## Approved SEO / blog synchronization release — 10 November 2026

248 current page paths passed deployed HTTP/title/description/canonical/heading/schema/preview checks. All 230 sitemap destinations passed HTTP/canonical checks; all 28 redirects are single-hop 301s to 200 pages. Browser checks passed: 16 header/footer widths, 16 no-reload blog filter/history/view groups, 20 restored-page viewport/tab/FAQ groups plus one staff assessment flow, three mocked contact redirects. All form responses in this release QA were mocked; real inbox delivery is not certified. See SEO_FIXES_AND_BLOG_SYNC.md and audit/seo-release-2026-11-10.

| Path | Status | Verification / remaining work |
| --- | --- | --- |
| /web-development | Restored from user-approved older Vercel reference | Original assets/copy; four viewport/tab/FAQ checks passed; full pixel acceptance pending |
| /staff-augmentation | Restored from user-approved older Vercel reference | Four viewports, technology/process tabs, FAQs and two-step role questionnaire passed; full pixel acceptance pending |
| /iot-development | Restored from user-approved older Vercel reference | Original assets/copy; four viewport/tab/FAQ checks passed; full pixel acceptance pending |
| /virtual-reality-development | Restored from user-approved older Vercel reference | Original assets/copy; four viewport/tab/FAQ checks passed; full pixel acceptance pending |
| /ar-app-development | Restored from user-approved older Vercel reference | Original assets/copy; four viewport/tab/FAQ checks passed; full pixel acceptance pending |
| /startup-product-development | Deferred by explicit user instruction | Remains 404; no page/redirect/sitemap entry added |
| /blog/test | Dynamic published WordPress post | Deployed 200; content/metadata included in inventory checks |
| /thank-you | Confirmation route | Source metadata/schema/H2 restored; three responsive sizes and native enquiry redirects passed |

GHL integration details and the remaining overall migration acceptance work are tracked separately below and in GHL_FORMS_INTEGRATION.md. No WordPress/original Vercel/DNS changes are authorized.

The user authorized all-page implementation after the homepage review. There are 241 implemented page/archive paths. Implementation does not mean acceptance: complete visual, accessibility, integration, social-metadata and performance acceptance remain incomplete. The iOS assessment uses the existing WordPress PHP handler; one authorized real test was accepted and produced a downloadable PDF. General contact forms now have native submission wiring, but CAPTCHA and actual inbox delivery remain unverified. Ten original images in three posts remain unavailable. No production cutover is authorized.

## Current staging batch — homepage header/footer and social icons

Homepage-only containers, header columns, footer links/address grids and copyright wrapping were adjusted. Main/footer content is bounded at 1600px, header at 1760px, with 16–48px gutters. Social icons have 44px touch targets and 12px gaps. The deployed candidate passed 16 widths (320–2560px), mobile menu checks and desktop submenu bounds. The header/footer candidate also passed 28 banner and eight slider groups. Homepage metadata, 148 headings, 164 footer links and 22 form fields were unchanged. See `HOMEPAGE_HEADER_FOOTER_REVIEW.md`.

## Current staging batch — clean blog URLs

Local and deployed tests pass for an AJAX listing island that keeps the address bar at /blog. Category/search/view/page state moves into browser history; old category/search URLs receive noindex metadata and a canonical to the clean blog URL. API responses are noindex, and unfiltered pagination remains crawlable. Category/filter history, resize, missing-data retry and API error handling are verified on the deployed candidate before publication.

## Previous staging batch — same-page blog tabs

Category tabs, pagination, search and responsive view changes now use client-side Next.js navigation with scroll preservation. Browser verification passed 16 groups: all 13 categories, pagination/back history, and mobile/tablet categories. A document nonce and top-level navigation request counter confirmed no page reloads; category clicks preserved scroll position. See `audit/browser/blog-client-tabs-verification.json`. Rollback: dpl_61mWbeTHqJtU7Y8gbL6vpToRNKHy.

## Previous staging batch — green calendar accents

Changed the homepage calendar primary colour, glow, icons, eyebrow, links and fallback controls from blue to brand green (#00ce44). Actual embedded calendar date accents and section colours passed browser checks at 375px and 1366px without horizontal overflow. See `audit/browser/calendar-green-verification.json`. Published to the separate staging project; rollback is dpl_2aqkhGXypjspwjuszXwQ1maAvu9t.

## Previous staging batch — calendar and automatic blog updates

Published the requested homepage-only black meeting section with automatically lazy-mounted Calendly at 580/640/660px heights. Seven responsive layout checks and keyboard fallback passed; real calendar date grids were verified at all seven widths (desktop uses a different calendar heading, accounted for in QA).

WordPress is now the read-only source for newly published/updated blog posts, blog listings, category/search queries and sitemap entries. The actual new `/blog/test` post is visible. All 13 category tabs, pagination, the source-hidden search handler, current post metadata/schema, sitemap, real 404 and responsive 6/9/15 counts passed on Vercel (19 verification groups). Cache revalidation is request driven at 30 seconds; allow roughly 30–60 seconds and refresh an already-open tab. See `WORDPRESS_CONTENT_SYNC.md`.

The 241-route baseline has 239 exact passes and two expected heading changes: the approved homepage redesign and the latest blog card. The sitemap now has 225 entries. No source WordPress, original Vercel project or DNS change was made.

## Previous staging batch — image sizing and banners

Published the banner fitting correction, homepage-only `casestudy-slider-component` and native smooth scrolling to the separate staging project. Authored custom background sizes/positions are preserved; the homepage decorative panel fills its text container. Deployed checks: 28 banner checks, eight slider verification groups, 12 media checks, 22 navigation/scroll checks and 241 SEO/status checks passed. All-route browser/image geometry review remains tracked separately. 168 unused loose images were moved with verified unchanged hashes into `draft/images`; no packed image was removed. See `IMAGE_LAYOUT_REVIEW_2026-11-10.md`.

## Previous staging batch — responsive media

Published only to the separate migration project on 10 November 2026. Desktop/tablet/mobile navigation fixes, expanded-menu scroll handling, image-fit overrides for 516 captured background rules across 241 routes, and the uncropped blockchain CTA layout are included. Original video files are now materialized as static assets at their preserved URLs, providing correct HTTP byte ranges and working hover playback on all three homepage cards. Exact body-class matching fixes the shared CSS prefix collision. Embedded HTML widget titles no longer create duplicate SEO titles; the iOS title matches the current live head title.

Deployed checks passed: 241 HTTP/title/description/canonical/heading/schema/preview-robots checks, a real 404, 224 sitemap entries, 12 media checks including three actual hover playbacks and CTA fitting at eight widths, and 22 responsive navigation/scroll checks. The stable alias was switched only after the candidate passed. Source WordPress, the original Vercel project and the live domain were unchanged. See `STAGING_RELEASE_2026-11-10.md` for evidence and rollback.

## Latest CSS review

Local update, 10 November 2026: port 3100 now serves the verified current production build. The mobile drawer close bug passed 24 repeated cycles at four widths. The iOS assessment's five steps and retained selections passed mobile/tablet/desktop checks; error/retry, result display and PDF download passed with mocked submission responses. Fresh public-source radio contracts match. One explicitly authorized real assessment then returned HTTP 200 / success from the original WordPress PHP handler, rendered its actual recommendation and downloaded its branded PDF. Inbox delivery and independent PHP snippet migration remain pending. See `FORM_AND_MOBILE_MENU_REVIEW.md`. This local update has not been published to Vercel.

The green banner panel position, desktop submenu overflow, mobile submenu expansion, and tablet heading overlap were corrected. The deployed preview passed 27 navigation checks at six widths and four homepage banner checks. The original 24.5MB video is served as a static file at its preserved URL. Live WordPress, the original Vercel project, and DNS were unchanged.

## Per-page acceptance tracker

| Path | Implementation | Latest verification / remaining work |
| --- | --- | --- |
| / | Staging implementation present | Banner: four widths passed on deployed preview. Remaining full-page and integration acceptance pending. |
| /blog/test | Dynamic WordPress post on staging | HTTP/content/title/canonical/schema, sitemap inclusion and listing verified; full responsive visual acceptance pending. |
| /services | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /computer-vision-development-services | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /ai-chatbot-development-services | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /dropryde | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /founders-letter | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /dating-app-development-company | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /food-delivery-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /partnership | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /mobile-app-development-new-york | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /mobile-app-development-company-in-toronto-canada | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /travel-app-development-company | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /life-at-inceptives-digital | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /healthcare-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /mobile-app-development-austin | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /mobile-app-development-company-london-uk | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /product-rescue-scaling | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /mobile-app-development-san-francisco | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /product-strategy-consulting | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /digital-product-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /discovery-sprint | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /custom-software-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /interactive-prototyping | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /ui-ux-design | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /system-integration-api-automation | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /mvp-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /ai-app-development-services | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /post-launch-analytics-iteration | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /machine-learning-development-services | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /generative-ai-development-company | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /nlp-development-services | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /rpa-development-services | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /ai-agent-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /ai-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /about-us | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /mobile-app-development-company-dubai-uae | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blockchain-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /mobile-app-development-company-singapore | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /fintech-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /real-estate-app-development-company | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /privacy-policy | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /terms-and-conditions | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /education-app-development-company | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /react-native-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /portfolio | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /portfolio/state-of-the-art-chiropractic | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /portfolio/halwar-connect | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /flutter-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /portfolio/family-entertainment-group | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /portfolio/zoom-read | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /portfolio/dps-airem | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /portfolio/pulse-check-timer | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /portfolio/my-tango-event | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /portfolio/wordsmith-pro | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /portfolio/pets-b4-profit | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /portfolio/stakbread | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /leadership | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /testimonial | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /press-release | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /ecommerce-app-development-company | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /contact-us | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /ai-automation-services | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /mobile-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /backend-api-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /app-store-optimization | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /product-launch-strategy | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /business-process-automation | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /kotlin-multiplatform-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /ai-development/ai-cost-estimator | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /fitness-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /ai-mvp-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /android-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /cross-platform-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /ios-app-development | Staging implementation present | Navigation: 27 checks passed on deployed preview. Remaining page acceptance pending. |
| /web-app-development-company | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/common-reasons-digital-products-fail | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/singapore-businesses-mobile-apps-user-experience | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/in-house-development-vs-app-development-partner | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/ai-app-builders-vs-human-developers | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/custom-fitness-app-development-startups | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/android-app-development-tools | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-app-testing-strategies | Staging implementation present | Blocked: original blog images unavailable; remaining acceptance pending. |
| /blog/app-store-optimization-mistakes | Staging implementation present | Blocked: original blog images unavailable; remaining acceptance pending. |
| /blog/healthcare-app-monetization-strategies | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/top-mobile-app-development-companies | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/cost-to-build-fitness-app-like-myfitnesspal | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/how-to-validate-your-game-idea | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/signs-startup-needs-custom-software-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-app-performance-optimization | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/telemedicine-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/website-development-guide | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/must-have-features-healthcare-app | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/why-invest-in-custom-mobile-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-app-marketing-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/blockchain-in-software-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/android-ar-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/how-to-make-a-mobile-game-with-unity | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/how-to-validate-your-mobile-app-idea | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/fitness-app-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/how-to-build-a-fintech-mvp | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/software-development-for-startups | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/common-ui-ux-design-mistakes | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/best-mobile-banking-apps | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-game-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/blockchain-app-development-in-business | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-app-tech-stack | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/guide-to-custom-ios-app-development-for-businesses | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/best-android-emulators | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/blockchain-for-startups | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/custom-workout-and-training-app-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/geopolitical-impact-software-development-rising-cost-2026 | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/augmented-reality-app-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/healthcare-mobile-app-development-guide | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-game-development-process | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/how-to-build-cross-platform-mobile-app | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/how-to-create-a-blockchain-app | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/what-is-android-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/what-is-fintech-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/john-wick-aaa-game-features-combat-mechanics | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/how-to-hire-a-mobile-app-development-company | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/how-long-does-it-take-to-make-a-mobile-game | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/how-to-choose-the-right-healthcare-app-development-company | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/cost-to-build-a-fintech-app | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/will-ai-really-replace-app-developers | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/ar-vr-in-fitness-apps | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/accurate-weather-apps | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/factors-affecting-app-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/best-dating-apps | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/2d-vs-3d-game-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/gta-6-development-cost | Staging implementation present | Blocked: original blog images unavailable; remaining acceptance pending. |
| /blog/publish-update-an-app-on-app-store-google-play | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/why-choose-flutter | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/best-game-development-engines | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/effective-marketing-strategies-for-mobile-apps | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/top-mobile-game-development-companies | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/the-role-of-ui-ux-design-in-mobile-app-success | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/native-vs-hybrid-vs-cross-platform-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/what-is-digital-product-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-app-monetization-strategies | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/android-app-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/aso-strategies-to-increase-your-app-store-rankings | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/ai-powered-mobile-apps-uae-business-operations | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/food-delivery-app-development-guide | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/hl7-fhir-healthcare-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/common-mobile-app-development-mistakes | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /press-release/clutch-top-user-experience-company-plano-2026 | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /press-release/clutch-top-app-development-company-plano-2026 | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/hidden-costs-custom-software-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/wearable-fitness-app-integration | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/custom-software-development-vs-digital-product-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/ai-native-digital-product-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/blockchain-technology-trends | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/digital-product-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/blockchain-integration-mobile-apps | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/your-business-ready-for-ai-guide | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/questions-to-ask-before-starting-an-ai-project | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/ai-mvp-development-guide | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/app-development-risk-management | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-app-security-best-practices | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/ps5-emulators-pc | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/custom-ai-development-vs-off-the-shelf-ai | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/healthcare-app-startup-ideas | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/digital-transformation-challenges-startups | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/ai-mvp-vs-full-ai-product-guide | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /press-release/rightfirms-top-mobile-app-development-company-2026 | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /press-release/inceptives-digital-top-software-developers-uk-2026-techreviewer | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /press-release/inceptives-digital-top-machine-learning-companies-2026-techreviewer | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/cross-platform-frameworks-for-mobile-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /press-release/inceptives-digital-earns-a-place-among-the-top-web-development-companies-on-techreviewer | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/types-of-blockchain | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/ai-tutor-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-app-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/top-mobile-app-ideas | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/custom-mobile-app-vs-saas | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/what-is-mobile-app-development-a-beginners-guide | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/how-to-choose-the-right-mobile-app-development-company | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/main-benefits-of-blockchain-technology | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-app-maintenance-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/healthcare-app-development-companies | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/ios-app-development-frameworks | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/healthcare-app-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-app-development-cost-dubai | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/healthcare-app-trends | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/common-mistakes-when-building-apps-with-ai | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/app-store-optimization-aso | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/iot-in-healthcare-applications-benefits-and-future-trends | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-game-ideas | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/how-to-make-an-app-like-tiktok | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/how-to-reduce-mobile-app-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/hipaa-compliant-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/how-to-build-a-profitable-app-using-ai | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/ios-app-development-trends | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/flutter-vs-react-native-android-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/inceptives-digital-vs-dify | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/ai-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/accelerate-digital-product-development-with-ai | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/app-development-timeline | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/php-security-checklist-php2shell-fixes | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/software-development-cost-uk | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-app-development-cost-san-francisco | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/ios-app-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/how-to-create-a-fitness-application | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mvp-mobile-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/swiftui-vs-uikit | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/top-ios-emulators | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mvp-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/digital-product-development-process | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/cost-to-build-real-estate-app-like-dubai-rest | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/fintech-startup-app-ideas | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/texas-business-growth-digital-product-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/blockchain-app-development-cost | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/no-code-mvp-vs-custom-mvp | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-app-development-cost-austin | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /blog/mobile-app-branding-guide | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /author/shahzaib_khan | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /author/amna_rashid | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /author/atif_zaidy | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /author/inceptivesdigital | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /author/muhammad_usman | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /author/arwa_najaf | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /author/noshaba_noor | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /author/soha_shakeel | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /category/digital-products | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /press-release/rightfirms-top-artificial-intelligence-company-2026 | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /category/fitness-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /category/mobile-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /category/android-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /category/healthcare-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /category/software-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /category/mobile-game-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /category/fintech-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /category/web-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /category/blockchain-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /category/ios-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /category/dating-app-development | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /2026/10/02 | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /category/artificial-intelligence | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /category/press-release | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /2026/09/14 | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |
| /2026/09/18 | Staging implementation present | Full visual, content, functionality, accessibility, and performance acceptance pending. |

Source URL status and classification: URL_INVENTORY.csv. SEO checks: SEO_COMPARISON.csv. Known source errors remain documented; no unrelated homepage redirects were introduced.

## 2026-11-10: Image alt-text library and enquiry completion

- Local `image-library/index.html`: 4,560 copied images (510,193,291 bytes), SHA-256 verified; 18,331 page-specific img occurrences with existing and editable proposed alt text. Source assets, filenames, URLs and current website alt text remain unchanged. Library output is ignored by Git; reproducible with `node scripts/export-image-library.mjs`. Future live posts and unavailable external originals are outside this snapshot.
- Offline Chrome QA passed: thumbnails decode, search, alt editing and JSON download; no page errors. Save edited JSON before closing; changes do not automatically update the website.
- Successful native enquiries now navigate to `/thank-you`; failures retain the form. Added noindex completion route with the live WordPress thank-you copy and shared header/footer. Visual parity of this new completion layout remains pending.
- TypeScript passed. Existing form validation, failed-response handling, five-step quiz and PDF tests passed. Three distinct contact form success redirects plus 375/768/1440 completion route checks passed using intercepted responses; no real emails were sent and inbox delivery is unverified.
- Deployed commit `ced282786c25d91510e8f5408502137509d148ca` to preview `dpl_75VbcJH9EggFQSRJYG4FuBgc8MF1` (Next production build passed). Candidate: https://inceptives-homepage-review-2ygjulj8r.vercel.app/ . Deployed checks passed: all three mocked success redirects; completion page at 375/768/1440; 16 responsive header/footer groups including menu controls; homepage/blog/iOS/completion HTTP 200; preview noindex and robots disallow. Assigned existing staging alias https://inceptives-homepage-review.vercel.app/ only after checks passed. Live WordPress/domain/original Vercel project unchanged. Rollback: reassign staging alias to `dpl_DiEQSg2E2oJUKMjJ9SPXkMCmUDi5`.
