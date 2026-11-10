# Migration plan — homepage review gate

User narrowed the active batch to the homepage. Build and publish it in a separate Vercel staging project, then stop for quality review before implementing other pages. Existing Vercel project, WP Engine, live domain, DNS and source repository remain untouched.

1. Read live homepage, sitemaps and available account/project state. Save source and desktop/mobile references.
2. Extract exact content and download the real images, fonts and all four discovered videos. No placeholders or Elementor runtime.
3. Build shared navigation, footer, homepage sections, carousel, tabs, FAQs and scheduling in Next.js App Router with TypeScript.
4. Verify production build, assets, metadata, responsive layouts and interactive controls. Document incomplete parity honestly.
5. Create an isolated staging project in the verified Inceptives Digital team. Deploy source there only, with noindex headers and robots rules. Open the preview for review.
6. Await homepage review before the remaining page-template batches.

## Later CMS decision
Versioned structured content is appropriate for this review. For the full migration compare headless WordPress (familiar editing, ongoing WordPress maintenance), a dedicated headless CMS (structured editorial workflows, extra integration and possible cost), and repository content (simple deployment, developer-led editing). No CMS removal or paid service is authorized.
# Approved batch: SEO parity and WordPress publishing (10 November 2026)

Implement the reviewed redirect/canonical/sitemap, social metadata, heading and production indexing fixes. Refresh current blog, individual published posts and saved author/category archives on a 30-second request-driven cache interval, with saved-content fallback during upstream failures. Do not modify WordPress or install a webhook. Keep preview indexing blocked. Verify live source versus target, tab behavior, forms and responsive shell before updating the separate staging alias.

User additionally approved restoring `/web-development`, `/staff-augmentation`, `/iot-development`, `/virtual-reality-development` and `/ar-app-development` from `https://inceptives.vercel.app/`, since their WordPress paths return 404. Preserve source copy/assets in structured section data, isolate their styles, reuse the current shared shell, rebuild interactive controls and route enquiries through the current WordPress contract. Leave `/startup-product-development` unchanged. Original Vercel project remains read-only.

