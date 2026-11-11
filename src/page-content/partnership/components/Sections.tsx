import type { ReactNode } from "react";
import { renderEditableSections } from "@/components/shared/EditableSections";
import type { SitePage } from "@/lib/site-model";
import HeroSection from "./HeroSection";
import ExecutionOverPromisesSection from "./ExecutionOverPromisesSection";
import WhyCollaborateSection from "./WhyCollaborateSection";
import WaitingToStartAPartnershipWithYouSection from "./WaitingToStartAPartnershipWithYouSection";

export default function Sections({ page, children }: { page: SitePage; children?: ReactNode }) {
  return renderEditableSections(page, {
  "be509ba": HeroSection,
  "9dfeaee": ExecutionOverPromisesSection,
  "20f851a": WhyCollaborateSection,
  "615e823": WaitingToStartAPartnershipWithYouSection
  }, false, children);
}
