# Landing-page and mobile-service review — 12 November 2026

## A. Release status and scope

Implemented Phase A in the app repository, then Phase B in the main repository. Both use `feat/seo-lead-qualification-review`. No production deployment, main merge, DNS change, GTM publication, advertising change, new CRM integration, pipeline or custom field was made.

- App remote implementation commits: `ba30deb5fd41f38760c3c936529827e5a218cf0f`, `fb18d20f9b7e92d37fe66afc0ff8967624e5d490`.
- App draft PR: https://github.com/inceptivesdigital/healthcare-landing-page/pull/1
- Main implementation commit: `c92c5d4b26f1ff870134f03ee4be27950a479970`.
- Main review: https://github.com/aamirrrkhandev/inceptivesdigital-website/compare/main...feat/seo-lead-qualification-review
- Creating the main PR through the connected GitHub service returned HTTP 403, Resource not accessible by integration. Git branch push succeeded.
- Production aliases remained on main deployment `dpl_EGQoL54CpDZVyC8iyuPwVf22nrqR` and app deployment `dpl_GgzEi7tmZUQSCt5nwPo67Cfv73TF` at the last read-only check.

The owner's answer “deployment” did not specify whether to release both new branches or only earlier calendar work. A deployment-scope question remains pending; no release was inferred.

## B. Phase A implementation

Removed the separate 4-second mobile modal gate. The shared consultation modal is immediately available when clicked; its design is retained. Tested modal opens were approximately 50–100 ms locally, not a network-speed guarantee.

CRA is retained. Postbuild generates route-specific initial HTML with the authored hero and existing metadata. This is a lightweight initial-hero HTML solution, not full-body SSR. React still mounts the remaining content. Exact Vercel rewrites cover the existing landing aliases; API routing is preserved. The fallback hero is removed when the rendered hero is ready, preventing duplicate rendered H1s.

App-development-only wording now uses “Discuss My App Project” / “Discuss Your App Project”. Its form shows “Most first releases start at $15,000.” No organic main-site minimum-price sentence was introduced.

Project options: New mobile app or startup MVP; App for my existing business; Enterprise or internal app; Fix or rebuild an existing app; Not sure yet.

Budget options: Under $15,000; $15,000 to $25,000; $25,000 to $50,000; $50,000 to $100,000; Above $100,000; Not decided yet.

The four existing timelines remain unchanged. All qualification fields remain required where specified. Existing success conversion and thank-you behavior run only after acceptance. Preview API delivery is explicitly disabled with HTTP 503 to prevent real leads during review.

## C. Approved content and source evidence

| Item | Before | After / source |
|---|---|---|
| My Tango card | Workforce / 90% paperwork claims | Existing project hero: Building the Infrastructure Behind a Global Dance Community; removed incorrect metric only |
| Mobile-service StakBread caption | Real-Time Workforce Operations Platform | Social Commerce Platform, supported by its existing project hero |
| Mobile-service Pets B4 Profit caption | Automated Experience Capture and Delivery | AI-Powered Veterinary Cost Transparency Platform, supported by its existing project hero |
| Testimonial name | Kirk Flaming | Kirk Fleming, visually verified in existing Clutch review image |
| Mobile-service uptime | Infrastructure Uptime 3M+ | 99.9%, supported by the existing uptime asset alt text; not independently measured SLA |
| Small copy errors | AI Servicess; SSL/TLSS | AI Services; SSL/TLS |
| Generator | Elementor meta generator | Removed only the Elementor generator metadata |

DPS Airem and Pulse Check were not edited. Portfolio source pages containing other suspect copied text were not rewritten.

Owner-approved highest comparable existing figures: 700+ apps, 15M combined downloads, 150+ developers, $150M revenue and 93% retention. Updated app-development body proof to 700+ / 15M combined downloads; no unsupported app-store-only scope was claimed. This is consolidation of owner-approved claims, not an independent business audit. Existing SEO titles/descriptions and OG copy were preserved, so historical figures in protected metadata were not silently rewritten. Other pages with inconsistent uptime claims are recorded in the proof inventory and remain outside this narrow Phase B change.

