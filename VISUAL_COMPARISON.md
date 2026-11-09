# Homepage visual comparison

Source: current live WordPress homepage. Target: isolated Next.js homepage review. No redesign or substitute imagery was commissioned.

- `audit/source-desktop.png` and `audit/source-mobile.png`: live source captures.
- `audit/target-desktop.png`, `audit/target-tablet.png`, `audit/target-mobile.png`: local production-build captures at 1440, 820 and 390 CSS-pixel viewport widths.
- `audit/staging-hero.png`: actual deployed page in the user's authenticated Chrome session.
- `audit/comparison-desktop.png` / `comparison-mobile.png`: source left, target right.
- `audit/visual-diff-*.png` and JSON: raw diagnostic differences; not a passing fidelity score.

The source desktop full-page capture includes horizontal overflow from its animated content. Comparison crops to the shared content width. Videos, animated marquees, source lazy-loaded content and section-height differences are unmasked, so the raw pixel difference is unsuitable as a quality acceptance threshold. The captures establish review evidence; repeatable masked section-level regression and user sign-off remain pending.

Manually checked: matching black/green identity, original hero MP4 and green layer, source typography, responsive source hero variants, real original logos/artwork, service and industry cards, case-study imagery, tabs, FAQs, contact fields and footer. Tablet/mobile/desktop checks found no target horizontal overflow.

Known incomplete interaction parity is documented in QA_REPORT.md. Homepage status remains a review candidate. No other page is marked migrated or accepted.
