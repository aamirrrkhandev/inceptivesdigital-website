import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";
import * as cheerio from "cheerio";
import postcss from "postcss";
import safeParser from "postcss-safe-parser";
import { sourceFetch as fetch } from "./source-fetch.mjs";
import { prepareSourceDom } from "./source-enhancements.mjs";
import { scopeDocumentTypes } from "./selector-scope.mjs";
const origin = "https://inceptivesdigital.com";
const auditRoot = process.env.MIGRATION_AUDIT_DIR || "audit/full";
const crawl = JSON.parse(fs.readFileSync(auditRoot + "/crawl.json"));
const styleIndex = JSON.parse(fs.readFileSync(auditRoot + "/styles.json"));
const styleMap = new Map(
  styleIndex
    .filter((s) => s.status === 200)
    .map((s) => [
      s.url,
      fs.readFileSync(auditRoot + "/css/" + s.key + ".css", "utf8"),
    ]),
);
const assetUrls = new Set();
const assets = {};
const pages = {};
const failures = [];
const widgetTypes = {};
const rename = (t) =>
  t.replaceAll("elementor", "migrated").replaceAll("elementskit", "sitekit");
const googleCss = new Map();
for (const row of crawl.filter((r) => r.status === 200)) {
  const $ = cheerio.load(
    fs.readFileSync(auditRoot + "/html/" + row.key + ".html", "utf8"),
  );
  for (const e of $(
    'link[rel=stylesheet][href*="fonts.googleapis.com"]',
  ).toArray()) {
    const url = $(e).attr("href");
    if (googleCss.has(url)) continue;
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36" },
      });
      googleCss.set(url, await response.text());
    } catch {
      googleCss.set(url, "");
    }
  }
}
function assetRef(raw, base = origin) {
  if (!raw || raw.startsWith("data:") || raw.startsWith("#")) return raw;
  try {
    const u = new URL(raw.replaceAll("&amp;", "&"), base);
    if (!["http:", "https:"].includes(u.protocol)) return raw;
    u.hash = "";
    if (
      !/\.(?:png|jpe?g|webp|avif|gif|svg|mp4|webm|ttf|otf|woff2?|ico)(?:$|\?)/i.test(
        u.href,
      )
    )
      return raw;
    const url = u.href;
    const local =
      u.origin === origin && u.pathname.startsWith("/wp-content/uploads/")
        ? u.pathname
        : "/media/" +
          crypto.createHash("sha1").update(url).digest("hex").slice(0, 20) +
          path.extname(u.pathname);
    assets[url] = local;
    assetUrls.add(url);
    return local;
  } catch {
    return raw;
  }
}
const rewriteUrls = (text, base) =>
  text.replace(
    /url\(\s*(['"]?)(.*?)\1\s*\)/g,
    (all, q, u) => `url("${assetRef(u, base)}")`,
  );
function makePage(row) {
  const $ = cheerio.load(
    fs.readFileSync(auditRoot + "/html/" + row.key + ".html", "utf8"),
  );
  prepareSourceDom($,row);
  const allClasses = new Set(),
    allIds = new Set();
  $("[class]").each((i, e) =>
    $(e)
      .attr("class")
      .split(/\s+/)
      .forEach((c) => allClasses.add(c)),
  );
  $("[id]").each((i, e) => allIds.add($(e).attr("id")));
  const localRules = new Map();
  let firstImage = true,
    firstMainImage = true;
  function convert(e) {
    if (e.type === "text") {
      if (!/\S/.test(e.data))
        return /^(p|h[1-6]|span|a|strong|em|li|button|summary)$/.test(
          e.parent?.name || "",
        )
          ? " "
          : null;
      return e.data;
    }
    if (
      e.type !== "tag" ||
      ["script", "style", "link", "meta", "noscript"].includes(e.name)
    )
      return null;
    if (["object", "embed"].includes(e.name)) {
      failures.push({
        url: row.url,
        feature: e.name,
        status: "requires_manual_implementation",
      });
      return null;
    }
    const a = {};
    for (const [name, value] of Object.entries(e.attribs || {})) {
      if (
        /^on/i.test(name) ||
        [
          "srcdoc",
          "nonce",
          "data-elementor-settings",
          "data-gramm",
          "data-gramm_editor",
        ].includes(name)
      )
        continue;
      if (name === "data-settings") {
        try {
          const s = JSON.parse(value);
          const config = {};
          for (const k of Object.keys(s))
            if (
              /slides_to|autoplay|speed|pause_on|infinite|background_video_link|background_video_start|background_video_end|sticky|sticky_on/.test(
                k,
              )
            )
              config[k] = s[k];
          if (Object.keys(config).length)
            a["data-config"] = JSON.stringify(config);
          if (s.background_video_link)
            a["data-background-video"] = assetRef(s.background_video_link);
        } catch {}
        continue;
      }
      if (name === "class") {
        a.className = [
          rename(value).replace(/\b(?:migrated-invisible|animated)\b/g, ""),
          a.className,
        ]
          .filter(Boolean)
          .join(" ");
        continue;
      }
      if (name === "style") {
        const text = rewriteUrls(value, row.url);
        const cls =
          "inline-" +
          crypto.createHash("sha1").update(text).digest("hex").slice(0, 10);
        localRules.set(cls, text);
        a.className = (a.className || "") + " " + cls;
        continue;
      }
      if (name === "src" || name === "poster") {
        a[name] = assetRef(value, row.url);
        continue;
      }
      if (name === "srcset") {
        a.srcSet = value
          .split(",")
          .map((part) => {
            const [u, ...rest] = part.trim().split(/\s+/);
            return assetRef(u, row.url) + " " + rest.join(" ");
          })
          .join(", ");
        continue;
      }
      if (name === "href") {
        try {
          const u = new URL(value, row.url);
          a.href =
            u.origin === origin ? u.pathname + u.search + u.hash : u.href;
        } catch {
          a.href = value;
        }
        continue;
      }
      if (name === "data-widget_type") {
        a["data-widget"] = value;
        widgetTypes[value] = (widgetTypes[value] || 0) + 1;
        continue;
      }
      if (name === "for") {
        a.htmlFor = value;
        continue;
      }
      if (name === "tabindex") {
        a.tabIndex = value;
        continue;
      }
      if (name === "readonly") {
        a.readOnly = true;
        continue;
      }
      if (
        name === "disabled" ||
        name === "required" ||
        name === "multiple" ||
        name === "hidden" ||
        name === "open" ||
        name === "controls" ||
        name === "loop" ||
        name === "muted" ||
        name === "autoplay" ||
        name === "playsinline"
      ) {
        a[{ autoplay: "autoPlay", playsinline: "playsInline" }[name] || name] =
          true;
        continue;
      }
      if (name === "checked") {
        a.defaultChecked = true;
        continue;
      }
      if (name === "value" && e.name === "input") {
        a.defaultValue = value;
        continue;
      }
      if (name === "width" || name === "height") {
        if (/^\d+$/.test(value)) a[name] = Number(value);
        continue;
      }
      if (name === "xmlns" || name === "xmlns:xlink") continue;
      if (/^[a-zA-Z_][a-zA-Z0-9_:.-]*$/.test(name)) {
        const map = {
          "stroke-width": "strokeWidth",
          "stroke-linecap": "strokeLinecap",
          "stroke-linejoin": "strokeLinejoin",
          "fill-rule": "fillRule",
          "clip-rule": "clipRule",
          viewbox: "viewBox",
          preserveaspectratio: "preserveAspectRatio",
          crossorigin: "crossOrigin",
          allowfullscreen: "allowFullScreen",
          referrerpolicy: "referrerPolicy",
          datetime: "dateTime",
          maxlength: "maxLength",
          autocomplete: "autoComplete",
          novalidate: "noValidate",
        };
        a[map[name] || name.replace("data-elementor", "data-migration")] =
          value;
      }
    }
    if (e.name === "img") {
      const primary =
        firstImage || (firstMainImage && $(e).closest("main").length > 0);
      a.loading = primary ? "eager" : "lazy";
      a.decoding = "async";
      if (primary) a.fetchPriority = "high";
      if ($(e).closest("main").length) firstMainImage = false;
      firstImage = false;
      if (a.alt === undefined) a.alt = "";
    }
    if (e.name === "iframe") {
      a.title = a.title || "Embedded content";
      if (a.src) {
        a["data-embed-src"] = a.src;
        delete a.src;
      }
      a.loading = "lazy";
    }
    if (e.name === "video") {
      a.preload = "none";
      a.autoPlay = true;
      a.muted = true;
      a.loop = true;
      a.playsInline = true;
      if (a.src) {
        a["data-media-src"] = a.src;
        delete a.src;
      }
    }
    if (e.name === "source" && e.parent?.name === "video" && a.src) {
      a["data-media-src"] = a.src;
      delete a.src;
    }
    if (e.name === "form") {
      if ($(e).hasClass('elementor-form')) {
        delete a.action;
        a["data-contact-form"] = "true";
      } else if ($(e).hasClass('id-ios-form')) {
        delete a.action;
      } else if ($(e).hasClass('e-search-form')) {
        a.action = '/';
        a.method = 'get';
      }
    }
    const children = (e.children || [])
      .map(convert)
      .filter((n) => n !== null && n !== "");
    return { tag: e.name, props: a, children };
  }
  const body = $("body");
  const nodes = body
    .children()
    .toArray()
    .filter(
      (e) =>
        !["script", "style", "link", "noscript"].includes(e.name) &&
        !$(e).is("#wpadminbar") &&
        !$(e).hasClass("grammarly-integration"),
    )
    .map(convert)
    .filter(Boolean);
  const inline = $("style")
    .map((i, e) => $(e).text())
    .get();
  const cssParts = [];
  for (const [url, css] of googleCss)
    cssParts.push({ css, base: url, media: "all" });
  for (const s of row.styles || []) {
    const text = styleMap.get(s.url);
    if (text) cssParts.push({ css: text, base: s.url, media: s.media });
  }
  for (const text of inline)
    cssParts.push({
      css: text.replace(/^\s*\/\/.*$/gm, ""),
      base: row.url,
      media: "all",
    });
  cssParts.push({
    css: [...localRules]
      .map(([cls, text]) => "." + cls + "{" + text + "}")
      .join("\n"),
    base: row.url,
    media: "all",
  });
  const cssRoots = [];
  for (const part of cssParts) {
    try {
      const normalizedFile=auditRoot+'/normalized-css/'+crypto.createHash('sha1').update(part.css).digest('hex')+'.css';
      const ast = safeParser(fs.existsSync(normalizedFile)?fs.readFileSync(normalizedFile,'utf8'):part.css);
      ast.walkAtRules("import", (r) => r.remove());
      ast.walkRules((rule) => {
        if (
          rule.parent?.type === "atrule" &&
          /keyframes/.test(rule.parent.name)
        )
          return;
        const selectors = rule.selectors.filter((sel) => {
          const test = sel
            .replace(/:not\([^)]*\)/g, "")
            .replace(/\[[^\]]*\]/g, "");
          const classes = [...test.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(
            (m) => m[1],
          );
          const ids = [...test.matchAll(/#([a-zA-Z_][\w-]*)/g)].map(
            (m) => m[1],
          );
          return (
            classes.every(
              (c) =>
                allClasses.has(c) ||
                c.startsWith("inline-") ||
                c === "active" ||
                c === "is-active" ||
                c.startsWith("swiper") ||
                c.startsWith("is-") ||
                c.startsWith("e-") ||
                c.includes("sticky") ||
                c === "animated" ||
                c.startsWith("calendly-") || c.startsWith("id-ios-") || c.startsWith("cfturnstile-") || c.startsWith("elementor-message"),
            ) && ids.every((id) => allIds.has(id))
          );
        });
        if (!selectors.length) {
          rule.remove();
          return;
        }
        rule.selectors = selectors.map((sel) => {
          const s = scopeDocumentTypes(rename(sel)
            .replace(/data-migrated-/g, "data-migration-")
            .replaceAll("data-widget_type", "data-widget"));
          const rootClass = (body.attr("class") || "")
            .split(/\s+/)
            .map(rename)
            .find((c) => c === s.match(/^\.([\w-]+)/)?.[1]);
          return s.startsWith(":where(.migrated-page)")
            ? s
            : rootClass
              ? ":where(.migrated-page)" + s
              : ":where(.migrated-page) " + s;
        });
      });
      ast.walkDecls((d) => {
        d.value = rewriteUrls(d.value, part.base);
        if (d.prop === "font-display") d.value = "swap";
      });
      ast.walkAtRules("font-face", (r) => {
        if (!r.nodes.some((n) => n.prop === "font-display"))
          r.append({ prop: "font-display", value: "swap" });
      });
      const text = ast.toString();
      cssRoots.push(
        part.media && part.media !== "all"
          ? `@media ${part.media}{${text}}`
          : text,
      );
    } catch (e) {
      failures.push({
        url: row.url,
        feature: "css_parse",
        error: e.message.slice(0, 200),
      });
    }
  }
  const main = $("main");
  const pathName = new URL(row.finalUrl || row.url).pathname;
  const meta = {
    title: $("head > title").text(),
    description: row.description,
    canonical: row.canonical || row.finalUrl,
    robots: row.robots,
    metadata: row.metadata,
    schema: row.schema,
    headings: row.headings,
    hreflang: $("link[hreflang]")
      .map((i, e) => ({ lang: $(e).attr("hreflang"), href: $(e).attr("href") }))
      .get(),
  };
  return {
    path: pathName,
    key: row.key,
    sourceUrl: row.url,
    bodyClass: rename(body.attr("class") || ""),
    nodes,
    css: cssRoots.join("\n"),
    meta,
    widgets: row.widgets,
    articleInteractions: $(".id-article-body,.press-post-content,.schema-faq,.accordion-header").length > 0,
  };
}
for (const row of crawl.filter((r) => r.status === 200)) {
  try {
    const p = makePage(row);
    for (const m of p.meta.metadata) assetRef(m.content);
    for (const m of JSON.stringify(p.meta.schema).matchAll(
      /https?:[^\s"<>]+?\.(?:png|jpg|jpeg|webp|avif|svg)/g,
    ))
      assetRef(m[0]);
    if (!pages[p.path]) pages[p.path] = p;
  } catch (e) {
    failures.push({ url: row.url, feature: "page_compile", error: e.stack });
  }
}
fs.mkdirSync("content", { recursive: true });
fs.mkdirSync(auditRoot + "/assets", { recursive: true });
fs.writeFileSync(
  auditRoot + "/asset-sources.json",
  JSON.stringify([...assetUrls]),
);
fs.writeFileSync(auditRoot + "/asset-map.json", JSON.stringify(assets));
fs.writeFileSync(
  auditRoot + "/compile-failures.json",
  JSON.stringify(failures, null, 2),
);
fs.writeFileSync(
  auditRoot + "/widget-counts.json",
  JSON.stringify(widgetTypes, null, 2),
);
// Retain exact source declarations; remove comments without expensive cross-rule rewrites.
for (const page of Object.values(pages)) {
  const ast = safeParser(page.css);
  ast.walkComments((n) => n.remove());
  page.css = ast
    .toString()
    .replace(
      /url\(\"([^\"]+)\.ttf\"\)(?:\s*format\([\"']truetype[\"']\))?/g,
      'url("$1.woff2") format("woff2")',
    );
}
const packed = Object.fromEntries(
  Object.entries(pages).map(([key, page]) => [
    key,
    {
      data: zlib
        .brotliCompressSync(Buffer.from(JSON.stringify(page)), {
          params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 },
        })
        .toString("base64"),
    },
  ]),
);
const raw = Buffer.from(JSON.stringify(packed));
fs.writeFileSync(
  "content/site-catalog.json.br",
  zlib.brotliCompressSync(raw, {
    params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 6 },
  }),
);
fs.writeFileSync(
  "content/routes.json",
  JSON.stringify(
    Object.values(pages).map((p) => ({
      path: p.path,
      key: p.key,
      title: p.meta.title,
      canonical: p.meta.canonical,
      robots: p.meta.robots,
      sourceUrl: p.sourceUrl,
    })),
  ),
);
fs.writeFileSync(
  auditRoot + "/compile-failures.json",
  JSON.stringify(failures, null, 2),
);
console.log(
  JSON.stringify({
    pages: Object.keys(pages).length,
    assets: assetUrls.size,
    modelBytes: raw.length,
    compressedBytes: fs.statSync("content/site-catalog.json.br").size,
    failures: failures.length,
  }),
);
