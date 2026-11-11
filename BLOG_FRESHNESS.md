# Blog freshness — 11 November 2026

Removed the 30-second Next data cache, ISR/full-route caching for blog articles, listing, Press Release, author/category catch-all archives and sitemap. Search uses live blog REST responses. Reads deduplicate only within one request. WordPress reads include no-cache request headers and a unique internal freshness query parameter; public URLs/canonicals remain clean.

Category-tab memory reuse is limited to 500ms. Returning to the visible blog tab refreshes its current listing; clicking the active category also refreshes it. This is not polling every 500ms, and does not guarantee a 500ms network response. An already open page does not receive a server push when WordPress changes. Next navigation/refresh or returning to the visible listing requests current data.

A post absent from the current published index returns notFound even if its old snapshot exists. Backend failure no longer falls back to a saved article/listing. Sitemap fallback includes static pages only, not historical blog URLs. Pin/reviewer/category rendering and UI/SEO values are preserved. WordPress/CDN plugins can still cache independently; their live behavior must be measured. No WordPress settings or content were modified, and no real post was deleted for QA.

Automated deletion simulation against actual getPublishedPosts/getWordPressPage code verifies publish -> delete between requests, no old snapshot resurrection and backend errors. Actual source timing/deployed checks are recorded separately. Freshness can add upstream latency versus cached pages; do not claim a 0.5s response guarantee.
