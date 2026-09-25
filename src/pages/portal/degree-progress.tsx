// /portal/degree-progress: degree audit with expandable requirement groups.
import { Link, useLoaderData } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { Accordion } from "~/components/Accordion";
import { useScenario } from "~/a11y/useScenario";
import portal from "~/data/generated/portal.json";
import type { AuditCourse, AuditGroup, PortalStudent } from "~/data/types";
import { PortalPage } from "./_PortalPage";

export { inventoryMeta as meta } from "~/routes/meta";

const statusText: Record<AuditCourse["status"], string> = { complete: "Complete", "in-progress": "In progress", "not-started": "Not started" };

export async function loader() {
  const p = portal as unknown as PortalStudent;
  return {
    audit: p.degreeAudit,
    summary: [
      ["Program", p.major],
      ["Catalog year", p.catalogYear],
      ["Class standing", p.classStanding],
      ["Expected graduation", p.expectedGraduation],
      ["Advisor", p.advisor],
      ["Cumulative GPA", p.cumulativeGpa.toFixed(2)],
    ],
    advisorSlug: p.advisorSlug,
  };
}

export default function DegreeProgressPage() {
  const { audit, summary, advisorSlug } = useLoaderData<typeof loader>();
  const layoutFixed = useScenario("portal-audit-summary-layout-001");
  const remaining = audit.totalRequired - audit.completed - audit.inProgress;

  return (
    <PortalPage title="Degree Progress" subtitle="Unofficial degree audit · run 10/05/2026">
      <section className="pt-card" aria-labelledby="audit-summary">
        <h2 id="audit-summary">Audit Summary</h2>
        <div data-a11y-scenario="portal-audit-summary-layout-001">
          {layoutFixed ? (
            <dl className="pt-dl pt-dl--row">
              {summary.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          ) : (
            <table className="pt-layout">
              <tbody>
                {[0, 2, 4].map((i) => (
                  <tr key={i}>
                    <td className="pt-layout-label">{summary[i][0]}:</td><td>{summary[i][1]}</td>
                    <td className="pt-layout-label">{summary[i + 1][0]}:</td><td>{summary[i + 1][1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <ProgressBar completed={audit.completed} inProgress={audit.inProgress} total={audit.totalRequired} />
        <p>
          <strong>{audit.completed}</strong> credits complete, <strong>{audit.inProgress}</strong> in progress, <strong>{remaining}</strong> remaining of {audit.totalRequired} required.
        </p>
      </section>

      <h2 className="pt-section-title">Requirements</h2>
      <Requirements groups={audit.groups} />

      <AuditNotes advisorSlug={advisorSlug} />
    </PortalPage>
  );
}

function ProgressBar({ completed, inProgress, total }: { completed: number; inProgress: number; total: number }) {
  const fixed = useScenario("portal-audit-progress-name-001");
  useScenario("portal-audit-progress-contrast-001");
  const pct = Math.round((completed / total) * 100);
  const withIp = Math.round(((completed + inProgress) / total) * 100);
  const aria = fixed
    ? { role: "progressbar", "aria-label": "Degree progress", "aria-valuemin": 0, "aria-valuemax": total, "aria-valuenow": completed, "aria-valuetext": `${pct}% complete, ${withIp}% including in-progress courses` }
    : {};
  return (
    <div className="pt-progress-wrap" data-a11y-scenario="portal-audit-progress-name-001 portal-audit-progress-contrast-001">
      <div className="pt-progress" {...aria}>
        <div className="pt-progress-fill" style={{ width: `${pct}%` }} />
        <div className="pt-progress-ip" style={{ width: `${withIp - pct}%` }} />
      </div>
      {fixed && <p className="pt-progress-text">{pct}% complete ({withIp}% including in-progress courses)</p>}
    </div>
  );
}

const groupState = (group: AuditGroup) => {
  const done = group.courses.filter((c) => c.status === "complete").reduce((n, c) => n + c.credits, 0);
  const ip = group.courses.filter((c) => c.status === "in-progress").reduce((n, c) => n + c.credits, 0);
  const state = done >= group.requiredCredits ? "Complete" : done + ip >= group.requiredCredits ? "In progress" : "Not complete";
  return { done: Math.min(done, group.requiredCredits), state };
};

/** Requirement groups as an expandable audit (collapsed by default, like the vendor's audit view). */
function Requirements({ groups }: { groups: AuditGroup[] }) {
  useScenario("portal-audit-group-spacing-001");
  return (
    <div className="pt-card pt-audit" data-a11y-scenario="portal-audit-group-spacing-001">
      <Accordion
        scenario="portal-audit-accordion-001"
        defect="no-state"
        items={groups.map((g) => ({ title: `${g.name} (${groupState(g).state})`, content: <GroupPanel group={g} /> }))}
      />
    </div>
  );
}

function GroupPanel({ group }: { group: AuditGroup }) {
  const statusFixed = useScenario("portal-audit-status-color-001");
  useScenario("portal-audit-credits-underline-001");
  const { done } = groupState(group);
  return (
    <div data-a11y-scenario="portal-audit-status-color-001 portal-audit-credits-underline-001">
      <p><span className="pt-req-credits">{done} of {group.requiredCredits} credits</span> complete in this group.</p>
      <div className="table-wrap">
        <table className="pt-grid">
          <caption className="visually-hidden">{group.name} courses</caption>
          <thead>
            <tr><th scope="col">Status</th><th scope="col">Course</th><th scope="col">Title</th><th scope="col" className="num">Credits</th><th scope="col">Grade</th><th scope="col">Term</th></tr>
          </thead>
          <tbody>
            {group.courses.map((c) => (
              <tr key={c.courseId}>
                <td>
                  <span className={`pt-status pt-status--${c.status}`} />
                  {statusFixed && <span className="pt-status-text">{statusText[c.status]}</span>}
                </td>
                <td>{c.code}</td>
                <td>{c.title}</td>
                <td className="num">{c.credits.toFixed(1)}</td>
                <td>{c.grade ?? ""}</td>
                <td>{c.term ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuditNotes({ advisorSlug }: { advisorSlug: string }) {
  const listFixed = useScenario("portal-audit-notes-list-001");
  const items = [
    "Courses in progress are counted toward requirements pending final grades.",
    "A minimum 2.0 GPA in courses required for the major is needed to graduate.",
    "At least 40 of your 120 credits must be upper-division (300 level or above).",
    <>Questions about how a course applies? Contact your <Link to={`/faculty/${advisorSlug}`}>advisor</Link> or the <Link to="/students/advising">Academic Advising Center</Link>.</>,
  ].map((item, i) => <li key={i}>{item}</li>);
  return (
    <section className="pt-card" aria-labelledby="audit-notes">
      <h2 id="audit-notes">Notes</h2>
      <div data-a11y-scenario="portal-audit-notes-list-001">
        {listFixed ? <ul className="pt-notes">{items}</ul> : <div className="pt-notes">{items}</div>}
      </div>
      <p>
        Thinking about a different major or a minor? Run a what-if audit with your advisor, or browse programs first:{" "}
        <SmartLink scenario="portal-audit-whatif-generic-001" to="/academics/programs" defect="Click here">Explore degree programs</SmartLink>.
      </p>
    </section>
  );
}
