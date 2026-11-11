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
function section(node: LayoutNode, key: number, path: string): React.ReactNode {
  return renderNode(node, key, undefined, false, false, (child, index) => {
    if (child.props["data-secondary-team"])
      return <SecondaryTeamAssessment key={index} />;
    if (child.tag === "form")
      return renderNode(
        {
          ...child,
          props: {
            ...child.props,
            id: "website-" + path.slice(1) + "-enquiry",
          },
        },
        index,
      );
    return undefined;
  });
}
export default function SecondaryServicePage({ path, editablePage, sections, stylesheet, children }: { path: string; editablePage?: SitePage; sections?: LayoutNode[]; stylesheet?: string; children?: React.ReactNode }) {
  const data = secondaryPages[path];
  const shell = getPage("/contact-us")!;
  const page = editablePage ?? {
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
          <style>{stylesheet ?? css}</style>
          {(sections ?? data.sections).map((node, index) => section(node, index, path))}
          {children}
          <SecondaryServiceInteractions path={path} />
        </main>
      }
    />
  );
}
