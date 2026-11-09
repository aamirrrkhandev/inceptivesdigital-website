import {chromium} from 'playwright';import fs from 'node:fs';
const base=process.argv[2]||'http://localhost:3101';const browser=await chromium.launch();const results=[];
for(const width of [1920,1440,1280,1024,820,390]){const p=await browser.newPage({viewport:{width,height:1000}});await p.goto(base+'/ios-app-development',{waitUntil:'domcontentloaded'});await p.locator('[data-interactions-ready="true"]').waitFor();
 const toggles=p.locator('.sitekit-menu-toggler');
 if(width<1025){const toggle=await toggles.evaluateAll(es=>es.findIndex(e=>e.getBoundingClientRect().width>0));await toggles.nth(toggle).click();}
 for(const name of ['Services','Industries','Locations','Company']){
  const link=p.locator('.ekit-menu-nav-link').filter({hasText:new RegExp('^'+name+'$')}).first();
  if(width>=1025)await link.hover();else await link.click();
  await p.waitForTimeout(250);
  const id=await link.getAttribute('aria-controls');const panel=p.locator('#'+id);
  const m=await panel.evaluate(e=>({rect:e.getBoundingClientRect().toJSON(),visible:getComputedStyle(e).visibility,opacity:getComputedStyle(e).opacity,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth}));
  results.push({width,name,expanded:await link.getAttribute('aria-expanded'),...m,pass:m.rect.height>1&&m.rect.left>=-1&&m.rect.right<=width+1&&m.visible==='visible'&&Number(m.opacity)>0.9});
  if(name==='Services')await p.screenshot({path:`audit/browser/menu-fixed-${width}.png`});
  if(width<1025)await link.click();
 }
 if(width>=1025){const link=p.getByRole('link',{name:'Services',exact:true}).first();await link.focus();await link.press('ArrowDown');const focus=await p.evaluate(()=>document.activeElement?.closest('.sitekit-megamenu-panel')!==null);await p.keyboard.press('Escape');const expanded=await link.getAttribute('aria-expanded');results.push({width,name:'keyboard',pass:focus&&expanded==='false'});}
 await p.close();}
await browser.close();fs.writeFileSync('audit/browser/navigation-verification.json',JSON.stringify(results,null,2));console.log(JSON.stringify({checks:results.length,failures:results.filter(r=>!r.pass)},null,2));if(results.some(r=>!r.pass))process.exitCode=1;
