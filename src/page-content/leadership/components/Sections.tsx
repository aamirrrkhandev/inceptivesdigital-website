import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import GoodLeadershipLeavesStrongerPeopleBehindSection from "./GoodLeadershipLeavesStrongerPeopleBehindSection";
import LeaderResponsibilitiesSection from "./LeaderResponsibilitiesSection";
import ClearOwnershipStartsAtTheTopSection from "./ClearOwnershipStartsAtTheTopSection";
import SeniorInvolvementImprovesDecisionsSection from "./SeniorInvolvementImprovesDecisionsSection";
import LeadershipIsJudgedByWhatImprovesAroundSection from "./LeadershipIsJudgedByWhatImprovesAroundSection";
import WhyTheCompanyShouldNeverDependOnSection from "./WhyTheCompanyShouldNeverDependOnSection";
import StrongProductsNeedLeadersBehindThemSection from "./StrongProductsNeedLeadersBehindThemSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "be509ba": HeroSection,
  "9dfeaee": GoodLeadershipLeavesStrongerPeopleBehindSection,
  "6087483": LeaderResponsibilitiesSection,
  "cedd3b5": ClearOwnershipStartsAtTheTopSection,
  "a6f9662": SeniorInvolvementImprovesDecisionsSection,
  "6acc9c5": LeadershipIsJudgedByWhatImprovesAroundSection,
  "fba177b": WhyTheCompanyShouldNeverDependOnSection,
  "84a1b67": StrongProductsNeedLeadersBehindThemSection
  }, false, children);
}
