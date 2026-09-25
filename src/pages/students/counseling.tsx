import { Callout } from "~/components/Callout";
import { Copy, content } from "~/pages/admissions/_content";
import { ServicePage } from "./_ServicePage";

export { inventoryMeta as meta } from "~/routes/meta";

export default function Counseling() {
  const [intro, services, hours] = content("/students/counseling")!.sections;
  return (
    <ServicePage
      path="/students/counseling"
      image="campus-counseling"
      contact={[{ label: "Location", value: "Wellness Center" }, { label: "Phone (24/7)", value: "(707) 555-0152", href: "tel:+17075550152" }]}
      related={hours.links}
    >
      <p>{intro.paragraphs![0]}</p>
      <Callout title="In crisis? Get help now" tone="warning">
        <p>{intro.paragraphs![1]}</p>
      </Callout>
      <Copy s={services} />
      <Copy s={{ ...hours, links: undefined }} table={{ caption: "CAPS hours", captionScenario: "stu-counseling-hours-caption-001" }} />
    </ServicePage>
  );
}
