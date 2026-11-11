import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import OurStorySection from "./OurStorySection";
import PrinciplesOnlyMatterWhenTheyAffectTheSection from "./PrinciplesOnlyMatterWhenTheyAffectTheSection";
import ClientShouldKnowWhoOwnTheDecisionSection from "./ClientShouldKnowWhoOwnTheDecisionSection";
import AGoodCompanyShouldCreateValueOnSection from "./AGoodCompanyShouldCreateValueOnSection";
import OneCompanyThreeAreasOfResponsibilitySection from "./OneCompanyThreeAreasOfResponsibilitySection";
import FrequentlyAskedQuestionsSection from "./FrequentlyAskedQuestionsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "d215af0": HeroSection,
  "7159ac3": OurStorySection,
  "690a819": PrinciplesOnlyMatterWhenTheyAffectTheSection,
  "3d74236": ClientShouldKnowWhoOwnTheDecisionSection,
  "2775b5f": AGoodCompanyShouldCreateValueOnSection,
  "3e69334": OneCompanyThreeAreasOfResponsibilitySection,
  "7f10196": FrequentlyAskedQuestionsSection
  }, false, children);
}
