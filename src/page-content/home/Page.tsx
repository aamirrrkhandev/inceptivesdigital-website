import { preload } from "react-dom";
import { mediaIndex } from "@/lib/static-media";
import SourceLayout from "@/components/SourceLayout";
import { getPage } from "@/lib/site-model";
import { pageMetadata } from "@/lib/site-metadata";
import Sections from "./components/Sections";

export function generateMetadata() { return pageMetadata(getPage("/")!); }

export default function Page() {
  const page = getPage("/")!;
  const hero = mediaIndex["/assets/pages/home/videos/2e77ebc9b3-comp-bannerhero.mp4"];
  if (hero?.poster) preload(hero.poster, { as: "image", fetchPriority: "high", media: "(max-width: 767px)" });
  return <SourceLayout page={page} homepageCaseStudySlider={true} mainContent={<Sections page={page} />} />;
}
