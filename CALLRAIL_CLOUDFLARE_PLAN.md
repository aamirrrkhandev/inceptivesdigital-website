# CallRail and Cloudflare staging integration — 11 November 2026

## Verified baseline and scope

- The logged-in CallRail company supplies `https://cdn.callrail.com/companies/691547027/8acc5c6cc37011b7cee7/12/swap.js`. The current public WordPress GTM container (`GTM-5BV286F5`) loads exactly that snippet. Its public configuration enables visitor/session number swapping, DOM observation and form capture.
- WordPress responses have Cloudflare edge headers and its Elementor forms use Simple Cloudflare Turnstile with public site key `0x4AAAAAAF2_MwH5-dBU2H8A`.
- Staging already renders that Turnstile key and forwards its token to the current WordPress handler for validation. Script failure/expiry recovery and dynamically mounted form handling need review. The iOS snippet handler currently has no Turnstile contract.
- Chrome CallRail access is verified. Cloudflare currently requires user sign-in; an async request is pending. No credentials were read or generated.
- Only the separate staging project is authorized. Do not change live WordPress, CallRail routing/numbers/paid settings, DNS, nameservers or the original Vercel project. A Vercel-owned `vercel.app` hostname cannot inherit the production domain's Cloudflare proxy/DNS zone.

## Implementation and acceptance

1. Load the exact official CallRail snippet once after hydration from the shared root; keep canonical/source business numbers intact and support subsequent route/DOM changes through the documented swapping API.
2. Preserve the existing account's form-capture feature using its documented manual API after confirmed website/GHL success. Exclude automatic capture so invalid attempts, search forms, synthetic GHL replays and retry clicks do not create extra CallRail enquiries. Exclude CAPTCHA/hidden control values from capture. Tracking failure must not break the existing lead delivery or phone fallback.
3. Improve shared Turnstile loading, retries, expiry handling and dynamically mounted widget lifecycle without removing current server validation. Verify real widget behavior on the stable staging host. Once Cloudflare access is available, inspect hostname authorization and the production zone read-only before proposing any account configuration change.
4. Test the real SDK with isolated/mocked delivery endpoints, GHL regression flows, phone text/tel links, validation/failure paths, representative responsiveness and SEO. Verify the deployed script with CallRail's own installation checker. Report any unverified real-call/CDN/hostname dependency explicitly.
5. Deploy a separate candidate, verify it, update the existing staging alias and push the code/reports to the authorized GitHub repository. Keep the current staging deployment available for rollback.

References: [CallRail JavaScript API](https://apidocs.callrail.com/#swap-js), [Turnstile hostname management](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/).
