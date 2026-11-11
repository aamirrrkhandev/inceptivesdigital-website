import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import ThePostLaunchAnalyticsPartnerForGrowthSection from "./ThePostLaunchAnalyticsPartnerForGrowthSection";
import WhyProductsThatLaunchWellStillStruggleSection from "./WhyProductsThatLaunchWellStillStruggleSection";
import PostLaunchAnalyticsAndIterationServicesBuiltSection from "./PostLaunchAnalyticsAndIterationServicesBuiltSection";
import PostLaunchIterationVsOngoingMaintenanceSection from "./PostLaunchIterationVsOngoingMaintenanceSection";
import TheFirst90DaysAfterLaunchCarrySection from "./TheFirst90DaysAfterLaunchCarrySection";
import IndustriesWherePostLaunchAnalyticsAndIterationSection from "./IndustriesWherePostLaunchAnalyticsAndIterationSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhyProductTeamsChooseInceptivesDigitalAfterSection from "./WhyProductTeamsChooseInceptivesDigitalAfterSection";
import PutASpecialistOnYourPostLaunchSection from "./PutASpecialistOnYourPostLaunchSection";
import Content10Section from "./Content10Section";
import TheToolsAndDataSystemsInceptivesDigitalSection from "./TheToolsAndDataSystemsInceptivesDigitalSection";
import HowPostLaunchAnalyticsAndIterationEngagementSection from "./HowPostLaunchAnalyticsAndIterationEngagementSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import HowMuchDoesAPostLaunchAnalyticsSection from "./HowMuchDoesAPostLaunchAnalyticsSection";
import YourLaunchDataIsAlreadyTellingYouSection from "./YourLaunchDataIsAlreadyTellingYouSection";
import FAQsSection from "./FAQsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "78bcd53": HeroSection,
  "3c9d325": ThePostLaunchAnalyticsPartnerForGrowthSection,
  "16879f3": WhyProductsThatLaunchWellStillStruggleSection,
  "d859ac2": PostLaunchAnalyticsAndIterationServicesBuiltSection,
  "c316ca6": PostLaunchIterationVsOngoingMaintenanceSection,
  "1b00dd1": TheFirst90DaysAfterLaunchCarrySection,
  "c82252d": IndustriesWherePostLaunchAnalyticsAndIterationSection,
  "61dd5c1": YourIdeaDeservesBetterThanAverageExecutionSection,
  "0267afe": WhyProductTeamsChooseInceptivesDigitalAfterSection,
  "c97ffd1": PutASpecialistOnYourPostLaunchSection,
  "64efedb": Content10Section,
  "cfb0269": TheToolsAndDataSystemsInceptivesDigitalSection,
  "5e10a97": HowPostLaunchAnalyticsAndIterationEngagementSection,
  "63d6137e": WhatOurClientsSayAboutBuildingWithSection,
  "8175609": HowMuchDoesAPostLaunchAnalyticsSection,
  "5467e61": YourLaunchDataIsAlreadyTellingYouSection,
  "fb95f7b": FAQsSection
  }, false, children);
}
