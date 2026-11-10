# inceptivesdigital-web

Next.js migration of Inceptives Digital. The current WordPress website is the design/content reference. The project contains 241 migrated page/archive paths plus newly published WordPress blog posts loaded on demand.

Staging: https://inceptives-homepage-review.vercel.app/

## Run locally

Install Node.js 24 and Git. Allow at least 5 GB free for dependencies and generated build files.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. To run a production build:

```sh
npm run build
npm start
```

No WordPress administrator credentials are required. Public WordPress content and the existing form handlers must remain reachable for live blog updates and form delivery. Do not put credentials in source files.

## Content and media

- App Router, React, TypeScript and reusable native interactions are under src/.
- Structured layouts are in content/site-catalog.json.br and its deployment parts. Media are stored in content/media/ with their index in content/media-index.json. Keep these files in the checkout.
- The build materializes original large media and video files into public/ at their preserved URLs. Generated files, node_modules and Next.js caches are ignored by Git. Raw audit exports stay local; curated baselines and verification reports are versioned.
- WordPress remains the read-only publishing source for new/updated posts, blog filtering and sitemap blog entries. Revalidation is request driven at 30 seconds; allow roughly 30–60 seconds for updates.
- Unused loose images are retained in draft/images with reversible hash-verified mappings.

## Verification

Run npm run typecheck. Browser checks use Playwright; install its Chromium browser with npx playwright install chromium if needed. Verification scripts accept a local or staging base URL, for example:

```sh
node scripts/verify-homepage-shell.mjs http://localhost:3000
node scripts/verify-homepage-slider.mjs http://localhost:3000
node scripts/verify-blog-client-tabs.mjs http://localhost:3000
```

See MIGRATION_PROGRESS.md, WORDPRESS_CONTENT_SYNC.md, HOMEPAGE_HEADER_FOOTER_REVIEW.md and the audit/browser reports for actual results and remaining acceptance work. Some integration checks use mocked responses; do not send real test enquiries without authorization.

## Staging and cutover

The separate staging project is non-indexable. Source canonicals point to https://inceptivesdigital.com/. Do not connect the live domain, change DNS or overwrite WordPress/the original Vercel project without explicit cutover approval.

The existing WordPress PHP handlers still provide form delivery. One previously authorized iOS assessment test succeeded; general CAPTCHA/inbox verification remains incomplete. Ten legacy originals in three blog posts remain unavailable. Performance acceptance and full visual acceptance are ongoing; a 1.5-second load guarantee has not been established.

Before any production cutover, configure a distinct WordPress backend origin and review indexing, analytics, forms, redirects and rollback. The current WordPress source domain cannot point back at Next.js while also serving as its backend.
"# inceptivesdigital-web" 
"# inceptivesdigital-web" 
"# inceptivesdigital-web" 
"# inceptivesdigital-website" 
