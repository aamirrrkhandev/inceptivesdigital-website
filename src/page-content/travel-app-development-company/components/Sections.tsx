import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import Content1Section from "./Content1Section";
import BuildATravelPlatformDesignedAroundYourSection from "./BuildATravelPlatformDesignedAroundYourSection";
import CustomTravelAppDevelopmentServicesForEverySection from "./CustomTravelAppDevelopmentServicesForEverySection";
import TravelAppDevelopmentCompanyDrivingEngagementGloballySection from "./TravelAppDevelopmentCompanyDrivingEngagementGloballySection";
import TravelAppDevelopmentProjectsWeVeDeliveredSection from "./TravelAppDevelopmentProjectsWeVeDeliveredSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import RestyleTheFutureOfTravelWithOurSection from "./RestyleTheFutureOfTravelWithOurSection";
import HowOurTravelAppDevelopmentCompanyMapsSection from "./HowOurTravelAppDevelopmentCompanyMapsSection";
import RealEstateAppDevelopmentCompanyForEverySection from "./RealEstateAppDevelopmentCompanyForEverySection";
import GlobalComplianceStandardsBuiltIntoEveryHealthcareSection from "./GlobalComplianceStandardsBuiltIntoEveryHealthcareSection";
import RealEstateAppDevelopmentCompanyOfferingCuttingSection from "./RealEstateAppDevelopmentCompanyOfferingCuttingSection";
import ReadyToBuildYourNextRealEstateSection from "./ReadyToBuildYourNextRealEstateSection";
import TheTechBackboneOfOurRealEstateSection from "./TheTechBackboneOfOurRealEstateSection";
import AdvancedTechnologiesWeUseAsARealSection from "./AdvancedTechnologiesWeUseAsARealSection";
import RealEstateAppDevelopmentCostEstimatesSection from "./RealEstateAppDevelopmentCostEstimatesSection";
import WhatOurRealEstateAppDevelopmentCompanySection from "./WhatOurRealEstateAppDevelopmentCompanySection";
import ReadyToBuildARealEstatePlatformSection from "./ReadyToBuildARealEstatePlatformSection";
import AwardsAndRecognitionsSection from "./AwardsAndRecognitionsSection";
import QuestionsAboutRealEstateAppDevelopmentWorthSection from "./QuestionsAboutRealEstateAppDevelopmentWorthSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "a474156": HeroSection,
  "af0e2ba": Content1Section,
  "be85ac9": BuildATravelPlatformDesignedAroundYourSection,
  "e27a68c": CustomTravelAppDevelopmentServicesForEverySection,
  "0073cc9": TravelAppDevelopmentCompanyDrivingEngagementGloballySection,
  "5ec923ea": TravelAppDevelopmentProjectsWeVeDeliveredSection,
  "9eea285": WhatOurClientsSayAboutBuildingWithSection,
  "d4bb68e": RestyleTheFutureOfTravelWithOurSection,
  "d05828e": HowOurTravelAppDevelopmentCompanyMapsSection,
  "1572568": RealEstateAppDevelopmentCompanyForEverySection,
  "687d11c": GlobalComplianceStandardsBuiltIntoEveryHealthcareSection,
  "bc3239b": RealEstateAppDevelopmentCompanyOfferingCuttingSection,
  "9900844": ReadyToBuildYourNextRealEstateSection,
  "61692113": TheTechBackboneOfOurRealEstateSection,
  "79dae1c": AdvancedTechnologiesWeUseAsARealSection,
  "783dbf1": RealEstateAppDevelopmentCostEstimatesSection,
  "b042bf0": WhatOurRealEstateAppDevelopmentCompanySection,
  "b620e24": ReadyToBuildARealEstatePlatformSection,
  "88a2499": AwardsAndRecognitionsSection,
  "c080077": QuestionsAboutRealEstateAppDevelopmentWorthSection
  }, false, children);
}
