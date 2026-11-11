# Current work plan — first-visit performance and complete QA

1. First-visit article: overlap source HTML and fresh REST read only when cold; verify body/title/SEO/image/reviewer coherence and refetch on mismatch. Fix lazy LCP hero and deliver responsive variants. Native cold-browser and real PageSpeed web measurements before/after; keep preview noindex.
2. Integration parity: restore original GTM container (GA4 and LiveChat are inside it) and Leadsy; retain verified GHL/CallRail, original Calendly and Google verification metadata. Verify browser loads, distinguishing code/HTTP acknowledgements from account-side delivery evidence.
3. Sitemaps: `/sitemap.xml` index; separate `/page-sitemap.xml`, `/post-sitemap.xml`, `/author-sitemap.xml`; current posts/lastmod via WordPress, source index rules and exact canonical URLs retained.
4. Whole-site QA: current URL inventory; HTTP/metadata/schema/redirect/robots/sitemap checks; responsive desktop/tablet/mobile rendering, overflow, clipping, broken visible images and representative navigation/interactive/form validations. Fix confirmed safe CSS regressions; record inherited/source issues and anything requiring a design decision.
5. Publish only to separate staging and push code/evidence to migration/editable-pages. Live WordPress/original Vercel project/DNS remain untouched. Editing roadmap is in EDITING_GUIDE.md, Mobile App section.
