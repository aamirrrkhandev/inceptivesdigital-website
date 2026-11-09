import fs from 'node:fs';
const routes=JSON.parse(fs.readFileSync('content/routes.json'));
const repairs=JSON.parse(fs.readFileSync('audit/full/MEDIA_REPAIRS.json'));
const blocked=new Set(repairs.filter(r=>r.status==='needs_original_asset').map(r=>new URL(r.page).pathname));
const lines=['# Migration progress','',
'Current staging: https://inceptives-homepage-review.vercel.app/ (deployment dpl_7wqe8Dgq7Ryv9YmnP3PbEedc7nrU).',
'','The user authorized all-page implementation after the homepage review. There are 241 implemented page/archive paths. Implementation does not mean acceptance: full content, visual, SEO, accessibility, functionality, and performance verification remain incomplete. Forms currently validate in staging without sending leads. Ten original images in three posts remain unavailable. No production cutover is authorized.',
'','## Latest CSS review','',
'The green banner panel position, desktop submenu overflow, mobile submenu expansion, and tablet heading overlap were corrected. The deployed preview passed 27 navigation checks at six widths and four homepage banner checks. The original 24.5MB video is served as a static file at its preserved URL. Live WordPress, the original Vercel project, and DNS were unchanged.',
'','## Per-page acceptance tracker','','| Path | Implementation | Latest verification / remaining work |','| --- | --- | --- |'];
for(const route of routes){let note='Full visual, content, functionality, accessibility, and performance acceptance pending.';if(blocked.has(route.path))note='Blocked: original blog images unavailable; remaining acceptance pending.';if(route.path==='/')note='Banner: four widths passed on deployed preview. Remaining full-page and integration acceptance pending.';if(route.path==='/ios-app-development')note='Navigation: 27 checks passed on deployed preview. Remaining page acceptance pending.';lines.push(`| ${route.path} | Staging implementation present | ${note} |`)}
lines.push('','Source URL status and classification: URL_INVENTORY.csv. SEO checks: SEO_COMPARISON.csv. Known source errors remain documented; no unrelated homepage redirects were introduced.');
fs.writeFileSync('MIGRATION_PROGRESS.md',lines.join('\n')+'\n');
