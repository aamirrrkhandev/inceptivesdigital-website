import { getPage } from "@/lib/site-model";
import { pageMetadata } from "@/lib/site-metadata";
import SourceLayout from "@/components/SourceLayout";
export function generateMetadata() {
  return pageMetadata(getPage("/")!);
}
export default function Home() {
  return <SourceLayout page={getPage("/")!} homepageCaseStudySlider />;
}
