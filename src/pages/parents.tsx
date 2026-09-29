import { SmartLink } from "~/a11y/helpers";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { ContactCard, RelatedLinks } from "~/components/blocks";
import { copyFor } from "./about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/parents");
const [main] = content.sections;
const [ferpa, ...related] = main.links!;

const longAlt =
  "Photo from move-in weekend: a parent hugs their college student goodbye on the walkway outside a residence hall at Redwood State University. The residence hall entrance, its windows and the trees and lawn around the building are visible behind them, on what looks like a bright late-summer day in Arcadia Falls at the start of the fall semester.";

export default function ParentsPage() {
  return (
    <>
      <Hero
        title="Parents & Families"
        kicker="Redwood State University"
        lede={content.summary}
        image="parents-hero-family"
        imageAlt={longAlt}
        imageScenario="audience-parents-hero-alt-long-001"
      />
      <div className="page-content">
        <section className="stack" aria-labelledby="family-heading">
          <h2 id="family-heading">Partners in student success</h2>
          <p>{main.paragraphs![0]}</p>
        </section>

        <Callout title="Privacy of student records (FERPA)">
          <p>{main.paragraphs![1]}</p>
          <p>
            <SmartLink scenario="audience-parents-ferpa-doc-001" to={ferpa.href} fileInfo="PDF, 2 KB">
              {ferpa.label.replace(/\s*\(PDF\)$/, "")}
            </SmartLink>
          </p>
        </Callout>

        <ContactCard
          title="Contact Family Programs"
          lines={[
            { label: "Phone", value: "(707) 555-0145", href: "tel:7075550145" },
            { label: "Email", value: "families@redwoodstate.edu", href: "mailto:families@redwoodstate.edu" },
          ]}
        />

        <RelatedLinks title="Resources for families" links={related} />
      </div>
    </>
  );
}
