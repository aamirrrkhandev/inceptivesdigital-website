# Full migration batch — authorized 9 November 2026

The homepage review gate has been lifted by the user. All discovered public pages are now in scope. Exact current live layouts and original content/assets remain authoritative. No live WordPress, WP Engine, existing Vercel project or DNS changes are authorized.

## Sequence

1. Finish the full sitemap/internal-link crawl. Preserve status, redirect, metadata, headings, image, schema and widget evidence per URL.
2. Extract reusable layout modules and per-page content into typed structured models. Use server rendering and static generation. Remove WordPress/Elementor JavaScript dependency; preserve the source's layout rules and responsive breakpoints in locally compiled, scoped CSS.
3. Rebuild shared source header/footer and page templates; implement lightweight native tabs, accordions, carousel controls, forms and scheduling behaviors. Keep verified production form delivery explicitly blocked until a destination is configured; no fabricated success responses.
4. Optimize original media delivery, defer offscreen video/embeds, eliminate duplicated client content and produce modern font/image variants. Do not replace content with placeholders.
5. Compare desktop/tablet/mobile source and target captures, validate all paths and SEO invariants, and measure real PageSpeed Insights results. Record each URL's implementation, parity and performance status separately. An implemented route is not an accepted route.
6. Publish only to the separate migration staging project after required build/runtime checks. Continue correcting observed differences and failures. No production cutover.

## Performance acceptance

User target: every page loads within 1.5 seconds. Record FCP, LCP, Speed Index, TBT, CLS, test device/network and repeat results; do not equate response time with complete page load. For conservative review, treat LCP <= 1.5 s as the primary lab target and report any failures. Field performance and third-party scheduling cannot be guaranteed under all real-world conditions. Never claim the target is achieved until measurements support the specific claim.

Google PSI needs unauthenticated test access. Keep the staging application non-indexable. Prefer scoped, time-limited staging share access over disabling account protection; never alter the existing live project's protection.
