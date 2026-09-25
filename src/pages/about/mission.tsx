import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { Quote, RelatedLinks } from "~/components/blocks";
import { brand } from "~/data/brand";
import { Copy, copyFor } from "./_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/about/mission");
const [mission, vision, motto, values, land] = content.sections;

// Deliberately light page: one page-level defect.
export default function MissionPage() {
  useScenario("about-mission-justified-001"); // CSS scenario (flagship.css)
  return (
    <>
      <Hero title="Mission, Vision & Values" kicker="About Redwood State" lede={content.summary} variant="banner" />
      <div className="page-content longform">
        <div className="mission-statement" data-a11y-scenario="about-mission-justified-001">
          <Copy section={mission} />
        </div>
        <Copy section={vision} />
        <section className="stack" aria-labelledby="motto-heading">
          <h2 id="motto-heading">{motto.heading}</h2>
          <Quote text={`${brand.mottoTranslation}.`} name="University motto" role="adopted 1961" />
          {motto.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
        </section>
        <section className="stack" aria-labelledby="values-heading">
          <h2 id="values-heading">{values.heading}</h2>
          <dl className="values-list">
            {values.list?.map((v) => {
              const [term, ...rest] = v.split(": ");
              return <div key={term}><dt>{term}</dt><dd>{rest.join(": ")}</dd></div>;
            })}
          </dl>
        </section>
        <Callout title={land.heading}>
          {land.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
        </Callout>
        <RelatedLinks
          title="Learn more"
          links={[
            { label: "Strategic Plan 2030", href: "/about/strategic-plan" },
            { label: "Our History", href: "/about/history" },
            { label: "University Leadership", href: "/about/leadership" },
          ]}
        />
        {content.updated && <p className="page-updated">{content.updated}</p>}
      </div>
    </>
  );
}
