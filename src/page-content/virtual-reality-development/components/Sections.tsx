import type { ReactNode } from "react";
import SecondaryServicePage from "@/components/SecondaryServicePage";
import type { SitePage } from "@/lib/site-model";

export default function Sections({page, children}: {page: SitePage; children?: ReactNode}) {
  return <SecondaryServicePage path="/virtual-reality-development" editablePage={page} sections={page.editableSections} stylesheet={page.secondaryStyles}>{children}</SecondaryServicePage>;
}
