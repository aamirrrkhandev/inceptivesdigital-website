import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {chromium,expect} from '@playwright/test';
const base=process.env.TEST_BASE_URL||'http://localhost:3104';
const qualification=JSON.parse(await fs.readFile('content/lead-qualification.json','utf8'));
const baselineSeo=JSON.parse(execFileSync('git',['show','HEAD:src/page-content/mobile-app-development/seo.json']));
const originalLanding=load(execFileSync('git',['show','HEAD:public/custom-mobile-application-development/index.html']));
const results={pages:[],backend:[],realSubmissions:false};await fs.mkdir('audit/phase-b',{recursive:true});
const browser=await chromium.launch();
try{
 for(const path of ['/mobile-app-development','/custom-mobile-application-development'])for(const width of [390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:950},reducedMotion:'reduce'});await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
  const response=await page.goto(base+path,{waitUntil:'networkidle'});assert.equal(response.status(),200);
  const main=path==='/mobile-app-development';
  const title=main?baselineSeo.title:originalLanding('title').text();assert.equal(await page.title(),title);await expect(page.locator('h1')).toHaveCount(1);assert.equal((await page.locator('h1').innerText()).trim().replace(/\s+/g,' '),main?'Mobile App Development Company':originalLanding('h1').text().trim().replace(/\s+/g,' '));
  const generators=await page.locator('meta').evaluateAll(nodes=>nodes.filter(n=>(n.name||n.getAttribute('property'))==='generator'&&/elementor/i.test(n.content)).length);assert.equal(generators,0);
  if(main){
   await page.locator('[data-interactions-ready=true]').waitFor();const text=await page.locator('body').textContent();for(const bad of ['SSL/TLSS','Kirk Flaming','AI Servicess'])assert(!text.includes(bad));assert(text.includes('Kirk Fleming'));assert(text.includes('SSL/TLS'));
   const showcase=page.locator('.shared-case-study-showcase');await expect(showcase).toHaveCount(1);
   await expect(showcase).toContainText('Social Commerce Platform');await expect(showcase).toContainText('AI-Powered Veterinary Cost Transparency Platform');await expect(showcase).toContainText('Building the Infrastructure Behind a Global Dance Community');
   const uptime=page.locator('.migrated-counter').filter({hasText:'Infrastructure Uptime'});assert.equal(await uptime.locator('[data-to-value]').getAttribute('data-to-value'),'99.9');await expect(uptime).toContainText('99.9%');
   for(const name of ['DPS Airem','Pulse Check'])await expect(showcase).toContainText(name);
   const track=showcase.locator('.swiper-wrapper').first(),before=await track.getAttribute('style');
   await showcase.getByRole('button',{name:'Next case study',exact:true}).click();await expect.poll(()=>track.getAttribute('style')).not.toBe(before);
   await showcase.getByRole('button',{name:'Previous case study',exact:true}).click();
  }else{
   for(const form of await page.locator('.lead-form').all())for(const [name,options]of [['budget',qualification.budgetOptions],['timeline',qualification.timelineOptions]]){const select=form.locator(`select[name="${name}"]`);assert.equal(await select.evaluate(e=>e.required),true);assert.deepEqual(await select.locator('option').evaluateAll(nodes=>nodes.filter(n=>n.value).map(n=>n.value)),options);}
   assert.equal(await page.locator('.lead-form').count(),3);assert.equal(await page.locator('[name="cf-turnstile-response"]').count(),0);
  }
  await page.screenshot({path:`audit/phase-b/${main?'mobile-service':'custom-landing'}-${width}.png`,fullPage:false});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false);results.pages.push({path,width,http:200,titlePreserved:true,h1Preserved:true,generatorRemoved:true,qualificationFields:!main,overflow:false});await page.close();
 }
 for(let index=0;index<qualification.budgetOptions.length;index++){
  const form=new FormData();const values={form_id:'custom-mobile-hero-enquiry',source_path:'/custom-mobile-application-development',name:'Isolated QA',email:'qa@example.invalid',phone:'2025550199',budget:qualification.budgetOptions[index],timeline:qualification.timelineOptions[index%qualification.timelineOptions.length]};for(const [key,value]of Object.entries(values))form.set(key,value);
  const response=await fetch(base+'/api/standalone-enquiry',{method:'POST',headers:{Origin:base},body:form});assert.equal(response.status,200);const body=await response.json();assert.equal(body.delivery,'ghl-pending');results.backend.push({budget:values.budget,timeline:values.timeline,status:200,validationOnly:true});
 }
 const invalid=new FormData();for(const [key,value]of Object.entries({form_id:'custom-mobile-hero-enquiry',source_path:'/custom-mobile-application-development',name:'Isolated QA',email:'qa@example.invalid',phone:'2025550199',budget:'Invalid',timeline:qualification.timelineOptions[0]}))invalid.set(key,value);
 assert.equal((await fetch(base+'/api/standalone-enquiry',{method:'POST',headers:{Origin:base},body:invalid})).status,400);
}finally{await browser.close();await fs.writeFile('audit/phase-b/results.json',JSON.stringify(results,null,2));}
console.log(JSON.stringify({pages:results.pages.length,backendCases:results.backend.length,pass:true}));
