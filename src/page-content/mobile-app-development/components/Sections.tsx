import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import TrustedMobileAppDevelopmentCompanyAcrossTheSection from "./TrustedMobileAppDevelopmentCompanyAcrossTheSection";
import MobileAppDevelopmentServicesBuiltAroundYourSection from "./MobileAppDevelopmentServicesBuiltAroundYourSection";
import DevelopersSection from "./DevelopersSection";
import WhereCustomMobileAppDevelopmentMeetsProductSection from "./WhereCustomMobileAppDevelopmentMeetsProductSection";
import MobileAppDevelopmentServicesAcrossEveryIndustrySection from "./MobileAppDevelopmentServicesAcrossEveryIndustrySection";
import CustomMobileAppDevelopmentForModernProductsSection from "./CustomMobileAppDevelopmentForModernProductsSection";
import SmartFeaturesForSmarterMobileAppDevelopmentSection from "./SmartFeaturesForSmarterMobileAppDevelopmentSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import MobileAppBuiltOnProductThinkingSection from "./MobileAppBuiltOnProductThinkingSection";
import HowOurMobileAppDevelopmentCompanyBuildsSection from "./HowOurMobileAppDevelopmentCompanyBuildsSection";
import EngineeringExcellenceBehindOurMobileAppDevelopmentSection from "./EngineeringExcellenceBehindOurMobileAppDevelopmentSection";
import NextGenTechnologiesBehindOurMobileAppSection from "./NextGenTechnologiesBehindOurMobileAppSection";
import TheBusinessCaseForMobileAppDevelopmentSection from "./TheBusinessCaseForMobileAppDevelopmentSection";
import MobileAppDevelopmentCostTimelineSection from "./MobileAppDevelopmentCostTimelineSection";
import CapitalizeOnThe626BMobileAppMarketSection from "./CapitalizeOnThe626BMobileAppMarketSection";
import Content17Section from "./Content17Section";
import AwardsAndRecognitionsSection from "./AwardsAndRecognitionsSection";
import MobileAppDevelopmentFAQsSection from "./MobileAppDevelopmentFAQsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "358a8ace": HeroSection,
  "4f9f4dc7": TrustedMobileAppDevelopmentCompanyAcrossTheSection,
  "5ba4531d": MobileAppDevelopmentServicesBuiltAroundYourSection,
  "5c1b9749": DevelopersSection,
  "19b851f3": WhereCustomMobileAppDevelopmentMeetsProductSection,
  "d10d9b2": MobileAppDevelopmentServicesAcrossEveryIndustrySection,
  "3a304828": CustomMobileAppDevelopmentForModernProductsSection,
  "19acd19c": SmartFeaturesForSmarterMobileAppDevelopmentSection,
  "2f05425c": YourIdeaDeservesBetterThanAverageExecutionSection,
  "73008d5f": WhatOurClientsSayAboutBuildingWithSection,
  "6108edf": MobileAppBuiltOnProductThinkingSection,
  "52f5893": HowOurMobileAppDevelopmentCompanyBuildsSection,
  "58ac2a01": EngineeringExcellenceBehindOurMobileAppDevelopmentSection,
  "254089be": NextGenTechnologiesBehindOurMobileAppSection,
  "2d554732": TheBusinessCaseForMobileAppDevelopmentSection,
  "53ba80ba": MobileAppDevelopmentCostTimelineSection,
  "509540a6": CapitalizeOnThe626BMobileAppMarketSection,
  "50d5ab8b": Content17Section,
  "1e9d0242": AwardsAndRecognitionsSection,
  "181fa669": MobileAppDevelopmentFAQsSection
  }, false, children);
}
