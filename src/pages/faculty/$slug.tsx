// ProfilePage (faculty). Defects vary by profile (profileDefects in the faculty registry). Optional blocks by
// data: lab website, teaching table (from the class schedule), colleagues, last-updated note.
import { Link } from "react-router";
import { Heading, SmartLink } from "~/a11y/helpers";
import { profileDefects, profileScenarioId, type ProfileDefect } from "~/a11y/registry/faculty";
import { useScenario } from "~/a11y/useScenario";
import { DataTable } from "~/components/DataTable";
import { Img } from "~/components/Img";
import { ContactCard, RelatedLinks } from "~/components/blocks";
import { departments, faculty } from "~/data/catalog";
import { facultyProfiles } from "~/data/content/people";
import courses from "~/data/generated/courses.json";
import imageSizes from "~/data/image-sizes.json";
import { CmsPage } from "../academics/_cms";
import type { Route } from "./+types/$slug";

export { inventoryMeta as meta } from "~/routes/meta";

export function loader({ params }: Route.LoaderArgs) {
  if (!facultyProfiles[params.slug]) throw new Response("Not found", { status: 404 });
  return {
    sections: courses.flatMap((c) =>
      c.sections
        .filter((s) => s.instructorSlug === params.slug)
        .map((s) => ({ crn: s.crn, course: `${c.code} ${c.title}`, term: s.term, section: s.section, when: s.days ? `${s.days} ${s.start}–${s.end}` : "Online, asynchronous", room: s.room || "Online" })),
    ),
  };
}

const manifestAlt = (id: string) => (imageSizes as Record<string, { alt: string }>)[id]?.alt ?? "";
const lastName = (name: string) => name.split(",")[0].split(" ").at(-1)!.toLowerCase().replace(/[^a-z]/g, "");

export default function ProfilePage({ params, loaderData }: Route.ComponentProps) {
  const p = facultyProfiles[params.slug];
  const defects = profileDefects[p.slug] ?? [];
  const has = (d: ProfileDefect) => defects.includes(d);
  const sid = (d: ProfileDefect) => (has(d) ? profileScenarioId[d] : undefined);
  const dept = departments.find((d) => d.slug === p.department)!;
  const colleagues = faculty.filter((f) => f.department === p.department && f.slug !== p.slug);

  const emailFixed = useScenario(sid("emailGeneric"));
  useScenario(sid("updatedSmall")); // CSS scenarios (cms.css): register only.
  useScenario(sid("officeContrast"));

  // Section titles: real headings, or bold paragraphs on the profiles with fakeHeadings.
  const fakeId = sid("fakeHeadings");
  const title = (text: string) => (fakeId ? <Heading scenario={fakeId} level={2} defect="fake">{text}</Heading> : <h2>{text}</h2>);

  const photo = has("photoMissingAlt")
    ? <Img image={p.image} scenario={profileScenarioId.photoMissingAlt} className="cms-profile-photo" sizes="12rem" aspect="1 / 1" loading="eager" />
    : has("photoFilenameAlt")
      ? <Img image={p.image} alt={`${lastName(p.name)}_headshot_2019.jpg`} scenario={profileScenarioId.photoFilenameAlt} className="cms-profile-photo" sizes="12rem" aspect="1 / 1" loading="eager" />
      : <Img image={p.image} alt={manifestAlt(p.image)} className="cms-profile-photo" sizes="12rem" aspect="1 / 1" loading="eager" />;

  return (
    <CmsPage className="cms-profile">
      <header className="cms-profile-head">
        {photo}
        <div>
          <h1>{p.name}</h1>
          <p className="cms-profile-title">{p.title}</p>
          <p><Link to={`/academics/departments/${dept.slug}`}>Department of {dept.name}</Link></p>
        </div>
      </header>

      <div className="cms-profile-body">
        <div className="cms-profile-main stack">
          {title("Biography")}
          <p>{p.bio}</p>

          {title("Research Interests")}
          <ul className="cms-dense-list">{p.researchInterests.map((r) => <li key={r}>{r}</li>)}</ul>

          {p.website && (
            <p>
              <SmartLink scenario={sid("websiteNewWindow") ?? ""} to={p.website.href} newWindow>{p.website.label}</SmartLink>
            </p>
          )}

          {title("Education")}
          <ul className="cms-dense-list">{p.education.map((e) => <li key={e}>{e}</li>)}</ul>

          {title("Selected Publications")}
          <ol className="cms-pubs">{p.publications.map((x) => <li key={x}>{x}</li>)}</ol>

          {(Boolean(p.courses?.length) || loaderData.sections.length > 0) && title("Teaching")}
          {p.courses && <ul className="cms-dense-list">{p.courses.map((c) => <li key={c}>{c}</li>)}</ul>}
          {loaderData.sections.length > 0 && (
            <DataTable
              caption={`Sections taught by ${p.name.split(",")[0]}, 2026–27`}
              rowHeader="course"
              rows={loaderData.sections}
              columns={[
                { key: "course", header: "Course", render: (s) => s.course },
                { key: "term", header: "Term", render: (s) => s.term },
                { key: "section", header: "Section", render: (s) => s.section },
                { key: "when", header: "Days and times", render: (s) => s.when },
                { key: "room", header: "Room", render: (s) => s.room },
              ]}
            />
          )}
        </div>

        <div className="cms-profile-side stack">
          <div
            className={has("officeContrast") ? "cms-profile-contact cms-profile-contact--low" : "cms-profile-contact"}
            data-a11y-scenario={[sid("officeContrast"), sid("emailGeneric")].filter(Boolean).join(" ") || undefined}
          >
            <ContactCard
              title="Contact"
              lines={[
                { label: "Office", value: p.office },
                { label: "Office hours", value: p.officeHours },
                { label: "Phone", value: p.phone, href: `tel:${p.phone.replace(/\D/g, "")}` },
                has("emailGeneric") && !emailFixed
                  ? { label: "Email", value: "Click here to email", href: `mailto:${p.email}` }
                  : { label: "Email", value: p.email, href: `mailto:${p.email}` },
              ]}
            />
          </div>
          {colleagues.length > 0 && (
            <RelatedLinks
              title={`${dept.name} faculty`}
              links={colleagues.map((c) => ({ label: c.name, href: `/faculty/${c.slug}` }))}
            />
          )}
        </div>
      </div>

      {p.lastUpdated && (
        <p className={has("updatedSmall") ? "page-updated cms-updated--small" : "page-updated"} data-a11y-scenario={sid("updatedSmall")}>
          {p.lastUpdated}
        </p>
      )}
    </CmsPage>
  );
}
