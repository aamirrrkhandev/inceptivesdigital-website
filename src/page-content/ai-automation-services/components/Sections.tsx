import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import BusinessProblemsWeSolveWithAIAutomationSection from "./BusinessProblemsWeSolveWithAIAutomationSection";
import AIAutomationServicesBuiltAroundTheWorkflowsSection from "./AIAutomationServicesBuiltAroundTheWorkflowsSection";
import WhatAIAutomationDeliversWhenTheArchitectureSection from "./WhatAIAutomationDeliversWhenTheArchitectureSection";
import BuiltAcrossIndustriesSharpEnoughToKnowSection from "./BuiltAcrossIndustriesSharpEnoughToKnowSection";
import YourIndustryMayNotBeListedSection from "./YourIndustryMayNotBeListedSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import YourIdeaDeservesBetterThanAverageExecutionMoreSection from "./YourIdeaDeservesBetterThanAverageExecutionMoreSection";
import EndToEndAIAutomationServicesForSection from "./EndToEndAIAutomationServicesForSection";
import AIAutomationFrameworksAndInfrastructureBehindOurSection from "./AIAutomationFrameworksAndInfrastructureBehindOurSection";
import StopManagingProcessesLetAIDoItSection from "./StopManagingProcessesLetAIDoItSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "54b27c1d": HeroSection,
  "16f9ce09": BusinessProblemsWeSolveWithAIAutomationSection,
  "55d839a": AIAutomationServicesBuiltAroundTheWorkflowsSection,
  "1a57c464": WhatAIAutomationDeliversWhenTheArchitectureSection,
  "aef9ccd": BuiltAcrossIndustriesSharpEnoughToKnowSection,
  "23a49f3": YourIndustryMayNotBeListedSection,
  "4e8900ad": YourIdeaDeservesBetterThanAverageExecutionSection,
  "311afe5": YourIdeaDeservesBetterThanAverageExecutionMoreSection,
  "4fe2bdf": EndToEndAIAutomationServicesForSection,
  "2a2ae24": AIAutomationFrameworksAndInfrastructureBehindOurSection,
  "a6613cd": StopManagingProcessesLetAIDoItSection,
  "9d50152": FAQSSection
  }, false, children);
}
