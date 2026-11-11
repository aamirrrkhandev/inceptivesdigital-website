import { getWordPressBlogListing } from "@/lib/wordpress-content";
import { prepareBlogListing } from "@/lib/blog-listing";
export async function GET(request: Request) {
  const input = new URL(request.url).searchParams;
  const category = (input.get("blog_cat") || "all").slice(0, 80);
  const search = (input.get("blog_search") || "").slice(0, 200);
  const view = ["mobile", "tablet"].includes(input.get("blog_view") || "")
    ? input.get("blog_view")!
    : "desktop";
  const page = Math.max(
    1,
    Math.min(1000, Number(input.get("pagination_page")) || 1),
  );
  const headers = {
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "private, no-store",
  };
  if (!/^[a-z0-9-]+$/.test(category))
    return Response.json(
      { error: "Invalid category" },
      { status: 400, headers },
    );
  try {
    const listing = await getWordPressBlogListing({ category, search, view, page });
    if (
      !listing ||
      listing.props["data-category"] !== category ||
      listing.props["data-view"] !== view ||
      String(listing.props["data-page"]) !== String(page) ||
      listing.props["data-search"] !== search
    )
      throw new Error("Listing unavailable");
    return Response.json(
      {
        category,
        search,
        view,
        page,
        nodes: prepareBlogListing(listing.children),
      },
      { headers },
    );
  } catch {
    return Response.json(
      { error: "Posts are temporarily unavailable. Please try again." },
      { status: 503, headers },
    );
  }
}
