import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import Content1Section from "./Content1Section";
import BuildingAnAIAppIsNotTheSection from "./BuildingAnAIAppIsNotTheSection";
import CustomAIAppDevelopmentServicesForWebSection from "./CustomAIAppDevelopmentServicesForWebSection";
import AIApplicationsDevelopmentCompanyBuildAcrossEverySection from "./AIApplicationsDevelopmentCompanyBuildAcrossEverySection";
import AIAppDevelopmentServicesAcrossIndustriesWeSection from "./AIAppDevelopmentServicesAcrossIndustriesWeSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import YourIndustryMayNotBeListedSection from "./YourIndustryMayNotBeListedSection";
import HowWeApproachAIAppDevelopmentFromSection from "./HowWeApproachAIAppDevelopmentFromSection";
import TheTechnologyStackBehindOurAIAppSection from "./TheTechnologyStackBehindOurAIAppSection";
import ADecisionMadeTodayDecidesHowYourSection from "./ADecisionMadeTodayDecidesHowYourSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c12ac91": HeroSection,
  "c63f93a": Content1Section,
  "2747e32": BuildingAnAIAppIsNotTheSection,
  "64c9b391": CustomAIAppDevelopmentServicesForWebSection,
  "1be199a": AIApplicationsDevelopmentCompanyBuildAcrossEverySection,
  "180f574": AIAppDevelopmentServicesAcrossIndustriesWeSection,
  "ca32fde": YourIdeaDeservesBetterThanAverageExecutionSection,
  "4e0161a5": WhatOurClientsSayAboutBuildingWithSection,
  "cbae197": YourIndustryMayNotBeListedSection,
  "a056c4a": HowWeApproachAIAppDevelopmentFromSection,
  "605fbd6": TheTechnologyStackBehindOurAIAppSection,
  "50715151": ADecisionMadeTodayDecidesHowYourSection,
  "3a0240b7": FAQSSection
  }, false, children);
}
