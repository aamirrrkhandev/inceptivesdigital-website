import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import AtAGlanceSection from "./AtAGlanceSection";
import TheChallengeSection from "./TheChallengeSection";
import WhatHadSection from "./WhatHadSection";
import ProductStrategyDecisionsSection from "./ProductStrategyDecisionsSection";
import TheSolutionSection from "./TheSolutionSection";
import ImpactSnapshotSection from "./ImpactSnapshotSection";
import AdministrativeDashboardSection from "./AdministrativeDashboardSection";
import TechnologyDecisionsSection from "./TechnologyDecisionsSection";
import OutcomesSection from "./OutcomesSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c3bca1a": HeroSection,
  "3355680": AtAGlanceSection,
  "d049048": TheChallengeSection,
  "3ea39cf": WhatHadSection,
  "0d7786d": ProductStrategyDecisionsSection,
  "6cafb81": TheSolutionSection,
  "0decb82": ImpactSnapshotSection,
  "ca91c07": AdministrativeDashboardSection,
  "3a5cf03f": TechnologyDecisionsSection,
  "6a3ecc4": OutcomesSection
  }, false, children);
}
