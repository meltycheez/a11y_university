import { RelatedLinks, StatsBand } from "~/components/blocks";
import { AudienceLanding } from "./_AudienceLanding";
import { Copy, content } from "./_content";

export { inventoryMeta as meta } from "~/routes/meta";

export default function UndergraduateAdmissions() {
  const [intro, dates, links] = content("/admissions/undergraduate")!.sections;
  return (
    <AudienceLanding path="/admissions/undergraduate" image="admissions-hero-movein" imageAlt="">
      <Copy s={intro} />
      <StatsBand label="First-year experience" stats={[{ value: "25", label: "students in each Canopy Community" }, { value: "80%", label: "of first-year students return for their second year" }]} />
      <Copy s={dates} table={{ caption: "Fall 2027 first-year key dates", captionScenario: "adm-audience-table-caption-001" }} />
      <RelatedLinks title="Next steps" links={links.links!} />
    </AudienceLanding>
  );
}
