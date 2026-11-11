# CallRail homepage capture timing — 11 November 2026

## Scope and baseline

The two unconfirmed genuine submissions were the homepage footer and popup. The eight other form types have event URLs in the account timeline; homepage URLs were absent. Historical network traces are unavailable, so the precise network state of those earlier two attempts cannot be reconstructed.

A controlled reproduction against the preceding deployed build delayed the installed native form module by 3.5 seconds and its capture response by 2 seconds. Both homepage forms navigated before acknowledgement, with two transport attempts observed. A separate isolated test with the real CallRail destination could succeed on the old build, confirming that this was not a permanent homepage exclusion rule. The public account configuration captures all URLs and sources.

## Fix

The previous helper waited only 1.5 seconds for the form module, invoked captureForm and immediately allowed reset/navigation. The installed SDK defers its XHR and persists a single pending capture; invocation is not proof of acceptance. Although vendor documentation describes a captureForm callback, the installed module does not invoke one.

The shared helper now allows up to eight seconds for SDK/module readiness and observes acknowledgement of the native SDK's HTTPS form_capture.json request before normal thank-you navigation. A unique non-sensitive form-metadata marker associates the response with the correct submission. This does not send another request or change vendor payload values. Only the public CallRail capture endpoint is observed; unrelated XHR behavior remains unchanged. Rejected/timeout states are explicit, with a five-second acknowledgement deadline; already confirmed GHL leads are not discarded when analytics is unavailable. No private CallRail API key, paid setting, routing or DNS change is involved.

## Verification

- Production build and TypeScript pass.
- The same slow-module/slow-response reproduction now produces one request per homepage form, accepted before thank-you.
- All ten form journeys pass with native GHL and CallRail SDKs and isolated endpoints, including GHL failure/retry and hidden/challenge exclusion.
- Preview deployment `dpl_8ChPy85f6GN5DjWJuUPiGTPUCiRC` is READY and assigned only to stable staging. The slow-network tests also pass against this deployed build.
- Real CallRail-only run `1794378997973` produced ten distinct native UUIDs, one per form type, each accepted with HTTP 200 before thank-you. Session/landing data and challenge exclusion were checked. The account dashboard search for `migration-callrail-1794378997973@example.invalid` shows **10 Forms** and ten distinct event links. This includes new homepage footer and popup captures; the old missing test records were not fabricated or backfilled.
- Local screenshots and endpoint evidence are in ignored `audit/callrail-cloudflare/callrail-fixed-all-ten.png`, `callrail-fixed-all-ten.txt`, `live-all-forms.json` and the before/after timing JSON. Sanitized summaries are versioned in `audit/callrail-fix-release-2026-11-11/`.

The real-transport runner explicitly requires CALLRAIL_QA_LIVE=confirmed. It isolates the challenge, GHL and website backend inside the test browser; only CallRail receives clearly labelled synthetic records. It does not repeat the already accepted CRM enquiries or certify new genuine CAPTCHA/inbox journeys. The preceding batch already verified genuine GHL delivery for all ten types.

Runtime source: 47d027568be07675a47ab0468c88520dff51d9ef. Separate staging project only. Rollback staging alias to dpl_69v8cJrEP2uM7tdKhVEjhD4mpQto if needed. Editable-page organization is a separately approved follow-up; no asset URL, UI or SEO refactor was part of this tracking release.

Reference: [CallRail manual form capture](https://apidocs.callrail.com/#form-capture).
