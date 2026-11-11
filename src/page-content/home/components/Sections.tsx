import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import EngineeringAIPoweredDigitalSystemsForScalableSection from "./EngineeringAIPoweredDigitalSystemsForScalableSection";
import Content2Section from "./Content2Section";
import Content3Section from "./Content3Section";
import CoreCapabilitiesBehindModernDigitalProductsSection from "./CoreCapabilitiesBehindModernDigitalProductsSection";
import WeBuildWhatYourBusinessRunsOnSection from "./WeBuildWhatYourBusinessRunsOnSection";
import FromStartupsToGrowingEnterprisesSection from "./FromStartupsToGrowingEnterprisesSection";
import Content7Section from "./Content7Section";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import AwardsAndRecognitionsSection from "./AwardsAndRecognitionsSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import DigitalProductsDesignedAroundIndustryRealitiesSection from "./DigitalProductsDesignedAroundIndustryRealitiesSection";
import BeforeDevelopmentComesProductClaritySection from "./BeforeDevelopmentComesProductClaritySection";
import SeniorMindsOnYourProductEveryStageSection from "./SeniorMindsOnYourProductEveryStageSection";
import ScheduleYourStrategySessionSection from "./ScheduleYourStrategySessionSection";
import OurSuccessInNumbersSection from "./OurSuccessInNumbersSection";
import YourGoToBusinessGrowthBlogSection from "./YourGoToBusinessGrowthBlogSection";
import FrequentlyAskedQuestionsSection from "./FrequentlyAskedQuestionsSection";
import WhileOthersAreBusySellingCodeInceptivesSection from "./WhileOthersAreBusySellingCodeInceptivesSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "30e1b4df": HeroSection,
  "7530ae0c": EngineeringAIPoweredDigitalSystemsForScalableSection,
  "accfdfe": Content2Section,
  "749d78d9": Content3Section,
  "2e8ddb3e": CoreCapabilitiesBehindModernDigitalProductsSection,
  "597d6232": WeBuildWhatYourBusinessRunsOnSection,
  "fedacfa": FromStartupsToGrowingEnterprisesSection,
  "7d214e68": Content7Section,
  "59803898": YourIdeaDeservesBetterThanAverageExecutionSection,
  "a34ee8c": AwardsAndRecognitionsSection,
  "2d15886": WhatOurClientsSayAboutBuildingWithSection,
  "34840db5": DigitalProductsDesignedAroundIndustryRealitiesSection,
  "6b4cc2a8": BeforeDevelopmentComesProductClaritySection,
  "65722df4": SeniorMindsOnYourProductEveryStageSection,
  "6b826671": ScheduleYourStrategySessionSection,
  "27b4bf69": OurSuccessInNumbersSection,
  "3d8222f1": YourGoToBusinessGrowthBlogSection,
  "503b2aff": FrequentlyAskedQuestionsSection,
  "2cdbf5fa": WhileOthersAreBusySellingCodeInceptivesSection
  }, true, children);
}
