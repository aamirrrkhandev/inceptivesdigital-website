import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import SnapshotSection from "./SnapshotSection";
import TheBusinessChallengeSection from "./TheBusinessChallengeSection";
import WhatWeBuiltSection from "./WhatWeBuiltSection";
import ProductStrategyDecisionsSection from "./ProductStrategyDecisionsSection";
import TheSolutionSection from "./TheSolutionSection";
import OutcomesImpactSection from "./OutcomesImpactSection";
import MarketplaceOperationsDashboardSection from "./MarketplaceOperationsDashboardSection";
import TechnologyDecisionsSection from "./TechnologyDecisionsSection";
import EngineeringExcellenceBehindOurMobileAppDevelopmentServicesSection from "./EngineeringExcellenceBehindOurMobileAppDevelopmentServicesSection";
import OutcomesSection from "./OutcomesSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c3bca1a": HeroSection,
  "3355680": SnapshotSection,
  "d049048": TheBusinessChallengeSection,
  "3ea39cf": WhatWeBuiltSection,
  "0d7786d": ProductStrategyDecisionsSection,
  "6cafb81": TheSolutionSection,
  "0decb82": OutcomesImpactSection,
  "ca91c07": MarketplaceOperationsDashboardSection,
  "3bd17b78": TechnologyDecisionsSection,
  "7c6d5c62": EngineeringExcellenceBehindOurMobileAppDevelopmentServicesSection,
  "6a3ecc4": OutcomesSection
  }, false, children);
}
