// Faculty directory: static, content-complete listing grouped by department. Search, filters and view
// switching are plan 06 (#4).
import { Link } from "react-router";
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
const S = {
  photo: "faculty-dir-photo-link-empty-001",
  region: "faculty-dir-region-labelledby-001",
  heading: "faculty-dir-dept-heading-skip-001",
  email: "faculty-dir-email-duplicate-001",
  small: "faculty-dir-phone-small-001",
  contrast: "faculty-dir-title-contrast-001",
  focus: "faculty-dir-name-focus-001",
};
const groups = departments
  .map((d) => ({ ...d, people: faculty.filter((f) => f.department === d.slug).map((f) => facultyProfiles[f.slug]) }))
  .filter((g) => g.people.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name));

export default function FacultyDirectory() {
  const photoFixed = useScenario(S.photo);
  const regionFixed = useScenario(S.region);
  const headingFixed = useScenario(S.heading);
  const emailFixed = useScenario(S.email);
  useScenario(S.small); // CSS scenarios (cms.css): register only.
  useScenario(S.contrast);
  useScenario(S.focus);
  const H = headingFixed ? "h2" : "h4";

  return (
    <CmsPage className="cms-directory">
      <Hero title="Faculty Directory" lede={content.summary} variant="banner" />
      <div className="page-content">
        <p>
          {content.sections[0].paragraphs?.[0].replace(/ For staff.*$/, "")} For staff, see the{" "}
          <AnyLink href="/employees/directory">Employee Directory</AnyLink>.
        </p>

        <nav aria-labelledby="dept-index-heading" className="cms-dept-index">
          <h2 id="dept-index-heading">Browse by department</h2>
          <ul>{groups.map((g) => <li key={g.slug}><a href={`#dept-${g.slug}-heading`}>{g.name}</a></li>)}</ul>
        </nav>

        {groups.map((g) => (
          <section
            key={g.slug}
            className="cms-fac-group"
            aria-labelledby={regionFixed ? `dept-${g.slug}-heading` : `dept-${g.slug}`}
            data-a11y-scenario={`${S.region} ${S.heading}`}
          >
            <H id={`dept-${g.slug}-heading`} className="cms-fac-dept" tabIndex={-1}>{g.name}</H>
            <ul className="cms-fac-list">
              {g.people.map((p) => (
                <li key={p.slug} className="cms-fac-card">
                  {photoFixed ? (
                    <Img image={p.image} alt="" className="cms-fac-photo" sizes="5rem" aspect="1 / 1" />
                  ) : (
                    <Link to={`/faculty/${p.slug}`} className="cms-fac-photo-link" data-a11y-scenario={S.photo}>
                      <Img image={p.image} alt="" className="cms-fac-photo" sizes="5rem" aspect="1 / 1" />
                    </Link>
                  )}
                  <div>
                    <p className="cms-fac-name"><Link to={`/faculty/${p.slug}`} data-a11y-scenario={S.focus}>{p.name}</Link></p>
                    <p className="cms-fac-title" data-a11y-scenario={S.contrast}>{p.title}</p>
                    <p className="cms-fac-research">{p.researchInterests.slice(0, 2).join("; ")}</p>
                    <p className="cms-fac-contact" data-a11y-scenario={S.small}>
                      {p.office} · {p.phone} ·{" "}
                      <a href={`mailto:${p.email}`} data-a11y-scenario={S.email}>{emailFixed ? p.email : "Email"}</a>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </CmsPage>
  );
}
