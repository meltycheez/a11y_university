import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Callout } from "~/components/Callout";
import { Tabs } from "~/components/Tabs";
import { RelatedLinks } from "~/components/blocks";
import { LinkList, Table, content } from "./_content";

export { inventoryMeta as meta } from "~/routes/meta";

const FINE_PRINT = "Fees are subject to change without notice by the Board of Trustees.";

export default function Tuition() {
  const c = content("/admissions/tuition")!;
  const [intro, ug, grad, coa, payment] = c.sections;
  const dupFixed = useScenario("adm-tuition-duplicate-link-001");
  useScenario("adm-tuition-fineprint-small-001"); // CSS scenarios (marketing.css): register only.
  useScenario("adm-tuition-table-reflow-001");
  const lead = intro.paragraphs![0].replace(FINE_PRINT, "").trim();
  // The 2025–26 link was left in place next to the new one; both point at the same PDF.
  const docs = payment.links!.filter((l) => l.label.endsWith("(PDF)") && !(dupFixed && l.label.startsWith("2025–26")));
  const other = payment.links!.filter((l) => !l.label.endsWith("(PDF)"));

  return (
    <div className="adm-tuition">
      <Hero title="Tuition & Fees" kicker="Cost & Aid" lede={c.summary} image="admissions-hero-movein" imageAlt="" />
      <div className="page-content">
        <section className="stack">
          <p className="adm-lead">{lead}</p>
          <p className="adm-fineprint" data-a11y-scenario="adm-tuition-fineprint-small-001">{FINE_PRINT}</p>
        </section>

        <section className="stack" aria-labelledby="rates-heading">
          <h2 id="rates-heading">Tuition and campus fees</h2>
          <Tabs label="Tuition by student level" tabs={[
            { label: "Undergraduate", content: <><h3>{ug.heading}</h3><Table table={ug.table!} className="adm-wide-table" marker="adm-tuition-table-reflow-001" /></> },
            { label: "Graduate", content: <><h3>{grad.heading}</h3><Table table={grad.table!} /></> },
          ]} />
        </section>

        <section className="stack" aria-labelledby="coa-heading">
          <h2 id="coa-heading">{coa.heading}</h2>
          <Table table={coa.table!} headersScenario="adm-tuition-coa-headers-001" idPrefix="coa" />
        </section>

        <section className="stack" aria-labelledby="pay-heading">
          <h2 id="pay-heading">{payment.heading}</h2>
          <Callout title="RSU Payment Plan">
            <p>{payment.paragraphs![0]}</p>
          </Callout>
          <div data-a11y-scenario="adm-tuition-duplicate-link-001"><LinkList links={docs} /></div>
        </section>

        <RelatedLinks title="Paying for college" links={[...other, { label: "Scholarships", href: "/admissions/scholarships" }, { label: "Types of Aid", href: "/financial-aid/types" }]} />
        {c.updated && <p className="page-updated">{c.updated}</p>}
      </div>
    </div>
  );
}
