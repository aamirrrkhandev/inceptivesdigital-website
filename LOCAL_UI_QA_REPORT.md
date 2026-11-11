# Local UI verification —11 November2026

Preview: http://localhost:3100

-81 static pages,324 viewport checks: no header/title overlap, no page-wide horizontal overflow; inner H1 and paragraph settings correct; client-logo boxes consistent; no monitored React key/invalid-property/hydration errors in that sweep.
- Web-app tabs:15 checks passed; labels wrap fully and selected content updates.
- Healthcare feature tabs:24 checks passed across320/375/519/820/1024/1440; selected tabs stay visible; panels and End-key navigation work.
- Turnstile wrapper:12 layout-fixture checks passed across320–1440, supported flexible size when300px fits, compact fallback below300px. No CAPTCHA bypass or actual lead was involved.
- Source models/assets/metadata:81 pages,17131 references,2176 original optimized associations pass. Original files remain available.
- Editable HTML:81 files validated; in-memory content/alt edit and guard tests pass; unchanged import reports81 unchanged pages and writes no content/SEO files.

Limits: this is scoped geometry/UI/resource validation, not a claim of exhaustive pixel-perfect or full accessibility certification. Last local font/video optimization has targeted follow-up checks recorded separately. Production form delivery and improved live performance remain pending; see MIGRATION_PROGRESS.md. No cloud release followed the local-only instruction.
