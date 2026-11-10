import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const root = process.cwd();
const output = path.join(root, 'image-library');
const index = JSON.parse(fs.readFileSync('content/media-index.json', 'utf8'));
const parts = JSON.parse(fs.readFileSync('content/file-parts.json', 'utf8'));
const catalog = JSON.parse(zlib.brotliDecompressSync(fs.readFileSync('content/site-catalog.json.br')));
fs.mkdirSync(output, { recursive: true });
function readRange(file, offset, size) {
  const result = Buffer.alloc(size);
  let position = 0, written = 0;
  for (const part of parts[file] || [file]) {
    const length = fs.statSync(part).size;
    const start = Math.max(0, offset - position);
    const count = Math.min(length - start, size - written);
    if (count > 0) {
      const fd = fs.openSync(part, 'r');
      try {
        let n = 0;
        while (n < count) {
          const received = fs.readSync(fd, result, written + n, count - n, start + n);
          if (!received) throw Error('Incomplete image read: ' + file);
          n += received;
        }
      } finally { fs.closeSync(fd); }
      written += count;
    }
    position += length;
    if (written === size) break;
  }
  if (written !== size) throw Error('Image range unavailable: ' + file);
  return result;
}
function localURL(value) {
  try { return new URL(value, 'https://inceptivesdigital.com').pathname; } catch { return ''; }
}
const usages = new Map();
for (const [pagePath, entry] of Object.entries(catalog)) {
  const page = JSON.parse(zlib.brotliDecompressSync(Buffer.from(entry.data, 'base64')));
  let occurrence = 0;
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (node.tag === 'img') {
      const source = localURL(node.props?.src || '');
      const usage = { page: pagePath, occurrence: ++occurrence, currentAlt: node.props?.alt ?? '', proposedAlt: node.props?.alt ?? '', altPresent: Object.hasOwn(node.props || {}, 'alt') };
      if (!usages.has(source)) usages.set(source, []);
      usages.get(source).push(usage);
    }
    (node.children || []).forEach(visit);
  }
  page.nodes.forEach(visit);
}
const images = [];
for (const [url, asset] of Object.entries(index)) {
  if (!asset.type.startsWith('image/')) continue;
  const relative = 'images/' + url.replace(/^\/+/, '');
  const destination = path.resolve(output, relative);
  if (!destination.startsWith(output + path.sep)) throw Error('Unsafe image path');
  const bytes = readRange(`content/media/${asset.pack}.pack`, asset.offset, asset.size);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, bytes);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  if (crypto.createHash('sha256').update(fs.readFileSync(destination)).digest('hex') !== sha256) throw Error('Copy verification failed');
  images.push({ url, file: relative, width: asset.width, height: asset.height, bytes: asset.size, sha256, usages: usages.get(url) || [] });
}
const manifest = { generatedAt: new Date().toISOString(), source: 'Current local migration catalog; live WordPress remains unchanged.', images };
fs.writeFileSync(path.join(output, 'alt-text.json'), JSON.stringify(manifest, null, 2));
const data = JSON.stringify(manifest).replace(/</g, '\\u003c');
fs.writeFileSync(path.join(output, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Image SEO alt text library</title><style>body{background:#141414;color:#fff;font:16px system-ui;margin:24px}button,input,textarea{font:inherit;padding:10px}button{background:#00ce44;border:0;border-radius:6px;cursor:pointer}input{width:min(90%,700px)}article{border:1px solid #555;border-radius:12px;padding:20px;margin:20px 0;overflow-wrap:anywhere}img{max-width:100%;width:220px;height:150px;object-fit:contain;background:#333}textarea{display:block;box-sizing:border-box;width:100%;margin:8px 0;background:#222;color:#fff;border:1px solid #666}small{color:#bbb}label{display:block;margin-top:16px}nav{position:sticky;top:0;background:#141414;padding:12px 0}a{color:#00ce44}</style><h1>Image SEO alt text library</h1><p>Edit alt text separately for each page occurrence. Blank alt text may be intentional for decorative images. Changes here are exported for review; they do not alter the website.</p><nav><input id="search" placeholder="Search image path, page URL or existing alt text" aria-label="Search images"> <button id="save">Download edited alt text JSON</button><p id="count"></p><button id="previous">Previous</button> <button id="next">Next</button></nav><main id="list"></main><script>const data=${data};let page=0;const size=30;const list=document.getElementById('list');const search=document.getElementById('search');function render(){const term=search.value.toLowerCase();const filtered=data.images.filter(i=>JSON.stringify(i).toLowerCase().includes(term));page=Math.max(0,Math.min(page,Math.ceil(filtered.length/size)-1));list.replaceChildren();document.getElementById('count').textContent=filtered.length+' images — page '+(page+1)+' of '+Math.max(1,Math.ceil(filtered.length/size));for(const i of filtered.slice(page*size,(page+1)*size)){const card=document.createElement('article');const img=document.createElement('img');img.src=i.file;img.alt='';img.loading='lazy';card.append(img);const title=document.createElement('h2');title.textContent=i.url;card.append(title);const note=document.createElement('small');note.textContent=i.usages.length?i.usages.length+' page occurrences':'No direct img element usage recorded. May be a responsive variant, poster or CSS background; this does not mean unused.';card.append(note);for(const u of i.usages){const label=document.createElement('label');label.textContent=u.page+' — image '+u.occurrence;const textarea=document.createElement('textarea');textarea.value=u.proposedAlt;textarea.rows=2;textarea.addEventListener('input',()=>u.proposedAlt=textarea.value);label.append(textarea);card.append(label)}list.append(card)}}search.oninput=()=>{page=0;render()};document.getElementById('previous').onclick=()=>{page--;render()};document.getElementById('next').onclick=()=>{page++;render()};document.getElementById('save').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download='alt-text-edited.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};render();</script></html>`);
fs.writeFileSync(path.join(output, 'README.txt'), `IMAGE SEO ALT TEXT LIBRARY\n\nOpen index.html in Chrome. Search by image filename, page path or existing alt text. Edit each page occurrence and click Download edited alt text JSON BEFORE closing the browser. Send that JSON back for applying the changes to the website. Browser edits are not saved automatically.\n\nImages are copies, not moved originals. Keep filenames and folder structure intact. Website URLs and existing SEO metadata are unchanged. Empty alt text may intentionally identify decorative images. CSS backgrounds do not support HTML alt attributes. Responsive variants and posters may have no direct img usage; this is not an unused-file classification.\n\nThis export covers the local catalog at generation time; future WordPress posts and external/unavailable originals are not automatically downloaded. Existing unused draft files remain separately in draft/images.\n\nRebuild this library: node scripts/export-image-library.mjs\n`);
console.log(JSON.stringify({ output, images: images.length, usages: images.reduce((n,i)=>n+i.usages.length,0), verifiedBytes: images.reduce((n,i)=>n+i.bytes,0) }));
