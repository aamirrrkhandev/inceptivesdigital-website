import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";
import safeParser from "postcss-safe-parser";
import { getPage, type LayoutNode, type SitePage } from "./site-model";
import { mediaIndex } from "./static-media";
import { readWordPressPublicPage } from "./wordpress-forms";
import { prepareSourceDom } from "./source-enhancements";
import { approvedCanonical } from "./seo-policy";
import savedRoutes from "../../content/routes.json";

const origin = "https://inceptivesdigital.com";
const rename = (value: string) =>
  value
    .replaceAll("elementor", "migrated")
    .replaceAll("elementskit", "sitekit");
const read = unstable_cache(
  readWordPressPublicPage,
  ["wordpress-public-content-v2"],
  { revalidate: 30, tags: ["wordpress-posts"] },
);
type PostIndex = {
  id: number;
  slug: string;
  link: string;
  modified_gmt: string;
  yoast_head_json?: { robots?: { index?: string }; canonical?: string };
};
export type BlogOptions = {
  page: number;
  category: string;
  search: string;
  view: string;
};
type PostCard = PostIndex & {
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: {
      source_url: string;
      alt_text: string;
      media_details?: { width: number; height: number };
    }[];
    "wp:term"?: { name: string; slug: string; taxonomy: string }[][];
  };
};

export const getPublishedPosts = cache(async (): Promise<PostIndex[]> => {
  const posts: PostIndex[] = [];
  for (let page = 1; page <= 100; page++) {
    const batch = JSON.parse(
      await read(
        `/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=id,slug,link,modified_gmt,yoast_head_json.robots,yoast_head_json.canonical`,
      ),
    ) as PostIndex[];
    if (!Array.isArray(batch))
      throw new Error("Invalid WordPress posts response");
    posts.push(...batch);
    if (batch.length < 100) return posts;
  }
  throw new Error("WordPress pagination limit reached");
});

export async function getWordPressSitemapPosts() {
  const posts = await getPublishedPosts();
  if (posts.some((post) => !post.yoast_head_json?.robots?.index))
    throw new Error("WordPress indexing directives unavailable");
  return posts
    .filter((post) => post.yoast_head_json?.robots?.index === "index")
    .map((post) =>
      approvedCanonical(post.yoast_head_json?.canonical || post.link)!,
    )
    .filter(Boolean);
}

export const getWordPressSitemapURLs = cache(async () => {
  const visited = new Set<string>();
  const urls: string[] = [];
  async function visit(path: string) {
    if (visited.has(path)) return;
    visited.add(path);
    if (visited.size > 40) throw new Error("Unexpected sitemap count");
    const $ = cheerio.load(await read(path), { xmlMode: true });
    if ($("sitemapindex").length) {
      await Promise.all(
        $("sitemap > loc")
          .toArray()
          .map(async (el) => {
            const url = new URL($(el).text());
            if (url.origin !== origin || !url.pathname.endsWith(".xml"))
              throw new Error("Invalid sitemap host");
            await visit(url.pathname);
          }),
      );
    } else if ($("urlset").length) {
      $("url > loc").each((_, el) => {
        const url = new URL($(el).text());
        if (url.origin === origin) urls.push(approvedCanonical(url.href)!);
      });
    } else throw new Error("Invalid WordPress sitemap");
  }
  await visit("/sitemap_index.xml");
  urls.push(...(await getWordPressSitemapPosts()));
  if (!urls.length) throw new Error("Empty WordPress sitemap");
  const canonicals = new Map(
    savedRoutes.map((route) => [
      route.path,
      approvedCanonical(route.canonical)!,
    ]),
  );
  for (const post of await getPublishedPosts()) {
    canonicals.set(
      new URL(post.link).pathname.replace(/\/$/, ""),
      approvedCanonical(post.yoast_head_json?.canonical || post.link)!,
    );
  }
  // Keep Yoast destinations and apply the user's explicit no-trailing-slash convention.
  return [
    ...new Set(
      urls.map(
        (url) =>
          canonicals.get(new URL(url).pathname.replace(/\/$/, "") || "/") ||
          url,
      ),
    ),
  ];
});

function media(value: string) {
  try {
    const url = new URL(value, origin);
    return url.origin === origin && mediaIndex[url.pathname]
      ? url.pathname
      : url.href;
  } catch {
    return value;
  }
}
function localLink(value: string) {
  try {
    const url = new URL(value, origin);
    return url.origin === origin
      ? url.pathname + url.search + url.hash
      : url.href;
  } catch {
    return value;
  }
}

