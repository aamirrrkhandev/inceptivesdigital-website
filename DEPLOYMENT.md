# Isolated staging deployment

Only the newly authorized project is used. Existing `inceptives`, its deployment, live domains, WP Engine and DNS remain unchanged.

- Team: `team_3cCCrG0KiZODE4SaDexnuEtu`
- New project: `inceptives-homepage-review`, `prj_LjTmsq5OcdsUnkV4tEKe2n4U6r0b`
- Deployment: `dpl_CYN9VBeZ5DTtbTCR9BdTJGkU5mBN`
- URL: https://inceptives-homepage-review-pndfuv8dv.vercel.app
- Source commit: `3b77dfd7ae94589d22d8275ff7671b14f2b1c8ca`, local branch `migration/homepage-review`
- Source upload: 195 files, SHA1-addressed uploads; no repository push or GitHub auto-deployment trigger
- Node: 24; install `npm ci`; build `npm run build`
- Indexing: blocked by metadata, HTTP header and robots.txt
- Protection: Vercel's default authentication retained
- Custom/live domains: none attached by this migration

Vercel assigned this new project's first deployment its `production` target. This is the isolated staging project's environment; no existing production deployment was overwritten or promoted. Do not attach the live domain or use this permanently noindex review configuration for a production cutover.

Build/readiness and browser validation results are appended after verification.

Verified: deployment READY, authenticated Chrome renders the actual homepage, correct title/canonical/noindex metadata, original MP4s decoding successfully, no observed broken images or horizontal overflow. Unauthenticated HTTP verification is blocked by the authentication redirect; no protection settings were weakened.
