import { useScenario } from "~/a11y/useScenario";
import { Accordion } from "~/components/Accordion";
import { LinkList, content, pdfFixes } from "~/pages/admissions/_content";
import { ServicePage } from "./_ServicePage";

export { inventoryMeta as meta } from "~/routes/meta";

export default function Safety() {
  const [intro, resources, prep] = content("/students/safety")!.sections;
  const headingFixed = useScenario("stu-safety-heading-empty-001");
  useScenario("stu-safety-alert-motion-001"); // CSS scenarios (services.css): register only.
  useScenario("stu-safety-alert-contrast-001");
  const [quake, smoke] = prep.paragraphs![0].split(/ (?=During a wildfire)/);

  return (
    <ServicePage
      path="/students/safety"
      image="campus-safety"
      contact={[
        { label: "Emergency", value: "911", href: "tel:911" },
        { label: "UPD non-emergency", value: "(707) 555-0160", href: "tel:+17075550160" },
        { label: "Safety escorts", value: "(707) 555-0161", href: "tel:+17075550161" },
      ]}
      related={[{ label: "Campus Map", href: "/campus-map" }, { label: "Counseling & Psychological Services", href: "/students/counseling" }]}
    >
      <p className="svc-alert-banner" data-a11y-scenario="stu-safety-alert-motion-001 stu-safety-alert-contrast-001">
        <strong>Emergency? Call 911.</strong> RSU Alert sends emergency texts and email to every student automatically.
      </p>
      <p>{intro.paragraphs![0]}</p>

      <section className="stack" data-a11y-scenario="stu-safety-heading-empty-001">
        {headingFixed ? <span className="svc-shield" aria-hidden="true" /> : <h2 className="svc-shield-heading"><span className="svc-shield" /></h2>}
        <h2>{resources.heading}</h2>
        <ul>{resources.list!.map((r) => <li key={r}>{r}</li>)}</ul>
      </section>

      <section className="stack" aria-labelledby="prep-heading">
        <h2 id="prep-heading">{prep.heading}</h2>
        <Accordion items={[
          { title: "Earthquakes and tsunamis", content: <p>{quake}</p> },
          { title: "Wildfire smoke", content: <p>{smoke}</p> },
        ]} />
        <div data-a11y-scenario="stu-safety-pdf-doc-001">
          <LinkList links={prep.links!} fixes={pdfFixes(prep.links!, "stu-safety-pdf-doc-001")} />
        </div>
      </section>
    </ServicePage>
  );
}
