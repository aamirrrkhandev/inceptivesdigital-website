import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import OperationalGapsCreatedByDisconnectedSystemsSection from "./OperationalGapsCreatedByDisconnectedSystemsSection";
import SystemIntegrationAIAutomationServicesBuiltForSection from "./SystemIntegrationAIAutomationServicesBuiltForSection";
import WhatAIAutomationDeliversWhenTheArchitectureSection from "./WhatAIAutomationDeliversWhenTheArchitectureSection";
import CrossIndustryBusinessProcessAutomationServicesSection from "./CrossIndustryBusinessProcessAutomationServicesSection";
import YourIndustryMayNotBeListedSection from "./YourIndustryMayNotBeListedSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import EndToEndAIAutomationServicesForSection from "./EndToEndAIAutomationServicesForSection";
import CoreTechnologiesForAPIAndSystemConnectivitySection from "./CoreTechnologiesForAPIAndSystemConnectivitySection";
import SystemsWorkBetterWhenTheyAreConnectedSection from "./SystemsWorkBetterWhenTheyAreConnectedSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "6635a246": HeroSection,
  "68e6a00c": OperationalGapsCreatedByDisconnectedSystemsSection,
  "61e7142": SystemIntegrationAIAutomationServicesBuiltForSection,
  "27158fdf": WhatAIAutomationDeliversWhenTheArchitectureSection,
  "2f1f708": CrossIndustryBusinessProcessAutomationServicesSection,
  "6fe358a": YourIndustryMayNotBeListedSection,
  "4fc967e": YourIdeaDeservesBetterThanAverageExecutionSection,
  "4f055630": WhatOurClientsSayAboutBuildingWithSection,
  "159b826": EndToEndAIAutomationServicesForSection,
  "507d9cd": CoreTechnologiesForAPIAndSystemConnectivitySection,
  "6bef2d4": SystemsWorkBetterWhenTheyAreConnectedSection,
  "edaf73b": FAQSSection
  }, false, children);
}
