// /academics/catalog: General Catalog 2025-2026, one of the six terrible pages (plan 07; tier T). A PDF-era
// course catalog kept as an HTML page and never modernized: h1-to-h4 heading jumps, 300-plus identical "View"
// links, tables with broken header associations, and a subject menu that only opens on mouse hover.
// Scenarios: src/a11y/registry/academics.ts (academics-catalog-*). CSS: styles/features/catalog.css.
import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useFixes } from "~/a11y/useFixes";
import { academicsScenarios } from "~/a11y/registry/academics";
import { Accordion } from "~/components/Accordion";
import { Hero } from "~/components/Hero";
import { Tabs } from "~/components/Tabs";
import courses from "~/data/generated/courses.json";
import type { Course } from "~/data/types";
import { CmsPage } from "./_cms";

export { inventoryMeta as meta } from "~/routes/meta";

type Fix = (key: string) => boolean;
type Id = (key: string) => string;
type Mark = (...keys: string[]) => { "data-a11y-scenario": string };

const svg = (s: string) => `data:image/svg+xml,${encodeURIComponent(s)}`;
const SUBJECT_ICON = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="1" width="12" height="14" fill="none" stroke="#5a1f14" stroke-width="1.1"/><path d="M4 4h8M4 7h8M4 10h5" stroke="#5a1f14" stroke-width="1"/></svg>`);
const UP_ARROW = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path d="M6 1l5 6H8v4H4V7H1z" fill="#5a1f14"/></svg>`);
const PDF_ICON = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="1" width="10" height="14" fill="none" stroke="#333" stroke-width="1"/><path d="M12 1l3 3h-3z" fill="none" stroke="#333" stroke-width="1"/></svg>`);
const PRINT_ICON = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="1" width="10" height="4" fill="none" stroke="#333" stroke-width="1"/><rect x="1" y="5" width="14" height="6" fill="none" stroke="#333" stroke-width="1"/><rect x="4" y="10" width="8" height="5" fill="none" stroke="#333" stroke-width="1"/></svg>`);

export function loader() {
  return (courses as Course[]).map(({ id, code, subject, subjectName, department, number, level, title, credits, description, prerequisites }) => ({
    id, code, subject, subjectName, department, number, level, title, credits, description, prerequisites,
  }));
}
export type CatalogCourse = ReturnType<typeof loader>[number];

const catalogDefs = academicsScenarios.filter((s) => s.pages.includes("/academics/catalog"));

export default function CatalogPage() {
  const all = useLoaderData<typeof loader>();
  const { fix, id, mark } = useFixes(catalogDefs, "academics-catalog-");
  const [fourCreditsOnly, setFourCreditsOnly] = useState(false);
  const [noPrereqOnly, setNoPrereqOnly] = useState(false);

  const subjects = [...new Set(all.map((c) => c.subject))].sort();
  const forLevel = (level: "undergraduate" | "graduate") =>
    all.filter((c) => c.level === level && (!fourCreditsOnly || c.credits === 4) && (!noPrereqOnly || c.prerequisites.length === 0));

  const jumpFixed = fix("jump-select");
  const orphanFixed = fix("orphan-label");
  const filtersFixed = fix("quick-filter");
  const filtersMarker = id("quick-filter");
  const checks = (
    <>
      <label className="catalog-check"><input type="checkbox" checked={fourCreditsOnly} onChange={(e) => setFourCreditsOnly(e.target.checked)} /> 4 credits only</label>
      <label className="catalog-check"><input type="checkbox" checked={noPrereqOnly} onChange={(e) => setNoPrereqOnly(e.target.checked)} /> No prerequisites</label>
    </>
  );

  return (
    <CmsPage className="old-catalog">
      <div id="catalog-top" />
      <Hero title="General Catalog 2025–2026" kicker="Academics" lede="Every course offered by Redwood State University, organized by subject." variant="banner" />
      <div className="page-content" data-a11y-scenario={mark("reflow", "focus-outline")["data-a11y-scenario"]}>
        <p className="catalog-intro" data-a11y-scenario={mark("intro-justified", "underline")["data-a11y-scenario"]}>
          This catalog lists every course offered for the 2025–2026 academic year. Course numbers below 300 are
          lower-division; 300 and above are upper-division. This catalog is{" "}
          {fix("underline") ? <b>revised annually</b> : <u>revised annually</u>} to reflect curriculum changes
          approved by the Faculty Senate.
        </p>

        <SubjectMenu subjects={subjects} fix={fix} mark={mark} />
        <IndexBox subjects={subjects} fix={fix} id={id} />

        <div className="catalog-jump-select">
          {!orphanFixed && <label data-a11y-scenario={id("orphan-label")}>Catalog year</label>}
          {jumpFixed ? <label htmlFor="catalog-jump">Jump to subject</label> : <span className="field-label">Jump to subject</span>}
          <select
            id="catalog-jump"
            defaultValue=""
            data-a11y-scenario={id("jump-select")}
            onChange={(e) => { if (e.target.value) document.getElementById(`subject-${e.target.value}`)?.scrollIntoView(); e.target.value = ""; }}
          >
            <option value="" disabled>Choose a subject</option>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <GenEdNotes id={id} />

        <form className="catalog-quick-filters" onSubmit={(e) => e.preventDefault()}>
          {filtersFixed ? (
            <fieldset data-a11y-scenario={filtersMarker}><legend>Quick filters</legend>{checks}</fieldset>
          ) : (
            <div data-a11y-scenario={filtersMarker}>{checks}</div>
          )}
        </form>

        <Tabs
          label="Course level"
          scenario={id("tabs-level")}
          defect="broken-keys"
          tabs={[
            { label: "Undergraduate", content: <SubjectGroups courses={forLevel("undergraduate")} fix={fix} id={id} mark={mark} /> },
            { label: "Graduate", content: <SubjectGroups courses={forLevel("graduate")} fix={fix} id={id} mark={mark} /> },
          ]}
        />

        <p className="catalog-downloads">
          <img src={PDF_ICON} alt={fix("pdf-icon-alt") ? "" : undefined} width={16} height={16} data-a11y-scenario={id("pdf-icon-alt")} />{" "}
          <SmartLink scenario={id("download-pdf")} to="/documents/tuition-schedule-2025-26.pdf" fileInfo="PDF, 2 KB">Download the catalog</SmartLink>
          {" · "}
          <img src={PRINT_ICON} alt={fix("print-icon-alt") ? "" : "Print-friendly version"} width={16} height={16} data-a11y-scenario={id("print-icon-alt")} />{" "}
          <SmartLink scenario={id("print-window")} to="/academics/catalog" newWindow>Print-friendly version</SmartLink>
        </p>
      </div>
    </CmsPage>
  );
}

