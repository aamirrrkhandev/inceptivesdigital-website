import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";
import * as cheerio from "cheerio";
import postcss from "postcss";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url),
  acorn = require("next/dist/compiled/acorn");
const incremental = Boolean(process.argv[2]);
const slugs = incremental ? [process.argv[2]] : [
  "web-development",
  "staff-augmentation",
  "iot-development",
  "virtual-reality-development",
  "ar-app-development",
];
const host = "https://inceptives.vercel.app";
const assets = new Map(),
  cssURLs = new Set();
async function asset(input, base = host) {
  if (!input || input.startsWith("data:") || input.startsWith("#"))
    return input;
  let url = new URL(input, base);
  if (url.pathname === "/_next/image")
    url = new URL(url.searchParams.get("url"), host);
  if (url.origin !== host) return url.href;
  url.search = "";
  const key = url.href;
  if (!assets.has(key))
    assets.set(
      key,
      (async () => {
        const relative =
          "/restored-assets/" +
          crypto.createHash("sha1").update(key).digest("hex").slice(0, 10) +
          "-" +
          path.basename(url.pathname);
        const file = "public" + relative;
        fs.mkdirSync(path.dirname(file), { recursive: true });
        if (!fs.existsSync(file)) {
          const r = await fetch(key);
          if (!r.ok) throw Error("Asset " + r.status + " " + key);
          fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
        }
        return relative;
      })(),
    );
  return assets.get(key);
}
const catalog = JSON.parse(
  zlib.brotliDecompressSync(fs.readFileSync("content/site-catalog.json.br")),
);
const contact = JSON.parse(
  zlib.brotliDecompressSync(Buffer.from(catalog["/contact-us"].data, "base64")),
);
let currentOrganization;
function findOrganization(value) {
  if (!value || typeof value !== "object") return;
  if (value["@type"] === "Organization") currentOrganization = value;
  for (const item of Object.values(value)) {
    if (Array.isArray(item)) item.forEach(findOrganization);
    else if (item && typeof item === "object") findOrganization(item);
  }
}
contact.meta.schema.forEach(findOrganization);
if (!currentOrganization) throw Error("Current WordPress brand schema missing");
function currentBrandSchema(value) {
  if (Array.isArray(value)) return value.map(currentBrandSchema);
  if (value && typeof value === "object") {
    if (value["@type"] === "Organization") return { "@context": "https://schema.org", ...currentOrganization };
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, currentBrandSchema(item)]));
  }
  return value;
}
let footerForm;
function find(n) {
  if (typeof n === "string") return;
  if (n.tag === "form" && JSON.stringify(n).includes("06b8e60")) footerForm = n;
  for (const c of n.children || []) find(c);
}
contact.nodes.forEach(find);
if (!footerForm) throw Error("Shared contact contract missing");
const nodes = [];
function flatten(n) {
  if (typeof n === "string") return;
  nodes.push(n);
  for (const c of n.children || []) flatten(c);
}
flatten(footerForm);
const hidden = nodes.filter(
  (n) => n.tag === "input" && n.props.type === "hidden",
);
const verification = nodes.find((n) => n.props["data-contact-verification"]);
const consent = nodes.filter((n) =>
  n.children.some(
    (child) =>
      typeof child !== "string" &&
      child.tag === "input" &&
      child.props.type === "checkbox",
  ),
);
if (consent.length !== 2) throw Error("Privacy consent contract missing");
function prefixIds(node) {
  if (typeof node === "string") return node;
  return {
    ...node,
    props: {
      ...node.props,
      ...(node.props.id ? { id: "secondary-" + node.props.id } : {}),
      ...(node.props.htmlFor
        ? { htmlFor: "secondary-" + node.props.htmlFor }
        : {}),
    },
    children: node.children.map(prefixIds),
  };
}
function fieldHTML(node) {
  if (typeof node === "string") return node;
  const attrs = Object.entries(node.props)
    .filter(([k]) => !["style"].includes(k))
    .map(
      ([k, v]) =>
        `${k === "className" ? "class" : k === "htmlFor" ? "for" : k === "defaultValue" ? "value" : k}="${String(v).replaceAll("&", "&amp;").replaceAll('"', "&quot;")}"`,
    )
    .join(" ");
  return `<${node.tag} ${attrs}>${["input", "img", "br"].includes(node.tag) ? "" : node.children.map(fieldHTML).join("") + "</" + node.tag + ">"}`;
}
const pages = incremental ? JSON.parse(fs.readFileSync("content/secondary-pages.json")) : {};
async function localize($, root) {
  for (const el of root.find("[src],[poster]").toArray())
    for (const name of ["src", "poster"])
      if ($(el).attr(name)) $(el).attr(name, await asset($(el).attr(name)));
  root.find("[srcset]").removeAttr("srcset");
  for (const el of root.find("[style]").toArray()) {
    let style = $(el).attr("style");
    const matches = [...style.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)];
    for (const m of matches)
      style = style.replace(m[0], `url("${await asset(m[1])}")`);
    if (/opacity:\s*0(?:;|$)/.test(style))
      style = style
        .replace(/opacity:\s*0(?=;|$)/g, "opacity:1")
        .replace(/transform:[^;]+;?/g, "");
    $(el).attr("style", style);
  }
}
function convert(node) {
  if (node.type === "text") return node.data;
  if (
    node.type !== "tag" ||
    ["script", "style", "noscript", "template"].includes(node.name)
  )
    return null;
  const props = {};
  const names = {
    class: "className",
    for: "htmlFor",
    tabindex: "tabIndex",
    viewbox: "viewBox",
    "fill-rule": "fillRule",
    "clip-rule": "clipRule",
    "stroke-width": "strokeWidth",
    "stroke-linecap": "strokeLinecap",
    "stroke-linejoin": "strokeLinejoin",
    autoplay: "autoPlay",
    playsinline: "playsInline",
    srcset: "srcSet",
    maxlength: "maxLength",
    autocomplete: "autoComplete",
  };
  for (const [k, v] of Object.entries(node.attribs)) {
    if (/^on/i.test(k) || ["data-nimg", "srcdoc"].includes(k)) continue;
    if (k === "style") {
      const o = {};
      postcss.parse("x{" + v + "}").walkDecls((d) => {
        o[
          d.prop.startsWith("--")
            ? d.prop
            : d.prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        ] = d.value;
      });
      props.style = o;
      continue;
    }
    if (
      [
        "disabled",
        "required",
        "checked",
        "multiple",
        "hidden",
        "controls",
        "loop",
        "muted",
        "autoplay",
        "playsinline",
      ].includes(k)
    ) {
      props[k === "checked" ? "defaultChecked" : names[k] || k] = true;
      continue;
    }
    if (k === "value" && node.name === "input") {
      props.defaultValue = v;
      continue;
    }
    props[names[k] || k] = v;
  }
  return {
    tag: node.name,
    props,
    children: (node.children || []).map(convert).filter((n) => n !== null),
  };
}
for (const slug of slugs) {
  const $ = cheerio.load(
    fs.readFileSync("audit/secondary-vercel/" + slug + "-rendered.html"),
  );
  const root = $("body")
    .children("div")
    .filter((i, e) => $(e).find("h1").length)
    .first()
    .children("section")
    .filter((i, e) => $(e).find("h1").length)
    .first();
  if (!root.length) throw Error("Page body unavailable " + slug);
  $("link[rel=stylesheet]").each((i, e) =>
    cssURLs.add(new URL($(e).attr("href"), host).href),
  );
  root.find("script,style,noscript,template").remove();
  root.find("a[href]").each((_, element) => {
    const value = $(element).attr("href");
    if (!value || value.startsWith("#")) return;
    const url = new URL(value, host);
    if ([host, "https://inceptivesdigital.com"].includes(url.origin))
      $(element).attr("href", url.pathname + url.search + url.hash);
  });
  root.find("form").each((i, e) => {
    const form = $(e);
    form.attr({
      "data-contact-form": "true",
      "data-source-path": "/contact-us",
    });
    const mapping = {
      name: "name",
      email: "email",
      phone: "field_6a28af4",
      subject: "field_13e5cfd",
      message: "message",
    };
    form.find("input,textarea").each((_, el) => {
      const name = $(el).attr("name");
      if (mapping[name])
        $(el).attr("name", "form_fields[" + mapping[name] + "]");
    });
    // Keep the source form's existing consent control and map only the marketing
    // choice it actually asks for; do not infer transactional consent.
    form.find('input[type="checkbox"][name="consent"]').attr({
      name: "form_fields[field_37e8e1c]",
      value: "I consent to receive marketing and promotional messages from Inceptives Digital at the phone number provided. Message frequency may vary. Message & data rates may apply. Reply HELP for help or STOP to opt out.",
    });
    form.append(hidden.map(fieldHTML).join(""));
    form.find("button[type=submit]").before(fieldHTML(verification));
  });
  // Existing FAQ text stays intact; use explicit accessible toggles instead of old React handlers.
  root.find("h3").each((i, e) => {
    const header = $(e).parent(),
      card = header.parent();
    if (card.hasClass("cursor-pointer") && card.children().length === 2) {
      const answerId = slug + "-faq-" + i;
      header.attr({
        "data-secondary-faq": "true",
        role: "button",
        tabindex: "0",
        "aria-expanded": "false",
        "aria-controls": answerId,
        id: answerId + "-question",
      });
      card
        .children()
        .last()
        .removeAttr("style")
        .attr({
          hidden: "",
          id: answerId,
          role: "region",
          "aria-labelledby": answerId + "-question",
        });
    }
  });
  const variants = JSON.parse(
    fs.readFileSync("audit/secondary-vercel/" + slug + "-tabs.json"),
  );
  for (const [id, items] of Object.entries(variants)) {
    const widget = root.find('[data-secondary-tabs="' + id + '"]');
    widget
      .find("button,[data-secondary-tab]")
      .each((i, e) =>
        $(e).attr({
          "data-secondary-tab": String(i),
          role: "tab",
          "aria-selected": String(i === 0),
          tabindex: i === 0 ? "0" : "-1",
          id: slug + "-" + id + "-tab-" + i,
          "aria-controls": slug + "-" + id + "-panel-" + i,
        }),
      );
    widget
      .find("[data-secondary-tab]")
      .first()
      .parent()
      .attr({
        role: "tablist",
        "aria-label": id.startsWith("process")
          ? "Staff augmentation process"
          : "Technology platforms",
      });
    const panel = widget.find("[data-secondary-tab-panel]");
    panel.empty();
    for (let i = 0; i < items.length; i++) {
      const variant = $("<div></div>")
        .attr({
          "data-secondary-panel": String(i),
          role: "tabpanel",
          id: slug + "-" + id + "-panel-" + i,
          "aria-labelledby": slug + "-" + id + "-tab-" + i,
        })
        .html(items[i].html);
      if (i) variant.attr("hidden", "");
      panel.append(variant);
    }
  }
  if (slug === "staff-augmentation")
    root
      .find("h2")
      .filter((i, e) => $(e).text().includes("Design Your Ultimate Tech Team"))
      .first()
      .parent()
      .parent()
      .replaceWith('<div data-secondary-team="true"></div>');
  root
    .find(".embla__viewport")
    .attr({ "data-secondary-carousel": "true", tabindex: "0" })
    .css({ "overflow-x": "auto", "scroll-snap-type": "x mandatory" });
  root.find(".embla__container,.embla__slide").css("transform", "none");
  root.find("button").filter((_,element)=>$(element).text().trim().toLowerCase()==="swipe").each((_,element)=>{
    const button=$(element);
    const owner=button.parents().filter((_,parent)=>$(parent).find(".overflow-hidden").length>0).first();
    const viewport=owner.find(".overflow-hidden").first();
    if(viewport.length){
      button.attr({"data-secondary-arrow":"1","aria-label":"Next blog articles"});
      viewport.attr({"data-secondary-carousel":"true","data-secondary-step":"1",tabindex:"0"}).css({"overflow-x":"auto","scroll-snap-type":"x mandatory"});
      viewport.children().css("transform","none").children().css({transform:"none","scroll-snap-align":"start"});
    }
  });
  root
    .find("button")
    .has(".lucide-arrow-left")
    .each((i, e) => {
      const viewport = $(e)
        .parent()
        .parent()
        .parent()
        .children(".overflow-hidden")
        .first();
      if (viewport.length) {
        viewport
          .attr({
            "data-secondary-carousel": "true",
            "data-secondary-step": "1",
            tabindex: "0",
          })
          .css({ "overflow-x": "auto", "scroll-snap-type": "x mandatory" });
        viewport
          .children()
          .css("transform", "none")
          .children()
          .css({ transform: "none", "scroll-snap-align": "start" });
      }
    });
  root
    .find("button")
    .filter((i, e) => !$(e).text().trim())
    .each((i, e) => {
      const button = $(e);
      if (button.find(".lucide-arrow-up").length)
        button.attr({
          "data-secondary-top": "true",
          "aria-label": "Back to top",
        });
      else
        button.attr({
          "data-secondary-arrow": button.find(".lucide-arrow-left").length
            ? "-1"
            : "1",
          "aria-label": button.find(".lucide-arrow-left").length
            ? "Previous slide"
            : "Next slide",
        });
    });
  await localize($, root);
  const meta = {
    title: $("head title").first().text(),
    description: $("meta[name=description]").attr("content") || "",
    canonical: "https://inceptivesdigital.com/" + slug,
    robots: "index, follow",
    metadata: $("meta[property],meta[name^=twitter]")
      .map((i, e) => ({
        name: $(e).attr("property") || $(e).attr("name"),
        content: ($(e).attr("content") || "").replaceAll(
          host,
          "https://inceptivesdigital.com",
        ),
      }))
      .get(),
    schema: $('script[type="application/ld+json"]')
      .map((i, e) => {
        try {
          return JSON.parse(
            $(e).text().replaceAll(host, "https://inceptivesdigital.com"),
          );
        } catch {
          return null;
        }
      })
      .get()
      .filter(Boolean),
    headings: root
      .find("h1,h2,h3,h4,h5,h6")
      .map((i, e) => ({ level: e.tagName, text: $(e).text().trim() }))
      .get(),
    hreflang: [],
  };
  meta.schema = currentBrandSchema(meta.schema);
  pages["/" + slug] = {
    sourceUrl: host + "/" + slug,
    meta,
    sections: root.children().toArray().map(convert).filter(Boolean),
  };
  if (!pages["/" + slug].sections.length || root.find("h1").length !== 1 || root.text().trim().length < 300)
    throw Error("Incomplete page content " + slug);
  console.log("Prepared " + slug);
}
let css = "";
for (const url of cssURLs) {
  let text = await (await fetch(url)).text();
  for (const m of [...text.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)])
    text = text.replace(m[0], `url("${await asset(m[1], url)}")`);
  const ast = postcss.parse(text);
  ast.walkAtRules("layer", (rule) => {
    if (rule.nodes) rule.replaceWith(...rule.nodes);
    else rule.remove();
  });
  ast.walkRules((rule) => {
    if (rule.parent?.type === "atrule" && /keyframes/.test(rule.parent.name))
      return;
    rule.selectors = rule.selectors.map((s) => {
      const replaced = s.replace(
        /(?<![\w-])(?:html|body|:root|:host)(?![\w-])/g,
        ".secondary-service-page",
      );
      return replaced.startsWith(".secondary-service-page")
        ? replaced
        : ".secondary-service-page " + replaced;
    });
  });
  css += "\n" + ast.toString();
}
css +=
  "\n.secondary-service-page{font-family:sfPro,Arial,sans-serif;--font-sf-pro:sfPro;color:white;background:black;isolation:isolate;overflow-x:clip}.secondary-service-page [hidden]{display:none!important}.secondary-service-page button{cursor:pointer}.secondary-service-page [data-secondary-faq]:focus-visible{outline:2px solid #00ce44}.secondary-service-page [data-secondary-panel] img{max-width:100%}.secondary-service-page form input[type=checkbox]{width:auto}.secondary-service-page form label{color:inherit}";
