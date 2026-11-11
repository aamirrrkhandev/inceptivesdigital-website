import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import ProjectSnapshotSection from "./ProjectSnapshotSection";
import TheBusinessContextSection from "./TheBusinessContextSection";
import TheOperationalProblemSection from "./TheOperationalProblemSection";
import ProductDecisionsThatShapedTheBuildSection from "./ProductDecisionsThatShapedTheBuildSection";
import PlatformArchitectureSection from "./PlatformArchitectureSection";
import PlatformAdministrationDashboardSection from "./PlatformAdministrationDashboardSection";
import EngineeringExcellenceBehindOurMobileAppDevelopmentServicesSection from "./EngineeringExcellenceBehindOurMobileAppDevelopmentServicesSection";
import OutcomesSection from "./OutcomesSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c3bca1a": HeroSection,
  "3355680": ProjectSnapshotSection,
  "d049048": TheBusinessContextSection,
  "3ea39cf": TheOperationalProblemSection,
  "0d7786d": ProductDecisionsThatShapedTheBuildSection,
  "6cafb81": PlatformArchitectureSection,
  "ca91c07": PlatformAdministrationDashboardSection,
  "7c6d5c62": EngineeringExcellenceBehindOurMobileAppDevelopmentServicesSection,
  "6a3ecc4": OutcomesSection
  }, false, children);
}
