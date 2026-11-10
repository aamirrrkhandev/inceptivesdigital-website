# Image and banner layout review

Source commit: `beecf7be151330fa294b73dc494b08033b798c4e`.
Candidate: https://inceptives-homepage-review-gdx929d27.vercel.app/
Deployment: `dpl_2xzQmBDtZaASxxmmqmbPuzKpfZcW` in the separate migration project.

The generic background fitting rule overrode authored background sizes and positions. The revised generator preserves custom source sizing and positioning, including service heroes. Ordinary image widgets and article images preserve their aspect ratio with contain fitting. The homepage decorative green frame fills its own text panel; it is excluded from content-image fitting. The blockchain CTA expands around its complete image and stacks on smaller screens.

The homepage uses `casestudy-slider-component` with all eight original slides and assets. Its track no longer clips translated slides. Other pages retain their existing sliders. Native smooth anchor scrolling respects reduced-motion preferences.

## Candidate verification

- 28 banner checks: seven representative routes at 375, 820, 1366 and 1920 pixels; no horizontal or heading overflow.
- Eight slider verification groups: all eight slides load at four widths, navigation wraps, sampled non-home content remains unchanged, and reduced motion is respected.
- 12 media checks: three real homepage hover-video playbacks, HTTP 206 video delivery, and complete blockchain CTA fitting at eight widths.
- 241 SEO/status checks passed; missing route returns 404; sitemap has 224 entries.

The complete route inventory passed 723 browser checks (241 routes at desktop, tablet and mobile widths) without horizontal page overflow or JavaScript errors. One broken source image was observed in the first viewport of `/blog/app-store-optimization-mistakes` at all three widths; the broader ten-original recovery issue remains unresolved.

The separate image geometry scan completed 964 route/width combinations and inspected 19,709 rendered image instances, with no stretched-image flags or navigation errors. Off-viewport flags include intentionally scrolling brand marquees, horizontal process/tab strips and closed mobile navigation logos; these are review findings rather than automatic failures. Offscreen lazy images were not all decoded by this geometry scan. These checks do not establish complete visual equivalence, inbox delivery, or a 1.5-second loading guarantee.

## Unused assets

168 unused loose images (11,325,774 bytes) were moved with unchanged filenames and verified SHA-256 hashes into `draft/images`. The reference scan covered all 241 catalog entries and active source references, including optimized/poster dependencies. All 4,560 packed images have references and were retained. The draft folder is outside public delivery and excluded from the staging upload manifest. See `draft/UNUSED_IMAGES.json` for reversible mappings.

No WordPress content, original Vercel project, production domain or DNS was changed.
