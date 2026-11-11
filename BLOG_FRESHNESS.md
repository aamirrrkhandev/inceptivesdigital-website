# Blog freshness — 11 November 2026

Removed the 30-second Next data cache, ISR/full-route caching for blog articles, listing, Press Release, author/category catch-all archives and sitemap. Search uses live blog REST responses. Reads deduplicate only within one request. WordPress reads include no-cache request headers and a unique internal freshness query parameter; public URLs/canonicals remain clean.

Category-tab memory reuse is limited to 500ms. Returning to the visible blog tab refreshes its current listing; clicking the active category also refreshes it. This is not polling every 500ms, and does not guarantee a 500ms network response. An already open page does not receive a server push when WordPress changes. Next navigation/refresh or returning to the visible listing requests current data.

A post absent from the current published index returns notFound even if its old snapshot exists. Backend failure no longer falls back to a saved article/listing. Sitemap fallback includes static pages only, not historical blog URLs. Pin/reviewer/category rendering and UI/SEO values are preserved. WordPress/CDN plugins can still cache independently; their live behavior must be measured. No WordPress settings or content were modified, and no real post was deleted for QA.

Automated deletion simulation against actual getPublishedPosts/getWordPressPage code verifies publish -> delete between requests, no old snapshot resurrection and backend errors. Actual source timing/deployed checks are recorded separately. Freshness can add upstream latency versus cached pages; do not claim a 0.5s response guarantee.

## Deployed verification
Final runtime commit 428eee44aac26ca09fd9e028c4eaba021dc32061, deployment dpl_sMAJHqKBgrnti5ff1wmyyozuTUTS is READY and assigned to inceptives-homepage-review.vercel.app. Source published count is 141, down from 142; deleted /blog/test now returns 404 on repeated requests and is absent from API listing and sitemap. Browser screenshot confirms the stable alias 404. Independent template/pin/category/post reads now run concurrently; article existence uses a single slug query.

Stable staging timing samples (not Lighthouse or a percentile guarantee): IoT page 566ms; deleted post 3042ms cold / 1238ms repeat; listing API 4669ms; sitemap 5345ms; article 4351ms. No 0.5s total response claim. Original API inventory responses measured 1123ms/915ms. Five pin/reviewer/Press Release parity checks pass on final deployment. Sixteen category/no-reload/pagination/responsive browser checks passed on its immediate predecessor with the same client code, before independent data-fetch concurrency optimization.

## User change: retire pin and reviewer functionality
Supersedes the earlier parity requirement: custom pin sorting/badges and reviewer approval display are removed. Main blog/category-filter results explicitly request published posts ordered by date descending. Standard post authors, SEO metadata and all URLs remain intact. Reviewer-specific meta fields/query parameters and the extra pin-source request are removed. Original WordPress/CMS configuration is unchanged.
