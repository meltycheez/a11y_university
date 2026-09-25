// Program finder: the whole program list is prerendered; the filters narrow it in memory.
import { useId, useState } from "react";
import { Link } from "react-router";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { RelatedLinks } from "~/components/blocks";
import { colleges, departments, programs, type Program } from "~/data/catalog";
import { programContent } from "~/data/content/academics";
import { pageContent } from "~/data/content/pages";
import { CmsPage, impactedPrograms } from "../_cms";

export { inventoryMeta as meta } from "~/routes/meta";

const content = pageContent["/academics/programs"];
const collegeOf = (p: Program) => departments.find((d) => d.slug === p.department)!.college;
const levels = [
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
] as const;

export default function ProgramFinder() {
  const id = useId();
  const [college, setCollege] = useState("all");
  const [level, setLevel] = useState("all");
  const selectFixed = useScenario("academics-programs-college-select-001");
  const fieldsetFixed = useScenario("academics-programs-level-fieldset-001");
  const resetFixed = useScenario("academics-programs-reset-javascript-001");
  const statusFixed = useScenario("academics-programs-count-status-001");
  const dotFixed = useScenario("academics-programs-impacted-color-001");

  const shown = programs.filter((p) => (college === "all" || collegeOf(p) === college) && (level === "all" || p.level === level));
  const reset = () => { setCollege("all"); setLevel("all"); };

  const radios = (
    <>
      {[{ value: "all", label: "All levels" }, ...levels].map((l) => (
        <label key={l.value} className="cms-radio">
          <input type="radio" name={`${id}-level`} value={l.value} checked={level === l.value} onChange={() => setLevel(l.value)} /> {l.label}
        </label>
      ))}
    </>
  );

  return (
    <CmsPage className="cms-programs">
      <Hero title="Degree Programs" lede={content.summary} variant="banner" />
      <div className="page-content">
        <p>{content.sections[0].paragraphs?.[0]}</p>

        <form className="cms-filters" onSubmit={(e) => e.preventDefault()} aria-label="Filter programs">
          <div className="cms-filter" data-a11y-scenario="academics-programs-college-select-001">
            {selectFixed ? <label htmlFor={`${id}-college`}>College</label> : <span>College:</span>}
            <select id={`${id}-college`} value={college} onChange={(e) => setCollege(e.target.value)}>
              <option value="all">All colleges</option>
              {colleges.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          {fieldsetFixed ? (
            <fieldset className="cms-filter" data-a11y-scenario="academics-programs-level-fieldset-001">
              <legend>Degree level</legend>
              {radios}
            </fieldset>
          ) : (
            <div className="cms-filter" data-a11y-scenario="academics-programs-level-fieldset-001">
              <span>Degree level:</span>
              {radios}
            </div>
          )}
          {resetFixed
            ? <button type="button" className="cms-reset" onClick={reset} data-a11y-scenario="academics-programs-reset-javascript-001">Reset filters</button>
            : <a href="#" className="cms-reset" onClick={(e) => { e.preventDefault(); reset(); }} data-a11y-scenario="academics-programs-reset-javascript-001">Reset filters</a>}
        </form>

        <div className="cms-results-bar">
          <p role={statusFixed ? "status" : undefined} data-a11y-scenario="academics-programs-count-status-001">
            Showing {shown.length} of {programs.length} programs
          </p>
          <p className="cms-legend" data-a11y-scenario="academics-programs-impacted-color-001">
            {dotFixed ? "Programs marked “Impacted” have competitive admission." : <><span className="cms-dot" aria-hidden="true" /> Impacted program</>}
          </p>
        </div>

        {levels.map((l) => {
          const inLevel = shown.filter((p) => p.level === l.value);
          if (!inLevel.length) return null;
          return (
            <section key={l.value} className="stack">
              <h2>{l.label} programs</h2>
              {colleges.map((c) => {
                const list = inLevel.filter((p) => collegeOf(p) === c.slug);
                if (!list.length) return null;
                return (
                  <div key={c.slug} className="cms-program-group">
                    <h3>{c.name}</h3>
                    <ul className="cms-program-list">
                      {list.map((p) => (
                        <li key={p.slug}>
                          <Link to={`/academics/programs/${p.slug}`}>{p.name}, {p.degree}</Link>
                          {impactedPrograms.has(p.slug) && (dotFixed
                            ? <> <span className="cms-badge">Impacted</span></>
                            : <> <span className="cms-dot" data-a11y-scenario="academics-programs-impacted-color-001" /></>)}
                          <span className="cms-program-meta">
                            Department of {departments.find((d) => d.slug === p.department)!.name} · {programContent[p.slug].totalUnits} units
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </section>
          );
        })}
        {shown.length === 0 && <p>No programs match these filters.</p>}

        <RelatedLinks title="More ways to study" links={content.sections[0].links ?? []} />
      </div>
    </CmsPage>
  );
}
