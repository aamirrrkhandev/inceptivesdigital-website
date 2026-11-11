import SourceLayout from "@/components/SourceLayout";
import { getPage } from "@/lib/site-model";
import { pageMetadata } from "@/lib/site-metadata";
import Sections from "./components/Sections";

export function generateMetadata() { return pageMetadata(getPage("/")!); }

export default function Page() {
  const page = getPage("/")!;
  return <SourceLayout page={page} homepageCaseStudySlider={true} mainContent={<Sections page={page} />} />;
}
