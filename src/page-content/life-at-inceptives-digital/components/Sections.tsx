import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import CulturePrinciplesSection from "./CulturePrinciplesSection";
import GrowthBeginsBeforeTheNextTitleSection from "./GrowthBeginsBeforeTheNextTitleSection";
import FocusWithoutPressureSection from "./FocusWithoutPressureSection";
import SharedWorkSharedResponsibilitySection from "./SharedWorkSharedResponsibilitySection";
import ItSAllAboutPeopleSection from "./ItSAllAboutPeopleSection";
import ResponsibilityCreatesRoomToGrowSection from "./ResponsibilityCreatesRoomToGrowSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "094de00": HeroSection,
  "cf21c20": CulturePrinciplesSection,
  "9a29793": GrowthBeginsBeforeTheNextTitleSection,
  "e8de5c1": FocusWithoutPressureSection,
  "6474439": SharedWorkSharedResponsibilitySection,
  "7a662df": ItSAllAboutPeopleSection,
  "07bab0d": ResponsibilityCreatesRoomToGrowSection
  }, false, children);
}
