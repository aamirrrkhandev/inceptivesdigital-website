# Production indexing: pending next authorized release

The live-domain PageSpeed test on11 November2026 confirmed indexing is blocked. The current application permits indexing only when ALLOW_INDEXING=true and VERCEL_ENV=production. The production environment does not yet contain ALLOW_INDEXING.

At the next user-authorized release:
1. Set ALLOW_INDEXING=true for the Production target only. Keep Preview unset/false.
2. Build the Production target, retaining prepared production form and Turnstile values.
3. Keep the staging alias on a Preview deployment. Verify staging robots.txt still disallows crawling and sends noindex.
4. On the production apex, verify robots allows crawling, the blocking X-Robots-Tag is absent and public indexable pages have index/follow. Preserve intentional noindex on thank-you, search and applicable archives.
5. Verify canonical URLs, separate page/post sitemap children, redirects, SSL, forms and rollback before considering the release complete.

This document does not change any environment variable, deployment, account setting or DNS record. The user currently requires local-only work because of cloud build costs.

User authorization recorded,11 November2026: on the next authorized Vercel production release, enable index/follow for intended indexable website pages. Preserve Preview/local noindex and intentionally excluded utility/thank-you/search pages. This authorizes the indexing configuration at release time; it does not revoke the current no-build/no-deploy instruction.
