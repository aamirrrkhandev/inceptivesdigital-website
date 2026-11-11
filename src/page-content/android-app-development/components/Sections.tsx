import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import GloballyRecognizedAsAnAndroidAppDevelopmentSection from "./GloballyRecognizedAsAnAndroidAppDevelopmentSection";
import YourAndroidProductDeservesMoreThanAnSection from "./YourAndroidProductDeservesMoreThanAnSection";
import AndroidAppDevelopmentBackedByTheRightSection from "./AndroidAppDevelopmentBackedByTheRightSection";
import ShouldYouBuildNativeKotlinOrGoSection from "./ShouldYouBuildNativeKotlinOrGoSection";
import StillNotSureWhichDevelopmentApproachFitsSection from "./StillNotSureWhichDevelopmentApproachFitsSection";
import OurPortfolioBackedByRealAndroidEngineeringSection from "./OurPortfolioBackedByRealAndroidEngineeringSection";
import WhatItSLikeToBuildWithSection from "./WhatItSLikeToBuildWithSection";
import IndustryFocusedCustomAndroidDevelopmentAcrossEverySection from "./IndustryFocusedCustomAndroidDevelopmentAcrossEverySection";
import TheAdvantageOfWorkingWithInceptivesDigitalSection from "./TheAdvantageOfWorkingWithInceptivesDigitalSection";
import TheBestTimeTeamToGetYourSection from "./TheBestTimeTeamToGetYourSection";
import HIREANDROIDDEVELOPERSWITHCONFIDENCESection from "./HIREANDROIDDEVELOPERSWITHCONFIDENCESection";
import Section5StepProcedureForAndroidAppDevelopmentSection from "./Section5StepProcedureForAndroidAppDevelopmentSection";
import TechStackForAndroidAppsChosenAroundSection from "./TechStackForAndroidAppsChosenAroundSection";
import BuiltOnProvenAndroidTechnologiesSection from "./BuiltOnProvenAndroidTechnologiesSection";
import EngineeringWhatSNextInAndroidAppSection from "./EngineeringWhatSNextInAndroidAppSection";
import HowMuchDoesAndroidAppDevelopmentCostSection from "./HowMuchDoesAndroidAppDevelopmentCostSection";
import SendInYourBriefAndReceiveASection from "./SendInYourBriefAndReceiveASection";
import FrequentlyAskedQuestionsAboutAndroidAppDevelopmentSection from "./FrequentlyAskedQuestionsAboutAndroidAppDevelopmentSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "78bcd53": HeroSection,
  "9b4af3b": GloballyRecognizedAsAnAndroidAppDevelopmentSection,
  "e3272b8": YourAndroidProductDeservesMoreThanAnSection,
  "d859ac2": AndroidAppDevelopmentBackedByTheRightSection,
  "9131aed": ShouldYouBuildNativeKotlinOrGoSection,
  "7299b393": StillNotSureWhichDevelopmentApproachFitsSection,
  "349abdd8": OurPortfolioBackedByRealAndroidEngineeringSection,
  "46c57497": WhatItSLikeToBuildWithSection,
  "7c7c15f6": IndustryFocusedCustomAndroidDevelopmentAcrossEverySection,
  "0267afe": TheAdvantageOfWorkingWithInceptivesDigitalSection,
  "0c946cf": TheBestTimeTeamToGetYourSection,
  "e18c49c": HIREANDROIDDEVELOPERSWITHCONFIDENCESection,
  "5e10a97": Section5StepProcedureForAndroidAppDevelopmentSection,
  "1ccb39dc": TechStackForAndroidAppsChosenAroundSection,
  "22e702d": BuiltOnProvenAndroidTechnologiesSection,
  "ea314dd": EngineeringWhatSNextInAndroidAppSection,
  "8175609": HowMuchDoesAndroidAppDevelopmentCostSection,
  "5467e61": SendInYourBriefAndReceiveASection,
  "fb95f7b": FrequentlyAskedQuestionsAboutAndroidAppDevelopmentSection
  }, false, children);
}
