# Website forms → GoHighLevel

Scope: separate `inceptives-homepage-review` staging project. Live WordPress, its snippets, DNS and the original Vercel project are unchanged. Calendly is explicitly excluded; the user will supply a GHL calendar link later.

Operational update, 11 November: real staging contact widgets report Cloudflare error 110200 until the existing key authorizes the staging hostname. Cloudflare login is pending. Native GHL capture is verified independently; full protected WordPress delivery is not certified. See CALLRAIL_CLOUDFLARE_REPORT.md for the current release and blocker.

## Delivery and appearance

The account's official External Tracking script records the existing HTML forms under GHL **Sites → Forms → Submissions → External Forms**. It preserves the custom website interface rather than embedding a replacement form. The public installation identifier comes from the logged-in Inceptives Digital location's installation screen; no private API key is needed or committed.

Existing WordPress delivery/scoring remains the first confirmation. The native GHL SDK receives a submission only after validation and that handler's success. A native GHL HTTP acknowledgement is required before clearing fields or navigating to `/thank-you`. The iOS recommendation/PDF remains available before its existing timed redirect.

Invalid clicks and failed WordPress attempts do not produce CRM submissions. A temporary GHL error retains the values and allows retry; within the same mounted form, an unchanged payload does not repeat a previously successful WordPress delivery. This is not a cross-session idempotency guarantee.

Consent checkbox controls/text were removed as requested. No marketing/transactional opt-in is fabricated. Staff role selections remain selectable checkboxes and are unrelated to consent. Captcha handling in the production submission route remains intact.

| Website form type | Stable native GHL identifier |
| --- | --- |
| Shared footer enquiry on current pages | `website-footer-enquiry` |
| Shared popup enquiry | `website-popup-enquiry` |
| Contact page | `website-contact-page-enquiry` |
| Web development enquiry | `website-web-development-enquiry` |
| Staff augmentation enquiry | `website-staff-augmentation-enquiry` |
| IoT enquiry | `website-iot-development-enquiry` |
| Virtual reality enquiry | `website-virtual-reality-development-enquiry` |
| AR enquiry | `website-ar-app-development-enquiry` |
| Staff/team two-step assessment | `website-staff-assessment` |
| iOS five-step assessment | `id-ios-form` |

The source inventory contains 241 footer and 241 popup instances, one contact form, one iOS assessment and 15 search forms. Five restored enquiry forms and the staff assessment bring the lead/assessment total to ten distinct types. Page URL identifies the page for shared forms. Staff role/options and all four iOS answers are named native fields, so they are retained in the external submission.

## Attribution and environments

The official SDK owns native visitor/session and page/referrer attribution. Existing UTM/click-ID query parameters are retained; code does not invent missing campaign values. Automated tests assert UTM/click-ID/page/session capture. Browser privacy choices, script blockers, missing query parameters and GHL's own attribution rules affect what is available.

SDK loading is restricted to the stable staging hostname and the future production domain. Localhost and immutable previews do not create CRM records by default. No tracking script was installed on WordPress. The account's domain/form tracking switches and field mappings can be reviewed in **Settings → External Tracking → Settings**.

## Verification

- Production build and TypeScript passed.
- Ten form types passed against the real vendor SDK with both delivery endpoints mocked, including assessment answers and thank-you transitions.
- Failure tests cover invalid forms, rejected WordPress delivery, failed GHL transport, retained values and retry without repeating accepted WordPress delivery.
- The candidate passed eight representative SEO comparisons, all 28 redirect checks, 230 sitemap entries and header/footer checks at 16 viewport widths.
- Ten actual GHL QA records were observed in External Forms. Contact-page details showed identity fields, message, page title/URL and UTM source/medium. Staff details showed the selected role, duration, specialist count, seniority, language, company and contact values.

## Account mappings and release

The first dashboard review found that five restored enquiries had raw values but no automatic standard contact mapping, and staff "Work Email" did not match GHL's automatic Email rule. Explicit Full Name/Email/Phone mappings were saved for all five restored enquiries. Staff Work Email → Email and Company → Organization were saved, along with optional iOS Company Name → Organization. GHL confirmed each save applies to future submissions. Legacy reCAPTCHA response fields on four restored templates are explicitly excluded from tracking.

Subject, message and assessment answers remain available as original fields in **each submission**; they are not forced into unrelated standard contact profile fields. GHL's mapped-field count therefore need not equal its detected-field count. No marketing consent was mapped or asserted. Historical QA rows created before the manual mappings are retained as test evidence; mapping changes are not retroactive.

Runtime deployment: `dpl_E6PRXtRvQnM29A43jsZu58yahEyy`, source commit `04bb862ca5edcae71a1ad65ef4fef31033f2ebf4`, [stable staging](https://inceptives-homepage-review.vercel.app/). Previous staging deployment `dpl_HnSXFGYZA7fzyGc8WkLGJDScbs2x` remains available for rollback. No production promotion/cutover occurred.

The actual GHL transport tests use clearly marked synthetic `Migration QA Test` values, a reserved test phone and a non-deliverable example email. WordPress delivery/scoring is intercepted in these isolated tests, so this batch certifies GHL capture and browser completion, not inbox delivery or production scoring. Automated non-live tests mock both destinations. Evidence summaries are in `audit/ghl-release/`.

Final dashboard verification: **18 actual QA submissions** (ten initial form types, seven follow-ups after contact mappings, one final optional-company check). All eight new post-mapping rows show the correct name/email columns. The latest staff record shows Email, Organization, Phone and all selected role/options; the latest iOS record shows Email, Organization and all four answers. Both show their source page, form identifier and UTM source/medium; the original campaign query remains in the URL. Screenshots and read-only dashboard evidence remain local in ignored `audit/ghl-release/`; only sanitized QA summaries are versioned. No QA records were deleted.

Run isolated SDK tests with `node scripts/verify-ghl-tracking.mjs <production-build-url>`. They map the stable staging hostname to that build inside an isolated Playwright browser and intercept both delivery destinations. No real email or CRM entry is created. The official public SDK is cached in ignored `audit/` on first use.

Vendor references: [External forms](https://help.gohighlevel.com/support/solutions/articles/155000006092), [external tracking and field mapping](https://help.gohighlevel.com/support/solutions/articles/155000009476-field-mapping-and-iframe-form-tracking-in-external-tracking).
