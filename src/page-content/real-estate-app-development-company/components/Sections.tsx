import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import Content1Section from "./Content1Section";
import RealEstateAppDevelopmentCompanyForEverySection from "./RealEstateAppDevelopmentCompanyForEverySection";
import LetSDisruptTheRealEstateSectorSection from "./LetSDisruptTheRealEstateSectorSection";
import RealEstateAppDevelopmentServicesDesignedForSection from "./RealEstateAppDevelopmentServicesDesignedForSection";
import BrandsThatHaveChosenOurHealthcareAppSection from "./BrandsThatHaveChosenOurHealthcareAppSection";
import GlobalComplianceStandardsBuiltIntoEveryHealthcareSection from "./GlobalComplianceStandardsBuiltIntoEveryHealthcareSection";
import RealEstateAppDevelopmentCompanyOfferingCuttingSection from "./RealEstateAppDevelopmentCompanyOfferingCuttingSection";
import TheProjectsThatDefineOurRealEstateSection from "./TheProjectsThatDefineOurRealEstateSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import ReadyToBuildYourNextRealEstateSection from "./ReadyToBuildYourNextRealEstateSection";
import HowOurRealEstateAppDevelopmentCompanySection from "./HowOurRealEstateAppDevelopmentCompanySection";
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
  "1572568": RealEstateAppDevelopmentCompanyForEverySection,
  "be85ac9": LetSDisruptTheRealEstateSectorSection,
  "e27a68c": RealEstateAppDevelopmentServicesDesignedForSection,
  "0073cc9": BrandsThatHaveChosenOurHealthcareAppSection,
  "687d11c": GlobalComplianceStandardsBuiltIntoEveryHealthcareSection,
  "bc3239b": RealEstateAppDevelopmentCompanyOfferingCuttingSection,
  "199ca653": TheProjectsThatDefineOurRealEstateSection,
  "73008d5f": WhatOurClientsSayAboutBuildingWithSection,
  "d4bb68e": ReadyToBuildYourNextRealEstateSection,
  "d05828e": HowOurRealEstateAppDevelopmentCompanySection,
  "61692113": TheTechBackboneOfOurRealEstateSection,
  "79dae1c": AdvancedTechnologiesWeUseAsARealSection,
  "783dbf1": RealEstateAppDevelopmentCostEstimatesSection,
  "b042bf0": WhatOurRealEstateAppDevelopmentCompanySection,
  "b620e24": ReadyToBuildARealEstatePlatformSection,
  "88a2499": AwardsAndRecognitionsSection,
  "c080077": QuestionsAboutRealEstateAppDevelopmentWorthSection
  }, false, children);
}
