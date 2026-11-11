import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import ProductsDeliveredSection from "./ProductsDeliveredSection";
import WhyTheRightStrategyOutperformsTheFasterSection from "./WhyTheRightStrategyOutperformsTheFasterSection";
import WhenProductStrategyConsultingMakesTheBiggestSection from "./WhenProductStrategyConsultingMakesTheBiggestSection";
import TheStrategyAndConsultingServicesBehindEverySection from "./TheStrategyAndConsultingServicesBehindEverySection";
import WhyChooseUsForYourProductStrategySection from "./WhyChooseUsForYourProductStrategySection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import OurConsultingExpertiseAcrossIndustriesSection from "./OurConsultingExpertiseAcrossIndustriesSection";
import TechnologyChoicesThatSupportLongTermProductSection from "./TechnologyChoicesThatSupportLongTermProductSection";
import OurProductStrategyProcessCreatesClearBusinessSection from "./OurProductStrategyProcessCreatesClearBusinessSection";
import EmergingTechnologiesInfluencingModernProductDesignSection from "./EmergingTechnologiesInfluencingModernProductDesignSection";
import ReadyToTurnYourIdeaIntoYourSection from "./ReadyToTurnYourIdeaIntoYourSection";
import FrequentlyAskedQuestionsSection from "./FrequentlyAskedQuestionsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "0157a12": HeroSection,
  "3f00221": ProductsDeliveredSection,
  "d90f821": WhyTheRightStrategyOutperformsTheFasterSection,
  "db8a8c9": WhenProductStrategyConsultingMakesTheBiggestSection,
  "d7f30a1": TheStrategyAndConsultingServicesBehindEverySection,
  "274236f": WhyChooseUsForYourProductStrategySection,
  "a770c00": YourIdeaDeservesBetterThanAverageExecutionSection,
  "4c58c478": WhatOurClientsSayAboutBuildingWithSection,
  "d4d7f38": OurConsultingExpertiseAcrossIndustriesSection,
  "6af365c0": TechnologyChoicesThatSupportLongTermProductSection,
  "b494364": OurProductStrategyProcessCreatesClearBusinessSection,
  "0dd8594": EmergingTechnologiesInfluencingModernProductDesignSection,
  "5e48868": ReadyToTurnYourIdeaIntoYourSection,
  "1e989ca": FrequentlyAskedQuestionsSection
  }, false, children);
}
