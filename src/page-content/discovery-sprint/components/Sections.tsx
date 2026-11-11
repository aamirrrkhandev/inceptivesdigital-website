import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import Content1Section from "./Content1Section";
import WhyProductsFailBeforeTheyReEvenSection from "./WhyProductsFailBeforeTheyReEvenSection";
import IsThisProductDiscoverySprintForYouSection from "./IsThisProductDiscoverySprintForYouSection";
import TheRealBusinessImpactOfADiscoverySection from "./TheRealBusinessImpactOfADiscoverySection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import WhatOurClientsSayAboutBuildingWithSection from "./WhatOurClientsSayAboutBuildingWithSection";
import OURWORKACROSSINDUSTRIESSection from "./OURWORKACROSSINDUSTRIESSection";
import WhatActuallyHappensDuringAProductDiscoverySection from "./WhatActuallyHappensDuringAProductDiscoverySection";
import DiscoverySprintDeliverablesAndWhyEachOneSection from "./DiscoverySprintDeliverablesAndWhyEachOneSection";
import NotSureWhereToStartOneConversationSection from "./NotSureWhereToStartOneConversationSection";
import TheTechStackBehindEveryDiscoverySprintSection from "./TheTechStackBehindEveryDiscoverySprintSection";
import TheDiscoverySprintFrameworkThreeWeeksOneSection from "./TheDiscoverySprintFrameworkThreeWeeksOneSection";
import WhyChooseInceptivesDigitalForYourDiscoverySection from "./WhyChooseInceptivesDigitalForYourDiscoverySection";
import HowMuchDoesAProductStrategyEngagementSection from "./HowMuchDoesAProductStrategyEngagementSection";
import DifferenceBetweenDiscoverySprintAndMVPDevelopmentSection from "./DifferenceBetweenDiscoverySprintAndMVPDevelopmentSection";
import EveryGreatDigitalProductStartsWithBetterSection from "./EveryGreatDigitalProductStartsWithBetterSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "0157a12": HeroSection,
  "3f00221": Content1Section,
  "d90f821": WhyProductsFailBeforeTheyReEvenSection,
  "db8a8c9": IsThisProductDiscoverySprintForYouSection,
  "0215fdb": TheRealBusinessImpactOfADiscoverySection,
  "2dd49f2": YourIdeaDeservesBetterThanAverageExecutionSection,
  "311ba817": WhatOurClientsSayAboutBuildingWithSection,
  "cbbeab5": OURWORKACROSSINDUSTRIESSection,
  "b494364": WhatActuallyHappensDuringAProductDiscoverySection,
  "411b87cd": DiscoverySprintDeliverablesAndWhyEachOneSection,
  "5e48868": NotSureWhereToStartOneConversationSection,
  "7144e30f": TheTechStackBehindEveryDiscoverySprintSection,
  "0dd8594": TheDiscoverySprintFrameworkThreeWeeksOneSection,
  "2193a6f": WhyChooseInceptivesDigitalForYourDiscoverySection,
  "2b331cd": HowMuchDoesAProductStrategyEngagementSection,
  "7729e554": DifferenceBetweenDiscoverySprintAndMVPDevelopmentSection,
  "36b7312": EveryGreatDigitalProductStartsWithBetterSection,
  "1e989ca": FAQSSection
  }, false, children);
}
