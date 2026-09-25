import { Heading } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import { StatsBand } from "~/components/blocks";
import { Copy, copyFor } from "./_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/about/history");
const [intro, timeline, presidents, archives] = content.sections;

// Marker kinds for the timeline (defect: shown by color only).
const renamed = new Set(["1921", "1961", "1972"]);
const built = new Set(["1914", "1968", "1994", "2003", "2016", "2026"]);
const kindOf = (year: string, text: string) =>
  renamed.has(year) ? "name" : built.has(year) || /opens|completed/.test(text) ? "building" : "event";
const kindLabel = { name: "Name change", building: "New building", event: "Milestone" } as const;

const photos = [
  { image: "campus-library-interior", caption: "Sequoia Library, which opened on Canopy Green in 1968." },
  { image: "campus-research-forest", caption: "Tanoak Creek Research Forest, donated to the university in 1978." },
  { image: "campus-housing-madrone", caption: "Madrone Hall, the newest residence hall, opened in 2026." },
];

export default function HistoryPage() {
  const listFixed = useScenario("about-history-timeline-list-001");
  const colorFixed = useScenario("about-history-marker-color-001");
  useScenario("about-history-timeline-reflow-001"); // CSS scenario (flagship.css)

  const items = timeline.table!.rows.map(([year, text]) => {
    const kind = kindOf(year, text);
    return (
      <li key={year} className={`timeline-item timeline-item--${kind}`}>
        <span className="timeline-marker" aria-hidden="true" />
        <Heading scenario="about-history-year-heading-001" level={3} defect="skipped" defectLevel={4} className="timeline-year">{year}</Heading>
        <p>
          {colorFixed && kind !== "event" && <span className="timeline-kind">{kindLabel[kind]}: </span>}
          {text}
        </p>
      </li>
    );
  });

  return (
    <>
      <Hero title="Our History" kicker="About Redwood State" lede={content.summary} image="about-hero-campus" variant="split" />
      <div className="page-content">
        <Copy section={intro} />

        <StatsBand
          label="Redwood State history in numbers"
          stats={[
            { value: "1911", label: "founded as Arcadia Falls Normal School" },
            { value: "34", label: "students in the first class" },
            { value: "13", label: "presidents" },
            { value: "17,940", label: "students in fall 2026" },
          ]}
        />

        <section aria-labelledby="timeline-heading" className="stack">
          <h2 id="timeline-heading">{timeline.heading}</h2>
          <p className="timeline-legend" data-a11y-scenario="about-history-marker-color-001">
            {colorFixed
              ? "Milestones are labeled when the institution changed its name or opened a major building."
              : "Gold markers show a change of name; green markers show a new building."}
          </p>
          <div className="history-timeline" data-a11y-scenario="about-history-timeline-reflow-001 about-history-timeline-list-001">
            {listFixed ? <ol className="timeline">{items}</ol> : <div className="timeline">{items}</div>}
          </div>
        </section>

        <section aria-labelledby="archive-photos-heading" className="stack">
          <h2 id="archive-photos-heading">Campus through the years</h2>
          <div className="history-photos">
            {photos.map((p) => (
              <figure key={p.image}>
                <Img image={p.image} alt={p.caption} scenario="about-history-photo-alt-001" sizes="(min-width: 60rem) 30vw, 100vw" aspect="4 / 3" />
                <figcaption>{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <Copy section={presidents} />
        <Copy
          section={archives}
          links={{ "Click here": { scenario: "about-history-clickhere-001", text: "Visit Sequoia Library" } }}
        />
        {content.updated && <p className="page-updated">{content.updated}</p>}
      </div>
    </>
  );
}
