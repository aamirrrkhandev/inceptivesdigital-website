import { readPackedFile } from "./packed-file";
import index from "../../content/media-index.json";
type Entry = {
  pack: number;
  offset: number;
  size: number;
  type: string;
  width?: number;
  height?: number;
  optimized?: string;
  poster?: string;
  mobileVideo?: string;
};
export const mediaIndex = index as Record<string, Entry>;
export function mediaResponse(key: string) {
  const entry = mediaIndex[key] || mediaIndex[encodeURI(key)];
  if (!entry) return new Response("Not found", { status: 404 });
  const bytes = readPackedFile(`content/media/${entry.pack}.pack`, entry.offset, entry.size);
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": entry.type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
