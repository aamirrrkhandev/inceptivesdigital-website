import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import ChosenByBusinessesDrivingDigitalGrowthInSection from "./ChosenByBusinessesDrivingDigitalGrowthInSection";
import CreatingDigitalExperiencesForNewYorkSSection from "./CreatingDigitalExperiencesForNewYorkSSection";
import CustomMobileAppDevelopmentServicesInSingaporeSection from "./CustomMobileAppDevelopmentServicesInSingaporeSection";
import DevelopersSection from "./DevelopersSection";
import DeepEngineeringExpertiseAcross20SectorsSection from "./DeepEngineeringExpertiseAcross20SectorsSection";
import RealProductsMeaningfulOutcomesSection from "./RealProductsMeaningfulOutcomesSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import TellUsWhatYouReBuildingNextSection from "./TellUsWhatYouReBuildingNextSection";
import MobileAppDevelopmentProcessFollowedByInceptivesSection from "./MobileAppDevelopmentProcessFollowedByInceptivesSection";
import ModernEngineeringStackForMobileAppDevelopmentSection from "./ModernEngineeringStackForMobileAppDevelopmentSection";
import EnsuringYourAppSFutureReadinessWithSection from "./EnsuringYourAppSFutureReadinessWithSection";
import SmartFeaturesForSmarterMobileAppDevelopmentSection from "./SmartFeaturesForSmarterMobileAppDevelopmentSection";
import TheBusinessCaseForMobileAppDevelopmentSection from "./TheBusinessCaseForMobileAppDevelopmentSection";
import SophisticatedDigitalProductsEngineeredInManhattanSection from "./SophisticatedDigitalProductsEngineeredInManhattanSection";
import WhatMobileAppDevelopmentCostsInSingaporeSection from "./WhatMobileAppDevelopmentCostsInSingaporeSection";
import TheReasonsBusinessesChooseToBuildWithSection from "./TheReasonsBusinessesChooseToBuildWithSection";
import HaveAMobileProductIdeaLetSSection from "./HaveAMobileProductIdeaLetSSection";
import FAQsAboutMobileAppDevelopmentInNewSection from "./FAQsAboutMobileAppDevelopmentInNewSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "4f8c8f04": HeroSection,
  "6a7ccdb1": ChosenByBusinessesDrivingDigitalGrowthInSection,
  "29b37514": CreatingDigitalExperiencesForNewYorkSSection,
  "8af92a6": CustomMobileAppDevelopmentServicesInSingaporeSection,
  "189363b7": DevelopersSection,
  "1c46cb5d": DeepEngineeringExpertiseAcross20SectorsSection,
  "2334e0e2": RealProductsMeaningfulOutcomesSection,
  "f4b17fe": WhatOurClientsSayAboutBuildingWithSection,
  "130946c": TellUsWhatYouReBuildingNextSection,
  "28e852f7": MobileAppDevelopmentProcessFollowedByInceptivesSection,
  "751121f1": ModernEngineeringStackForMobileAppDevelopmentSection,
  "117eade1": EnsuringYourAppSFutureReadinessWithSection,
  "6d03c40d": SmartFeaturesForSmarterMobileAppDevelopmentSection,
  "14c11b0a": TheBusinessCaseForMobileAppDevelopmentSection,
  "c144ace": SophisticatedDigitalProductsEngineeredInManhattanSection,
  "e71120d": WhatMobileAppDevelopmentCostsInSingaporeSection,
  "d36026d": TheReasonsBusinessesChooseToBuildWithSection,
  "44497a43": HaveAMobileProductIdeaLetSSection,
  "6cdff814": FAQsAboutMobileAppDevelopmentInNewSection
  }, false, children);
}
