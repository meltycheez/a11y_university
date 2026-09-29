// The homepage: a clean, modern university front door (full-bleed hero, program finder, quick-action tiles,
// stats, stories, a key-dates table, a campus map teaser and a visit band) that works perfectly for sighted
// mouse users and is a nightmare for screen reader users. Every defect is a registered scenario
// (src/a11y/registry/home.ts) and Fix All clears them all; `npm run wave -- /` checks both with the real WAVE.
// CSS: styles/sections/home.css.
import { createElement, useEffect, useRef, useState } from "react";
import { Form, Link } from "react-router";
import { ScenarioTitle } from "~/a11y/DocumentScenarios";
import { Heading, IconButton, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Img } from "~/components/Img";
import { brand } from "~/data/brand";
import { MAP_H, MAP_W, buildings } from "./_campus-map-data";

const base = import.meta.env.BASE_URL;
const svg = (s: string) => `data:image/svg+xml,${encodeURIComponent(s)}`;
const ARROW = <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

export default function HomePage() {
  return (
    <div className="home">
      <ScenarioTitle scenario="home-page-title-001" title={brand.name} />
      <SkipToDates />
      <HomeHero />
      <ProgramFinder />
      <QuickTiles />
      <ByTheNumbers />
      <Stories />
      <KeyDates />
      <CampusMapTeaser />
      <VisitBand />
      <Tracking />
    </div>
  );
}

function SkipToDates() {
  const fixed = useScenario("home-skip-dates-001");
  return <a className="skip-link" href={fixed ? "#key-dates-heading" : "#key-dates"} data-a11y-scenario="home-skip-dates-001">Skip to key dates</a>;
}

// ---------- Hero ----------

function HomeHero() {
  useScenario("home-hero-contrast-001"); // CSS: the fix gives .home-hero a background color
  useScenario("home-hero-lede-justified-001"); // CSS
  const h1Fixed = useScenario("home-hero-h1-001");
  const tabFixed = useScenario("home-hero-cta-tabindex-001");
  const Title = h1Fixed ? "h1" : "p";
  return (
    <section className="home-hero home-bleed" aria-labelledby="home-hero-title" data-a11y-scenario="home-hero-contrast-001">
      <Img image="home-hero-quad" scenario="home-hero-img-alt-001" className="home-hero-img" sizes="100vw" loading="eager" fetchPriority="high" />
      <div className="container home-hero-inner">
        <p className="home-kicker">Redwood State University · Arcadia Falls, California</p>
        <Title id="home-hero-title" className="home-hero-title" data-a11y-scenario="home-hero-h1-001">
          <span className="home-hero-line">Deep roots.</span> <span className="home-hero-line">Wide branches.</span>
        </Title>
        <p className="home-hero-lede" data-a11y-scenario="home-hero-lede-justified-001">
          A public research university on California&rsquo;s redwood coast, where 18,000 students learn in the forest, on the shore and in the lab.
        </p>
        <div className="home-hero-actions">
          <Link to="/admissions" className="btn btn--primary home-btn" tabIndex={tabFixed ? undefined : 1} data-a11y-scenario="home-hero-cta-tabindex-001">Apply to Redwood State</Link>
          <Link to="/admissions/visit" className="btn home-btn home-btn--ghost">Plan a visit</Link>
        </div>
      </div>
    </section>
  );
}

// ---------- Program finder ----------

const GO_ICON = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#7a2e1f"/><path d="M15 24h17M25 16l8 8-8 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
const LEVELS = ["Undergraduate", "Graduate", "Certificate"];
const POPULAR = [
  { label: "Nursing", q: "nursing" }, { label: "Computer Science", q: "computer science" },
  { label: "Environmental Studies", q: "environmental" }, { label: "Business", q: "business" },
];

