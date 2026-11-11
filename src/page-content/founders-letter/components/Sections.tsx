import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import TheLetterSection from "./TheLetterSection";
import SeriousProductsNeedClearDecisionsBeforeDevelopmentSection from "./SeriousProductsNeedClearDecisionsBeforeDevelopmentSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "be509ba": HeroSection,
  "9dfeaee": TheLetterSection,
  "8d8127d": SeriousProductsNeedClearDecisionsBeforeDevelopmentSection
  }, false, children);
}