function convertDom($: cheerio.CheerioAPI, node: AnyNode): LayoutNode | null {
  if (node.type === "text") return node.data;
  if (node.type !== "tag") return null;
  const element = node as Element;
  if (
    ["script", "style", "link", "noscript", "object", "embed"].includes(
      element.name,
    )
  )
    return null;
  const props: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(element.attribs)) {
    if (
      /^on/i.test(name) ||
      ["srcdoc", "nonce", "data-settings"].includes(name)
    )
      continue;
    if (name === "class") {
      props.className = rename(value).replace(/\bmigrated-invisible\b/g, "");
      continue;
    }
    if (name === "style") {
      const styles: Record<string, string> = {};
      safeParser(`x{${value}}`).walkDecls((decl) => {
        styles[
          decl.prop.startsWith("--")
            ? decl.prop
            : decl.prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        ] = decl.value;
      });
      props.style = styles;
      continue;
    }
    if (name === "href") {
      props.href = /^(?:javascript|vbscript):/i.test(value.trim())
        ? "#"
        : localLink(value);
      continue;
    }
    if (["src", "poster"].includes(name)) {
      props[name] = media(value);
      continue;
    }
    if (name === "srcset") {
      props.srcSet = value
        .split(",")
        .map((item) => {
          const [url, ...size] = item.trim().split(/\s+/);
          return [media(url), ...size].join(" ");
        })
        .join(", ");
      continue;
    }
    if (
      [
        "disabled",
        "required",
        "multiple",
        "hidden",
        "open",
        "controls",
        "loop",
        "muted",
      ].includes(name)
    ) {
      props[name] = true;
      continue;
    }
    if (name === "checked") {
      props.defaultChecked = true;
      continue;
    }
    if (name === "value" && element.name === "input") {
      props.defaultValue = value;
      continue;
    }
    if (name === "width" || name === "height") {
      if (/^\d+$/.test(value)) props[name] = Number(value);
      continue;
    }
    const names: Record<string, string> = {
      for: "htmlFor",
      tabindex: "tabIndex",
      readonly: "readOnly",
      datetime: "dateTime",
      viewbox: "viewBox",
      "fill-rule": "fillRule",
      "clip-rule": "clipRule",
      "stroke-width": "strokeWidth",
      "stroke-linecap": "strokeLinecap",
      "stroke-linejoin": "strokeLinejoin",
      allowfullscreen: "allowFullScreen",
      referrerpolicy: "referrerPolicy",
      crossorigin: "crossOrigin",
      maxlength: "maxLength",
      autocomplete: "autoComplete",
      autoplay: "autoPlay",
      playsinline: "playsInline",
      "data-widget_type": "data-widget",
      itemprop: "itemProp",
      itemscope: "itemScope",
      itemtype: "itemType",
    };
    props[names[name] || name.replace("data-elementor", "data-migration")] =
      value;
  }
  if (element.name === "img") {
    props.loading = "lazy";
    props.decoding = "async";
    props.alt ??= "";
  }
  if (element.name === "iframe") {
    props.title ||= "Embedded content";
    props.loading = "lazy";
    if (props.src) {
      props["data-embed-src"] = props.src;
      delete props.src;
    }
  }
  return {
    tag: element.name,
    props,
    children: element.children
      .map((child) => convertDom($, child))
      .filter((child): child is LayoutNode => child !== null),
  };
}

function refreshMetadata($: cheerio.CheerioAPI, page: SitePage) {
  page.meta = {
    title: $("head > title").text(),
    description: $("meta[name=description]").attr("content") || "",
    canonical: $("link[rel=canonical]").attr("href") || "",
    robots: $("meta[name=robots]").attr("content") || "index, follow",
    metadata: $(
      "meta[property],meta[name^=twitter],meta[name=google-site-verification]",
    )
      .map((_, el) => ({
        name: $(el).attr("property") || $(el).attr("name") || "",
        content: $(el).attr("content") || "",
      }))
      .get(),
    schema: $("script[type='application/ld+json']")
      .toArray()
      .map((el) => JSON.parse($(el).text())),
    headings: $("h1,h2,h3,h4,h5,h6")
      .map((_, el) => ({
        level: el.tagName,
        text: $(el).text().replace(/\s+/g, " ").trim(),
      }))
      .get(),
    hreflang: $("link[hreflang]")
      .map((_, el) => ({
        lang: $(el).attr("hreflang")!,
        href: $(el).attr("href")!,
      }))
      .get(),
  };
}

