# Approved SEO fixes and WordPress publishing — 10 November 2026

Scope: separate staging only. Original WordPress and original Vercel project remain unchanged. `/startup-product-development` is deliberately deferred: no page, redirect, sitemap entry or link destination change was added for it.

## Implemented

- Added the missing RightFirms legacy redirect, corrected its page canonical/social URL/schema identity and removed the broken destination from the sitemap. Flattened the existing redirect chains. Added five confirmed relevant redirects for broken legacy links; existing internal links now use their approved targets.
- Sitemap reads current public WordPress XML plus published/indexable REST entries, emits consistent canonical paths, includes the five approved restored service pages and excludes the legacy RightFirms blog destination. Current local output: 230 entries.
- User explicitly requested no terminal slash on non-homepage canonical URLs. Canonicals, Open Graph page URLs and sitemap entries use that convention; the homepage root retains `/`. Existing slash variants remain accessible. Restored pages use the current WordPress Organization identity/logo schema, rather than stale global brand data from the older app.
- Production/preview indexing is environment-aware across metadata, headers and robots.txt. Preview remains blocked even if ALLOW_INDEXING is accidentally enabled. No production indexing/domain change was performed.
- Removed duplicate Twitter card output; preserved author profile Open Graph types and current source article timestamps/publisher metadata. Restored the homepage section heading and article author heading through current public content, preserving component styling. Thank-you uses source metadata/schema and source H2 semantics.
- Blog listing and existing author/category archives refresh automatically, with on-demand new published blog/press-release routes. No WordPress webhook or admin changes are needed for the request-driven refresh. See WORDPRESS_CONTENT_SYNC.md for timing and limitations.

## Five restored service pages

User explicitly selected https://inceptives.vercel.app/ as the reference for `/web-development`, `/staff-augmentation`, `/iot-development`, `/virtual-reality-development`, `/ar-app-development`, because these WordPress paths currently return 404. This exception does not replace any existing WordPress page content.

Reference deployment: `dpl_G7oB8Jph6q6TWMjqwnXSys5Grrfa`, Git commit `947b4fdd2f857a6dc0975d59be9b7943de2e70d4`. Its Git repository/source file tree was unavailable to this environment; public rendered pages, tab/process states and original questionnaire option data were inspected instead.

Reusable React components render structured section data with page-scoped original styles. Current WordPress header/footer are reused. 161 original assets (5,221,368 bytes, including fonts/backgrounds/variant images) were copied locally with a source manifest. Images retain source alt text. Native tab, FAQ, carousel and keyboard behavior replace the old app runtime. The staff questionnaire preserves its original role/duration/specialist/role-specific options with next/back validation. Enquiries use the existing current WordPress contact contract with CAPTCHA and confirmed-success thank-you routing; staff selections are included in the message. Source marketing consent is mapped only to marketing consent; transactional consent is never inferred.

## Verification

Local TypeScript, 16 homepage shell widths, 16 same-page blog category/history/viewport checks, existing contact/assessment validation/PDF tests and three contact success redirects passed. Approved SEO checks passed on eight representative routes, all 28 redirects, the sitemap and 404 behavior. Restored pages passed 20 viewport/tab/FAQ checks (375/768/1366/1920) plus a staff questionnaire test covering required selections, retained error state and successful thank-you redirect. Submission responses were mocked: no real enquiry was sent and inbox delivery is not certified. Source/restored web hero typography and desktop bounds were inspected and matched; full pixel-perfect acceptance of all sections is not claimed.

Released staging: `dpl_HnSXFGYZA7fzyGc8WkLGJDScbs2x`, commit `cde84500b9e11653cead8e9c44ef4685b880daef`, candidate https://inceptives-homepage-review-7u1wf2iog.vercel.app/ . Production build passed. All 248 inventory pages passed status/title/description/canonical/heading/schema/preview checks; all 230 sitemap entries returned 200 and matched their canonical destination (homepage root spelling is URI-equivalent). All 28 redirects, 16 responsive shell groups, 16 no-reload blog groups, 21 restored-page checks and three mocked contact completion redirects passed. Existing staging alias was assigned after verification. Evidence: `audit/seo-release-2026-11-10/`. Previous rollback deployment: `dpl_75VbcJH9EggFQSRJYG4FuBgc8MF1`. No claim of new Lighthouse scores, real-user Core Web Vitals, 1.5-second loading, missing-image restoration or unchanged rankings is made.

## Reproducing the additional pages

The checked-in content JSON and public/restored-assets files are sufficient to build; no runtime dependency on the old Vercel pages is required for their body/assets. To intentionally recapture the approved reference, run `node scripts/capture-secondary-pages.mjs`, then `node scripts/prepare-secondary-pages.mjs`. This uses public page requests only and writes ignored audit snapshots; review generated data before committing. Never run a recapture to overwrite newer approved content without comparing it first.