function SubjectMenu({ subjects, fix, mark }: { subjects: string[]; fix: Fix; mark: Mark }) {
  const listFixed = fix("subject-menu-list");
  const hoverFixed = fix("subject-menu-hover");
  const ariaFixed = fix("subject-menu-aria");
  const eventFixed = fix("subject-menu-event");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    for (const li of wrapRef.current?.querySelectorAll("li") ?? []) {
      if (!eventFixed) {
        li.setAttribute("onmouseover", "this.style.background='#ffe9a8'");
        li.setAttribute("onmouseout", "this.style.background=''");
      } else {
        li.removeAttribute("onmouseover");
        li.removeAttribute("onmouseout");
        li.removeAttribute("style");
      }
    }
  });

  const List = listFixed ? "ul" : "div";
  return (
    <div
      ref={wrapRef}
      className={`catalog-subject-menu${hoverFixed ? "" : " is-hover-only"}`}
      data-a11y-scenario={mark("subject-menu-list", "subject-menu-hover", "subject-menu-event", "subject-menu-aria")["data-a11y-scenario"]}
    >
      {hoverFixed
        ? <button type="button" aria-expanded={open} aria-controls="catalog-subject-list" onClick={() => setOpen((o) => !o)}>Jump to subject</button>
        : <span className="catalog-subject-trigger">Jump to subject ▾</span>}
      <List id="catalog-subject-list" className="catalog-subject-list" hidden={hoverFixed ? !open : undefined}>
        {subjects.map((s) => (
          <li key={s} role={ariaFixed ? undefined : "option"} aria-selected={ariaFixed ? undefined : false}>
            <a href={`#subject-${s}`}>{s}</a>
          </li>
        ))}
      </List>
    </div>
  );
}

