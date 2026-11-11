import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import WhyMostMVPsFailBeforeTheyLaunchSection from "./WhyMostMVPsFailBeforeTheyLaunchSection";
import ValidateProductDemandBeforeCommittingToFullSection from "./ValidateProductDemandBeforeCommittingToFullSection";
import PrototypePoCOrMVPWhichOneDoSection from "./PrototypePoCOrMVPWhichOneDoSection";
import WhenIsAnMVPTheRightProductSection from "./WhenIsAnMVPTheRightProductSection";
import TheseArePreciselyTheSituationsInceptivesDigitalSection from "./TheseArePreciselyTheSituationsInceptivesDigitalSection";
import KnowWhetherYourProductIsReadyForSection from "./KnowWhetherYourProductIsReadyForSection";
import EndToEndMVPDevelopmentServicesSection from "./EndToEndMVPDevelopmentServicesSection";
import TheFrameworkBehindEverySuccessfulMVPDevelopmentSection from "./TheFrameworkBehindEverySuccessfulMVPDevelopmentSection";
import EverySuccessfulMVPStartsWithAClearSection from "./EverySuccessfulMVPStartsWithAClearSection";
import TheReasonsFoundersRelyOnInceptivesDigitalSection from "./TheReasonsFoundersRelyOnInceptivesDigitalSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import ProductExpertiseAcross20IndustriesSection from "./ProductExpertiseAcross20IndustriesSection";
import EstimatedTimelineForMVPDevelopmentWhatToSection from "./EstimatedTimelineForMVPDevelopmentWhatToSection";
import TheTechStackBehindEveryDiscoverySprintSection from "./TheTechStackBehindEveryDiscoverySprintSection";
import HowMuchDoesItCostToBuildSection from "./HowMuchDoesItCostToBuildSection";
import LetSDefineWhatYourMVPNeedsSection from "./LetSDefineWhatYourMVPNeedsSection";
import FrequentlyAskedQuestionSection from "./FrequentlyAskedQuestionSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "0157a12": HeroSection,
  "a9d7f03": WhyMostMVPsFailBeforeTheyLaunchSection,
  "d90f821": ValidateProductDemandBeforeCommittingToFullSection,
  "db918c4": PrototypePoCOrMVPWhichOneDoSection,
  "a226162": WhenIsAnMVPTheRightProductSection,
  "5dd48c9": TheseArePreciselyTheSituationsInceptivesDigitalSection,
  "4a159d2": KnowWhetherYourProductIsReadyForSection,
  "db8a8c9": EndToEndMVPDevelopmentServicesSection,
  "6ad67f1": TheFrameworkBehindEverySuccessfulMVPDevelopmentSection,
  "6c0238b": EverySuccessfulMVPStartsWithAClearSection,
  "63f4f95": TheReasonsFoundersRelyOnInceptivesDigitalSection,
  "2dd49f2": YourIdeaDeservesBetterThanAverageExecutionSection,
  "457e6d35": WhatOurClientsSayAboutBuildingWithSection,
  "cbbeab5": ProductExpertiseAcross20IndustriesSection,
  "35ea2d4": EstimatedTimelineForMVPDevelopmentWhatToSection,
  "7d40264": TheTechStackBehindEveryDiscoverySprintSection,
  "321de93": HowMuchDoesItCostToBuildSection,
  "5e48868": LetSDefineWhatYourMVPNeedsSection,
  "1e989ca": FrequentlyAskedQuestionSection
  }, false, children);
}
