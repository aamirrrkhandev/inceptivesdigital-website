import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import AtAGlanceSection from "./AtAGlanceSection";
import TheBusinessChallengeSection from "./TheBusinessChallengeSection";
import WhatWeBuiltSection from "./WhatWeBuiltSection";
import CoreProductDecisionsSection from "./CoreProductDecisionsSection";
import ProductImpactSection from "./ProductImpactSection";
import OutcomesImpactSection from "./OutcomesImpactSection";
import OperationsDashboardSection from "./OperationsDashboardSection";
import TechnologyDecisionsSection from "./TechnologyDecisionsSection";
import OutcomesSection from "./OutcomesSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c3bca1a": HeroSection,
  "3355680": AtAGlanceSection,
  "d049048": TheBusinessChallengeSection,
  "3ea39cf": WhatWeBuiltSection,
  "0d7786d": CoreProductDecisionsSection,
  "6cafb81": ProductImpactSection,
  "0decb82": OutcomesImpactSection,
  "ca91c07": OperationsDashboardSection,
  "79a3a91c": TechnologyDecisionsSection,
  "6a3ecc4": OutcomesSection
  }, false, children);
}
