# Current WordPress parity review — 10 November 2026

Scope: recheck every current public page and archive against the live WordPress site, preserve content/media/SEO, fix differences in the separate migration project, and publish a verified staging preview. No WordPress settings/content, original Vercel project, production domain, or DNS changes.

1. Capture fresh sitemap indexes, all discovered URLs plus the previous inventory, current HTML/metadata, first-party styles/scripts, and cache evidence into `audit/refresh-2026-11-10`. Preserve the earlier audit separately. Compare structural/content/SEO changes.
2. Refresh the generated page models and asset registry from that capture. Check actual media changes and missing source originals. Normalize CSS using the browser's parser; remove only migration-caused differences. Preserve existing behavior through native React/browser controls without loading Elementor runtime.
3. Run full-page source/target comparisons at desktop, tablet, and mobile widths. Record meaningful geometry, typography, asset, responsive, interaction and screenshot differences for every route. Mask only genuinely dynamic video/animation/embed regions in visual comparisons; preserve unmasked screenshots as evidence when needed. Resolve shared-template causes first, then page-specific differences.
4. Validate titles, descriptions, canonicals, headings, robots differences intentionally required for staging, social metadata, schema, links/redirects, pagination, assets, forms and interactive controls. Report source errors and unresolved functionality honestly. Recheck performance on production builds; never claim the 1.5s target without measurement.
5. Publish only to `inceptives-homepage-review`, verify the deployed inventory, update parity reports and the per-page progress matrix, and point its staging alias to the validated deployment. Production cutover remains unauthorized.

Local verification builds will use a separate output directory and port so rebuilding does not invalidate the review server on port 3100.

Current blocker under investigation: the normal machine resolver returns EAI_AGAIN for the source domain. A process-local public resolver succeeds; HTTPS hostname/certificate validation remains enabled. No cached capture will be labeled fresh.
