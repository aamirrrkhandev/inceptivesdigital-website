import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import IOSApplicationDevelopmentCompanyTrustedByGlobalSection from "./IOSApplicationDevelopmentCompanyTrustedByGlobalSection";
import CustomIOSAppDevelopmentServicesBackedBySection from "./CustomIOSAppDevelopmentServicesBackedBySection";
import OurEndToEndIOSApplicationDevelopmentSection from "./OurEndToEndIOSApplicationDevelopmentSection";
import OneSharedCodebaseBuiltForEveryAppleSection from "./OneSharedCodebaseBuiltForEveryAppleSection";
import TheBestIPhoneApplicationYourBusinessDeservesSection from "./TheBestIPhoneApplicationYourBusinessDeservesSection";
import IOSAppDevelopmentSolutionsAcross20IndustriesSection from "./IOSAppDevelopmentSolutionsAcross20IndustriesSection";
import MakeA60SecondArchitectureDecisionSection from "./MakeA60SecondArchitectureDecisionSection";
import ExploreTheIOSApplicationsWeVeTakenSection from "./ExploreTheIOSApplicationsWeVeTakenSection";
import WhatClientsSayAboutInceptivesDigitalSSection from "./WhatClientsSayAboutInceptivesDigitalSSection";
import InceptivesDigitalSAchievementsSection from "./InceptivesDigitalSAchievementsSection";
import BringYourBriefWeLlPutASection from "./BringYourBriefWeLlPutASection";
import TheStandardThatMakesInceptivesDigitalASection from "./TheStandardThatMakesInceptivesDigitalASection";
import Content13Section from "./Content13Section";
import IOSAppDevelopmentCompanyInTheUSASection from "./IOSAppDevelopmentCompanyInTheUSASection";
import OurIOSApplicationDevelopmentServicesProcessStepSection from "./OurIOSApplicationDevelopmentServicesProcessStepSection";
import TechnologiesBehindOurNativeIOSAppDevelopmentSection from "./TechnologiesBehindOurNativeIOSAppDevelopmentSection";
import HowWeArchitectNativeIPhoneAndIOSSection from "./HowWeArchitectNativeIPhoneAndIOSSection";
import TechnologyPartnershipsThatStrengthenEveryDigitalProductSection from "./TechnologyPartnershipsThatStrengthenEveryDigitalProductSection";
import AdvancedTechnologiesPoweringOurIOSAppDevelopmentSection from "./AdvancedTechnologiesPoweringOurIOSAppDevelopmentSection";
import HireIOSAppDevelopersWithAnEngagementSection from "./HireIOSAppDevelopersWithAnEngagementSection";
import HowManyHoursDoesEachIOSFeatureSection from "./HowManyHoursDoesEachIOSFeatureSection";
import HowMuchDoesIOSAppDevelopmentCostSection from "./HowMuchDoesIOSAppDevelopmentCostSection";
import PriceYourNextIPhoneAppWithOurSection from "./PriceYourNextIPhoneAppWithOurSection";
import FrequentlyAskedQuestionsAboutIOSAppDevelopmentSection from "./FrequentlyAskedQuestionsAboutIOSAppDevelopmentSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "68d6a649": HeroSection,
  "73eac31a": IOSApplicationDevelopmentCompanyTrustedByGlobalSection,
  "dcdfe5b": CustomIOSAppDevelopmentServicesBackedBySection,
  "18228b56": OurEndToEndIOSApplicationDevelopmentSection,
  "428a9f76": OneSharedCodebaseBuiltForEveryAppleSection,
  "44d8686c": TheBestIPhoneApplicationYourBusinessDeservesSection,
  "38845b0e": IOSAppDevelopmentSolutionsAcross20IndustriesSection,
  "4d739bc5": MakeA60SecondArchitectureDecisionSection,
  "268a0f34": ExploreTheIOSApplicationsWeVeTakenSection,
  "7947cbae": WhatClientsSayAboutInceptivesDigitalSSection,
  "25252b15": InceptivesDigitalSAchievementsSection,
  "9245cbf": BringYourBriefWeLlPutASection,
  "2732ddaa": TheStandardThatMakesInceptivesDigitalASection,
  "32a6691a": Content13Section,
  "26fd30f7": IOSAppDevelopmentCompanyInTheUSASection,
  "542f0006": OurIOSApplicationDevelopmentServicesProcessStepSection,
  "62b44d0f": TechnologiesBehindOurNativeIOSAppDevelopmentSection,
  "38b24709": HowWeArchitectNativeIPhoneAndIOSSection,
  "713d2fd": TechnologyPartnershipsThatStrengthenEveryDigitalProductSection,
  "3a19b6ee": AdvancedTechnologiesPoweringOurIOSAppDevelopmentSection,
  "784f5cab": HireIOSAppDevelopersWithAnEngagementSection,
  "2e5f7e28": HowManyHoursDoesEachIOSFeatureSection,
  "6c18e37b": HowMuchDoesIOSAppDevelopmentCostSection,
  "3f9118fd": PriceYourNextIPhoneAppWithOurSection,
  "b74cf6c": FrequentlyAskedQuestionsAboutIOSAppDevelopmentSection
  }, false, children);
}