if (!incremental) {
  fs.writeFileSync("content/secondary-pages.json", JSON.stringify(pages));
  fs.writeFileSync("content/secondary-styles.json", JSON.stringify(css));
}
css +=
  "\n.secondary-service-page{margin-top:-80px;line-height:1.5}.secondary-service-page :is(h1,h2,h3,h4,h5,h6,p,a,button,input,textarea,select){font-family:inherit;line-height:inherit}@media(max-width:1024px){.secondary-service-page{margin-top:-74px}}@media(max-width:767px){.secondary-service-page{margin-top:-66px}}";
if (incremental) {
  fs.writeFileSync("content/secondary-pages.json", JSON.stringify(pages));
  const styles = fs.existsSync("content/secondary-page-styles.json")
    ? JSON.parse(fs.readFileSync("content/secondary-page-styles.json")) : {};
  styles["/" + slugs[0]] = css;
  fs.writeFileSync("content/secondary-page-styles.json", JSON.stringify(styles));
  const previous = JSON.parse(fs.readFileSync("content/secondary-assets.json"));
  const merged = new Map(previous.map((entry) => [entry.source, entry]));
  for (const [source, promise] of assets) {
    const file = await promise;
    merged.set(source, { source, file, bytes: fs.statSync("public" + file).size });
  }
  fs.writeFileSync("content/secondary-assets.json", JSON.stringify([...merged.values()]));
  console.log(JSON.stringify({ incremental: slugs[0], pages: Object.keys(pages).length, assets: merged.size }));
  process.exit(0);
}
fs.writeFileSync("content/secondary-styles.json", JSON.stringify(css));
const tree = acorn.parse(
    fs.readFileSync(
      "audit/secondary-vercel/staff-augmentation-page.js",
      "utf8",
    ),
    { ecmaVersion: "latest" },
  ),
  variables = new Map();
