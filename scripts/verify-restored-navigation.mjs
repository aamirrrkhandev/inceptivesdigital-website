import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const base=process.argv[2]||'http://localhost:3100';
const groups=JSON.parse(fs.readFileSync('content/navigation-additions.json'));
const links=groups.flatMap(group=>group.links.map(link=>({...link,category:group.category})));
const browser=await chromium.launch();const results=[];fs.mkdirSync('audit/secondary-vercel/qa-release',{recursive:true});
try {
  for(const width of [320,390,768,1024,1366]) {
    const height=width===320?568:width===390?844:768;
    const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
    await page.goto(base+'/');await page.locator('[data-interactions-ready=true]').waitFor();
    const services=page.locator('.sitekit-navbar-nav > .sitekit-megamenu-has').first();
    if(width<1025){await page.locator('.sitekit-menu-hamburger').click();await services.locator(':scope > a').click();}
    else await services.locator(':scope > a').hover();
    const drawer=page.locator('.sitekit-menu-container').first();
    for(const link of links) {
      const anchor=services.locator(`[data-migration-nav-added="${link.path}"] a`);
      assert.equal(await anchor.count(),1,link.path);
      assert.equal(await anchor.getAttribute('href'),link.path);
      assert.equal(await anchor.getAttribute('data-service-category'),link.category);
      await anchor.scrollIntoViewIfNeeded();
      const rect=await anchor.boundingBox();assert.ok(rect.y>=0&&rect.y+rect.height<=height+2,link.path+' reachable');
      if(width===390&&link.path==='/mobile-game-development')await page.screenshot({path:'audit/secondary-vercel/qa-release/nav-mobile.png'});
    }
    if(width<1025) {
      const state=await drawer.evaluate(element=>({top:element.scrollTop,height:element.clientHeight,content:element.scrollHeight,overflow:getComputedStyle(element).overflowY,scrollbar:getComputedStyle(element).scrollbarWidth}));
      assert.ok(state.content>state.height&&state.top>0);assert.equal(state.overflow,'auto');assert.equal(state.scrollbar,'thin');
      assert.equal(await page.evaluate(()=>scrollY),0,'Background stays locked');
      const close=drawer.locator('.sitekit-menu-close').first();
      assert.ok(await close.evaluate(element=>{const rect=element.getBoundingClientRect();return element.contains(document.elementFromPoint(rect.x+rect.width/2,rect.y+rect.height/2));}),'Close stays above the scrolled service list');
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('migration-mobile-menu-open')),false);
    results.push({width,links:links.length,allReachable:true,backgroundLocked:width<1025,pass:true});await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(base+'/');await page.locator('[data-interactions-ready=true]').waitFor();await page.locator('.sitekit-menu-hamburger').click();const services=page.locator('.sitekit-navbar-nav > .sitekit-megamenu-has').first();await services.locator(':scope > a').click();await services.locator('[data-migration-nav-added="/mobile-game-development"] a').click();await page.waitForURL('**/mobile-game-development');assert.equal(await page.locator('h1').innerText(),'Mobile Game Development Company');await page.close();
}finally{await browser.close();fs.writeFileSync('audit/secondary-vercel/qa-release/navigation.json',JSON.stringify({base,results},null,2));}
console.log(JSON.stringify({base,results,gameNavigation:true}));
