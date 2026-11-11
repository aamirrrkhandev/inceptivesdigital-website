# Editable page structure — approved scope

The user approved the App Router/page-content structure and separately approved restoring WordPress pin behavior and automatic Press Release category updates. Preserve current rendered layouts, text, headings, asset URLs and SEO values. No live WordPress, DNS, original Vercel or paid-resource changes.

## Inventory and approach

- Saved catalog: 241 paths. 74 are non-blog/non-archive static pages; five restored service pages have a separate renderer. Thank-you has its own existing custom template.
- WordPress-managed blog posts, author/category/date archives and Press Release content retain the existing API/source adapter. Do not create static per-post copies or replace WordPress as their editor.
- Static pages receive an explicit src/app route delegating to src/page-content/<slug>/Page.tsx, with editable content.json, seo.json, schema.json, styles.css, assets.json and page-specific section components. Shared rendering/header/footer retain their DOM and existing styles.
- Original assets referenced by these static pages: approximately 1,778 unique files / 180 MB. Materialize accessible public/assets files once, put shared files in shared, and give each page a manifest pointing to its actual files. Keep existing URL paths valid; do not copy shared binaries into every page directory.
- Maintain PAGE_DIRECTORY.csv for every URL and identify WordPress-managed routes explicitly.

## Acceptance

1. Capture every static page's current server-rendered DOM/SEO baseline before changing its route.
2. Verify exact reconstructed page data and matching DOM/SEO for every static page. Test editing a representative content/SEO/asset entry and adding a section in isolation, then restore the original values.
3. Verify build/types, 404/redirect behavior, representative responsive screenshots, shared navigation/forms and existing metadata/sitemap rules.
4. Compare live WordPress author approval, pinned cards/order/category filtering and all Press Release cards. The latest probe confirms reviewer Muhammad Usman matches on Austin, pin badge is missing in staging, and Press Release currently has seven matching cards but is snapshot-based.
5. Publish only a separate staging Preview after checks; retain dpl_8ChPy85f6GN5DjWJuUPiGTPUCiRC as rollback. Document exact files to edit and the complete public blog API reference.
