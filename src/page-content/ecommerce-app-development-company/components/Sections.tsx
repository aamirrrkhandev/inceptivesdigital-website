import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import Content1Section from "./Content1Section";
import PickTheECommerceAppDevelopmentSetupThatSection from "./PickTheECommerceAppDevelopmentSetupThatSection";
import ReliableEcommerceDevelopmentServicesForHighPerformingSection from "./ReliableEcommerceDevelopmentServicesForHighPerformingSection";
import RevenueModelsPoweredByOurEcommerceAppSection from "./RevenueModelsPoweredByOurEcommerceAppSection";
import TrustedEngineeringPartnerFor70DigitalProductsSection from "./TrustedEngineeringPartnerFor70DigitalProductsSection";
import CaptureYourShareOfTheMultiTrillionSection from "./CaptureYourShareOfTheMultiTrillionSection";
import GlobalComplianceStandardsBuiltIntoEveryHealthcareSection from "./GlobalComplianceStandardsBuiltIntoEveryHealthcareSection";
import HealthcareAppFeaturesBuiltAroundRealClinicalSection from "./HealthcareAppFeaturesBuiltAroundRealClinicalSection";
import HealthcareAppDevelopmentProjectsThatAreLiveSection from "./HealthcareAppDevelopmentProjectsThatAreLiveSection";
import SectorsOurHealthcareAppDevelopmentCompanyBuildsSection from "./SectorsOurHealthcareAppDevelopmentCompanyBuildsSection";
import HealthcareAppDevelopmentProcessDesignedAroundComplianceSection from "./HealthcareAppDevelopmentProcessDesignedAroundComplianceSection";
import HealthcareAppDevelopmentTechnologiesSelectedForClinicalSection from "./HealthcareAppDevelopmentTechnologiesSelectedForClinicalSection";
import EmergingTechnologiesPoweringOurHealthcareAppDevelopmentSection from "./EmergingTechnologiesPoweringOurHealthcareAppDevelopmentSection";
import YourSectorOurHealthcareAppExpertiseSection from "./YourSectorOurHealthcareAppExpertiseSection";
import HealthcareAppDevelopmentCostEstimatesByApplicationSection from "./HealthcareAppDevelopmentCostEstimatesByApplicationSection";
import WhatSetsOurHealthcareAppDevelopmentApartSection from "./WhatSetsOurHealthcareAppDevelopmentApartSection";
import GetAPersonalizedHealthcareAppDevelopmentCostSection from "./GetAPersonalizedHealthcareAppDevelopmentCostSection";
import AwardsAndRecognitionsSection from "./AwardsAndRecognitionsSection";
import QuestionsAboutHealthcareAppDevelopmentWorthAskingSection from "./QuestionsAboutHealthcareAppDevelopmentWorthAskingSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "a474156": HeroSection,
  "af0e2ba": Content1Section,
  "84a9ef6": PickTheECommerceAppDevelopmentSetupThatSection,
  "e27a68c": ReliableEcommerceDevelopmentServicesForHighPerformingSection,
  "4dfbbcbc": RevenueModelsPoweredByOurEcommerceAppSection,
  "f071d29": TrustedEngineeringPartnerFor70DigitalProductsSection,
  "be85ac9": CaptureYourShareOfTheMultiTrillionSection,
  "687d11c": GlobalComplianceStandardsBuiltIntoEveryHealthcareSection,
  "4c51bb3": HealthcareAppFeaturesBuiltAroundRealClinicalSection,
  "5ec923ea": HealthcareAppDevelopmentProjectsThatAreLiveSection,
  "1572568": SectorsOurHealthcareAppDevelopmentCompanyBuildsSection,
  "d05828e": HealthcareAppDevelopmentProcessDesignedAroundComplianceSection,
  "61692113": HealthcareAppDevelopmentTechnologiesSelectedForClinicalSection,
  "bc3239b": EmergingTechnologiesPoweringOurHealthcareAppDevelopmentSection,
  "d4bb68e": YourSectorOurHealthcareAppExpertiseSection,
  "783dbf1": HealthcareAppDevelopmentCostEstimatesByApplicationSection,
  "b042bf0": WhatSetsOurHealthcareAppDevelopmentApartSection,
  "b620e24": GetAPersonalizedHealthcareAppDevelopmentCostSection,
  "88a2499": AwardsAndRecognitionsSection,
  "c080077": QuestionsAboutHealthcareAppDevelopmentWorthAskingSection
  }, false, children);
}
