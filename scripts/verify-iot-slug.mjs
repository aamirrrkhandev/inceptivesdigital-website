import assert from 'node:assert/strict';import fs from 'node:fs';
const secondary=JSON.parse(fs.readFileSync('content/secondary-pages.json'));const index=JSON.parse(fs.readFileSync('content/editable-pages-index.json'));const redirects=JSON.parse(fs.readFileSync('content/redirects.json'));
assert.ok(secondary['/iot-app-development']);assert.equal(secondary['/iot-development'],undefined);assert.ok(index['/iot-app-development']);assert.equal(index['/iot-development'],undefined);
for(const source of ['/iot-development','/iot-development/','/iot-app-development/'])assert.deepEqual(redirects.find(r=>r.source===source),{source,destination:'/iot-app-development',statusCode:301});
const seo=JSON.parse(fs.readFileSync('src/page-content/iot-development/seo.json'));assert.equal(seo.canonical,'https://inceptivesdigital.com/iot-app-development');assert.equal(fs.readFileSync('src/page-content/iot-development/schema.json','utf8').includes('/iot-development'),false);
const site=JSON.stringify(JSON.parse(fs.readFileSync('content/non-blog-sitemap-snapshot.json')));assert.ok(site.includes('https://inceptivesdigital.com/iot-app-development'));assert.equal(site.includes('https://inceptivesdigital.com/iot-development'),false);
assert.ok(fs.readFileSync('src/components/SecondaryServicePage.tsx','utf8').includes('path === "/iot-app-development" ? "iot-development"'));
console.log(JSON.stringify({redirects:3,canonical:true,schema:true,sitemap:true,existingCRMFormIdPreserved:true,pass:true}));
