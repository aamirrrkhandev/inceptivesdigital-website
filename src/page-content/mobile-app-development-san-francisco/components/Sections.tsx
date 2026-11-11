import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import BuiltWithTeamsAcrossHealthcareFinTechManufacturingSection from "./BuiltWithTeamsAcrossHealthcareFinTechManufacturingSection";
import BuildingFasterOnlyMattersIfYouAreSection from "./BuildingFasterOnlyMattersIfYouAreSection";
import MobileAppDevelopmentServicesInSanFranciscoSection from "./MobileAppDevelopmentServicesInSanFranciscoSection";
import DevelopersSection from "./DevelopersSection";
import MobileAppDevelopmentAcross20IndustriesBuiltSection from "./MobileAppDevelopmentAcross20IndustriesBuiltSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import BuildingTheNextProductInSanFranciscoSection from "./BuildingTheNextProductInSanFranciscoSection";
import AStructuredApproachToMobileAppDevelopmentSection from "./AStructuredApproachToMobileAppDevelopmentSection";
import ProductionReadyTechnologyStackForMobileAppSection from "./ProductionReadyTechnologyStackForMobileAppSection";
import AdvancedEngineeringCapabilitiesForMobileApplicationsSection from "./AdvancedEngineeringCapabilitiesForMobileApplicationsSection";
import SmartFeaturesForSmarterMobileAppDevelopmentSection from "./SmartFeaturesForSmarterMobileAppDevelopmentSection";
import WhereSanFranciscoSMostDemandingDigitalSection from "./WhereSanFranciscoSMostDemandingDigitalSection";
import MobileAppDevelopmentCostInSanFranciscoSection from "./MobileAppDevelopmentCostInSanFranciscoSection";
import WhyBuildMobileAppsWithInceptivesDigitalSection from "./WhyBuildMobileAppsWithInceptivesDigitalSection";
import ValidateYourMobileAppBeforeYouBuildSection from "./ValidateYourMobileAppBeforeYouBuildSection";
import FrequentlyAskedQuestionsSection from "./FrequentlyAskedQuestionsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "4f8c8f04": HeroSection,
  "6a7ccdb1": BuiltWithTeamsAcrossHealthcareFinTechManufacturingSection,
  "29b37514": BuildingFasterOnlyMattersIfYouAreSection,
  "8af92a6": MobileAppDevelopmentServicesInSanFranciscoSection,
  "189363b7": DevelopersSection,
  "4ce9936": MobileAppDevelopmentAcross20IndustriesBuiltSection,
  "8c5e6e2": YourIdeaDeservesBetterThanAverageExecutionSection,
  "2795c6b5": WhatOurClientsSayAboutBuildingWithSection,
  "fb43f20": BuildingTheNextProductInSanFranciscoSection,
  "28e852f7": AStructuredApproachToMobileAppDevelopmentSection,
  "751121f1": ProductionReadyTechnologyStackForMobileAppSection,
  "117eade1": AdvancedEngineeringCapabilitiesForMobileApplicationsSection,
  "6d03c40d": SmartFeaturesForSmarterMobileAppDevelopmentSection,
  "777351d": WhereSanFranciscoSMostDemandingDigitalSection,
  "e71120d": MobileAppDevelopmentCostInSanFranciscoSection,
  "d36026d": WhyBuildMobileAppsWithInceptivesDigitalSection,
  "44497a43": ValidateYourMobileAppBeforeYouBuildSection,
  "6cdff814": FrequentlyAskedQuestionsSection
  }, false, children);
}
