# Legacy Vercel parity batch

Reference: https://inceptives.vercel.app, deployment `dpl_G7oB8Jph6q6TWMjqwnXSys5Grrfa`, source commit `947b4fdd2f857a6dc0975d59be9b7943de2e70d4`. The original deployment/project is inspected read-only. Its source file tree/repository was unavailable, but its build route table and public pages were accessible.

The deployment route table verifies the route inventory beyond crawlable navigation. Existing current-WordPress pages retain their newer content and layout. Blog/author/category content remains WordPress/API-managed. Legacy API endpoints are not copied over the current secure GHL/WordPress integration.

Retain and link these restored pages:

| Page | Navbar category |
| --- | --- |
| /web-development | Application Development / By Type |
| /mobile-game-development | Application Development / By Type |
| /ar-app-development | Application Development / By Type |
| /virtual-reality-development | Application Development / By Type |
| /iot-development | Artificial Intelligence / Automation |
| /staff-augmentation | Digital Product Development / By Engagement |

Mobile Game is newly extracted. Its previous unrelated redirect to a blog cost article is removed so the service page can return 200. The legacy legal slug `/terms-and-condition` uses a single 301 to the existing current `/terms-and-conditions` page; current legal copy is preserved. Existing Web App's approved equivalent redirect is retained.

Our Process and Our Manifesto were found as unlinked routes, but the user explicitly excluded them. Startup Product Development remains on hold. These three paths must return 404, stay out of navigation and remain absent from the sitemap.

All six retained services receive canonical production URLs without trailing slashes and a current-brand Organization/WebSite/WebPage/BreadcrumbList/Service/FAQPage graph. FAQ answers and Mobile Game process states are captured through the original controls. This fixes answers that were absent from the old initial React HTML, without summarizing their text. Legacy captured Google challenge iframes are removed in favor of the already configured, server-verified staging Turnstile integration.

The shared header adapter adds these links on static pages and API-fed blogs. A single touch-scrollable mobile/tablet drawer exposes the complete service list with a thin scrollbar. Desktop panel scrolling remains bounded to the open dropdown.

Acceptance: source text/assets, all FAQ/process/carousel/CTA controls, form validation/tracking/thank-you, all link destinations, metadata/canonicals/schema, sitemap/robots, responsive menu reachability and exclusions. Compare the original 80 pages' unchanged content/SEO while separately validating the user-approved navigation, restored FAQ/security controls and six schema updates. Keep prior staging as rollback; deploy only the separate staging project.

Some excluded-page asset copies remain in local folders because automatic approval review rejected their move/empty-folder cleanup as “blocked by policy.” Excluded page components/routes were removed; those page asset folders are ignored by Git. No alternate cleanup method was used.
