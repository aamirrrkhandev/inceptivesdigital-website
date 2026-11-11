# Editing the migrated site

Static service/company/case-study pages use Next.js App Router. Blogs, post approval, pinning and Press Release posts stay in WordPress. This reorganization keeps existing UI, URL paths, asset URLs and SEO values.

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

`ASSET_DIRECTORY.csv` maps original URLs to physical exported files and every page using them. Files used by multiple pages are stored once under `public/assets/shared`; each page's `assets.json` points to them. Page folders can therefore contain fewer images than the full page displays. Shared assets are not unused assets.

Put a new image under `public/assets/pages/<slug>/images`, then edit that image entry in `assets.json`:

```json
{"src":"/assets/pages/ios-app-development/images/new-hero.webp","alt":"Your accurate image description","width":900,"height":700}
```

Preserve the entry's existing `id` and `sourceUrl`. When `src` changes, stale original `srcSet` is removed automatically unless you supply a new custom `srcSet`. `file`/`publicUrl` document the exported original; `src` controls rendering. `backgrounds` entries control CSS/video URL replacements. Original URLs remain available through existing media routes. Existing image alt text is preserved, not automatically rewritten.

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

`node scripts/verify-editable-models.mjs` verifies the original exported data and assets and temporarily edits/restores representative fields. After intentional content edits, its original-source hash check will correctly flag differences; review them rather than overwriting your edits. `scripts/initialize-editable-pages.mjs` is a one-time migration utility and refuses an existing completed export. Never run it as part of a build. Refresh the URL directory with `node scripts/update-page-directory.mjs`.

Only the separate homepage-review Vercel project is authorized for staging. Keep live WordPress, DNS and the original Vercel project untouched. `/startup-product-development` remains intentionally unchanged with its previous 404 behavior.

Calendar popup loading is handled by `src/lib/calendar-popup.ts`; the shared green/dark Calendly URL is in `src/lib/calendly.ts`. It loads on the first scheduling click, keeps the loaded frame for reopening, and uses the existing loading/retry UI. No booking or Calendly account settings were changed.

Production builds create a lossless Brotli mirror of the editable JSON/CSS under ignored `content/editable-runtime`. Edit the original `src/page-content` files, not this generated mirror. `npm run build` regenerates it automatically; development reads your original files directly. Original media are emitted as static files and are excluded from page-function bundles.
