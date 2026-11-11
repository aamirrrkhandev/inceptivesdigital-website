import { notFound } from "next/navigation";
import { getWordPressPage } from "@/lib/wordpress-content";
import { readEditableConfig } from "@/lib/editable-pages";
import { pageMetadata } from "@/lib/site-metadata";
import Sections from "./components/Sections";
import "./styles.css";
export const revalidate = 30;
async function getPage() {
  const page = await getWordPressPage("/press-release");
  if (!page) notFound();
  const seo = readEditableConfig("/press-release", "seo.json");
  const schema = readEditableConfig("/press-release", "schema.json");
  return {...page,meta:{...page.meta,...seo.overrides,...(schema.overrides ? {schema:schema.overrides} : {})}};
}
export async function generateMetadata() {return pageMetadata(await getPage());}
export default async function Page() {return <Sections page={await getPage()} />;}
