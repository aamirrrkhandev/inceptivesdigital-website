import { notFound } from "next/navigation";
import routes from "../../../content/routes.json";
import { getWordPressPage } from "@/lib/wordpress-content";
import { pageMetadata } from "@/lib/site-metadata";
import SourceLayout from "@/components/SourceLayout";
import SecondaryServicePage, {
  secondaryPages,
} from "@/components/SecondaryServicePage";
export const dynamicParams = true;
export const revalidate = 30;
export function generateStaticParams() {
  return [
    ...routes
      .filter((r) => r.path !== "/" && !/^\/blog(?:\/[^/]+)?$/.test(r.path))
      .map((r) => r.path),
    ...Object.keys(secondaryPages),
  ].map((path) => ({ slug: path.split("/").filter(Boolean) }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const restored = secondaryPages["/" + slug.join("/")];
  if (restored)
    return pageMetadata({
      path: "/" + slug.join("/"),
      meta: restored.meta,
    } as import("@/lib/site-model").SitePage);
  const page = await getWordPressPage("/" + slug.join("/"));
  if (!page) return {};
  return pageMetadata(page);
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = "/" + slug.join("/");
  if (secondaryPages[path]) return <SecondaryServicePage path={path} />;
  const page = await getWordPressPage("/" + slug.join("/"));
  if (!page) notFound();
  return <SourceLayout page={page} />;
}
