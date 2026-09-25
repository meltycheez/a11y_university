// Global site search (plan 06 #5). Reads ?q= after hydration (the prerendered page has no query) and keeps
// results, the type facet and the "Did you mean" suggestion in memory only.
import { useEffect, useState } from "react";
import type { MetaFunction } from "react-router";
import { Form, Link, useNavigate, useSearchParams } from "react-router";
import { Field } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { pageTitle } from "~/data/brand";
import { didYouMean, search, typeLabels, type SearchResult, type SearchType } from "~/search";

export const meta: MetaFunction = () => [{ title: pageTitle("Search") }];

const types = Object.keys(typeLabels) as SearchType[];
const snippet = (s: string) => (s.length > 200 ? `${s.slice(0, 200).replace(/\s+\S*$/, "")}…` : s);
const RESULTS_MARKERS = "search-page-count-live-001 search-page-facet-state-001 search-page-facet-label-001 search-page-didyoumean-001 search-page-result-heading-001 search-page-snippet-contrast-001";

export default function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<SearchType | "all">("all");
  const liveFixed = useScenario("search-page-count-live-001");
  const stateFixed = useScenario("search-page-facet-state-001");
  const labelFixed = useScenario("search-page-facet-label-001");
  const suggestFixed = useScenario("search-page-didyoumean-001");
  const headingFixed = useScenario("search-page-result-heading-001");
  useScenario("search-page-snippet-contrast-001"); // CSS scenario (features/search.css): register only.

  useEffect(() => {
    const q = (params.get("q") ?? "").trim();
    setQuery(q);
    setDraft(q);
    setFilter("all");
    setResults(null);
    setSuggestion(null);
    setFailed(false);
    if (!q) return;
    let live = true;
    search(q).then(async (r) => {
      if (!live) return;
      setResults(r);
      const s = await didYouMean(q);
      if (live) setSuggestion(s);
    }, () => live && setFailed(true));
    return () => { live = false; };
  }, [params]);

  const groups = types
    .map((type) => ({ type, items: (results ?? []).filter((r) => r.type === type) }))
    .filter((g) => g.items.length > 0);
  const shown = groups.filter((g) => filter === "all" || g.type === filter);
  const pressed = (on: boolean) => ({ "aria-pressed": stateFixed ? on : undefined, className: `btn btn--ghost search-facet${on ? " is-active" : ""}` });
  const suggestUrl = suggestion ? `/search?q=${encodeURIComponent(suggestion)}` : "";
  const H = headingFixed ? "h3" : "h4";

  let status = "Enter a word or phrase to search the Redwood State website.";
  if (query && failed) status = "Search is unavailable right now. Please try again later.";
  else if (query && !results) status = "Searching…";
  else if (query && results) status = results.length ? `${results.length} results for “${query}”` : `No results for “${query}”. Check the spelling or try a broader term.`;

  return (
    <div className="search-page">
      <Hero title="Search" variant="banner" />

      <div className="page-content">
        <Form method="get" action="/search" role="search" className="search-page-form">
          <Field scenario="search-page-placeholder-001" id="search-page-q" label="Search terms" defect="placeholder" name="q" type="search" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button type="submit" className="btn btn--primary">Search</button>
        </Form>

        <div className="search-results" data-a11y-scenario={RESULTS_MARKERS}>
          <p role={liveFixed ? "status" : undefined} className="search-count">{status}</p>

          {suggestion && (
            <p className="search-suggestion">
              Did you mean{" "}
              {suggestFixed
                ? <Link to={suggestUrl}>{suggestion}</Link>
                : <a href="#" onClick={(e) => { e.preventDefault(); navigate(suggestUrl); }}>{suggestion}</a>}
              ?
            </p>
          )}

          {groups.length > 1 && (
            <div role="group" aria-labelledby="search-facets-label" className="search-facets">
              <span id={labelFixed ? "search-facets-label" : "search-facet-label"} className="search-facets-label">Filter by type:</span>{" "}
              <button type="button" {...pressed(filter === "all")} onClick={() => setFilter("all")}>All ({results?.length})</button>{" "}
              {groups.map((g) => (
                <span key={g.type}>
                  <button type="button" {...pressed(filter === g.type)} onClick={() => setFilter(g.type)}>{typeLabels[g.type]} ({g.items.length})</button>{" "}
                </span>
              ))}
            </div>
          )}

          {shown.map((g) => (
            <section key={g.type} aria-labelledby={`results-${g.type}`} className="stack">
              <h2 id={`results-${g.type}`}>{typeLabels[g.type]} ({g.items.length})</h2>
              <ul className="search-list">
                {g.items.map((r) => (
                  <li key={r.id}>
                    <H className="search-result-title"><Link to={r.url}>{r.title}</Link></H>
                    {r.text && <p className="search-snippet">{snippet(r.text)}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
