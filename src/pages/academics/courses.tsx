// Course search (plan 06 #1). The course list comes from a build-time loader; searches run in memory behind
// fake latency, and the plan lives in a module store (survives client navigation, resets on reload).
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLoaderData, useLocation } from "react-router";
import { Field, IconButton } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Pagination } from "~/components/Pagination";
import { Toast } from "~/components/widgets";
import { AnyLink } from "~/components/blocks";
import courses from "~/data/generated/courses.json";
import type { Course } from "~/data/types";
import { pageContent } from "~/data/content/pages";
import { createStore, latency } from "~/lib/interactive";
import { CmsPage } from "./_cms";
import { matches, type Criteria } from "./_coursesSearch";

export { inventoryMeta as meta } from "~/routes/meta";

// Runs at build time only (prerender): only the fields the page shows reach the client.
export function loader() {
  return (courses as Course[]).map(({ id, code, subjectName, level, title, credits, terms, description, prerequisites, sections }) => ({
    id, code, subjectName, level, title, credits, terms, description, prerequisites,
    sections: sections.map(({ crn, section, term, instructor, mode, days, start, end, room, capacity, enrolled, waitlist }) =>
      ({ crn, section, term, instructor, mode, days, start, end, room, capacity, enrolled, waitlist })),
  }));
}
export type CourseRowData = ReturnType<typeof loader>[number];

