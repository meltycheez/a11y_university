import { useScenario } from "~/a11y/useScenario";
import { Accordion } from "~/components/Accordion";
import { Hero } from "~/components/Hero";
import { ContactCard } from "~/components/blocks";
import { Copy, copyFor } from "../about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/giving/scholarships");
const [main] = content.sections;
const PHRASE = "in perpetuity";

const steps = [
  { title: "1. Talk with a gift officer", content: <p>A gift officer in the Office of Advancement will help you choose between an endowed and a current-use scholarship and explain the funding levels.</p> },
  { title: "2. Choose a name and criteria", content: <p>Most donors name a scholarship for themselves, a family member, or a mentor, and choose criteria such as a major, a hometown, or first-generation status. Criteria must follow state and federal nondiscrimination law.</p> },
  { title: "3. Sign a gift agreement", content: <p>The RSU Foundation prepares a short agreement that records the name, the criteria, and the pledge schedule. Pledges may be paid over up to five years.</p> },
  { title: "4. Meet your scholars", content: <p>Scholarship donors are invited to the annual Scholarship Luncheon each spring to meet the students they support.</p> },
];

export default function ScholarshipsPage() {
  const underlineFixed = useScenario("giving-scholarships-underline-001");
  const idsFixed = useScenario("giving-scholarships-duplicate-id-001");
  // CSS scenarios (foundation.css).
  useScenario("giving-scholarships-table-reflow-001");
  useScenario("giving-scholarships-updated-contrast-001");
  const [before, after] = main.paragraphs![0].split(PHRASE);
  const t = main.table!;
  const levelsId = "scholarship-levels";
  const stepsId = idsFixed ? "scholarship-steps" : levelsId;

  return (
    <>
      <Hero title="Endowed Scholarships" kicker="Redwood State Foundation" lede={content.summary} image="giving-hero-scholars" />
      <div className="page-content">
        <p className="lede-paragraph" data-a11y-scenario="giving-scholarships-underline-001">
          {before}
          {underlineFixed ? <em>{PHRASE}</em> : <span className="text-underline">{PHRASE}</span>}
          {after}
        </p>

        <section className="stack" aria-labelledby={levelsId} data-a11y-scenario="giving-scholarships-duplicate-id-001">
          <h2 id={levelsId}>Funding levels</h2>
          <div className="table-wrap scholarship-table" data-a11y-scenario="giving-scholarships-table-reflow-001">
            <table className="data-table">
              <caption>{t.caption}</caption>
              <thead><tr>{t.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
              <tbody>
                {t.rows.map((r) => <tr key={r[0]}><th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td></tr>)}
              </tbody>
            </table>
          </div>
        </section>

        <section className="stack" aria-labelledby={stepsId} data-a11y-scenario="giving-scholarships-duplicate-id-001">
          <h2 id={stepsId}>How to establish a scholarship</h2>
          <Accordion items={steps} />
        </section>

        <Copy
          section={{ heading: "Learn more", links: main.links }}
          links={{ "Click here to learn more": { scenario: "giving-scholarships-clickhere-001", text: "Other ways to give to Redwood State" } }}
        />

        <ContactCard
          title="Scholarship gifts"
          lines={[
            { label: "Office", value: "Office of Advancement, Founders Hall 320" },
            { label: "Phone", value: "(707) 555-0190", href: "tel:7075550190" },
            { label: "Email", value: "giving@redwoodstate.example.edu", href: "mailto:giving@redwoodstate.example.edu" },
          ]}
        />
        <p className="page-updated giving-updated" data-a11y-scenario="giving-scholarships-updated-contrast-001">{content.updated}</p>
      </div>
    </>
  );
}
