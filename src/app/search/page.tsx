import SourceLayout from "@/components/SourceLayout";
import { getPage } from "@/lib/site-model";
import { loadSearchResults } from "@/lib/wordpress-forms";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Search - Inceptives Digital",
  robots: { index: false, follow: false },
};
export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ s?: string; paged?: string }>;
}) {
  const params = await searchParams;
  const query = (params.s || "").slice(0, 200);
  const pageNumber = Math.max(1, Math.min(100, Number(params.paged) || 1));
  const original = getPage("/")!;
  const page = {
    ...original,
    bodyClass:
      "search search-results wp-theme-hello-migrated hello-migrated-default migrated-default migrated-kit-7",
    meta: { ...original.meta, schema: [], metadata: [] },
  };
  const result = query
    ? await loadSearchResults(query, pageNumber).catch(() => null)
    : null;
  return (
    <SourceLayout
      page={page}
      mainContent={
        <main id="content" className="site-main" key="search">
          <div className="page-header">
            <h1 className="entry-title">
              Search results for: <span>{query}</span>
            </h1>
          </div>
          <div className="page-content">
            {result?.results.map((item) => (
              <article className="post" key={item.href}>
                <h2 className="entry-title">
                  <a href={item.href}>{item.title}</a>
                </h2>
                {item.image && (
                  <a href={item.href}>
                    <img {...item.image} loading="lazy" />
                  </a>
                )}
                <p>{item.excerpt}</p>
              </article>
            ))}
            {result && !result.results.length && (
              <p>It seems we can’t find what you’re looking for.</p>
            )}
            {query && !result && (
              <p role="alert">
                Search is temporarily unavailable. Please try again.
              </p>
            )}
            <nav aria-label="Search results pages">
              {result?.pagination.map((link, index) => (
                <a key={index} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </main>
      }
    />
  );
}
