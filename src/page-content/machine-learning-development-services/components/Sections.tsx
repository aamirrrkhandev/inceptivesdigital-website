import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import WhatMakesAMachineLearningModelTrulySection from "./WhatMakesAMachineLearningModelTrulySection";
import MachineLearningDevelopmentServicesBuiltForRealSection from "./MachineLearningDevelopmentServicesBuiltForRealSection";
import MachineLearningDevelopmentServicesAcrossKeyIndustriesSection from "./MachineLearningDevelopmentServicesAcrossKeyIndustriesSection";
import MachineLearningModelsBuiltAroundYourBusinessSection from "./MachineLearningModelsBuiltAroundYourBusinessSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import YourIndustryMayNotBeListedSection from "./YourIndustryMayNotBeListedSection";
import CustomMachineLearningDevelopmentForScalableOperationalSection from "./CustomMachineLearningDevelopmentForScalableOperationalSection";
import TheTechnologyStackBehindOurAIAppSection from "./TheTechnologyStackBehindOurAIAppSection";
import TurnGenerativeAIIntoReliableOperationalSystemsSection from "./TurnGenerativeAIIntoReliableOperationalSystemsSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c12ac91": HeroSection,
  "2747e32": WhatMakesAMachineLearningModelTrulySection,
  "64c9b391": MachineLearningDevelopmentServicesBuiltForRealSection,
  "180f574": MachineLearningDevelopmentServicesAcrossKeyIndustriesSection,
  "1be199a": MachineLearningModelsBuiltAroundYourBusinessSection,
  "56c6a872": YourIdeaDeservesBetterThanAverageExecutionSection,
  "73803a3c": WhatOurClientsSayAboutBuildingWithSection,
  "cbae197": YourIndustryMayNotBeListedSection,
  "d6458f4": CustomMachineLearningDevelopmentForScalableOperationalSection,
  "f778771": TheTechnologyStackBehindOurAIAppSection,
  "50715151": TurnGenerativeAIIntoReliableOperationalSystemsSection,
  "3a0240b7": FAQSSection
  }, false, children);
}
