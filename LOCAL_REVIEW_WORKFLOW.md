# Local review workflow

Effective 11 November 2026: the user requested local builds and previews only because repeated Vercel builds incur extra cost. Do not create Vercel deployments or push Git commits until the user explicitly requests a release again. A push may trigger an automatic deployment.

Preview: http://localhost:3100

Start from this repository in PowerShell:

```powershell
$env:MIGRATION_BUILD_DIR = '.next-local-review'
node scripts/prepare-page-catalog.mjs
node node_modules/next/dist/bin/next dev --webpack -p 3100
```

Local dev startup compiles pages on first request; its first-request timings are not production performance measurements. Real CRM and Turnstile verification must be distinguished from mocked local UI tests. Existing live form QA authorization remains, but no new cloud build is authorized.

Pending local changes after deployed commit 758dc2d include faster variants for 59 embedded-raster SVG copies, correctly excluding brand-logo alt text from pictogram sizing, and recognizing appicon filenames. Originals remain present; original src, headings, metadata and schema content are retained. New variants are selected through responsive image srcset. Source asset verification passed all81 pages and17131 references before the final icon-filename adjustment; rerun typecheck and browser checks before any eventual release.
