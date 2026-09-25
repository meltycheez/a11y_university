import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { ContactCard, RelatedLinks } from "~/components/blocks";
import { Copy, copyFor } from "./about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/accessibility");
const [commitment, report, accommodations] = content.sections;

// Deliberately light page (ironic but realistic): one page-level defect.
export default function AccessibilityPage() {
  useScenario("utility-accessibility-updated-small-001"); // CSS scenario (flagship.css)
  return (
    <>
      <Hero title="Accessibility at Redwood State" kicker="Web accessibility statement" lede={content.summary} variant="banner" />
      <div className="page-content longform">
        <Copy section={commitment} />
        <section className="stack" aria-labelledby="report-heading">
          <h2 id="report-heading">{report.heading}</h2>
          {report.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
          <ContactCard
            title="Web Accessibility Coordinator"
            lines={[
              { label: "Email", value: "accessibility@redwoodstate.example.edu", href: "mailto:accessibility@redwoodstate.example.edu" },
              { label: "Phone", value: "(707) 555-0108", href: "tel:7075550108" },
            ]}
          />
        </section>
        <Callout title={accommodations.heading}>
          {accommodations.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
        </Callout>
        <RelatedLinks
          title="Related"
          links={[
            { label: "Privacy Statement", href: "/policies/privacy" },
            { label: "Campus Map", href: "/campus-map" },
            { label: "Site Map", href: "/sitemap" },
          ]}
        />
        <p className="page-updated accessibility-updated" data-a11y-scenario="utility-accessibility-updated-small-001">{content.updated}</p>
      </div>
    </>
  );
}
