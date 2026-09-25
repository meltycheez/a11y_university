// /library/policies: borrowing, fines and conduct (copy from pageContent).
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { ContactCard, RelatedLinks } from "~/components/blocks";
import { Callout } from "~/components/Callout";
import { pageContent } from "~/data/content/pages";

export { inventoryMeta as meta } from "~/routes/meta";

export default function LibraryPolicies() {
  const captionFixed = useScenario("library-policies-caption-001");
  useScenario("library-policies-updated-small-001"); // CSS scenario (library.css)
  const content = pageContent["/library/policies"];
  if (!content) return null;
  const [borrowing, fines, conduct] = content.sections;
  const table = borrowing.table!;

  return (
    <div className="page-content lib-policies">
      <header>
        <h1 id="page-title">Library Policies</h1>
        <p>{content.summary}</p>
        <p className="lib-policies-updated" data-a11y-scenario="library-policies-updated-small-001">{content.updated}</p>
      </header>

      <section aria-labelledby="borrowing-heading">
        <h2 id="borrowing-heading">{borrowing.heading}</h2>
        <div className="table-scroll" data-a11y-scenario="library-policies-caption-001">
          <table>
            {captionFixed && <caption>Loan limits and periods by patron type</caption>}
            <thead><tr>{table.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
            <tbody>{table.rows.map((row) => <tr key={row[0]}><th scope="row">{row[0]}</th>{row.slice(1).map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>

      <Callout title={fines.heading}>
        {fines.paragraphs?.map((p) => <p key={p}>{p}</p>)}
      </Callout>

      <section aria-labelledby="conduct-heading" className="stack">
        <h2 id="conduct-heading">{conduct.heading}</h2>
        {conduct.paragraphs?.map((p) => <p key={p}>{p}</p>)}
        <p>
          The complete policy manual covers borrowing privileges, interlibrary loan, computer use, study rooms and collection development.{" "}
          <SmartLink scenario="library-policies-pdf-001" to="/documents/library-policies.pdf" defect="Full Library Policies (PDF)" fileInfo="PDF, 2 KB">Full Library Policies</SmartLink>
        </p>
        <p>
          Questions about a bill or a lost item?{" "}
          <SmartLink scenario="library-policies-click-here-001" to="/library/account" defect="Click here">Check your library account</SmartLink>
        </p>
      </section>

      <div className="lib-two-col">
        <ContactCard title="Access Services" lines={[{ label: "Supervisor", value: "Paloma Ramirez" }, { label: "Phone", value: "(707) 555-0271", href: "tel:+17075550271" }, { label: "Email", value: "paloma.ramirez@redwoodstate.example.edu", href: "mailto:paloma.ramirez@redwoodstate.example.edu" }]} />
        <RelatedLinks title="Related" links={[{ label: "Study Room Reservations", href: "/library/study-rooms" }, { label: "Library Hours", href: "/library/hours" }]} />
      </div>
    </div>
  );
}
