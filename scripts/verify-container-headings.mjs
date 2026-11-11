import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch();const rows=[];
try { const context=await browser.newContext();await context.route(/googletagmanager|google-analytics|callrail|leadconnectorhq|cloudflare|calendly|clients\.inceptivesdigital/,r=>r.abort());
const page=await context.newPage();
for(const path of ['/', '/mobile-app-development','/web-app-development-company','/food-delivery-app-development']) {
await page.goto('http://localhost:3100'+path,{waitUntil:'domcontentloaded',timeout:60000});
for(const width of [320,375,820,1440]) {await page.setViewportSize({width,height:900});await page.evaluate(()=>document.fonts.ready);
rows.push(await page.evaluate(({path,width})=>({path,width,overflow:document.documentElement.scrollWidth>innerWidth+1,collapsed:[...document.querySelectorAll('main .migrated-widget-heading')].filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().height>0&&e.getBoundingClientRect().width<20).map(e=>e.textContent.slice(0,60)),headings:[...document.querySelectorAll('main h2,main h3')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({text:e.textContent.trim().slice(0,50),width:Math.round(e.getBoundingClientRect().width),font:getComputedStyle(e).fontSize,overflow:e.scrollWidth>e.clientWidth+2}))}),{path,width}));
}
}
await page.evaluate(()=>{const x=document.createElement('div');x.style.width='350px';x.innerHTML='<div class="migrated-widget-heading"><h2>Digital Product Development</h2></div>';document.querySelector('main').append(x)});
const fixture=await page.locator('main .migrated-widget-heading').last().evaluate(e=>({width:e.clientWidth,font:getComputedStyle(e.querySelector('h2')).fontSize}));
const failures=rows.filter(r=>r.overflow||r.collapsed.length||r.headings.some(h=>h.overflow));fs.writeFileSync('audit/page-assets/container-headings.json',JSON.stringify({rows,fixture,failures},null,2));console.log(JSON.stringify({checks:rows.length,fixture,failures},null,2));
} finally {await browser.close()}
