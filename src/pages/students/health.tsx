import { useScenario } from "~/a11y/useScenario";
import { Accordion } from "~/components/Accordion";
import { Callout } from "~/components/Callout";
import { LinkList, Table, content } from "~/pages/admissions/_content";
import { ServicePage } from "./_ServicePage";

export { inventoryMeta as meta } from "~/routes/meta";

const LONG_ALT =
  "A friendly nurse practitioner wearing navy scrubs and a stethoscope sits on a rolling stool in a bright exam room at the Redwood State Student Health Center and talks with a student in a gray hoodie who is sitting on the exam table, with a blood pressure cuff, a hand sanitizer dispenser and a poster about flu shots on the wall behind them.";

export default function Health() {
  const [intro, hours, immunizations] = content("/students/health")!.sections;
  const jsFixed = useScenario("stu-health-portal-js-001");
  const uFixed = useScenario("stu-health-nurse-underline-001");
  useScenario("stu-health-closed-contrast-001"); // CSS scenario (services.css)
  const portal = "https://patientportal.redwoodstate.edu";

  return (
    <ServicePage
      path="/students/health"
      image="campus-health-center"
      imageAlt={LONG_ALT}
      imageScenario="stu-health-hero-alt-long-001"
      imageFixedAlt=""
      contact={[{ label: "Location", value: "Student Health Center" }, { label: "Nurse advice line (24/7)", value: "(707) 555-0151", href: "tel:+17075550151" }]}
      related={[{ label: "Counseling & Psychological Services", href: "/students/counseling" }, { label: "Campus Recreation", href: "/students/recreation" }]}
    >
      <p>{intro.paragraphs![0]}</p>
      <Callout title="After hours">
        <p data-a11y-scenario="stu-health-nurse-underline-001">
          When the clinic is closed, call the {uFixed ? <strong>24/7 nurse advice line</strong> : <u>24/7 nurse advice line</u>} at (707) 555-0151. For emergencies, call 911.
        </p>
      </Callout>
      <section className="stack" aria-labelledby="hours-heading">
        <h2 id="hours-heading">{hours.heading}</h2>
        <Table
          table={hours.table!}
          headersScenario="stu-health-hours-headers-001"
          idPrefix="shc"
          marker="stu-health-closed-contrast-001"
          renderCell={(v) => (v === "Closed" ? <span className="svc-closed">{v}</span> : v)}
        />
      </section>
      <section className="stack" aria-labelledby="req-heading">
        <h2 id="req-heading">Before your first semester</h2>
        <Accordion items={[
          { title: immunizations.heading!, content: <ul>{immunizations.list!.map((i) => <li key={i}>{i}</li>)}</ul> },
          {
            title: "Uploading your records",
            content: (
              <>
                <p>{immunizations.paragraphs![0]}</p>
                <p data-a11y-scenario="stu-health-portal-js-001">
                  {jsFixed
                    ? <a href={portal}>Open the Patient Portal</a>
                    : <a href="#" onClick={(e) => { e.preventDefault(); window.open(portal, "patientportal", "width=900,height=700"); }}>Open the Patient Portal</a>}
                </p>
                <LinkList links={immunizations.links!} />
              </>
            ),
          },
        ]} />
      </section>
    </ServicePage>
  );
}
