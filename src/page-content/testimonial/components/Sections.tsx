import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import Content1Section from "./Content1Section";
import InceptivesDigitalTrustedByTopBrandsSection from "./InceptivesDigitalTrustedByTopBrandsSection";
import ClientReviewsSection from "./ClientReviewsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "30215fd": HeroSection,
  "472acbf": Content1Section,
  "39fa893": InceptivesDigitalTrustedByTopBrandsSection,
  "53b1d87d": ClientReviewsSection
  }, false, children);
}
