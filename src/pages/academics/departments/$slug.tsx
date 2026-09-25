// DepartmentPage template (older CMS). Optional blocks by data: impacted-program callout, faculty list,
// course table, documents, contact card and related links.
import { Link } from "react-router";
import { Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import { ContactCard, RelatedLinks } from "~/components/blocks";
import { colleges, departments, faculty, programs } from "~/data/catalog";
import { departmentContent } from "~/data/content/academics";
import courses from "~/data/generated/courses.json";
import { CmsPage, PDF_INFO } from "../_cms";
import type { Route } from "./+types/$slug";

export { inventoryMeta as meta } from "~/routes/meta";

const documents: Record<string, { label: string; href: string }[]> = {
  nursing: [{ label: "B.S.N. Program Handbook 2025–26", href: "/documents/bsn-program-handbook-2025-26.pdf" }],
};

export function loader({ params }: Route.LoaderArgs) {
  if (!departments.some((d) => d.slug === params.slug)) throw new Response("Not found", { status: 404 });
  return {
    courses: courses
      .filter((c) => c.department === params.slug)
      .map((c) => {
        const fall = c.sections.filter((s) => s.term === "Fall 2026");
        return {
          id: c.id, code: c.code, title: c.title, credits: c.credits, level: c.level, terms: c.terms,
          full: fall.length > 0 && fall.every((s) => s.enrolled >= s.capacity),
        };
      }),
  };
}

export default function DepartmentPage({ params, loaderData }: Route.ComponentProps) {
  const dept = departments.find((d) => d.slug === params.slug)!;
  const content = departmentContent[dept.slug];
  const college = colleges.find((c) => c.slug === dept.college)!;
  const progs = programs.filter((p) => p.department === dept.slug);
  const people = faculty.filter((f) => f.department === dept.slug);
  const docs = [...(documents[dept.slug] ?? []), { label: "General Catalog Addendum 2025–26", href: "/documents/catalog-addendum-2025-26.pdf" }];
  const impacted = /impacted program/i.test(content.overview);
  const captionFixed = useScenario("academics-dept-course-table-caption-001");
  const colorFixed = useScenario("academics-dept-full-color-001");
  const subject = loaderData.courses[0]?.code.split(" ")[0];

  return (
    <CmsPage className="cms-dept">
      <Hero title={`Department of ${dept.name}`} lede={college.name} variant="banner" />
      <div className="page-content">
        <div className="cms-dept-intro">
          <Img image={content.image} scenario="academics-dept-photo-alt-001" className="cms-dept-photo" sizes="(min-width: 60rem) 20rem, 100vw" aspect="4 / 3" />
          <p>{content.overview}</p>
          <p><strong>Chair:</strong> {content.chair}</p>
        </div>

        {impacted && (
          <Callout title="Impacted program" tone="warning">
            <p>More students apply to this major than can be admitted, so admission is competitive. See <Link to="/admissions/undergraduate">Undergraduate Admissions</Link> for details.</p>
          </Callout>
        )}

        <section className="stack">
          <h2>Department Highlights</h2>
          <ul className="cms-dense-list">{content.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
        </section>

        <section className="stack">
          <h2>Academics</h2>
          <Heading scenario="academics-dept-heading-skip-001" level={3} defect="skipped" defectLevel={4}>Degree Programs</Heading>
          <ul className="cms-dense-list">
            {progs.map((p) => <li key={p.slug}><Link to={`/academics/programs/${p.slug}`}>{p.degree} in {p.name}</Link></li>)}
          </ul>

          <Heading scenario="academics-dept-heading-skip-001" level={3} defect="skipped" defectLevel={4}>Courses</Heading>
          <p className="cms-legend" data-a11y-scenario="academics-dept-full-color-001">
            {colorFixed ? "Courses marked “Full” have no open seats in any Fall 2026 section." : <>Courses in <span className="cms-full">red</span> are full for Fall 2026.</>}
            {" "}Check <Link to={`/academics/courses${subject ? `?q=${subject}` : ""}`}>Course Search</Link> for current availability.
          </p>
          <div className="table-scroll">
            <table className="cms-table" data-a11y-scenario="academics-dept-course-table-caption-001">
              {captionFixed && <caption>{dept.name} courses, 2026–27</caption>}
              <thead>
                <tr><th scope="col">Course</th><th scope="col">Title</th><th scope="col">Units</th><th scope="col">Level</th><th scope="col">Offered</th></tr>
              </thead>
              <tbody>
                {loaderData.courses.map((c) => (
                  <tr key={c.id} className={c.full && !colorFixed ? "cms-full" : undefined}>
                    <td>{c.code}{c.full && colorFixed && <> <span className="cms-badge">Full</span></>}</td>
                    <td>{c.title}</td>
                    <td>{c.credits}</td>
                    <td>{c.level === "graduate" ? "Graduate" : "Undergraduate"}</td>
                    <td>{c.terms.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="stack">
          <h2>Faculty</h2>
          <ul className="cms-people">
            {people.map((p) => (
              <li key={p.slug}>
                <Link to={`/faculty/${p.slug}`}>{p.name}</Link>, {p.title}
                {content.chair === p.name && <> (Chair)</>}
              </li>
            ))}
          </ul>
          <p><Link to="/faculty">Full faculty directory</Link></p>
        </section>

        <section className="stack">
          <h2>Documents &amp; Forms</h2>
          <ul className="cms-dense-list">
            {docs.map((d) => (
              <li key={d.href}><SmartLink scenario="academics-dept-document-link-001" to={d.href} fileInfo={PDF_INFO}>{d.label}</SmartLink></li>
            ))}
          </ul>
        </section>

        <div className="cms-two-col">
          <ContactCard
            title={`Contact ${dept.name}`}
            lines={content.contacts.map((c) => ({ ...c, href: c.label === "Email" ? `mailto:${c.value}` : undefined }))}
          />
          <RelatedLinks
            title="See also"
            links={[
              { label: college.name, href: `/academics/colleges/${college.slug}` },
              { label: "Academic Advising", href: "/students/advising" },
              { label: "Academic Calendar", href: "/academics/calendar" },
            ]}
          />
        </div>
      </div>
    </CmsPage>
  );
}
