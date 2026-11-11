import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import Content1Section from "./Content1Section";
import ThreeSituationsWhereAPrototypeIsTheSection from "./ThreeSituationsWhereAPrototypeIsTheSection";
import WhyProductsFailBeforeTheyReEvenSection from "./WhyProductsFailBeforeTheyReEvenSection";
import InteractivePrototypingServicesBuiltForEveryStageSection from "./InteractivePrototypingServicesBuiltForEveryStageSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import OURWORKACROSSINDUSTRIESSection from "./OURWORKACROSSINDUSTRIESSection";
import HowWeBuildPrototypesThatAnswerTheSection from "./HowWeBuildPrototypesThatAnswerTheSection";
import TheToolsBehindEveryPrototypeWeBuildSection from "./TheToolsBehindEveryPrototypeWeBuildSection";
import TheProductYourInvestorsSeeShouldFeelSection from "./TheProductYourInvestorsSeeShouldFeelSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "0157a12": HeroSection,
  "3f00221": Content1Section,
  "3d78549": ThreeSituationsWhereAPrototypeIsTheSection,
  "d90f821": WhyProductsFailBeforeTheyReEvenSection,
  "db8a8c9": InteractivePrototypingServicesBuiltForEveryStageSection,
  "1f419e8": YourIdeaDeservesBetterThanAverageExecutionSection,
  "2bb4bc7c": WhatOurClientsSayAboutBuildingWithSection,
  "d5f725a": OURWORKACROSSINDUSTRIESSection,
  "a73603b": HowWeBuildPrototypesThatAnswerTheSection,
  "de735e8": TheToolsBehindEveryPrototypeWeBuildSection,
  "5e48868": TheProductYourInvestorsSeeShouldFeelSection,
  "1e989ca": FAQSSection
  }, false, children);
}
