import { renderNode } from "@/components/shared/SourceNode";
import type { LayoutNode } from "@/lib/site-model";
import { getCaseStudyShowcase } from "@/lib/case-study-showcase";
import CaseStudySliderComponent from "@/components/casestudy-slider-component";

function correctedSlide(node: LayoutNode): LayoutNode {
  const source = JSON.stringify(node);
  const replacements = source.includes('/portfolio/my-tango-event')
    ? [['A real-time workforce management platform that cut manual paperwork by 90%, streamlining operations and improving accuracy.', 'Building the Infrastructure Behind a Global Dance Community']]
    : source.includes('/portfolio/stakbread')
      ? [['Real-Time Workforce Operations Platform', 'Social Commerce Platform']]
      : source.includes('/portfolio/pets-b4-profit')
        ? [['Automated Experience Capture and Delivery', 'AI-Powered Veterinary Cost Transparency Platform']]
        : [];
  if (!replacements.length) return node;
  const visit = (child: LayoutNode): LayoutNode => typeof child === 'string'
    ? replacements.reduce((value, [before, after]) => value.replaceAll(before, after), child)
    : {...child, props: {...child.props}, children: child.children.map(visit)};
  return visit(node);
}

function MobileShowcase({id}: {id: string}) {
  const source = getCaseStudyShowcase();
  return <div className="shared-case-study-showcase migrated migrated-21112" data-original-case-widget={id}>
    <style>{source.css}</style>
    <CaseStudySliderComponent wrapperProps={source.widget.props}
      slides={source.slides.map((slide, index) => renderNode(correctedSlide(slide), index))}
      previousIcon={source.previousIcon.map((child, index) => renderNode(child, index))}
      nextIcon={source.nextIcon.map((child, index) => renderNode(child, index))} />
  </div>;
}

export default function YourIdeaDeservesBetterThanAverageExecutionSection({ node, index }: { node: LayoutNode; index: number }) {
  return renderNode(node, index, undefined, false, false, (candidate, key) =>
    String(candidate.props.className || '').split(/\s+/).includes('casestudy-slider')
      ? <MobileShowcase key={key} id={String(candidate.props['data-id'] || '')} />
      : undefined);
}
