import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import MobileAppDevelopmentClientsWhoHaveTrustedSection from "./MobileAppDevelopmentClientsWhoHaveTrustedSection";
import IdeasNeedDirectionBeforeTheyNeedDevelopmentSection from "./IdeasNeedDirectionBeforeTheyNeedDevelopmentSection";
import MobileAppDevelopmentServicesBuiltAroundHowSection from "./MobileAppDevelopmentServicesBuiltAroundHowSection";
import Content4Section from "./Content4Section";
import FuelingAustinSMostCompetitiveIndustriesAsSection from "./FuelingAustinSMostCompetitiveIndustriesAsSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import MobileAppDevelopmentProcessBuiltAroundBetterSection from "./MobileAppDevelopmentProcessBuiltAroundBetterSection";
import PlanningAnAIEnabledAppForAustinSection from "./PlanningAnAIEnabledAppForAustinSection";
import MobileAppDevelopmentTechnologiesOurAustinTeamSection from "./MobileAppDevelopmentTechnologiesOurAustinTeamSection";
import EmbeddingModernTechnologiesInMobileAppsForSection from "./EmbeddingModernTechnologiesInMobileAppsForSection";
import SmartFeaturesForSmarterMobileAppDevelopmentSection from "./SmartFeaturesForSmarterMobileAppDevelopmentSection";
import TheBusinessCaseForMobileAppDevelopmentSection from "./TheBusinessCaseForMobileAppDevelopmentSection";
import BuildingAustinSMostResilientDigitalProductsSection from "./BuildingAustinSMostResilientDigitalProductsSection";
import MobileAppDevelopmentCostEstimatesByProductSection from "./MobileAppDevelopmentCostEstimatesByProductSection";
import WhatSetsUsApartInAustinSSection from "./WhatSetsUsApartInAustinSSection";
import WantAStraightAnswerOnWhatYourSection from "./WantAStraightAnswerOnWhatYourSection";
import FrequentlyAskedQuestionsAboutMobileAppDevelopmentSection from "./FrequentlyAskedQuestionsAboutMobileAppDevelopmentSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "4f8c8f04": HeroSection,
  "6a7ccdb1": MobileAppDevelopmentClientsWhoHaveTrustedSection,
  "29b37514": IdeasNeedDirectionBeforeTheyNeedDevelopmentSection,
  "8af92a6": MobileAppDevelopmentServicesBuiltAroundHowSection,
  "189363b7": Content4Section,
  "1c46cb5d": FuelingAustinSMostCompetitiveIndustriesAsSection,
  "e069d34": YourIdeaDeservesBetterThanAverageExecutionSection,
  "32f08122": WhatOurClientsSayAboutBuildingWithSection,
  "28e852f7": MobileAppDevelopmentProcessBuiltAroundBetterSection,
  "0100b3a": PlanningAnAIEnabledAppForAustinSection,
  "751121f1": MobileAppDevelopmentTechnologiesOurAustinTeamSection,
  "117eade1": EmbeddingModernTechnologiesInMobileAppsForSection,
  "6d03c40d": SmartFeaturesForSmarterMobileAppDevelopmentSection,
  "14c11b0a": TheBusinessCaseForMobileAppDevelopmentSection,
  "bc79b7b": BuildingAustinSMostResilientDigitalProductsSection,
  "e71120d": MobileAppDevelopmentCostEstimatesByProductSection,
  "d36026d": WhatSetsUsApartInAustinSSection,
  "44497a43": WantAStraightAnswerOnWhatYourSection,
  "6cdff814": FrequentlyAskedQuestionsAboutMobileAppDevelopmentSection
  }, false, children);
}
