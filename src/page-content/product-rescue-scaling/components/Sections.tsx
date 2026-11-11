import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import SeniorLedProductRescueSection from "./SeniorLedProductRescueSection";
import WhySuccessfulProductsLoseMomentumAfterTheirSection from "./WhySuccessfulProductsLoseMomentumAfterTheirSection";
import SignsYourDigitalProductNeedsARescueSection from "./SignsYourDigitalProductNeedsARescueSection";
import WhoBenefitsMostFromProductRescueServicesSection from "./WhoBenefitsMostFromProductRescueServicesSection";
import EveryProductRescueStartsWithAComprehensiveSection from "./EveryProductRescueStartsWithAComprehensiveSection";
import ServicesThatRestoreStabilityAndPrepareProductsSection from "./ServicesThatRestoreStabilityAndPrepareProductsSection";
import WhyFoundersChooseInceptivesDigitalForProductSection from "./WhyFoundersChooseInceptivesDigitalForProductSection";
import RescueAndRebuildVsStartingOverSection from "./RescueAndRebuildVsStartingOverSection";
import HowProductRescueChangesPerformanceStabilityAndSection from "./HowProductRescueChangesPerformanceStabilityAndSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import OURWORKACROSSINDUSTRIESSection from "./OURWORKACROSSINDUSTRIESSection";
import TheTechStackBehindEveryDiscoverySprintSection from "./TheTechStackBehindEveryDiscoverySprintSection";
import OurProvenProcessForRescuingAndScalingSection from "./OurProvenProcessForRescuingAndScalingSection";
import TurnYourStalledProductIntoAScalableSection from "./TurnYourStalledProductIntoAScalableSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "0157a12": HeroSection,
  "3f00221": SeniorLedProductRescueSection,
  "d90f821": WhySuccessfulProductsLoseMomentumAfterTheirSection,
  "e95f1a9": SignsYourDigitalProductNeedsARescueSection,
  "8527e82": WhoBenefitsMostFromProductRescueServicesSection,
  "2446f6a6": EveryProductRescueStartsWithAComprehensiveSection,
  "0784822": ServicesThatRestoreStabilityAndPrepareProductsSection,
  "158b406": WhyFoundersChooseInceptivesDigitalForProductSection,
  "6166183": RescueAndRebuildVsStartingOverSection,
  "8004a5c": HowProductRescueChangesPerformanceStabilityAndSection,
  "2dd49f2": YourIdeaDeservesBetterThanAverageExecutionSection,
  "5c761064": WhatOurClientsSayAboutBuildingWithSection,
  "cbbeab5": OURWORKACROSSINDUSTRIESSection,
  "f711838": TheTechStackBehindEveryDiscoverySprintSection,
  "b494364": OurProvenProcessForRescuingAndScalingSection,
  "5e48868": TurnYourStalledProductIntoAScalableSection,
  "1e989ca": FAQSSection
  }, false, children);
}
