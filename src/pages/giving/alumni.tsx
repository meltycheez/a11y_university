import { useState } from "react";
import { Heading, IconButton } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import { AnyLink, CtaBand, Quote } from "~/components/blocks";
import { copyFor } from "../about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/giving/alumni");
const [main] = content.sections;
// "Class of 2016 (10th reunion): goal $50,000 for the Class of 2016 Scholarship" -> name, goal, supports
const challenges = main.list!.map((item) => {
  const [name, rest] = item.split(/: (?:goal )?/);
  const [goal, supports] = rest.split(" for ");
  return { name, goal, supports: supports ?? "" };
});

export default function GivingAlumniPage() {
  const captionFixed = useScenario("giving-alumni-table-caption-001");
  const titleFixed = useScenario("giving-alumni-photo-title-001");
  const [copied, setCopied] = useState(false);

  return (
    <>
      <Hero title="Alumni Giving" kicker="Redwood State Foundation" lede={content.summary} variant="banner" />
      <div className="page-content">
        <figure className="giving-photo">
          <Img
            image="alumni-hero-reunion"
            alt="Alumni of several generations laugh together at a reunion under a white tent"
            title={titleFixed ? undefined : "Homecoming_2025_reunion_tent"}
            data-a11y-scenario="giving-alumni-photo-title-001"
            sizes="(min-width: 60rem) 60rem, 100vw"
          />
          <figcaption>Reunion classes gather under the tent on Canopy Green at Homecoming 2025.</figcaption>
        </figure>
        <p className="lede-paragraph">{main.paragraphs![0]}</p>

        <section className="stack">
          <Heading scenario="giving-alumni-challenges-heading-001" level={2} defect="fake">Class gift challenges</Heading>
          <div className="table-wrap" data-a11y-scenario="giving-alumni-table-caption-001">
            {!captionFixed && <p className="table-title"><strong>2026 Homecoming challenges</strong></p>}
            <table className="data-table">
              {captionFixed && <caption>2026 Homecoming challenges</caption>}
              <thead><tr><th scope="col">Challenge</th><th scope="col">Goal</th><th scope="col">Supports</th></tr></thead>
              <tbody>
                {challenges.map((c) => (
                  <tr key={c.name}><th scope="row">{c.name}</th><td>{c.goal}</td><td>{c.supports}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="share-row">
            Share the challenge with your classmates
            <IconButton
              scenario="giving-alumni-share-empty-001"
              label="Copy link to this page"
              icon="🔗"
              className="share-button"
              onClick={() => { void navigator.clipboard?.writeText(window.location.href).catch(() => {}); setCopied(true); }}
            />
            <span className="share-copied" role="status">{copied ? "Link copied" : ""}</span>
          </p>
        </section>

        <Quote text="Every gift counts, even the five-dollar ones. That is how a small class chases the Golden Owl." name="Class of 2001 reunion committee" />

        <ul className="link-list">
          {main.links!.map((l) => <li key={l.href}><AnyLink href={l.href}>{l.label}</AnyLink></li>)}
        </ul>

        <CtaBand title="Make your class gift" text="Gifts from graduates of the last decade are matched through the Young Alumni Challenge." action={{ label: "Make a gift", href: "/giving/donate" }} />
      </div>
    </>
  );
}
