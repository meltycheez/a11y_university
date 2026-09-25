import { useEffect, useRef, useState } from "react";
import { Form, Link, useLoaderData } from "react-router";
import { ScenarioTitle } from "~/a11y/DocumentScenarios";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { ButtonLink } from "~/components/Button";
import { Card, CardGrid } from "~/components/Card";
import { Img } from "~/components/Img";
import { StatsBand, VideoEmbed } from "~/components/blocks";
import { brand } from "~/data/brand";
import { eventsContent } from "~/data/content/events";
import { newsContent } from "~/data/content/news";
import imageSizes from "~/data/image-sizes.json";
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
      <AnnouncementTicker />
      <HeroCarousel />

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

// ---------- Plan 06 #11: hero carousel and announcement ticker (styles/features/carousel.css) ----------
// The first render shows slide 1 and an untouched ticker; timers start in effects only, so the prerendered HTML
// equals the first client render.

const altOf = (id: string) => (imageSizes as Record<string, { alt: string }>)[id]?.alt ?? "";
const ROTATE_MS = 6000;

interface Slide { image: string; kicker: string; title: string; lede: string; actions: { label: string; to: string }[] }
const slides: Slide[] = [
  {
    image: "home-hero-quad", kicker: brand.name, title: "Deep roots. Wide branches.",
    lede: "A public research university on California's redwood coast, where 18,000 students learn, discover, and grow.",
    actions: [{ label: "Apply to Redwood State", to: "/admissions" }, { label: "Plan a visit", to: "/admissions/visit" }],
  },
  {
    image: "home-slide-research", kicker: "Research", title: "A 1,200-acre forest for a laboratory",
    lede: "Students and faculty study carbon, water and wildlife in the Tanoak Creek Research Forest, part of $38.9 million in external research funding last year.",
    actions: [{ label: "Explore academics", to: "/academics" }],
  },
  {
    image: "home-slide-arts", kicker: "Arts", title: "On stage this fall",
    lede: "Concerts, exhibitions and student productions fill the calendar at Hartwell Fine Arts Center and across campus.",
    actions: [{ label: "See upcoming events", to: "/events" }],
  },
  {
    image: "home-slide-forest", kicker: "Learning outdoors", title: "Class meets under the canopy",
    lede: "Field courses take students from Canopy Green into the research forest and down to the tide pools at Gull Rock Point.",
    actions: [{ label: "Browse programs", to: "/academics/programs" }],
  },
  {
    image: "home-slide-commencement", kicker: "Admissions", title: "Apply by December 1",
    lede: "The priority application deadline for fall 2027 is December 1, 2026. First-year and transfer applicants are welcome.",
    actions: [{ label: "Start your application", to: "/admissions/apply" }],
  },
];

/**
 * home-carousel-pause-001 (no pause, ignores reduced motion), home-carousel-controls-kbd-001 (span controls) and
 * home-carousel-focus-001 (focus follows every slide change). Slide 1 keeps home-hero-img-alt-001.
 */
