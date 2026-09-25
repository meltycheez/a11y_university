import { useState } from "react";
import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { RelatedLinks } from "~/components/blocks";
import { Copy, copyFor } from "../about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/employees/benefits");
const [eligibility, medical, dental, retirement, other] = content.sections;
const colIds = ["plan", "type", "ee", "ee1", "fam", "copay", "ded"];

export default function BenefitsPage() {
  const [year, setYear] = useState("2026");
  const selectFixed = useScenario("employees-benefits-year-select-001");
  const captionFixed = useScenario("employees-benefits-dental-caption-001");
  useScenario("employees-benefits-medical-reflow-001"); // CSS scenario (intranet.css)
  const d = dental.table!;

  return (
    <>
      <Hero title="Benefits" lede={content.summary} variant="banner" />
      <div className="page-content">
        <Copy section={eligibility} />

        <div className="field benefits-year" data-a11y-scenario="employees-benefits-year-select-001">
          {selectFixed ? <label htmlFor="plan-year">Plan year</label> : <span className="field-label">Plan year</span>}
          <select id="plan-year" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>
        {year === "2027" && (
          <Callout title="2027 rates" tone="warning">
            <p>2027 premiums will be posted when open enrollment begins on October 12, 2026. The 2026 rates are shown below.</p>
          </Callout>
        )}

        <section aria-labelledby="medical-heading" className="stack">
          <h2 id="medical-heading">{medical.heading}</h2>
          <MedicalTable />
        </section>

        <section aria-labelledby="dental-heading" className="stack">
          <h2 id="dental-heading">{dental.heading}</h2>
          <div className="table-wrap" data-a11y-scenario="employees-benefits-dental-caption-001">
            <table className="data-table">
              {captionFixed && <caption>Dental and vision plans, monthly employee cost</caption>}
              <thead><tr>{d.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
              <tbody>{d.rows.map((r) => <tr key={r[0]}><th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <Copy section={retirement} />
        <Copy
          section={other}
          links={{ "Read more": { scenario: "employees-benefits-readmore-001", text: "Read the full 2026 Benefits Summary" } }}
        />

        <Callout title="Open enrollment: October 12 – November 6, 2026">
          <p>Changes made during open enrollment take effect January 1, 2027. If you make no changes, your current elections continue.</p>
        </Callout>

        <RelatedLinks title="Related" links={[{ label: "Payroll Services", href: "/employees/payroll" }, { label: "Human Resources", href: "/employees/hr" }, { label: "Employee Policies", href: "/employees/policies" }]} />
        {content.updated && <p className="page-updated">{content.updated}</p>}
      </div>
    </>
  );
}

/**
 * employees-benefits-medical-headers-001: `headers` point at ids the header cells don't have.
 * employees-benefits-recommended-color-001: $0 employee-only plans are marked by a green row only.
 */
function MedicalTable() {
  const headersFixed = useScenario("employees-benefits-medical-headers-001");
  const colorFixed = useScenario("employees-benefits-recommended-color-001");
  const t = medical.table!;
  return (
    <div className="benefits-medical" data-a11y-scenario="employees-benefits-medical-reflow-001 employees-benefits-medical-headers-001 employees-benefits-recommended-color-001">
      <p className="table-note">
        {colorFixed ? "Plans marked “No premium” cost nothing for employee-only coverage." : "Plans shaded green have no premium for employee-only coverage."}
      </p>
      <table className="data-table">
        <caption>{t.caption}</caption>
        <thead>
          <tr>{t.columns.map((c, i) => <th key={c} scope="col" id={headersFixed ? undefined : `med-${colIds[i]}`}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {t.rows.map((r) => {
            const free = r[2] === "$0";
            return (
              <tr key={r[0]} className={free ? "row-free" : undefined}>
                {r.map((cell, i) =>
                  headersFixed && i === 0
                    ? <th key={i} scope="row">{cell}{colorFixed && free && <> <span className="badge">No premium</span></>}</th>
                    : <td key={i} headers={headersFixed ? undefined : `medical-${colIds[i]}`}>{cell}{i === 0 && colorFixed && free && <> <span className="badge">No premium</span></>}</td>,
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
