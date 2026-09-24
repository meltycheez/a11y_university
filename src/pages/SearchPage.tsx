// Global site search. Reads ?q= after hydration (the prerendered page has no query) and keeps
// results and the type filter in memory only.
import { useEffect, useState } from "react";
import type { MetaFunction } from "react-router";
import { Form, Link, useSearchParams } from "react-router";
import { Hero } from "~/components/Hero";
import { pageTitle } from "~/data/brand";
import { search, typeLabels, type SearchResult, type SearchType } from "~/search";

export const meta: MetaFunction = () => [{ title: pageTitle("Search") }];

const types = Object.keys(typeLabels) as SearchType[];
const snippet = (s: string) => (s.length > 200 ? `${s.slice(0, 200).replace(/\s+\S*$/, "")}…` : s);

export default function SearchPage() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<SearchType | "all">("all");

  useEffect(() => {
    const q = (params.get("q") ?? "").trim();
    setQuery(q);
    setDraft(q);
    setFilter("all");
    setResults(null);
    setFailed(false);
    if (!q) return;
    let live = true;
    search(q).then((r) => live && setResults(r), () => live && setFailed(true));
    return () => { live = false; };
  }, [params]);

  const groups = types
    .map((type) => ({ type, items: (results ?? []).filter((r) => r.type === type) }))
    .filter((g) => g.items.length > 0);
  const shown = groups.filter((g) => filter === "all" || g.type === filter);

  let status = "Enter a word or phrase to search the Redwood State website.";
  if (query && failed) status = "Search is unavailable right now. Please try again later.";
  else if (query && !results) status = "Searching…";
  else if (query && results) status = results.length ? `${results.length} results for “${query}”` : `No results for “${query}”. Check the spelling or try a broader term.`;

  return (
    <>
      <Hero title="Search" variant="banner" />

      <div className="page-content">
        <Form method="get" action="/search" role="search" className="stack">
          <div>
            <label htmlFor="search-page-q">Search terms</label>{" "}
            <input id="search-page-q" name="q" type="search" value={draft} onChange={(e) => setDraft(e.target.value)} />{" "}
            <button type="submit" className="btn btn--primary">Search</button>
          </div>
        </Form>

        <p role="status">{status}</p>

        {groups.length > 1 && (
          <div role="group" aria-label="Filter results by type">
            <button type="button" className="btn btn--ghost" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
              All ({results?.length})
            </button>{" "}
            {groups.map((g) => (
              <span key={g.type}>
                <button type="button" className="btn btn--ghost" aria-pressed={filter === g.type} onClick={() => setFilter(g.type)}>
                  {typeLabels[g.type]} ({g.items.length})
                </button>{" "}
              </span>
            ))}
          </div>
        )}

        {shown.map((g) => (
          <section key={g.type} aria-labelledby={`results-${g.type}`} className="stack">
            <h2 id={`results-${g.type}`}>{typeLabels[g.type]} ({g.items.length})</h2>
            <ul>
              {g.items.map((r) => (
                <li key={r.id}>
                  <Link to={r.url}>{r.title}</Link>
                  {r.text && <p>{snippet(r.text)}</p>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
