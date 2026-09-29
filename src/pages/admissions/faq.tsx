import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Accordion } from "~/components/Accordion";
import { Hero } from "~/components/Hero";
import { CtaBand } from "~/components/blocks";
import { content } from "./_content";

export { inventoryMeta as meta } from "~/routes/meta";

// Indexes into the FAQ sections (same order as src/data/content/pages-admissions.ts).
const GROUPS: [string, number[]][] = [
  ["Applying and admission", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
  ["Transfer and international students", [13, 14, 15]],
  ["Costs and financial aid", [17, 18, 19, 20]],
  ["Academics", [21, 22, 23]],
  ["Housing, visits and contact", [11, 12, 16, 24]],
];

export default function AdmissionsFaq() {
  const c = content("/admissions/faq")!;
  const levelFixed = useScenario("adm-faq-heading-skip-001");
  useScenario("adm-faq-group-contrast-001"); // CSS scenario (marketing.css)

  return (
    <div className="adm-faq">
      <Hero title="Admissions FAQ" kicker="Admissions" lede={c.summary} variant="banner" />
      <div className="page-content" data-a11y-scenario="adm-faq-heading-skip-001 adm-faq-group-contrast-001">
        {GROUPS.map(([title, ids]) => (
          <section key={title} className="stack adm-faq-group">
            <h2>{title}</h2>
            <Accordion
              headingLevel={levelFixed ? 3 : 4}
              items={ids.map((i) => ({ title: c.sections[i].heading!, content: <p>{c.sections[i].paragraphs![0]}</p> }))}
            />
          </section>
        ))}

        <section className="stack adm-faq-contact">
          <h2>Still have questions?</h2>
          <p>
            Your regional admissions counselor is happy to help.{" "}
            <SmartLink scenario="adm-faq-generic-link-001" to="mailto:admissions@redwoodstate.edu" defect="Click here">Email the Office of Admissions</SmartLink>{" "}
            or call (707) 555-0120.
          </p>
        </section>

        <CtaBand title="See it for yourself" text="Student-led tours run Monday through Friday at 10 a.m. and 2 p.m." action={{ label: "Visit campus", href: "/admissions/visit" }} />
        {c.updated && <p className="page-updated">{c.updated}</p>}
      </div>
    </div>
  );
}
