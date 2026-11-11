import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import ChosenByBusinessesWhoCanTAffordSection from "./ChosenByBusinessesWhoCanTAffordSection";
import AStrongLaunchStrategyIsNowASection from "./AStrongLaunchStrategyIsNowASection";
import InceptivesDigitalServicesBuiltAroundSuccessfulProductSection from "./InceptivesDigitalServicesBuiltAroundSuccessfulProductSection";
import SoftLaunchVsFullLaunchVsPhasedSection from "./SoftLaunchVsFullLaunchVsPhasedSection";
import YourProductDeservesALaunchThatMatchesSection from "./YourProductDeservesALaunchThatMatchesSection";
import HelpingBusinessesLaunchSuccessfullyThroughoutEveryMajorSection from "./HelpingBusinessesLaunchSuccessfullyThroughoutEveryMajorSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import TheReasonsHighPerformingTeamsLaunchWithSection from "./TheReasonsHighPerformingTeamsLaunchWithSection";
import TakeTheFirstStepTowardASuccessfulSection from "./TakeTheFirstStepTowardASuccessfulSection";
import Content10Section from "./Content10Section";
import TheLaunchStackThatTurnsStrategyIntoSection from "./TheLaunchStackThatTurnsStrategyIntoSection";
import OurLaunchProcessThatTakesYourProductSection from "./OurLaunchProcessThatTakesYourProductSection";
import LeveragingModernTechnologyForAStrongerProductSection from "./LeveragingModernTechnologyForAStrongerProductSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import WhatAProductLaunchStrategyEngagementCostsSection from "./WhatAProductLaunchStrategyEngagementCostsSection";
import ConsultUsAndGetAnEndToSection from "./ConsultUsAndGetAnEndToSection";
import FAQsSection from "./FAQsSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "78bcd53": HeroSection,
  "2540603": ChosenByBusinessesWhoCanTAffordSection,
  "d398c95": AStrongLaunchStrategyIsNowASection,
  "d859ac2": InceptivesDigitalServicesBuiltAroundSuccessfulProductSection,
  "2310f573": SoftLaunchVsFullLaunchVsPhasedSection,
  "1b00dd1": YourProductDeservesALaunchThatMatchesSection,
  "c5abeda": HelpingBusinessesLaunchSuccessfullyThroughoutEveryMajorSection,
  "94decd0": YourIdeaDeservesBetterThanAverageExecutionSection,
  "0267afe": TheReasonsHighPerformingTeamsLaunchWithSection,
  "5a1708e": TakeTheFirstStepTowardASuccessfulSection,
  "25db4d6": Content10Section,
  "cfb0269": TheLaunchStackThatTurnsStrategyIntoSection,
  "5e10a97": OurLaunchProcessThatTakesYourProductSection,
  "ea314dd": LeveragingModernTechnologyForAStrongerProductSection,
  "5d35ac24": WhatOurClientsSayAboutBuildingWithSection,
  "8175609": WhatAProductLaunchStrategyEngagementCostsSection,
  "5467e61": ConsultUsAndGetAnEndToSection,
  "fb95f7b": FAQsSection
  }, false, children);
}
