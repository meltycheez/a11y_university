// ProgramPage template. Optional blocks by data: impacted callout, stats band, program handbook, CTA band,
// related programs.
import { Link, useParams } from "react-router";
import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { AnyLink, CtaBand, RelatedLinks, StatsBand } from "~/components/blocks";
import { colleges, departments, programs } from "~/data/catalog";
import { programContent } from "~/data/content/academics";
import { CmsPage, PDF_INFO, impactedPrograms } from "../_cms";

export { inventoryMeta as meta } from "~/routes/meta";

const handbooks: Record<string, { label: string; href: string }> = {
  "bsn-nursing": { label: "B.S.N. Program Handbook 2025–26", href: "/documents/bsn-program-handbook-2025-26.pdf" },
};

export default function ProgramPage() {
  const { slug } = useParams();
  const captionFixed = useScenario("academics-program-req-table-caption-001");
  const program = programs.find((p) => p.slug === slug);
  if (!program) return null;
  const content = programContent[program.slug];
  const dept = departments.find((d) => d.slug === program.department)!;
  const college = colleges.find((c) => c.slug === dept.college)!;
  const siblings = programs.filter((p) => p.department === dept.slug && p.slug !== program.slug);
  const handbook = handbooks[program.slug];
  const grad = program.level === "graduate";
  const title = `${program.name}, ${program.degree}`;

  return (
    <CmsPage className="cms-program">
      <Hero title={title} lede={`Department of ${dept.name} · ${college.name}`} variant="banner" />
      <div className="page-content">
        {impactedPrograms.has(program.slug) && (
          <Callout title="Impacted program" tone="warning">
            <p>More students apply to this major than can be admitted, so admission is competitive.</p>
          </Callout>
        )}

        <p className="cms-lede">{content.overview}</p>

        <StatsBand
          label="Program at a glance"
          stats={[
            { value: String(content.totalUnits), label: "Total units" },
            { value: grad ? "Graduate" : "Undergraduate", label: "Degree level" },
            { value: String(content.careers.length), label: "Example career paths" },
          ]}
        />

        <section className="stack">
          <h2>Degree requirements</h2>
          <div className="table-scroll">
            <table className="cms-table cms-table--narrow" data-a11y-scenario="academics-program-req-table-caption-001">
              {captionFixed && <caption>{title} unit requirements</caption>}
              <thead><tr><th scope="col">Requirement</th><th scope="col" className="num">Units</th></tr></thead>
              <tbody>
                {content.requirements.map((r) => <tr key={r.label}><td>{r.label}</td><td className="num">{r.units}</td></tr>)}
              </tbody>
              <tfoot><tr><th scope="row">Total</th><td className="num">{content.totalUnits}</td></tr></tfoot>
            </table>
          </div>
          {handbook && <p><AnyLink href={handbook.href}>{handbook.label} ({PDF_INFO})</AnyLink></p>}
        </section>

        <section className="stack">
          <h2>Learning outcomes</h2>
          <p>Graduates of the program will be able to:</p>
          <ol className="cms-dense-list">{content.outcomes.map((o) => <li key={o}>{o}</li>)}</ol>
        </section>

        <section className="stack">
          <h2>Sample courses</h2>
          <ul className="cms-dense-list">{content.sampleCourses.map((c) => <li key={c}>{c}</li>)}</ul>
          <p>See <Link to={`/academics/departments/${dept.slug}`}>the department's course list</Link> or <Link to="/academics/courses">search the class schedule</Link>.</p>
        </section>

        <section className="stack">
          <h2>Career paths</h2>
          <ul className="cms-columns">{content.careers.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>

        <CtaBand
          title={grad ? "Apply to a graduate program" : "Ready to apply?"}
          text={grad ? "Deadlines, requirements and application steps are listed by Graduate Admissions." : "First-year and transfer students apply to Redwood State through Undergraduate Admissions."}
          action={grad ? { label: "Graduate Admissions", href: "/admissions/graduate" } : { label: "Undergraduate Admissions", href: "/admissions/undergraduate" }}
        />

        <RelatedLinks
          title="Related"
          links={[
            { label: `Department of ${dept.name}`, href: `/academics/departments/${dept.slug}` },
            ...siblings.map((p) => ({ label: `${p.name}, ${p.degree}`, href: `/academics/programs/${p.slug}` })),
            { label: college.name, href: `/academics/colleges/${college.slug}` },
            { label: "All degree programs", href: "/academics/programs" },
          ]}
        />
      </div>
    </CmsPage>
  );
}
