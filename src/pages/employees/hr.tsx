import { Form } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Accordion } from "~/components/Accordion";
import { Hero } from "~/components/Hero";
import { RelatedLinks } from "~/components/blocks";
import { copyFor } from "../about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/employees/hr");
const [overview, contact] = content.sections;
const EMAIL = "hr@redwoodstate.example.edu";

const units = [
  { title: "Talent Acquisition", content: <p>Posts positions, coordinates search committees and background checks, and runs new employee orientation every other Monday.</p> },
  { title: "Classification & Compensation", content: <p>Maintains job descriptions and salary ranges, reviews reclassification requests, and administers in-range progressions under the bargaining agreements.</p> },
  { title: "Employee & Labor Relations", content: <p>Advises supervisors and employees on performance, grievances, and the collective bargaining agreements for all six units.</p> },
  { title: "Benefits", content: <p>Enrolls employees in medical, dental, vision, and retirement plans and manages leaves of absence.</p> },
  { title: "Learning & Development", content: <p>Offers required compliance training, supervisor development, and the annual Staff Development Day.</p> },
];

export default function HrPage() {
  const captionFixed = useScenario("employees-hr-units-caption-001");
  const accordionFixed = useScenario("employees-hr-accordion-heading-001");
  const searchFixed = useScenario("employees-hr-search-label-001");
  useScenario("employees-hr-negotiation-contrast-001"); // CSS scenario (intranet.css)
  const t = overview.table!;

  return (
    <>
      <Hero title="Human Resources" lede={content.summary} variant="banner" />
      <div className="page-content">
        <Form action="/search" method="get" className="intranet-search" data-a11y-scenario="employees-hr-search-label-001">
          {searchFixed ? <label htmlFor="hr-search">Search HR pages</label> : <span className="field-label">Search HR pages</span>}
          <input id="hr-search" name="q" type="search" />
          <button type="submit" className="btn btn--secondary">Go</button>
        </Form>

        <p>{overview.paragraphs![0]}</p>

        <section aria-labelledby="hr-units-heading" data-a11y-scenario="employees-hr-accordion-heading-001">
          <h2 id="hr-units-heading">HR units</h2>
          <Accordion items={units} headingLevel={accordionFixed ? 3 : 4} />
        </section>

        <section aria-labelledby="bargaining-heading" className="stack">
          <h2 id="bargaining-heading">Collective bargaining</h2>
          <div className="table-wrap" data-a11y-scenario="employees-hr-units-caption-001 employees-hr-negotiation-contrast-001">
            {!captionFixed && <p className="table-title"><b>{t.caption}</b></p>}
            <table className="data-table">
              {captionFixed && <caption>{t.caption}</caption>}
              <thead><tr>{t.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
              <tbody>
                {t.rows.map(([unit, group, term]) => {
                  const [dates, note] = term.split(" (");
                  return (
                    <tr key={unit}>
                      <th scope="row">{unit}</th>
                      <td>{group}</td>
                      <td>{dates}{note && <> <span className="term-note">({note}</span></>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="hr-contact-heading" className="stack">
          <h2 id="hr-contact-heading">{contact.heading}</h2>
          <ul>
            {contact.list!.map((line) =>
              line === EMAIL
                ? <li key={line}><SmartLink scenario="employees-hr-email-title-001" to={`mailto:${EMAIL}`} defectTitle={EMAIL}>{EMAIL}</SmartLink></li>
                : <li key={line}>{line}</li>,
            )}
          </ul>
        </section>

        <RelatedLinks title="HR resources" links={contact.links!} />
      </div>
    </>
  );
}
