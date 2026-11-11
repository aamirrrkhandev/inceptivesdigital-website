import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import ComputerVisionSuccessDependsOnMoreThanSection from "./ComputerVisionSuccessDependsOnMoreThanSection";
import ProductionReadyComputerVisionDevelopmentServicesSection from "./ProductionReadyComputerVisionDevelopmentServicesSection";
import CommonComputerVisionRisksWeEliminateEarlySection from "./CommonComputerVisionRisksWeEliminateEarlySection";
import CustomComputerVisionForIndustrySpecificChallengesSection from "./CustomComputerVisionForIndustrySpecificChallengesSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import YourUseCaseDoesnTHaveToSection from "./YourUseCaseDoesnTHaveToSection";
import ComputerVisionDevelopmentFromDataToDeploymentSection from "./ComputerVisionDevelopmentFromDataToDeploymentSection";
import ComputerVisionDevelopmentToolsAndTechnologiesSection from "./ComputerVisionDevelopmentToolsAndTechnologiesSection";
import FAQSSection from "./FAQSSection";
import TurnGenerativeAIIntoReliableOperationalSystemsSection from "./TurnGenerativeAIIntoReliableOperationalSystemsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c12ac91": HeroSection,
  "2747e32": ComputerVisionSuccessDependsOnMoreThanSection,
  "64c9b391": ProductionReadyComputerVisionDevelopmentServicesSection,
  "1be199a": CommonComputerVisionRisksWeEliminateEarlySection,
  "180f574": CustomComputerVisionForIndustrySpecificChallengesSection,
  "01244c0": YourIdeaDeservesBetterThanAverageExecutionSection,
  "23208fdd": WhatOurClientsSayAboutBuildingWithSection,
  "cbae197": YourUseCaseDoesnTHaveToSection,
  "9970432": ComputerVisionDevelopmentFromDataToDeploymentSection,
  "d69229b": ComputerVisionDevelopmentToolsAndTechnologiesSection,
  "3a0240b7": FAQSSection,
  "50715151": TurnGenerativeAIIntoReliableOperationalSystemsSection
  }, false, children);
}
