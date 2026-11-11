import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import WhyGenerativeAIProjectsFailToDeliverSection from "./WhyGenerativeAIProjectsFailToDeliverSection";
import GenerativeAIDevelopmentServicesWithImpactFromSection from "./GenerativeAIDevelopmentServicesWithImpactFromSection";
import HowWeDeliverCustomAIDevelopmentServicesSection from "./HowWeDeliverCustomAIDevelopmentServicesSection";
import ChallengesOurGenerativeAIDevelopmentCompanyAddressesSection from "./ChallengesOurGenerativeAIDevelopmentCompanyAddressesSection";
import GenerativeAIDevelopmentServicesDesignedForYourSection from "./GenerativeAIDevelopmentServicesDesignedForYourSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import YourIndustryMayNotBeListedSection from "./YourIndustryMayNotBeListedSection";
import GenerativeAIDevelopmentProcessDesignedToDeliverSection from "./GenerativeAIDevelopmentProcessDesignedToDeliverSection";
import FrameworksAndInfrastructureBehindOurProductionReadySection from "./FrameworksAndInfrastructureBehindOurProductionReadySection";
import YourIdeaDeservesBetterThanAverageExecutionMoreSection from "./YourIdeaDeservesBetterThanAverageExecutionMoreSection";
import TurnGenerativeAIIntoReliableOperationalSystemsSection from "./TurnGenerativeAIIntoReliableOperationalSystemsSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c12ac91": HeroSection,
  "2747e32": WhyGenerativeAIProjectsFailToDeliverSection,
  "64c9b391": GenerativeAIDevelopmentServicesWithImpactFromSection,
  "d93f501": HowWeDeliverCustomAIDevelopmentServicesSection,
  "1be199a": ChallengesOurGenerativeAIDevelopmentCompanyAddressesSection,
  "180f574": GenerativeAIDevelopmentServicesDesignedForYourSection,
  "b97c383": YourIdeaDeservesBetterThanAverageExecutionSection,
  "6395d368": WhatOurClientsSayAboutBuildingWithSection,
  "cbae197": YourIndustryMayNotBeListedSection,
  "d08216b": GenerativeAIDevelopmentProcessDesignedToDeliverSection,
  "4285c59": FrameworksAndInfrastructureBehindOurProductionReadySection,
  "47a4db4": YourIdeaDeservesBetterThanAverageExecutionMoreSection,
  "50715151": TurnGenerativeAIIntoReliableOperationalSystemsSection,
  "3a0240b7": FAQSSection
  }, false, children);
}