function walk(n) {
  if (!n || typeof n !== "object") return;
  if (n.type === "VariableDeclarator" && n.id.type === "Identifier")
    variables.set(n.id.name, n.init);
  for (const v of Object.values(n))
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") walk(v);
}
walk(tree);
function literal(n, depth = 0) {
  if (depth > 15) throw Error("Nonliteral data");
  if (n.type === "Literal") return n.value;
  if (n.type === "Identifier") return literal(variables.get(n.name), depth + 1);
  if (n.type === "ArrayExpression")
    return n.elements.map((x) => literal(x, depth + 1));
  if (n.type === "ObjectExpression")
    return Object.fromEntries(
      n.properties.map((p) => [
        p.key.name || p.key.value,
        literal(p.value, depth + 1),
      ]),
    );
  throw Error("Unexpected expression " + n.type);
}
let team;
for (const n of variables.values())
  if (
    n?.type === "ObjectExpression" &&
    n.properties.some((p) => (p.key.name || p.key.value) === "developer") &&
    n.properties.some((p) => (p.key.name || p.key.value) === "consultant")
  )
    team = literal(n);
if (!team) throw Error("Original staff questionnaire configuration missing");
fs.writeFileSync(
  "content/secondary-team.json",
  JSON.stringify({
    roles: team,
    durations: [
      { value: "1-2", label: "1 - 2 months" },
      { value: "3-6", label: "3 - 6 months" },
      { value: "6+", label: "6+ months" },
    ],
    numbers: [
      { value: "1", label: "1" },
      { value: "2-5", label: "2 - 5" },
      { value: "5-10", label: "5 - 10" },
      { value: "10+", label: "10+" },
    ],
  }),
);
const manifest = [];
for (const [source, promise] of assets) {
  const file = await promise;
  manifest.push({ source, file, bytes: fs.statSync("public" + file).size });
}
fs.writeFileSync("content/secondary-assets.json", JSON.stringify(manifest));
fs.writeFileSync(
  "content/secondary-form-contract.json",
  JSON.stringify({ hidden, verification, consent }),
);
console.log(
  JSON.stringify({
    pages: Object.keys(pages).length,
    assets: manifest.length,
    bytes: manifest.reduce((n, a) => n + a.bytes, 0),
  }),
);
