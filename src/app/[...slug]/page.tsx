import { notFound } from "next/navigation";
import routes from "../../../content/routes.json";
import { getPage } from "@/lib/site-model";
import { pageMetadata } from "@/lib/site-metadata";
import SourceLayout from "@/components/SourceLayout";
export const dynamicParams = false;
export function generateStaticParams() {
  return routes
    .filter((r) => r.path !== "/" && !/^\/blog(?:\/[^/]+)?$/.test(r.path))
    .map((r) => ({ slug: r.path.split("/").filter(Boolean) }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = getPage("/" + slug.join("/"));
  if (!page) return {};
  return pageMetadata(page);
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = getPage("/" + slug.join("/"));
  if (!page) notFound();
  return <SourceLayout page={page} />;
}
