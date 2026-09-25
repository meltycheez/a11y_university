import { SmartLink } from "~/a11y/helpers";
import { DataTable } from "~/components/DataTable";
import { Hero } from "~/components/Hero";
import { RelatedLinks } from "~/components/blocks";
import { pageContent } from "~/data/content/pages";
import { CmsPage, PDF_INFO } from "./_cms";

export { inventoryMeta as meta } from "~/routes/meta";

const content = pageContent["/academics/certificates"];
const table = content.sections[0].table!;
const addendum = content.sections[0].links?.[0];
const columns = table.columns.map((header, i) => ({ key: header, header, render: (row: string[]) => row[i], numeric: header === "Units" }));

export default function CertificatesPage() {
  return (
    <CmsPage>
      <Hero title="Certificates" lede={content.summary} variant="banner" />
      <div className="page-content">
        <DataTable caption="Certificate programs, 2025–26" columns={columns} rows={table.rows} rowHeader="Certificate" />
        {addendum && (
          <p>
            Changes made after the catalog was published are listed in the addendum. For the latest requirements,{" "}
            <SmartLink scenario="academics-certificates-link-generic-001" to={addendum.href} defect={addendum.label.toLowerCase()} fileInfo={PDF_INFO}>
              see the Catalog Addendum 2025–26
            </SmartLink>.
          </p>
        )}
        <RelatedLinks
          title="Related"
          links={[
            { label: "Degree Programs", href: "/academics/programs" },
            { label: "Minors", href: "/academics/minors" },
            { label: "Graduate Admissions", href: "/admissions/graduate" },
          ]}
        />
        {content.updated && <p className="page-updated">{content.updated}</p>}
      </div>
    </CmsPage>
  );
}