iOS fixed-price guarantee and U.S.-Based Engineering wording were retained as approved. Main-site Careers and Food App Strategy Report destinations were left unchanged.

## D. Delivery and attribution

App `/api/lead` continues using its existing server-side Zapier provider; its secret hook URL is intentionally omitted. Existing keys email, fullName, phone, budget, URL, messages and projectType remain. Timeline and utm_source, utm_medium, utm_campaign, utm_content are also forwarded. Initial full landing URL and attribution are preserved through alias navigation. Qualification/attribution are summarized in the existing messages field as a compatibility fallback; optional description text is retained.

Main standalone custom-mobile landing: all three forms now have required budget and timeline selects using existing styling. The existing validation API rejects invalid enum values. Native GHL and CallRail capture payloads retain the new values. No replacement form UI or new CRM field was created.

External Zapier-to-GHL/Sheet mapping and conditions matching old option text could not be inspected because the external account was not available. Repository checks found no such exact-text automation. Provider HTTP acceptance is not proof of GHL contact/opportunity creation. These external mappings remain an explicit manual verification requirement.

## E. Verification results

| Check | Actual result |
|---|---|
| App full CRA build including pre/postbuild | PASS |
| App ESLint | 0 errors; 2 pre-existing unused-import warnings in IosPortfolioSection.jsx |
| App raw HTML | 5 route cases passed |
| App browser rendering / modal | 10 cases, widths 390 and 1440, passed |
| App form validation / success / failure | 6 mocked flows passed, all project/budget/timeline choices covered |
| App API forwarding / rejection / preview guard | 3 isolated backend cases passed; no real provider calls |
| Canonical targets | All 5 returned HTTP 200 with hostname/TLS validation |
| Main full production build / TypeScript | PASS; 4,915 build entries |
| Main lint | NOT AVAILABLE: no existing lint setup; no unrelated dependency added |
| Main target pages | 6 cases: mobile service and standalone at 390, 768, 1440; HTTP 200, preserved title/H1, no horizontal overflow |
| Main qualification API | 6 local validation cases passed |
| Main native delivery SDK | 6 mocked cases across all 3 forms; one GHL capture and one CallRail capture per accepted case; failure prevents conversion/redirect |
| Calendar fixtures | 390, 768, 1366; open/close/reopen, timeout/retry, Data Saver behavior passed |
| CTA destinations / SEO comparisons | Prior audit: 19 distinct internal destinations HTTP 200; 12 metadata/schema comparisons preserved except intended environment indexing differences |

Initial OS/browser DNS resolution intermittently failed for canonical checks. A separate read-only public resolver lookup, retaining normal TLS hostname validation and changing no machine DNS settings, verified all five targets. Initial errors remain in audit JSON rather than being erased.

Calendar prewarming reuses the existing iframe, respects Data Saver/2G and keeps the hidden frame inert. Repeat real-network samples after a 10-second dwell: mobile 229 ms, iOS 298 ms, fitness 117 ms; a homepage sample was 165 ms. Earlier network samples included three timeout/blank results; repeat/probe checks passed. Third-party cold loading is variable and is not guaranteed instantaneous.

No real customer data or test leads were sent. Cross-browser coverage beyond available Chromium, every possible viewport, all blog routes, actual booking completion, live GHL record creation and hosted new Vercel rewrites are NOT VERIFIED in this review. No full-site performance or PageSpeed claim is made.

## F. Review evidence and local access

- Main local production-mode review: http://localhost:3104/mobile-app-development and http://localhost:3104/custom-mobile-application-development/
- App safe local review: http://localhost:3150/app-development (other landing routes also available). Local app `/api/*` returns 503 intentionally.
- App evidence: sibling `app-landing-review/healthcare-landing-page-main/audit/phase-a/results.json`, screenshots and root `phase-a-full-build.log`, `phase-a-tests.log`, `canonical-tests.log`, `phase-a-lint.log`.
- Main evidence: `audit/phase-b/results.json`, `audit/phase-b/proof-metrics.json`, `audit/html-file-manager-2026-11-12/delivery-verification.json`, `audit/phase-b-full-build.log`, `audit/phase-b-forms.log`, `CTA_CALENDAR_AUDIT.md`.
- Screenshots were inspected for the targeted layouts; the ignored audit directories stay local and are not shipped in the site bundle. No comprehensive before/after visual-regression coverage is claimed.

