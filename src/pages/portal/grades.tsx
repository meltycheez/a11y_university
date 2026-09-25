// /portal/grades: final grades, one tab per term.
import { useLoaderData } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Tabs } from "~/components/Tabs";
import portal from "~/data/generated/portal.json";
import type { PortalStudent, TermGrades } from "~/data/types";
import { PortalPage } from "./_PortalPage";

export { inventoryMeta as meta } from "~/routes/meta";

const points: Record<string, number> = { A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, "C-": 1.7, "D+": 1.3, D: 1, F: 0 };
const cols = [["course", "Course"], ["title", "Title"], ["credits", "Credits"], ["grade", "Grade"], ["points", "Grade Points"]] as const;

export async function loader() {
  const p = portal as unknown as PortalStudent;
  return { grades: [...p.grades].reverse(), gpa: p.cumulativeGpa, credits: p.creditsEarned, term: p.currentTerm };
}

export default function GradesPage() {
  const { grades, gpa, credits, term } = useLoaderData<typeof loader>();
  useScenario("portal-grades-heading-skip-001");
  useScenario("portal-grades-duplicate-id-001");
  useScenario("portal-grades-footnote-small-001");

  return (
    <PortalPage title="Grades" subtitle="Final grades by term">
      <section className="pt-card" aria-labelledby="gpa-heading">
        <h2 id="gpa-heading">Academic Summary</h2>
        <dl className="pt-dl pt-dl--row">
          <div><dt>Cumulative GPA</dt><dd>{gpa.toFixed(2)}</dd></div>
          <div><dt>Credits earned</dt><dd>{credits}</dd></div>
          <div><dt>{term}</dt><dd>In progress</dd></div>
        </dl>
        <p>Final grades for Fall 2026 will be available December 23. See the{" "}
          <SmartLink scenario="portal-grades-calendar-pdf-001" to="/documents/academic-calendar-2026-27.pdf" fileInfo="PDF, 2 KB">Academic calendar</SmartLink>{" "}
          for grading deadlines.
        </p>
      </section>

      <section className="pt-card pt-grades" aria-labelledby="history-heading" data-a11y-scenario="portal-grades-heading-skip-001 portal-grades-duplicate-id-001">
        <h2 id="history-heading">Grade History</h2>
        <Tabs
          label="Terms"
          scenario="portal-grades-tabs-001"
          defect="no-roles"
          tabs={grades.map((t) => ({ label: t.term, content: <TermTable t={t} /> }))}
        />
        <p className="pt-footnote" data-a11y-scenario="portal-grades-footnote-small-001">
          Grades of W (withdrawal), I (incomplete), CR/NC (credit/no credit) and AU (audit) are not included in GPA. Repeated courses count only the most recent attempt.
        </p>
      </section>
    </PortalPage>
  );
}

function TermTable({ t }: { t: TermGrades }) {
  const headingFixed = useScenario("portal-grades-heading-skip-001");
  const idsFixed = useScenario("portal-grades-duplicate-id-001");
  const H = headingFixed ? "h3" : "h4";
  // Every (hidden) tab panel stays in the DOM, so the unprefixed ids repeat once per term.
  const id = (key: string) => (idsFixed ? `${t.term.toLowerCase().replace(" ", "-")}-grade-${key}` : `grade-${key}`);
  const termCredits = t.courses.reduce((n, c) => n + c.credits, 0);
  return (
    <div className="pt-term">
      <H>{t.term}</H>
      <div className="table-wrap">
        <table className="pt-grid">
          <caption>{t.term} final grades</caption>
          <thead><tr>{cols.map(([k, label]) => <th key={k} id={id(k)} className={k === "credits" || k === "points" ? "num" : undefined}>{label}</th>)}</tr></thead>
          <tbody>
            {t.courses.map((c) => (
              <tr key={c.courseId}>
                <td headers={id("course")}>{c.code}</td>
                <td headers={id("title")}>{c.title}</td>
                <td headers={id("credits")} className="num">{c.credits.toFixed(1)}</td>
                <td headers={id("grade")}>{c.grade}</td>
                <td headers={id("points")} className="num">{((points[c.grade] ?? 0) * c.credits).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={2}>Term totals</td><td className="num">{termCredits.toFixed(1)}</td><td colSpan={2}>Term GPA {t.termGpa.toFixed(2)}</td></tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
