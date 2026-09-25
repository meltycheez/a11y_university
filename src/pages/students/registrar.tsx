import { useScenario } from "~/a11y/useScenario";
import { Tabs } from "~/components/Tabs";
import { Callout } from "~/components/Callout";
import { Copy, LinkList, Table, content, pdfFixes } from "~/pages/admissions/_content";
import { ServicePage, contactLines } from "./_ServicePage";

export { inventoryMeta as meta } from "~/routes/meta";

export default function Registrar() {
  const c = content("/students/registrar")!;
  const [intro, services, dates, contact] = c.sections;
  const describedFixed = useScenario("stu-registrar-fee-describedby-001");

  return (
    <ServicePage path="/students/registrar" contact={contactLines(contact.list!)} related={[{ label: "Academic Calendar", href: "/academics/calendar" }, { label: "Academic Advising", href: "/students/advising" }, { label: "RedwoodConnect", href: "/portal" }]} updatedScenario="stu-registrar-updated-small-001" className="svc-registrar">
      <Copy s={intro} />
      <Tabs label="Registrar services" tabs={[
        {
          label: "Services and fees",
          content: (
            <section className="stack" aria-describedby={describedFixed ? "reg-fee-note" : "fee-note-2019"} data-a11y-scenario="stu-registrar-fee-describedby-001">
              <h2>{services.heading}</h2>
              <Table table={services.table!} caption="Registrar services and fees" captionScenario="stu-registrar-services-caption-001" />
              <p id="reg-fee-note" className="svc-note">Fees are charged to your student account in RedwoodConnect.</p>
            </section>
          ),
        },
        {
          label: "Registration dates",
          content: (
            <section className="stack">
              <h2>{dates.heading}</h2>
              <ul>{dates.list!.map((d) => <li key={d}>{d}</li>)}</ul>
            </section>
          ),
        },
        {
          label: "Forms & documents",
          content: (
            <section className="stack" data-a11y-scenario="stu-registrar-pdf-doc-001">
              <h2>Forms and documents</h2>
              <LinkList links={dates.links!} fixes={pdfFixes(dates.links!, "stu-registrar-pdf-doc-001")} />
            </section>
          ),
        },
      ]} />
      <Callout title="FERPA and your records">
        <p>The Registrar will not release your records without your written consent, except as FERPA allows. Read the annual notice under Forms &amp; documents.</p>
      </Callout>
    </ServicePage>
  );
}
