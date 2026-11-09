import source from "@/content/source.json";
import assets from "@/content/assets.json";
export type Asset = { src: string; alt: string };
export const asset = (src: string) =>
  (assets as Record<string, string>)[src] || src;
export const file = (name: string) => "/assets/" + name;
export const data = source;
export type Block = (typeof source.sections)["597d6232"]["blocks"][number];
export const section = (id: keyof typeof source.sections) =>
  source.sections[id];
export const texts = (id: keyof typeof source.sections) =>
  section(id)
    .blocks.filter((b) => b.type === "text-editor.default")
    .map((b) => b.text);
export const headings = (id: keyof typeof source.sections) =>
  section(id)
    .blocks.filter((b) => b.type === "heading.default")
    .map((b) => b.text);
export const getCards = (id: "597d6232" | "34840db5") => {
  const b = section(id).blocks;
  return b.flatMap((x, i) =>
    x.type === "image.default"
      ? [
          {
            image: x.images[0],
            title: b[i + 1].text,
            href: b[i + 1].links[0]?.href,
            description: b[i + 2].text,
          },
        ]
      : [],
  );
};
