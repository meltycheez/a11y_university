// /events: month calendar grid (October–December 2026) in the style of a third-party calendar vendor widget.
import { useState } from "react";
import { Link } from "react-router";
import { IconButton, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { RelatedLinks } from "~/components/blocks";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { eventCategories } from "~/data/catalog";
import { addDays, formatDate, SITE_NOW } from "~/data/site";
import { categoryName, day, eventList, eventsOn, formatTime, monthWeeks } from "./_shared";

export { inventoryMeta as meta } from "~/routes/meta";

const MONTHS = [{ m: 10, name: "October" }, { m: 11, name: "November" }, { m: 12, name: "December" }];
const WEEKDAYS = [["Sun", "Sunday"], ["Mon", "Monday"], ["Tue", "Tuesday"], ["Wed", "Wednesday"], ["Thu", "Thursday"], ["Fri", "Friday"], ["Sat", "Saturday"]];
const TAG: Record<string, string> = { academic: "ACAD", arts: "ARTS", athletics: "ATH", "student-life": "LIFE" };

export default function EventsCalendar() {
  const [monthIndex, setMonthIndex] = useState(0);
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const chipsFixed = useScenario("events-cal-chip-state-001");
  const statusFixed = useScenario("events-cal-month-status-001");
  const headersFixed = useScenario("events-cal-headers-001");
  const currentFixed = useScenario("events-cal-today-aria-001");
  const captionFixed = useScenario("events-cal-caption-001");
  const cellFixed = useScenario("events-cal-day-click-001");
  const colorFixed = useScenario("events-cal-color-only-001");
  useScenario("events-cal-text-small-001"); // CSS scenario (calendar.css)
  useScenario("events-cal-reflow-001"); // CSS scenario (calendar.css)

  const { m, name } = MONTHS[monthIndex];
  const monthLabel = `${name} 2026`;
  const visible = category ? eventList.filter((e) => e.category === category) : eventList;
  const prefix = `2026-${String(m).padStart(2, "0")}`;
  const inMonth = visible.filter((e) => day(e.start) <= `${prefix}-31` && day(e.end) >= `${prefix}-01`);
  const agenda = selected ? eventsOn(selected, visible) : inMonth;

  const goMonth = (i: number) => { setMonthIndex(i); setSelected(null); };

  return (
    <>
      <Hero title="Events Calendar" kicker="Redwood State University" lede="Lectures, performances, games, and student life events at Redwood State." image="events-hero-concert" />

      <div className="page-content">
        <div className="cal-widget" data-a11y-scenario="events-cal-reflow-001 events-cal-text-small-001">
          <div className="cal-chips" role="group" aria-label="Filter by category" data-a11y-scenario="events-cal-chip-state-001">
            {[{ slug: "", name: "All events" }, ...eventCategories].map((c) => (
              <button
                key={c.slug}
                type="button"
                className={`cal-chip${category === c.slug ? " is-active" : ""}`}
                aria-pressed={chipsFixed ? category === c.slug : undefined}
                onClick={() => { setCategory(c.slug); setSelected(null); }}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="cal-toolbar">
            <IconButton scenario="events-cal-nav-empty-001" label="Previous month" icon="‹" className="cal-nav" disabled={monthIndex === 0} onClick={() => goMonth(monthIndex - 1)} />
            <p className="cal-month" id="cal-month-label" data-a11y-scenario="events-cal-month-status-001" {...(statusFixed ? { role: "status" } : {})}>
              {monthLabel}
            </p>
            <IconButton scenario="events-cal-nav-empty-001" label="Next month" icon="›" className="cal-nav" disabled={monthIndex === MONTHS.length - 1} onClick={() => goMonth(monthIndex + 1)} />
          </div>

          <div className="cal-grid-wrap">
            <table className="cal-table" data-a11y-scenario="events-cal-headers-001 events-cal-caption-001 events-cal-today-aria-001 events-cal-day-click-001 events-cal-color-only-001">
              {captionFixed && <caption className="visually-hidden">{monthLabel} events</caption>}
              <thead>
                <tr>
                  {WEEKDAYS.map(([short, long], i) => (
                    <th key={short} id={`wd-${i}`} scope={headersFixed ? "col" : undefined}>
                      <abbr title={long}>{short}</abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthWeeks(2026, m).map((week, w) => (
                  <tr key={w}>
                    {week.map((iso, i) => {
                      if (!iso) return <td key={i} className="cal-empty" />;
                      // Long-running events (the exhibition) show on their opening day only, as the vendor widget does.
                      const events = eventsOn(iso, visible).filter((e) => day(e.start) === iso || addDays(day(e.start), 7) >= day(e.end));
                      const isToday = iso === SITE_NOW;
                      const dayNum = Number(iso.slice(8));
                      return (
                        <td
                          key={i}
                          // The vendor script points each cell at weekday ids from an older template ("cal-sun"…).
                          headers={headersFixed ? undefined : `cal-${WEEKDAYS[i][0].toLowerCase()}`}
                          aria-current={isToday ? (currentFixed ? "date" : ("yes" as "true")) : undefined}
                          className={`cal-day${isToday ? " is-today" : ""}${selected === iso ? " is-selected" : ""}${events.length ? " has-events" : ""}`}
                          onClick={!cellFixed && events.length ? () => setSelected(iso) : undefined}
                        >
                          {cellFixed && events.length
                            ? <button type="button" className="cal-day-num" aria-pressed={selected === iso} onClick={() => setSelected(iso)}>
                                {dayNum}<span className="visually-hidden">, show {events.length} {events.length === 1 ? "event" : "events"}</span>
                              </button>
                            : <span className="cal-day-num">{dayNum}</span>}
                          <ul className="cal-events">
                            {events.map((e) => (
                              <li key={e.slug} className={`cal-event cal-event--${e.category}`}>
                                <span className="cal-dot" aria-hidden="true" />
                                {colorFixed && <span className="cal-tag">{TAG[e.category]}<span className="visually-hidden"> ({categoryName(e.category)})</span></span>}
                                <SmartLink scenario="events-cal-link-title-001" to={`/events/${e.slug}`} defectTitle={e.title}>{e.title}</SmartLink>
                              </li>
                            ))}
                          </ul>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {colorFixed && (
            <ul className="cal-legend" aria-label="Category key">
              {eventCategories.map((c) => <li key={c.slug} className={`cal-event--${c.slug}`}><span className="cal-dot" aria-hidden="true" /> {TAG[c.slug]}: {c.name}</li>)}
            </ul>
          )}
        </div>

        <section aria-labelledby="agenda-heading" className="cal-agenda">
          <h2 id="agenda-heading">{selected ? `Events on ${formatDate(selected)}` : `${monthLabel} events`}</h2>
          {selected && <button type="button" className="cal-chip" onClick={() => setSelected(null)}>Show the whole month</button>}
          {agenda.length === 0
            ? <p>No {category ? `${categoryName(category)} ` : ""}events are posted for {monthLabel} yet. Check back soon.</p>
            : (
              <ul className="cal-agenda-list">
                {agenda.map((e) => (
                  <li key={e.slug}>
                    <p className="cal-agenda-when">{formatDate(e.start)}{day(e.end) !== day(e.start) && ` – ${formatDate(e.end)}`} · {formatTime(e.start)}</p>
                    <h3><Link to={`/events/${e.slug}`}>{e.title}</Link></h3>
                    <p className="cal-agenda-meta">{e.location} · {categoryName(e.category)}</p>
                  </li>
                ))}
              </ul>
            )}
        </section>

        <Callout title="Accommodations">
          <p>Events are free and open to the public unless noted. For disability-related accommodations at an event, contact the event sponsor at least five business days in advance.</p>
        </Callout>
        <RelatedLinks
          title="Browse events"
          links={[...eventCategories.map((c) => ({ label: `${c.name} events`, href: `/events/category/${c.slug}` })), { label: "Search events", href: "/events/search" }]}
        />
      </div>
    </>
  );
}
