import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import Content1Section from "./Content1Section";
import FintechAppDevelopmentServicesEveryFinancialProductSection from "./FintechAppDevelopmentServicesEveryFinancialProductSection";
import TakeYourPlaceInTheFutureOfSection from "./TakeYourPlaceInTheFutureOfSection";
import FintechAppDevelopmentFeaturesDesignedAroundTheSection from "./FintechAppDevelopmentFeaturesDesignedAroundTheSection";
import FintechAppDevelopmentProjectsThatAreLiveSection from "./FintechAppDevelopmentProjectsThatAreLiveSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import FintechAppDevelopmentForEverySectorFromSection from "./FintechAppDevelopmentForEverySectorFromSection";
import OurFintechAppDevelopmentProcessFromDiscoverySection from "./OurFintechAppDevelopmentProcessFromDiscoverySection";
import WeVeMasteredTheFintechAppDevelopmentSection from "./WeVeMasteredTheFintechAppDevelopmentSection";
import FintechAppDevelopmentServicesSelectedForSecuritySection from "./FintechAppDevelopmentServicesSelectedForSecuritySection";
import ModernTechnologiesBuiltIntoOurFintechAppSection from "./ModernTechnologiesBuiltIntoOurFintechAppSection";
import TheFintechAppDevelopmentCapabilitiesThatMakeSection from "./TheFintechAppDevelopmentCapabilitiesThatMakeSection";
import FintechAppDevelopmentCostEstimatesSection from "./FintechAppDevelopmentCostEstimatesSection";
import GetThePreciseCostForYourSpecificSection from "./GetThePreciseCostForYourSpecificSection";
import QuestionsAboutFintechAppDevelopmentWorthAskingSection from "./QuestionsAboutFintechAppDevelopmentWorthAskingSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "20834d2f": HeroSection,
  "6310f90c": Content1Section,
  "37e2740c": FintechAppDevelopmentServicesEveryFinancialProductSection,
  "6b7eb7e0": TakeYourPlaceInTheFutureOfSection,
  "55398c6a": FintechAppDevelopmentFeaturesDesignedAroundTheSection,
  "79a27113": FintechAppDevelopmentProjectsThatAreLiveSection,
  "73008d5f": WhatOurClientsSayAboutBuildingWithSection,
  "704fe787": FintechAppDevelopmentForEverySectorFromSection,
  "42e4001b": OurFintechAppDevelopmentProcessFromDiscoverySection,
  "31252ee7": WeVeMasteredTheFintechAppDevelopmentSection,
  "6b592ed8": FintechAppDevelopmentServicesSelectedForSecuritySection,
  "745aaabe": ModernTechnologiesBuiltIntoOurFintechAppSection,
  "1da5652": TheFintechAppDevelopmentCapabilitiesThatMakeSection,
  "3c9fd312": FintechAppDevelopmentCostEstimatesSection,
  "21a53310": GetThePreciseCostForYourSpecificSection,
  "29637b3c": QuestionsAboutFintechAppDevelopmentWorthAskingSection
  }, false, children);
}
