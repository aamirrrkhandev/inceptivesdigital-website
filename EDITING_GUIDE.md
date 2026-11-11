# Editing the migrated site

Static service/company/case-study pages use Next.js App Router. Blogs, author/reviewer approval and Press Release posts stay in WordPress. Frontend pin ordering/badges remain disabled as requested. This reorganization keeps existing UI, URL paths, asset URLs and SEO values.

## Find a page

Use `PAGE_DIRECTORY.csv` to find every known URL and its files. Homepage is `src/page-content/home`; other static pages use their existing slug. Example:

```text
src/app/ios-app-development/page.tsx       route, delegates to Page.tsx
src/page-content/ios-app-development/
  Page.tsx                               page composition and Metadata API
  components/Sections.tsx                 section component mapping
  components/HeroSection.tsx              editable React section
  content.json                           original text, links and section tree
  layout.json                            shell and shared layout references
  seo.json                               title, description, canonical, social metadata
  schema.json                            JSON-LD array
  styles.css                             existing scoped styles
  assets.json                            image alt text, src, dimensions and local file locations
public/assets/pages/ios-app-development/
  images/
  videos/
```

Sections currently render their original structured nodes through the shared renderer. This preserves the DOM while giving each section a separate TSX entry point. You may replace a section's return value with your own JSX, or add a component in `Sections.tsx`/`Page.tsx`. New JSX must reuse the required styles, data attributes and accessible form/navigation contracts. To append a section inside the existing main container, pass it as children to the page's `Sections` component. The five restored older service pages use `components/Sections.tsx` with the existing secondary renderer.

For text or section order, edit the named entries under `content.json.sections` and the references under `content.json.main`. Keep shared references in `layout.json` unless intentionally changing the common shell. Shared renderer/header/footer components are under `src/components/shared`; shared node data are in `src/page-content/_shared/layout-nodes`. Changes to shared nodes affect all referencing pages.

## Images, video and alt text

`PAGE_ASSET_DIRECTORY.csv` maps each static page to its actual rendered asset URLs and physical files. Main illustrations and videos live in that page’s folder; shared logos, icons, badges and fonts remain under `public/assets/shared`. Each page’s `assets.json` is the editing manifest. `ASSET_DIRECTORY.csv` remains the original export inventory.

Put a new image under `public/assets/pages/<slug>/images`, then edit that image entry in `assets.json`:

```json
{"src":"/assets/pages/ios-app-development/images/new-hero.webp","alt":"Your accurate image description","width":900,"height":700}
```

Preserve the entry's existing `id` and `sourceUrl`. When replacing an image, update or clear its `srcSet` as well; migrated responsive variants now have explicit local paths. Otherwise the browser can keep choosing an older responsive file. `file`/`publicUrl` document the exported original; `src` controls rendering. `backgrounds` entries control CSS/video URL replacements. Original URLs remain available through existing media routes. Existing image alt text is preserved, not automatically rewritten.

## Metadata

Edit `seo.json` and `schema.json` per static page. The existing Metadata API, approved canonical normalization, redirects and preview noindex policy still apply. Do not put the staging hostname in production canonicals. No new SEO values were introduced by this reorganization.

Press Release has its own editable page wrapper, but its posts and default metadata refresh from WordPress. Its `seo.json.overrides` is empty and `schema.json.overrides` is null; leave them that way to inherit WordPress. Blog articles have no static content copies: edit them in WordPress, as described in `BLOG_API_REFERENCE.md`.

## Running and checking

The staging implementation is on the Git branch `migration/editable-pages` in `aamirrrkhandev/inceptivesdigital-website`. On another computer, clone that branch explicitly:

```sh
git clone --branch migration/editable-pages https://github.com/aamirrrkhandev/inceptivesdigital-website.git
cd inceptivesdigital-website
npm ci
```

