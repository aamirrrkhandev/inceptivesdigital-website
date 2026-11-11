import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.argv[2],browser=await chromium.launch(),results=[];
const cases=[...['06b8e60','12967acf','786fcf9'].map(id=>({url:'/contact-us',selector:`form:has(input[name=form_id][value="${id}"])`})),...['web-development','staff-augmentation','iot-app-development','virtual-reality-development','ar-app-development','mobile-game-development'].map(slug=>({url:'/'+slug,selector:'#website-'+(slug==='iot-app-development'?'iot-development':slug)+'-enquiry'})),{url:'/staff-augmentation',selector:'#website-staff-assessment',staff:true}];
try{for(const item of cases){
 const desktop=item.selector.includes('06b8e60')||item.selector.includes('12967acf');
 const context=await browser.newContext({viewport:{width:desktop?1366:375,height:950}});
 await context.addInitScript(()=>{window.turnstile={render(el){const input=document.createElement('input');input.type='hidden';input.name='cf-turnstile-response';input.value='ui-isolated';el.append(input);return 'mock';},reset(){},remove(){}};});
 await context.route(/challenges\.cloudflare\.com|googletagmanager\.com|leadsy\.ai|livechatinc\.com|callrail\.com|leadconnectorhq\.com|clients\.inceptivesdigital\.com/,r=>r.abort());
 let requests=0;await context.route('**/api/forms',r=>{requests++;return r.fulfill({json:{success:true,data:{message:'Isolated UI success'}}});});
 const page=await context.newPage();
 try{
  await page.goto(base+item.url);await page.locator('[data-interactions-ready=true]').first().waitFor();
  const form=page.locator(item.selector).first();await form.waitFor({state:'attached'});
  if(item.selector.includes('12967acf'))await page.getByText(/^Get In Touch$/i).filter({visible:true}).first().click();
  if(item.staff){
   await form.locator('input[name=team_roles]').first().check({force:true});
   const selects=form.locator('fieldset:visible select');for(let i=0;i<await selects.count();i++){
    const value=await selects.nth(i).locator('option').evaluateAll(options=>options.find(o=>!o.disabled&&o.value)?.value);await selects.nth(i).selectOption(value);
   }
   await form.getByRole('button',{name:/next/i}).click();
  }
  const fields=form.locator('input:not([type=hidden]):not([type=submit]),textarea,select');
  for(let i=0;i<await fields.count();i++){
   const field=fields.nth(i);if(!await field.isVisible()||!await field.isEnabled())continue;
   if(await field.getAttribute('name')==='team_roles')continue;
   const tag=await field.evaluate(el=>el.tagName),type=await field.getAttribute('type');
   if(tag==='SELECT'){const value=await field.locator('option').evaluateAll(options=>options.find(o=>!o.disabled&&o.value)?.value);if(value)await field.selectOption(value);}
   else if(type==='checkbox')await field.check();else if(type==='radio'){if(!await field.isChecked())await field.check();}
   else await field.fill(type==='email'?'qa@example.invalid':type==='tel'?'2125550100':'Isolated Migration QA');
  }
  await form.evaluate(el=>{if(!el.querySelector('[name="cf-turnstile-response"]')){const i=document.createElement('input');i.type='hidden';i.name='cf-turnstile-response';i.value='ui-isolated';el.append(i);}if(!el.reportValidity())throw Error('Form still invalid');el.dispatchEvent(new SubmitEvent('submit',{bubbles:true,cancelable:true}));});
  await page.waitForURL(base+'/thank-you',{timeout:20000});assert.equal(requests,1);
  results.push({...item,success:true,thankYou:true,transport:'mocked API; no real lead or CAPTCHA verification'});
 }catch(error){results.push({...item,error:error.message});await page.screenshot({path:'audit/page-assets/form-failure-'+item.url.slice(1)+'-'+results.length+'.png'});}
 await context.close();
}}finally{await browser.close();fs.writeFileSync('audit/page-assets/form-variants.json',JSON.stringify(results,null,2));}
console.log(JSON.stringify(results));assert.ok(results.every(r=>r.success));
