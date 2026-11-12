import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';
const urls=process.argv.slice(2).length?process.argv.slice(2):['https://inceptivesdigital.com/','https://inceptivesdigital.com/custom-mobile-application-development','https://app.inceptivesdigital.com/healthcare-landingPage'];
const browser=await chromium.launch();const context=await browser.newContext();const results=[];
for(const url of urls){
 const page=await context.newPage();const session=await context.newCDPSession(page);await session.send('Network.enable');
 const requests=[];session.on('Network.requestWillBeSent',event=>{if(/callrail|googletagmanager|fbevents|facebook.com\/tr|google-analytics.com\/g\/collect/.test(event.request.url))requests.push({url:event.request.url.split('?')[0],type:event.type,initiator:event.initiator.type,stack:event.initiator.stack?.callFrames?.slice(0,4).map(f=>({url:f.url,function:f.functionName}))});});
 let status,error;try{status=(await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000})).status();await page.waitForTimeout(18000);}catch(e){error=e.message;}
 const state=await page.evaluate(()=>({finalURL:location.href,scripts:[...document.scripts].filter(s=>/callrail|googletagmanager|fbevents/.test(s.src)).map(s=>({id:s.id,src:s.src})),phones:[...document.querySelectorAll('a[href^="tel:"]')].map(a=>({text:a.textContent.trim(),href:a.getAttribute('href')})),callrailReady:!!window.CallTrk})).catch(()=>null);
 results.push({url,status,error,...state,requests});await page.close();
}
await browser.close();await fs.mkdir('audit/callrail-dedup',{recursive:true});await fs.writeFile(process.env.AUDIT_OUTPUT||'audit/callrail-dedup/latest.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results.map(r=>({url:r.url,status:r.status,finalURL:r.finalURL,callrailReady:r.callrailReady,scripts:r.scripts,swapRequests:r.requests.filter(x=>x.url.endsWith('/swap.js')),phones:r.phones?.slice(0,4)})),null,2));
