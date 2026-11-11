# Edit page content in VS Code

Open this project folder:
`C:\Users\Dell\Documents\ChatGPT\Usman (SEO)\inceptives-migration`

There are81 editable static `page.html` files. See HTML_PAGE_INDEX.md for every URL and folder. WordPress/API blogs, categories, authors and Press Release are deliberately excluded.

## Mobile App Development example

- Content: `src/page-content/mobile-app-development/page.html`
- Page images/videos: `public/assets/pages/mobile-app-development/`
- Page-specific CSS: `src/page-content/mobile-app-development/styles.css`
- Title, description, canonical and robots: `src/page-content/mobile-app-development/seo.json`
- JSON-LD: `src/page-content/mobile-app-development/schema.json`
- React section components: `src/page-content/mobile-app-development/components/`
- Site-wide responsive styling: `public/assets/styles/site-typography.css`

Homepage content is `src/page-content/home/page.html`. Its assets are in `public/assets/pages/home/`. Nested case-study folders follow the same URL structure.

## Apply an HTML edit locally

1. Edit the page’s `page.html` in VS Code and save it.
2. In the project terminal, validate the edit:
   `npm run pages:html:import -- --page /mobile-app-development --check`
3. Import it:
   `npm run pages:html:import -- --page /mobile-app-development`
4. Refresh `http://localhost:3100/mobile-app-development`.

If npm is not on PATH, use the equivalent:
`node scripts/import-page-html.mjs --page /mobile-app-development`

For the homepage use `--page /`. To import all changed HTML pages, omit `--page`.

This is an authoring format for the existing Next.js application, not a replacement static-HTML website. Editing a file alone does not change the running page until import. No Vercel build or deployment is triggered. The importer makes local backups in ignored `audit/html-edit-backups/` before updating content/layout/assets JSON; it never writes seo.json, schema.json or styles.css.

## Images and icons

Put a new image in the correct page’s images folder, then change its `<img src>` and descriptive `alt` in page.html. Example:

```html
<img src="/assets/pages/mobile-app-development/images/my-service-icon.webp"
     alt="Describe the icon’s meaning" width="45" height="45" />
```

Use actual dimensions/aspect ratio for photographs and illustrations. Existing srcset is automatically cleared when src changes and the old srcset was otherwise untouched. If you edit srcset yourself, update all variant URLs too. Do not delete old asset URLs used by external links or SEO records.

For a new client-logo tile, add `data-client-logo="true"` to the image. These tiles use consistent100×100px boxes; service/technology pictograms use45px on larger screens and30px on phones. Illustrations/photos keep their responsive sizes.

## Protect interactions

Keep existing IDs, class names and data-* attributes on forms, tabs, sliders, accordions and calculator sections. Form field names, hidden values, types and required flags are checked; incompatible changes are rejected. Add new interactive functionality through the page’s React components, not inline scripts in page.html. New static HTML sections can be added inside the existing main element.

Each file contains only that page’s main content. Shared header/footer remain in the shared React/layout system, so a page edit cannot accidentally replace navigation on all other pages. API-powered blog cards inside homepage templates remain API-powered.

Avoid editing the same content in page.html and content.json simultaneously: the importer rejects a stale HTML file when JSON changed after its export. `npm run pages:html:export` refreshes unchanged HTML files and preserves files with unsaved/import-pending edits.

Current release rule: local review only. Do not push/deploy until the user asks to release again.
