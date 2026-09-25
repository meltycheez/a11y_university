import { useScenario } from "~/a11y/useScenario";
import { ButtonLink } from "~/components/Button";
import { DataTable } from "~/components/DataTable";
import { Hero } from "~/components/Hero";
import { Quote, StatsBand } from "~/components/blocks";
import { Copy, copyFor, stringColumns } from "./_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/about");
const [intro, glance, place, learn] = content.sections;

export default function AboutPage() {
  useScenario("about-overview-stat-contrast-001"); // CSS scenario (flagship.css)
  const facts = glance.table!;
  const fact = (label: string) => facts.rows.find((r) => r[0] === label)?.[1] ?? "";

  return (
    <>
      <Hero title="About Redwood State" kicker="Redwood State University" lede={content.summary} image="about-hero-campus">
        <ButtonLink to="/admissions/visit">Visit campus</ButtonLink>
        <ButtonLink to="/campus-map" variant="secondary">Campus map</ButtonLink>
      </Hero>

      <div className="page-content about-overview">
        <Copy section={intro} />

        <div data-a11y-scenario="about-overview-stat-contrast-001" className="about-stats">
          <StatsBand
            label="Redwood State by the numbers"
            stats={[
              { value: fact("Total enrollment"), label: "students enrolled, fall 2026" },
              { value: fact("First-generation college students"), label: "first-generation students" },
              { value: fact("Student-to-faculty ratio"), label: "student-to-faculty ratio" },
              { value: "112,000+", label: "living alumni" },
            ]}
          />
        </div>

        <section className="stack" aria-labelledby="glance-heading">
          <h2 id="glance-heading">{glance.heading}</h2>
          <DataTable caption={facts.caption!} columns={stringColumns(facts.columns)} rows={facts.rows} rowHeader="0" />
        </section>

        <Copy section={place} />

        <Quote
          text="A redwood's roots are shallow, but they reach out and interlock with their neighbors. That is how a grove survives a storm, and it is how a university serves a region."
          name="Elena Vásquez-Hart"
          role="President"
          image="leader-elena-vasquez-hart"
        />

        <Copy
          section={learn}
          className="about-learn"
          links={{ "Read more": { scenario: "about-overview-readmore-001", text: "Redwood State news" } }}
        />
        {content.updated && <p className="page-updated">{content.updated}</p>}
      </div>
    </>
  );
}
