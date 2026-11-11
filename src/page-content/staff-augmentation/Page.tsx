import { getPage } from "@/lib/site-model";
import { pageMetadata } from "@/lib/site-metadata";
import Sections from "./components/Sections";
export function generateMetadata(){ return pageMetadata(getPage("/staff-augmentation")!); }
export default function Page(){ return <Sections page={getPage("/staff-augmentation")!} />; }
