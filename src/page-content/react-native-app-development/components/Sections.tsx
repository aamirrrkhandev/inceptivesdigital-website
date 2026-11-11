import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import TheStudioBehindGlobalReactNativeProductSection from "./TheStudioBehindGlobalReactNativeProductSection";
import WhatMakesReactNativeTheBestBuildSection from "./WhatMakesReactNativeTheBestBuildSection";
import ReactNativeVsFlutterWhichFrameworkFitsSection from "./ReactNativeVsFlutterWhichFrameworkFitsSection";
import AllInclusiveReactNativeAppDevelopmentServicesSection from "./AllInclusiveReactNativeAppDevelopmentServicesSection";
import StopBuildingTwiceStartBuildingSmarterSection from "./StopBuildingTwiceStartBuildingSmarterSection";
import IndustrySpecificReactNativeAppDevelopmentSection from "./IndustrySpecificReactNativeAppDevelopmentSection";
import CaseStudiesProvenByRealReactNativeSection from "./CaseStudiesProvenByRealReactNativeSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import InsideAReactNativeMobileAppDevelopmentSection from "./InsideAReactNativeMobileAppDevelopmentSection";
import CollaborateWithOurExpertReactNativeEngineersSection from "./CollaborateWithOurExpertReactNativeEngineersSection";
import Content11Section from "./Content11Section";
import ToolsSelectedForReactNativeRefinedAcrossSection from "./ToolsSelectedForReactNativeRefinedAcrossSection";
import TheReactNativeAppDevelopmentProcessInStagesSection from "./TheReactNativeAppDevelopmentProcessInStagesSection";
import FutureReadyReactNativeProductsThroughEmergingSection from "./FutureReadyReactNativeProductsThroughEmergingSection";
import HowMuchDoesReactNativeAppDevelopmentSection from "./HowMuchDoesReactNativeAppDevelopmentSection";
import FindOutWhatYourReactNativeAppSection from "./FindOutWhatYourReactNativeAppSection";
import FAQsSection from "./FAQsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "78bcd53": HeroSection,
  "e432363": TheStudioBehindGlobalReactNativeProductSection,
  "56b4c6c": WhatMakesReactNativeTheBestBuildSection,
  "3c98edc": ReactNativeVsFlutterWhichFrameworkFitsSection,
  "d859ac2": AllInclusiveReactNativeAppDevelopmentServicesSection,
  "a852b59": StopBuildingTwiceStartBuildingSmarterSection,
  "582dd21": IndustrySpecificReactNativeAppDevelopmentSection,
  "7e06970a": CaseStudiesProvenByRealReactNativeSection,
  "73008d5f": WhatOurClientsSayAboutBuildingWithSection,
  "0267afe": InsideAReactNativeMobileAppDevelopmentSection,
  "c92d031": CollaborateWithOurExpertReactNativeEngineersSection,
  "25db4d6": Content11Section,
  "700df55c": ToolsSelectedForReactNativeRefinedAcrossSection,
  "5e10a97": TheReactNativeAppDevelopmentProcessInStagesSection,
  "ea314dd": FutureReadyReactNativeProductsThroughEmergingSection,
  "8175609": HowMuchDoesReactNativeAppDevelopmentSection,
  "4e50af8": FindOutWhatYourReactNativeAppSection,
  "fb95f7b": FAQsSection
  }, false, children);
}
