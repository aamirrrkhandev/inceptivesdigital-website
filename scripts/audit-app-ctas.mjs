import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';
const browser=await chromium.launch(),results=[];
try{for(const slug of ['healthcare','flutter','react-native','ios','android','app-development']){
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.route(/callrail\.com|googletagmanager\.com|leadconnectorhq\.com|clients\.inceptivesdigital\.com|facebook\.com/,r=>r.abort());
 const response=await page.goto('https://app.inceptivesdigital.com/'+slug+'-landingPage',{waitUntil:'domcontentloaded'});
 await page.locator('h1:visible').first().waitFor();
 await page.locator('#root a:visible,#root button:visible').first().waitFor({timeout:15000});
 await page.waitForLoadState('networkidle');
 await page.locator('#root form:visible').first().waitFor({timeout:15000});
 const selector='a,button';
 const ctas=await page.locator(selector).evaluateAll(nodes=>nodes.map((n,i)=>({index:i,text:n.textContent.trim().replace(/\s+/g,' '),href:n.getAttribute('href'),inForm:!!n.closest('form'),visible:!!n.getClientRects().length})).filter(n=>n.visible&&!n.inForm&&/schedule|book\b|quote|consultation|start.*project|talk.*expert|get in touch|contact us|estimate|free.*call/i.test(n.text)));
 const checks=[];
 for(const cta of ctas){if(cta.href&&!cta.href.startsWith('#')){checks.push({...cta,kind:'link'});continue;}
  const target=page.locator(selector).nth(cta.index);if(!await target.isVisible())continue;await target.scrollIntoViewIfNeeded();
  const before=await page.evaluate(()=>({y:scrollY,forms:[...document.forms].filter(f=>f.getClientRects().length).length}));
  await target.click();await page.waitForTimeout(200);
  const after=await page.evaluate(()=>({y:scrollY,forms:[...document.forms].filter(f=>f.getClientRects().length).length,dialogs:document.querySelectorAll('[role="dialog"],dialog[open],.form-modal-overlay').length,fields:document.querySelectorAll('.form-modal-overlay input').length,iframes:[...document.querySelectorAll('iframe')].map(f=>f.src)}));
  checks.push({...cta,before,after});
  // Reset between CTA tasks so a preceding modal cannot cover the next CTA.
  await page.goto('https://app.inceptivesdigital.com/'+slug+'-landingPage');await page.locator('#root form:visible').first().waitFor();await page.waitForLoadState('networkidle');
 }
 results.push({slug,status:response.status(),checks});console.log(JSON.stringify({slug,ctas:checks.length}));await page.close();
}}finally{await browser.close();await fs.writeFile('audit/cta-calendar/app-landing-ctas.json',JSON.stringify(results,null,2));}
