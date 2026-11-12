import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';
const base=process.env.TEST_BASE_URL||'https://inceptivesdigital.com';
const catalog=JSON.parse(await fs.readFile('content/page-catalog-index.json','utf8'));
const secondary=JSON.parse(await fs.readFile('content/secondary-pages.json','utf8'));
const paths=process.argv.slice(2).length?process.argv.slice(2):[...new Set(['/',...Object.keys(catalog).filter(p=>!p.startsWith('/blog/')&&!p.startsWith('/press-release/')),...Object.keys(secondary),'/custom-mobile-application-development'])];
const browser=await chromium.launch();const results=[];
const fixture='<html><body><h1>Select a Date &amp; Time</h1><button>Available date</button></body></html>';
async function worker(){for(;;){const path=paths.shift();if(path===undefined)return;const page=await browser.newPage({viewport:{width:Number(process.env.VIEWPORT_WIDTH||1366),height:950},reducedMotion:'reduce'});try{
 await page.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='calendly.com')return r.fulfill({contentType:'text/html',body:fixture});if(u.origin!==base||['image','media','font'].includes(r.request().resourceType()))return r.abort();return r.continue();});
 const response=await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:35000});
 if(response.status()!==200){results.push({path,status:response.status()});continue;}
 await page.locator('[data-interactions-ready=true]').first().waitFor({timeout:10000}).catch(()=>{});
 // Deterministic click checks should not race the site's smooth scroll animation.
 await page.addStyleTag({content:'html,body,* {scroll-behavior:auto !important}'});
 const ctas=await page.locator('.migrated-button,[data-open-modal],.id-schedule-booking-link').evaluateAll(nodes=>nodes.map((n,i)=>({index:i,text:n.textContent.trim().replace(/\s+/g,' '),href:n.getAttribute('href'),inForm:!!n.closest('form'),contact:!!n.closest('.getintouch'),schedule:/schedule.*call/i.test(n.textContent),visible:!!n.getClientRects().length})).filter(n=>n.visible&&!n.inForm));
 const checks=[];
 for(const cta of ctas){
  if(/^(?:\d+\+?\s*(?:years|apps)|4\.7.*clutch)$/i.test(cta.text)){checks.push({...cta,kind:'statistic-label'});continue;}
  const href=cta.href||'';
  if(href&&!href.startsWith('#')&&new URL(href,base+path).pathname.replace(/\/$/,'')!==path.replace(/\/$/,'')){checks.push({...cta,kind:'link',destination:new URL(href,base+path).href});continue;}
  const target=page.locator('.migrated-button,[data-open-modal],.id-schedule-booking-link').nth(cta.index);
  if(!await target.isVisible())continue;
  const before={url:page.url(),y:await page.evaluate(()=>scrollY)};
  await target.click({timeout:4000});
  const state=await page.evaluate(()=>({url:location.href,y:scrollY,popup:document.querySelector('#schedulePopup.is-open')?'calendar':document.querySelector('#id-contact-popup.is-open')?'contact':document.querySelector('#lead-modal[aria-hidden="false"]')?'landing-contact':null}));
  checks.push({...cta,...state,kind:state.popup?'popup':state.url!==before.url?'navigation':Math.abs(state.y-before.y)>50?'scroll':'no-observed-action'});
  if(state.popup)await page.keyboard.press('Escape');
  if(page.url()!==before.url){await page.goto(before.url,{waitUntil:'domcontentloaded'});await page.locator('[data-interactions-ready=true]').first().waitFor({timeout:10000}).catch(()=>{});}
 }
 results.push({path,status:response.status(),checks});console.log(JSON.stringify({path,ctas:checks.length,suspects:checks.filter(c=>c.kind==='no-observed-action').map(c=>c.text)}));
 }catch(e){results.push({path,error:e.message});console.log(JSON.stringify({path,error:e.message}));}finally{await page.close();}}}
try{await Promise.all([worker(),worker(),worker()]);}finally{await browser.close();await fs.mkdir('audit/cta-calendar',{recursive:true});await fs.writeFile('audit/cta-calendar/'+(process.env.AUDIT_LABEL||'site-baseline')+'.json',JSON.stringify({base,calendarMocked:true,externalTrackingBlocked:true,realSubmissions:false,results},null,2));}
