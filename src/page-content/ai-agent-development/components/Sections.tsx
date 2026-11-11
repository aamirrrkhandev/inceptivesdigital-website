import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import UnderstandingTheDifferenceBetweenAnAIAgentSection from "./UnderstandingTheDifferenceBetweenAnAIAgentSection";
import AIAgentDevelopmentServicesBuiltAroundEverySection from "./AIAgentDevelopmentServicesBuiltAroundEverySection";
import HowWeDeliverCustomAIDevelopmentServicesSection from "./HowWeDeliverCustomAIDevelopmentServicesSection";
import OperationalAgentSolutionsFromOurAIAgentSection from "./OperationalAgentSolutionsFromOurAIAgentSection";
import SectorsOurAIAgentDevelopmentCompanyServesSection from "./SectorsOurAIAgentDevelopmentCompanyServesSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import YourIndustryMayNotBeListedSection from "./YourIndustryMayNotBeListedSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import DeliveryProcessOurAIAgentDevelopmentCompanySection from "./DeliveryProcessOurAIAgentDevelopmentCompanySection";
import TheTechnologyStackPoweringOurAIAgentSection from "./TheTechnologyStackPoweringOurAIAgentSection";
import BuildAIAgentsThatWorkWhileYouSection from "./BuildAIAgentsThatWorkWhileYouSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c12ac91": HeroSection,
  "2747e32": UnderstandingTheDifferenceBetweenAnAIAgentSection,
  "64c9b391": AIAgentDevelopmentServicesBuiltAroundEverySection,
  "d93f501": HowWeDeliverCustomAIDevelopmentServicesSection,
  "1be199a": OperationalAgentSolutionsFromOurAIAgentSection,
  "180f574": SectorsOurAIAgentDevelopmentCompanyServesSection,
  "5a1be35a": YourIdeaDeservesBetterThanAverageExecutionSection,
  "cbae197": YourIndustryMayNotBeListedSection,
  "22ecec2d": WhatOurClientsSayAboutBuildingWithSection,
  "05f78e5": DeliveryProcessOurAIAgentDevelopmentCompanySection,
  "8d07674": TheTechnologyStackPoweringOurAIAgentSection,
  "50715151": BuildAIAgentsThatWorkWhileYouSection,
  "3a0240b7": FAQSSection
  }, false, children);
}
