# CallRail and Cloudflare staging integration

Final CallRail follow-up: the homepage footer/popup gap was investigated and the acknowledgement/navigation race fixed. Deployment `dpl_8ChPy85f6GN5DjWJuUPiGTPUCiRC` confirms ten new real CallRail captures (one UUID/type, HTTP 200 before thank-you), with ten persisted dashboard events. Only CallRail was live in that final tracking test; previously verified genuine GHL submissions were not repeated. See CALLRAIL_TRACKING_FIX.md. This supersedes the two-unconfirmed limitation in the historical notes below.

Latest update: separate staging widget `0x4AAAAAAF8W_dplhFI7dPcc` created with the user's authorization, sole allowed staging hostname, Managed mode and no pre-clearance. Preview deployment `dpl_69v8cJrEP2uM7tdKhVEjhD4mpQto` validates tokens server-side. All ten genuine form types reached thank-you and were observed in GHL. User completed two interactive challenges. CallRail dashboard confirms eight new QA captures (plus the previous original event); two remain unconfirmed analytics captures. No full CallRail 10/10 or inbox-delivery claim is made. See STAGING_TURNSTILE.md for current delivery behavior and limitations. The following sections preserve the earlier release history; its original-key hostname blocker no longer applies to staging's new widget.

Date: 11 November 2026. Runtime source: `b8af4beb8d93bbf4aba1a0795331ea47cf47feba`.

## Source and implementation

The live WordPress GTM container and the logged-in CallRail installation screen supply the same public company snippet. The shared Next.js root loads that official script asynchronously after hydration. Its existing visitor/session tracking, number allocation and DOM observer remain vendor-managed. Documented `CallTrk.swap()` handles subsequent route renders. The loader is restricted to the stable staging hostname and future production hostname; localhost and immutable previews do not create real account activity by default.

Initial live SDK inspection found that displayed numbers swapped to the account's assigned tracking number, but source links such as `tel:(469)%20788-8527` retained the original dial target. The shared renderer now normalizes this business number's URI to E.164 before the vendor runs. Tests verify visible numbers and all business `tel:` links, including icon-only links. Business identity/schema and source copy retain the original number.

The existing CallRail account enables form capture. Website forms now exclude automatic capture and use the documented manual method only after WordPress and GHL confirmation. This avoids invalid, failed, search and synthetic-replay conversions. Hidden controls, passwords and challenge responses are excluded from captured values. Vendor transport/local-storage retry behavior is retained; invoking the capture API is reported as queued rather than a delivery acknowledgement. Optional tracking readiness has a bounded wait and cannot discard an already-confirmed lead.

## Cloudflare status and improvements

The source WordPress site is behind Cloudflare and uses its Turnstile Elementor integration. The current staging widget reports **110200: domain not authorized**. The user explicitly deferred Cloudflare account work; its dashboard was at sign-in. Authorizing `inceptives-homepage-review.vercel.app` on the existing widget is required before real contact submissions can pass that widget. No test keys or CAPTCHA bypass were enabled in deployed code, and the existing upstream WordPress validation remains intact.

The shared client integration now supports loading-error retry, expiry/timeout state, widgets added or removed dynamically, cleanup on navigation, and compact rendering when a 300px widget would exceed the available width. These lifecycle changes pass isolated fixture tests. They do not resolve an account-side hostname restriction by themselves. The original iOS PHP assessment has no Turnstile contract; no additional unconfigured server validator was claimed or enabled for it.

The `vercel.app` hostname is Vercel-owned and does not inherit the production domain's Cloudflare DNS/proxy configuration. For a future owned domain, the recommended architecture is Cloudflare DNS plus Turnstile, with Vercel serving CDN/compute. Vercel advises against unnecessary proxy stacking because of visibility, latency and caching trade-offs. DNS, SSL/proxy settings, live WordPress, original Vercel, CallRail numbers/routing and paid services were not changed in this batch.

