# Editable pages and calendar staging verification — 11 November 2026

Scope: 80 existing static/restored/thank-you pages exported into editable App Router/page-content folders; one WordPress-managed Press Release wrapper; no static blog-post copies. Added 915 section entry points, 1,781 physical asset aliases, per-page image/SEO/schema manifests, and a 248-URL editing directory. Original public asset routes remain valid. Shared files are deduplicated.

## Local evidence

| Check | Result |
| --- | --- |
| Production build and TypeScript | Passed |
| Original reconstructed page models | 80/80 exact hashes |
| Temporary SEO/alt/src/background edits and restoration | Passed |
| HTTP delivery and size of physical public asset aliases | 1,781/1,781 passed |
| Server-rendered content, CSS, headings, metadata, JSON-LD, status and robots baseline | 80/80 passed |
| Representative screenshot comparisons | 16/16 passed; four pages at 390/768/1366/1920 px |
| Responsive menu / scroll checks | 22/22 passed |
| Video byte ranges, all three hover videos and complete blockchain CTA image | 12/12 passed |
| Existing approved SEO checks | 8 templates, 28 redirects, 230 sitemap URLs passed |
| Blog tabs and legacy clean URL/noindex/canonical handling | Passed |
| Custom pin badge/first position | Desktop/tablet/mobile, 15/9/6 cards passed |
| Live Press Release articles/order/metadata | 7/7 matched |
| Live approval example | Reviewed by Muhammad Usman matched |
| Native GHL + CallRail SDK regression | 10/10 forms passed; destinations mocked, no duplicate live leads/emails |

Baseline snapshots are preserved locally in audit/page-structure. Metadata element order is normalized for semantic comparison; values/attributes are unchanged. Deterministic screenshot comparisons hide moving video frames and block third-party integrations only inside isolated QA browsers. Separate real-video playback checks passed. This proves parity with the pre-reorganization staging baseline, not a new assertion of pixel-perfect parity across every live WordPress page.

The approved blog fixes preserve the WordPress editing workflow. Custom pin flags come from public WordPress markup because REST sticky is false for the pinned fixture. Press Release now refreshes the category-fed source page instead of a static saved snapshot. Review status/reviewer identity participate in refresh cache identity. No WordPress post was created, approved, pinned or edited during these checks; future publication was not simulated by modifying live content.

## Calendar popup

A subsequent user report exposed a blank iframe: no src or data-embed-src had survived the original PHP/JS snippet export, and the popup was marked loaded immediately. The new on-demand controller assigns the existing green/dark booking URL on open, uses eager iframe loading after intent, waits for load before hiding the loader, reuses the frame on reopening and wires the original retry/error controls. No layout, metadata, booking settings or external account settings are changed. Popup-specific verification is recorded separately below after the final build.

## Release boundary

Only the separate inceptives-homepage-review Vercel Preview project may be deployed. Previous rollback: dpl_8ChPy85f6GN5DjWJuUPiGTPUCiRC, immutable https://inceptives-homepage-review-qd7321n7d.vercel.app. The original Vercel project, WordPress content, live domain and DNS remain untouched. No new page-speed or real-user Core Web Vitals result is claimed by this structural release.

Final calendar checks: controlled delayed-load/reopen tests passed at 390/768/1366 px. Real Calendly availability also passed at those widths, including selecting an available date and showing time slots. No time slot or booking was submitted. Consent was declined only in the isolated test browser. Compact evidence is tracked under audit/editable-release-2026-11-11. Final build and all 80 rendered parity checks passed again after the popup fix.

Deployment packaging correction: the first candidate (dpl_FBMjX8EYRFzhQy3zAQK4nsBaiQEx) compiled but failed during Vercel output deployment with ENOSPC, so its alias was never promoted. NFT analysis showed approximately 802 MB traced per representative page, including unrelated media packs and every uncompressed page. Production now uses an automatically generated, lossless 8.14 MB Brotli mirror of 168.70 MB of JSON/CSS; original authoring files remain editable. Page traces exclude original media packs (which are emitted as static outputs) and raw authoring data. All 80 production models match the original hashes after decompression. No paid build-machine upgrade was enabled.

The corrected production build passed. All 92 inspected page/API traces exclude media packs and raw page authoring files; the largest is 55,857,091 bytes, versus approximately 801,913,419 bytes for the representative uncorrected page trace. All 80 rendered content/SEO baselines passed again, and delayed calendar/reopen tests passed at all three widths. Source CSS whitespace is intentionally retained for byte/content parity; the scoped diff check passes when inherited trailing whitespace is excluded.

All 4,672 original indexed media URLs also passed local HTTP/byte-length checks after the packaging correction. This is additional to the 1,781 editable public asset aliases.

Corrected Vercel candidate dpl_GGKJenSgHNcLW7Kkfe7KrmpXSNar (Preview, runtime commit 5d1980611aed8fadbf4f3d8ff78148543dc395ab) reached READY. Deployed checks passed: 80/80 rendered page/SEO baselines; pin order/badge and 15/9/6 card layouts; seven Press Release articles and metadata; reviewer approval; real calendar dates and available time slots at 390/768/1366 px; 28 redirects, eight SEO templates and 230 sitemap URLs; all ten native SDK form journeys with mocked destinations. No bookings, new real leads, live-site edits or DNS changes were made.


11 November final batch: 81 exact editable models, 1990 aliases; production build/typecheck pass. Restored six services: 18 viewport cases, 78 internal destinations, all canonical/schema/sitemap checks and three deliberate 404 exclusions pass. Drawer six links reachable at 320/390/768/1024/1366. 80-page content/SEO parity passes after explicitly documented authorized nav/FAQ/security/schema normalization. Blog backend: 142 posts, 15 category requests pass; pins/reviewer and 7 Press Releases match approved WPE source. Eleven isolated native GHL/CallRail journeys pass; real Mobile Game verification recorded separately after staging alias update.
