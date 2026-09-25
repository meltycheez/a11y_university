import { Heading } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Callout } from "~/components/Callout";
import { Tabs } from "~/components/Tabs";
import { RelatedLinks } from "~/components/blocks";
import { LinkList, Table, content } from "~/pages/admissions/_content";

export { inventoryMeta as meta } from "~/routes/meta";

const SOURCE_CLASS: Record<string, string> = { Federal: "aid-src--federal", State: "aid-src--state", Institutional: "aid-src--rsu" };

export default function AidTypes() {
  const c = content("/financial-aid/types")!;
  const [grants, loans, work] = c.sections;
  const colorFixed = useScenario("aid-types-source-color-001");
  const ariaFixed = useScenario("aid-types-rate-aria-hidden-001");
  const h = (text: string) => <Heading scenario="aid-types-heading-skip-001" level={2} defect="skipped" defectLevel={3}>{text}</Heading>;

  return (
    <div className="aid-types">
      <Hero title="Types of Aid" kicker="Financial Aid & Scholarships" lede={c.summary} variant="banner" />
      <div className="page-content">
        <Tabs label="Types of aid" tabs={[
          {
            label: "Grants",
            content: (
              <div className="stack">
                {h(grants.heading!)}
                <p>{grants.paragraphs![0]}</p>
                {!colorFixed && (
                  <p className="aid-src-legend">
                    <span className="aid-src aid-src--federal" /> Federal <span className="aid-src aid-src--state" /> State <span className="aid-src aid-src--rsu" /> Redwood State
                  </p>
                )}
                <Table
                  table={grants.table!}
                  marker="aid-types-source-color-001"
                  renderCell={(v, _row, j) => (j === 1 ? <><span className={`aid-src ${SOURCE_CLASS[v]}`} />{colorFixed && ` ${v}`}</> : v)}
                />
              </div>
            ),
          },
          {
            label: "Loans",
            content: (
              <div className="stack">
                {h(loans.heading!)}
                <p>{loans.paragraphs![0]}</p>
                <Table
                  table={loans.table!}
                  marker="aid-types-rate-aria-hidden-001"
                  renderHeader={(v, j) => j === 2 ? (
                    <>{v} <span className="aid-info" title="Fixed rate for loans first disbursed July 1, 2026 through June 30, 2027" aria-hidden={ariaFixed ? "true" : ("yes" as "true")}>ⓘ</span></>
                  ) : v}
                  renderCell={(v) => v || "—"}
                />
              </div>
            ),
          },
          {
            label: "Work-study",
            content: (
              <div className="stack">
                {h(work.heading!)}
                <p>{work.paragraphs![0]}</p>
                <LinkList links={work.links!} fixes={{ "Click here": { scenario: "aid-types-generic-link-001", defect: "Click here", text: "Financial Aid overview" } }} />
              </div>
            ),
          },
        ]} />

        <Callout title="Borrow only what you need" tone="warning">
          <p>Accept grants and work-study first. You can accept a smaller loan amount than you are offered in RedwoodConnect.</p>
        </Callout>

        <RelatedLinks links={[
          { label: "Scholarships", href: "/admissions/scholarships" },
          { label: "Tuition & Fees", href: "/admissions/tuition" },
          { label: "Institutional Aid Application", href: "/financial-aid/legacy-application" },
        ]} />
        {c.updated && <p className="page-updated">{c.updated}</p>}
      </div>
    </div>
  );
}
