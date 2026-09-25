import { Form, Link, useLoaderData } from "react-router";
import { ScenarioTitle } from "~/a11y/DocumentScenarios";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { ButtonLink } from "~/components/Button";
import { Card, CardGrid } from "~/components/Card";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import { StatsBand, VideoEmbed } from "~/components/blocks";
import { brand } from "~/data/brand";
import { eventsContent } from "~/data/content/events";
import { newsContent } from "~/data/content/news";
import { megaMenu } from "~/data/navigation";
import { SITE_NOW, formatDate } from "~/data/site";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// News and event copy is large; the loader runs at prerender time so only the teasers reach the page.
export async function loader() {
  return {
    news: Object.values(newsContent)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 3)
      .map(({ slug, title, dek, date, image }) => ({ slug, title, dek, date, image })),
    events: Object.values(eventsContent)
      .filter((e) => e.start.slice(0, 10) >= SITE_NOW)
      .sort((a, b) => a.start.localeCompare(b.start))
      .slice(0, 4)
      .map(({ slug, title, start, location }) => ({ slug, title, start, location })),
  };
}

// Title comes from ScenarioTitle (home-page-title-001), not meta().
export default function HomePage() {
  const { news, events } = useLoaderData<typeof loader>();
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
      >
        <ButtonLink to="/admissions">Apply to Redwood State</ButtonLink>
        <ButtonLink to="/admissions/visit" variant="secondary">Plan a visit</ButtonLink>
      </Hero>

      <div className="page-content">
        <AudiencePaths />

        <section aria-labelledby="welcome-heading" className="stack">
          <h2 id="welcome-heading">Welcome to Redwood State</h2>
          <p className="home-intro" data-a11y-scenario="home-intro-justified-001">
            Since {brand.founded}, Redwood State has grown from a small teachers college into a comprehensive public university
            with six colleges, more than 90 undergraduate and graduate programs, and a research forest that doubles as an outdoor classroom.
            Whether you are planning a first visit, returning to finish a degree, or looking for a lab to join, you will find
            a place here among the redwoods.
          </p>
        </section>

        <ProgramFinder />

        <div className="home-columns">
          <HomeNews items={news} />
          <HomeEvents items={events} />
        </div>

        <StatsBand
          label="Redwood State at a glance"
          stats={[
            { value: "17,940", label: "students enrolled, fall 2026" },
            { value: "46%", label: "first-generation college students" },
            { value: "19:1", label: "student-to-faculty ratio" },
            { value: "1,200", label: "acres in the Tanoak Creek Research Forest" },
            { value: "14", label: "Redwood Owls varsity teams" },
          ]}
        />

        <section aria-labelledby="tour-heading" className="stack home-tour">
          <h2 id="tour-heading">Take the campus tour</h2>
          <p>Walk Canopy Green, step inside Sequoia Engineering Hall, and head down to the tide pools at Gull Rock Point with student tour guides.</p>
          <VideoEmbed title="Redwood State campus tour" caption="Student guides lead a four-minute tour of the Arcadia Falls campus." titleScenario="home-tour-iframe-title-001" />
        </section>

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

const audiences = [
  { label: "Future students", text: "Admissions, visits and costs", href: "/admissions" },
  { label: "Current students", text: "Services, advising and support", href: "/students" },
  { label: "Parents & families", text: "Helping your student thrive", href: "/parents" },
  { label: "Alumni", text: "Stay connected to the Owls", href: "/alumni" },
  { label: "Visitors", text: "Directions, parking and events", href: "/visitors" },
  { label: "Faculty & staff", text: "Resources for employees", href: "/faculty-staff" },
];

/** home-audience-aria-ref-001 (aria-labelledby typo) and home-audience-contrast-001 (CSS). */
function AudiencePaths() {
  const fixed = useScenario("home-audience-aria-ref-001");
  useScenario("home-audience-contrast-001");
  return (
    <nav className="home-audiences" aria-labelledby={fixed ? "audience-heading" : "audiences-heading"} data-a11y-scenario="home-audience-aria-ref-001 home-audience-contrast-001">
      <h2 id="audience-heading" className="visually-hidden">Find your path</h2>
      <ul>
        {audiences.map((a) => (
          <li key={a.href}>
            <Link to={a.href}><span className="home-audience-label">{a.label}</span><span className="home-audience-text">{a.text}</span></Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function HomeNews({ items }: { items: { slug: string; title: string; dek: string; date: string; image: string }[] }) {
  const unlinked = useScenario("home-news-link-redundant-001");
  return (
    <section aria-labelledby="home-news-heading" className="stack home-news" data-a11y-scenario="home-news-link-redundant-001">
      <div className="home-section-head">
        <h2 id="home-news-heading">News</h2>
        <Link to="/news">All news</Link>
      </div>
      {items.map((n) => {
        const href = `/news/${n.slug}`;
        const photo = <Img image={n.image} alt={unlinked ? "" : n.title} sizes="(min-width: 60rem) 14rem, 40vw" aspect="4 / 3" />;
        return (
          <article key={n.slug} className="home-news-item">
            {unlinked ? <div className="home-news-photo">{photo}</div> : <Link to={href} className="home-news-photo">{photo}</Link>}
            <div>
              <p className="home-news-date">{formatDate(n.date)}</p>
              <h3><Link to={href}>{n.title}</Link></h3>
              <p>{n.dek}</p>
              <SmartLink scenario="home-news-readmore-001" to={href} defect="Read more">Read the story: {n.title}</SmartLink>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function HomeEvents({ items }: { items: { slug: string; title: string; start: string; location: string }[] }) {
  const listFixed = useScenario("home-events-list-001");
  const rows = items.map((e) => {
    const [, m, d] = e.start.slice(0, 10).split("-").map(Number);
    return (
      <li key={e.slug} className="home-event">
        <span className="home-event-date"><span>{MON[m - 1]}</span> <span>{d}</span></span>
        <span>
          <Link to={`/events/${e.slug}`}>{e.title}</Link>
          <span className="home-event-where">{e.location}</span>
        </span>
      </li>
    );
  });
  return (
    <section aria-labelledby="home-events-heading" className="stack home-events">
      <div className="home-section-head">
        <h2 id="home-events-heading">Events</h2>
        <SmartLink scenario="home-events-calendar-window-001" to="/events" newWindow>Full calendar</SmartLink>
      </div>
      <div data-a11y-scenario="home-events-list-001">
        {listFixed ? <ul className="home-event-list">{rows}</ul> : <div className="home-event-list">{rows}</div>}
      </div>
    </section>
  );
}
