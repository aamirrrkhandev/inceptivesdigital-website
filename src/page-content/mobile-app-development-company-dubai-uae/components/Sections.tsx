import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import ReliableProductPartnerForBusinessesScalingAcrossSection from "./ReliableProductPartnerForBusinessesScalingAcrossSection";
import InDepthMobileAppDevelopmentServicesInSection from "./InDepthMobileAppDevelopmentServicesInSection";
import DevelopersSection from "./DevelopersSection";
import ExpertiseIn20ContemporaryDigitalIndustriesSection from "./ExpertiseIn20ContemporaryDigitalIndustriesSection";
import MobileAppsBuiltAndShippedSection from "./MobileAppsBuiltAndShippedSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import ReadyToBuildTheAppThatSetsSection from "./ReadyToBuildTheAppThatSetsSection";
import EveryAppFollowsADefinedEngineeringWorkflowSection from "./EveryAppFollowsADefinedEngineeringWorkflowSection";
import TechnologyStackForMobileAppsInDubaiSection from "./TechnologyStackForMobileAppsInDubaiSection";
import AIIsBecomingPartOfOurCoreSection from "./AIIsBecomingPartOfOurCoreSection";
import SmartFeaturesForSmarterMobileAppDevelopmentSection from "./SmartFeaturesForSmarterMobileAppDevelopmentSection";
import EngineeringDigitalProductsForLondonSCompetitiveSection from "./EngineeringDigitalProductsForLondonSCompetitiveSection";
import KnowTheProductInvestmentForMobileAppSection from "./KnowTheProductInvestmentForMobileAppSection";
import WhatDefinesInceptivesDigitalAsALeadingSection from "./WhatDefinesInceptivesDigitalAsALeadingSection";
import WhateverAppYouReBuildingLetSSection from "./WhateverAppYouReBuildingLetSSection";
import FrequentlyAskedQuestionsSection from "./FrequentlyAskedQuestionsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "4f8c8f04": HeroSection,
  "6a7ccdb1": ReliableProductPartnerForBusinessesScalingAcrossSection,
  "8af92a6": InDepthMobileAppDevelopmentServicesInSection,
  "189363b7": DevelopersSection,
  "1c46cb5d": ExpertiseIn20ContemporaryDigitalIndustriesSection,
  "1e5a9741": MobileAppsBuiltAndShippedSection,
  "3c0958c4": WhatOurClientsSayAboutBuildingWithSection,
  "a76615e": ReadyToBuildTheAppThatSetsSection,
  "28e852f7": EveryAppFollowsADefinedEngineeringWorkflowSection,
  "751121f1": TechnologyStackForMobileAppsInDubaiSection,
  "117eade1": AIIsBecomingPartOfOurCoreSection,
  "6d03c40d": SmartFeaturesForSmarterMobileAppDevelopmentSection,
  "e839262": EngineeringDigitalProductsForLondonSCompetitiveSection,
  "e71120d": KnowTheProductInvestmentForMobileAppSection,
  "d36026d": WhatDefinesInceptivesDigitalAsALeadingSection,
  "44497a43": WhateverAppYouReBuildingLetSSection,
  "6cdff814": FrequentlyAskedQuestionsSection
  }, false, children);
}
