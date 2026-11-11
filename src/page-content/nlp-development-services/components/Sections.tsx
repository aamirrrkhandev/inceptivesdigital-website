import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import BusinessProblemsWeSolveWithNLPDevelopmentSection from "./BusinessProblemsWeSolveWithNLPDevelopmentSection";
import NLPDevelopmentServicesThatGoBeyondGenericSection from "./NLPDevelopmentServicesThatGoBeyondGenericSection";
import ChallengesOurNLPDevelopmentCompanyAddressesBeforeSection from "./ChallengesOurNLPDevelopmentCompanyAddressesBeforeSection";
import GenerativeAIDevelopmentServicesDesignedForYourSection from "./GenerativeAIDevelopmentServicesDesignedForYourSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import HowClientsExperiencedNLPInProductionSection from "./HowClientsExperiencedNLPInProductionSection";
import YourIndustryMayNotBeListedSection from "./YourIndustryMayNotBeListedSection";
import StepsOurNLPDevelopmentCompanyFollowsToSection from "./StepsOurNLPDevelopmentCompanyFollowsToSection";
import NLPFrameworksAndInfrastructureBehindOurDevelopmentSection from "./NLPFrameworksAndInfrastructureBehindOurDevelopmentSection";
import MostNLPSystemsUnderstandLanguageFewUnderstandSection from "./MostNLPSystemsUnderstandLanguageFewUnderstandSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "c12ac91": HeroSection,
  "2747e32": BusinessProblemsWeSolveWithNLPDevelopmentSection,
  "64c9b391": NLPDevelopmentServicesThatGoBeyondGenericSection,
  "1be199a": ChallengesOurNLPDevelopmentCompanyAddressesBeforeSection,
  "180f574": GenerativeAIDevelopmentServicesDesignedForYourSection,
  "545cc69f": YourIdeaDeservesBetterThanAverageExecutionSection,
  "508761d8": WhatOurClientsSayAboutBuildingWithSection,
  "ad90875": HowClientsExperiencedNLPInProductionSection,
  "cbae197": YourIndustryMayNotBeListedSection,
  "e7b5cda": StepsOurNLPDevelopmentCompanyFollowsToSection,
  "8396108": NLPFrameworksAndInfrastructureBehindOurDevelopmentSection,
  "50715151": MostNLPSystemsUnderstandLanguageFewUnderstandSection,
  "3a0240b7": FAQSSection
  }, false, children);
}
