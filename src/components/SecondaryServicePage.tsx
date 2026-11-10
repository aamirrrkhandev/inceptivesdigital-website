import SourceLayout, { renderNode } from "./SourceLayout";
import SecondaryServiceInteractions from "./SecondaryServiceInteractions";
import SecondaryTeamAssessment from "./SecondaryTeamAssessment";
import { getPage, type LayoutNode, type SitePage } from "@/lib/site-model";
import pages from "../../content/secondary-pages.json";
import css from "../../content/secondary-styles.json";

export const secondaryPages = pages as unknown as Record<
  string,
  { sourceUrl: string; meta: SitePage["meta"]; sections: LayoutNode[] }
>;
function section(node: LayoutNode, key: number): React.ReactNode {
  return renderNode(node, key, undefined, false, false, (child, index) =>
    child.props["data-secondary-team"] ? (
      <SecondaryTeamAssessment key={index} />
    ) : undefined,
  );
}
export default function SecondaryServicePage({ path }: { path: string }) {
  const data = secondaryPages[path];
  const shell = getPage("/contact-us")!;
  const page = {
    ...shell,
    path,
    key: "restored-" + path.slice(1),
    meta: data.meta,
  };
  // Global forms keep the current WordPress contract even though these older pages are absent there.
  return (
    <SourceLayout
      page={page}
      formSourcePath="/contact-us"
      mainContent={
        <main className="secondary-service-page" data-secondary-path={path}>
          <style>{css}</style>
          {data.sections.map(section)}
          <SecondaryServiceInteractions path={path} />
        </main>
      }
    />
  );
}
