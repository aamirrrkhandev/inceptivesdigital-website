import assets from "@/content/assets.json";
export type Asset = { src: string; alt: string };
export const asset = (src: string) =>
  (assets as Record<string, string>)[src] || src;
