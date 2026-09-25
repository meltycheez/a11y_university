// /events/search: keyword, date range and category search over the events calendar, in memory.
import { useState } from "react";
import { Link } from "react-router";
import { Field } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { RelatedLinks } from "~/components/blocks";
import { eventCategories } from "~/data/catalog";
import { SITE_NOW } from "~/data/site";
import { categoryName, day, eventList, formatWhen } from "./_shared";

export { inventoryMeta as meta } from "~/routes/meta";

interface Criteria { q: string; from: string; to: string; cats: string[] }
const initial: Criteria = { q: "", from: SITE_NOW, to: "", cats: [] };

function search({ q, from, to, cats }: Criteria) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  return eventList.filter((e) => {
    const hay = [e.title, e.location, ...e.description].join(" ").toLowerCase();
    return words.every((w) => hay.includes(w))
      && (!from || day(e.end) >= from)
      && (!to || day(e.start) <= to)
      && (!cats.length || cats.includes(e.category));
  });
}

export default function EventsSearch() {
  const [draft, setDraft] = useState(initial);
  const [criteria, setCriteria] = useState(initial);
  const fieldsetFixed = useScenario("events-search-fieldset-001");
  const liveFixed = useScenario("events-search-results-live-001");
  const results = search(criteria);

  const toggleCat = (slug: string) =>
    setDraft((d) => ({ ...d, cats: d.cats.includes(slug) ? d.cats.filter((c) => c !== slug) : [...d.cats, slug] }));

  const checkboxes = eventCategories.map((c) => (
    <label key={c.slug} className="evs-check">
      <input type="checkbox" checked={draft.cats.includes(c.slug)} onChange={() => toggleCat(c.slug)} /> {c.name}
    </label>
  ));

  return (
    <div className="page-content evs">
      <header>
        <h1 id="page-title">Search Events</h1>
        <p>Search the Redwood State events calendar by keyword, date range, or category.</p>
      </header>

      <form className="evs-form" onSubmit={(e) => { e.preventDefault(); setCriteria(draft); }}>
        <Field scenario="events-search-keyword-label-001" id="evs-q" label="Keyword" defect="missing" type="search" value={draft.q} onChange={(e) => setDraft({ ...draft, q: e.target.value })} />
        <Field scenario="events-search-date-label-001" id="evs-from" label="From" defect="for-mismatch" type="date" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} />
        <Field scenario="events-search-date-label-001" id="evs-to" label="To" defect="for-mismatch" type="date" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} />
        <div className="evs-cats" data-a11y-scenario="events-search-fieldset-001">
          {fieldsetFixed
            ? <fieldset><legend>Category</legend>{checkboxes}</fieldset>
            : <><p className="evs-cats-title">Category</p>{checkboxes}</>}
        </div>
        <div className="evs-actions">
          <button type="submit" className="btn btn--primary">Search</button>
          <button type="button" className="btn btn--secondary" onClick={() => { setDraft(initial); setCriteria(initial); }}>Reset</button>
        </div>
      </form>

      <section aria-labelledby="evs-results-heading" data-a11y-scenario="events-search-results-live-001">
        <h2 id="evs-results-heading">Results</h2>
        <p className="evs-count" {...(liveFixed ? { role: "status" } : {})}>{results.length} {results.length === 1 ? "event" : "events"} found</p>
        <ul className="cal-agenda-list">
          {results.map((e) => (
            <li key={e.slug}>
              <p className="cal-agenda-when">{formatWhen(e)}</p>
              <h3><Link to={`/events/${e.slug}`}>{e.title}</Link></h3>
              <p className="cal-agenda-meta">{e.location} · {categoryName(e.category)}</p>
            </li>
          ))}
        </ul>
      </section>

      <RelatedLinks title="Browse the calendar" links={[{ label: "Events Calendar", href: "/events" }, ...eventCategories.map((c) => ({ label: `${c.name} events`, href: `/events/category/${c.slug}` }))]} />
    </div>
  );
}