function ProgramFinder() {
  const labelFixed = useScenario("home-finder-search-label-001");
  const hintFixed = useScenario("home-finder-hint-ref-001");
  const keyFixed = useScenario("home-finder-accesskey-001");
  const fieldsetFixed = useScenario("home-finder-level-fieldset-001");
  const campusFixed = useScenario("home-finder-campus-label-001");
  const onlineFixed = useScenario("home-finder-online-labels-001");
  const submitFixed = useScenario("home-finder-submit-alt-001");
  const popularFixed = useScenario("home-finder-popular-label-001");

  const pills = LEVELS.map((l, i) => (
    <label key={l} className="finder-pill">
      <input type="radio" name="level" value={l.toLowerCase()} defaultChecked={i === 0} />
      <span>{l}</span>
    </label>
  ));

  return (
    <Form action="/academics/programs" method="get" className="home-finder" role="search" aria-labelledby="finder-heading">
      <h2 id="finder-heading" className="home-finder-title">Find your program</h2>
      <div className="home-finder-row">
        <div className="finder-search" data-a11y-scenario="home-finder-search-label-001 home-finder-hint-ref-001 home-finder-accesskey-001">
          <label htmlFor="finder-q" className="finder-search-icon">{labelFixed && <span className="visually-hidden">Search programs</span>}</label>
          <input
            id="finder-q" name="q" type="search" autoComplete="off" placeholder="Search 90+ majors, minors and certificates"
            aria-describedby={hintFixed ? "finder-hints" : "finder-hint"} accessKey={keyFixed ? undefined : "s"}
          />
        </div>
        <div className="finder-controls">
          <div data-a11y-scenario="home-finder-level-fieldset-001">
            {fieldsetFixed
              ? <fieldset className="finder-seg"><legend className="visually-hidden">Program level</legend>{pills}</fieldset>
              : <div className="finder-seg">{pills}</div>}
          </div>
          <div className="finder-select" data-a11y-scenario="home-finder-campus-label-001">
            {campusFixed ? <label htmlFor="finder-campus" className="finder-mini">Campus</label> : <span className="finder-mini">Campus</span>}
            <select id="finder-campus" name="campus" defaultValue="">
              <option value="">All locations</option>
              <option value="arcadia-falls">Arcadia Falls</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div className="finder-check" data-a11y-scenario="home-finder-online-labels-001">
            <input id="finder-online" type="checkbox" name="online" value="1" />
            <label htmlFor="finder-online">Online only</label>
            {!onlineFixed && <label htmlFor="finder-online" className="visually-hidden">Filter</label>}
          </div>
          <input type="image" src={GO_ICON} width={48} height={48} className="finder-go" alt={submitFixed ? "Search programs" : undefined} data-a11y-scenario="home-finder-submit-alt-001" />
        </div>
      </div>
      <p id="finder-hints" className="finder-hints" data-a11y-scenario="home-finder-popular-label-001">
        {popularFixed ? <span>Popular:</span> : <label>Popular:</label>}{" "}
        {POPULAR.map((p) => <Link key={p.q} to={`/academics/programs?q=${encodeURIComponent(p.q)}`}>{p.label}</Link>)}
      </p>
    </Form>
  );
}

// ---------- Start here ----------

const TILES = [
  { title: "Explore degrees", text: "90+ majors, minors and graduate programs", href: "/academics/programs", tone: "fern" },
  { title: "Request info", text: "Get a guide to Redwood State made for you", href: "/admissions/request-info", tone: "redwood" },
  { title: "Schedule a visit", text: "Tour Canopy Green and the research forest", href: "/admissions/visit", tone: "gold" },
  { title: "Tuition & cost", text: "Estimate your cost and see how aid helps", href: "/admissions/tuition", tone: "mist" },
  { title: "Colleges & schools", text: "Six colleges on one coastal campus", href: "/academics", tone: "bark" },
  { title: "Apply", text: "Fall 2027 priority deadline: December 1", href: "/admissions/apply", tone: "redwood-dark" },
];

