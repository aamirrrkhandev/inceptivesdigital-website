import fs from "node:fs";
import * as cheerio from "cheerio";
const $ = cheerio.load(fs.readFileSync("audit/raw/home.html", "utf8"));
const clean = (x) => $(x).text().replace(/\s+/g, " ").trim();
const img = (e) => ({
  src: $(e).attr("src") || "",
  alt: $(e).attr("alt") || "",
});
const links = (e) =>
  $(e)
    .find("a[href]")
    .map((i, a) => ({ text: clean(a), href: $(a).attr("href") }))
    .get()
    .filter((a) => a.text);
const section = (id) => $(`[data-id="${id}"]`).first();
const heading = (id) =>
  section(id).find("h1,h2,h3,h4,h5,h6").first().text().trim();
const blocks = (id) =>
  section(id)
    .find("[data-widget_type]")
    .map((i, e) => ({
      id: $(e).attr("data-id"),
      type: $(e).attr("data-widget_type"),
      text: clean(e),
      title: $(e).find("h1,h2,h3,h4,h5,h6").first().text().trim(),
      description: $(e).find(".elementor-image-box-description").text().trim(),
      images: $(e)
        .find("img")
        .map((i, e) => img(e))
        .get(),
      links: links(e),
    }))
    .get();
const sections = {};
$('[data-elementor-type="wp-page"]')
  .children("[data-id]")
  .each((i, e) => {
    const id = $(e).attr("data-id");
    sections[id] = {
      heading: heading(id),
      blocks: blocks(id),
      images: $(e)
        .find("img")
        .map((i, e) => img(e))
        .get(),
    };
  });
const data = {
  sections,
  nav: $("#menu-menu > li")
    .map((i, e) => ({
      text: $(e).children("a").first().text().trim(),
      href: $(e).children("a").attr("href"),
      links: links(e),
    }))
    .get(),
  footer: blocks("653"),
  meta: {
    title: $("title").text(),
    description: $('meta[name="description"]').attr("content"),
    canonical: $('link[rel="canonical"]').attr("href"),
    og: $('meta[property^="og:"]')
      .map((i, e) => ({
        name: $(e).attr("property"),
        content: $(e).attr("content"),
      }))
      .get(),
    schema: $('script[type="application/ld+json"]')
      .map((i, e) => JSON.parse($(e).text()))
      .get(),
  },
  faq: section("503b2aff")
    .find("details")
    .map((i, e) => ({
      question: $(e).find("summary").text().replace(/\s+/g, " ").trim(),
      answer: $(e)
        .find('[data-widget_type="text-editor.default"]')
        .text()
        .trim(),
    }))
    .get(),
  tabs: section("65722df4")
    .find('[role="tab"]')
    .map((i, e) => clean(e))
    .get(),
  cases: section("59803898")
    .find(".swiper-slide")
    .map((i, e) => ({
      title: $(e).find("h3").first().text().trim(),
      blocks: $(e)
        .find("[data-widget_type]")
        .map((i, e) => ({
          type: $(e).attr("data-widget_type"),
          text: clean(e),
          title: $(e).find("h3,h4,h5").first().text().trim(),
          images: $(e)
            .find("img")
            .map((i, e) => img(e))
            .get(),
          links: links(e),
        }))
        .get(),
    }))
    .get(),
  footerBlocks: $('[data-elementor-type="footer"]')
    .find("[data-widget_type]")
    .map((i, e) => ({
      type: $(e).attr("data-widget_type"),
      text: clean(e),
      title: $(e).find("h2,h3,h4,h5").first().text().trim(),
      description: $(e).find(".elementor-image-box-description").text().trim(),
      images: $(e)
        .find("img")
        .map((i, e) => img(e))
        .get(),
      links: links(e),
    }))
    .get(),
};
fs.mkdirSync("src/content", { recursive: true });
fs.writeFileSync("src/content/source.json", JSON.stringify(data, null, 2));
console.log(
  "sections",
  Object.keys(sections).length,
  "nav",
  data.nav.map((n) => n.text),
  "cases",
  data.cases.length,
  "faqs",
  data.faq.length,
);
const urls = [
  ...new Set(
    [
      ...$("img")
        .map((i, e) => $(e).attr("src"))
        .get(),
      ...$("style")
        .text()
        .matchAll(
          /url\(['"]?(https:[^\s'"\)]+\.(?:ttf|woff2?|png|webp|avif))/g,
        ),
    ].map((v) => (typeof v === "string" ? v : v[1])),
  ),
].filter((x) => x?.startsWith("https://inceptivesdigital.com/"));
fs.mkdirSync("public/assets", { recursive: true });
const assetMap = {};
let index = 0;
for (let start = 0; start < urls.length; start += 5) {
  await Promise.all(
    urls.slice(start, start + 5).map(async (u) => {
      try {
        const r = await fetch(u);
        if (!r.ok) throw Error(r.status);
        const filename = new URL(u).pathname.split("/").pop();
        const local = "/assets/" + filename;
        fs.writeFileSync("public" + local, Buffer.from(await r.arrayBuffer()));
        assetMap[u] = local;
      } catch (e) {
        console.log("Asset failed", u, e.message);
      }
    }),
  );
}
fs.writeFileSync("src/content/assets.json", JSON.stringify(assetMap, null, 2));
for (const file of [
  "post-sitemap.xml",
  "page-sitemap.xml",
  "author-sitemap.xml",
  "robots.txt",
]) {
  const r = await fetch("https://inceptivesdigital.com/" + file);
  const t = await r.text();
  fs.writeFileSync("audit/raw/" + file, t);
  console.log(file, r.status, [...t.matchAll(/<loc>/g)].length);
}
console.log("assets", Object.keys(assetMap).length);
