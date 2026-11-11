import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import TrustedByBusinessesBuildingTheirNextWebSection from "./TrustedByBusinessesBuildingTheirNextWebSection";
import OurCustomWebApplicationsEngineeredAroundRealSection from "./OurCustomWebApplicationsEngineeredAroundRealSection";
import CustomWebApplicationDevelopmentBuiltAroundTheSection from "./CustomWebApplicationDevelopmentBuiltAroundTheSection";
import CustomWebAppDevelopmentServicesForEverySection from "./CustomWebAppDevelopmentServicesForEverySection";
import Content5Section from "./Content5Section";
import ShippingWebProductsAcross20IndustriesSection from "./ShippingWebProductsAcross20IndustriesSection";
import ExploreOurPortfolioAsATopWebSection from "./ExploreOurPortfolioAsATopWebSection";
import ReadyToBuildTheWebApplicationYourSection from "./ReadyToBuildTheWebApplicationYourSection";
import WebApplicationDevelopmentProcessFromDiscoveryToSection from "./WebApplicationDevelopmentProcessFromDiscoveryToSection";
import TechStackWeUseForModernWebSection from "./TechStackWeUseForModernWebSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import FutureForwardWebAppDevelopmentServicesWovenSection from "./FutureForwardWebAppDevelopmentServicesWovenSection";
import BackedByTheTechnologyPartnersThatKeepSection from "./BackedByTheTechnologyPartnersThatKeepSection";
import WebAppsVsNativeAppsChoosingTheSection from "./WebAppsVsNativeAppsChoosingTheSection";
import ShareYourIdeaWithTheTeamTodaySection from "./ShareYourIdeaWithTheTeamTodaySection";
import RecognizedAsAWebAppDevelopmentCompanySection from "./RecognizedAsAWebAppDevelopmentCompanySection";
import WebAppDevelopmentCompanySection from "./WebAppDevelopmentCompanySection";
import WhyBusinessesChooseInceptivesForWebAppSection from "./WhyBusinessesChooseInceptivesForWebAppSection";
import SecurityIsnTAFeatureAtInceptivesSection from "./SecurityIsnTAFeatureAtInceptivesSection";
import HowMuchDoesWebApplicationDevelopmentCostSection from "./HowMuchDoesWebApplicationDevelopmentCostSection";
import LetSBuildAWebAppThatSection from "./LetSBuildAWebAppThatSection";
import FAQsAboutWebAppDevelopmentServicesSection from "./FAQsAboutWebAppDevelopmentServicesSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "78bcd53": HeroSection,
  "05c959a": TrustedByBusinessesBuildingTheirNextWebSection,
  "0d297eb": OurCustomWebApplicationsEngineeredAroundRealSection,
  "cb22207": CustomWebApplicationDevelopmentBuiltAroundTheSection,
  "d859ac2": CustomWebAppDevelopmentServicesForEverySection,
  "ad43c87": Content5Section,
  "4f6ffc45": ShippingWebProductsAcross20IndustriesSection,
  "42e8b194": ExploreOurPortfolioAsATopWebSection,
  "1ffd0582": ReadyToBuildTheWebApplicationYourSection,
  "5e10a97": WebApplicationDevelopmentProcessFromDiscoveryToSection,
  "71f58fbf": TechStackWeUseForModernWebSection,
  "73008d5f": WhatOurClientsSayAboutBuildingWithSection,
  "ea314dd": FutureForwardWebAppDevelopmentServicesWovenSection,
  "0ec2329": BackedByTheTechnologyPartnersThatKeepSection,
  "705f5c84": WebAppsVsNativeAppsChoosingTheSection,
  "6a1c0a0": ShareYourIdeaWithTheTeamTodaySection,
  "87c6128": RecognizedAsAWebAppDevelopmentCompanySection,
  "6bb95457": WebAppDevelopmentCompanySection,
  "0267afe": WhyBusinessesChooseInceptivesForWebAppSection,
  "a914b14": SecurityIsnTAFeatureAtInceptivesSection,
  "8175609": HowMuchDoesWebApplicationDevelopmentCostSection,
  "5467e61": LetSBuildAWebAppThatSection,
  "fb95f7b": FAQsAboutWebAppDevelopmentServicesSection
  }, false, children);
}
