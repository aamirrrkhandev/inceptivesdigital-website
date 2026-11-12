# CallRail ownership and receiving-number audit — 12 November 2026

## Verified live configuration

- Business/swap-target number: **+1 469 788 8527**.
- CallRail company 691547027, website pool “Inceptive Digital - WP”, four numbers.
- Website pool uses “Greeting > Dial > Voicemail”. Its Dial step forwards to **(469) 788-8527**, then advances after 20 seconds if unanswered. Read directly in CallRail; settings were not saved or changed.
- Separate “ID App - G Extension” tracking number forwards calls and texts to the same business number.
- Different displayed tracking numbers are expected. Do not replace source phone numbers with a pool allocation or change forwarding to a displayed tracking number.
- No real call was placed; configured forwarding was inspected, not RingCentral call receipt.

## Script ownership

- GTM-5BV286F5 published “Call Rail” tag installs swap.js on Initialization — All Pages.
- Main website and custom-mobile landing had a second direct installation of that same URL. App landing had one GTM-owned installation.
- Healthcare, Flutter, React Native, iOS, Android and app-development landing variants all returned 200, loaded one CallRail script and displayed swapped telephone links in browser checks.
- GA4, Meta, OpenAI and LiveChat ownership is GTM in inspected code/runtime. No duplicate direct installation of these libraries was identified in inspected documents. This is not a claim that every conversion trigger/property was end-to-end verified.
- Direct Leadsy and GTM Leadfeeder are different products; direct GHL has no equivalent GTM tag. They remain installed.

## Tested changes (released 12 November 2026)

- Shared CallRail coordinator waits for GTM's SDK instead of injecting swap.js; route-change swaps and acknowledged form capture remain.
- Custom-mobile's three forms no longer import/render Cloudflare Turnstile. Other forms and reviews retain their verification.
- Server still validates origin, known form/path, required fields and email. Added honeypot and bounded per-instance throttle (not a distributed/global rate limiter).
- Standalone forms now opt out of native automatic CallRail listeners. Explicit capture occurs after GHL success, preventing invalid/failed attempts being recorded as accepted enquiries.
- No SEO values, content, phone source values, images or styles changed.

## Validation

- TypeScript and Next.js production build passed (4,915 generated entries).
- Isolated browser SDK-ownership check: concurrent wait shared, absent-GTM timeout, delayed SDK retry success, zero script injection by helper.
- Native vendor SDKs with mocked remote endpoints: all three forms produce one GHL submission and one CallRail capture, then thank-you navigation. Backend failure prevents capture; GHL rejection prevents conversion/redirect.
- Missing-origin and invalid-form/email requests rejected.
- 144 recovered asset/alias checks passed. Custom-mobile and reviews at 390px and 1440px: no broken images, horizontal overflow or page errors; original title/canonical/robots preserved.
- Modal, FAQ, testimonial selection, portfolio arrow and required validation passed. Reviews regression used isolated invalid-file/security-token cases; no video upload or new real CRM enquiry was sent.
- Build output: `audit/callrail-dedup/production-build.log`; SDK test: `audit/callrail-dedup/ownership-verification.json`; six app routes: `audit/callrail-dedup/latest.json`; other test outputs: `audit/html-file-manager-2026-11-12/`.

## Release boundary

User subsequently requested removal on the live landing page. Commit `4ea5783bf60dd43a73abccea56d315e92162519e` was released to production deployment `dpl_EGQoL54CpDZVyC8iyuPwVf22nrqR` on 12 November 2026. The live custom-mobile URL was reloaded in Chrome: all three forms have zero Turnstile controls, zero Cloudflare challenge scripts load, and exactly one CallRail swap.js installation remains. Canonical matches the original. The stable staging alias was restored to its existing preview. No GTM publication, DNS change or CallRail forwarding change was performed. Production enquiries were not submitted during this release check.
