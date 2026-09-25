// /athletics/schedule: Composite Schedule, one of the six terrible pages (plan 07; tier T). A third-party
// sports-scheduling widget embedded whole: dense tables with no captions or real headers, icon-only ticket and
// TV badges, win/loss shown by color only, and a sticky header that covers the row a keyboard user just focused.
// Scenarios: src/a11y/registry/athletics.ts (athletics-schedule-*). CSS: styles/features/athletics-schedule.css.
import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useFixes } from "~/a11y/useFixes";
import { athleticsScenarios } from "~/a11y/registry/athletics";
import { Hero } from "~/components/Hero";
import { Tabs } from "~/components/Tabs";
import { teams as teamList } from "~/data/catalog";
import athletics from "~/data/generated/athletics.json";
import type { Athletics, Game } from "~/data/types";
import { shortDate, teamName, versus } from "./_shared";

export { inventoryMeta as meta } from "~/routes/meta";

type Row = Game & { team: string };
type Fix = (key: string) => boolean;
type Mark = (...keys: string[]) => { "data-a11y-scenario": string };
type Id = (key: string) => string;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const svg = (s: string) => `data:image/svg+xml,${encodeURIComponent(s)}`;
const TICKET = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M1 5a2 2 0 0 1 0 4v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9a2 2 0 0 1 0-4V3a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1z" fill="none" stroke="#5a1f14" stroke-width="1.2"/></svg>`);
const TV = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="3" width="14" height="9" rx="1" fill="none" stroke="#335" stroke-width="1.2"/><path d="M5 14h6" stroke="#335" stroke-width="1.2"/></svg>`);
const PRINTER = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="1" width="10" height="4" fill="none" stroke="#333" stroke-width="1"/><rect x="1" y="5" width="14" height="6" fill="none" stroke="#333" stroke-width="1"/><rect x="4" y="10" width="8" height="5" fill="none" stroke="#333" stroke-width="1"/></svg>`);

export async function loader() {
  const { teams } = athletics as unknown as Athletics;
  const games: Row[] = teams.flatMap((t) => t.schedule.map((g) => ({ ...g, team: t.slug }))).sort((a, b) => a.date.localeCompare(b.date));
  return { games };
}

const scheduleDefs = athleticsScenarios.filter((s) => s.pages.includes("/athletics/schedule"));

