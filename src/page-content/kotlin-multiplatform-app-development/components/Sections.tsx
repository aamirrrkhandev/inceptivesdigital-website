import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import TrustedByProductTeamsShippingOnKotlinSection from "./TrustedByProductTeamsShippingOnKotlinSection";
import WhyAreExperiencedProductTeamsMovingToSection from "./WhyAreExperiencedProductTeamsMovingToSection";
import IsKotlinMultiplatformTheRightArchitectureForSection from "./IsKotlinMultiplatformTheRightArchitectureForSection";
import OurWideRangeOfKotlinMultiplatformAppSection from "./OurWideRangeOfKotlinMultiplatformAppSection";
import Content5Section from "./Content5Section";
import ReadyToScopeYourKMPProjectSection from "./ReadyToScopeYourKMPProjectSection";
import IndustriesWeBuildKMPSolutionsForSection from "./IndustriesWeBuildKMPSolutionsForSection";
import OurPortfolioOfProductionGradeKMPProductsSection from "./OurPortfolioOfProductionGradeKMPProductsSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import ReadyToSeeIfKMPFitsYourSection from "./ReadyToSeeIfKMPFitsYourSection";
import WhyChooseInceptivesDigitalAsYourMultiplatformSection from "./WhyChooseInceptivesDigitalAsYourMultiplatformSection";
import OurKotlinMultiplatformDevelopmentProcessSection from "./OurKotlinMultiplatformDevelopmentProcessSection";
import ToolsThatHoldEveryKMPBuildAtSection from "./ToolsThatHoldEveryKMPBuildAtSection";
import HowKotlinMultiplatformWorksArchitectureOverviewSection from "./HowKotlinMultiplatformWorksArchitectureOverviewSection";
import TheCostOfGettingKMPArchitectureRightSection from "./TheCostOfGettingKMPArchitectureRightSection";
import GetACustomEstimateForYourKMPSection from "./GetACustomEstimateForYourKMPSection";
import FAQsSection from "./FAQsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "78bcd53": HeroSection,
  "fce0553": TrustedByProductTeamsShippingOnKotlinSection,
  "9596463": WhyAreExperiencedProductTeamsMovingToSection,
  "6d4a1d3": IsKotlinMultiplatformTheRightArchitectureForSection,
  "d859ac2": OurWideRangeOfKotlinMultiplatformAppSection,
  "2771446": Content5Section,
  "5031d2b": ReadyToScopeYourKMPProjectSection,
  "c5abeda": IndustriesWeBuildKMPSolutionsForSection,
  "7868c7f1": OurPortfolioOfProductionGradeKMPProductsSection,
  "73008d5f": WhatOurClientsSayAboutBuildingWithSection,
  "6712c03": ReadyToSeeIfKMPFitsYourSection,
  "0267afe": WhyChooseInceptivesDigitalAsYourMultiplatformSection,
  "9d5f32f": OurKotlinMultiplatformDevelopmentProcessSection,
  "17811c26": ToolsThatHoldEveryKMPBuildAtSection,
  "1ab999cb": HowKotlinMultiplatformWorksArchitectureOverviewSection,
  "8175609": TheCostOfGettingKMPArchitectureRightSection,
  "5467e61": GetACustomEstimateForYourKMPSection,
  "fb95f7b": FAQsSection
  }, false, children);
}
