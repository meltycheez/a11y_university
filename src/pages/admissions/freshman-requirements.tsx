import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Callout } from "~/components/Callout";
import { RelatedLinks } from "~/components/blocks";
import { Copy, Table, content } from "./_content";

export { inventoryMeta as meta } from "~/routes/meta";

const NEW_ROW = "Quantitative Reasoning (beginning Fall 2027)";

export default function FreshmanRequirements() {
  const c = content("/admissions/freshman-requirements")!;
  const [eligibility, ag, impacted] = c.sections;
  const checkFixed = useScenario("adm-fresh-check-glyph-001");
  const colorFixed = useScenario("adm-fresh-new-row-color-001");
  // While defective the "beginning Fall 2027" note is dropped and the row is only tinted gold.
  const rows = ag.table!.rows.map((r) => (r[0] === NEW_ROW && !colorFixed ? ["Quantitative Reasoning", ...r.slice(1)] : r));

  return (
    <div className="adm-fresh">
      <Hero title="First-Year Requirements" kicker="Undergraduate Admissions" lede={c.summary} variant="banner" />
      <div className="page-content">
        <section className="stack" aria-labelledby="elig-heading">
          <h2 id="elig-heading">{eligibility.heading}</h2>
          <ul className="adm-checklist" data-a11y-scenario="adm-fresh-check-glyph-001">
            {eligibility.list!.map((item) => (
              <li key={item}><span className="adm-check" aria-hidden={checkFixed || undefined}>✔</span> {item}</li>
            ))}
          </ul>
        </section>

        <section className="stack" aria-labelledby="ag-heading">
          <h2 id="ag-heading">{ag.heading}</h2>
          <Table
            table={{ ...ag.table!, rows }}
            headersScenario="adm-fresh-ag-headers-001"
            idPrefix="ag"
            marker="adm-fresh-new-row-color-001"
            rowClass={(r) => (r[0].startsWith("Quantitative Reasoning") ? "adm-row-new" : undefined)}
          />
          {!colorFixed && <p className="adm-legend">Rows highlighted in gold are new requirements.</p>}
        </section>

        <Callout title={impacted.heading}>
          <Copy s={{ ...impacted, heading: undefined }} links={{ "Click here for program details": { scenario: "adm-fresh-generic-link-001", defect: "Click here for program details", text: "Degree programs, including Nursing and Computer Science" } }} />
        </Callout>

        <RelatedLinks title="Next steps" links={[
          { label: "How to Apply", href: "/admissions/process" },
          { label: "Admissions FAQ", href: "/admissions/faq" },
          { label: "Tuition & Fees", href: "/admissions/tuition" },
        ]} />
        {c.updated && <p className="page-updated">{c.updated}</p>}
      </div>
    </div>
  );
}
