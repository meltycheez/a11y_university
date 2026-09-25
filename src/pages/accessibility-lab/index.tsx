// Accessibility Lab index (plan 08): every registered scenario, generated entirely from the registry so it
// can never drift from what the site actually renders. Infrastructure: must itself stay fully accessible.
import { useRef, useState } from "react";
import { Link } from "react-router";
import { DataTable } from "~/components/DataTable";
import { Pagination } from "~/components/Pagination";
import { AREAS, all, areaCategoryMatrix, categoryTotals, expandPages, pageInventory, ruleCount } from "~/a11y/coverage";
import type { Area } from "~/a11y/rules";
import { scenarios, type Scenario } from "~/a11y/registry";
import { toggleFor, useA11yState, type Category } from "~/a11y/state";

export { inventoryMeta as meta } from "~/routes/meta";

const CATS: Category[] = ["error", "alert", "manual"];
const CAT_LABEL: Record<Category, string> = { error: "Errors", alert: "Alerts", manual: "Manual" };
const FIX_LABEL: Record<Category, string> = { error: "Fix Errors", alert: "Fix Alerts", manual: "Fix Manual Testing Issues" };
const TAB_LABEL = ["All", "Errors", "Alerts", "Manual Testing"];

type SortKey = "title" | "category" | "rule" | "wcag";

function detectionText(s: Scenario): string {
  const parts = [
    s.detectedBy.wave?.length ? `WAVE: ${s.detectedBy.wave.join(", ")}` : null,
    s.detectedBy.axe?.length ? `axe: ${s.detectedBy.axe.join(", ")}` : null,
  ].filter((p): p is string => p !== null);
  if (s.detectedBy.manualOnly || !parts.length) parts.push("manual");
  return parts.join(" · ");
}