function QuickTiles() {
  const headingFixed = useScenario("home-tiles-heading-empty-001");
  const menuFixed = useScenario("home-tiles-menu-001");
  useScenario("home-tiles-focus-001"); // CSS
  return (
    <section className="home-section" aria-labelledby="tiles-heading">
      <h2 id="tiles-heading" className={headingFixed ? "home-h2" : "home-h2 home-h2--css"} data-a11y-scenario="home-tiles-heading-empty-001">
        {headingFixed ? "Start here" : null}
      </h2>
      <ul className="home-tiles" role={menuFixed ? undefined : "menu"} data-a11y-scenario="home-tiles-menu-001 home-tiles-focus-001">
        {TILES.map((t) => (
          <li key={t.href} className={`home-tile home-tile--${t.tone}`}>
            <Link to={t.href}>
              <span className="home-tile-title">{t.title}</span>
              <span className="home-tile-text">{t.text}</span>
              <span className="home-tile-arrow">{ARROW}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------- By the numbers ----------

const icon = (paths: string) => svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#2f5d3a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`);
const STAT_ICONS = {
  people: icon(`<circle cx="12" cy="11" r="4"/><circle cx="22" cy="12" r="3"/><path d="M4 26c0-4.4 3.6-8 8-8s8 3.6 8 8M20 19.5c4 0 8 2.5 8 6.5"/>`),
  ratio: icon(`<path d="M6 7h20v13H14l-6 5v-5H6z"/><path d="M11 13h10"/>`),
  tree: icon(`<path d="M16 4l7 10h-4l6 8H7l6-8H9z"/><path d="M16 22v6"/>`),
  trophy: icon(`<path d="M10 5h12v6a6 6 0 0 1-12 0z"/><path d="M10 7H5v2a4 4 0 0 0 5 4M22 7h5v2a4 4 0 0 1-5 4M16 17v5M11 27h10l-1-5h-8z"/>`),
};

function ByTheNumbers() {
  const listFixed = useScenario("home-stats-layout-table-001");
  const blinkFixed = useScenario("home-stats-blink-001");
  const dupFixed = useScenario("home-stats-icon-alt-dup-001");
  const titleFixed = useScenario("home-stats-icon-title-001");
  const rank = blinkFixed ? <span>#4</span> : createElement("blink", { "data-a11y-scenario": "home-stats-blink-001" }, "#4");
  const stats = [
    { img: <img src={STAT_ICONS.people} width={40} height={40} alt={dupFixed ? "" : "Highlight"} data-a11y-scenario="home-stats-icon-alt-dup-001" />, value: "18,000", label: "students from 50 states and 40 countries" },
    { img: <img src={STAT_ICONS.ratio} width={40} height={40} alt={dupFixed ? "" : "Highlight"} data-a11y-scenario="home-stats-icon-alt-dup-001" />, value: "19:1", label: "student-to-faculty ratio" },
    { img: <img src={STAT_ICONS.tree} width={40} height={40} alt="" />, value: "1,200", label: "acres of research forest on campus" },
    { img: <img src={STAT_ICONS.trophy} width={40} height={40} {...(titleFixed ? { alt: "" } : { title: "Ranking" })} data-a11y-scenario="home-stats-icon-title-001" />, value: rank, label: "public university in the West for social mobility" },
  ];
  const cell = (s: (typeof stats)[number]) => <>{s.img}<span className="home-stat-value">{s.value}</span><span className="home-stat-label">{s.label}</span></>;
  return (
    <section className="home-stats-band home-bleed" aria-labelledby="stats-heading">
      <div className="container">
        <h2 id="stats-heading" className="home-h2">Redwood State by the numbers</h2>
        <div data-a11y-scenario="home-stats-layout-table-001">
          {listFixed
            ? <ul className="home-stats">{stats.map((s) => <li key={s.label} className="home-stat">{cell(s)}</li>)}</ul>
            : <table className="home-stats"><tbody><tr>{stats.map((s) => <td key={s.label} className="home-stat">{cell(s)}</td>)}</tr></tbody></table>}
        </div>
      </div>
    </section>
  );
}

// ---------- Redwood State Today ----------

function Stories() {
  const allFixed = useScenario("home-stories-all-link-001");
  const imgAltFixed = useScenario("home-story-feature-img-link-001");
  const unlinked = useScenario("home-story-feature-link-redundant-001");
  const titleAttrFixed = useScenario("home-story-title-attr-001");
  const longFixed = useScenario("home-story-img-alt-long-001");
  const underlineFixed = useScenario("home-story-underline-001");
  useScenario("home-story-date-small-001"); // CSS

  const feature = "/news/tide-pool-study-coastal-warming";
  const featureImg = (
    <Img
      image="news-tide-pool-study-coastal-warming"
      alt={imgAltFixed && !unlinked ? "Tide pool study tracks a warming coast" : ""}
      className="story-img" sizes="(min-width: 60rem) 45vw, 100vw" aspect="4 / 3"
      data-a11y-scenario="home-story-feature-img-link-001"
    />
  );
  const title = (to: string, text: string, attr?: boolean) => (
    <Heading scenario="home-stories-heading-skip-001" level={3} defect="skipped" defectLevel={4} className="story-title">
      <Link to={to} title={attr && !titleAttrFixed ? text : undefined} data-a11y-scenario={attr ? "home-story-title-attr-001" : undefined}>{text}</Link>
    </Heading>
  );
  const date = (text: string) => <span className="story-date" data-a11y-scenario="home-story-date-small-001">{text}</span>;

  return (
    <section className="home-section" aria-labelledby="stories-heading">
      <div className="home-section-head">
        <h2 id="stories-heading" className="home-h2">Redwood State Today</h2>
        <Link to="/news" className="round-link" aria-label={allFixed ? "All news" : undefined} data-a11y-scenario="home-stories-all-link-001">{ARROW}</Link>
      </div>
      <div className="stories">
        <article className="story story--feature">
          {unlinked ? featureImg : <Link to={feature} className="story-img-link" data-a11y-scenario="home-story-feature-link-redundant-001">{featureImg}</Link>}
          <div className="story-body">
            {date("Research · September 22, 2026")}
            {title(feature, "Tide pool study tracks a warming coast")}
            <p className="story-dek" data-a11y-scenario="home-story-underline-001">
              Biology students have logged water temperatures at Gull Rock Point every week since 2009, building{" "}
              <span className={underlineFixed ? "story-em" : "story-underline"}>one of the longest shoreline records</span> on the North Coast.
            </p>
            <SmartLink scenario="home-story-readmore-001" to="/news/category/research" defect="Read more" className="story-more">More research news</SmartLink>
          </div>
        </article>
        <article className="story">
          <Img image="news-engineering-robotics-lab-opens" alt="DSC_0192.JPG" scenario="home-card-img-alt-suspicious-001" fixedAlt="" className="story-img" sizes="(min-width: 60rem) 22vw, 100vw" aspect="4 / 3" />
          <div className="story-body">
            {date("Campus · September 15, 2026")}
            {title("/news/engineering-robotics-lab-opens", "Robotics lab opens in Sequoia Engineering Hall", true)}
            <p className="story-dek">Students now build forest-monitoring drones in the new Robotics and Autonomous Systems Lab.</p>
          </div>
        </article>
        <article className="story">
          <Img
            image="news-womens-soccer-conference-title"
            alt={longFixed ? "" : "Photo of the Redwood State University Redwood Owls women's soccer team celebrating on Redwood Field after scoring the winning goal in the 2-1 victory over Cascade State that clinched the 2026 conference championship, taken on September 20, 2026"}
            className="story-img" sizes="(min-width: 60rem) 22vw, 100vw" aspect="4 / 3"
            data-a11y-scenario="home-story-img-alt-long-001"
          />
          <div className="story-body">
            {date("Athletics · September 20, 2026")}
            {title("/news/womens-soccer-conference-title", "Women's soccer clinches the conference title")}
            <p className="story-dek">A late goal beats Cascade State 2–1 and extends the Owls&rsquo; unbeaten run to nine.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

// ---------- Key dates ----------

type DateCat = "Admissions" | "Financial aid" | "Academic";
const DATES: { month: string; day: string; title: string; who: string; cat: DateCat; details: string }[] = [
  { month: "Oct", day: "15", title: "Spring 2027 class schedule published", who: "Current students", cat: "Academic", details: "Browse every spring section in the course search and plan your schedule with your advisor." },
  { month: "Nov", day: "2", title: "Spring 2027 registration opens", who: "Current students", cat: "Academic", details: "Registration opens by time ticket; check RedwoodConnect for your appointment and any holds." },
  { month: "Dec", day: "1", title: "Fall 2027 priority application deadline", who: "Future students", cat: "Admissions", details: "First-year and transfer applicants who apply by December 1 get priority for housing and scholarships." },
  { month: "Jan", day: "12", title: "Spring semester begins", who: "Everyone", cat: "Academic", details: "The first day of spring classes. The add/drop period runs through January 23." },
  { month: "Feb", day: "15", title: "Redwood Scholars application closes", who: "Future students", cat: "Financial aid", details: "One application covers every Redwood State merit scholarship for new students." },
  { month: "Mar", day: "2", title: "FAFSA and CA Dream Act priority deadline", who: "All students", cat: "Financial aid", details: "Submit by March 2 to be considered for Cal Grants and the most institutional aid." },
];
const FILTERS = ["All", "Admissions", "Financial aid", "Academic"] as const;
const COLS = ["Date", "Deadline", "For"];

function KeyDates() {
  const marqueeFixed = useScenario("home-dates-marquee-001");
  const captionFixed = useScenario("home-dates-caption-001");
  const headersFixed = useScenario("home-dates-headers-001");
  const hoverFixed = useScenario("home-dates-row-hover-001");
  const focusFixed = useScenario("home-dates-filter-focus-001");
  const pdfFixed = useScenario("home-dates-pdf-001");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [open, setOpen] = useState<string | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const rows = DATES.filter((d) => filter === "All" || d.cat === filter);

  // Defective: React can't render inline handler attributes, so set them on the live rows (WAVE reads attributes).
  useEffect(() => {
    for (const tr of tableRef.current?.querySelectorAll("tbody tr.dates-row") ?? []) {
      if (hoverFixed) { tr.removeAttribute("onmouseover"); tr.removeAttribute("onmouseout"); continue; }
      tr.setAttribute("onmouseover", "this.classList.add('is-hover')");
      tr.setAttribute("onmouseout", "this.classList.remove('is-hover')");
    }
  });

  const choose = (f: (typeof FILTERS)[number]) => {
    setFilter(f);
    setOpen(null);
    if (!focusFixed) requestAnimationFrame(() => tableRef.current?.querySelector<HTMLButtonElement>("tbody button")?.focus());
  };
  const next = marqueeFixed
    ? <p className="dates-next">Next up: spring registration opens Nov. 2</p>
    : createElement("marquee", { className: "dates-next", behavior: "slide", scrollamount: "4000", scrolldelay: "0", truespeed: "", loop: "1", "data-a11y-scenario": "home-dates-marquee-001" }, "Next up: spring registration opens Nov. 2");

  return (
    <section className="home-section" aria-labelledby="key-dates-heading">
      <div className="home-section-head">
        <h2 id="key-dates-heading" className="home-h2">Key dates</h2>
        <div className="dates-filters" role="group" aria-label="Filter key dates" data-a11y-scenario="home-dates-filter-focus-001">
          {FILTERS.map((f) => <button key={f} type="button" className="dates-filter" aria-pressed={filter === f} onClick={() => choose(f)}>{f}</button>)}
        </div>
      </div>
      {next}
      <div className="dates-wrap">
        <table ref={tableRef} className="dates-table" data-a11y-scenario="home-dates-caption-001 home-dates-headers-001 home-dates-row-hover-001">
          {captionFixed && <caption className="dates-term">2026–27 academic year</caption>}
          <thead>
            <tr>
              {COLS.map((c) => <th key={c} scope="col" className={headersFixed ? undefined : "th-css"} data-label={c}>{headersFixed ? c : null}</th>)}
              <th scope="col">{headersFixed ? <span className="visually-hidden">Details</span> : null}</th>
            </tr>
          </thead>
          <tbody>
            {!captionFixed && <tr><td colSpan={4} className="dates-term">2026–27 academic year</td></tr>}
            {rows.flatMap((d) => {
              const expanded = open === d.title;
              const row = (
                <tr key={d.title} className="dates-row">
                  <td className="dates-when"><span className="dates-month">{d.month}</span> <span className="dates-day">{d.day}</span></td>
                  <td className="dates-what">{d.title}<span className={`dates-tag dates-tag--${d.cat.split(" ")[0].toLowerCase()}`}>{d.cat}</span></td>
                  <td className="dates-who">{d.who}</td>
                  <td className="dates-more">
                    <IconButton
                      scenario="home-dates-details-btn-001" label={`Details for ${d.title}`} className="dates-toggle"
                      icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"><path d={expanded ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} /></svg>}
                      aria-expanded={expanded} onClick={() => setOpen(expanded ? null : d.title)}
                    />
                  </td>
                </tr>
              );
              return expanded ? [row, <tr key={`${d.title}-details`} className="dates-details"><td colSpan={4}>{d.details}</td></tr>] : [row];
            })}
          </tbody>
        </table>
      </div>
      <div className="dates-foot">
        <p className="dates-all" data-a11y-scenario="home-dates-pdf-001">
          {pdfFixed
            ? <Link to="/academics/calendar">View the full 2026–27 academic calendar</Link>
            : <a href={`${base}documents/academic-calendar-2026-27.pdf`}>Download the full 2026–27 academic calendar</a>}
          {ARROW}
        </p>
        <DeadlineReminders />
      </div>
    </section>
  );
}

/** home-dates-remind-label-001: the email field's only "label" is its placeholder. */
function DeadlineReminders() {
  const fixed = useScenario("home-dates-remind-label-001");
  const [sent, setSent] = useState(false);
  if (sent) return <p className="dates-remind-done" role="status">You&rsquo;re set. We&rsquo;ll email you a week before each deadline.</p>;
  return (
    <form className="dates-remind" onSubmit={(e) => { e.preventDefault(); setSent(true); }} data-a11y-scenario="home-dates-remind-label-001">
      <span className="dates-remind-lead">Never miss a deadline</span>
      {fixed && <label htmlFor="remind-email" className="visually-hidden">Email address for deadline reminders</label>}
      <input id="remind-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      <button type="submit" className="btn btn--primary">Remind me</button>
    </form>
  );
}

// ---------- Campus map ----------

const HOTSPOTS: { code: string; label: string; alt: string }[] = [
  { code: "FDR", label: "Founders Hall", alt: "Founders Hall: Admissions and Financial Aid" },
  { code: "LIB", label: "Sequoia Library", alt: "Sequoia Library" },
  { code: "SU", label: "Student Union", alt: "Rowan Student Union" },
  { code: "SEH", label: "Engineering", alt: "Sequoia Engineering Hall" },
  { code: "OAC", label: "Owl Arena", alt: "Owl Arena" },
];
const FILL: Record<string, string> = { academic: "#e4d9c8", housing: "#ddd1e4", "student-life": "#f0dcae", athletics: "#cddfe9", services: "#e1e1dc" };
const hot = new Map(HOTSPOTS.map((h) => [h.code, h]));
const MAP_IMG = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_W} ${MAP_H}" font-family="Helvetica, Arial, sans-serif">
<rect width="${MAP_W}" height="${MAP_H}" fill="#eef3ea"/>
<rect x="24" y="24" width="952" height="592" rx="56" fill="none" stroke="#fff" stroke-width="20"/>
<path d="M500 24V616M24 236H976" stroke="#fff" stroke-width="12"/>
<rect x="410" y="245" width="180" height="140" rx="18" fill="#cfe2c3"/>
<text x="500" y="322" text-anchor="middle" font-size="17" fill="#4d6b45" font-weight="700">Canopy Green</text>
${buildings.map((b) => {
  const [x, y, w, h] = b.box;
  const spot = hot.get(b.code);
  return spot
    ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#7a2e1f"/><text x="${x + w / 2}" y="${y + h / 2 + 6}" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">${spot.label}</text>`
    : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${FILL[b.category]}"/><text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" font-size="13" fill="#5c5c56">${b.code}</text>`;
}).join("")}
</svg>`);

function CampusMapTeaser() {
  const imgFixed = useScenario("home-map-img-alt-001");
  const areaFixed = useScenario("home-map-area-alt-001");
  const longdescFixed = useScenario("home-map-longdesc-001");
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(0.56);

  // <area> coords are in rendered pixels, so rescale them whenever the image resizes.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const update = () => setScale(img.clientWidth / MAP_W || 0.56);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(img);
    return () => ro.disconnect();
  }, []);

  const spots = buildings.filter((b) => hot.has(b.code));
  return (
    <section className="home-section home-map" aria-labelledby="map-heading">
      <div className="home-map-text">
        <p className="home-eyebrow">Campus</p>
        <h2 id="map-heading" className="home-h2">Find your way around</h2>
        <p>A walkable campus between the redwoods and the Pacific, with most of what you need five minutes from Canopy Green. Select a building to see what&rsquo;s inside, or open the full map for parking, entrances and accessible routes.</p>
        <Link to="/campus-map" className="btn btn--primary home-btn">Open the campus map</Link>
      </div>
      <div className="home-map-figure" data-a11y-scenario="home-map-img-alt-001 home-map-area-alt-001 home-map-longdesc-001">
        <img
          ref={imgRef} src={MAP_IMG} width={MAP_W} height={MAP_H} useMap="#home-campus-map" className="home-map-img"
          alt={imgFixed ? "" : undefined} {...(longdescFixed ? {} : { longdesc: "Campus map showing Founders Hall, Sequoia Library, the Student Union, the Engineering Hall and Owl Arena around Canopy Green" })}
        />
        <map name="home-campus-map">
          {spots.map((b) => {
            const [x, y, w, h] = b.box.map((n) => Math.round(n * scale));
            return <area key={b.code} shape="rect" coords={`${x},${y},${x + w},${y + h}`} href={`${base}campus-map`} alt={areaFixed ? hot.get(b.code)!.alt : undefined} />;
          })}
        </map>
      </div>
    </section>
  );
}

// ---------- Plan your visit ----------

function VisitBand() {
  const altFixed = useScenario("home-visit-img-alt-redundant-001");
  return (
    <section className="home-visit home-bleed" aria-labelledby="visit-heading">
      <div className="container home-visit-inner">
        <div className="home-visit-text">
          <p className="home-eyebrow home-eyebrow--light">Visit</p>
          <h2 id="visit-heading" className="home-h2">Plan your visit</h2>
          <p className="home-visit-lede">Walk the quad with a student guide, sit in on a class and eat in the Grove. Tours leave the Welcome Center weekdays at 10 a.m. and 2 p.m.</p>
          <div className="home-hero-actions">
            <Link to="/admissions/visit" className="btn btn--primary home-btn home-btn--light">Schedule a tour</Link>
            <Link to="/visitors" className="btn home-btn home-btn--ghost">Directions and parking</Link>
          </div>
        </div>
        <Img image="admissions-hero-tour" alt={altFixed ? "" : "Plan your visit"} className="home-visit-img" sizes="(min-width: 60rem) 40vw, 100vw" aspect="16 / 9" data-a11y-scenario="home-visit-img-alt-redundant-001" />
      </div>
    </section>
  );
}

// ---------- Tracking ----------

function Tracking() {
  const spacerFixed = useScenario("home-tracking-spacer-001");
  const noscriptFixed = useScenario("home-tracking-noscript-001");
  return (
    <>
      <img src={`${base}images/spacer.gif`} width={1} height={1} className="home-pixel" alt={spacerFixed ? "" : undefined} data-a11y-scenario="home-tracking-spacer-001" />
      {!noscriptFixed && <noscript data-a11y-scenario="home-tracking-noscript-001">Turn on JavaScript to see the interactive campus map.</noscript>}
    </>
  );
}
