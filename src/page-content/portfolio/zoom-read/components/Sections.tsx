import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import AtAGlanceSection from "./AtAGlanceSection";
import TheBusinessChallengeSection from "./TheBusinessChallengeSection";
import WhatWeBuiltSection from "./WhatWeBuiltSection";
import CoreProductDecisionsSection from "./CoreProductDecisionsSection";
import MonetisationArchitectureSection from "./MonetisationArchitectureSection";
import TechnologyDecisionsSection from "./TechnologyDecisionsSection";
import OutcomesSection from "./OutcomesSection";
import ResultsAtAGlanceSection from "./ResultsAtAGlanceSection";
import ManagementDashboardSection from "./ManagementDashboardSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "1ee1a6b5": HeroSection,
  "6eee27b6": AtAGlanceSection,
  "e2446e9": TheBusinessChallengeSection,
  "508c03b7": WhatWeBuiltSection,
  "59d57480": CoreProductDecisionsSection,
  "a716fae": MonetisationArchitectureSection,
  "5c51fffb": TechnologyDecisionsSection,
  "7c54a203": OutcomesSection,
  "33042996": ResultsAtAGlanceSection,
  "500278da": ManagementDashboardSection
  }, false, children);
}
