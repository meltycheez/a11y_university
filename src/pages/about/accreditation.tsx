import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { ContactCard } from "~/components/blocks";
import { copyFor } from "./_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/about/accreditation");
const [institutional, specialized, complaints] = content.sections;
const letter = institutional.links![0];
const conduct = complaints.links![0];
const noPdf = (label: string) => label.replace(/\s*\(PDF\)$/, "");
/** Reviews starting before fall 2028 are "coming up". */
const soon = (next: string) => Number(next.slice(0, 4)) < 2028;

export default function AccreditationPage() {
  useScenario("about-accreditation-address-small-001"); // CSS scenario (flagship.css)
  return (
    <>
      <Hero title="Accreditation" kicker="About Redwood State" lede={content.summary} variant="banner" />
      <div className="page-content accreditation">
        <section className="stack" aria-labelledby="institutional-heading">
          <h2 id="institutional-heading">{institutional.heading}</h2>
          <p>
            {institutional.paragraphs![0]}{" "}
            <SmartLink scenario="about-accreditation-readmore-001" to={letter.href} defect="Read more">
              Read the 2021 Commission action letter
            </SmartLink>
          </p>
          <p>{institutional.paragraphs![1]}</p>
          <p className="accreditation-address" data-a11y-scenario="about-accreditation-address-small-001">
            Pacific Accrediting Commission for Colleges and Universities, 400 Harbor Plaza, Suite 900, Westmere, CA.
            Accreditation status can be confirmed in the Commission's directory of member institutions.
          </p>
          <h3>Accreditation documents</h3>
          <ul className="doc-list">
            <li>
              <SmartLink scenario="about-accreditation-letter-doc-001" to={letter.href} defect={noPdf(letter.label)} fileInfo="PDF, 2 KB">
                {noPdf(letter.label)}
              </SmartLink>
            </li>
            <li>Mid-Cycle Review report (spring 2025): available on request from the Office of Academic Planning and Assessment</li>
          </ul>
        </section>

        <section className="stack" aria-labelledby="specialized-heading">
          <h2 id="specialized-heading">{specialized.heading}</h2>
          <SpecializedTable />
        </section>

        <Callout title={complaints.heading}>
          {complaints.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
          <p>
            <SmartLink scenario="about-accreditation-conduct-newwindow-001" to={conduct.href} newWindow>{conduct.label}</SmartLink>
          </p>
        </Callout>

        <ContactCard
          title="Office of Academic Planning and Assessment"
          lines={[
            { label: "Office", value: "Founders Hall 410" },
            { label: "Phone", value: "(707) 555-0112", href: "tel:7075550112" },
            { label: "Email", value: "assessment@redwoodstate.edu", href: "mailto:assessment@redwoodstate.edu" },
          ]}
        />
        {content.updated && <p className="page-updated">{content.updated}</p>}
      </div>
    </>
  );
}

/**
 * about-accreditation-table-headers-001: the old CMS table widget writes `headers` ids with a prefix the header
 * cells don't have. about-accreditation-review-color-001: upcoming reviews are shown in red only.
 */
function SpecializedTable() {
  const headersFixed = useScenario("about-accreditation-table-headers-001");
  const colorFixed = useScenario("about-accreditation-review-color-001");
  const t = specialized.table!;
  const ids = ["program", "body", "next"];
  return (
    <div className="table-wrap" data-a11y-scenario="about-accreditation-table-headers-001 about-accreditation-review-color-001">
      <table className="data-table accreditation-table">
        <caption>{t.caption}</caption>
        <thead>
          <tr>{t.columns.map((c, i) => <th key={c} scope="col" id={headersFixed ? undefined : `acc-${ids[i]}`}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {t.rows.map((row) => (
            <tr key={row[0]} className={soon(row[2]) ? "review-soon" : undefined}>
              {row.map((cell, i) =>
                headersFixed && i === 0
                  ? <th key={i} scope="row">{cell}</th>
                  : (
                    <td key={i} headers={headersFixed ? undefined : `tbl-acc-${ids[i]}`}>
                      {cell}
                      {i === 2 && colorFixed && soon(cell) && <> <span className="review-note">(review coming up)</span></>}
                    </td>
                  ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="table-note">{colorFixed ? "Reviews scheduled before fall 2028 are marked “review coming up.”" : "Reviews scheduled before fall 2028 are shown in red."}</p>
    </div>
  );
}
