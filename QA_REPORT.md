# Homepage review QA

This is a staging review candidate, not a completed full migration or a declaration of pixel-perfect parity.

| Check | Result | Evidence |
| --- | --- | --- |
| Production build and TypeScript | PASS | Next.js production build prerenders `/` |
| HTTP, SEO, original asset paths and extracted homepage copy | PASS | 233 checks in `audit/http-local.json` |
| Mobile, 390 × 844 | PASS for overflow/basic rendering | `audit/target-mobile.png` |
| Tablet, 820 × 1180 | PASS for overflow/basic rendering | `audit/target-tablet.png` |
| Desktop, 1440 × 1000 | PASS for overflow/basic rendering | `audit/target-desktop.png` |
| Media decoding | PASS locally | Four unique MP4 originals reach readyState 4; no video errors |
| Mobile menu and service dropdown | PASS | Browser interaction expands 34 service links |
| Case carousel | PASS | Next changes visible case to Pulse Check |
| Tabs and keyboard navigation | PASS | Design click then ArrowRight shows Precision Engineering |
| FAQ disclosure | PASS | Second native disclosure opens |
| Scheduling modal | PASS for open/close | Dialog visibly opens and closes; booking was not submitted |
| Contact form staging validation | PASS | Filled form reports message was not sent; no live lead dispatch |
| Independent Lighthouse / field CWV | NOT RUN | See PERFORMANCE_REPORT.md |
| Full accessibility / cross-browser audit | NOT COMPLETE | Current browser checks are Chromium only |
| Visual fidelity sign-off | PENDING USER REVIEW | Source and target captures retained; dynamic videos/carousels make unmasked pixel totals misleading |
| Playwright spec runner | NOT RUN in this session | Equivalent CUA browser interactions executed; runnable specs supplied |
| Verified production lead delivery | BLOCKED FOR THIS BATCH | Original handler is WordPress/Elementor. Dedicated migration destination must be agreed and verified later |

Known review differences: carousel currently advances through explicit controls; original automatic timing is not yet replicated. Testimonial list supports manual scrolling; original continuous auto-scroll remains to be matched. Header service groups retain source labels and links with accessible React controls, but exact hover dimensions still need visual review. Some FAQ source copy is inconsistent with its questions and has been preserved.

All other routes remain unimplemented and are explicitly on hold for the homepage quality gate. Navigation links to those routes intentionally stay on the live website for this review. No DNS, live WordPress, existing Vercel project or production routing changes were made.