function HeroCarousel() {
  const pauseFixed = useScenario("home-carousel-pause-001");
  const kbdFixed = useScenario("home-carousel-controls-kbd-001");
  const focusFixed = useScenario("home-carousel-focus-001");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);
  const [reduced, setReduced] = useState(false);
  const slideEls = useRef<(HTMLDivElement | null)[]>([]);
  const changed = useRef(false);
  const n = slides.length;

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  // Fixed: never auto-rotate under reduced motion (the visitor can still press Play).
  useEffect(() => { if (pauseFixed && reduced) setPlaying(false); }, [pauseFixed, reduced]);

  const rotating = pauseFixed ? playing && !hold : true;
  useEffect(() => {
    if (!rotating) return;
    const t = setInterval(() => { changed.current = true; setIndex((i) => (i + 1) % n); }, ROTATE_MS);
    return () => clearInterval(t);
  }, [rotating, n]);

  // Defective: every slide change focuses the new slide (except while the tester is in the a11y control).
  useEffect(() => {
    if (!changed.current) return;
    changed.current = false;
    if (focusFixed || document.activeElement?.closest(".a11y-control")) return;
    slideEls.current[index]?.focus({ preventScroll: true });
  }, [index, focusFixed]);

  const go = (i: number) => { changed.current = true; setIndex((i + n) % n); };
  const control = (label: string, className: string, onClick: () => void, children: React.ReactNode, current?: boolean, key?: string) =>
    kbdFixed
      ? <button key={key} type="button" className={className} aria-label={label} aria-current={current ? "true" : undefined} onClick={onClick}>{children}</button>
      : <span key={key} className={className} onClick={onClick}>{children}</span>;
  const holdProps = pauseFixed ? {
    onMouseEnter: () => setHold(true),
    onMouseLeave: () => setHold(false),
    onFocus: () => setHold(true),
    onBlur: (e: React.FocusEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold(false); },
  } : {};

  return (
    <section
      className="home-carousel"
      aria-roledescription="carousel"
      aria-label="Featured stories"
      data-a11y-scenario="home-carousel-pause-001 home-carousel-controls-kbd-001 home-carousel-focus-001"
      {...holdProps}
    >
      <div className="home-carousel-slides" aria-live={pauseFixed && !rotating ? "polite" : "off"}>
        {slides.map((s, i) => {
          const H = i === 0 ? "h1" : "h2";
          return (
            <div
              key={s.image}
              ref={(el) => { slideEls.current[i] = el; }}
              className={`hero hero--overlay hero--has-image home-slide${i === index ? " is-active" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              inert={i !== index}
              tabIndex={focusFixed ? undefined : -1}
            >
              <div className="hero-media">
                {i === 0
                  ? <Img image={s.image} scenario="home-hero-img-alt-001" loading="eager" fetchPriority="high" />
                  : <Img image={s.image} alt={altOf(s.image)} />}
              </div>
              <div className="hero-body">
                <p className="hero-kicker">{s.kicker}</p>
                <H id={i === 0 ? "page-title" : undefined}>{s.title}</H>
                <p className="hero-lede">{s.lede}</p>
                <div className="hero-actions">
                  {s.actions.map((a, j) => <ButtonLink key={a.to} to={a.to} variant={j ? "secondary" : "primary"}>{a.label}</ButtonLink>)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="carousel-controls">
        {pauseFixed && (
          <button type="button" className="carousel-btn carousel-pause" onClick={() => setPlaying(!playing)}>
            <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span> {playing ? "Pause" : "Play"}<span className="visually-hidden"> slideshow</span>
          </button>
        )}
        {control("Previous slide", "carousel-btn carousel-arrow", () => go(index - 1), <span aria-hidden="true">‹</span>)}
        <span className="carousel-dots">
          {slides.map((s, i) => control(`Slide ${i + 1} of ${n}: ${s.title}`, `carousel-dot${i === index ? " is-active" : ""}`, () => go(i), null, i === index, s.image))}
        </span>
        {control("Next slide", "carousel-btn carousel-arrow", () => go(index + 1), <span aria-hidden="true">›</span>)}
      </div>
    </section>
  );
}

const announcements = [
  { text: "Spring 2027 registration opens November 2 by time ticket.", to: "/students/registrar" },
  { text: "Homecoming & Family Weekend is October 23–25.", to: "/events/homecoming-2026" },
  { text: "Fall 2027 priority application deadline: December 1, 2026.", to: "/admissions/apply" },
  { text: "Owls basketball opens at home against Cascade State on November 6.", to: "/events/basketball-home-opener" },
  { text: "Madrone Hall and the Robotics and Autonomous Systems Lab opened in August.", to: "/news" },
];

/** home-ticker-motion-001: an endless CSS marquee. Fixed: Pause button, pauses on hover/focus, static under reduced motion. */
function AnnouncementTicker() {
  const fixed = useScenario("home-ticker-motion-001");
  const [paused, setPaused] = useState(false);
  const items = announcements.map((a) => <li key={a.to}><Link to={a.to}>{a.text}</Link></li>);
  return (
    <section className={`home-ticker${fixed && paused ? " is-paused" : ""}`} aria-label="Campus announcements" data-a11y-scenario="home-ticker-motion-001">
      <p className="home-ticker-label">Announcements</p>
      <div className="home-ticker-window">
        <div className="ticker-track">
          <ul>{items}</ul>
          <ul className="ticker-dup" aria-hidden="true" inert>{items}</ul>
        </div>
      </div>
      {fixed && (
        <button type="button" className="ticker-pause" onClick={() => setPaused(!paused)}>
          {paused ? "Play" : "Pause"}<span className="visually-hidden"> announcements</span>
        </button>
      )}
    </section>
  );
}
