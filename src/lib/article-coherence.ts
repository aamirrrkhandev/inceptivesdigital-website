import "server-only";
import * as cheerio from "cheerio";

const text = (value: unknown) => cheerio.load(String(value || "")).text().replace(/\s+/g, " ").trim();
const pathname = (value: unknown) => new URL(String(value), "https://nextincep.wpenginepowered.com").pathname.replace(/\/$/, "");

// A speculative HTML request is usable only if it agrees with the fresh REST
// record, including same-second content/SEO edits and current reviewer identity.
export function articleHTMLMatchesRecord(html: string, value: unknown, users: unknown[]) {
  const post = value as Record<string, any>;
  try {
    const $ = cheerio.load(html), root = $("[data-elementor-type='single-post']").first();
    if (!root.hasClass("post-" + post.id) || typeof post.content?.rendered !== "string") return false;
    const rendered = root.find(".elementor-widget-theme-post-content").first().html();
    if (rendered === null || rendered === undefined) return false;
    const canonicalHTML = (markup: string) => cheerio.load(markup, {}, false).html()?.trim();
    if (canonicalHTML(rendered) !== canonicalHTML(post.content.rendered)) return false;
    const titleWidget = root.find(".elementor-widget-theme-post-title").first();
    if (!titleWidget.length || text(titleWidget.text()) !== text(post.title?.rendered)) return false;
    const visibleTitle = root.find(".id-blog-hero h1").first();
    if (visibleTitle.length && text(visibleTitle.text()) !== text(post.title?.rendered)) return false;
    const featured = root.find(".elementor-widget-theme-post-featured-image img").first();
    const hero = root.find(".id-featured-image img").first();
    if (Number(post.featured_media) > 0) {
      if (!featured.hasClass("wp-image-" + post.featured_media) || !hero.length || featured.attr("src") !== hero.attr("src")) return false;
    } else if (post.featured_media === 0 && (featured.length || hero.length)) return false;
    const seo = post.yoast_head_json;
    if (!seo?.schema || $("head title").text() !== text(seo.title)) return false;
    if (($("meta[name=description]").attr("content") || "") !== (seo.description || "")) return false;
    if ($("link[rel=canonical]").attr("href") !== seo.canonical) return false;
    const directives = (value: string) => value.toLowerCase().split(",").map(part => part.trim()).filter(Boolean).sort().join(",");
    if (seo.robots && directives($("meta[name=robots]").attr("content") || "") !== directives(Object.values(seo.robots).join(","))) return false;
    if (JSON.stringify(JSON.parse($("script.yoast-schema-graph").text())) !== JSON.stringify(seo.schema)) return false;
    for (const [key, tag] of Object.entries({ og_title: "og:title", og_description: "og:description", og_url: "og:url", og_locale: "og:locale", og_type: "og:type", og_site_name: "og:site_name", article_modified_time: "article:modified_time", article_published_time: "article:published_time" })) {
      if (seo[key] !== undefined && ($(`meta[property='${tag}']`).attr("content") || "") !== seo[key]) return false;
    }
    if (seo.og_image?.[0]?.url && $("meta[property='og:image']").attr("content") !== seo.og_image[0].url) return false;
    const author = post._embedded?.author?.[0];
    if (author && root.find(".elementor-author-box__name").length) {
      if (text(root.find(".elementor-author-box__name").first().text()) !== text(author.name)) return false;
      if (text(root.find(".elementor-author-box__bio").first().text()) !== text(author.description)) return false;
    }
    const approved = post.meta?._flow_review_status === "approved" && Number(post.meta?._flow_reviewer_id) > 0;
    const reviewerBox = root.find(".qa-approved-user");
    if (!approved) return !reviewerBox.length;
    const reviewer = users.find(user => Number((user as any).id) === Number(post.meta._flow_reviewer_id)) as any;
    if (!reviewer || !reviewerBox.length) return false;
    if (text(reviewerBox.find(".qa-approved-user-name").text()) !== text(reviewer.name)) return false;
    if (pathname(reviewerBox.find(".qa-approved-user-name").attr("href")) !== pathname(reviewer.link)) return false;
    const avatar = Object.values(reviewer.avatar_urls || {})[0];
    if (avatar && pathname(reviewerBox.find("img").attr("src")) !== pathname(avatar)) return false;
    return true;
  } catch { return false; }
}