export default function SchedulePage() {
  const { games } = useLoaderData<typeof loader>();
  const { fix, id, mark } = useFixes(scheduleDefs, "athletics-schedule-");
  const [sport, setSport] = useState("all");
  const [homeOnly, setHomeOnly] = useState(false);
  const [confOnly, setConfOnly] = useState(false);

  const filtered = games.filter(
    (g) => (sport === "all" || g.team === sport) && (!homeOnly || g.site === "Home") && (!confOnly || g.conference),
  );
  const upcoming = filtered.filter((g) => !g.result);
  const past = filtered.filter((g) => g.result);
  const thisMonth = new Date().toISOString().slice(0, 7);

  const groupByMonth = (rows: Row[]) => {
    const groups = new Map<string, Row[]>();
    for (const g of rows) {
      const key = g.date.slice(0, 7);
      (groups.get(key) ?? groups.set(key, []).get(key)!).push(g);
    }
    return [...groups.entries()];
  };

  const quickFiltersFixed = fix("quick-filters");
  const tabindexFixed = fix("checkbox-tabindex");
  const orphanFixed = fix("orphan-label");
  const filtersMarker = mark("quick-filters", "checkbox-tabindex")["data-a11y-scenario"];
  const checks = (
    <>
      <label className="sch-check"><input type="checkbox" checked={homeOnly} onChange={(e) => setHomeOnly(e.target.checked)} {...(tabindexFixed ? {} : { tabIndex: 5 })} /> Home games only</label>
      <label className="sch-check"><input type="checkbox" checked={confOnly} onChange={(e) => setConfOnly(e.target.checked)} {...(tabindexFixed ? {} : { tabIndex: 6 })} /> Conference games only</label>
    </>
  );

  return (
    <div className="ath-schedule">
      <Hero title="Composite Schedule" kicker="Redwood Owls Athletics" lede="Every Redwood Owls team, one calendar. Filter by sport or use the quick filters below." variant="banner" />
      <div className="page-content">
        <FeaturedMatchups games={games} fix={fix} mark={mark} />
        <ScheduleLegend fix={fix} id={id} mark={mark} />

        <form className="sch-form" onSubmit={(e) => e.preventDefault()}>
          <div className="field sch-field">
            {!orphanFixed && <label data-a11y-scenario={id("orphan-label")}>Division</label>}
            <div data-a11y-scenario={id("sport-label")}>
              {fix("sport-label") ? <label htmlFor="sch-sport">Sport</label> : <span className="field-label">Sport</span>}
              <select id="sch-sport" value={sport} onChange={(e) => setSport(e.target.value)}>
                <option value="all">All sports</option>
                {teamList.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
              </select>
            </div>
          </div>
          {quickFiltersFixed ? (
            <fieldset className="sch-filters" data-a11y-scenario={filtersMarker}><legend>Quick filters</legend>{checks}</fieldset>
          ) : (
            <div className="sch-filters" data-a11y-scenario={filtersMarker}>{checks}</div>
          )}
        </form>

        <Tabs
          label="Schedule view"
          scenario={id("tabs-view")}
          defect="broken-keys"
          tabs={[
            { label: "Upcoming", content: <MonthTables groups={groupByMonth(upcoming)} thisMonth={thisMonth} fix={fix} mark={mark} /> },
            { label: "Results", content: <MonthTables groups={groupByMonth(past)} thisMonth={thisMonth} fix={fix} mark={mark} /> },
          ]}
        />

        <p className="sch-links">
          <img src={PRINTER} alt={fix("print-icon-alt") ? "" : undefined} width={16} height={16} data-a11y-scenario={id("print-icon-alt")} />{" "}
          <SmartLink scenario={id("pdf")} to="/documents/tuition-schedule-2025-26.pdf" fileInfo="PDF, 2 KB">Printable schedule</SmartLink>
          {" · "}
          <SmartLink scenario={id("tickets-window")} to="/athletics" newWindow>Ticket office</SmartLink>
        </p>
      </div>
    </div>
  );
}

function FeaturedMatchups({ games, fix, mark }: { games: Row[]; fix: Fix; mark: Mark }) {
  const upcomingHome = games.filter((g) => !g.result && g.site === "Home").slice(0, 4);
  const pauseFixed = fix("carousel-pause");
  const dotsFixed = fix("carousel-kbd");
  const redundantFixed = fix("matchup-redundant");
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  useEffect(() => { if (pauseFixed && reduced) setPlaying(false); }, [pauseFixed, reduced]);

  const rotating = pauseFixed ? playing : true;
  useEffect(() => {
    if (!rotating || upcomingHome.length < 2) return;
    const t = setInterval(() => setSlide((i) => (i + 1) % upcomingHome.length), 6000);
    return () => clearInterval(t);
  }, [rotating, upcomingHome.length]);

  if (!upcomingHome.length) return null;
  const g = upcomingHome[slide];
  return (
    <div className="sch-carousel" data-a11y-scenario={mark("carousel-pause", "matchup-redundant")["data-a11y-scenario"]}>
      <div className="sch-carousel-head">
        <p className="sch-carousel-kicker">Featured matchups</p>
        {pauseFixed && <button type="button" className="sch-carousel-toggle" onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>}
      </div>
      <div className="sch-carousel-slide">
        {redundantFixed
          ? <span className="sch-carousel-team" aria-hidden="true">{teamName(g.team)}</span>
          : <Link to={`/athletics/teams/${g.team}`} className="sch-carousel-team">{teamName(g.team)}</Link>}
        <p>{versus(g)} — {shortDate(g.date)}, {g.time}</p>
        <Link to={`/athletics/teams/${g.team}`} className="btn btn-sm">Buy tickets</Link>
      </div>
      <div className="sch-carousel-dots" data-a11y-scenario={mark("carousel-kbd")["data-a11y-scenario"]}>
        {upcomingHome.map((_, i) =>
          dotsFixed ? (
            <button key={i} type="button" aria-current={i === slide ? "true" : undefined} aria-label={`Slide ${i + 1} of ${upcomingHome.length}`}
              className={`sch-dot${i === slide ? " is-active" : ""}`} onClick={() => setSlide(i)} />
          ) : (
            <span key={i} className={`sch-dot${i === slide ? " is-active" : ""}`} onClick={() => setSlide(i)} />
          ),
        )}
      </div>
    </div>
  );
}

function ScheduleLegend({ fix, id, mark }: { fix: Fix; id: Id; mark: Mark }) {
  const listFixed = fix("legend-list");
  const layoutFixed = fix("legend-table");
  const clipFixed = fix("legend-clip");
  const items = [{ icon: TICKET, text: "Tickets available" }, { icon: TV, text: "Nationally televised" }];

  return (
    <div className="sch-legend">
      <div className={`sch-legend-row${clipFixed ? "" : " sch-legend-clip"}`} data-a11y-scenario={mark("legend-list", "legend-clip")["data-a11y-scenario"]}>
        {listFixed ? (
          <ul>
            {items.map((it) => <li key={it.text}><img src={it.icon} alt="" width={14} height={14} /> {it.text}</li>)}
            <li className="sch-swatch sch-swatch--w">Win</li>
            <li className="sch-swatch sch-swatch--l">Loss</li>
          </ul>
        ) : (
          <div>
            {items.map((it) => <span key={it.text}><img src={it.icon} alt="" width={14} height={14} /> {it.text}</span>)}
            <span className="sch-swatch sch-swatch--w">Win</span>
            <span className="sch-swatch sch-swatch--l">Loss</span>
          </div>
        )}
      </div>
      <p className="sch-legend-note" data-a11y-scenario={id("legend-underline")}>
        {fix("legend-underline") ? <b>* Conference game</b> : <u>* Conference game</u>}
      </p>
      {layoutFixed ? (
        <div className="sch-key-flex" data-a11y-scenario={id("legend-table")}><span><b>Key:</b></span><span>Tickets</span><span>TV</span></div>
      ) : (
        <table className="sch-key-table" data-a11y-scenario={id("legend-table")}><tbody><tr><td><b>Key:</b></td><td>Tickets</td><td>TV</td></tr></tbody></table>
      )}
    </div>
  );
}

function MonthTables({ groups, thisMonth, fix, mark }: { groups: [string, Row[]][]; thisMonth: string; fix: Fix; mark: Mark }) {
  const HeadingTag = fix("month-heading") ? "h2" : "h4";
  const currentFixed = fix("current-month");
  const captionFixed = fix("table-caption");
  const headersFixed = fix("table-headers");
  const stickyFixed = fix("sticky-focus");
  const contrastFixed = fix("row-contrast");
  const smallFixed = fix("fine-print-small");
  const finePrintContrastFixed = fix("fine-print-contrast");
  const idFixed = fix("conf-note-id");
  const rowMarker = mark("table-caption", "table-headers", "ticket-empty", "tv-badge", "tv-badge-title", "result-color", "details-generic", "venue-title")["data-a11y-scenario"];

  if (!groups.length) return <p>No games match your filters.</p>;
  return (
    <>
      {groups.map(([key, rows], i) => {
        const [y, m] = key.split("-");
        const label = `${MONTHS[Number(m) - 1]} ${y}`;
        const isCurrent = key === thisMonth;
        return (
          <section key={key} className="sch-month">
            <HeadingTag data-a11y-scenario={mark("month-heading")["data-a11y-scenario"]}>
              {label}{" "}
              {isCurrent && (
                <span className="sch-badge" aria-current={currentFixed ? "date" : ("yes" as "true")} data-a11y-scenario={mark("current-month")["data-a11y-scenario"]}>
                  This month
                </span>
              )}
            </HeadingTag>
            <div
              className={`sch-table-wrap${stickyFixed ? "" : " sch-sticky-broken"}${contrastFixed ? "" : " sch-low-contrast"}`}
              data-a11y-scenario={mark("sticky-focus", "row-contrast")["data-a11y-scenario"]}
            >
              <table className="data-table sch-table">
                {captionFixed && <caption>{label} schedule</caption>}
                <thead>
                  <tr>
                    {[
                      ["col-date", "Date"], ["col-sport", "Sport"], ["col-opp", "Opponent"], ["col-site", "Site"],
                      ["col-tix", "Tickets"], ["col-tv", "TV"], ["col-result", "Result"], ["col-details", "Details"],
                    ].map(([colId, h]) => (
                      <th key={colId} id={colId} scope="col">{h === "Details" ? <span className="visually-hidden">{h}</span> : h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody data-a11y-scenario={rowMarker}>
                  {rows.map((g) => <ScheduleRow key={g.team + g.date} g={g} fix={fix} headersFixed={headersFixed} />)}
                </tbody>
              </table>
            </div>
            <p
              className="sch-note"
              id={idFixed ? `conf-note-${key}` : "conf-note"}
              style={{ fontSize: smallFixed ? undefined : "10px", color: finePrintContrastFixed ? undefined : "#aaaaaa" }}
              data-a11y-scenario={mark("fine-print-small", "fine-print-contrast", "conf-note-id")["data-a11y-scenario"]}
            >
              All times Pacific.{i < 2 && " * Conference game (see legend above)."}
            </p>
          </section>
        );
      })}
    </>
  );
}

function ScheduleRow({ g, fix, headersFixed }: { g: Row; fix: Fix; headersFixed: boolean }) {
  const ticketFixed = fix("ticket-empty");
  const tvFixed = fix("tv-badge");
  const tvTitleFixed = fix("tv-badge-title");
  const resultFixed = fix("result-color");
  const venueFixed = fix("venue-title");
  const label = `${teamName(g.team)} ${versus(g)}, ${shortDate(g.date)}`;
  const televised = g.conference && g.site === "Home";
  const h = (col: string) => ({ headers: headersFixed ? `col-${col}` : col });

  return (
    <tr>
      <td {...h("date")}>{shortDate(g.date)}, {g.time}</td>
      <td {...h("sport")}>{teamName(g.team)}</td>
      <td {...h("opp")}>{versus(g)}{g.conference && "*"}</td>
      <td {...h("site")}><Link to="/campus-map" title={venueFixed ? undefined : g.location}>{g.location}</Link></td>
      <td {...h("tix")}>
        {g.site === "Home" && (
          <Link to={`/athletics/teams/${g.team}`} className="sch-icon-link" aria-label={ticketFixed ? `Buy tickets: ${label}` : undefined}>
            <img src={TICKET} alt="" width={16} height={16} />
          </Link>
        )}
      </td>
      <td {...h("tv")}>
        {televised && <img src={TV} width={16} height={16} alt={tvFixed ? "Nationally televised" : ""} title={!tvFixed || tvTitleFixed ? undefined : "Nationally televised"} />}
      </td>
      <td {...h("result")} className={g.result ? `sch-result sch-result--${g.result.outcome?.toLowerCase()}` : undefined}>
        {g.result && (resultFixed ? <><strong>{g.result.outcome} </strong>{g.result.score}</> : g.result.score)}
      </td>
      <td {...h("details")}>
        <SmartLink scenario="athletics-schedule-details-generic-001" to={`/athletics/teams/${g.team}#schedule`} defect="Details">{label}</SmartLink>
      </td>
    </tr>
  );
}
