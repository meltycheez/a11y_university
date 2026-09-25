// Faculty directory (plan 06 #4): filter by name, department and research topic, card or table view, and
// "Load more". Filtering is instant and in memory; the full list is small and ships with the page.
import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router";
import { Field } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import { AnyLink } from "~/components/blocks";
import { departments, faculty } from "~/data/catalog";
import { facultyProfiles } from "~/data/content/people";
import { pageContent } from "~/data/content/pages";
import { CmsPage } from "../academics/_cms";

export { inventoryMeta as meta } from "~/routes/meta";

const content = pageContent["/faculty"];
const BATCH = 12;
const S = {
  photo: "faculty-dir-photo-link-empty-001",
  label: "faculty-dir-name-label-001",
  region: "faculty-dir-region-labelledby-001",
  heading: "faculty-dir-name-heading-skip-001",
  email: "faculty-dir-email-duplicate-001",
  caption: "faculty-dir-table-caption-001",
  small: "faculty-dir-phone-small-001",
  contrast: "faculty-dir-title-contrast-001",
  focus: "faculty-dir-name-focus-001",
  live: "faculty-dir-count-live-001",
  view: "faculty-dir-view-toggle-color-001",
  more: "faculty-dir-load-more-focus-001",
};
const deptName = new Map(departments.map((d) => [d.slug, d.name]));
const lastName = (name: string) => name.split(",")[0].trim().split(/\s+/).pop()!;
const people = faculty
  .map((f) => ({ ...facultyProfiles[f.slug]!, deptSlug: f.department!, deptName: deptName.get(f.department!)! }))
  .sort((a, b) => lastName(a.name).localeCompare(lastName(b.name)));
type Person = (typeof people)[number];
const deptOptions = departments.filter((d) => people.some((p) => p.deptSlug === d.slug)).sort((a, b) => a.name.localeCompare(b.name));
const has = (text: string, q: string) => text.toLowerCase().includes(q.trim().toLowerCase());

