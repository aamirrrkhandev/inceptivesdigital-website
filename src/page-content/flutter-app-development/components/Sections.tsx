import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import TheStudioBehindGlobalReactNativeProductSection from "./TheStudioBehindGlobalReactNativeProductSection";
import TheRealImpactOfFlutterMobileAppSection from "./TheRealImpactOfFlutterMobileAppSection";
import FlutterAppDevelopmentServicesScopedAroundYourSection from "./FlutterAppDevelopmentServicesScopedAroundYourSection";
import GetInTouchAndWeWillFigureSection from "./GetInTouchAndWeWillFigureSection";
import FlutterAppDevelopmentAcrossEveryMajorIndustrySection from "./FlutterAppDevelopmentAcrossEveryMajorIndustrySection";
import CaseStudiesFromFlutterAppsDevelopedAcrossSection from "./CaseStudiesFromFlutterAppsDevelopedAcrossSection";
import WhatMakesInceptivesDigitalTheRightFlutterSection from "./WhatMakesInceptivesDigitalTheRightFlutterSection";
import HowInceptivesDigitalTakesAFlutterAppSection from "./HowInceptivesDigitalTakesAFlutterAppSection";
import CollaborateWithOurFlutterMobileAppDevelopmentSection from "./CollaborateWithOurFlutterMobileAppDevelopmentSection";
import Content10Section from "./Content10Section";
import TheToolsAndTechnologiesThatPowerOurSection from "./TheToolsAndTechnologiesThatPowerOurSection";
import EmergingTechnologiesThatMakeFlutterProductsSmarterSection from "./EmergingTechnologiesThatMakeFlutterProductsSmarterSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import HowMuchDoesFlutterAppDevelopmentCostSection from "./HowMuchDoesFlutterAppDevelopmentCostSection";
import LetSLaunchYourAppAcrossEverySection from "./LetSLaunchYourAppAcrossEverySection";
import FAQsSection from "./FAQsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "78bcd53": HeroSection,
  "81f64c1": TheStudioBehindGlobalReactNativeProductSection,
  "b5ec66c": TheRealImpactOfFlutterMobileAppSection,
  "d859ac2": FlutterAppDevelopmentServicesScopedAroundYourSection,
  "1b00dd1": GetInTouchAndWeWillFigureSection,
  "c5abeda": FlutterAppDevelopmentAcrossEveryMajorIndustrySection,
  "3a22e117": CaseStudiesFromFlutterAppsDevelopedAcrossSection,
  "0267afe": WhatMakesInceptivesDigitalTheRightFlutterSection,
  "719db96": HowInceptivesDigitalTakesAFlutterAppSection,
  "56b549a": CollaborateWithOurFlutterMobileAppDevelopmentSection,
  "25db4d6": Content10Section,
  "5bee170f": TheToolsAndTechnologiesThatPowerOurSection,
  "ea314dd": EmergingTechnologiesThatMakeFlutterProductsSmarterSection,
  "73008d5f": WhatOurClientsSayAboutBuildingWithSection,
  "8175609": HowMuchDoesFlutterAppDevelopmentCostSection,
  "5467e61": LetSLaunchYourAppAcrossEverySection,
  "fb95f7b": FAQsSection
  }, false, children);
}
