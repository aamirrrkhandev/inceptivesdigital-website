import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import TrustedEngineeringPartnerFor70DigitalProductsSection from "./TrustedEngineeringPartnerFor70DigitalProductsSection";
import BackendArchitectureDecidesBusinessOutcomesSection from "./BackendArchitectureDecidesBusinessOutcomesSection";
import OvercomingTheBackendChallengesThatLimitProductSection from "./OvercomingTheBackendChallengesThatLimitProductSection";
import ComprehensiveBackendAPISolutionsServicesBuiltAroundSection from "./ComprehensiveBackendAPISolutionsServicesBuiltAroundSection";
import Content5Section from "./Content5Section";
import BuildingTheInfrastructureAcross20HighGrowthSection from "./BuildingTheInfrastructureAcross20HighGrowthSection";
import BuiltAndShippedBackendSystemsFromOurSection from "./BuiltAndShippedBackendSystemsFromOurSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import ReadyToStrengthenYourProductSFoundationSection from "./ReadyToStrengthenYourProductSFoundationSection";
import WhyProductTeamsTrustInceptivesDigitalWithSection from "./WhyProductTeamsTrustInceptivesDigitalWithSection";
import OurBackendAPIDevelopmentProcessSection from "./OurBackendAPIDevelopmentProcessSection";
import ProductionProvenTechnologiesForModernSoftwareSection from "./ProductionProvenTechnologiesForModernSoftwareSection";
import AdvancedBackendCapabilitiesForIntelligentDigitalProductsSection from "./AdvancedBackendCapabilitiesForIntelligentDigitalProductsSection";
import FlexiblePricingModelsBuiltAroundYourBackendSection from "./FlexiblePricingModelsBuiltAroundYourBackendSection";
import YourProductDeservesBetterInfrastructureTalkToSection from "./YourProductDeservesBetterInfrastructureTalkToSection";
import FAQsSection from "./FAQsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "78bcd53": HeroSection,
  "9cf769b": TrustedEngineeringPartnerFor70DigitalProductsSection,
  "aaf2ac9": BackendArchitectureDecidesBusinessOutcomesSection,
  "7dc4ace": OvercomingTheBackendChallengesThatLimitProductSection,
  "d859ac2": ComprehensiveBackendAPISolutionsServicesBuiltAroundSection,
  "5c187ea": Content5Section,
  "c5abeda": BuildingTheInfrastructureAcross20HighGrowthSection,
  "681eb03f": BuiltAndShippedBackendSystemsFromOurSection,
  "73008d5f": WhatOurClientsSayAboutBuildingWithSection,
  "5d32a89": ReadyToStrengthenYourProductSFoundationSection,
  "0267afe": WhyProductTeamsTrustInceptivesDigitalWithSection,
  "5e10a97": OurBackendAPIDevelopmentProcessSection,
  "7481f645": ProductionProvenTechnologiesForModernSoftwareSection,
  "ea314dd": AdvancedBackendCapabilitiesForIntelligentDigitalProductsSection,
  "8175609": FlexiblePricingModelsBuiltAroundYourBackendSection,
  "5467e61": YourProductDeservesBetterInfrastructureTalkToSection,
  "fb95f7b": FAQsSection
  }, false, children);
}
