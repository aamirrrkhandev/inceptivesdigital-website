import {chromium} from 'playwright';import fs from 'node:fs';
const base=process.argv[2]||'http://localhost:3101';const browser=await chromium.launch();const results=[];
try {for(const width of [1920,1440,820,390]){const page=await browser.newPage({viewport:{width,height:1000}});
try{await page.goto(base,{waitUntil:'domcontentloaded'});await page.locator('[data-interactions-ready="true"]').waitFor();await page.evaluate(()=>document.fonts.ready);
const result=await page.evaluate(()=>{
 const panel=document.querySelector('.green-position');const rect=panel.getBoundingClientRect();
 const heading=[...document.querySelectorAll('main h1,main h2')].find(e=>e.getBoundingClientRect().height>0);const h=heading?.getBoundingClientRect();
 const header=document.querySelector('.header-containers')?.getBoundingClientRect();
 return {width:innerWidth,panel:rect.toJSON(),heading:h?.toJSON(),header:header?.toJSON(),overflow:document.documentElement.scrollWidth>innerWidth+2,
 pass:!!h&&h.top>=(header?.bottom||0)&&h.right<=innerWidth+1&&h.left>=0&&(innerWidth<1025||rect.top>(header?.bottom||0))};
});results.push(result);await page.screenshot({path:`audit/browser/banner-fixed-${width}.png`});
}finally{await page.close()}}
}finally{await browser.close()}
fs.writeFileSync('audit/browser/banner-verification.json',JSON.stringify(results,null,2));console.log(JSON.stringify({checks:results.length,failures:results.filter(r=>!r.pass||r.overflow)},null,2));if(results.some(r=>!r.pass||r.overflow))process.exitCode=1;
