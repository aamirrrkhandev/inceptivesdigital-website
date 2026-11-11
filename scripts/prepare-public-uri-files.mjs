import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('public');let copied=0;
function visit(folder) {
  if(!fs.existsSync(folder))return;
  for(const item of fs.readdirSync(folder,{withFileTypes:true})) {
    const file=path.join(folder,item.name);if(item.isDirectory()){visit(file);continue;}
    if(!/%[0-9a-f]{2}/i.test(item.name))continue;
    let decoded;try{decoded=decodeURIComponent(item.name);}catch{continue;}
    if(decoded===item.name)continue;
    if(/[<>:"/\\|?*\u0000-\u001f]/.test(decoded))throw Error('Unsupported encoded public filename: '+item.name);
    const destination=path.resolve(folder,decoded);
    if(!destination.startsWith(root+path.sep))throw Error('Decoded asset outside public');
    const bytes=fs.readFileSync(file);
    if(fs.existsSync(destination)){if(!fs.readFileSync(destination).equals(bytes))throw Error('Conflicting decoded asset: '+destination);}
    else {fs.copyFileSync(file,destination);copied++;}
  }
}
visit(path.join(root,'restored-assets'));visit(path.join(root,'assets'));
console.log(JSON.stringify({decodedPublicFileCopies:copied,originalFilesPreserved:true}));
