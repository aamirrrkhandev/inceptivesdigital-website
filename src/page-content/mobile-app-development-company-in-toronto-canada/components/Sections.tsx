import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import TrustedByStartupsAndBusinessesBuildingDigitalSection from "./TrustedByStartupsAndBusinessesBuildingDigitalSection";
import BuiltForTorontoSInnovationEconomySection from "./BuiltForTorontoSInnovationEconomySection";
import OurMobileAppDevelopmentServicesInTorontoSection from "./OurMobileAppDevelopmentServicesInTorontoSection";
import Content4Section from "./Content4Section";
import BuildingDigitalProductsAcross20IndustriesSection from "./BuildingDigitalProductsAcross20IndustriesSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import ReadyToBuildTheAppThatSetsSection from "./ReadyToBuildTheAppThatSetsSection";
import OurMobileAppDevelopmentProcessBuiltAroundSection from "./OurMobileAppDevelopmentProcessBuiltAroundSection";
import TechnologyStackBehindEveryMobileAppSection from "./TechnologyStackBehindEveryMobileAppSection";
import TechnologiesWeRecommendOnlyWhenTheySolveSection from "./TechnologiesWeRecommendOnlyWhenTheySolveSection";
import SmartFeaturesForSmarterMobileAppDevelopmentSection from "./SmartFeaturesForSmarterMobileAppDevelopmentSection";
import PoweringDigitalInnovationAcrossTorontoSBusinessSection from "./PoweringDigitalInnovationAcrossTorontoSBusinessSection";
import MobileAppDevelopmentCostInTorontoSection from "./MobileAppDevelopmentCostInTorontoSection";
import WhyBusinessesInTorontoChooseInceptivesDigitalSection from "./WhyBusinessesInTorontoChooseInceptivesDigitalSection";
import BringYourNextMobileApplicationIdeaToSection from "./BringYourNextMobileApplicationIdeaToSection";
import FrequentlyAskedQuestionsSection from "./FrequentlyAskedQuestionsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "4f8c8f04": HeroSection,
  "6a7ccdb1": TrustedByStartupsAndBusinessesBuildingDigitalSection,
  "29b37514": BuiltForTorontoSInnovationEconomySection,
  "8af92a6": OurMobileAppDevelopmentServicesInTorontoSection,
  "189363b7": Content4Section,
  "1c46cb5d": BuildingDigitalProductsAcross20IndustriesSection,
  "34a3c0e": YourIdeaDeservesBetterThanAverageExecutionSection,
  "37b9a708": WhatOurClientsSayAboutBuildingWithSection,
  "7d897ec": ReadyToBuildTheAppThatSetsSection,
  "28e852f7": OurMobileAppDevelopmentProcessBuiltAroundSection,
  "751121f1": TechnologyStackBehindEveryMobileAppSection,
  "117eade1": TechnologiesWeRecommendOnlyWhenTheySolveSection,
  "6d03c40d": SmartFeaturesForSmarterMobileAppDevelopmentSection,
  "6ad6d2a": PoweringDigitalInnovationAcrossTorontoSBusinessSection,
  "e71120d": MobileAppDevelopmentCostInTorontoSection,
  "d36026d": WhyBusinessesInTorontoChooseInceptivesDigitalSection,
  "44497a43": BringYourNextMobileApplicationIdeaToSection,
  "6cdff814": FrequentlyAskedQuestionsSection
  }, false, children);
}
