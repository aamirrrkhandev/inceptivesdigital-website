# Homepage responsive header and footer

Source commit: `84aca2a4b35f3026f323efd558f21908e4d3899a`.
Candidate: https://inceptives-homepage-review-6gl25t32x.vercel.app/
Deployment: `dpl_5wrposTAupwBb6u7iCevgPbu9Htw` in the separate migration project.
Rollback: `dpl_gh9UBzkQcZUHoeUVAybVh5BecXwh`.

The homepage has a scoped responsive stylesheet. Boxed main/footer content is bounded at 1600px, the floating header at 1760px, and side gutters scale from 16px to 48px. Header columns allocate independent space for the logo, navigation, contact button and phone. Tablet layouts place the contact button before the hamburger; mobile layouts retain the logo and menu control. The logo no longer shrinks to an unreadable fraction of its original size.

Footer navigation uses a responsive grid, moving the brand block above link columns on narrower screens. Location cards use five, three, two or one column according to available space, with flexible widths and wrapping addresses. Copyright and legal links wrap without overlapping. The original text, links, assets, forms and interactions are retained.

Social icons have separate 44px circular touch targets and a 12px gap. The SVG icons, brand colours and destination links are preserved.

## Verification evidence

- `scripts/verify-homepage-shell.mjs`: 16 viewport widths from 320px to 2560px; header/footer/address overlap checks, logo legibility, container boundaries, social icon spacing, three mobile menu open/close checks and twelve desktop submenu boundary checks.
- `audit/browser/home-shell-content-parity.json`: unchanged homepage metadata and 148 headings, 164 footer links and 22 footer form fields.
- The header/footer candidate passed 28 banner checks and eight homepage slider verification groups. The slider test now explicitly waits for the requested active slide before image decoding, avoiding a check against the previous slide during a transition.
- Final deployed shell results are in `audit/browser/homepage-shell-verification.json`; screenshots are under `audit/browser/home-shell-*`.

CSS selectors are restricted to the homepage. WordPress, DNS and the original Vercel project were not changed. Full site visual acceptance and the previously documented media/performance/integration limitations remain separate work.