function downloadRegistry() {
  const data = JSON.stringify(Object.fromEntries(scenarios), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "accessibility-lab-registry.json";
  a.click();
  URL.revokeObjectURL(url);
}

export default function AccessibilityLabIndex() {
  const state = useA11yState();
  const totals = categoryTotals();
  const matrix = areaCategoryMatrix();

  const [tab, setTab] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [area, setArea] = useState("");
  const [pageQuery, setPageQuery] = useState("");
  const [wcag, setWcag] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "title", dir: "asc" });
  const [invPage, setInvPage] = useState(1);

  const focusTab = (i: number) => {
    const next = (i + TAB_LABEL.length) % TAB_LABEL.length;
    setTab(next);
    tabRefs.current[next]?.focus();
  };
  const onTabKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => focusTab(tab + 1), ArrowLeft: () => focusTab(tab - 1), Home: () => focusTab(0), End: () => focusTab(TAB_LABEL.length - 1),
    };
    const action = keys[e.key];
    if (action) { e.preventDefault(); action(); }
  };

  const wcagOptions = [...new Set(all().flatMap((s) => s.wcag))].sort();

  const byTab = tab === 0 ? all() : all().filter((s) => s.category === CATS[tab - 1]);
  const filtered = byTab.filter((s) =>
    (!area || s.areas.includes(area as Area))
    && (!wcag || s.wcag.includes(wcag))
    && (!pageQuery || expandPages(s.pages).some((p) => p.includes(pageQuery)))
    && (!q || `${s.title} ${s.id} ${s.description}`.toLowerCase().includes(q.toLowerCase())),
  );
  const val = (s: Scenario) => (sort.key === "wcag" ? s.wcag.join(",") : sort.key === "category" ? s.category : sort.key === "rule" ? s.rule : s.title);
  const rows = [...filtered].sort((a, b) => val(a).localeCompare(val(b)) * (sort.dir === "asc" ? 1 : -1));

  const sortAria = (key: SortKey): "ascending" | "descending" | "none" =>
    sort.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : "none";
  const SortButton = ({ label, k }: { label: string; k: SortKey }) => (
    <button type="button" className="sort-btn" onClick={() => setSort((s) => ({ key: k, dir: s.key === k && s.dir === "asc" ? "desc" : "asc" }))}>
      {label}{sort.key === k && (sort.dir === "asc" ? " ▲" : " ▼")}
    </button>
  );

  const inventory = pageInventory();
  const invPageSize = 25;
  const invPageCount = Math.max(1, Math.ceil(inventory.length / invPageSize));
  const invRows = inventory.slice((invPage - 1) * invPageSize, invPage * invPageSize);

  return (
    <>
      <h1>Accessibility Lab</h1>
      <p>
        Redwood State's public pages ship with intentional, cataloged accessibility defects, plus their fixes. The floating{" "}
        <strong>Accessibility Test Controls</strong> (bottom of every page, or Alt+Shift+A) toggle three categories on and off: Fix Errors,
        Fix Alerts, and Fix Manual Testing Issues. This page lists every registered scenario, generated from the same registry the site
        renders from, so it can never drift from what a scanner or a manual tester actually finds. See{" "}
        <Link to="/accessibility">Accessibility at Redwood State</Link> for the visitor-facing statement.
      </p>

      <section aria-labelledby="summary-h" className="lab-summary">
        <h2 id="summary-h">Summary</h2>
        <dl className="lab-stats">
          {CATS.map((c) => (
            <div key={c} className="lab-stat">
              <dt>{CAT_LABEL[c]}</dt>
              <dd>{totals[c]} scenarios<br /><span className="lab-stat-toggle">{state[toggleFor[c]] ? "Fixed" : "Active"}</span></dd>
            </div>
          ))}
          <div className="lab-stat">
            <dt>Rules</dt>
            <dd>{ruleCount}</dd>
          </div>
          <div className="lab-stat">
            <dt>Total scenarios</dt>
            <dd>{all().length}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="matrix-h" className="lab-summary">
        <h2 id="matrix-h">Coverage matrix</h2>
        <p>Coverage areas by category. Every area has at least 3 scenarios across at least 3 pages.</p>
        <DataTable
          caption="Scenario counts by coverage area and category"
          rowHeader="area"
          columns={[
            { key: "area", header: "Area", render: (r) => r.area },
            ...CATS.map((c) => ({ key: c, header: CAT_LABEL[c], numeric: true, render: (r: (typeof matrix)[number]) => r.counts[c] })),
          ]}
          rows={matrix}
        />
      </section>

      <section aria-labelledby="scenarios-h" className="lab-summary">
        <h2 id="scenarios-h">Scenario table</h2>

        <div role="tablist" aria-label="Filter by category" className="lab-tabs" onKeyDown={onTabKeyDown}>
          {TAB_LABEL.map((label, i) => (
            <button
              key={label}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`lab-tab-${i}`}
              aria-selected={i === tab}
              aria-controls="lab-tabpanel"
              tabIndex={i === tab ? 0 : -1}
              className={`tab${i === tab ? " is-active" : ""}`}
              onClick={() => setTab(i)}
            >
              {label}
            </button>
          ))}
        </div>

        <form className="lab-filters" role="search" aria-label="Filter scenarios" onSubmit={(e) => e.preventDefault()}>
          <div className="field">
            <label htmlFor="lab-filter-area">Coverage area</label>
            <select id="lab-filter-area" value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="">All areas</option>
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="lab-filter-wcag">WCAG criterion</label>
            <select id="lab-filter-wcag" value={wcag} onChange={(e) => setWcag(e.target.value)}>
              <option value="">All criteria</option>
              {wcagOptions.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="lab-filter-page">Page path contains</label>
            <input id="lab-filter-page" type="text" value={pageQuery} onChange={(e) => setPageQuery(e.target.value)} placeholder="/admissions" />
          </div>
          <div className="field">
            <label htmlFor="lab-filter-q">Search</label>
            <input id="lab-filter-q" type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title, id or description" />
          </div>
        </form>
        <p role="status">{rows.length} of {byTab.length} scenarios shown.</p>

        <div id="lab-tabpanel" role="tabpanel" aria-labelledby={`lab-tab-${tab}`} className="table-wrap">
          <table className="data-table">
            <caption>Registered accessibility scenarios</caption>
            <thead>
              <tr>
                <th scope="col" aria-sort={sortAria("title")}><SortButton label="Issue" k="title" /></th>
                <th scope="col" aria-sort={sortAria("category")}><SortButton label="Category" k="category" /></th>
                <th scope="col" aria-sort={sortAria("rule")}><SortButton label="Rule" k="rule" /></th>
                <th scope="col">Page(s)</th>
                <th scope="col">Component</th>
                <th scope="col" aria-sort={sortAria("wcag")}><SortButton label="WCAG" k="wcag" /></th>
                <th scope="col">Expected detection</th>
                <th scope="col">Current status</th>
                <th scope="col">Fixed by</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const paths = expandPages(s.pages);
                const shown = paths.slice(0, 3);
                return (
                  <tr key={s.id}>
                    <th scope="row">{s.title}</th>
                    <td>{CAT_LABEL[s.category]}</td>
                    <td>{s.rule}</td>
                    <td>
                      {shown.map((p, i) => (
                        <span key={p}>{i > 0 && ", "}<Link to={`${p}?highlight=${s.id}`}>{p}</Link></span>
                      ))}
                      {paths.length > shown.length && ` +${paths.length - shown.length} more`}
                    </td>
                    <td>{s.component}</td>
                    <td>{s.wcag.join(", ")}</td>
                    <td>{detectionText(s)}</td>
                    <td>{state[toggleFor[s.category]] ? "Fixed" : "Active"}</td>
                    <td>{FIX_LABEL[s.category]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button type="button" onClick={downloadRegistry}>Download registry JSON</button>
      </section>

      <section aria-labelledby="inventory-h" className="lab-summary">
        <h2 id="inventory-h">Page inventory</h2>
        <DataTable
          caption="Every route, its tier, and its registered scenario count"
          rowHeader="path"
          columns={[
            { key: "path", header: "Path", render: (r) => <Link to={r.path}>{r.path}</Link> },
            { key: "title", header: "Title", render: (r) => r.title },
            { key: "section", header: "Section", render: (r) => r.section },
            { key: "tier", header: "Tier", render: (r) => r.tier },
            { key: "count", header: "Scenarios", numeric: true, render: (r) => r.scenarioCount },
          ]}
          rows={invRows}
        />
        <Pagination page={invPage} pageCount={invPageCount} onChange={setInvPage} label="Page inventory pages" />
      </section>
    </>
  );
}