export default function FacultyDirectory() {
  const id = useId();
  const [name, setName] = useState("");
  const [dept, setDept] = useState("all");
  const [topic, setTopic] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [count, setCount] = useState(BATCH);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const regionFixed = useScenario(S.region);
  const emailFixed = useScenario(S.email);
  const captionFixed = useScenario(S.caption);
  const liveFixed = useScenario(S.live);
  const viewFixed = useScenario(S.view);
  const moreFixed = useScenario(S.more);
  useScenario(S.small); // CSS scenarios (cms.css): register only.
  useScenario(S.contrast);
  useScenario(S.focus);

  const results = people.filter((p) =>
    has(p.name, name) && (dept === "all" || p.deptSlug === dept) && (!topic.trim() || p.researchInterests.some((r) => has(r, topic))));
  const shown = results.slice(0, count);
  const filter = <T,>(set: (v: T) => void) => (v: T) => { set(v); setCount(BATCH); };

  // Fixed "Load more": move focus to the first new entry once it has rendered.
  useEffect(() => {
    if (focusIndex === null) return;
    list.current?.querySelector<HTMLElement>(`[data-index="${focusIndex}"] a.fac-name-link`)?.focus();
    setFocusIndex(null);
  }, [focusIndex]);

  const email = (p: Person) => <a href={`mailto:${p.email}`} data-a11y-scenario={S.email}>{emailFixed ? p.email : "Email"}</a>;
  const nameLink = (p: Person) => <Link to={`/faculty/${p.slug}`} className="fac-name-link" data-a11y-scenario={S.focus}>{p.name}</Link>;
  const viewButton = (v: typeof view, label: string) => (
    <button
      type="button" className={`fac-view-btn${view === v ? " is-active" : ""}`} onClick={() => setView(v)}
      aria-pressed={viewFixed ? view === v : undefined}
    >
      {label}
    </button>
  );

  return (
    <CmsPage className="cms-directory">
      <Hero title="Faculty Directory" lede={content.summary} variant="banner" />
      <div className="page-content">
        <p>
          {content.sections[0].paragraphs?.[0].replace(/ For staff.*$/, "")} For staff, see the{" "}
          <AnyLink href="/employees/directory">Employee Directory</AnyLink>.
        </p>

        <form className="cms-filters" onSubmit={(e) => e.preventDefault()} aria-label="Filter faculty">
          <Field
            scenario={S.label} id={`${id}-name`} label="Name" defect="missing" type="search" className="cms-filter fac-filter"
            value={name} onChange={(e) => filter(setName)(e.target.value)}
          />
          <div className="cms-filter fac-filter">
            <label htmlFor={`${id}-dept`}>Department</label>
            <select id={`${id}-dept`} value={dept} onChange={(e) => filter(setDept)(e.target.value)}>
              <option value="all">All departments</option>
              {deptOptions.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
            </select>
          </div>
          <div className="cms-filter fac-filter">
            <label htmlFor={`${id}-topic`}>Research topic</label>
            <input id={`${id}-topic`} type="search" value={topic} onChange={(e) => filter(setTopic)(e.target.value)} />
          </div>
        </form>

        <section
          className="fac-results" aria-labelledby={regionFixed ? "fac-results-heading" : "results-heading"}
          data-a11y-scenario={`${S.region} ${S.live}`}
        >
          <div className="cms-results-bar">
            <h2 id="fac-results-heading">Faculty</h2>
            <div className="fac-view" role="group" aria-label="View" data-a11y-scenario={S.view}>
              {viewButton("cards", "Cards")}
              {viewButton("table", "Table")}
            </div>
          </div>
          <p role={liveFixed ? "status" : undefined} className="fac-count">
            {results.length ? `Showing ${shown.length} of ${results.length} faculty` : "No faculty match these filters."}
          </p>

          <div ref={list} data-a11y-scenario={`${S.heading} ${S.caption} ${S.photo} ${S.small} ${S.contrast}`}>
            {view === "cards" ? (
              <ul className="cms-fac-list">
                {shown.map((p, i) => <FacultyCard key={p.slug} p={p} index={i} name={nameLink(p)} email={email(p)} />)}
              </ul>
            ) : (
              <div className="fac-table-wrap">
                <table className="cms-table">
                  {captionFixed && <caption>Faculty directory</caption>}
                  <thead>
                    <tr><th scope="col">Name</th><th scope="col">Title</th><th scope="col">Department</th><th scope="col">Research</th><th scope="col">Office</th><th scope="col">Phone</th><th scope="col">Email</th></tr>
                  </thead>
                  <tbody>
                    {shown.map((p, i) => (
                      <tr key={p.slug} data-index={i}>
                        <td>{nameLink(p)}</td>
                        <td>{p.title}</td>
                        <td>{p.deptName}</td>
                        <td>{p.researchInterests.slice(0, 2).join("; ")}</td>
                        <td>{p.office}</td>
                        <td>{p.phone}</td>
                        <td>{email(p)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div data-a11y-scenario={S.more}>
            {shown.length < results.length && (
              <button
                type="button" className="btn fac-more"
                onClick={() => { setCount(count + BATCH); if (moreFixed) setFocusIndex(count); }}
              >
                Load more
              </button>
            )}
          </div>
        </section>
      </div>
    </CmsPage>
  );
}

function FacultyCard({ p, index, name, email }: { p: Person; index: number; name: React.ReactNode; email: React.ReactNode }) {
  const photoFixed = useScenario(S.photo);
  const headingFixed = useScenario(S.heading);
  const H = headingFixed ? "h3" : "h4";
  const photo = <Img image={p.image} alt="" className="cms-fac-photo" sizes="5rem" aspect="1 / 1" />;
  return (
    <li className="cms-fac-card" data-index={index}>
      {photoFixed ? photo : <Link to={`/faculty/${p.slug}`} className="cms-fac-photo-link" data-a11y-scenario={S.photo}>{photo}</Link>}
      <div>
        <H className="cms-fac-name">{name}</H>
        <p className="cms-fac-title">{p.title}, {p.deptName}</p>
        <p className="cms-fac-research">{p.researchInterests.slice(0, 2).join("; ")}</p>
        <p className="cms-fac-contact">{p.office} · {p.phone} · {email}</p>
      </div>
    </li>
  );
}
