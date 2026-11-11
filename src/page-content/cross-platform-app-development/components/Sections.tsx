import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import AwardsRecognitionThatReflectOurCrossPlatformSection from "./AwardsRecognitionThatReflectOurCrossPlatformSection";
import ExperiencedCrossPlatformDevelopersForComplexMobileSection from "./ExperiencedCrossPlatformDevelopersForComplexMobileSection";
import OurComprehensiveCrossPlatformAppDevelopmentServicesSection from "./OurComprehensiveCrossPlatformAppDevelopmentServicesSection";
import DiscussYourCrossPlatformAppWithOurSection from "./DiscussYourCrossPlatformAppWithOurSection";
import TheFrameworksBehindEveryCrossPlatformAppSection from "./TheFrameworksBehindEveryCrossPlatformAppSection";
import Content6Section from "./Content6Section";
import TailoredCrossPlatformSolutionsFor20MarketSection from "./TailoredCrossPlatformSolutionsFor20MarketSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatClientsSayAboutWorkingWithInceptivesSection from "./WhatClientsSayAboutWorkingWithInceptivesSection";
import WhatSetsInceptivesDigitalSCrossPlatformSection from "./WhatSetsInceptivesDigitalSCrossPlatformSection";
import AlignYourProductRequirementsWithTheRightSection from "./AlignYourProductRequirementsWithTheRightSection";
import TechnologyPartnershipsPoweringCrossPlatformEngineeringSection from "./TechnologyPartnershipsPoweringCrossPlatformEngineeringSection";
import NewTechnologiesThatExpandThePotentialOfSection from "./NewTechnologiesThatExpandThePotentialOfSection";
import Our5StepCrossPlatformAppDevelopmentSection from "./Our5StepCrossPlatformAppDevelopmentSection";
import HowMuchDoeCrossPlatformAppDevelopmentSection from "./HowMuchDoeCrossPlatformAppDevelopmentSection";
import ReadyToLaunchYourMultiPlatformStrategySection from "./ReadyToLaunchYourMultiPlatformStrategySection";
import FAQsSection from "./FAQsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "78bcd53": HeroSection,
  "9e5c7cc": AwardsRecognitionThatReflectOurCrossPlatformSection,
  "2ed02e9": ExperiencedCrossPlatformDevelopersForComplexMobileSection,
  "d859ac2": OurComprehensiveCrossPlatformAppDevelopmentServicesSection,
  "728b279e": DiscussYourCrossPlatformAppWithOurSection,
  "6a20f63": TheFrameworksBehindEveryCrossPlatformAppSection,
  "dec1d98": Content6Section,
  "84e919f": TailoredCrossPlatformSolutionsFor20MarketSection,
  "580dd9e4": YourIdeaDeservesBetterThanAverageExecutionSection,
  "6efa8945": WhatClientsSayAboutWorkingWithInceptivesSection,
  "0267afe": WhatSetsInceptivesDigitalSCrossPlatformSection,
  "2eb4671": AlignYourProductRequirementsWithTheRightSection,
  "cfb0269": TechnologyPartnershipsPoweringCrossPlatformEngineeringSection,
  "ea314dd": NewTechnologiesThatExpandThePotentialOfSection,
  "5e10a97": Our5StepCrossPlatformAppDevelopmentSection,
  "8175609": HowMuchDoeCrossPlatformAppDevelopmentSection,
  "5467e61": ReadyToLaunchYourMultiPlatformStrategySection,
  "fb95f7b": FAQsSection
  }, false, children);
}
