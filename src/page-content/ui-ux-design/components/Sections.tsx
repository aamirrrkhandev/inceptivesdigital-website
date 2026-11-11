import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import TrustedUIUXDesignCompanyForModernSection from "./TrustedUIUXDesignCompanyForModernSection";
import Content2Section from "./Content2Section";
import UIUXDesignServicesBuiltAroundBetterSection from "./UIUXDesignServicesBuiltAroundBetterSection";
import UIUXDesignProblemsWeHelpBusinessesSection from "./UIUXDesignProblemsWeHelpBusinessesSection";
import CustomUIUXDesignForModernDigitalSection from "./CustomUIUXDesignForModernDigitalSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import OURWORKACROSSINDUSTRIESSection from "./OURWORKACROSSINDUSTRIESSection";
import UIUXDesignProblemsWeHelpBusinessesMoreSection from "./UIUXDesignProblemsWeHelpBusinessesMoreSection";
import RecogniseOneOfTheseInYourProductSection from "./RecogniseOneOfTheseInYourProductSection";
import HowWeTurnComplexIdeasIntoIntuitiveSection from "./HowWeTurnComplexIdeasIntoIntuitiveSection";
import TheTechStackBehindEveryEveryGreatSection from "./TheTechStackBehindEveryEveryGreatSection";
import EmergingTechnologiesInfluencingModernProductDesignSection from "./EmergingTechnologiesInfluencingModernProductDesignSection";
import StopExplainingTheProductLetTheDesignSection from "./StopExplainingTheProductLetTheDesignSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "0157a12": HeroSection,
  "94ba8f2": TrustedUIUXDesignCompanyForModernSection,
  "3f00221": Content2Section,
  "db8a8c9": UIUXDesignServicesBuiltAroundBetterSection,
  "b15d7c0": UIUXDesignProblemsWeHelpBusinessesSection,
  "6fbb8d53": CustomUIUXDesignForModernDigitalSection,
  "7947182d": WhatOurClientsSayAboutBuildingWithSection,
  "7d98ed1": OURWORKACROSSINDUSTRIESSection,
  "d7f30a1": UIUXDesignProblemsWeHelpBusinessesMoreSection,
  "ec56eeb": RecogniseOneOfTheseInYourProductSection,
  "b494364": HowWeTurnComplexIdeasIntoIntuitiveSection,
  "4037388": TheTechStackBehindEveryEveryGreatSection,
  "3b96a94": EmergingTechnologiesInfluencingModernProductDesignSection,
  "5e48868": StopExplainingTheProductLetTheDesignSection,
  "1e989ca": FAQSSection
  }, false, children);
}