## Verification

- Production build and TypeScript passed locally.
- All ten website form types passed against the actual GHL and CallRail SDKs with all remote delivery endpoints and WordPress intercepted. Each uses one unique CallRail submission UUID; persisted vendor retry may repeat a transport attempt for that UUID.
- Invalid/backend-rejected attempts are excluded. GHL outage/retry retains values and does not repeat accepted WordPress delivery. Analytics values exclude challenge/backend control tokens.
- Native number-swapping fixtures verify both text and all business phone link destinations. One official snippet per document is asserted.
- Turnstile fixture tests cover script failure/retry, expired response handling, narrow layouts, retained form values, and mounting/removing dynamic forms. No real CAPTCHA was solved in these tests.
- Deployed candidate passed the same ten native-SDK form journeys and three Turnstile fixture groups, eight representative SEO comparisons, all 28 redirect checks, sitemap/robots checks (230 sitemap entries) and 16 header/footer viewport widths.
- On the updated stable alias, the actual CallRail SDK swapped all four contact-page numbers/phone links to the same assigned tracking number. One clearly marked QA submission was accepted by the real CallRail endpoint with HTTP 200 and one submission UUID. Native session presence, original contact-page URL and landing attribution were verified. WordPress and GHL delivery were mocked in that isolated live-CallRail test; no real phone call was placed.
- After the user handled the Terms notice, dashboard inspection confirmed the QA record: 5/5 fields (first name, last name, email, phone, message), one total interaction, first-touch and last-touch source `migration-qa`, medium `integration-test`, the original landing/form URL, and a subsequent `/thank-you` visit. Its installation checker returned a generic test-service error for the original WordPress URL; the staging check was started but is not certified as passed. No account numbers, routing or integration rules were changed.
- Cloudflare hostname authorization and real protected WordPress inbox delivery remain deferred at the user’s request. Client lifecycle improvements do not remove this blocker.

## Existing account warning

CallRail displays a “numbers swapping too fast” alert dated approximately five months ago for the existing Inceptive Digital - WP pool. The assignment screen lists four numbers and recommends a pool size of five. No numbers were purchased, pool size changed, routing edited or warning dismissed. This capacity warning can affect visitor-level call attribution and should be reviewed before launch; form capture and the inspected QA record are independently verified.

## Staging release and rollback

[Current staging](https://inceptives-homepage-review.vercel.app/): `dpl_7FMvA7SDroaU8t9VJr5Wjjy8Wxk1`; immutable build `https://inceptives-homepage-review-iamu1h7lk.vercel.app`. Rollback: `dpl_E6PRXtRvQnM29A43jsZu58yahEyy`. Only the existing separate staging alias was updated. Sanitized test summaries are in `audit/callrail-release-2026-11-11/`.

Raw public scripts, generated payloads and private dashboard screenshots remain in ignored `audit/callrail-cloudflare/`. Sanitized summaries are versioned separately.

## References

- [CallRail JavaScript API](https://apidocs.callrail.com/#swap-js)
- [Cloudflare error codes](https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/)
- [Turnstile hostname management](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/)
- [Vercel proxy guidance](https://vercel.com/kb/guide/can-i-use-a-proxy-on-top-of-my-vercel-deployment)

## Cloudflare account follow-up — 11 November 2026

The user resumed hostname authorization and completed sign-in in the connected Chrome profile. The accessible account lists only one widget, **Inceptives Video Testimonial** (`0x4AAAAAAEX9rb9oH0Cg80Lh`), and one available account. The source WordPress and staging forms both use `0x4AAAAAAF2_MwH5-dBU2H8A`, which is not listed there. No unrelated widget was edited. The user is checking which account owns the original widget. Authorization and real protected-form delivery remain pending that access. A fresh preflight confirmed source/staging key parity and HTTP 400 rejection of a missing challenge. No Cloudflare hostname, live WordPress or DNS changes were made.
