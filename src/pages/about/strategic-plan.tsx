import { Heading } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Tabs } from "~/components/Tabs";
import { CtaBand, StatsBand } from "~/components/blocks";
import { copyFor } from "./_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/about/strategic-plan");
const [intro, ...rest] = content.sections;
const pillars = rest.filter((s) => s.heading?.startsWith("Pillar"));
const progress = rest.find((s) => s.heading === "Progress to date")!;

// Share of the way from the 2023 baseline to the 2030 target; three of seven years have passed (~43%).
const num = (s: string) => Number(s.replace(/[^0-9.]/g, ""));
const pace = ([, base, now, target]: string[]) => (num(now) - num(base)) / (num(target) - num(base));

export default function StrategicPlanPage() {
  useScenario("about-strategic-stats-clip-001"); // CSS scenario (flagship.css)
  return (
    <>
      <Hero title="Strategic Plan 2030" kicker="Rooted in Place" lede={content.summary} image="about-hero-campus" />
      <div className="page-content">
        {intro.paragraphs?.map((p, i) => <p key={i} className="lede-paragraph">{p}</p>)}

        <div className="strategic-stats" data-a11y-scenario="about-strategic-stats-clip-001">
          <StatsBand
            label="Plan at a glance"
            stats={[
              { value: "4", label: "pillars" },
              { value: "3,200+", label: "people who helped shape the plan" },
              { value: "70%", label: "six-year graduation goal" },
              { value: "$60M", label: "annual research funding goal" },
            ]}
          />
        </div>

        <section aria-labelledby="pillars-heading" className="stack">
          <h2 id="pillars-heading">The four pillars</h2>
          <Tabs
            label="Strategic plan pillars"
            tabs={pillars.map((p) => ({
              label: p.heading!.replace(/^Pillar \d: /, ""),
              content: (
                <div className="stack pillar-panel">
                  <p className="pillar-kicker">{p.heading!.split(":")[0]}</p>
                  {p.paragraphs?.map((t, i) => <p key={i}>{t}</p>)}
                  <Heading scenario="about-strategic-goals-heading-001" level={3} defect="skipped" defectLevel={4}>Goals for 2030</Heading>
                  <ul>{p.list?.map((g) => <li key={g}>{g}</li>)}</ul>
                </div>
              ),
            }))}
          />
        </section>

        <ProgressSection />

        <CtaBand
          title="Help build Wide Branches"
          text="The Wide Branches campaign funds the scholarships, research, and housing at the heart of Strategic Plan 2030."
          action={{ label: "See the campaign", href: progress.links?.[0].href ?? "/giving/campaigns" }}
        />
        {content.updated && <p className="page-updated">{content.updated}</p>}
      </div>
    </>
  );
}

function ProgressSection() {
  const refFixed = useScenario("about-strategic-progress-labelledby-001");
  const captionFixed = useScenario("about-strategic-progress-caption-001");
  const colorFixed = useScenario("about-strategic-progress-color-001");
  const t = progress.table!;
  return (
    <section
      aria-labelledby="progress-heading"
      className="stack strategic-progress"
      data-a11y-scenario="about-strategic-progress-labelledby-001 about-strategic-progress-caption-001 about-strategic-progress-color-001"
    >
      <h2 id={refFixed ? "progress-heading" : "progress-title"}>{progress.heading}</h2>
      {!captionFixed && <p className="table-title"><strong>{t.caption}</strong></p>}
      <div className="table-wrap">
        <table className="data-table">
          {captionFixed && <caption>{t.caption}</caption>}
          <thead>
            <tr>
              {t.columns.map((c) => <th key={c} scope="col">{c}</th>)}
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {t.rows.map((row) => {
              const onPace = pace(row) >= 0.4;
              return (
                <tr key={row[0]}>
                  <th scope="row">{row[0]}</th>
                  {row.slice(1).map((c, i) => <td key={i}>{c}</td>)}
                  <td>
                    <span className={`status-dot status-dot--${onPace ? "on" : "behind"}`} aria-hidden="true" />
                    {colorFixed && (onPace ? "On pace" : "Behind pace")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="table-note">
        {colorFixed
          ? "“On pace” means at least 40% of the way from the 2023 baseline to the 2030 target."
          : "Green: on pace for 2030. Amber: behind pace."}
      </p>
    </section>
  );
}
