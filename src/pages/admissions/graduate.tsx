import { Callout } from "~/components/Callout";
import { StatsBand } from "~/components/blocks";
import { AudienceLanding } from "./_AudienceLanding";
import { Copy, content } from "./_content";

export { inventoryMeta as meta } from "~/routes/meta";

export default function GraduateAdmissions() {
  const [intro, reqs, deadlines] = content("/admissions/graduate")!.sections;
  return (
    <AudienceLanding path="/admissions/graduate" image="campus-library-interior" imageAlt="" className="adm-grad" updatedScenario="adm-grad-updated-small-001">
      <Copy s={intro} />
      <StatsBand label="Graduate Studies" stats={[{ value: "29", label: "graduate programs" }, { value: "3.00", label: "minimum GPA in the last 60 units" }]} />
      <Copy s={reqs} />
      <Callout title="Most programs admit for fall only">
        <p>See each program page for its own deadline and materials.</p>
      </Callout>
      <Copy
        s={deadlines}
        table={{ caption: "Graduate application deadlines", captionScenario: "adm-audience-table-caption-001" }}
        links={{ "Graduate Studies Handbook (PDF)": { scenario: "adm-grad-handbook-doc-001", text: "Graduate Studies Handbook", fileInfo: "PDF, 2 KB" } }}
      />
    </AudienceLanding>
  );
}
