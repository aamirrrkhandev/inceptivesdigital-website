import { notFound } from "next/navigation";
import SourceLayout from "@/components/SourceLayout";
import { getWordPressPage } from "@/lib/wordpress-content";
import { pageMetadata } from "@/lib/site-metadata";
type Props = {
  searchParams: Promise<{
    pagination_page?: string;
    blog_view?: string;
    blog_cat?: string;
    blog_search?: string;
  }>;
};
const query = (params: Awaited<Props["searchParams"]>) =>
  new URLSearchParams(
    Object.entries(params)
      .filter(
        ([key, value]) =>
          ["pagination_page", "blog_view", "blog_cat", "blog_search"].includes(
            key,
          ) && typeof value === "string",
      )
      .map(([key, value]) => [key, value!.slice(0, 200)]),
  ).toString();
export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  const page = await getWordPressPage("/blog", query(params));
  if (!page) return {};
  const metadata = pageMetadata(page);
  if (params.blog_cat || params.blog_search) {
    metadata.robots = {
      index: false,
      follow: process.env.ALLOW_INDEXING === "true",
    };
    metadata.alternates = {
      ...metadata.alternates,
      canonical: "https://inceptivesdigital.com/blog",
    };
  }
  return metadata;
}
export default async function Blog({ searchParams }: Props) {
  const page = await getWordPressPage("/blog", query(await searchParams));
  if (!page) notFound();
  return <SourceLayout page={page} />;
}
