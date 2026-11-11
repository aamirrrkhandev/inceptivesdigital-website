import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import AIDevelopmentServicesBuiltToPerformUnderSection from "./AIDevelopmentServicesBuiltToPerformUnderSection";
import HowWeDeliverCustomAIDevelopmentServicesSection from "./HowWeDeliverCustomAIDevelopmentServicesSection";
import AIDevelopmentServicesForStartupsSMBsAndSection from "./AIDevelopmentServicesForStartupsSMBsAndSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import TheAIDevelopmentCompanyBusinessesTrustAcrossSection from "./TheAIDevelopmentCompanyBusinessesTrustAcrossSection";
import DonTSeeYourIndustrySection from "./DonTSeeYourIndustrySection";
import AIDevelopmentServicesPoweredByIndustryLeadingSection from "./AIDevelopmentServicesPoweredByIndustryLeadingSection";
import WhatPowersOurAIDevelopmentServicesUnderSection from "./WhatPowersOurAIDevelopmentServicesUnderSection";
import HowOurAIDevelopmentCompanyProtectsYourSection from "./HowOurAIDevelopmentCompanyProtectsYourSection";
import EngagementsOurAIDevelopmentCompanyOffersAtSection from "./EngagementsOurAIDevelopmentCompanyOffersAtSection";
import DonTSeeYourIndustryMoreSection from "./DonTSeeYourIndustryMoreSection";
import FAQsAboutAIDevelopmentServicesSection from "./FAQsAboutAIDevelopmentServicesSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c12ac91": HeroSection,
  "64c9b391": AIDevelopmentServicesBuiltToPerformUnderSection,
  "6715bf1f": HowWeDeliverCustomAIDevelopmentServicesSection,
  "7a6b3af": AIDevelopmentServicesForStartupsSMBsAndSection,
  "2b62ca32": YourIdeaDeservesBetterThanAverageExecutionSection,
  "3d30037c": WhatOurClientsSayAboutBuildingWithSection,
  "614899b1": TheAIDevelopmentCompanyBusinessesTrustAcrossSection,
  "36473b81": DonTSeeYourIndustrySection,
  "22a6536": AIDevelopmentServicesPoweredByIndustryLeadingSection,
  "32eef194": WhatPowersOurAIDevelopmentServicesUnderSection,
  "6c463188": HowOurAIDevelopmentCompanyProtectsYourSection,
  "a9db68a": EngagementsOurAIDevelopmentCompanyOffersAtSection,
  "50715151": DonTSeeYourIndustryMoreSection,
  "3a0240b7": FAQsAboutAIDevelopmentServicesSection
  }, false, children);
}
