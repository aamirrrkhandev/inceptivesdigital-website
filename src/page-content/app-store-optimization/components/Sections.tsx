import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import TheASOPartnerTrustedByGrowthFocusedSection from "./TheASOPartnerTrustedByGrowthFocusedSection";
import WhyMostAppsStayInvisibleWithoutASection from "./WhyMostAppsStayInvisibleWithoutASection";
import ASOServicesStructuredAroundYourProductAndSection from "./ASOServicesStructuredAroundYourProductAndSection";
import ASOAppleSearchAdsAndPaidUASection from "./ASOAppleSearchAdsAndPaidUASection";
import YourAppBelongsInThe10OfSection from "./YourAppBelongsInThe10OfSection";
import TheIndustriesWhereOurBetterASOChangesSection from "./TheIndustriesWhereOurBetterASOChangesSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import WhyGrowthFocusedBrandsChooseInceptivesDigitalSection from "./WhyGrowthFocusedBrandsChooseInceptivesDigitalSection";
import YourAppSStorePerformanceHasRoomSection from "./YourAppSStorePerformanceHasRoomSection";
import Content11Section from "./Content11Section";
import TheToolsAndDataLayersBehindTheSection from "./TheToolsAndDataLayersBehindTheSection";
import TheDataSourcesAndOptimizationSystemsBehindSection from "./TheDataSourcesAndOptimizationSystemsBehindSection";
import HowAnASOEngagementWorksAtInceptivesSection from "./HowAnASOEngagementWorksAtInceptivesSection";
import HowMuchDoesAppStoreOptimizationCostSection from "./HowMuchDoesAppStoreOptimizationCostSection";
import StopGuessingStartGrowingWithAnASOSection from "./StopGuessingStartGrowingWithAnASOSection";
import FAQsSection from "./FAQsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "78bcd53": HeroSection,
  "feaed19": TheASOPartnerTrustedByGrowthFocusedSection,
  "db9f40a": WhyMostAppsStayInvisibleWithoutASection,
  "d859ac2": ASOServicesStructuredAroundYourProductAndSection,
  "3c98edc": ASOAppleSearchAdsAndPaidUASection,
  "1b00dd1": YourAppBelongsInThe10OfSection,
  "02a5cdd": TheIndustriesWhereOurBetterASOChangesSection,
  "08df58c": YourIdeaDeservesBetterThanAverageExecutionSection,
  "69beca0a": WhatOurClientsSayAboutBuildingWithSection,
  "0267afe": WhyGrowthFocusedBrandsChooseInceptivesDigitalSection,
  "e0b16ac": YourAppSStorePerformanceHasRoomSection,
  "25db4d6": Content11Section,
  "cfb0269": TheToolsAndDataLayersBehindTheSection,
  "ea314dd": TheDataSourcesAndOptimizationSystemsBehindSection,
  "5e10a97": HowAnASOEngagementWorksAtInceptivesSection,
  "8175609": HowMuchDoesAppStoreOptimizationCostSection,
  "5467e61": StopGuessingStartGrowingWithAnASOSection,
  "fb95f7b": FAQsSection
  }, false, children);
}
