import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import OperationalProblemsOurRPADevelopmentServicesAreSection from "./OperationalProblemsOurRPADevelopmentServicesAreSection";
import RPADevelopmentServicesEngineeredAroundYourWorkflowsSection from "./RPADevelopmentServicesEngineeredAroundYourWorkflowsSection";
import IndustriesWhereOurRPADevelopmentCompanyDeliversSection from "./IndustriesWhereOurRPADevelopmentCompanyDeliversSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import YourIndustryMayNotBeListedSection from "./YourIndustryMayNotBeListedSection";
import EndToEndAIAutomationServicesForSection from "./EndToEndAIAutomationServicesForSection";
import RPADevelopmentStackAndAutomationInfrastructureSection from "./RPADevelopmentStackAndAutomationInfrastructureSection";
import AutomateRepetitiveWorkflowsBeforeTheySlowOperationsSection from "./AutomateRepetitiveWorkflowsBeforeTheySlowOperationsSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "40061bce": HeroSection,
  "46a12787": OperationalProblemsOurRPADevelopmentServicesAreSection,
  "503725d4": RPADevelopmentServicesEngineeredAroundYourWorkflowsSection,
  "096fb18": IndustriesWhereOurRPADevelopmentCompanyDeliversSection,
  "5dd0b67c": YourIdeaDeservesBetterThanAverageExecutionSection,
  "2f278ec6": WhatOurClientsSayAboutBuildingWithSection,
  "36a9f06": YourIndustryMayNotBeListedSection,
  "13b4d83": EndToEndAIAutomationServicesForSection,
  "f7165cd": RPADevelopmentStackAndAutomationInfrastructureSection,
  "8ed159c": AutomateRepetitiveWorkflowsBeforeTheySlowOperationsSection,
  "3dc86b9": FAQSSection
  }, false, children);
}
