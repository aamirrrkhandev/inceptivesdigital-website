# Calendar and CTA audit — 12 November 2026

Historical audit preceding the later SEO/qualification brief. The app modal-delay fix is now prepared on that project's review branch; see IMPLEMENTATION_REPORT.md for the current combined status.

## Release status

Changes are prepared for feature-branch review, with no production deployment. Production and DNS were not changed. Review the production-mode local build at http://localhost:3104/mobile-app-development. No appointments or real enquiries were submitted.

## Findings and fixes

1. Calendar requests started only after the scheduling button was clicked. Live baseline available-date latency: mobile development 5,955 ms; iOS 6,637 ms; fitness 5,864 ms; homepage 7,242 ms.
2. The shared handler did not recognize “Schedule a Strategy Call”. Confirmed failed clicks on mobile development and custom software now open the existing calendar. Discovery-call wording is also supported; existing “Let's Schedule a Call” variants remain supported.
3. Exported self-links/empty controls on multiple pages did nothing. Sixteen previously observed inert CTA instances now open an existing contact or calendar popup. Exact path/label results: `audit/cta-calendar/confirmed-fixes.json`. Additional San Francisco “Discuss Your Product” and Toronto discovery-call checks pass.

The calendar now warms one existing iframe after a scheduling CTA becomes visible and an idle delay, or on hover/focus/touch intent. The invisible warming popup is inert and cannot trap focus or intercept clicks. Its eventual dimensions are retained to avoid Calendly initializing inside a zero-sized frame. Opening removes inert state and reuses the frame. Data Saver/2G visitors retain on-demand loading. Timeout, retry, theme, Escape, close and reopen behavior remain.

Final repeat with a 10-second page dwell, fresh browser pages, available-date latency measured from click:

| Page | Live cold baseline | Local warmed repeat |
|---|---:|---:|
| Mobile app development | 5,955 ms | 229 ms |
| iOS | 6,637 ms | 298 ms |
| Fitness | 5,864 ms | 117 ms |

Homepage warmed sample was 165 ms. These are click-to-ready measurements after warming, not total page-load times or guaranteed first-click latency. Immediate cold clicks still depend on Calendly. One earlier real-network batch had three blank/time-out results; a diagnostic run and the final three-page repeat succeeded. External-service availability remains a risk; results are not represented as uniformly successful.

## Coverage and validation

- Live baseline: 102 catalog/restored paths attempted; 836 controls scanned, with two click-stability interruptions.
- Local broad run: 108 paths including six restored service routes; 882 controls scanned. Toronto had a moving statistic-chip interruption and passed a final targeted run after classifying statistic labels separately.
- Mobile 390px: 17 representative routes, 183 controls, no automation errors. Includes mobile development, iOS, fitness, food delivery, education, locations, AI, blockchain, product strategy, AR, VR, IoT, mobile game, web development and staff augmentation. Some secondary pages have no controls matching the shared CTA selector; their custom assessment submit flows are not claimed tested by this audit.
- Fixture popup checks at 390/768/1366px passed: dimensions, green theme, close/reopen and one iframe navigation on reuse. Timeout/retry passed. Hidden warming dimensions/inert state and Data Saver opt-out passed.
- 19 distinct internal CTA destination paths returned successful responses.
- Twelve representative pages: title, description, canonical, H1 and JSON-LD matched live. Local robots are intentionally noindex while production is index; that existing environment difference was explicitly checked. No SEO source/configuration changes were made.
- TypeScript, production build (4,915 generated entries), and diff whitespace checks passed.
- Third-party tracking was blocked during automated CTA tasks; Calendly was mocked for broad interaction tests and real only for timing checks. This audit does not verify new GHL deliveries or completed bookings.
- Chromium automation and normal Chrome inspections were used. Other browsers, all dynamic blog articles and every possible CTA variant were not exhaustively tested. Below-fold lazy controls and decorative chip controls limit selector-based coverage.

## Landing pages

The six `app.inceptivesdigital.com` variants were inspected on mobile; telephone and Calendly link targets were inventoried, iOS/Android quote anchors moved toward the form, and app-development quote controls opened/scrolled to enquiry UI. Normal Chrome confirmed healthcare enquiry modal open/close.

The separate repository has `DeferredModal` in `src/landing-pages/shared/LandingPageShell.jsx`: mobile modal mounting is deliberately deferred by 4,000 ms. This can delay early mobile CTA feedback. Early automated clicks did not consistently show a modal within the 200 ms observation window, so those are not reported as passing instant-modal tests. No changes were made to this separate app project. Its source was readable through the GitHub connector, while standard Git repository access returned 404; a local app build was not available for testing changes here.

## Remaining items

- Food delivery: “Get the Food App Strategy Report” has no working report destination. No asset/URL was invented.
- Life at Inceptives: “Explore Careers” has no working destination in the tested export. Needs the intended careers destination.
- Several portfolio/workplace button-shaped labels are static informational chips, not conversion controls; these were left unchanged.
- App mobile deferred modal behavior above remains unchanged.

## Changed implementation

- `src/lib/calendar-popup.ts`: warming, reuse and cleanup.
- `src/lib/cta-intent.ts`: narrowly scoped, verified conversion-label handling; genuine links, form buttons and anchors preserved.
- `src/components/SiteInteractions.tsx`: shared scheduling/enquiry dispatch.
- `src/app/site.css`: invisible prewarming layout only; open popup styling unchanged.
- Audit/verification scripts under `scripts/`; evidence and screenshots under `audit/cta-calendar/`.

Calendly embed reference consulted: https://developer.calendly.com/api-docs/overview/embedding/getting-started . Plain iframe integration was retained; no new widget SDK or analytics events were introduced.
