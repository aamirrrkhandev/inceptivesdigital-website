# Future cutover and rollback runbook — not authorized for execution

No cutover steps are to be run during the homepage review.

Before a later cutover: complete every required route, content/visual/SEO parity checks, redirect inventory, verified form delivery, analytics configuration, security and accessibility checks, representative performance tests and a production indexing review. Export current DNS and verify restorable WordPress backups through approved access. Establish deployment identity, owners and rollback criteria.

Only after explicit user authorization: prepare production host configuration separately from permanently noindex review staging; verify robots/sitemap/canonical host, production integration secrets, SSL and caching; execute the agreed domain switch and check a representative full URL inventory immediately.

Rollback: preserve WP Engine and its content/assets throughout migration. Restore the recorded prior domain routing if cutover fails, verify WordPress HTTP responses and form delivery, and stop Next.js production auto-promotion until the failure is understood. Do not delete projects, source assets, DNS records or WordPress resources as part of rollback.

Monitor after authorized launch: 404/5xx rates, redirect chains, canonical/indexing changes, Search Console crawl errors, impressions/clicks, analytics conversion events and field Core Web Vitals. No guarantee of unchanged rankings is made.


## 11 November 2026: do not shut down WordPress yet

Blog reads now use the approved nextincep.wpenginepowered.com backend. Remaining runtime dependencies still read the production WordPress host: form-contract discovery and assessment handlers, search, non-blog XML sitemap discovery and any remote unbundled media. Repointing inceptivesdigital.com to Next before decoupling these creates self-fetch/404 risks. Keep WordPress hosting active; a public-domain cutover does not require shutting the CMS down. Before separately authorized cutover, choose a permanent WordPress backend hostname, validate all contracts/search/assessment/uploads, update deployment configuration and repeat real form/SEO/sitemap tests. Keep original WordPress deployment/backups for rollback; DNS and live public site remain untouched.


## Superseding update: original WordPress runtime dependency removed

The final 11 November source pull and offline verification replace the earlier dependency warning above. Non-blog form contracts, iOS assessment scoring, search page content, thank-you metadata and non-blog sitemap data now run locally. The original WordPress host was blocked during verification: 13 GET/browser checks plus 157 actual-handler contract checks and the iOS handler passed; the original PHP scoring matched all 81 input combinations. GHL remains the approved delivery destination; legacy WordPress SMTP/AJAX calls are retired. Blog posts/categories/authors/pins/reviewer/Press Release continue using nextincep.wpenginepowered.com. Keep that blog CMS available.

Before any separately authorized public-domain cutover, configure and verify production Turnstile secrets/hostname plus GHL domain-specific mappings and tracking; current security is intentionally configured for staging only. Do not cancel WP Engine hosting if it also hosts the blog backend. Keep the source snapshot and old WordPress deployment available for rollback. No DNS/domain changes were executed.