function IndexBox({ subjects, fix, id }: { subjects: string[]; fix: Fix; id: Id }) {
  const layoutFixed = fix("index-table");
  const half = Math.ceil(subjects.length / 2);
  const cols = [subjects.slice(0, half), subjects.slice(half)];
  return layoutFixed ? (
    <div className="catalog-index catalog-index--grid" data-a11y-scenario={id("index-table")}>
      <p className="catalog-index-label">Subjects in this catalog:</p>
      {subjects.map((s) => <a key={s} href={`#subject-${s}`}>{s}</a>)}
    </div>
  ) : (
    <table className="catalog-index" data-a11y-scenario={id("index-table")}>
      <caption className="visually-hidden">Subjects in this catalog</caption>
      <tbody>
        {Array.from({ length: half }, (_, i) => (
          <tr key={i}>
            <td>{cols[0][i] && <a href={`#subject-${cols[0][i]}`}>{cols[0][i]}</a>}</td>
            <td>{cols[1][i] && <a href={`#subject-${cols[1][i]}`}>{cols[1][i]}</a>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GenEdNotes({ id }: { id: Id }) {
  const items = [
    { title: "Area A: Written Communication", content: <p>Two courses, at least one at the 200 level or above.</p> },
    { title: "Area B: Quantitative Reasoning", content: <p>One course from the approved quantitative reasoning list.</p> },
    { title: "Area C: Arts & Humanities", content: <p>Two courses from at least two different subjects.</p> },
  ];
  return (
    <div className="catalog-gen-ed">
      <h2>General Education Notes</h2>
      <Accordion items={items} scenario={id("accordion-notes")} defect="no-state" />
    </div>
  );
}

function SubjectGroups({ courses, fix, id, mark }: { courses: CatalogCourse[]; fix: Fix; id: Id; mark: Mark }) {
  const groups = new Map<string, CatalogCourse[]>();
  for (const c of courses) (groups.get(c.subject) ?? groups.set(c.subject, []).get(c.subject)!).push(c);
  const sorted = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  if (!sorted.length) return <p>No courses match your filters.</p>;
  return <>{sorted.map(([subject, rows]) => <CatalogSubject key={subject} subject={subject} rows={rows} fix={fix} id={id} mark={mark} />)}</>;
}

function CatalogSubject({ subject, rows, fix, id, mark }: { subject: string; rows: CatalogCourse[]; fix: Fix; id: Id; mark: Mark }) {
  const HeadingTag = fix("heading-skip") ? "h2" : "h4";
  const altFixed = fix("subject-icon-alt");
  const titleFixed = fix("subject-icon-title");
  const groupFixed = fix("heading-possible");
  const impactedFixed = fix("impacted-color");
  const backTopFixed = fix("back-to-top");
  const dupFixed = fix("dup-id");
  const subjectName = rows[0].subjectName;
  const isImpacted = rows[0].department === "computer-science" || rows[0].department === "nursing";
  const dupCandidate = subject === "ART" || subject === "MUS";
  const noteId = dupFixed || !dupCandidate ? `subject-notes-${subject}` : "subject-notes";
  const lower = rows.filter((c) => c.number < 300);
  const upper = rows.filter((c) => c.number >= 300);

  const group = (label: string, list: CatalogCourse[]) => list.length > 0 && (
    <div key={label}>
      {groupFixed ? <h3>{label}</h3> : <p className="fake-heading"><strong>{label}</strong></p>}
      <CourseTable label={label} subjectName={subjectName} rows={list} fix={fix} mark={mark} />
    </div>
  );

  return (
    <section
      id={`subject-${subject}`}
      className="catalog-subject"
      data-a11y-scenario={mark("heading-skip", "subject-icon-alt", "subject-icon-title", "impacted-color", "dup-id", "heading-possible", "back-to-top")["data-a11y-scenario"]}
    >
      <HeadingTag>
        <img src={SUBJECT_ICON} alt={altFixed ? "" : "subj.gif"} title={!altFixed || titleFixed ? undefined : "subj.gif"} width={16} height={16} />{" "}
        {subjectName}
        {isImpacted && (impactedFixed
          ? <span className="catalog-impacted-text"> (impacted enrollment)</span>
          : <span className="catalog-impacted-dot" aria-hidden="true" />)}
      </HeadingTag>
      <p id={noteId} className="catalog-subject-note">{rows.length} courses offered in {subjectName}.</p>
      {group("Lower Division Courses", lower)}
      {group("Upper Division Courses", upper)}
      <a href="#catalog-top" className="catalog-back-top" aria-label={backTopFixed ? "Back to top" : undefined}>
        <img src={UP_ARROW} alt="" width={12} height={12} />
      </a>
    </section>
  );
}

function CourseTable({ label, subjectName, rows, fix, mark }: { label: string; subjectName: string; rows: CatalogCourse[]; fix: Fix; mark: Mark }) {
  const captionFixed = fix("table-caption");
  const headersFixed = fix("table-headers");
  const h = (col: string) => ({ headers: headersFixed ? `col-${col}` : col });

  return (
    <div
      className="catalog-table-wrap"
      data-a11y-scenario={mark("table-caption", "table-headers", "desc-small", "desc-contrast", "table-border", "desc-clip", "view-link")["data-a11y-scenario"]}
    >
      <table className="data-table catalog-table">
        {captionFixed && <caption>{subjectName} — {label}</caption>}
        <thead>
          <tr>
            <th id="col-code" scope="col">Code</th>
            <th id="col-title" scope="col">Title</th>
            <th id="col-credits" scope="col">Credits</th>
            <th id="col-desc" scope="col">Description</th>
            <th id="col-view" scope="col"><span className="visually-hidden">View</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id}>
              <td {...h("code")}>{c.code}</td>
              <td {...h("title")}>{c.title}</td>
              <td {...h("credits")}>{c.credits}</td>
              <td {...h("desc")} className="catalog-desc">{c.description}</td>
              <td {...h("view")}>
                <SmartLink scenario="academics-catalog-view-link-001" to={`/academics/courses?q=${encodeURIComponent(c.code)}`} defect="View">
                  {c.code}: {c.title}
                </SmartLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