## G. Human GTM verification checklist — not implemented here

- [ ] Confirm existing OpenAI pixel loads on both websites.
- [ ] Fire OpenAI lead_created from existing generate_lead after backend acceptance.
- [ ] Fire appointment_scheduled only after a confirmed Calendly booking.
- [ ] Do not configure order_created yet.
- [ ] Verify exactly one Lead event per accepted submission and none for failures.
- [ ] Verify appointment events only for confirmed bookings.
- [ ] Check the intended OpenAI conversion source receives events.
- [ ] Verify available click attribution is preserved.
- [ ] Check existing tags for duplicate conversions.
- [ ] Test with GTM Preview and supported OpenAI diagnostics before publishing GTM changes.

GTM, pixels, CAPI and event deduplication were not changed in this task.

## H. Changed-file inventory

The following lists are generated from the exact review diffs. Source archive provenance and local/remote commit differences for the private app repository are documented in its REVIEW.md; final local and remote source trees match.

### Main repository

- `CTA_CALENDAR_AUDIT.md`
- `content/lead-qualification.json`
- `content/page-html-index.json`
- `public/custom-mobile-application-development/index.html`
- `scripts/apply-approved-mobile-content.mjs`
- `scripts/audit-app-ctas.mjs`
- `scripts/audit-approved-proof-metrics.mjs`
- `scripts/audit-cta-calendar.mjs`
- `scripts/audit-site-ctas.mjs`
- `scripts/probe-calendar-warmup.mjs`
- `scripts/verify-calendar-warmup.mjs`
- `scripts/verify-cta-links-seo.mjs`
- `scripts/verify-phase-b.mjs`
- `scripts/verify-standalone-delivery.mjs`
- `src/app/api/standalone-enquiry/route.ts`
- `src/app/site.css`
- `src/components/SiteInteractions.tsx`
- `src/components/SourceLayout.tsx`
- `src/components/shared/SourceNode.tsx`
- `src/lib/calendar-popup.ts`
- `src/lib/cta-intent.ts`
- `src/lib/navigation-additions.ts`
- `src/page-content/mobile-app-development/components/YourIdeaDeservesBetterThanAverageExecutionSection.tsx`
- `src/page-content/mobile-app-development/content.json`
- `src/page-content/mobile-app-development/page.html`
- `IMPLEMENTATION_REPORT.md` (this report)

### App repository

- `.gitignore`
- `REVIEW.md`
- `api/lead.js`
- `package-lock.json`
- `package.json`
- `public/seo/android.js`
- `public/seo/app-development.js`
- `public/seo/flutter.js`
- `public/seo/healthcare.js`
- `public/seo/ios.js`
- `public/seo/react-native.js`
- `scripts/generate-route-html.mjs`
- `scripts/serve-review.mjs`
- `scripts/verify-canonical-targets.mjs`
- `scripts/verify-phase-a.mjs`
- `src/components/sections/Hero.jsx`
- `src/components/shared/ConsultationForm.jsx`
- `src/landing-pages/app-development/AppDevBelowFold.jsx`
- `src/landing-pages/app-development/AppDevThankYou.jsx`
- `src/landing-pages/app-development/AppDevelopmentLandingPage.js`
- `src/landing-pages/app-development/PlanFormModal.jsx`
- `src/landing-pages/app-development/data.js`
- `src/landing-pages/shared/LandingPageShell.jsx`
- `src/seo/constants.mjs`
- `src/seo/pages/app-development.meta.mjs`
- `src/utils/landingPageUrl.js`
- `vercel.json`

### Actual raw HTML results


#### /app-development

