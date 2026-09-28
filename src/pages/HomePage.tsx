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

        <KeyDatesTable />

        <section aria-labelledby="tour-heading" className="stack home-tour">
          <h2 id="tour-heading">Take the campus tour</h2>
          <p>Walk Canopy Green, step inside Sequoia Engineering Hall, and head down to the tide pools at Gull Rock Point with student tour guides.</p>
          <VideoEmbed title="Redwood State campus tour" caption="Student guides lead a four-minute tour of the Arcadia Falls campus." titleScenario="home-tour-iframe-title-001" />
          <TourShareButton />
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

        <NewsletterSignup />
      </div>
    </>
  );
}

/** Scenario home-tour-share-svg-001: an icon-only share button next to the tour video. */
function TourShareButton() {
  const named = useScenario("home-tour-share-svg-001");
  return (
    <button type="button" className="tour-share-btn" aria-label={named ? "Share this video" : undefined} data-a11y-scenario="home-tour-share-svg-001">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" focusable="false" aria-hidden={named ? true : undefined}>
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <path d="M8.6 10.6 15.4 6.4M8.6 13.4 15.4 17.6" />
      </svg>
    </button>
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
              {/* Once unlinked, "Read the story" below is the only link to href, so the title stays plain text
                  rather than forming a second redundant link to the same place. */}
              <h3>{unlinked ? n.title : <Link to={href}>{n.title}</Link>}</h3>
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

// ---------- Key dates table (styles/sections/home.css) ----------
const WARNING_ICON =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23b3541e" stroke-width="2"><path d="M12 3 2 20h20Z"/><path d="M12 10v4M12 17.5v.01"/></svg>',
  );

const KEY_DATES: { date: string; event: string; category: "academic" | "financial"; urgent?: boolean }[] = [
  { date: "Dec 1, 2026", event: "Fall 2027 Priority Application Deadline", category: "academic", urgent: true },
  { date: "Jan 12, 2027", event: "Spring Semester Begins", category: "academic" },
  { date: "Mar 2, 2027", event: "FAFSA Priority Deadline", category: "financial" },
  { date: "Mar 23, 2027", event: "Spring Break Begins", category: "academic" },
  { date: "May 15, 2027", event: "Commencement", category: "academic" },
];
const DATE_FILTERS = ["All", "Academic", "Financial"] as const;

/**
 * Four scenarios share this table: home-dates-table-headers-001 (header row is <td>, not <th>),
 * home-dates-table-region-typo-001 (aria-labeledby typo on the wrapping region), home-dates-table-sort-value-001
 * (invalid aria-sort value on the Date header) and home-dates-table-action-dupid-001 (every row's "Details"
 * button shares one hardcoded id, so aria-labelledby resolves to the same row for all of them). Plus
 * home-dates-table-filter-tab-001 (the filter pills use role="tab" with no role="tablist" parent) and
 * home-dates-table-urgent-icon-001 (the "act soon" icon on the nearest deadline has alt="").
 */
function KeyDatesTable() {
  const headersFixed = useScenario("home-dates-table-headers-001");
  const regionFixed = useScenario("home-dates-table-region-typo-001");
  const sortFixed = useScenario("home-dates-table-sort-value-001");
  const idsFixed = useScenario("home-dates-table-action-dupid-001");
  const tablistFixed = useScenario("home-dates-table-filter-tab-001");
  const iconFixed = useScenario("home-dates-table-urgent-icon-001");
  const [filter, setFilter] = useState<(typeof DATE_FILTERS)[number]>("All");
  const rows = KEY_DATES.filter((d) => filter === "All" || d.category === filter.toLowerCase());

  const HeadCell = headersFixed ? "th" : "td";
  const regionProps = regionFixed ? { "aria-labelledby": "key-dates-heading" } : { "aria-labeledby": "key-dates-heading" };

  return (
    <section {...regionProps} className="stack" data-a11y-scenario="home-dates-table-region-typo-001">
      <h2 id="key-dates-heading">Key Dates This Term</h2>
      <div
        className="dates-filter"
        role={tablistFixed ? "tablist" : undefined}
        aria-label="Filter key dates"
        data-a11y-scenario="home-dates-table-filter-tab-001"
      >
        {DATE_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={`dates-filter-pill${filter === f ? " is-active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <caption>Upcoming academic and financial deadlines</caption>
          <thead>
            <tr>
              <HeadCell scope={headersFixed ? "col" : undefined} aria-sort={sortFixed ? "ascending" : ("asc" as "ascending")} data-a11y-scenario="home-dates-table-headers-001 home-dates-table-sort-value-001">Date</HeadCell>
              <HeadCell scope={headersFixed ? "col" : undefined} data-a11y-scenario="home-dates-table-headers-001">Event</HeadCell>
              <HeadCell scope={headersFixed ? "col" : undefined} data-a11y-scenario="home-dates-table-headers-001">Details</HeadCell>
            </tr>
          </thead>
          <tbody>
            {rows.map((d, i) => (
              <tr key={d.event}>
                <td>
                  {d.urgent && (
                    <img
                      src={WARNING_ICON}
                      width="16"
                      height="16"
                      alt={iconFixed ? "Deadline is approaching" : ""}
                      className="dates-urgent-icon"
                      data-a11y-scenario="home-dates-table-urgent-icon-001"
                    />
                  )}
                  {" "}{d.date}
                </td>
                <td>{d.event}</td>
                <td>
                  <button
                    type="button"
                    className="dates-detail-btn"
                    aria-labelledby={idsFixed ? `dates-row-detail-${i}` : "dates-row-detail"}
                    data-a11y-scenario="home-dates-table-action-dupid-001"
                  >
                    <span aria-hidden="true">ⓘ</span>
                  </button>
                  <span id={idsFixed ? `dates-row-detail-${i}` : "dates-row-detail"} className="visually-hidden">
                    Details for {d.event}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/**
 * home-newsletter-heading-empty-001 (heading rendered empty, replaced by a background-image wordmark),
 * home-newsletter-label-mismatch-001 (the visible "Email address" label points at the wrong input),
 * home-newsletter-frequency-select-001 (the frequency <select> has no associated label) and
 * home-newsletter-subscribe-image-001 (the submit control is an <input type="image"> with no alt).
 */
function NewsletterSignup() {
  const headingFixed = useScenario("home-newsletter-heading-empty-001");
  const labelFixed = useScenario("home-newsletter-label-mismatch-001");
  const selectFixed = useScenario("home-newsletter-frequency-select-001");
  const submitFixed = useScenario("home-newsletter-subscribe-image-001");

  return (
    <section aria-labelledby={headingFixed ? "newsletter-heading" : undefined} className="stack newsletter-box">
      {headingFixed
        ? <h2 id="newsletter-heading">Stay Connected</h2>
        : <h2 className="newsletter-heading-image" data-a11y-scenario="home-newsletter-heading-empty-001" />}
      <p>Get campus news and event reminders by email.</p>
      <Form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
        <div className="newsletter-field" data-a11y-scenario="home-newsletter-label-mismatch-001">
          <label htmlFor={labelFixed ? "newsletter-email" : "newsletter-hp"}>Email address</label>
          <input id="newsletter-email" name="email" type="email" autoComplete="email" />
          {!labelFixed && <input id="newsletter-hp" type="text" className="visually-hidden" tabIndex={-1} aria-hidden="true" />}
        </div>
        <div className="newsletter-field" data-a11y-scenario="home-newsletter-frequency-select-001">
          {selectFixed && <label htmlFor="newsletter-frequency">How often?</label>}
          {!selectFixed && <span className="newsletter-frequency-caption">How often?</span>}
          <select id={selectFixed ? "newsletter-frequency" : undefined} name="frequency" defaultValue="weekly">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        {submitFixed ? (
          <button type="submit" className="btn btn--primary">Subscribe</button>
        ) : (
          <input type="image" src={SUBSCRIBE_ICON} width="120" height="36" alt="" className="newsletter-submit-img" data-a11y-scenario="home-newsletter-subscribe-image-001" />
        )}
      </Form>
    </section>
  );
}

const SUBSCRIBE_ICON =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 36"><rect width="120" height="36" rx="6" fill="%237a2e1f"/><text x="60" y="23" font-family="sans-serif" font-size="14" fill="%23fff" text-anchor="middle">Subscribe</text></svg>',
  );

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
  const ctaVisibleToAT = useScenario("home-hero-cta-hidden-001");
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
                  {s.actions.map((a, j) => {
                    const link = <ButtonLink to={a.to} variant={j ? "secondary" : "primary"}>{a.label}</ButtonLink>;
                    // Scenario home-hero-cta-hidden-001: slide 1's secondary action is hidden from the
                    // accessibility tree while it stays fully visible and clickable.
                    return i === 0 && j === 1 ? (
                      <span key={a.to} aria-hidden={ctaVisibleToAT ? undefined : "true"} data-a11y-scenario="home-hero-cta-hidden-001">{link}</span>
                    ) : <span key={a.to}>{link}</span>;
                  })}
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
