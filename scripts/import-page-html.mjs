import fs from 'node:fs';
import {loadEditableModels} from './editable-model-loader.mjs';
import {readJSON,sourceHashes,hash,planHTMLImport} from './page-html-utils.mjs';
const manifestFile='content/page-html-index.json',manifest=readJSON(manifestFile),args=process.argv.slice(2);
const selected=args.includes('--page')?args[args.indexOf('--page')+1]:undefined,check=args.includes('--check');
if(selected&&!manifest[selected])throw Error('Unknown static page. Blogs are managed through the WordPress API.');
const {getEditablePage}=loadEditableModels(),plans=[];let unchanged=0;
for(const [path,entry]of Object.entries(manifest)){
 if(selected&&path!==selected)continue;
 const html=fs.readFileSync(entry.file,'utf8');
 if(hash(html)===entry.htmlHash){unchanged++;continue;}
 const folder='src/page-content/'+entry.folder;
 if(JSON.stringify(sourceHashes(folder))!==JSON.stringify(entry.sourceHashes))throw Error(path+': JSON source changed since HTML export. Resolve the competing edits before importing.');
 const updates=planHTMLImport(folder,html,entry,getEditablePage(path));plans.push({path,entry,folder,html,updates});
}
if(!check)for(const {path,entry,folder,html,updates}of plans){
 const backup='audit/html-edit-backups/'+Date.now()+'/'+entry.folder;fs.mkdirSync(backup,{recursive:true});
 for(const [name,value]of Object.entries(updates)){fs.copyFileSync(folder+'/'+name,backup+'/'+name);fs.writeFileSync(folder+'/'+name,JSON.stringify(value,null,2)+'\n');}
 manifest[path]={...entry,htmlHash:hash(html),sourceHashes:sourceHashes(folder)};
}
if(!check&&plans.length)fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({mode:check?'validation only':'import',changedPages:plans.map(p=>p.path),unchanged,seoFiles:'untouched',backup:plans.length&&!check?'audit/html-edit-backups/':null,next:'Refresh localhost:3100 to see imported changes. No deployment or build is triggered.'}));
