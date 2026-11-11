import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import CoverageScopeSection from "./CoverageScopeSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "da9633c": HeroSection,
  "9c82916": CoverageScopeSection
  }, false, children);
}
