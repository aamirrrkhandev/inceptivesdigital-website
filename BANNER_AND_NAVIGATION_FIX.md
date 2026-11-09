# Banner and navigation corrections

The background-video sibling CSS rule forced every following element to `position: relative`, overriding the source banner panel's absolute positioning. Removing that rule restores the panel's original centering and transform. At a 1440px viewport, the panel now matches the live source: x=121.15px, y=144.34px, width=607.70px, height=629.33px.

The mega menu used viewport width while its left edge was relative to the narrower navigation container. Its rightmost columns extended beyond the viewport. The interaction controller now measures that containing block and offsets each panel back to the viewport edge. It recalculates on navigation resize and viewport changes. Long menus can scroll within the available viewport height.

Mobile expansion now targets the actual `sitekit-megamenu-has` markup and explicitly displays the expanded panel. The drawer can scroll; the source's separate scrollable mobile content region is retained. Desktop menus update `aria-expanded`, support keyboard focus, Arrow Down, and Escape, and remove listeners on unmount.

Verification: `node scripts/verify-navigation.mjs <base-url>` runs 27 checks at 1920, 1440, 1280, 1024, 820, and 390px on the iOS service page. All passed against the corrected development build. Assertions include nonzero panel height, visible content, viewport boundaries, mobile toggles, and desktop keyboard navigation. Evidence is in `audit/browser/navigation-verification.json` and `audit/browser/menu-fixed-*.png`. The homepage comparison is recorded in `audit/browser/banner-review.json` and banner screenshots. TypeScript checks passed. Deployment verification remains separate from local verification.

These changes do not modify WordPress, DNS, the production domain, or the original Vercel project. The wider migration and missing original-media recovery remain incomplete.

The tablet source also obscures its heading behind the fixed header. An 80px homepage-only top inset at 768–1024px corrects that overlap. Four banner checks (1920, 1440, 820, 390px) pass after this correction.

The deployment uploader stalled on source files larger than roughly 20MB of encoded transport data. The page catalog and original 24.5MB video pack are therefore supplied as 8MiB parts, listed in `content/file-parts.json`. `readPackedFile` reconstructs the same byte ranges at build time. This does not change media bytes or introduce a runtime WordPress dependency. When regenerating either logical source file, regenerate its parts before building. The original local files remain available.

## Deployment verification

Published preview: https://inceptives-homepage-review-i1treiv08.vercel.app/ (`dpl_7wqe8Dgq7Ryv9YmnP3PbEedc7nrU`). Vercel reports READY. All 27 navigation checks and four banner checks passed against this remote deployment. Homepage and iOS service page return HTTP 200. Preview noindex headers remain present.

The original client-grey.mp4 exceeds Vercel's 20MB generated-response limit. The build now materializes it as a public static file, preserving `/wp-content/uploads/2026/10/client-grey.mp4` and all 24,507,461 bytes. SHA-256 reconstruction checks match the original. The deployed video returns HTTP 200 with video/mp4 and the expected length. No limit-bypass setting was enabled.
