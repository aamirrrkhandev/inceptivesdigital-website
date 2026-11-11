import fs from 'node:fs';
import {loadEditableModels} from './editable-model-loader.mjs';
import {pageHTML,readJSON,sourceHashes,hash} from './page-html-utils.mjs';
const {getEditablePage,editablePageIndex}=loadEditableModels(),file='content/page-html-index.json';
const manifest=fs.existsSync(file)?readJSON(file):{};let written=0,kept=0;
for(const [path,entry]of Object.entries(editablePageIndex)){
 if(entry.type==='wordpress')continue;
 const folder='src/page-content/'+entry.folder,target=folder+'/page.html';
 if(fs.existsSync(target)&&(!manifest[path]||hash(fs.readFileSync(target))!==manifest[path].htmlHash)){kept++;continue;}
 const html=await pageHTML(getEditablePage(path),entry.type);
 fs.writeFileSync(target,html);
 manifest[path]={folder:entry.folder,file:target,type:entry.type,htmlHash:hash(html),sourceHashes:sourceHashes(folder)};written++;
}
fs.writeFileSync(file,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({exported:written,preservedEditedFiles:kept,blogs:'WordPress API; not exported'}));
