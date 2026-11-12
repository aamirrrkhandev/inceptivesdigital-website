import {chromium} from '@playwright/test';
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1366,height:900}}),errors=[];
p.on('pageerror',e=>errors.push(e.message));
await p.route(/callrail\.com|leadconnectorhq\.com|clients\.inceptivesdigital\.com|facebook\.com|googletagmanager\.com|leadsy\.ai|livechatinc\.com/,r=>r.abort());
await p.goto('http://localhost:3104/mobile-app-development');await p.waitForTimeout(10000);
async function state(label){console.log(JSON.stringify({label,errors,outer:await p.locator('#schedulePopup').evaluate(e=>({classes:e.className,inert:e.inert,frame:e.querySelector('iframe').getBoundingClientRect().toJSON()})),frames:await Promise.all(p.frames().map(async f=>({url:f.url(),text:await f.locator('body').innerText({timeout:2000}).catch(()=>''),visibility:await f.locator('body').evaluate(e=>getComputedStyle(e).visibility).catch(()=>null)})))},null,2));}
await state('before');await p.getByRole('button',{name:'Schedule A Call',exact:true}).first().click();await p.waitForTimeout(8000);await state('after');await b.close();
