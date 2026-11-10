# Mobile navigation and iOS assessment review — 10 November 2026

Review URL: http://localhost:3100/ios-app-development

The local review server now serves the verified `.next-parity` production build. The earlier build on port 3100 did not contain the assessment interaction module. No live WordPress settings, original Vercel project, DNS, or public production deployment were changed.

## Mobile menu

The close control uses an accessible inline SVG cross and a consistent 40px target. Mobile submenu SVG arrows have consistent 18px sizing without circular borders. The document owns normal page scrolling; the page wrapper does not create another scroll container. On mobile/tablet the entire drawer is the sole menu scroll container. Its list and submenu layouts expand naturally without fixed-height inner scroll areas or large minimum-height gaps. The drawer's scrollbar chrome is hidden while wheel/touch/keyboard scrolling remains available. Background document scrolling is locked only while the mobile drawer is open and restored on close, Escape, unmount or a desktop breakpoint change.

The production build passed. All 241 desktop routes passed wrapper scroll ownership and horizontal-overflow checks (images/media and third-party requests blocked in this focused layout test). Expanded-menu checks cover all four submenu groups at widths 320, 375, 390, 519, 768, 820 and 1024; they verify no nested scrollbar, no horizontal menu overflow, scrolling to the bottom, wheel scrolling without background movement, and page unlock. Fifteen representative desktop checks cover five page types at widths 1280, 1440 and 1920, verifying the document owns scrolling and there is no additional viewport-sized vertical scroll container. All 24 repeated menu open/close checks also passed. Natural-motion inspection confirmed the drawer settles at viewport x=0 after its existing 0.6-second transition. Evidence: `audit/browser/scrollbar-verification.json`, `responsive-scroll-verification.json`, `mobile-close-verification.json`, and `mobile-single-scroll-390.png`.

Closing the drawer previously removed `sitekit-menu-offcanvas-elements`, the structural class that keeps the drawer fixed and outside the viewport when closed. Its logo and close button consequently entered the header layout. The class now remains present in both states. Closing also resets submenu state and restores hamburger focus. Close controls derive state from the drawer rather than their individual ARIA attributes.

Production-browser verification passed 24 open/close cycles across the homepage and iOS page at widths 375, 390, 519 and 820. Checks cover fixed positioning, offscreen closed state, unchanged header height, submenu reset, ARIA state and horizontal overflow. Evidence: `audit/browser/mobile-close-verification.json` and `audit/browser/mobile-close-fixed-390.png`.

## Five-step assessment

The public assessment behavior is implemented in `src/components/ios-assessment.js`, mounted by the iOS page through `IOSAssessment.tsx`. Its existing styling, wording, answers and layout remain intact. Native Next/Previous interactions, required-answer validation, retained selections, progress indicator, final contact validation, submission error/retry handling, result display, branded PDF download and the source thank-you redirect are wired.

Actual recommendations continue to use the original WordPress PHP handler through `/api/ios-assessment`; its scoring rules have not been guessed or independently replaced. The server obtains the current guest nonce from the public source page, checks submitted radio values against its allowed choices and forwards only the known assessment fields. This is a temporary WordPress backend dependency until private PHP snippet source can be inspected and ported. Admin/browser initialization still fails with `failed to write kernel assets ... os error 3`; authentication to private snippets is unverified.

Verification:

- Production build and TypeScript check passed.
- Current public source and target both contain five steps; every radio name/value matches. The current guest nonce is available. No nonce value is included in this report.
- Five-step navigation and retained selections passed at 390, 820 and 1440 pixels.
- Required fields, simulated server failure and retry, result display, and a 22,044-byte PDF download passed in isolated browser tests. Valid submission responses were mocked; no enquiry was sent by those tests.
- API routes rejected missing origins and incomplete payloads.
- Both browser suites passed again on the user-facing port 3100 after restarting it with the verified build.

Evidence: `audit/forms-2026-11-10/verification.json`, `responsive-steps.json`, `source-contract-verification.json`, and `step-five-390.png`.

After explicit user authorization, exactly one real `Migration QA Test` assessment was submitted through localhost:3100. The contact address was the site's published `info@inceptivesdigital.com` address. The API returned HTTP 200 and `success: true`; the original PHP handler returned an architecture-review recommendation with native fit 69 and cross-platform fit 60. The actual result rendered and its branded PDF downloaded successfully (23,368 bytes). Evidence: `audit/forms-2026-11-10/real-submission.json`, `real-submission-result.png`, and `real-assessment.pdf`. No automatic retry or second real submission was made.

Inbox delivery remains unverified because mailbox access is unavailable. Server acceptance and working PHP scoring do not independently prove inbox delivery. The CAPTCHA network limitation previously recorded for general contact forms remains separate from this assessment.
