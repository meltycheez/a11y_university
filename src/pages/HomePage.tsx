import { Form } from "react-router";
import { ScenarioTitle } from "~/a11y/DocumentScenarios";
import { useScenario } from "~/a11y/useScenario";
import { ButtonLink } from "~/components/Button";
import { Card, CardGrid } from "~/components/Card";
import { Hero } from "~/components/Hero";
import { brand } from "~/data/brand";
import { megaMenu } from "~/data/navigation";

// Title comes from ScenarioTitle (home-page-title-001), not meta().
export default function HomePage() {
  const headingFixed = useScenario("home-card-heading-skip-001");
  // CSS scenarios: the defect lives in components.css, the fix in styles/fixes/*.css. Register only.
  useScenario("home-intro-justified-001");
  useScenario("home-card-meta-contrast-001");
  useScenario("home-card-focus-001");

  return (
    <>
      <ScenarioTitle scenario="home-page-title-001" title={brand.name} />
      <Hero
        title="Deep roots. Wide branches."
        kicker={brand.name}
        lede="A public research university on California's redwood coast, where 18,000 students learn, discover, and grow."
        image="home-hero-quad"
        imageScenario="home-hero-img-alt-001"
        imageFixedAlt="Students walking and talking on the main quad beneath tall redwood trees"
      >
        <ButtonLink to="/admissions">Apply to Redwood State</ButtonLink>
        <ButtonLink to="/admissions/visit" variant="secondary">Plan a visit</ButtonLink>
      </Hero>

      <div className="page-content">
        <section aria-labelledby="welcome-heading" className="stack">
          <h2 id="welcome-heading">Welcome to Redwood State</h2>
          <p className="home-intro" data-a11y-scenario="home-intro-justified-001">
            Since {brand.founded}, Redwood State has grown from a small teachers college into a comprehensive public university
            with nine colleges, more than 140 degree programs, and a research forest that doubles as an outdoor classroom.
            Whether you are planning a first visit, returning to finish a degree, or looking for a lab to join, you will find
            a place here among the redwoods.
          </p>
        </section>

        <ProgramFinder />

        <section
          aria-labelledby="explore-heading"
          className="stack home-explore"
          data-a11y-scenario="home-card-meta-contrast-001 home-card-focus-001 home-card-heading-skip-001"
        >
          <h2 id="explore-heading">Explore Redwood State</h2>
          <CardGrid>
            {megaMenu.map((s, i) => (
              <Card
                key={s.id}
                title={s.feature.title}
                href={s.feature.href}
                text={s.feature.text}
                image={s.feature.image}
                imageAlt={`IMG_${2041 + i * 7}.jpg`}
                imageScenario="home-card-img-alt-suspicious-001"
                imageFixedAlt=""
                meta={s.label}
                headingLevel={headingFixed ? 3 : 4}
              />
            ))}
          </CardGrid>
        </section>
      </div>
    </>
  );
}

/** Scenario home-program-finder-label-001: the visible prompt is a <p>, not a <label>. */
function ProgramFinder() {
  const fixed = useScenario("home-program-finder-label-001");
  return (
    <Form action="/academics/programs" method="get" className="program-finder" data-a11y-scenario="home-program-finder-label-001">
      {fixed
        ? <label htmlFor="program-finder-q" className="program-finder-prompt">Find your program</label>
        : <p className="program-finder-prompt">Find your program</p>}
      <div className="program-finder-row">
        <input id="program-finder-q" name="q" type="search" autoComplete="off" />
        <button type="submit" className="btn btn--primary">Search programs</button>
      </div>
    </Form>
  );
}
