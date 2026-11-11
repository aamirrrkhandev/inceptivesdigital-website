import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import AIMVPDevelopmentServicesScopedAroundYourSection from "./AIMVPDevelopmentServicesScopedAroundYourSection";
import GenerativeAIDevelopmentServicesDesignedForYourSection from "./GenerativeAIDevelopmentServicesDesignedForYourSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import HowOurAIMVPDevelopmentCompanyDeliversSection from "./HowOurAIMVPDevelopmentCompanyDeliversSection";
import YourIndustryMayNotBeListedSection from "./YourIndustryMayNotBeListedSection";
import TheTechnologyStackBehindOurAIAppSection from "./TheTechnologyStackBehindOurAIAppSection";
import TurnGenerativeAIIntoReliableOperationalSystemsSection from "./TurnGenerativeAIIntoReliableOperationalSystemsSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c12ac91": HeroSection,
  "2747e32": AIMVPDevelopmentServicesScopedAroundYourSection,
  "180f574": GenerativeAIDevelopmentServicesDesignedForYourSection,
  "7c3e730e": YourIdeaDeservesBetterThanAverageExecutionSection,
  "39942821": WhatOurClientsSayAboutBuildingWithSection,
  "25b2f4c": HowOurAIMVPDevelopmentCompanyDeliversSection,
  "cbae197": YourIndustryMayNotBeListedSection,
  "fea878a": TheTechnologyStackBehindOurAIAppSection,
  "50715151": TurnGenerativeAIIntoReliableOperationalSystemsSection,
  "3a0240b7": FAQSSection
  }, false, children);
}
