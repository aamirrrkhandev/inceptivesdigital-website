# Staging release — 11 November 2026

URL: https://inceptives-homepage-review.vercel.app
Deployment: dpl_756M9PmwU5U6mgiiB4GrnZE4uSaE (READY, preview target)
Runtime commit: 3f4c233e5648b84e42748911f5d4e51aa66cd253
Rollback: dpl_8ChPy85f6GN5DjWJuUPiGTPUCiRC

## Delivered

All six restored services are public and category-linked: /web-development, /staff-augmentation, /iot-development, /virtual-reality-development, /ar-app-development and /mobile-game-development. Current-brand schema, production canonicals without child trailing slashes and sitemap entries preserved. Existing newer WordPress pages retained. Startup remains held; Our Process and Our Manifesto deliberately excluded. Responsive service drawer scrolling and calendar retry fixed.

Blog source now reads https://nextincep.wpenginepowered.com, including REST pagination/categories and rendered custom pins/reviewer/Press Release output. Public SEO URLs retain https://inceptivesdigital.com. At verification: 142 published articles, 15 categories, seven Press Releases. New backend-only /blog/nextincep returns 200; old-source-only /blog/test-2 returns 404. No WordPress content was copied, deleted or modified.

## Verified

- Production build and TypeScript pass; 81 editable models match, 1990 physical asset aliases.
- Local six-service QA: 18 viewport cases, 78 link destinations, FAQ/process/carousel/CTA controls, no horizontal overflow; canonical/schema/sitemap and excluded 404 checks pass.
- Remote staging: 80-page normalized structure/SEO parity passes; five navbar widths expose all six links; all 142 articles and 15 category requests pass, including sitemap canonical overrides.
- Remote: 209 restored originals and 1990 asset aliases pass HTTP checks. SVG line-ending normalization from Git is verified by exact normalized markup instead of Windows byte counts.
- Eight-template SEO check, 29 redirects and 232 sitemap URLs pass locally; remote pins, reviewer and seven Press Releases pass.
- Eleven isolated native vendor-SDK form journeys pass (vendor POSTs mocked, not real delivery evidence).
- Two real Mobile Game staging test submissions reached /thank-you and were found in GHL/CallRail. First revealed missing new-form contact mapping; Full Name/Email/Phone mapping saved for staging form only. Follow-up visibly populated GHL contact name/email columns, retained all five fields, source URL and UTM source/medium, and CallRail captured 5/5 fields plus source/medium/page URL. Historical raw QA row retained.

Evidence: audit/release-2026-11-11/ includes sanitized checks and screenshots containing synthetic QA entries.

## Remaining cutover gate

Do not shut down WordPress or repoint the production domain yet. Search, form contracts/assessment handling, non-blog sitemap discovery and possibly remote media still depend on the current WordPress host. Decouple and verify them on a permanent backend hostname first. The CMS must remain hosted for ongoing blog publishing. No live-site, original Vercel project, production-domain or DNS changes were made. This release does not certify a universal 1.5-second load time or new PageSpeed scores.
