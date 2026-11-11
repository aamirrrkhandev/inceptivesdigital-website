import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import AtAGlanceSection from "./AtAGlanceSection";
import TheProductSection from "./TheProductSection";
import WhatWeBuiltSection from "./WhatWeBuiltSection";
import CriticalProductDecisionsSection from "./CriticalProductDecisionsSection";
import TheSolutionSection from "./TheSolutionSection";
import PlatformAdministrationConsoleSection from "./PlatformAdministrationConsoleSection";
import TechnologyStackSection from "./TechnologyStackSection";
import ProductOutcomesSection from "./ProductOutcomesSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c3bca1a": HeroSection,
  "3355680": AtAGlanceSection,
  "d049048": TheProductSection,
  "3ea39cf": WhatWeBuiltSection,
  "0d7786d": CriticalProductDecisionsSection,
  "6cafb81": TheSolutionSection,
  "ca91c07": PlatformAdministrationConsoleSection,
  "5afd21fc": TechnologyStackSection,
  "00c4b09": ProductOutcomesSection
  }, false, children);
}
