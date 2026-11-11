import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import AtAGlanceSection from "./AtAGlanceSection";
import TheChallengeSection from "./TheChallengeSection";
import WhatHadSection from "./WhatHadSection";
import ProductStrategyDecisionsSection from "./ProductStrategyDecisionsSection";
import TheSolutionSection from "./TheSolutionSection";
import OutcomesImpactSection from "./OutcomesImpactSection";
import GovernanceDashboardSection from "./GovernanceDashboardSection";
import TechnologyDecisionsSection from "./TechnologyDecisionsSection";
import OutcomesSection from "./OutcomesSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c3bca1a": HeroSection,
  "3355680": AtAGlanceSection,
  "d049048": TheChallengeSection,
  "3ea39cf": WhatHadSection,
  "2dc47c1": ProductStrategyDecisionsSection,
  "6cafb81": TheSolutionSection,
  "0decb82": OutcomesImpactSection,
  "ca91c07": GovernanceDashboardSection,
  "7c6d5c62": TechnologyDecisionsSection,
  "00c4b09": OutcomesSection
  }, false, children);
}
