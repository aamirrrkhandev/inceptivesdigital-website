# Initial discovery — 9 November 2026

This is an initial read-only audit for the homepage review gate, not the completed full-site discovery phase.

## Scope evidence
Yoast sitemap index exposes page, post and author sitemaps. Discovered 223 unique sitemap URLs: 76 page-sitemap entries, 139 post-sitemap entries, 8 author archive entries. Sitemap membership does not prove indexability. Full link crawl, endpoint classification and per-URL status checks remain pending.

## Verified access
Public live homepage, robots and sitemaps: HTTP 200. Existing Vercel public homepage: HTTP 200. Authenticated Vercel connector works for the Inceptives Digital team. Chrome's open WordPress dashboard and WP Engine production overview are authenticated. No WordPress/WP Engine modifications made. GitHub connector returns 404 for inceptivesdigital/inceptives; repository contents not accessible through that connection.

## Existing deployment
Project inceptives (prj_fQpnhPrg9tfKeRbUial9CDKvlqAH), team team_3cCCrG0KiZODE4SaDexnuEtu. Ready deployment dpl_G7oB8Jph6q6TWMjqwnXSys5Grrfa references main commit 947b4fdd2f857a6dc0975d59be9b7943de2e70d4. Vercel configuration lists the live host and staging subdomain among aliases; this is configuration evidence, not proof of current DNS routing. Do not deploy to this project. Existing app contains older public copy; live WordPress remains authoritative.

## Source stack and integrations
Hello Elementor 3.4.9, Elementor 4.3.6, Elementor Pro 4.3.2, ElementsKit and Yoast Premium 28.8 identified in public HTML. SF Pro custom fonts, Swiper, nested tabs/accordions/carousels, embedded video, Calendly, Elementor form. GTM-5BV286F5, Google site verification and Leadsy are visible. WordPress dashboard also lists FluentSMTP and anti-spam integrations; destinations and private configuration have not been read. Analytics deliberately do not execute on review staging.

## Homepage assets
120 source asset mappings downloaded, including four MP4 videos. Original-byte SHA256 hashes and source URLs: audit/ASSET_MANIFEST.json. Responsive image derivatives generated from those originals. No replacement stock assets or placeholders. Source HTML/CSS retained under audit/raw for engineering reference, not served as page blobs or Elementor runtime.

## Limitations
Full-site crawl, plugin/configuration audit, redirect export, functional lead delivery, comprehensive visual regression and independent Lighthouse runs are pending. Some source FAQ questions and answers appear semantically mismatched; their exact copy is retained pending editorial approval. Source mobile and desktop hero copy differs and is preserved.
