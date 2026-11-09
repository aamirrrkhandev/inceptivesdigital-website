import fs from "node:fs";
import * as cheerio from "cheerio";
const $ = cheerio.load(fs.readFileSync("audit/raw/home.html", "utf8"));
const quote = (v) => '"' + String(v ?? "").replaceAll('"', '""') + '"';
const csv = (path, headers, rows) =>
  fs.writeFileSync(
    path,
    [headers, ...rows].map((r) => r.map(quote).join(",")).join("\n") + "\n",
  );
const entries = [];
for (const [name, type] of [
  ["page", "page"],
  ["post", "post"],
  ["author", "archive"],
]) {
  const xml = fs.readFileSync("audit/raw/" + name + "-sitemap.xml", "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g))
    entries.push({ url: m[1], type });
}
const urls = [...new Map(entries.map((e) => [e.url, e])).values()];
csv(
  "URL_INVENTORY.csv",
  [
    "source_url",
    "target_path",
    "source_type",
    "classification",
    "http_status",
    "indexability_evidence",
    "migration_status",
  ],
  urls.map((e) => [
    e.url,
    new URL(e.url).pathname,
    e.type,
    e.type === "archive" ? "archive" : "candidate_indexable",
    e.url === "https://inceptivesdigital.com/" ? "200" : "NOT_YET_CHECKED",
    "Included in Yoast sitemap; per-URL robots/canonical verification pending",
    e.url === "https://inceptivesdigital.com/"
      ? "homepage_review"
      : "on_hold_for_homepage_review",
  ]),
);
csv(
  "SEO_BASELINE.csv",
  [
    "url",
    "status",
    "title",
    "description",
    "canonical",
    "robots",
    "h1",
    "headings_json",
    "og_json",
    "twitter_json",
    "schema_count",
  ],
  [
    [
      "https://inceptivesdigital.com/",
      200,
      $("title").text(),
      $("meta[name=description]").attr("content"),
      $("link[rel=canonical]").attr("href"),
      $("meta[name=robots]").attr("content"),
      $("h1")
        .map((i, e) => $(e).text())
        .get()
        .join(" | "),
      JSON.stringify(
        $("h1,h2,h3,h4,h5,h6")
          .map((i, e) => ({ tag: e.tagName, text: $(e).text().trim() }))
          .get(),
      ),
      JSON.stringify(
        $('meta[property^="og:"]')
          .map((i, e) => ({
            name: $(e).attr("property"),
            content: $(e).attr("content"),
          }))
          .get(),
      ),
      JSON.stringify(
        $('meta[name^="twitter:"]')
          .map((i, e) => ({
            name: $(e).attr("name"),
            content: $(e).attr("content"),
          }))
          .get(),
      ),
      $('script[type="application/ld+json"]').length,
    ],
  ],
);
csv("REDIRECT_MAP.csv", ["source_path", "target_path", "status", "reason"], []);
fs.writeFileSync(
  "MIGRATION_PROGRESS.md",
  `# Migration progress\n\nCurrent batch: homepage only. Other pages await user quality review.\n\n| URL | State | Verification / remaining work |\n| --- | --- | --- |\n${urls.map((e) => `| ${e.url} | ${e.url === "https://inceptivesdigital.com/" ? "Implemented; staging QA in progress" : "On hold"} | ${e.url === "https://inceptivesdigital.com/" ? "Build passes. Browser checks underway. Submission backend not connected. Visual parity not yet accepted." : "Sitemap-discovered; HTTP/SEO/content audit pending."} |`).join("\n")}\n`,
);
fs.writeFileSync(
  "DISCOVERY_REPORT.md",
  `# Initial discovery — 9 November 2026\n\nThis is an initial read-only audit for the homepage review gate, not the completed full-site discovery phase.\n\n## Scope evidence\nYoast sitemap index exposes page, post and author sitemaps. Discovered ${urls.length} unique sitemap URLs: ${entries.filter((x) => x.type === "page").length} page-sitemap entries, ${entries.filter((x) => x.type === "post").length} post-sitemap entries, ${entries.filter((x) => x.type === "archive").length} author archive entries. Sitemap membership does not prove indexability. Full link crawl, endpoint classification and per-URL status checks remain pending.\n\n## Verified access\nPublic live homepage, robots and sitemaps: HTTP 200. Existing Vercel public homepage: HTTP 200. Authenticated Vercel connector works for the Inceptives Digital team. Chrome's open WordPress dashboard and WP Engine production overview are authenticated. No WordPress/WP Engine modifications made. GitHub connector returns 404 for inceptivesdigital/inceptives; repository contents not accessible through that connection.\n\n## Existing deployment\nProject inceptives (prj_fQpnhPrg9tfKeRbUial9CDKvlqAH), team team_3cCCrG0KiZODE4SaDexnuEtu. Ready deployment dpl_G7oB8Jph6q6TWMjqwnXSys5Grrfa references main commit 947b4fdd2f857a6dc0975d59be9b7943de2e70d4. Vercel configuration lists the live host and staging subdomain among aliases; this is configuration evidence, not proof of current DNS routing. Do not deploy to this project. Existing app contains older public copy; live WordPress remains authoritative.\n\n## Source stack and integrations\nHello Elementor 3.4.9, Elementor 4.3.6, Elementor Pro 4.3.2, ElementsKit and Yoast Premium 28.8 identified in public HTML. SF Pro custom fonts, Swiper, nested tabs/accordions/carousels, embedded video, Calendly, Elementor form. GTM-5BV286F5, Google site verification and Leadsy are visible. WordPress dashboard also lists FluentSMTP and anti-spam integrations; destinations and private configuration have not been read. Analytics deliberately do not execute on review staging.\n\n## Homepage assets\n120 source asset mappings downloaded, including four MP4 videos. Original-byte SHA256 hashes and source URLs: audit/ASSET_MANIFEST.json. Responsive image derivatives generated from those originals. No replacement stock assets or placeholders. Source HTML/CSS retained under audit/raw for engineering reference, not served as page blobs or Elementor runtime.\n\n## Limitations\nFull-site crawl, plugin/configuration audit, redirect export, functional lead delivery, comprehensive visual regression and independent Lighthouse runs are pending. Some source FAQ questions and answers appear semantically mismatched; their exact copy is retained pending editorial approval. Source mobile and desktop hero copy differs and is preserved.\n`,
);
fs.writeFileSync(
  "FEATURE_INVENTORY.md",
  "# Homepage feature inventory\n\n| Feature | Implementation | Verification |\n| --- | --- | --- |\n| Header and dropdown navigation | React, hover/click and mobile menu | Browser QA pending final build |\n| Hero | Original MP4, green layer, exact device-specific copy and review badges | Actual video decodes |\n| Media strip | Original logos, CSS marquee, reduced motion support | Visual QA |\n| Service / industry / client / award grids | Reusable semantic cards with local images | No initial broken images |\n| Case studies | 8 original entries, controls, responsive original artwork | Next slide verified |\n| Testimonials | Original 5 quotes, scrollable list | Content retained |\n| Process | 6 tabs, keyboard arrows/Home/End | Design tab verified |\n| Scheduling | Actual Calendly destination, iframe and modal | No bookings submitted |\n| Success section | Original video and artwork; source counter values | 70 / 150 / 3 million read from source |\n| Blog | 4 current source posts | Links remain on live site for review |\n| FAQ | Original questions/answers, native disclosure | QA pending |\n| Contact | Exact fields and consent copy, browser validation | Staging-only; no external lead submission |\n| Footer | Menus, review images, addresses and links | QA pending |\n\nRemaining parity: exact megamenu group hierarchy, source autoplay carousel timings, testimonial auto-scroll, conversion popup behavior and full keyboard/accessibility audit.\n",
);
fs.writeFileSync(
  "PERFORMANCE_REPORT.md",
  "# Performance report — initial review\n\nWP Engine production overview reports Lighthouse performance 56 desktop and 40 mobile, refreshed 9 November 2026 at 04:25 Asia/Karachi. These are provider-reported scores, not independent runs by this migration. Other categories and test configuration were not available in that overview.\n\nThe new production build passes and prerenders the homepage. No migrated Lighthouse scores or real-user LCP/INP/CLS measurements have been established yet. No claim of a 90+ score or field Core Web Vitals pass is made.\n\nImplemented: static Server Component page, limited client interactions, local fonts, original local media, responsive image derivatives, image dimensions, deferred scheduling iframe and lazy noncritical images. Remaining: measurement under repeatable Lighthouse conditions, video loading budgets, third-party scheduling cost, responsive image sizing refinement and field monitoring after authorized launch.\n",
);
console.log("Inventory", urls.length);
