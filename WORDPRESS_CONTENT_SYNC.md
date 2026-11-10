# WordPress post synchronization

## Approved refresh update — 10 November 2026

Publish/edit blogs in WordPress as usual (Posts → Add New/Edit → Publish/Update). Retain existing published slugs unless a redirect is planned. Next.js reads the public published-post index, article HTML, featured images/alt text and Yoast metadata; no Git/Vercel push is needed for each post. Current author and category archives now refresh from the same live WordPress archive templates rather than their old snapshot. The sitemap merges live XML sitemap entries with published, indexable REST entries and approved restored service pages, with corrected canonical destinations.

The refresh remains request-driven, normally about 30–60 seconds plus upstream/network refresh time. An already open browser tab needs navigation or refresh. There is no instant-publish webhook, WordPress plugin change or scheduled paid job. A brand-new permalink may initially return 404 until the published-post index refreshes. Existing content falls back to the saved migration snapshot if its source refresh fails. New post media stays at valid WordPress URLs when no local packed copy exists; no placeholder is substituted. Existing saved author/category archives are supported; adding a wholly new archive template requires separate validation.

Staging stays noindex regardless of a copied indexing flag when VERCEL_ENV is preview. Production indexing requires ALLOW_INDEXING=true on an actual production environment and a new verified production build. No indexing flag was enabled. Before production cutover, the currently fixed WordPress source hostname must be moved/configured to a distinct backend origin in code; do not point the existing backend hostname at Next.js while it is still its own publishing/form source.

WordPress remains the read-only publishing source for blog posts. Publishing a post no longer requires rebuilding the Next.js deployment. The previous snapshot-only routes rejected unknown slugs and the blog filters had no native event wiring.

`src/lib/wordpress-content.ts` reads the public published-post REST index, current Yoast indexing/canonical directives, and published post templates. New or modified posts are converted into structured React layout nodes using the existing migrated article template and native article interactions. Scripts and inline event handlers from the source are excluded. Existing media use their packed/optimized counterparts; newly published media retain their public WordPress URLs, dimensions and alt text. A post without a featured image is rendered without a fabricated image.

The blog listing reads published posts from REST, including posts the original custom listing omits when no featured image is present. The original featured-guide section remains in place. The published frontend snippet's category aliases and URL parameter semantics are ported into `BlogInteractions.tsx`; server queries supply the selected category/search results and pagination. Mobile/tablet/desktop use 6/9/15 posts per page. Category selection clears search and resets pagination; global search clears category and resets pagination. The original hidden search widget remains hidden. Its handler is verified without changing that source layout.

## Caching and failures

- WordPress public responses use the Next.js data cache with 30-second revalidation.
- Individual post routes and the sitemap also revalidate every 30 seconds. New slugs are allowed on demand.
- Revalidation is request driven, not a scheduled poll. A newly published/updated post normally appears on subsequent visits in roughly 30–60 seconds; an already open browser tab needs navigation or refresh. No instant-publish webhook is installed.
- Updated post template requests include the post modification timestamp to avoid reusing a previous WordPress page-cache version.
- An unavailable source falls back to the last migrated version for an existing route and logs the refresh failure. An unavailable source does not silently turn an unknown post into a 404. A successful published-post index with no matching slug returns a real 404.
- Sitemap blog entries come from current published posts with Yoast `index` directives. Drafts and noindex posts are excluded. Non-blog sitemap entries retain their existing rules.

No WordPress settings, PHP snippets, production deployments or DNS were modified. The private PHP snippet export remains unavailable; its published frontend behavior was inspected and ported, and its data queries are implemented through the read-only REST API.

Before any production domain cutover, the WordPress source and existing form handlers must receive a separate origin. The current staging source is the live WordPress domain; pointing that domain at Next.js without changing the backend source would create a recursive dependency. This is a future cutover prerequisite, not a staging issue or an authorized DNS change.

## Verification

The actual newly published post `/blog/test` (WordPress ID 24963) renders with matching content, title, canonical and Yoast schema. It appears in the blog grid and sitemap; a nonexistent unpublished slug returns 404. All 13 category tabs, pagination, the source-hidden search handler and responsive 6/9/15 counts passed locally and on the deployed candidate (19 verification groups). Deployed verification is saved in `audit/browser/wordpress-sync-verification.json`.

Released source: `d5afb458ab56ad8b88083258947eb1738761bcbf`. Deployment: `dpl_2aqkhGXypjspwjuszXwQ1maAvu9t`, https://inceptives-homepage-review-ldes0h6e5.vercel.app/; stable staging https://inceptives-homepage-review.vercel.app/. Rollback: `dpl_5voDiwiLfbxJDtUtYSJzqbxBJLP9` (calendar update, before automatic content sync).

The 241-route baseline comparison has 239 exact passes. The two heading differences are expected: the explicitly requested homepage meeting redesign and the blog's newly published post replacing the last first-page card. Metadata/schema comparison passes, and the sitemap now has 225 entries. The new post's metadata/schema is checked separately against its actual REST source. The homepage slider's eight verification groups still pass; non-home slider components are unchanged.

## Same-page tabs update

At the user’s request, category selection, search, pagination and responsive view changes now use Next.js client navigation rather than full document navigation. Scroll position is preserved and the grid exposes its pending state through aria-busy. Back/forward history restores the selected URL state. Sixteen deployed browser verification groups passed with a preserved document nonce and zero top-level navigation requests. Released commit d251dbc; deployment dpl_gh9UBzkQcZUHoeUVAybVh5BecXwh.

## Clean category URLs

The latest implementation renders the listing as a client-owned React island and requests structured listing nodes from /api/blog-listing. Category, search, responsive view and page state are kept in browser history; the visible address stays at /blog. Back/forward state is retained without document reloads. A short browser-memory cache reuses recent results; request cancellation prevents stale responses replacing the last selection. Failed requests retain the last applied results and expose Retry.

Old category/search query URLs still render their requested content for compatibility, then clean the browser address. Their server metadata is noindex with a canonical to https://inceptivesdigital.com/blog. The data endpoint always returns X-Robots-Tag: noindex. Unfiltered numbered pagination links remain crawlable; no category query links are generated. Directly sharing /blog starts with the normal listing rather than exposing a category query URL.

Local verification: 16 no-reload/category/history/viewport groups and the legacy URL, canonical/noindex, API noindex and error/retry checks passed.

Clean-URL deployment verified and released: dpl_DiEQSg2E2oJUKMjJ9SPXkMCmUDi5, source commit 8040848. All 16 no-reload/history/viewport groups passed with the address remaining /blog; legacy canonical/noindex, API noindex, no category-query pagination links and a simulated failure/retry also passed. The same release passed all 16 homepage shell widths with separate social icon touch targets.
