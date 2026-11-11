import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import Content1Section from "./Content1Section";
import OurCoreDigitalProductServicesSection from "./OurCoreDigitalProductServicesSection";
import WhyWorkWithADigitalProductStudioSection from "./WhyWorkWithADigitalProductStudioSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "f7d0a79": HeroSection,
  "1ece00e": Content1Section,
  "47b9374": OurCoreDigitalProductServicesSection,
  "af269f5": WhyWorkWithADigitalProductStudioSection
  }, false, children);
}
