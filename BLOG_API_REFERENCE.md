# WordPress blog APIs and editing

Continue writing, editing, publishing and pinning in the current WordPress admin. Staging reads published posts from WordPress; no rebuild is required for ordinary published blog changes. The adapter has a 30-second revalidation interval; the first request after expiry can serve the previous cached response while refreshing, so allow a subsequent refresh. Private, draft and unpublished posts are not public.

Public base: `https://inceptivesdigital.com/wp-json/wp/v2`.

| Purpose | Endpoint |
| --- | --- |
| Published posts and embedded images/categories | `/posts?per_page=100&page=1&_embed` |
| Next batch | `/posts?per_page=100&page=2&_embed` |
| Single post by slug | `/posts?slug=YOUR-SLUG&_embed` |
| Single post by ID | `/posts/POST_ID?_embed` |
| All categories | `/categories?per_page=100` |
| Category by slug | `/categories?slug=press-release` |
| Category posts | `/posts?categories=CATEGORY_ID&per_page=100&page=1&_embed` |
| Exclude category | `/posts?categories_exclude=CATEGORY_ID&per_page=100&page=1` |
| Tags | `/tags?per_page=100` |
| Tag posts | `/posts?tags=TAG_ID&_embed` |
| Search posts | `/posts?search=keyword&_embed` |
| Public author profile | `/users/AUTHOR_ID` |
| Author posts | `/posts?author=AUTHOR_ID&_embed` |
| Featured media details / alt text | `/media/MEDIA_ID` |
| Media search | `/media?search=keyword&per_page=100` |
| Published pages, if needed | `/pages?per_page=100&page=1` |
| API discovery | `/` |

REST responses expose `X-WP-Total` and `X-WP-TotalPages` for pagination. Do not assume all posts fit one request; `per_page` is capped at 100. During the initial audit there were 141 published posts, 15 categories and no tags; those counts can change as you publish.

## SEO, author approval and custom pins

Posts expose `yoast_head_json` (title, description, canonical, robots, social data and schema where supplied). The adapter preserves published page metadata while applying the already approved canonical/preview rules. It reads public WordPress rendered article markup as well as REST data to preserve custom snippets and reviewed-by output.

Custom review metadata are `meta._flow_reviewer_id` and `meta._flow_review_status`. A WordPress author is not automatically the reviewer. The reviewer/status are included in refresh cache identity, so an approval change is not dependent only on the post's modified timestamp. The audited Austin article displayed “Reviewed by: Muhammad Usman” on source and staging.

The site's custom pin checkbox is different from WordPress REST `sticky`. The current pinned test post has `sticky:false`; using `?sticky=true` would miss it. The adapter reads the authoritative `.is-pinned` flags from WordPress's blog output, then places matching API posts first and renders the same Pinned badge. Category/search filters still apply. The regular Blog listing excludes the Press Release category, matching WordPress.

Press Release category ID was 53 at audit time. Resolve it using `/categories?slug=press-release` rather than hardcoding it. Publishing a post in that category updates the WordPress category-fed `/press-release` page; staging refreshes that rendered content automatically. Its seven current articles matched at audit time.

## Staging listing endpoint

`https://inceptives-homepage-review.vercel.app/api/blog-listing?blog_cat=all&blog_view=desktop&pagination_page=1`

Optional parameters: `blog_cat=<category-slug>`, `blog_search=<text>`, `blog_view=desktop|tablet|mobile`, `pagination_page=<number>`. Returns the existing structured listing nodes; it is an internal UI adapter rather than a replacement WordPress publishing API. Tabs fetch this endpoint without document navigation or adding category query parameters to the visible browser URL.

Public read APIs require no password. Administrative publishing APIs require appropriate credentials; never embed those in browser code. Before any future production cutover, retain an independently reachable WordPress backend hostname so that the new frontend's public hostname does not point its own API reads back to itself. This release makes no live-domain or DNS changes.
