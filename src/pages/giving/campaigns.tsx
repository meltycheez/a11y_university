import { Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { ButtonLink } from "~/components/Button";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { AnyLink, StatsBand, VideoEmbed } from "~/components/blocks";
import { copyFor } from "../about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/giving/campaigns");
const [main, givingDay] = content.sections;
const [plan, priorities] = main.links!;
const money = (s: string) => Number(s.replace(/[^0-9.]/g, ""));

export default function CampaignsPage() {
  const meterFixed = useScenario("giving-campaigns-bars-state-001");
  useScenario("giving-campaigns-bars-motion-001"); // CSS scenario (foundation.css)
  const t = main.table!;

  return (
    <>
      <Hero title="Wide Branches" kicker="The Campaign for Redwood State" lede={content.summary} image="giving-hero-scholars">
        <ButtonLink to="/giving/donate">Give to the campaign</ButtonLink>
      </Hero>
      <div className="page-content">
        <p className="lede-paragraph">{main.paragraphs![0]}</p>

        <StatsBand
          label="Campaign totals"
          stats={[
            { value: "$250M", label: "campaign goal" },
            { value: "$141M", label: "committed as of September 2026" },
            { value: "June 2030", label: "campaign ends" },
          ]}
        />

        <section className="stack" aria-labelledby="progress-heading">
          <h2 id="progress-heading">Progress by priority</h2>
          <ul className="campaign-bars" data-a11y-scenario="giving-campaigns-bars-state-001 giving-campaigns-bars-motion-001">
            {t.rows.filter((r) => r[0] !== "Total").map(([name, goal, raised]) => {
              const pct = Math.round((money(raised) / money(goal)) * 100);
              return (
                <li key={name}>
                  <p className="campaign-bar-label">{name}</p>
                  <div
                    className="campaign-bar"
                    {...(meterFixed ? { role: "progressbar", "aria-label": name, "aria-valuenow": pct, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuetext": `${raised} of ${goal} (${pct}%)` } : {})}
                  >
                    <span className="campaign-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="table-wrap">
            <table className="data-table">
              <caption>{t.caption}</caption>
              <thead><tr>{t.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
              <tbody>
                {t.rows.map((r) => (
                  <tr key={r[0]} className={r[0] === "Total" ? "total-row" : undefined}>
                    <th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Wide Branches advances the goals of{" "}
            <SmartLink scenario="giving-campaigns-plan-newwindow-001" to={plan.href} newWindow>{plan.label}</SmartLink>.
            See also <AnyLink href={priorities.href}>{priorities.label}</AnyLink>.
          </p>
        </section>

        <VideoEmbed
          title="Wide Branches campaign launch"
          caption="President Elena Vásquez-Hart announces the Wide Branches campaign on Canopy Green."
          titleScenario="giving-campaigns-video-title-001"
        />

        <Callout title="Owl Giving Day">
          <Heading scenario="giving-campaigns-givingday-heading-001" level={3} defect="skipped" defectLevel={5}>{givingDay.heading}</Heading>
          {givingDay.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
        </Callout>
      </div>
    </>
  );
}
