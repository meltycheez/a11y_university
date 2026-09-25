import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Callout } from "~/components/Callout";
import { CtaBand } from "~/components/blocks";
import { LinkList, content } from "./_content";

export { inventoryMeta as meta } from "~/routes/meta";

const LONG_ALT =
  "A financial aid counselor with short gray hair and reading glasses sits at a wooden desk in the Financial Aid and Scholarships office in Founders Hall and reviews a printed award letter with a smiling first-year student and her father, who holds a folder of forms, while a window behind them shows redwood trees and a banner that reads Scholarships Available Now in maroon and gold.";

export default function Scholarships() {
  const c = content("/admissions/scholarships")!;
  const [intro, featured, outside] = c.sections;
  const underlineFixed = useScenario("adm-schol-underline-001");
  const colorFixed = useScenario("adm-schol-renewable-color-001");
  const [before, after] = intro.paragraphs![0].split("one application");

  return (
    <div className="adm-schol">
      <Hero title="Scholarships" kicker="Cost & Aid" lede={c.summary} image="aid-hero-advising" imageAlt={LONG_ALT} imageScenario="adm-schol-hero-alt-long-001" imageFixedAlt="" />
      <div className="page-content">
        <p className="adm-lead" data-a11y-scenario="adm-schol-underline-001">
          {before}{underlineFixed ? <strong>one application</strong> : <u>one application</u>}{after}
        </p>

        <section className="stack" aria-labelledby="featured-heading">
          <h2 id="featured-heading">{featured.heading}</h2>
          {!colorFixed && <p className="adm-legend"><span className="adm-swatch" /> Green bar = renewable each year</p>}
          <ul className="adm-schol-list" data-a11y-scenario="adm-schol-renewable-color-001">
            {featured.table!.rows.map(([name, amount, eligibility, deadline]) => {
              const renewable = amount.endsWith(", renewable");
              return (
                <li key={name} className={renewable ? "adm-schol-card is-renewable" : "adm-schol-card"}>
                  <h3>{name}</h3>
                  <dl>
                    <div><dt>Amount</dt><dd>{renewable && !colorFixed ? amount.replace(", renewable", "") : amount}</dd></div>
                    <div><dt>Who can apply</dt><dd>{eligibility}</dd></div>
                    <div><dt>Deadline</dt><dd>{deadline}</dd></div>
                  </dl>
                </li>
              );
            })}
          </ul>
        </section>

        <Callout title={outside.heading}>
          <p>{outside.paragraphs![0]}</p>
          <LinkList links={outside.links!} fixes={{ "Read more": { scenario: "adm-schol-generic-link-001", defect: "Read more", text: "Grants, loans, and work-study" } }} />
        </Callout>

        <CtaBand title="One application, 300+ awards" text="The RSU General Scholarship Application for 2027–28 is open October 1, 2026 through March 2, 2027 in RedwoodConnect." action={{ label: "Go to RedwoodConnect", href: "/portal/todo" }} />
        {c.updated && <p className="page-updated">{c.updated}</p>}
      </div>
    </div>
  );
}
