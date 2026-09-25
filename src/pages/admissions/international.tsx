import { Heading } from "~/a11y/helpers";
import { StatsBand } from "~/components/blocks";
import { AudienceLanding } from "./_AudienceLanding";
import { Copy, content } from "./_content";

export { inventoryMeta as meta } from "~/routes/meta";

export default function InternationalAdmissions() {
  const [intro, needs, deadlines] = content("/admissions/international")!.sections;
  return (
    <AudienceLanding
      path="/admissions/international"
      image="campus-research-forest"
      imageAlt="intl_hero_banner_2024.jpg"
      imageScenario="adm-intl-hero-alt-001"
      imageFixedAlt=""
    >
      <Copy s={intro} />
      <StatsBand label="International students at RSU" stats={[{ value: "420", label: "international students" }, { value: "40+", label: "countries represented" }]} />
      <Copy s={needs} heading={<Heading scenario="adm-intl-heading-skip-001" level={2} defect="skipped" defectLevel={4}>{needs.heading}</Heading>} />
      <Copy s={deadlines} table={{ caption: "International application deadlines", captionScenario: "adm-audience-table-caption-001" }} />
    </AudienceLanding>
  );
}
