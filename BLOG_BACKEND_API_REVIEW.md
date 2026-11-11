# Approved WordPress blog source switch

User approved on 11 November 2026. Blog posts, categories, category filtering, rendered custom pin flags, reviewer content and Press Release now read https://nextincep.wpenginepowered.com. Public canonical URLs continue to use https://inceptivesdigital.com without child-path trailing slashes. Known packaged media uses existing paths; newly uploaded WP Engine media retains its working backend URL.

The two environments have different post sets: the last comparison found 142 posts each, 141 common, live-only test-2 and WP Engine-only nextincep. Staging intentionally follows the approved WP Engine source; no posts were copied or modified on either WordPress environment.

All REST pagination batches are fetched. Content cache revalidates after 30 seconds on requests; upstream WordPress caching can add delay. Custom approval/pins use the rendered WordPress page adapter alongside REST. Non-blog public pages, forms delivery, GHL, CallRail, Calendly, live site and DNS remain unchanged. Primary sitemap static URLs are retained while article entries follow the approved backend.

Verification evidence is recorded in audit/page-structure/blog-backend-switch.json and blog-parity.json after tests.