Install Node.js 24 before installing dependencies; configure the private staging environment separately. Never copy secrets into source control. Run `npm run dev -- -p 3100`, `npm run typecheck`, then `npm run build` for release validation. Allow at least 6 GB of working disk space. The local QA build can use `MIGRATION_BUILD_DIR=.next-editable`.

`node scripts/verify-page-assets.mjs` verifies the asset-only migration against its saved pre-change fixture (local audit files required). `node scripts/verify-editable-models.mjs` verifies the historical original export and now intentionally reports asset URL changes; it also checks assets and temporarily edits/restores representative fields. After intentional content edits, its original-source hash check will correctly flag differences; review them rather than overwriting your edits. `scripts/initialize-editable-pages.mjs` is a one-time migration utility and refuses an existing completed export. Never run it as part of a build. Refresh the URL directory with `node scripts/update-page-directory.mjs`.

Only the separate homepage-review Vercel project is authorized for staging. Keep live WordPress, DNS and the original Vercel project untouched. `/startup-product-development` remains intentionally unchanged with its previous 404 behavior.

Calendar popup loading is handled by `src/lib/calendar-popup.ts`; the shared green/dark Calendly URL is in `src/lib/calendly.ts`. It loads on the first scheduling click, keeps the loaded frame for reopening, and uses the existing loading/retry UI. No booking or Calendly account settings were changed.

Production builds create a lossless Brotli mirror of the editable JSON/CSS under ignored `content/editable-runtime`. Edit the original `src/page-content` files, not this generated mirror. `npm run build` regenerates it automatically; development reads your original files directly. Original media are emitted as static files and are excluded from page-function bundles.


## Final standalone non-blog data

Non-blog forms use content/form-contracts.json. iOS scoring is editable in src/lib/ios-assessment-rules.ts; run node scripts/verify-ios-rules.mjs against original-PHP fixtures before changing behavior. Original snippets are preserved as references in content/reference/wordpress-snippets and are not executed by Next.js. Non-blog search content is in content/site-search-index.json; blog search stays live through the approved REST backend. Non-blog sitemap base is content/non-blog-sitemap-snapshot.json. Full final source references are retained locally in audit/final-wordpress-2026-11-11-reference.zip. See FINAL_WORDPRESS_SNAPSHOT.md.

## Mobile App Development: quick editing roadmap
Open `src/page-content/mobile-app-development/` in VS Code. `src/app/mobile-app-development/page.tsx` is only the URL route/delegation file; it is not where the page text lives.

- Text/links/buttons: `content.json`, named entries under `sections`. For the banner, use `sections.Hero`; search for `Mobile App Development Company` or `Your App Only Gets One Chance to Earn a Place on Someone's Phone`. Edit the relevant string, preserving JSON keys, classes, IDs and tags.
- Section order: references in `content.json.main` (for example `{"section":"Hero"}`).
- Hero React structure: `components/HeroSection.tsx`. It currently delegates the structured node to the shared renderer; text is therefore not hardcoded in the TSX wrapper.
- Other section components and their mapping: `components/Sections.tsx`. Page composition: `Page.tsx`. A new React section can be imported in Page.tsx and passed as a child of `<Sections page={page}>` to append it within the existing main container. Avoid changing shared header/footer components for a page-only edit.
- CSS: `styles.css`. Original structural references: `layout.json`.
- Images: place new files in `public/assets/pages/mobile-app-development/images/`; videos in its `videos/` folder. Update `assets.json` src/alt/dimensions while keeping existing asset IDs and sourceUrl references.
- Metadata: `seo.json` title/description/canonical/social values. JSON-LD: `schema.json`. Updating a content heading does not automatically rewrite the meta title.
- Static service-page changes require a new build/deployment on Vercel; dev mode previews source edits directly. Production/start mode needs a rebuild. WordPress blog changes remain runtime/API driven and do not need Git pushes.

Do not edit `.next*`, `node_modules` or generated `content/editable-runtime`. Full URL-to-file map: `PAGE_DIRECTORY.csv`.
