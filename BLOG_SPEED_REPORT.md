# Blog speed optimization — 11 November 2026

Scope: staging only. Runtime add/update/delete, reviewer approval, current UI and SEO remain intact; pin ordering stays disabled. No live website/DNS/WordPress settings changes.

Before samples on stable staging: listing API 7607ms / 4839ms; blog document 8944ms / 5580ms; article 4736ms / 4034ms. These are full HTTP response durations from this machine, not Lighthouse LCP or field CWV. Six sequential requests; no artificially warmed cache claim.

Changes:
- Fetch only the requested 15/9/6 cards and use WordPress REST envelope totals for pagination, instead of downloading every post.
- Category/pagination API renders the same three listing wrappers locally; no WordPress HTML fetch on this path.
- Reuse HTTP connections and accept compressed upstream responses; bounded decompression and TLS verification remain enabled.
- Every article request still fetches its fresh published REST record. Only HTML for that exact record fingerprint (title/content/SEO/author/approval data included) may be reused, bounded to 32 entries/60 seconds. Changed records invalidate immediately, including same-second content edits; absent posts return 404 before HTML lookup. Upstream validation errors never fall back to stale content. Global CMS template/profile-only changes outside a post record can take at most 60 seconds for reused HTML; no TTL delays post add/update/delete.
- Byte-identical blog CSS can use a hashed immutable stylesheet instead of repeating ~495KB in inline style and RSC output. Any changed CSS falls back to inline rendering immediately; no design snapshot overrides new source styles.

Validation before deployment: TypeScript; actual paged listing add/update/delete simulation; empty/category/past-end pagination; desktop/tablet/mobile counts; zero listing HTML requests; record-fingerprint HTML invalidation and failure retry; compressed transport/TLS/path guards; existing 157 form contracts. Deployment and comparison evidence follow after actual measurements.

## Deployed result

READY preview deployment `dpl_GvAaUPrtahVBfSQEgyiKd5b5jg4Z`, runtime commit `4b48e572cfbf10027cd181ac34aac542c978baee`, now assigned to https://inceptives-homepage-review.vercel.app. Rollback: `dpl_ABdoyWxD2Si2ux4iG8MgSwt65xKj`. Production/live WordPress/DNS untouched.

Same-machine full-response samples, seconds (two sequential observations per route, not field percentiles):

| Route | Before | After |
| --- | --- | --- |
| Listing API | 7.607 / 4.839 | 2.048 / 1.819 |
| Blog document | 8.944 / 5.580 | 2.893 / 2.772 |
| Austin article | 4.736 / 4.034 | 4.002 / 2.591 |

Decoded HTML bytes: blog 1,376,537 -> 379,398 (72% reduction); article 1,974,825 -> 810,948 (59% reduction). Shared CSS bodies and checksums are unchanged; stylesheet responses are immutable, hashed assets. The timings measure HTML/API response completion, not CSS/image/script loading, total page load, LCP or field CWV. First article responses can still be around 4 seconds when fresh WordPress HTML is required; no universal 1.5s/0.5s guarantee is made. Baseline and optimized samples are not a controlled field experiment and vary with network/CMS load.

Verification:
- 16 real browser category/pagination/back/responsive checks pass, no document reloads or scroll jumps.
- Current first 15 cards match live published REST date-desc order; desktop/tablet/mobile 15/9/6; no pins; reviewer label unchanged; seven Press Release cards/order/SEO match.
- Actual page-adapter lifecycle with controlled CMS responses: every request validates current publication, unchanged HTML reused, same-second title/content edit refreshes immediately, previously cached then deleted post is not served, and CMS failure never resurrects a saved version.
- Real deleted `/blog/test` returns 404 repeatedly and is absent from listing/sitemap. IoT redirect and canonical continue to pass.
- Listing JSON matches baseline after insignificant whitespace nodes are removed. Metadata, social tags, canonical, schema and H1-H6 are identical for the listing and checked article.
- Screenshot pixel comparisons after fonts/visible images settle: 1366/820/375 listing viewports all 0 changed pixels. Article viewport: 21/1,297,700 pixels above a 12-channel-delta threshold (0.0016%); no meaningful layout difference. Phone links are masked consistently in screenshots.
- Compression (plain/br/gzip/deflate), keepalive, invalid compressed response rejection, TLS and path restrictions pass. Existing 157 form-contract checks and 12 Turnstile security cases pass.

All timing, HTML, API and screenshot artifacts remain under `audit/blog-speed-2026-11-11`. No real CMS post was added/edited/deleted for testing. Current CMS data was read only; controlled lifecycle mutations use a test fixture.
