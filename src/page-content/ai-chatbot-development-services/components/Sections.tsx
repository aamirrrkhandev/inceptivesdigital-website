import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import AnAIChatbotAndARuleBasedSection from "./AnAIChatbotAndARuleBasedSection";
import AIChatbotDevelopmentServicesBuiltForEverySection from "./AIChatbotDevelopmentServicesBuiltForEverySection";
import HowWeDeliverCustomAIDevelopmentServicesSection from "./HowWeDeliverCustomAIDevelopmentServicesSection";
import SolutionsOurAIChatbotDevelopmentCompanyOffersSection from "./SolutionsOurAIChatbotDevelopmentCompanyOffersSection";
import AIChatbotDevelopmentServicesAcrossTheIndustriesSection from "./AIChatbotDevelopmentServicesAcrossTheIndustriesSection";
import YourIndustryMayNotBeListedSection from "./YourIndustryMayNotBeListedSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import TheProcessOurAIChatbotDevelopmentCompanySection from "./TheProcessOurAIChatbotDevelopmentCompanySection";
import TheTechnologyBehindOurAIChatbotDevelopmentSection from "./TheTechnologyBehindOurAIChatbotDevelopmentSection";
import MostChatbotProblemsAreArchitectureProblemsInSection from "./MostChatbotProblemsAreArchitectureProblemsInSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c12ac91": HeroSection,
  "2747e32": AnAIChatbotAndARuleBasedSection,
  "64c9b391": AIChatbotDevelopmentServicesBuiltForEverySection,
  "d93f501": HowWeDeliverCustomAIDevelopmentServicesSection,
  "1be199a": SolutionsOurAIChatbotDevelopmentCompanyOffersSection,
  "180f574": AIChatbotDevelopmentServicesAcrossTheIndustriesSection,
  "cbae197": YourIndustryMayNotBeListedSection,
  "bd355a5": YourIdeaDeservesBetterThanAverageExecutionSection,
  "2808a6a7": WhatOurClientsSayAboutBuildingWithSection,
  "ff805ef": TheProcessOurAIChatbotDevelopmentCompanySection,
  "97b78b5": TheTechnologyBehindOurAIChatbotDevelopmentSection,
  "50715151": MostChatbotProblemsAreArchitectureProblemsInSection,
  "3a0240b7": FAQSSection
  }, false, children);
}
