# Banner and navigation corrections

The background-video sibling CSS rule forced every following element to `position: relative`, overriding the source banner panel's absolute positioning. Removing that rule restores the panel's original centering and transform. At a 1440px viewport, the panel now matches the live source: x=121.15px, y=144.34px, width=607.70px, height=629.33px.

The mega menu used viewport width while its left edge was relative to the narrower navigation container. Its rightmost columns extended beyond the viewport. The interaction controller now measures that containing block and offsets each panel back to the viewport edge. It recalculates on navigation resize and viewport changes. Long menus can scroll within the available viewport height.

Mobile expansion now targets the actual `sitekit-megamenu-has` markup and explicitly displays the expanded panel. The drawer can scroll; the source's separate scrollable mobile content region is retained. Desktop menus update `aria-expanded`, support keyboard focus, Arrow Down, and Escape, and remove listeners on unmount.

Verification: `node scripts/verify-navigation.mjs <base-url>` runs 27 checks at 1920, 1440, 1280, 1024, 820, and 390px on the iOS service page. All passed against the corrected development build. Assertions include nonzero panel height, visible content, viewport boundaries, mobile toggles, and desktop keyboard navigation. Evidence is in `audit/browser/navigation-verification.json` and `audit/browser/menu-fixed-*.png`. The homepage comparison is recorded in `audit/browser/banner-review.json` and banner screenshots. TypeScript checks passed. Deployment verification remains separate from local verification.

These changes do not modify WordPress, DNS, the production domain, or the original Vercel project. The wider migration and missing original-media recovery remain incomplete.
