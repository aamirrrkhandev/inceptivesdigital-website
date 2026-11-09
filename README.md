# Inceptives Digital — isolated homepage review

Next.js 16.4.5, React 19, TypeScript, App Router. The live WordPress homepage is the content/design reference. This batch implements the homepage only; all other navigation destinations stay on the existing public website until their approved migration batch.

## Setup

Use Node 22.10+ or 24 and npm. Run `npm ci`, then `npm run build` and `npm start`. For development use `npm run dev`. No credentials or environment variables are required for the homepage review.

`node scripts/verify-http.mjs http://localhost:3000` verifies HTTP behavior, metadata, exact extracted text and every original asset mapping. Browser specs are in `tests/homepage.spec.ts`; run `npx playwright test --update-snapshots` to establish local screenshot baselines, then `npx playwright test` for later comparisons. Tests require installed Playwright browsers. The current session's browser evidence is recorded separately in `audit/` and `QA_REPORT.md`; unrun tests must not be represented as passing.

## Content and assets

`src/content/source.json` contains structured source text and modules, not HTML blobs. `assets.json` maps original source URLs to local downloads, and `dimensions.json` supplies intrinsic sizes and responsive derivatives. The original image/video bytes are retained in `public/assets`. `audit/ASSET_MANIFEST.json` records SHA256 hashes. Audit scripts retain source snapshots but are not required at runtime.

## Staging safety

This project is permanently non-indexable in this review: HTML robots metadata, X-Robots-Tag headers and robots.txt block indexing. Canonical URL points to the authoritative live homepage. Analytics scripts are inventoried but do not execute on staging. Contact form validates and explicitly reports that it did not send a message. Calendly uses the original public scheduling destination; no booking has been submitted by this migration.

Do not promote this build or attach a live domain. Production indexing, analytics and verified form delivery require a later explicitly authorized cutover batch. The existing Vercel project and WordPress installation are not linked as deployment targets.
