# Custom-domain incident — 11 November 2026

Vercel alias inspection found the custom domain on deployment dpl_CYN9VBeZ5DTtbTCR9BdTJGkU5mBN, while the working staging hostname served dpl_9mM4QsJEk2WAchdeqGDLChFN9b6d. They were not equivalent releases.

Vercel domain configuration reported `misconfigured: true`, conflicting apex A record `141.193.213.11`, and another A record `216.150.1.1`. Nameservers remain external (registrar-servers.com). The user was asked to remove the obsolete conflicting record and retain the exact recommended Vercel records. No DNS records were changed by the agent.

Assigning the known-working deployment to the custom domain failed with `cert_missing`. Certificate issuance failed with `http_pretest_domain_not_resolving_to_vercel_error`. Therefore clearing caches alone cannot resolve this incident. Await correct DNS resolution before retrying certificate issuance and alias alignment.

The local resolver also returned NXDOMAIN during checks. Live-domain visual and SSL validation remain pending; do not report production as fixed.

Latest CSS change caps laptop outer containers at 1440px below 1600px viewport width and larger desktop containers at 1600px, with existing fluid gutters. Original favicon and mobile drawer corrections are included in the pending release. Content, URL paths and SEO values were not changed by these CSS fixes.
