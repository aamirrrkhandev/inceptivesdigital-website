# Performance report — initial review

WP Engine production overview reports Lighthouse performance 56 desktop and 40 mobile, refreshed 9 November 2026 at 04:25 Asia/Karachi. These are provider-reported scores, not independent runs by this migration. Other categories and test configuration were not available in that overview.

The new production build passes and prerenders the homepage. No migrated Lighthouse scores or real-user LCP/INP/CLS measurements have been established yet. No claim of a 90+ score or field Core Web Vitals pass is made.

Implemented: static Server Component page, limited client interactions, local fonts, original local media, responsive image derivatives, image dimensions, deferred scheduling iframe and lazy noncritical images. Remaining: measurement under repeatable Lighthouse conditions, video loading budgets, third-party scheduling cost, responsive image sizing refinement and field monitoring after authorized launch.

10 November follow-up: PageSpeed Insights UI was run against both the new immutable staging preview and the stable staging alias. Google returned “Unable to resolve” for each URL, so no new scores or loading-time result was produced. See `audit/pagespeed/current-results.json` and `current-error.txt`. The 1.5-second target has not been verified. The homepage replacement calendar mounts only within 180px of its section or on explicit fallback activation, avoiding a Calendly request during initial above-the-fold loading.
