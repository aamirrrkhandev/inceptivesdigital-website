import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import OperationalBottlenecksThatBreakProcessExecutionSection from "./OperationalBottlenecksThatBreakProcessExecutionSection";
import BusinessProcessAIAutomationServicesBuiltAroundSection from "./BusinessProcessAIAutomationServicesBuiltAroundSection";
import CrossIndustryBusinessProcessAutomationServicesSection from "./CrossIndustryBusinessProcessAutomationServicesSection";
import YourIndustryMayNotBeListedSection from "./YourIndustryMayNotBeListedSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import EndToEndAIAutomationServicesForSection from "./EndToEndAIAutomationServicesForSection";
import TheTechnologyStackBehindOurAIAppSection from "./TheTechnologyStackBehindOurAIAppSection";
import ProcessesDonTImproveTheyGetRedefinedSection from "./ProcessesDonTImproveTheyGetRedefinedSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "40061bce": HeroSection,
  "46a12787": OperationalBottlenecksThatBreakProcessExecutionSection,
  "503725d4": BusinessProcessAIAutomationServicesBuiltAroundSection,
  "efc7d57": CrossIndustryBusinessProcessAutomationServicesSection,
  "36a9f06": YourIndustryMayNotBeListedSection,
  "5acbbe76": YourIdeaDeservesBetterThanAverageExecutionSection,
  "4bdd0b5f": WhatOurClientsSayAboutBuildingWithSection,
  "87d7e19": EndToEndAIAutomationServicesForSection,
  "7dbaa2f": TheTechnologyStackBehindOurAIAppSection,
  "8ed159c": ProcessesDonTImproveTheyGetRedefinedSection,
  "3dc86b9": FAQSSection
  }, false, children);
}
