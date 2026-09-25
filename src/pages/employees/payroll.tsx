import { Heading, IconButton } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { ContactCard } from "~/components/blocks";
import { SITE_NOW } from "~/data/site";
import { copyFor } from "../about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/employees/payroll");
const [intro, schedule, forms] = content.sections;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "October 1–15" contains SITE_NOW? */
function isCurrent(period: string) {
  const [month, days] = period.split(" ");
  const [from, to] = days.split("–").map(Number);
  const [, m, d] = SITE_NOW.split("-").map(Number);
  return MONTHS.indexOf(month) + 1 === m && d >= from && d <= to;
}

export default function PayrollPage() {
  const colorFixed = useScenario("employees-payroll-current-color-001");
  const underlineFixed = useScenario("employees-payroll-noon-underline-001");
  useScenario("employees-payroll-cells-spacing-001"); // CSS scenario (intranet.css)
  const t = schedule.table!;
  const current = t.rows.find((r) => isCurrent(r[0]));

  return (
    <>
      <Hero title="Payroll Services" lede={content.summary} variant="banner" />
      <div className="page-content">
        <p>{intro.paragraphs![0]}</p>

        {current && (
          <Callout title="Next timesheet deadline" tone="warning">
            <p data-a11y-scenario="employees-payroll-noon-underline-001">
              Timesheets for {current[0]} are due {current[1].replace(", noon", "")} by{" "}
              {underlineFixed ? <strong>noon</strong> : <span className="text-underline">noon</span>}. Pay date: {current[2]}.
            </p>
          </Callout>
        )}

        <section aria-labelledby="schedule-heading" className="stack">
          <div className="payroll-schedule-head">
            <h2 id="schedule-heading">{schedule.heading}</h2>
            <IconButton scenario="employees-payroll-print-empty-001" label="Print the pay schedule" icon="🖶" onClick={() => window.print()} className="print-button" />
          </div>
          <p className="table-note" data-a11y-scenario="employees-payroll-current-color-001">
            {colorFixed ? "The current pay period is marked “current.”" : "The current pay period is highlighted."}
          </p>
          <div className="table-wrap payroll-schedule" data-a11y-scenario="employees-payroll-cells-spacing-001">
            <table className="data-table">
              <caption>{t.caption}</caption>
              <thead><tr>{t.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
              <tbody>
                {t.rows.map((r) => (
                  <tr key={r[0]} className={r === current ? "row-current" : undefined}>
                    <th scope="row">{r[0]}{colorFixed && r === current && " (current)"}</th>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="stack">
          <Heading scenario="employees-payroll-forms-heading-001" level={2} defect="fake">{forms.heading}</Heading>
          <ul>{forms.list!.map((f) => <li key={f}>{f}</li>)}</ul>
        </section>

        <ContactCard
          title="Payroll Services"
          lines={[
            { label: "Office", value: "Founders Hall 220" },
            { label: "Phone", value: "(707) 555-0182", href: "tel:7075550182" },
            { label: "Email", value: "payroll@redwoodstate.example.edu", href: "mailto:payroll@redwoodstate.example.edu" },
          ]}
        />
      </div>
    </>
  );
}
