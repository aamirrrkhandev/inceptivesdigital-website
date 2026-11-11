# Staging UX release — 12 November 2026

This release targets the existing inceptives-homepage-review Preview environment only. It does not authorize production promotion, DNS changes, WordPress changes or paid resource provisioning.

## Included changes

- Shared homepage case-study component replaces existing case-study sections. Homepage excludes DPS Airem and Pulse Check as requested; inner showcases retain eight cases. Unrelated pages do not gain a new section.
- Moving case tracks use zero gap and visible overflow; the outer viewport clips the track. Original inner-page CSS had clipped the moving track and introduced accumulating 10px offsets.
- Generic blog/image carousels account for their existing gaps, preserve native vertical scrolling, and support their arrow and touch controls.
- Popup testimonials restore the original three quotes, dot navigation, equal-height layout and desktop eight-second cycle. Reduced motion and focus are respected.
- Mobile drawer focus containment, accessible action anchors, form-specific field IDs and unnamed icon links are repaired.
- The AI cost estimator uses the original saved WordPress calculation rules and FAQ behavior.
- Responsive typography follows the latest approved settings: desktop inner H1 20px/600, widget H2 18–30px, H3 25px except the specifically requested 14px feature labels, paragraphs 14px, content icons 35px, circular arrows 40px, and Plus Jakarta Sans throughout.
- Common boxed content bounds include nested Fitness templates. Original banner background fitting is restored; the recent global cover override is removed.
- Page and component scrollbars are visually hidden without disabling native scrolling. Modal/drawer background containment remains intentional.
- Existing media optimization and editable per-page HTML workflow are included from the preceding local-only batch.

## Verified before this preview release

- Local optimized Next.js build and TypeScript succeeded.
- 60 slide-position/image checks across homepage, KMP, Android and IoT at 375/1440px passed after the track repair.
- Blog carousel fitting passed at 375/820/1440px; three popup quotes/dots/keyboard selection passed at tablet and desktop. The original mobile-only form layout hides the testimonial pane.
- Earlier audit covered 248 routes at eleven widths (2,728 route/viewport observations), plus an 82-route responsive regression and 405 control/landscape observations. Subsequent user-requested visual changes require the continuing final regression; these are not claimed as exhaustive verification of the release.
- Ten enquiry variants and the five-step iOS assessment passed isolated UI tests. Server contract/security tests passed (157 contracts and 12 security cases). No actual leads or bookings were sent in this audit.
- AI estimator: 144 original-rule comparisons and 18 browser price-band checks passed, including add-ons and FAQ keyboard/pointer behavior.
- 979 protected content/SEO/config files were unchanged during the initial audit fixes. Approved showcase replacements alter only their requested visible section content; SEO metadata/schema files remain unchanged.

## Continuing verification / known limitations

- Full post-release all-route, accessibility and cross-browser regression continues after this preview is available.
- The original ASO inline image at the unavailable legacy designcrepe.com address has not been recovered. No replacement or placeholder was invented. The Android Tools original was verified by SHA-256 and mapped to its local copy.
- /startup-product-development remains intentionally on hold.
- Existing color-contrast findings and an inline link inside a healthcare FAQ summary are recorded for review; protected branding/content were not changed to suppress the findings.
- Real GHL/CallRail delivery and external Calendly bookings are not claimed by isolated UI tests.
- Preview remains non-indexable. Production indexing configuration and live promotion are outside this preview-only release.

Detailed raw evidence remains local under audit/ux-2026-11-11. The complete audit report will distinguish final verified coverage from remaining manual requirements.
