import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import MobileAppDevelopmentClientsAcrossDifferentSectorsSection from "./MobileAppDevelopmentClientsAcrossDifferentSectorsSection";
import CreatingDigitalExperiencesForNewYorkSSection from "./CreatingDigitalExperiencesForNewYorkSSection";
import MobileAppDevelopmentServicesBuiltAroundNewSection from "./MobileAppDevelopmentServicesBuiltAroundNewSection";
import DevelopersSection from "./DevelopersSection";
import CustomMobileAppDevelopmentForNewYorkSection from "./CustomMobileAppDevelopmentForNewYorkSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import SeenWhatSPossibleNowLetSSection from "./SeenWhatSPossibleNowLetSSection";
import FutureReadyMobileAppDevelopmentProcessForSection from "./FutureReadyMobileAppDevelopmentProcessForSection";
import TechnologyChoicesBehindSustainableMobileAppDevelopmentSection from "./TechnologyChoicesBehindSustainableMobileAppDevelopmentSection";
import EmergingTechnologiesReshapingMobileAppDevelopmentInSection from "./EmergingTechnologiesReshapingMobileAppDevelopmentInSection";
import SmartFeaturesForSmarterMobileAppDevelopmentSection from "./SmartFeaturesForSmarterMobileAppDevelopmentSection";
import SophisticatedDigitalProductsEngineeredInManhattanSection from "./SophisticatedDigitalProductsEngineeredInManhattanSection";
import MobileAppDevelopmentCostEstimatesByProductSection from "./MobileAppDevelopmentCostEstimatesByProductSection";
import WhyNewYorkBusinessesChooseInceptivesDigitalSection from "./WhyNewYorkBusinessesChooseInceptivesDigitalSection";
import BeforeYouInvestSixFiguresInAnSection from "./BeforeYouInvestSixFiguresInAnSection";
import FAQsAboutMobileAppDevelopmentInNewSection from "./FAQsAboutMobileAppDevelopmentInNewSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "4f8c8f04": HeroSection,
  "6a7ccdb1": MobileAppDevelopmentClientsAcrossDifferentSectorsSection,
  "29b37514": CreatingDigitalExperiencesForNewYorkSSection,
  "8af92a6": MobileAppDevelopmentServicesBuiltAroundNewSection,
  "189363b7": DevelopersSection,
  "1c46cb5d": CustomMobileAppDevelopmentForNewYorkSection,
  "69f89bf": YourIdeaDeservesBetterThanAverageExecutionSection,
  "56176342": WhatOurClientsSayAboutBuildingWithSection,
  "457565d": SeenWhatSPossibleNowLetSSection,
  "28e852f7": FutureReadyMobileAppDevelopmentProcessForSection,
  "751121f1": TechnologyChoicesBehindSustainableMobileAppDevelopmentSection,
  "117eade1": EmergingTechnologiesReshapingMobileAppDevelopmentInSection,
  "6d03c40d": SmartFeaturesForSmarterMobileAppDevelopmentSection,
  "28a87be": SophisticatedDigitalProductsEngineeredInManhattanSection,
  "e71120d": MobileAppDevelopmentCostEstimatesByProductSection,
  "d36026d": WhyNewYorkBusinessesChooseInceptivesDigitalSection,
  "44497a43": BeforeYouInvestSixFiguresInAnSection,
  "6cdff814": FAQsAboutMobileAppDevelopmentInNewSection
  }, false, children);
}
