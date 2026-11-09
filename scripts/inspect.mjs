import fs from "node:fs";
import * as cheerio from "cheerio";
const $ = cheerio.load(fs.readFileSync("audit/raw/home.html", "utf8"));
const widgets = [];
$("[data-widget_type]").each((i, e) => {
  const q = $(e);
  widgets.push({
    id: q.attr("data-id"),
    type: q.attr("data-widget_type"),
    text: q.text().replace(/\s+/g, " ").trim().slice(0, 500),
    images: q
      .find("img")
      .map((i, x) => ({ alt: $(x).attr("alt"), src: $(x).attr("src") }))
      .get(),
  });
});
fs.writeFileSync("audit/widgets.json", JSON.stringify(widgets, null, 2));
fs.writeFileSync("audit/source-text.txt", $("body").text());
console.log(
  widgets
    .filter((w) => w.type === "html.default")
    .map((w) => ({ id: w.id, text: w.text.slice(0, 180) })),
);
console.log(
  $("main").length,
  $("[data-elementor-type]")
    .map((i, e) => ({
      type: $(e).attr("data-elementor-type"),
      id: $(e).attr("data-elementor-id"),
    }))
    .get(),
);
fs.writeFileSync(
  "audit/raw/inline.css",
  $("style")
    .map((i, e) => $(e).text())
    .get()
    .join("\n"),
);
