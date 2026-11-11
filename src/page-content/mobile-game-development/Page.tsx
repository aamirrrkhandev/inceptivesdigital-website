import { getPage } from "@/lib/site-model";
import { pageMetadata } from "@/lib/site-metadata";
import Sections from "./components/Sections";
export function generateMetadata(){ return pageMetadata(getPage("/mobile-game-development")!); }
export default function Page(){ return <Sections page={getPage("/mobile-game-development")!} />; }
