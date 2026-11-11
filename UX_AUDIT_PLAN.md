# Site-wide UX audit — working plan

Scope: local application only; no deployment, Git push, DNS/account changes, or real lead submissions.

1. Discover every catalog route, current API post/category/author, App Router endpoint and shared component.
2. Snapshot protected content/SEO files before any audit fixes.
3. Crawl all discovered public page URLs at 320, 360, 375, 390, 414, 480, 768, 1024, 1280, 1440 and 1920px in Chromium. Record status, headings, assets, overflow, sticky-header overlap, slider scroll axes and console errors.
4. Exercise shared menus, tabs, accordions, each discovered carousel implementation, scheduling/contact dialogs, blog filters, browser history, keyboard and touch emulation. Isolate form transports and external side effects.
5. Reproduce reported failures, capture evidence, make minimal changes and repeat the failing scenarios.
6. Run TypeScript, meaningful existing security/form/model tests and a local production build if resources permit. Compare protected hashes and server metadata.
7. Publish a report with exact coverage, failures, exclusions and manual requirements. Device/browser simulations are not real-user interviews or physical-device testing.

Evidence directory: audit/ux-2026-11-11/. Do not treat interrupted runs as passes.
