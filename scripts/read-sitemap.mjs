export async function readSitemapXML(base) {
  const origin = new URL(base).origin, seen = new Set(), urls = new Set();
  async function read(url, depth = 0) {
    if (depth > 3 || seen.size >= 20 || new URL(url).origin !== origin) throw Error('Invalid sitemap index');
    if (seen.has(url)) return;
    seen.add(url);
    const response = await fetch(url);
    if (!response.ok) throw Error('Sitemap HTTP ' + response.status + ': ' + url);
    const xml = await response.text();
    const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1].replaceAll('&amp;', '&'));
    if (xml.includes('<sitemapindex')) await Promise.all(locations.map(child => read(child, depth + 1)));
    else locations.forEach(location => urls.add(location));
  }
  await read(origin + '/sitemap.xml');
  return '<urlset>' + [...urls].map(url => '<url><loc>' + url.replaceAll('&', '&amp;') + '</loc></url>').join('') + '</urlset>';
}
