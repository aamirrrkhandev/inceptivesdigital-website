import "server-only";
import { unstable_cache } from "next/cache";
import * as cheerio from "cheerio";
import localPages from "../../content/site-search-index.json";
import blogSource from "../../content/wordpress-blog-source.json";
import { readWordPressBlogPage } from "./wordpress-forms";
import { mediaIndex } from "./static-media";

type Item = { title: string; href: string; excerpt: string; image: { src: string; alt: string; width: number; height: number } | null };
const plain = (html: string) => cheerio.load(html).text().trim();
const read = unstable_cache(readWordPressBlogPage, ["blog-search-wpe-v1"], { revalidate: 30, tags: ["wordpress-posts"] });
export async function loadSearchResults(query: string, page: number) {
  const needle = query.trim().toLocaleLowerCase();
  const found: Item[] = localPages
    .filter(item => (item.title + " " + item.text).toLocaleLowerCase().includes(needle))
    .sort((a, b) => Number(b.title.toLocaleLowerCase().includes(needle)) - Number(a.title.toLocaleLowerCase().includes(needle)))
    .map(item => ({ title: item.title, href: item.path, excerpt: item.excerpt, image: null }));
  for (let batch = 1; batch <= 100; batch++) {
    const params = new URLSearchParams({ search: query, status: "publish", per_page: "100", page: String(batch), _embed: "wp:featuredmedia", _fields: "link,title,excerpt,_links,_embedded" });
    const posts = JSON.parse(await read("/wp-json/wp/v2/posts?" + params)) as { link: string; title: { rendered: string }; excerpt: { rendered: string }; _embedded?: { "wp:featuredmedia"?: { source_url: string; alt_text: string; media_details?: { width: number; height: number } }[] } }[];
    if (!Array.isArray(posts)) throw new Error("Blog search unavailable");
    for (const post of posts) {
      const url = new URL(post.link, blogSource.origin), featured = post._embedded?.["wp:featuredmedia"]?.[0];
      const imageURL = featured && new URL(featured.source_url, blogSource.origin);
      found.push({ title: plain(post.title.rendered), href: url.pathname.replace(/\/$/, ""), excerpt: plain(post.excerpt.rendered), image: imageURL && featured ? { src: mediaIndex[imageURL.pathname] ? imageURL.pathname : imageURL.href, alt: featured.alt_text || "", width: featured.media_details?.width || 800, height: featured.media_details?.height || 370 } : null });
    }
    if (posts.length < 100) break;
  }
  const unique = [...new Map(found.map(item => [item.href, item])).values()];
  return { title: "Search - Inceptives Digital", results: unique.slice((page - 1) * 10, page * 10), pagination: Array.from({ length: Math.ceil(unique.length / 10) }, (_, index) => ({ label: String(index + 1), href: "/search?" + new URLSearchParams({ s: query, paged: String(index + 1) }) })) };
}
