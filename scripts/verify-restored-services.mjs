import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import {chromium} from '@playwright/test';
const base=process.argv[2]||'http://localhost:3100';
const paths=Object.keys(JSON.parse(fs.readFileSync('content/secondary-pages.json')));
const browser=await chromium.launch();const results=[],destinations=new Map();
fs.mkdirSync('audit/secondary-vercel/qa-release',{recursive:true});
try {
  for(const path of paths) {
    const source=JSON.parse(fs.readFileSync('audit/secondary-vercel/'+path.slice(1)+'-faqs.json'));
    const seo=JSON.parse(fs.readFileSync('src/page-content/'+path.slice(1)+'/seo.json'));
    const response=await fetch(base+path,{redirect:'manual'});assert.equal(response.status,200,path);
    const $=cheerio.load(await response.text());assert.equal($('h1').length,1);
    assert.equal($('title').text(),seo.title);assert.equal($('meta[name=description]').attr('content'),seo.description);
    assert.equal($('link[rel=canonical]').attr('href'),'https://inceptivesdigital.com'+path);
    assert.match($('meta[name=robots]').attr('content'),/noindex/);
    const schemas=$('script[type="application/ld+json"]').toArray().flatMap(element=>{const data=JSON.parse($(element).text());return data['@graph']||[data];});
    for(const type of ['Organization','WebSite','WebPage','BreadcrumbList','Service','FAQPage'])assert.ok(schemas.some(schema=>[].concat(schema['@type']).includes(type)),path+' '+type);
    const service=schemas.find(schema=>schema['@type']==='Service');assert.equal(service.url,'https://inceptivesdigital.com'+path);
    const faq=schemas.find(schema=>schema['@type']==='FAQPage');assert.equal(faq.mainEntity.length,source.length);
    assert.deepEqual(faq.mainEntity.map(item=>item.name),source.map(item=>item.question.replace(/\s+/g,' ').trim()));
    $('.migrated-page a[href]').each((_,element)=>{
      const href=$(element).attr('href');if(!href||href.startsWith('#')||/^(tel:|mailto:|javascript:)/.test(href))return;
      const url=new URL(href,'https://inceptivesdigital.com');if(!['inceptivesdigital.com','www.inceptivesdigital.com',new URL(base).hostname].includes(url.hostname))return;
      if(!destinations.has(url.pathname))destinations.set(url.pathname,{path:url.pathname,label:$(element).text().trim(),from:path});
    });
    for(const width of [390,768,1366]) {
      const page=await browser.newPage({viewport:{width,height:950},reducedMotion:'reduce'});
      await page.route(/callrail\.com|leadconnectorhq\.com|clients\.inceptivesdigital\.com|challenges\.cloudflare\.com/,route=>route.abort());
      await page.route('https://calendly.com/**',route=>route.fulfill({contentType:'text/html',body:'<html><body>Calendar transport fixture</body></html>'}));
      await page.goto(base+path);await page.locator('[data-secondary-ready=true]').waitFor();
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path+' overflow '+width);
      assert.equal(await page.locator('.secondary-service-page iframe[src*="recaptcha"]').count(),0);
      const controls=page.locator('.secondary-service-page [data-secondary-faq]');assert.equal(await controls.count(),source.length);
      if(width!==768)for(let i=0;i<source.length;i++) {
        const control=controls.nth(i);await control.click();assert.equal(await control.getAttribute('aria-expanded'),'true');
        const panel=page.locator('#'+await control.getAttribute('aria-controls'));await panel.waitFor({state:'visible'});
        assert.equal((await panel.innerText()).replace(/\s+/g,' ').trim(),source[i].text.replace(/\s+/g,' ').trim());
        await control.press('Enter');assert.equal(await control.getAttribute('aria-expanded'),'false');
      }
      if(path==='/mobile-game-development') {
        const widget=page.locator('[data-secondary-tabs="process-0"]');const tabs=widget.locator('[data-secondary-tab]');assert.equal(await tabs.count(),5);
        for(let i=0;i<5;i++){await tabs.nth(i).click();await widget.locator(`[data-secondary-panel="${i}"]`).waitFor({state:'visible'});assert.equal(await tabs.nth(i).getAttribute('aria-selected'),'true');}
        const swipe=page.getByRole('button',{name:'Next blog articles'});await swipe.scrollIntoViewIfNeeded();
        const carousel=page.locator('[data-secondary-carousel]').filter({has:page.locator('a[href*="/blog/"]')}).last();
        if(await carousel.count()){const before=await carousel.evaluate(element=>element.scrollLeft);await swipe.click();await page.waitForTimeout(100);assert.ok(await carousel.evaluate(element=>element.scrollLeft)!==before,'Blog carousel moves');}
      }
      if(width!==768) {
        const quote=page.locator('.secondary-service-page button').filter({hasText:/^(?:get a free quote|get a call now!?|start your project)$/i}).first();
        if(await quote.count()){await quote.click();await page.locator('#id-contact-popup').waitFor({state:'visible'});await page.keyboard.press('Escape');await page.locator('#id-contact-popup').waitFor({state:'hidden'});}
        const schedule=page.locator('.secondary-service-page button,.secondary-service-page a').filter({hasText:/^Schedule A Call$/i}).first();
        if(await schedule.count()){await schedule.click();await page.locator('#schedulePopup').waitFor({state:'visible'});assert.match(await page.locator('#schedulePopup iframe').getAttribute('src'),/^https:\/\/calendly\.com\//);await page.keyboard.press('Escape');await page.locator('#schedulePopup').waitFor({state:'hidden'});}
      }
      await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`audit/secondary-vercel/qa-release/${path.slice(1)}-${width}.png`});
      results.push({path,width,faqs:source.length,canonicalSchema:true,noOverflow:true,pass:true});await page.close();
    }
  }
}finally{await browser.close();}
const links=[],failures=[];let cursor=0;const values=[...destinations.values()];
await Promise.all(Array.from({length:6},async()=>{while(cursor<values.length){const item=values[cursor++];const response=await fetch(base+item.path,{redirect:'manual'});const location=response.headers.get('location');const held=item.path==='/startup-product-development';links.push({...item,status:response.status,location,held});if(held)assert.equal(response.status,404);else if(!(response.status===200||[301,308].includes(response.status)))failures.push({...item,status:response.status});if(location){const target=new URL(location,base);const final=await fetch(base+target.pathname,{redirect:'manual'});if(final.status!==200)failures.push({...item,location,finalStatus:final.status});}}}));
const sitemap=await(await fetch(base+'/sitemap.xml')).text();for(const path of paths)assert.ok(sitemap.includes('https://inceptivesdigital.com'+path+'</loc>'));
for(const path of ['/startup-product-development','/our-process','/our-manifesto']){assert.equal((await fetch(base+path,{redirect:'manual'})).status,404);assert.ok(!sitemap.includes('https://inceptivesdigital.com'+path+'</loc>'));}
fs.writeFileSync('audit/secondary-vercel/qa-release/services.json',JSON.stringify({base,results,links,sitemapAllSix:true,excluded404:true,failures},null,2));console.log(JSON.stringify({base,views:results.length,checkedLinks:links.length,allSixInSitemap:true,excluded404:true,failures,pass:!failures.length}));

assert.equal(failures.length,0,"Broken internal links require correction");
