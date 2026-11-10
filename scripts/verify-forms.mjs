import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {scopeDocumentTypes} from './selector-scope.mjs';
const base=process.argv[2]||'http://localhost:3102';
const evidence=[];
assert.equal(scopeDocumentTypes('.id-article-body .elementor-widget-html'),'.id-article-body .elementor-widget-html');
assert.equal(scopeDocumentTypes('body.home > main, html .x'),':where(.migrated-page).home > main, :where(.migrated-page) .x');
evidence.push({check:'Document selector conversion preserves class names',pass:true});
const browser=await chromium.launch();
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 // This is an isolated UI test. All valid submissions are intercepted; no email is sent.
 await context.addInitScript(()=>{
  window.turnstile={render(container){const input=document.createElement('input');input.type='hidden';input.name='cf-turnstile-response';input.value='ui-test-only';container.append(input);return 'ui-test-widget'},remove(){},reset(){}};
 });
 await context.route('https://challenges.cloudflare.com/**',route=>route.abort());
 let contactRequests=0;
 await context.route('**/api/forms',async route=>{contactRequests++;assert.match(route.request().postData(),/source_path/);await route.fulfill({json:{success:false,data:{message:'Test service unavailable.'}},status:422})});
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/services',{waitUntil:'domcontentloaded'});
 await page.locator('[data-interactions-ready=true]').waitFor();
 const form=page.locator('footer [data-contact-form]').first();
 assert.equal(await form.locator('input[name=form_id]').count(),1);
 assert.equal(await form.locator('[data-contact-verification]').count(),1);
 await form.scrollIntoViewIfNeeded();
 await form.locator('input[name="cf-turnstile-response"]').waitFor({state:'attached'});
 await form.locator('button[type=submit]').click();
 assert.equal(contactRequests,0);
 await form.locator('input[type=email]').fill('ui-test@example.invalid');
 await form.locator('input[type=tel]').fill('5550101234');
 await form.locator('input[required][type=checkbox]').evaluateAll(inputs=>inputs.forEach(input=>input.checked=true));
 await form.locator('button[type=submit]').click();
 await page.getByText('Test service unavailable.',{exact:true}).waitFor();
 assert.equal(contactRequests,1);
 assert.equal(await form.locator('button[type=submit]').isDisabled(),false);
 evidence.push({check:'Contact hidden IDs, CAPTCHA space, required validation and failed-server response',pass:true,transport:'mocked; no delivery claim'});
 let assessmentRequests=0;
 await context.route('**/api/ios-assessment',route=>{assessmentRequests++;return assessmentRequests===1?route.fulfill({status:502,json:{success:false,data:{message:'Test assessment unavailable.'}}}):route.fulfill({json:{success:true,data:{result:{title:'UI test recommendation',body:'Mock result only.',native:90,cross:60,reasons:['UI test reason']},answers:{platform:'iPhone only',hardware:'No, standard cloud features only',performance:'High performance',timeline:'6+ months'},contact:{name:'UI test',email:'ui-test@example.invalid',company:'Test'}}}})});
 await page.goto(base+'/ios-app-development',{waitUntil:'domcontentloaded'});
 const quiz=page.locator('#id-ios-348952');
 await page.locator('#id-ios-348952[data-ios-ready=true]').waitFor();
 await quiz.locator('.id-ios-next').click();
 await quiz.getByText('Please select an answer to continue.',{exact:true}).waitFor();
 for(let i=0;i<4;i++){
  const choice=quiz.locator('.id-ios-step:visible input[type=radio]').first();await choice.check();await quiz.locator('.id-ios-next').click();
  await quiz.locator('.id-ios-back').click();assert.equal(await quiz.locator('.id-ios-step:visible input[type=radio]').first().isChecked(),true);await quiz.locator('.id-ios-next').click();
 }
 await quiz.locator('.id-ios-send').click();assert.equal(assessmentRequests,0);
 await quiz.locator('input[name=full_name]').fill('UI test');await quiz.locator('input[name=email]').fill('ui-test@example.invalid');
 await quiz.locator('input[required][type=checkbox]').evaluateAll(inputs=>inputs.forEach(input=>input.checked=true));
 await quiz.locator('.id-ios-send').click();await quiz.getByText('Test assessment unavailable.',{exact:true}).waitFor();assert.equal(await quiz.locator('.id-ios-send').isDisabled(),false);
 await quiz.locator('.id-ios-send').click();await quiz.getByText('UI test recommendation',{exact:true}).waitFor();assert.equal(assessmentRequests,2);
 const download=page.waitForEvent('download');await quiz.locator('.id-ios-download').click();const file=await download;
 fs.mkdirSync('audit/forms-2026-11-10',{recursive:true});await file.saveAs('audit/forms-2026-11-10/ui-test-assessment.pdf');
 const pdf=fs.readFileSync('audit/forms-2026-11-10/ui-test-assessment.pdf');assert.equal(pdf.subarray(0,8).toString(),'%PDF-1.4');assert.ok(pdf.includes(Buffer.from('UI test')));
 evidence.push({check:'Five quiz steps, radio validation, server-result display and branded PDF',pass:true,transport:'mocked authoritative response; no scoring/delivery claim',pdfBytes:pdf.length});
 assert.equal(errors.length,0,errors.join('\n'));
 await context.close();
 for(const endpoint of ['/api/forms','/api/ios-assessment']){
  const denied=await fetch(base+endpoint,{method:'POST',body:new URLSearchParams()});assert.equal(denied.status,403);
  const invalid=await fetch(base+endpoint,{method:'POST',headers:{Origin:base},body:new URLSearchParams()});assert.equal(invalid.status,400);
 }
 evidence.push({check:'API rejects foreign/missing origins and incomplete payloads without delivery',pass:true});
}finally{await browser.close();fs.mkdirSync('audit/forms-2026-11-10',{recursive:true});fs.writeFileSync('audit/forms-2026-11-10/verification.json',JSON.stringify(evidence,null,2))}
console.log(JSON.stringify(evidence));