- Initial HTTP: 200; raw H1 count: 1; rendered H1 count: 1; OG checks: True; correct route hero: True
- Title: Mobile App Development Company | Inceptives Digital
- Description: App development services from strategy and UX through iOS and Android launch, with a senior in-house team. Book a free 30-minute planning call and leave with a scope, an architecture direction and a cost range.
- Canonical: https://inceptivesdigital.com/mobile-app-development; destination HTTP: 200

#### /ios-landingPage

- Initial HTTP: 200; raw H1 count: 1; rendered H1 count: 1; OG checks: True; correct route hero: True
- Title: iOS App Development Services | Clear Scope, Fixed Milestones | Inceptives Digital
- Description: iOS app development services with a clear scope, fixed milestones, and no open-ended retainers. Know what you're getting, what it costs, and when each stage will be delivered, before development begins. Full source-code ownership and App Store launch support.
- Canonical: https://inceptivesdigital.com/ios-app-development; destination HTTP: 200

#### /flutter-landingPage

- Initial HTTP: 200; raw H1 count: 1; rendered H1 count: 1; OG checks: True; correct route hero: True
- Title: Flutter App Development Company | iOS & Android | Inceptives Digital
- Description: Flutter app development company building one Dart codebase for iOS and Android. Flutter mobile app development services, custom Flutter development, and full app store launch. U.S.-based engineering.
- Canonical: https://inceptivesdigital.com/flutter-app-development; destination HTTP: 200

#### /react-native-landingPage

- Initial HTTP: 200; raw H1 count: 1; rendered H1 count: 1; OG checks: True; correct route hero: True
- Title: React Native App Development Company | iOS & Android | Inceptives Digital
- Description: React Native app development company building one cross-platform codebase for iOS and Android. Custom React Native development, native modules, and app store launch. U.S.-based engineering.
- Canonical: https://inceptivesdigital.com/react-native-app-development; destination HTTP: 200

#### /healthcare-landingPage

- Initial HTTP: 200; raw H1 count: 1; rendered H1 count: 1; OG checks: True; correct route hero: True
- Title: Healthcare App Development | HIPAA Compliant | Inceptives Digital
- Description: HIPAA-compliant healthcare app development by Inceptives Digital. Telehealth platforms, patient portals, EHR integrations, and RPM systems. HIPAA-focused, U.S.-based engineering.
- Canonical: https://inceptivesdigital.com/healthcare-app-development; destination HTTP: 200

## Production release addendum

The owner subsequently selected option 1 (deploy both tested branches) and deferred external Zapier verification. This supersedes the earlier pending-release status above.

- Main production: deployment `dpl_F2EJsFXmChfeXwEqkzMKbYqhziB5`, source `867132dcfec12b40661a94907c0903aaff0e06f7`, READY; `inceptivesdigital.com` alias verified.
- App production: deployment `dpl_3Pp3t7f23aRdFpinNTjZhfJNsWxk`, source `fb18d20f9b7e92d37fe66afc0ff8967624e5d490`, READY; `app.inceptivesdigital.com` alias verified.
- Read-only HTTPS smoke: five app routes plus mobile-service and standalone custom-mobile routes returned 200; one raw H1 and intended canonical per route. Standalone budget and timeline fields present in production HTML.
- Production Chromium smoke at 390px: app-development modal 111ms; iOS modal 98ms; each opened/closed and had one rendered H1. Third-party requests were blocked during this isolated interaction test; no submissions occurred.
- Stable homepage-review staging alias restored to its pre-release deployment, preserving its separate review state.
- DNS, main branches, GTM and advertising settings were not changed. Zapier-to-CRM mapping remains deferred at the owner's request. No claim of live CRM delivery verification is made.
- Rollback deployment IDs: main `dpl_EGQoL54CpDZVyC8iyuPwVf22nrqR`; app `dpl_GgzEi7tmZUQSCt5nwPo67Cfv73TF`.
- Evidence: local `audit/release-2026-11-12.json` and sibling app `audit/phase-a/production-smoke.json`.
