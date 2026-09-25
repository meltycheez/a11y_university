import { Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { RelatedLinks } from "~/components/blocks";
import { copyFor } from "../about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/employees/policies");
const [main] = content.sections;
const [collection, emergency, conduct] = main.links!;
const [intro, pdfNote] = main.paragraphs![0].split(/(?=Policies below are provided)/);

export default function PoliciesPage() {
  const captionFixed = useScenario("employees-policies-table-caption-001");
  useScenario("employees-policies-revised-contrast-001"); // CSS scenario (intranet.css)
  const t = main.table!;

  return (
    <>
      <Hero title="Employee Policies" lede={content.summary} variant="banner" />
      <div className="page-content">
        <Callout title="Which rule applies?">
          <p>{intro}</p>
        </Callout>

        <section className="stack">
          {/* The CMS "table title" heading block was left empty above the table. */}
          <Heading scenario="employees-policies-heading-empty-001" level={2} defect="empty">Policy index</Heading>
          <p>{pdfNote}</p>
          <div className="table-wrap" data-a11y-scenario="employees-policies-table-caption-001 employees-policies-revised-contrast-001">
            <table className="data-table policy-table">
              {captionFixed && <caption>Employment policies and executive memoranda</caption>}
              <thead><tr>{t.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
              <tbody>
                {t.rows.map(([name, num, revised]) => (
                  <tr key={num}>
                    <th scope="row">{name}</th>
                    <td>{num}</td>
                    <td className={Number(revised) < 2020 ? "revised-old" : undefined}>{revised}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="stack" aria-labelledby="downloads-heading">
          <h2 id="downloads-heading">Downloads</h2>
          <ul className="doc-list">
            <li>
              <SmartLink scenario="employees-policies-clickhere-001" to={collection.href} defect={collection.label} fileInfo="PDF, 2 KB">
                Employee policy collection
              </SmartLink>
            </li>
            <li>
              <SmartLink scenario="employees-policies-emergency-newwindow-001" to={emergency.href} newWindow>{emergency.label}</SmartLink>
            </li>
            <li>
              <SmartLink scenario="employees-policies-conduct-doc-001" to={conduct.href} fileInfo="PDF, 2 KB">
                {conduct.label.replace(/\s*\(PDF\)$/, "")}
              </SmartLink>
            </li>
          </ul>
        </section>

        <RelatedLinks title="Related" links={[{ label: "Human Resources", href: "/employees/hr" }, { label: "Benefits", href: "/employees/benefits" }, { label: "Privacy Statement", href: "/policies/privacy" }]} />
        {content.updated && <p className="page-updated">{content.updated}</p>}
      </div>
    </>
  );
}
