import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Callout } from "~/components/Callout";
import { ContactCard, StatsBand } from "~/components/blocks";
import { LinkList, Table, content } from "~/pages/admissions/_content";

export { inventoryMeta as meta } from "~/routes/meta";

export default function FinancialAid() {
  const c = content("/financial-aid")!;
  const [intro, how, deadlines, sap, contact] = c.sections;
  const iconFixed = useScenario("aid-home-email-icon-link-001");
  useScenario("aid-home-sap-justified-001"); // CSS scenarios (marketing.css): register only.
  useScenario("aid-home-deadline-contrast-001");

  return (
    <div className="aid-home">
      <Hero title="Financial Aid" kicker="Financial Aid & Scholarships" lede={c.summary} image="aid-hero-advising" imageAlt="aid_hero_final_v2.jpg" imageScenario="aid-home-hero-alt-001" imageFixedAlt="" />
      <div className="page-content">
        <p className="adm-lead">{intro.paragraphs![0]}</p>
        <StatsBand label="Aid at a glance, 2025–26" stats={[{ value: "71%", label: "of undergraduates received aid" }, { value: "58%", label: "paid no tuition after grants" }]} />

        <div className="aid-deadline" data-a11y-scenario="aid-home-deadline-contrast-001">
          <p><strong>Priority deadline: March 2, 2027.</strong> File the FAFSA or CADAA with school code RSU000.</p>
        </div>

        <section className="stack" aria-labelledby="how-heading">
          <h2 id="how-heading">{how.heading}</h2>
          <ol className="aid-steps">{how.list!.map((item) => <li key={item}>{item}</li>)}</ol>
        </section>

        <section className="stack" aria-labelledby="deadlines-heading">
          <h2 id="deadlines-heading">{deadlines.heading}</h2>
          <Table table={deadlines.table!} caption="Financial aid deadlines, 2027–28" captionScenario="aid-home-deadlines-caption-001" />
        </section>

        <Callout title={sap.heading}>
          <p className="aid-sap" data-a11y-scenario="aid-home-sap-justified-001">{sap.paragraphs![0]}</p>
        </Callout>

        <div className="adm-audience-body">
          <section className="stack adm-audience-main" aria-labelledby="more-heading">
            <h2 id="more-heading">Explore financial aid</h2>
            <LinkList links={contact.links!} fixes={{ "Institutional Aid Application": { scenario: "aid-home-legacy-new-window-001", newWindow: true } }} />
          </section>
          <div className="stack">
            <ContactCard
              title={contact.heading!}
              lines={[
                { label: "Office", value: contact.list![0] },
                { label: "Phone", value: "(707) 555-0125", href: "tel:+17075550125" },
                { label: "Walk-in hours", value: "Monday–Thursday, 9 a.m. to 4 p.m." },
              ]}
            />
            <p className="aid-icon-links">
              <a href="mailto:finaid@redwoodstate.edu" className="aid-icon-link" data-a11y-scenario="aid-home-email-icon-link-001">
                <span aria-hidden="true">✉</span>
                {iconFixed && <span className="visually-hidden">Email the Financial Aid Office</span>}
              </a>
            </p>
          </div>
        </div>
        {c.updated && <p className="page-updated">{c.updated}</p>}
      </div>
    </div>
  );
}