const PAGE_SIZE = 20;
const content = pageContent["/academics/courses"];
const S = {
  keyword: "courses-keyword-label-001",
  semester: "courses-semester-select-001",
  add: "courses-add-button-empty-001",
  fieldset: "courses-facets-fieldset-001",
  caption: "courses-sections-caption-001",
  live: "courses-results-live-001",
  expand: "courses-expand-state-001",
  status: "courses-add-status-001",
  remove: "courses-plan-remove-focus-001",
  seats: "courses-seats-color-001",
  prereq: "courses-prereq-contrast-001",
};
const initial: Criteria = { q: "", subject: "all", term: "all", levels: [], credits: [] };
const planStore = createStore<string[]>([]);
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export default function CourseSearch() {
  const all = useLoaderData<typeof loader>();
  const id = useId();
  const [draft, setDraft] = useState(initial);
  const [applied, setApplied] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const run = useRef(0);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const semesterFixed = useScenario(S.semester);
  const fieldsetFixed = useScenario(S.fieldset);
  const liveFixed = useScenario(S.live);
  const dismiss = useCallback(() => setToast(null), []);

  const search = useCallback(async (next: Criteria) => {
    const n = ++run.current;
    setLoading(true);
    await latency(JSON.stringify(next));
    if (n !== run.current) return; // a newer search started
    setApplied(next);
    setPage(1);
    setLoading(false);
  }, []);
  /** Facets and selects apply as soon as they change; the keyword applies on submit. */
  const update = (patch: Partial<Criteria>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    void search({ ...next, q: applied.q });
  };

  // ?q= from global search results (ADR-015): read after hydration, never during render.
  const { search: qs } = useLocation();
  useEffect(() => {
    const q = new URLSearchParams(qs).get("q");
    if (!q) return;
    const next = { ...initial, q };
    setDraft(next);
    void search(next);
  }, [qs, search]);

  const subjects = [...new Set(all.map((c) => c.subjectName))].sort();
  const credits = [...new Set(all.map((c) => c.credits))].sort((a, b) => a - b);
  const results = all.filter((c) => matches(c, applied));
  const pageCount = Math.ceil(results.length / PAGE_SIZE);
  const shown = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const byId = new Map(all.map((c) => [c.id, c]));

  const facet = (legend: string, children: React.ReactNode) =>
    fieldsetFixed
      ? <fieldset className="courses-facet" data-a11y-scenario={S.fieldset}><legend>{legend}</legend>{children}</fieldset>
      : <div className="courses-facet" data-a11y-scenario={S.fieldset}><p><strong>{legend}</strong></p>{children}</div>;
  const check = (label: string, checked: boolean, onChange: () => void) => (
    <label key={label} className="courses-check"><input type="checkbox" checked={checked} onChange={onChange} /> {label}</label>
  );

  return (
    <CmsPage className="cms-courses">
      <Hero title="Course Search" lede={content.summary} variant="banner" />
      <div className="page-content">
        <p>
          {content.sections[0].paragraphs?.[0]} See <AnyLink href="/portal/registration">Registration</AnyLink> for your time ticket.
        </p>

        <form role="search" aria-label="Courses" className="courses-form" onSubmit={(e) => { e.preventDefault(); void search(draft); }}>
          <Field
            scenario={S.keyword} id={`${id}-q`} label="Keyword" defect="missing" type="search" className="courses-field courses-field--q"
            value={draft.q} onChange={(e) => setDraft({ ...draft, q: e.target.value })}
            hint="Course code, title, instructor or topic"
          />
          <div className="field courses-field">
            <label htmlFor={`${id}-subject`}>Subject</label>
            <select id={`${id}-subject`} value={draft.subject} onChange={(e) => update({ subject: e.target.value })}>
              <option value="all">All subjects</option>
              {subjects.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="field courses-field" data-a11y-scenario={S.semester}>
            {semesterFixed ? <label htmlFor={`${id}-term`}>Semester</label> : <span className="field-label">Semester</span>}
            <select id={`${id}-term`} value={draft.term} onChange={(e) => update({ term: e.target.value })}>
              <option value="all">Fall 2026 and Spring 2027</option>
              <option>Fall 2026</option>
              <option>Spring 2027</option>
            </select>
          </div>
          <button type="submit" className="btn">Search</button>
        </form>

        <div className="courses-layout">
          <div className="courses-facets">
            {facet("Level", (["undergraduate", "graduate"] as const).map((l) =>
              check(l === "graduate" ? "Graduate" : "Undergraduate", draft.levels.includes(l), () => update({ levels: toggle(draft.levels, l) }))))}
            {facet("Credits", credits.map((n) =>
              check(String(n), draft.credits.includes(n), () => update({ credits: toggle(draft.credits, n) }))))}
          </div>

          <section className="courses-results" aria-labelledby={`${id}-results`}>
            <h2 id={`${id}-results`} ref={resultsHeading} tabIndex={-1}>Results</h2>
            <div className="cms-results-bar">
              <p role={liveFixed ? "status" : undefined} data-a11y-scenario={S.live}>
                {loading ? "Searching…" : results.length
                  ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${(page - 1) * PAGE_SIZE + shown.length} of ${results.length} courses`
                  : "No courses match your search."}
              </p>
            </div>
            <ul className="courses-list" aria-busy={loading || undefined} data-a11y-scenario={`${S.expand} ${S.caption} ${S.seats} ${S.prereq}`}>
              {shown.map((c) => <CourseRow key={c.id} course={c} term={applied.term} byId={byId} onAdded={setToast} />)}
            </ul>
            <Pagination
              page={page} pageCount={pageCount} label="Results pages"
              onChange={(p) => { setPage(p); resultsHeading.current?.focus(); }}
            />
          </section>

          <CoursePlan byId={byId} />
        </div>
        <Toast message={toast} onDismiss={dismiss} scenario={S.status} defect="vanishes" />
      </div>
    </CmsPage>
  );
}

function CourseRow({ course: c, term, byId, onAdded }: {
  course: CourseRowData; term: string; byId: Map<string, CourseRowData>; onAdded: (msg: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const plan = planStore.use();
  const expandFixed = useScenario(S.expand);
  const captionFixed = useScenario(S.caption);
  const seatsFixed = useScenario(S.seats);
  useScenario(S.prereq); // CSS scenario (courses.css): register only.
  const inPlan = plan.includes(c.id);
  const detailsId = `course-${c.id}-details`;
  const sections = c.sections.filter((s) => term === "all" || s.term === term);

  return (
    <li className={`course-row${open ? " is-open" : ""}`}>
      <div className="course-row-head">
        <button
          type="button" className="course-toggle" onClick={() => setOpen(!open)}
          aria-expanded={expandFixed ? open : undefined} aria-controls={expandFixed ? detailsId : undefined}
        >
          <span className="course-code">{c.code}</span> {c.title}
        </button>
        <span className="course-credits">{c.credits} {c.credits === 1 ? "credit" : "credits"}</span>
        <IconButton
          scenario={S.add} icon={inPlan ? "−" : "+"} className={`course-add${inPlan ? " is-added" : ""}`}
          label={inPlan ? `Remove ${c.code} from plan` : `Add ${c.code} to plan`}
          onClick={() => {
            planStore.set((p) => toggle(p, c.id));
            onAdded(inPlan ? `${c.code} removed from your plan.` : `${c.code} added to your plan.`);
          }}
        />
      </div>
      <div id={detailsId} className="course-details" hidden={!open}>
        <p>{c.description}</p>
        <p className="course-prereq">
          Prerequisites: {c.prerequisites.length ? c.prerequisites.map((p) => byId.get(p)?.code ?? p).join(", ") : "none"}
          {" · "}{c.level === "graduate" ? "Graduate" : "Undergraduate"} · Offered {c.terms.join(", ")}
        </p>
        {sections.length ? (
          <div className="courses-table-wrap">
            <table className="cms-table">
              {captionFixed && <caption>Sections of {c.code}</caption>}
              <thead>
                <tr><th scope="col">CRN</th><th scope="col">Section</th><th scope="col">Term</th><th scope="col">Days and time</th><th scope="col">Room</th><th scope="col">Instructor</th><th scope="col">Seats</th></tr>
              </thead>
              <tbody>
                {sections.map((s) => {
                  const full = s.enrolled >= s.capacity;
                  return (
                    <tr key={s.crn}>
                      <td>{s.crn}</td>
                      <td>{s.section}</td>
                      <td>{s.term}</td>
                      <td>{s.days ? `${s.days} ${s.start}–${s.end}` : "Asynchronous"}</td>
                      <td>{s.room || s.mode}</td>
                      <td>{s.instructor}</td>
                      <td className={full ? "cms-full" : undefined}>
                        {s.enrolled}/{s.capacity}
                        {full && seatsFixed && <> <span className="cms-badge">Full</span>{s.waitlist > 0 && ` (${s.waitlist} on waitlist)`}</>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <p>Not offered in {term}.</p>}
      </div>
    </li>
  );
}

function CoursePlan({ byId }: { byId: Map<string, CourseRowData> }) {
  const plan = planStore.use();
  const heading = useRef<HTMLHeadingElement>(null);
  const focusFixed = useScenario(S.remove);
  const planned = plan.map((p) => byId.get(p)!).filter(Boolean);
  const total = planned.reduce((n, c) => n + c.credits, 0);

  return (
    <aside className="courses-plan" aria-labelledby="course-plan-heading" data-a11y-scenario={S.remove}>
      <h2 id="course-plan-heading" ref={heading} tabIndex={-1}>My course plan</h2>
      {planned.length ? (
        <>
          <ul>
            {planned.map((c) => (
              <li key={c.id}>
                <span><strong>{c.code}</strong> {c.title} ({c.credits})</span>
                <button
                  type="button" className="cms-reset"
                  onClick={() => { planStore.set((p) => p.filter((x) => x !== c.id)); if (focusFixed) heading.current?.focus(); }}
                >
                  Remove <span className="visually-hidden">{c.code}</span>
                </button>
              </li>
            ))}
          </ul>
          <p><strong>Total: {total} credits</strong></p>
        </>
      ) : <p>No courses yet. Use the + button on a course to add it.</p>}
      <p className="courses-plan-note">Your plan is kept only while this tab is open. Register in RedwoodConnect.</p>
    </aside>
  );
}
