// /news/search: keyword search over RSU News stories, in memory.
import { useEffect, useState } from "react";
import { Field, IconButton } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { RelatedLinks } from "~/components/blocks";
import type { NewsArticle } from "~/data/content/news";
import { newsCategories } from "~/data/catalog";
import { StoryRow, stories } from "./_shared";

export { inventoryMeta as meta } from "~/routes/meta";

const text = (a: NewsArticle) => [a.title, a.dek, a.author, ...a.body.map((b) => (typeof b === "string" ? b : b.h2))].join(" ").toLowerCase();

function searchNews(q: string, sort: string): NewsArticle[] {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = stories.filter((a) => words.every((w) => text(a).includes(w)));
  return sort === "oldest" ? [...hits].reverse() : hits;
}

export default function NewsSearch() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState<string | null>(null);
  const [sort, setSort] = useState("newest");
  const liveFixed = useScenario("news-search-results-live-001");
  const sortFixed = useScenario("news-search-sort-label-001");

  // Read ?q= after hydration so the prerendered HTML matches the first client render (ADR-015).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) { setDraft(q); setQuery(q); }
  }, []);

  const results = query === null ? [] : searchNews(query, sort);

  return (
    <div className="news-search page-content">
      <header className="news-section-header">
        <h1 id="page-title">Search News</h1>
        <p className="news-dek">Search RSU News stories by keyword. Headlines and story text are both searched.</p>
      </header>

      <form role="search" className="news-search-form" onSubmit={(e) => { e.preventDefault(); setQuery(draft.trim()); }}>
        <Field
          scenario="news-search-query-placeholder-001"
          id="news-q"
          label="Search news stories"
          defect="placeholder"
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <IconButton scenario="news-search-submit-empty-001" label="Search" type="submit" icon="⌕" className="news-search-submit" />
        <div className="news-search-sort" data-a11y-scenario="news-search-sort-label-001">
          <label htmlFor={sortFixed ? "news-sort" : "sort"}>Sort by</label>
          <select id="news-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </form>

      <section aria-labelledby="news-results-heading" data-a11y-scenario="news-search-results-live-001">
        <h2 id="news-results-heading">Results</h2>
        <div {...(liveFixed ? { role: "status" } : {})}>
          {query === null
            ? <p>Enter a keyword, such as “redwood” or “scholarship”, and press Enter.</p>
            : <p className="news-count">{results.length} {results.length === 1 ? "story" : "stories"} found for “{query}”</p>}
        </div>
        {results.map((s) => <StoryRow key={s.slug} story={s} />)}
      </section>

      <RelatedLinks title="Browse by section" links={newsCategories.map((c) => ({ label: c.name, href: `/news/category/${c.slug}` }))} />
    </div>
  );
}
