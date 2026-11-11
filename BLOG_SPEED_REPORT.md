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
