import { notFound } from "next/navigation";
import routes from "../../../../content/routes.json";
import SourceLayout from "@/components/SourceLayout";
import { getWordPressPage } from "@/lib/wordpress-content";
import { pageMetadata } from "@/lib/site-metadata";
export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const revalidate = 0;
export function generateStaticParams() {
  return routes
    .filter((route) => /^\/blog\/[^/]+$/.test(route.path))
    .map((route) => ({ postSlug: route.path.split("/")[2] }));
}
type Props = { params: Promise<{ postSlug: string }> };
export async function generateMetadata({ params }: Props) {
  const page = await getWordPressPage("/blog/" + (await params).postSlug);
  return page ? pageMetadata(page) : {};
}
export default async function Post({ params }: Props) {
  const page = await getWordPressPage("/blog/" + (await params).postSlug);
  if (!page) notFound();
  return <SourceLayout page={page} />;
}
