// /library/search: OneSearch results with format and availability facets over a sample catalog, in memory.
import { useEffect, useState } from "react";
import { Field, IconButton } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { RelatedLinks } from "~/components/blocks";
import { formatDate } from "~/data/site";
import { records, type CatalogRecord, type Format } from "./_data";

export { inventoryMeta as meta } from "~/routes/meta";

const FORMATS: Format[] = ["Book", "eBook", "Article", "Archival", "Video"];
const AVAIL = [
  { id: "now", label: "Available now", test: (r: CatalogRecord) => r.status === "Available" || r.status === "Online" },
  { id: "online", label: "Online", test: (r: CatalogRecord) => r.status === "Online" },
];

const match = (r: CatalogRecord, q: string) => {
  const hay = [r.title, r.author, r.source ?? "", ...r.subjects].join(" ").toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
};

export default function LibrarySearch() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [formats, setFormats] = useState<string[]>([]);
  const [avail, setAvail] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const fieldsetFixed = useScenario("library-search-facets-fieldset-001");
  const liveFixed = useScenario("library-search-results-live-001");
  const colorFixed = useScenario("library-search-status-color-001");

  // Honor ?q= and ?format= from the home page search box after hydration (ADR-015 pattern).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const q = p.get("q") ?? "";
    setDraft(q); setQuery(q);
    const f = p.get("format");
    if (f) setFormats([f]);
  }, []);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const results = records.filter((r) =>
    match(r, query) && (!formats.length || formats.includes(r.format)) && avail.every((a) => AVAIL.find((x) => x.id === a)!.test(r)));

  const group = (title: string, body: React.ReactNode) =>
    fieldsetFixed
      ? <fieldset className="lib-facet"><legend>{title}</legend>{body}</fieldset>
      : <div className="lib-facet"><p className="lib-facet-title">{title}</p>{body}</div>;

  return (
    <div className="page-content lib-search-page">
      <header>
        <h1 id="page-title">Library Search</h1>
        <p>OneSearch searches the library catalog, most article databases, and digital collections at once. Off-campus access requires your RedwoodConnect login.</p>
      </header>

      <form role="search" className="lib-search-row lib-search-row--page" onSubmit={(e) => { e.preventDefault(); setQuery(draft.trim()); }}>
        <Field scenario="library-search-input-label-001" id="onesearch-q" label="Search OneSearch" defect="for-mismatch" type="search" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <button type="submit" className="btn btn--primary">Search</button>
      </form>

      <div className="lib-results-layout">
        <aside className="lib-facets" aria-label="Refine results" data-a11y-scenario="library-search-facets-fieldset-001">
          <h2>Refine results</h2>
          {group("Format", FORMATS.map((f) => (
            <label key={f} className="lib-check"><input type="checkbox" checked={formats.includes(f)} onChange={() => toggle(formats, setFormats, f)} /> {f} <span className="lib-facet-count">({records.filter((r) => r.format === f && match(r, query)).length})</span></label>
          )))}
          {group("Availability", AVAIL.map((a) => (
            <label key={a.id} className="lib-check"><input type="checkbox" checked={avail.includes(a.id)} onChange={() => toggle(avail, setAvail, a.id)} /> {a.label}</label>
          )))}
        </aside>

        <section aria-labelledby="lib-results-heading" className="lib-results" data-a11y-scenario="library-search-results-live-001 library-search-status-color-001">
          <h2 id="lib-results-heading" className="visually-hidden">Results</h2>
          <p className="lib-count" {...(liveFixed ? { role: "status" } : {})}>
            {results.length} {results.length === 1 ? "result" : "results"}{query && <> for <strong>{query}</strong></>}
          </p>
          <ol className="lib-result-list">
            {results.map((r) => (
              <li key={r.id} className="lib-result">
                <div>
                  <p className="lib-result-format">{r.format}</p>
                  <h3 className="lib-result-title">{r.title}</h3>
                  <p className="lib-result-meta">{r.author} · {r.year}{r.source && <> · <em>{r.source}</em></>}</p>
                  <p className="lib-result-meta">
                    <span className={`lib-status lib-status--${r.status === "Checked out" ? "out" : "in"}`} aria-hidden={colorFixed ? "true" : undefined} />
                    {colorFixed && <strong>{r.status}{r.due && `, due ${formatDate(r.due)}`}</strong>}
                    {colorFixed && " · "}{r.location}{r.callNumber && ` · ${r.callNumber}`}
                  </p>
                </div>
                <IconButton
                  scenario="library-search-save-empty-001"
                  label={`Save ${r.title} to my list`}
                  icon={saved.includes(r.id) ? "★" : "☆"}
                  className={`lib-save${saved.includes(r.id) ? " is-saved" : ""}`}
                  onClick={() => toggle(saved, setSaved, r.id)}
                />
              </li>
            ))}
          </ol>
          {results.length === 0 && <p>No results. Try fewer words, or search Databases A–Z for article databases in your subject.</p>}
        </section>
      </div>

      <RelatedLinks title="More ways to search" links={[{ label: "Databases A–Z", href: "/library/databases" }, { label: "Research Guides", href: "/library/guides" }, { label: "Arcadia Falls Local History Archives", href: "/library/guides/local-history-archives" }]} />
    </div>
  );
}
