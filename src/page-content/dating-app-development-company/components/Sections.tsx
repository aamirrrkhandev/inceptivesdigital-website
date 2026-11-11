import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import Content1Section from "./Content1Section";
import WhyDatingAppDevelopmentIsASmartSection from "./WhyDatingAppDevelopmentIsASmartSection";
import BrandsThatHaveChosenOurHealthcareAppSection from "./BrandsThatHaveChosenOurHealthcareAppSection";
import ReadyToDisruptTheOnlineDatingIndustrySection from "./ReadyToDisruptTheOnlineDatingIndustrySection";
import DatingAppDevelopmentServicesThatMakeOnlineSection from "./DatingAppDevelopmentServicesThatMakeOnlineSection";
import InnovativeFeaturesForDatingAppDevelopmentSection from "./InnovativeFeaturesForDatingAppDevelopmentSection";
import OurWorkAsALeadingDatingAppSection from "./OurWorkAsALeadingDatingAppSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import Join70BrandsThatTrustInceptivesDigitalSection from "./Join70BrandsThatTrustInceptivesDigitalSection";
import ProvenStrategiesInOurDatingAppDevelopmentSection from "./ProvenStrategiesInOurDatingAppDevelopmentSection";
import DatingAppDevelopmentForEveryTypeOfSection from "./DatingAppDevelopmentForEveryTypeOfSection";
import YourConceptCouldBeTheNextPlatformSection from "./YourConceptCouldBeTheNextPlatformSection";
import HealthcareAppDevelopmentTechnologiesSelectedForClinicalSection from "./HealthcareAppDevelopmentTechnologiesSelectedForClinicalSection";
import SectorsOurHealthcareAppDevelopmentCompanyBuildsSection from "./SectorsOurHealthcareAppDevelopmentCompanyBuildsSection";
import WhyOptForInceptiveDigitalSDatingSection from "./WhyOptForInceptiveDigitalSDatingSection";
import WeVeAchieved98ClientSatisfactionAndSection from "./WeVeAchieved98ClientSatisfactionAndSection";
import DatingAppDevelopmentCostEstimatesSection from "./DatingAppDevelopmentCostEstimatesSection";
import GetAPersonalizedHealthcareAppDevelopmentCostSection from "./GetAPersonalizedHealthcareAppDevelopmentCostSection";
import AwardsAndRecognitionsSection from "./AwardsAndRecognitionsSection";
import QuestionsAboutDatingAppDevelopmentWorthAskingSection from "./QuestionsAboutDatingAppDevelopmentWorthAskingSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "a474156": HeroSection,
  "af0e2ba": Content1Section,
  "e27a68c": WhyDatingAppDevelopmentIsASmartSection,
  "0073cc9": BrandsThatHaveChosenOurHealthcareAppSection,
  "be85ac9": ReadyToDisruptTheOnlineDatingIndustrySection,
  "204be68": DatingAppDevelopmentServicesThatMakeOnlineSection,
  "687d11c": InnovativeFeaturesForDatingAppDevelopmentSection,
  "5ec923ea": OurWorkAsALeadingDatingAppSection,
  "5cce2ec6": WhatOurClientsSayAboutBuildingWithSection,
  "3380826": Join70BrandsThatTrustInceptivesDigitalSection,
  "d05828e": ProvenStrategiesInOurDatingAppDevelopmentSection,
  "06f80c4": DatingAppDevelopmentForEveryTypeOfSection,
  "b9700b4": YourConceptCouldBeTheNextPlatformSection,
  "61692113": HealthcareAppDevelopmentTechnologiesSelectedForClinicalSection,
  "1572568": SectorsOurHealthcareAppDevelopmentCompanyBuildsSection,
  "bc3239b": WhyOptForInceptiveDigitalSDatingSection,
  "d4bb68e": WeVeAchieved98ClientSatisfactionAndSection,
  "783dbf1": DatingAppDevelopmentCostEstimatesSection,
  "b620e24": GetAPersonalizedHealthcareAppDevelopmentCostSection,
  "88a2499": AwardsAndRecognitionsSection,
  "c080077": QuestionsAboutDatingAppDevelopmentWorthAskingSection
  }, false, children);
}
