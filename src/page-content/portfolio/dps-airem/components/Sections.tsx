import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import AtAGlanceSection from "./AtAGlanceSection";
import TheChallengeSection from "./TheChallengeSection";
import WhatHadToBeSolvedSection from "./WhatHadToBeSolvedSection";
import ProductStrategyDecisionsSection from "./ProductStrategyDecisionsSection";
import TheSolutionSection from "./TheSolutionSection";
import OutcomesImpactSection from "./OutcomesImpactSection";
import ManagementDashboardSection from "./ManagementDashboardSection";
import TechnologyDecisionsSection from "./TechnologyDecisionsSection";
import OutcomesSection from "./OutcomesSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c3bca1a": HeroSection,
  "3355680": AtAGlanceSection,
  "d049048": TheChallengeSection,
  "3ea39cf": WhatHadToBeSolvedSection,
  "0d7786d": ProductStrategyDecisionsSection,
  "6cafb81": TheSolutionSection,
  "0decb82": OutcomesImpactSection,
  "ca91c07": ManagementDashboardSection,
  "704e4203": TechnologyDecisionsSection,
  "6a3ecc4": OutcomesSection
  }, false, children);
}
