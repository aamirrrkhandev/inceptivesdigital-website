import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import SnapshotSection from "./SnapshotSection";
import TheBusinessChallengeSection from "./TheBusinessChallengeSection";
import WhatWeBuiltSection from "./WhatWeBuiltSection";
import CoreProductDecisionsSection from "./CoreProductDecisionsSection";
import TheSolutionSection from "./TheSolutionSection";
import TechnologyStackSection from "./TechnologyStackSection";
import ManagementDashboardSection from "./ManagementDashboardSection";
import OutcomesSection from "./OutcomesSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c3bca1a": HeroSection,
  "3355680": SnapshotSection,
  "d049048": TheBusinessChallengeSection,
  "3ea39cf": WhatWeBuiltSection,
  "0d7786d": CoreProductDecisionsSection,
  "6cafb81": TheSolutionSection,
  "6bf9ba2c": TechnologyStackSection,
  "ca91c07": ManagementDashboardSection,
  "6a3ecc4": OutcomesSection
  }, false, children);
}
