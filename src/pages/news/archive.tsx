// /news/archive: every story, newest first, paginated in memory.
import { useEffect, useRef, useState } from "react";
import { useScenario } from "~/a11y/useScenario";
import { RelatedLinks } from "~/components/blocks";
import { Callout } from "~/components/Callout";
import { Pagination } from "~/components/Pagination";
import { newsCategories } from "~/data/catalog";
import { categoryName, StoryRow, stories } from "./_shared";

export { inventoryMeta as meta } from "~/routes/meta";

const PER_PAGE = 5;

export default function NewsArchive() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const focusFixed = useScenario("news-archive-focus-001");
  const statusFixed = useScenario("news-archive-status-001");
  const selectFixed = useScenario("news-archive-select-label-001");
  useScenario("news-archive-meta-small-001"); // CSS scenario (magazine.css)
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  const list = category ? stories.filter((s) => s.category === category) : stories;
  const pageCount = Math.ceil(list.length / PER_PAGE);
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const from = (page - 1) * PER_PAGE + 1;

  // Defective: focus stays on the clicked pagination button, which disappears or is disabled on the last page.
  useEffect(() => {
    if (moved.current && focusFixed) headingRef.current?.focus();
  }, [page, focusFixed]);
  const changePage = (p: number) => { moved.current = true; setPage(p); };

  return (
    <div className="news-archive page-content">
      <header className="news-section-header">
        <h1 id="page-title">News Archive</h1>
        <p className="news-dek">Every RSU News story, newest first.</p>
      </header>

      <div className="news-archive-tools" data-a11y-scenario="news-archive-select-label-001">
        {selectFixed ? <label htmlFor="archive-category">Section</label> : <span className="news-tool-label">Section</span>}
        <select id="archive-category" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All sections</option>
          {newsCategories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      <section aria-labelledby="archive-results" className="news-archive-list" data-a11y-scenario="news-archive-focus-001 news-archive-meta-small-001">
        <h2 id="archive-results" ref={headingRef} tabIndex={-1}>
          {category ? `${categoryName(category)} stories` : "All stories"}
        </h2>
        <p className="news-count" data-a11y-scenario="news-archive-status-001" {...(statusFixed ? { role: "status" } : {})}>
          Showing {from}–{from + shown.length - 1} of {list.length} stories
        </p>
        {shown.map((s) => <StoryRow key={s.slug} story={s} />)}
        <Pagination page={page} pageCount={pageCount} onChange={changePage} label="News archive pages" />
      </section>

      <Callout title="Looking for older stories?">
        <p>Stories published before 2018 are available in the Local History Archives at Sequoia Library.</p>
      </Callout>
      <RelatedLinks title="More from RSU News" links={[{ label: "Search News", href: "/news/search" }, { label: "Arcadia Falls Local History Archives", href: "/library/guides/local-history-archives" }]} />
    </div>
  );
}
