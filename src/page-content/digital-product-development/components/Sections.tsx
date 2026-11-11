import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import Content1Section from "./Content1Section";
import WhyGoForDigitalProductDevelopmentSection from "./WhyGoForDigitalProductDevelopmentSection";
import ServicesProvidedByInceptivesDigitalForDigitalSection from "./ServicesProvidedByInceptivesDigitalForDigitalSection";
import UIUXDesignSection from "./UIUXDesignSection";
import WhyFoundersChooseOurStudioForTheirSection from "./WhyFoundersChooseOurStudioForTheirSection";
import YourIdeaDeservesBetterThanAverageExecutionSection from "./YourIdeaDeservesBetterThanAverageExecutionSection";
import Content7Section from "./Content7Section";
import ABetterProductStartsWithAnExceptionalSection from "./ABetterProductStartsWithAnExceptionalSection";
import SectorsWeHaveBuiltExperienceThroughProductSection from "./SectorsWeHaveBuiltExperienceThroughProductSection";
import TechnologyStackBuiltForProductPerformanceSection from "./TechnologyStackBuiltForProductPerformanceSection";
import TheDigitalProductDevelopmentProcessBehindEverySection from "./TheDigitalProductDevelopmentProcessBehindEverySection";
import DevelopTheNextGenDigitalProductWithSection from "./DevelopTheNextGenDigitalProductWithSection";
import FAQSSection from "./FAQSSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "0157a12": HeroSection,
  "3f00221": Content1Section,
  "d90f821": WhyGoForDigitalProductDevelopmentSection,
  "db8a8c9": ServicesProvidedByInceptivesDigitalForDigitalSection,
  "b15d7c0": UIUXDesignSection,
  "d7f30a1": WhyFoundersChooseOurStudioForTheirSection,
  "2dd49f2": YourIdeaDeservesBetterThanAverageExecutionSection,
  "347d492d": Content7Section,
  "2f36a10": ABetterProductStartsWithAnExceptionalSection,
  "cbbeab5": SectorsWeHaveBuiltExperienceThroughProductSection,
  "4a25380": TechnologyStackBuiltForProductPerformanceSection,
  "b494364": TheDigitalProductDevelopmentProcessBehindEverySection,
  "5e48868": DevelopTheNextGenDigitalProductWithSection,
  "1e989ca": FAQSSection
  }, false, children);
}
