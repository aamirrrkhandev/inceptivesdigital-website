import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import {loadEditableModels} from './editable-model-loader.mjs';
import {readJSON,hash,planHTMLImport,sourceHashes} from './page-html-utils.mjs';
const manifest=readJSON('content/page-html-index.json'),{getEditablePage}=loadEditableModels();let count=0;
for(const [path,entry]of Object.entries(manifest)){
 const folder='src/page-content/'+entry.folder,html=fs.readFileSync(entry.file,'utf8'),before=sourceHashes(folder);
 assert.equal(hash(html),entry.htmlHash);assert.deepEqual(before,entry.sourceHashes);
 const plan=planHTMLImport(folder,html,entry,getEditablePage(path));
 assert.ok(plan['content.json']);assert.deepEqual(sourceHashes(folder),before,'Planner must not write source files');count++;
}
const path='/mobile-app-development',entry=manifest[path],folder='src/page-content/'+entry.folder;
const original=fs.readFileSync(entry.file,'utf8'),$=cheerio.load(original,null,false);
$('h1').first().text('Temporary HTML planner test');$('main img').first().attr('alt','Temporary alt planner test');
const seoBefore=hash(fs.readFileSync(folder+'/seo.json')),schemaBefore=hash(fs.readFileSync(folder+'/schema.json'));
const plan=planHTMLImport(folder,$.html(),entry,getEditablePage(path));
assert.match(JSON.stringify(plan['content.json'].htmlMain),/Temporary HTML planner test/);
assert.ok(plan['assets.json'].images.some(i=>i.alt==='Temporary alt planner test'));
assert.equal(hash(fs.readFileSync(folder+'/seo.json')),seoBefore);assert.equal(hash(fs.readFileSync(folder+'/schema.json')),schemaBefore);
const contactEntry=manifest['/contact-us'],contactFolder='src/page-content/'+contactEntry.folder;
const invalid=cheerio.load(fs.readFileSync(contactEntry.file,'utf8'),null,false);assert.ok(invalid('form input[type=hidden]').length>0);invalid('form input[type=hidden]').first().attr('value','changed-qa');
assert.throws(()=>planHTMLImport(contactFolder,invalid.html(),contactEntry,getEditablePage('/contact-us')),/Form field/);
assert.throws(()=>planHTMLImport(folder,original+'<script>alert(1)</script>',entry,getEditablePage(path)),/inline scripts/);
console.log(JSON.stringify({validatedPages:count,contentAndAltEdit:'pass (in-memory only)',formContractGuard:'pass',scriptGuard:'pass',sourceAndSEOFiles:'unchanged',realSubmissions:0}));
