# Page-owned assets and approved typography

Implementation date: 2026-11-11. Staging only; live WordPress, DNS and original Vercel project are unchanged.

## Asset migration

81 static editing models now use page-owned public asset paths, with shared logos/icons/badges/fonts retained under shared. All 17131 manifest references exist locally; 2176 optimized image/video associations were retained. Asset-normalized models match their pre-change models exactly, including text, layout, alt text, dimensions and metadata. Original /wp-content/uploads and /media aliases remain valid. Blogs and Press Release content continue through the WordPress API.

Use PAGE_ASSET_DIRECTORY.csv for page URL, original URL, rendered public URL, physical file, type and bytes. Edit src/page-content/<folder>/assets.json for paths/alt and public/assets/pages/<folder>/images or videos for page files. Keep srcSet variants in sync when replacing an image.

External badges were downloaded from their original public URLs. The BusinessFirms original returned HTTP 403 directly; its same public image was recovered through the wsrv image cache and validated as a PNG (1258×1395), then stored locally. No placeholders were introduced.

## Separately approved font/container change

Plus Jakarta Sans is self-hosted as a 27,348-byte variable WOFF2 (weights 200–800) with its OFL license. public/assets/styles/site-typography.css controls the global font, responsive heading sizes, menu/button sizing and 1600px maximum outer containers. Narrow screens retain fluid gutters; reading columns and cards are not expanded into full-width text blocks. Third-party cross-origin calendar internals retain their provider typography.

## Validation

- Local asset-model/SEO comparison: pass for 81 static models.
- Blog runtime publish/update/delete, parallel article coherence, compressed transport: pass.
- Form contracts: 157 checked; production form security: 12 isolated cases pass. These are not fresh real CRM submissions.
- TypeScript, deployed responsive/visual checks, calendar and preview release: pending release validation; final results will be appended.

The asset visual comparison deliberately disables only the separately approved typography stylesheet, to isolate resource rewiring. Final responsive QA runs with the approved font/container stylesheet enabled. Third-party integrations are isolated for screenshot checks and tested separately without booking meetings or sending chat messages.
