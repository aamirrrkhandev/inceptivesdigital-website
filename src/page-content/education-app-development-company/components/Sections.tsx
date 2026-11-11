import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import Content1Section from "./Content1Section";
import EducationAppDevelopmentCapabilitiesThatGoBeyondSection from "./EducationAppDevelopmentCapabilitiesThatGoBeyondSection";
import SmartEducationalAppDevelopmentServicesForAdaptiveSection from "./SmartEducationalAppDevelopmentServicesForAdaptiveSection";
import EducationAppDevelopmentCompanyTrustedByLeadingSection from "./EducationAppDevelopmentCompanyTrustedByLeadingSection";
import ReadyToInnovateInEdTechSection from "./ReadyToInnovateInEdTechSection";
import EducationAppDevelopmentChallengesWeSolveBeforeSection from "./EducationAppDevelopmentChallengesWeSolveBeforeSection";
import SectorsOurHealthcareAppDevelopmentCompanyBuildsSection from "./SectorsOurHealthcareAppDevelopmentCompanyBuildsSection";
import KeyFeaturesBuiltIntoOurEducationalAppSection from "./KeyFeaturesBuiltIntoOurEducationalAppSection";
import ProductsWeVeDeliveredAsAnEducationSection from "./ProductsWeVeDeliveredAsAnEducationSection";
import LaunchYourNextEducationalAppProjectWithSection from "./LaunchYourNextEducationalAppProjectWithSection";
import HowWeApproachEducationalAppDevelopmentFromSection from "./HowWeApproachEducationalAppDevelopmentFromSection";
import BuildingEducationAppDevelopmentServicesOnProvenSection from "./BuildingEducationAppDevelopmentServicesOnProvenSection";
import AdvancedTechnologiesPoweringOurEducationalAppDevelopmentSection from "./AdvancedTechnologiesPoweringOurEducationalAppDevelopmentSection";
import EducationAppDevelopmentCostEstimatesSection from "./EducationAppDevelopmentCostEstimatesSection";
import ReadyToImpactThousandsOfLearnersEverySection from "./ReadyToImpactThousandsOfLearnersEverySection";
import AwardsAndRecognitionsSection from "./AwardsAndRecognitionsSection";
import QuestionsAboutEducationAppDevelopmentWorthAskingSection from "./QuestionsAboutEducationAppDevelopmentWorthAskingSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "f54447c": HeroSection,
  "2566f2e4": Content1Section,
  "6e7d54b3": EducationAppDevelopmentCapabilitiesThatGoBeyondSection,
  "c0ded42": SmartEducationalAppDevelopmentServicesForAdaptiveSection,
  "7d79da5d": EducationAppDevelopmentCompanyTrustedByLeadingSection,
  "3b7b02ec": ReadyToInnovateInEdTechSection,
  "3185ba38": EducationAppDevelopmentChallengesWeSolveBeforeSection,
  "295cbb0e": SectorsOurHealthcareAppDevelopmentCompanyBuildsSection,
  "16a2682": KeyFeaturesBuiltIntoOurEducationalAppSection,
  "1443529e": ProductsWeVeDeliveredAsAnEducationSection,
  "59ca83f7": LaunchYourNextEducationalAppProjectWithSection,
  "2ffd3fcb": HowWeApproachEducationalAppDevelopmentFromSection,
  "1025cd6a": BuildingEducationAppDevelopmentServicesOnProvenSection,
  "3901a931": AdvancedTechnologiesPoweringOurEducationalAppDevelopmentSection,
  "62dda268": EducationAppDevelopmentCostEstimatesSection,
  "477c6db4": ReadyToImpactThousandsOfLearnersEverySection,
  "509b0889": AwardsAndRecognitionsSection,
  "3328f000": QuestionsAboutEducationAppDevelopmentWorthAskingSection
  }, false, children);
}