function appendSourceStyles(
  $: cheerio.CheerioAPI,
  root: cheerio.Cheerio<AnyNode>,
  page: SitePage,
) {
  const inline = root
    .find("style")
    .map((_, el) => $(el).text())
    .get()
    .join("\n");
  const ast = safeParser(inline);
  ast.walkAtRules("import", (rule) => {
    rule.remove();
  });
  ast.walkRules((rule) => {
    if (rule.parent?.type === "atrule" && /keyframes/.test(rule.parent.name))
      return;
    rule.selectors = rule.selectors.map((selector) => {
      const scoped = rename(selector).replace(
        /:root\b|\bhtml\b|\bbody\b/g,
        ":where(.migrated-page)",
      );
      return scoped.startsWith(":where(.migrated-page)")
        ? scoped
        : ":where(.migrated-page) " + scoped;
    });
  });
  ast.walkDecls((decl) => {
    decl.value = decl.value.replace(
      /url\(["']?([^)'"\s]+)["']?\)/g,
      (_, url) => `url("${media(url)}")`,
    );
  });
  page.css += "\n" + ast.toString();
}

async function updateBlogListing($: cheerio.CheerioAPI, options: BlogOptions) {
  const query = new URLSearchParams({
    per_page: "100",
    _embed: "wp:featuredmedia,wp:term",
    _fields: "id,slug,link,title,excerpt,_links,_embedded",
  });
  if (options.category && options.category !== "all") {
    const categories = JSON.parse(
      await read(
        "/wp-json/wp/v2/categories?slug=" +
          encodeURIComponent(options.category) +
          "&_fields=id",
      ),
    ) as { id: number }[];
    query.set("categories", String(categories[0]?.id || 0));
    if (!categories.length) query.set("include", "0");
  }
  if (options.search) query.set("search", options.search);
  const all: PostCard[] = [];
  for (let number = 1; number <= 100; number++) {
    query.set("page", String(number));
    const batch = JSON.parse(
      await read("/wp-json/wp/v2/posts?" + query),
    ) as PostCard[];
    if (!Array.isArray(batch))
      throw new Error("Invalid WordPress listing response");
    all.push(...batch);
    if (batch.length < 100) break;
  }
  const perPage =
    options.view === "mobile" ? 6 : options.view === "tablet" ? 9 : 15;
  const posts = all.slice((options.page - 1) * perPage, options.page * perPage);
  const grid = $("[data-blog-grid]").first();
  if (!grid.length) throw new Error("Blog listing template unavailable");
  grid.empty();
  $("[data-id-blog-listing]").attr({
    "data-view": options.view,
    "data-category": options.category || "all",
    "data-search": options.search,
    "data-page": String(options.page),
  });
  $(".btn-tabs").each((_, el) => {
    const active =
      ($(el).attr("data-filter") || "all") === (options.category || "all");
    $(el).toggleClass("active", active).attr("aria-pressed", String(active));
  });
  $(".blogssearch-inner input[type=search]").attr("value", options.search);
  for (const post of posts) {
    const categories =
      post._embedded?.["wp:term"]
        ?.flat()
        .filter((term) => term.taxonomy === "category") || [];
    const category =
      categories.find((term) => term.slug === options.category) ||
      categories[0];
    const article = $("<article></article>")
      .addClass("filtered-post-card")
      .attr("data-category", category?.slug || "all");
    const image = post._embedded?.["wp:featuredmedia"]?.[0];
    if (image?.source_url)
      article.append(
        $("<a></a>")
          .addClass("post-image")
          .attr("href", post.link)
          .append(
            $("<img>").attr({
              src: image.source_url,
              alt: image.alt_text || "",
              loading: "lazy",
              decoding: "async",
              ...(image.media_details
                ? {
                    width: String(image.media_details.width),
                    height: String(image.media_details.height),
                  }
                : {}),
            }),
          ),
      );
    const text = $("<div></div>").addClass("post-content");
    if (category)
      text.append(
        $("<div></div>").addClass("post-category").text(category.name),
      );
    text.append(
      $("<h3></h3>")
        .addClass("post-title")
        .append(
          $("<a></a>")
            .attr("href", post.link)
            .text(cheerio.load(post.title.rendered).text()),
        ),
    );
    const words = cheerio
      .load(post.excerpt.rendered)
      .text()
      .trim()
      .split(/\s+/);
    text.append(
      $("<div></div>")
        .addClass("post-excerpt")
        .text(words.slice(0, 22).join(" ") + (words.length > 22 ? "…" : "")),
    );
    text.append(
      $("<a></a>")
        .addClass("post-read-more")
        .attr("href", post.link)
        .text("Read More →"),
    );
    grid.append(article.append(text));
  }
  const pagination = $(".id-blog-pagination").first().empty();
  const pageCount = Math.ceil(all.length / perPage);
  if (!posts.length)
    grid.append($("<p></p>").attr("role", "status").text("No posts found."));
  for (let number = 1; number <= pageCount; number++) {
    const params = new URLSearchParams({ blog_view: options.view });
    if (options.category && options.category !== "all")
      params.set("blog_cat", options.category);
    if (options.search) params.set("blog_search", options.search);
    if (number > 1) params.set("pagination_page", String(number));
    pagination.append(
      number === options.page
        ? $("<span></span>")
            .addClass("id-page-number is-active")
            .attr("aria-current", "page")
            .text(String(number))
        : $("<a></a>")
            .addClass("id-page-number")
            .attr("href", `/blog?${params}`)
            .text(String(number)),
    );
  }
}

export const getWordPressPage = cache(
  async (path: string, blogQuery = ""): Promise<SitePage | undefined> => {
    const saved = getPage(path);
    const archive =
      /^\/(?:author|category)\/[^/]+(?:\/page\/\d+)?$/.test(path) && !!saved;
    const articlePath = /^\/(?:blog|press-release)\/[^/]+$/.test(path);
    if (path !== "/blog" && !articlePath && !archive) return saved;
    try {
      const posts = await getPublishedPosts();
      const post =
        path === "/blog" || archive
          ? undefined
          : posts.find(
              (post) => new URL(post.link).pathname.replace(/\/$/, "") === path,
            );
      if (articlePath && !post) return undefined;
      const modified = saved?.meta.metadata.find(
        (meta) => meta.name === "article:modified_time",
      )?.content;
      if (
        saved &&
        path !== "/blog/mobile-app-monetization-strategies" &&
        post &&
        modified &&
        Date.parse(post.modified_gmt + "Z") <= Date.parse(modified)
      )
        return saved;
      const query = new URLSearchParams(blogQuery);
      const options = {
        page: Math.max(
          1,
          Math.min(1000, Number(query.get("pagination_page")) || 1),
        ),
        category: (query.get("blog_cat") || "all").slice(0, 80),
        search: (query.get("blog_search") || "").slice(0, 200),
        view: ["mobile", "tablet"].includes(query.get("blog_view") || "")
          ? query.get("blog_view")!
          : "desktop",
      };
      const html = await read(
        path +
          (post
            ? "?migration_version=" + encodeURIComponent(post.modified_gmt)
            : blogQuery
              ? "?" + blogQuery
              : ""),
      );
      const $ = cheerio.load(html);
      const template = saved || getPage("/blog/no-code-mvp-vs-custom-mvp")!;
      const page: SitePage = {
        ...template,
        path,
        key: post ? `wordpress-post-${post.id}` : template.key,
        sourceUrl: origin + path,
        nodes: [...template.nodes],
        bodyClass: rename($("body").attr("class") || template.bodyClass),
        articleInteractions: !!post,
      };
      refreshMetadata($, page);
      const root = archive
        ? $("[data-elementor-type='archive']").first()
        : post
          ? $("[data-elementor-type='single-post']").first()
          : $("main#content").first();
      if (!root.length) throw new Error("WordPress content template missing");
      if (path === "/blog") await updateBlogListing($, options);
      prepareSourceDom($, { key: page.key });
      appendSourceStyles($, root, page);
      const converted = convertDom($, root[0]);
      if (!converted) throw new Error("WordPress content conversion failed");
      page.nodes = page.nodes.map((node) =>
        typeof node !== "string" &&
        (archive
          ? String(node.props.className || "").includes(
              "migrated-location-archive",
            )
          : post
            ? String(node.props.className || "").includes(
                "migrated-location-single",
              )
            : node.tag === "main" && node.props.id === "content")
          ? converted
          : node,
      );
      return page;
    } catch (error) {
      console.error(
        "WordPress content refresh failed",
        path,
        error instanceof Error ? error.message : "Unknown error",
      );
      if (saved) return saved;
      throw error;
    }
  },
);

export const getWordPressThankYouMetadata = cache(async () => {
  const template = getPage("/contact-us")!;
  const page = { ...template, path: "/thank-you" };
  refreshMetadata(cheerio.load(await read("/thank-you")), page);
  return page.meta;
});
