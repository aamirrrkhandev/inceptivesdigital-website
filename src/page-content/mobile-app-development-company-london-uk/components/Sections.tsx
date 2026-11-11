import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import BackedByTeamsThatBuildProductsMadeSection from "./BackedByTeamsThatBuildProductsMadeSection";
import EngineeredForLondonSGlobalTechStageSection from "./EngineeredForLondonSGlobalTechStageSection";
import OurMobileAppDevelopmentServicesForLondonSection from "./OurMobileAppDevelopmentServicesForLondonSection";
import Section20IndustriesWeDevelopAndScaleAppsSection from "./Section20IndustriesWeDevelopAndScaleAppsSection";
import Content5Section from "./Content5Section";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import MakeTheRightCallBeforeYouStartSection from "./MakeTheRightCallBeforeYouStartSection";
import OurApproachToTakeYourAppFromSection from "./OurApproachToTakeYourAppFromSection";
import TheThinkingBehindEveryTechStackDecisionSection from "./TheThinkingBehindEveryTechStackDecisionSection";
import TheEmergingTechnologiesForMobileApplicationsSection from "./TheEmergingTechnologiesForMobileApplicationsSection";
import SmartFeaturesForSmarterMobileAppDevelopmentSection from "./SmartFeaturesForSmarterMobileAppDevelopmentSection";
import TheBusinessCaseForMobileAppDevelopmentSection from "./TheBusinessCaseForMobileAppDevelopmentSection";
import EngineeringDigitalProductsForLondonSCompetitiveSection from "./EngineeringDigitalProductsForLondonSCompetitiveSection";
import WhatMobileAppDevelopmentCostsForLondonSection from "./WhatMobileAppDevelopmentCostsForLondonSection";
import WhyBuildMobileAppsWithInceptivesDigitalSection from "./WhyBuildMobileAppsWithInceptivesDigitalSection";
import LetSCreateYourAppRoadmapWithSection from "./LetSCreateYourAppRoadmapWithSection";
import FrequentlyAskedQuestionsSection from "./FrequentlyAskedQuestionsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "4f8c8f04": HeroSection,
  "6a7ccdb1": BackedByTeamsThatBuildProductsMadeSection,
  "29b37514": EngineeredForLondonSGlobalTechStageSection,
  "8af92a6": OurMobileAppDevelopmentServicesForLondonSection,
  "1c46cb5d": Section20IndustriesWeDevelopAndScaleAppsSection,
  "189363b7": Content5Section,
  "f652b5f": YourIdeaDeservesBetterThanAverageExecutionSection,
  "32435270": WhatOurClientsSayAboutBuildingWithSection,
  "abeb625": MakeTheRightCallBeforeYouStartSection,
  "28e852f7": OurApproachToTakeYourAppFromSection,
  "751121f1": TheThinkingBehindEveryTechStackDecisionSection,
  "117eade1": TheEmergingTechnologiesForMobileApplicationsSection,
  "6d03c40d": SmartFeaturesForSmarterMobileAppDevelopmentSection,
  "14c11b0a": TheBusinessCaseForMobileAppDevelopmentSection,
  "f48449a": EngineeringDigitalProductsForLondonSCompetitiveSection,
  "e71120d": WhatMobileAppDevelopmentCostsForLondonSection,
  "d36026d": WhyBuildMobileAppsWithInceptivesDigitalSection,
  "44497a43": LetSCreateYourAppRoadmapWithSection,
  "6cdff814": FrequentlyAskedQuestionsSection
  }, false, children);
}
