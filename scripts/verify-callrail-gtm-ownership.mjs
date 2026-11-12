import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
try {
 const page=await browser.newPage();
 await page.route('https://inceptivesdigital.com/**',async route=>{
  const url=new URL(route.request().url());
  if(url.pathname.startsWith('/assets/standalone-forms/'))return route.fulfill({contentType:'text/javascript',body:await fs.readFile('public'+url.pathname,'utf8')});
  return route.fulfill({contentType:'text/html',body:'<!doctype html><title>Isolated SDK ownership QA</title>'});
 });
 await page.goto('https://inceptivesdigital.com/');
 const result=await page.evaluate(async()=>{
  const sdk=await import('/assets/standalone-forms/callrail.js');
  const first=sdk.loadCallRail(),second=sdk.loadCallRail();
  const shared=first===second;
  const unavailable=await first;
  const retry=sdk.loadCallRail();
  setTimeout(()=>{window.CallTrk={swap(){}};},80);
  const ready=await retry;
  return {shared,unavailable,ready,injectedScripts:[...document.scripts].filter(s=>s.src.includes('callrail.com')).length,status:document.documentElement.dataset.callrail};
 });
 assert.deepEqual(result,{shared:true,unavailable:false,ready:true,injectedScripts:0,status:'ready'});
 console.log(JSON.stringify(result));
 await fs.writeFile('audit/callrail-dedup/ownership-verification.json',JSON.stringify(result,null,2));
}finally{await browser.close();}
