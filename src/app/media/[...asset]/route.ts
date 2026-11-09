import { mediaIndex, mediaResponse } from "@/lib/static-media";
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(mediaIndex)
    .filter((k) => k.startsWith("/media/") && mediaIndex[k].size <= 20_000_000)
    .map((k) => ({
      asset: k.slice("/media/".length).split("/").map(decodeURIComponent),
    }));
}
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ asset: string[] }> },
) {
  const { asset } = await params;
  return mediaResponse("/media/" + asset.join("/"));
}
