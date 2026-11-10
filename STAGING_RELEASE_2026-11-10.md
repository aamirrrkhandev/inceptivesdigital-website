# Staging release — 10 November 2026

Stable staging: https://inceptives-homepage-review.vercel.app/

Immutable candidate: https://inceptives-homepage-review-nji70cdnk.vercel.app/

Project: `inceptives-homepage-review` (`prj_LjTmsq5OcdsUnkV4tEKe2n4U6r0b`). Deployment: `dpl_Fz2H7wpiUm6VmJ792fspYz2rq2H4`. Source commit: `2991be5`, branch `migration/homepage-review`.

## Changes

- Fixed the mobile drawer close state, SVG close control, submenu arrows, nested scroll areas and background scroll locking.
- Added no-crop fitting for captured image backgrounds and image widgets. Aspect-ratio differences can create empty space around a complete image, as discussed with the user. The blockchain CTA stacks and expands on smaller screens; its original graphic stays inside the section.
- Corrected the CSS body-class prefix bug affecting component selectors such as `.home-container-sty`.
- Serve all ten video assets as static files generated from their original packed bytes during build. This preserves asset URLs and supplies proper range responses; no image/video placeholders were introduced.
- Native iOS assessment and general contact submission wiring are included. The assessment remains dependent on the existing WordPress PHP backend. Private snippet source remains inaccessible.
- Preserve the source iOS SEO title and prevent embedded widget document titles from being hoisted into the page head.

## Verification on the deployed candidate

- Production build and TypeScript passed.
- 241 routes passed the fields checked by `verify-full-site.mjs`: HTTP status, head title, description, canonical, headings, JSON-LD and preview noindex. The nonexistent path returned 404; sitemap contained 224 entries. Social metadata and all functional integrations are separate acceptance work.
- `verify-responsive-media.mjs`: 12 passes. Original video range request returned 206 with the exact requested 1,000 bytes; three homepage hover videos actually played; complete blockchain image fitting passed at 320, 390, 519, 768, 820, 1024, 1440 and 1920 pixels.
- `verify-responsive-scroll.mjs`: 22 passes across mobile/tablet expanded menus and representative desktop templates, including actual wheel scrolling and background locking.
- Stable alias was checked after assignment: HTTP 200, one correct iOS head title, preserved production canonical, preview noindex metadata/header, and video range status 206.
- All ten deployed video assets returned the exact requested byte range and original total file size. Both deployed form APIs correctly rejected incomplete same-origin payloads before contacting the WordPress submission handler; no additional real enquiry was sent.

Evidence: `audit/refresh-2026-11-10/http-verification.json`, `SEO_COMPARISON.csv`, `audit/browser/responsive-media-verification.json`, `audit/browser/responsive-scroll-verification.json`, and screenshots in `audit/browser`.

No second real enquiry was submitted during deployment verification. The earlier single authorized assessment test succeeded through the original handler; actual inbox delivery is not independently verified. General contact CAPTCHA delivery and the ten missing source blog images remain unresolved. Full visual equivalence and the 1.5-second loading target are not claimed by these checks.

## Future staging updates

Continue using this separate staging project for verified batches. Build with Node 24 and `npm run build`; generated static videos and responsive background rules are prepared automatically. `scripts/prepare-deployment-manifest.mjs` inventories deployment inputs and reuses unchanged uploaded content. The connected Vercel tool creates an immutable Preview deployment; run acceptance checks against that candidate before assigning the stable staging alias. No custom production domain, DNS or original Vercel project changes are authorized.

## Rollback

The previous stable deployment is retained: `dpl_7wqe8Dgq7Ryv9YmnP3PbEedc7nrU`, https://inceptives-homepage-review-i1treiv08.vercel.app/ . Reassign only `inceptives-homepage-review.vercel.app` to that deployment to roll back staging. WordPress remains the live production site. The earlier unpromoted candidate `dpl_Cj2zZBXwm6H8qHjxD8w2eiMAmVXp` was not assigned the stable alias because its SEO review was incomplete.
