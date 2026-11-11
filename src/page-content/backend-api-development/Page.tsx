import SourceLayout from "@/components/SourceLayout";
import { getPage } from "@/lib/site-model";
import { pageMetadata } from "@/lib/site-metadata";
import Sections from "./components/Sections";

export function generateMetadata() { return pageMetadata(getPage("/backend-api-development")!); }

export default function Page() {
  const page = getPage("/backend-api-development")!;
  return <SourceLayout page={page} homepageCaseStudySlider={false} mainContent={<Sections page={page} />} />;
}
