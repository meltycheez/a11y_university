import { Heading } from "~/a11y/helpers";
import { Callout } from "~/components/Callout";
import { StatsBand } from "~/components/blocks";
import { AudienceLanding } from "./_AudienceLanding";
import { Copy, content } from "./_content";

export { inventoryMeta as meta } from "~/routes/meta";

export default function TransferAdmissions() {
  const [intro, reqs, adt] = content("/admissions/transfer")!.sections;
  return (
    <AudienceLanding path="/admissions/transfer" image="campus-student-orgs" imageAlt="">
      <Copy s={intro} />
      <StatsBand label="Transfer students at RSU" stats={[{ value: "1 in 3", label: "RSU students started at another college" }, { value: "2", label: "admission terms each year: fall and spring" }]} />
      <Copy s={reqs} />
      <Callout title="Guaranteed admission with an ADT" tone="success">
        <Copy s={adt} heading={<Heading scenario="adm-transfer-adt-heading-001" level={2} defect="fake">{adt.heading}</Heading>} />
      </Callout>
    </AudienceLanding>
  );
}
