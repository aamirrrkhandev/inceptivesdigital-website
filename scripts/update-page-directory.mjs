import fs from 'node:fs';
import {sourceFetch} from './source-fetch.mjs';
const index=JSON.parse(fs.readFileSync('content/editable-pages-index.json'));
const routes=JSON.parse(fs.readFileSync('content/routes.json'));
const paths=new Set([...routes.map(route=>route.path),...Object.keys(index)]);
const auditVersion=Date.now();
for(let page=1;page<=100;page++) {
  const response=await sourceFetch(`https://nextincep.wpenginepowered.com/wp-json/wp/v2/posts?status=publish&per_page=100&page=${page}&_fields=link&_migration_inventory=${auditVersion}`);
  if(!response.ok)throw Error('WordPress inventory unavailable');
  const posts=await response.json();if(!Array.isArray(posts))throw Error('Invalid post inventory');
  posts.forEach(post=>paths.add(new URL(post.link).pathname.replace(/\/$/,'')||'/'));
  if(posts.length<100)break;
}
for(const endpoint of ['users?has_published_posts=true','categories?hide_empty=false']) {
 const response=await sourceFetch('https://nextincep.wpenginepowered.com/wp-json/wp/v2/'+endpoint+'&per_page=100&_fields=slug');
 if(!response.ok)throw Error('Blog taxonomy inventory unavailable');
 for(const item of await response.json()) paths.add('/'+(endpoint.startsWith('users')?'author':'category')+'/'+item.slug);
}
const rows=[['url','management','route_file','page_file','content_file','seo_file','schema_file','assets_file','asset_folder']];
for(const path of [...paths].sort()) {
  const entry=index[path];
  const route=path==='/'?'src/app/page.tsx':entry?`src/app${path}/page.tsx`:path==='/blog'?'src/app/blog/page.tsx':path.startsWith('/blog/')?'src/app/blog/[postSlug]/page.tsx':'src/app/[...slug]/page.tsx';
  const prefix=entry&&`src/page-content/${entry.folder}`;
  rows.push(entry?[path,entry.type==='wordpress'?'wordpress-api':'editable',route,`${prefix}/Page.tsx`,...['content','seo','schema','assets'].map(file=>`${prefix}/${file}.json`),entry.type==='wordpress'?'WordPress uploads':`public/assets/pages/${entry.folder}`]:[path,'wordpress-api',route,'src/lib/wordpress-content.ts','','WordPress / Yoast','WordPress JSON-LD','WordPress media API','WordPress uploads']);
}
const csv=value=>'"'+String(value??'').replaceAll('"','""')+'"';
fs.writeFileSync('PAGE_DIRECTORY.csv',rows.map(row=>row.map(csv).join(',')).join('\n')+'\n');
console.log(JSON.stringify({mappedURLs:paths.size,editablePages:Object.values(index).filter(entry=>entry.type!=='wordpress').length}));
