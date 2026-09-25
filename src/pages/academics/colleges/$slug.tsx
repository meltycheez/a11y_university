// CollegeLanding template. Optional blocks are chosen by the college's data: stats band (from the class
// schedule), department list and jump menu (colleges with catalog departments), video (colleges with one),
// related programs or explore links.
import { useId, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Button } from "~/components/Button";
import { Hero } from "~/components/Hero";
import { ContactCard, RelatedLinks, StatsBand, VideoEmbed } from "~/components/blocks";
import { colleges, departments, programs } from "~/data/catalog";
import { collegeContent, departmentContent } from "~/data/content/academics";
import courses from "~/data/generated/courses.json";
import { CmsPage, firstSentence } from "../_cms";
import type { Route } from "./+types/$slug";

export { inventoryMeta as meta } from "~/routes/meta";

/** Colleges with a video tour (keep in sync with academics-college-video-title-001). */
const collegeVideos: Record<string, { title: string; caption: string }> = {
  engineering: { title: "Inside the Robotics Lab, Sequoia Engineering Hall", caption: "Students and faculty tour the Robotics Lab that opened in 2026." },
  science: { title: "A day at the Canopy Science Center", caption: "Research and teaching labs in the Canopy Science Center." },
  "health-sciences": { title: "Training in the Nursing Simulation Center", caption: "Nursing students practice patient care in the nationally accredited Simulation Center." },
};

export function loader({ params }: Route.LoaderArgs) {
  const college = colleges.find((c) => c.slug === params.slug);
  if (!college) throw new Response("Not found", { status: 404 });
  const own = courses.filter((c) => c.college === college.slug);
  return {
    stats: [
      { value: String(new Set(own.map((c) => c.subject)).size), label: "Subject areas" },
      { value: String(own.length), label: "Courses in the 2026–27 schedule" },
      { value: String(own.reduce((n, c) => n + c.sections.length, 0)), label: "Class sections this year" },
    ],
  };
}

export default function CollegeLanding({ params, loaderData }: Route.ComponentProps) {
  const college = colleges.find((c) => c.slug === params.slug)!;
  const content = collegeContent[college.slug];
  const depts = departments.filter((d) => d.college === college.slug);
  const progs = programs.filter((p) => depts.some((d) => d.slug === p.department));
  const video = collegeVideos[college.slug];

  return (
    <CmsPage className="cms-college">
      <Hero
        title={college.name}
        image={content.image}
        imageAlt={`${content.image}_banner_v2.jpg`}
        imageScenario="academics-college-hero-alt-suspicious-001"
        variant="split"
      />
      <div className="page-content">
        {depts.length > 0 && <JumpMenu depts={depts} progs={progs} />}

        <p className="cms-lede">{content.overview}</p>

        <section className="stack">
          <Heading scenario="academics-college-fake-heading-001" level={2} defect="fake">Why study at the {college.name}?</Heading>
          <ul className="cms-dense-list">{content.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
        </section>

        <StatsBand label={`${college.short} by the numbers`} stats={loaderData.stats} />

        {depts.length > 0 && (
          <section className="stack" aria-labelledby="depts-heading">
            <h2 id="depts-heading">Departments</h2>
            <ul className="cms-dept-list">
              {depts.map((d) => (
                <li key={d.slug}>
                  <h3>Department of {d.name}</h3>
                  <p>{firstSentence(departmentContent[d.slug].overview)}</p>
                  <SmartLink scenario="academics-college-dept-link-generic-001" to={`/academics/departments/${d.slug}`} defect="Learn more">
                    Visit the Department of {d.name}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        {video && <VideoEmbed title={video.title} caption={video.caption} titleScenario="academics-college-video-title-001" />}

        <div className="cms-two-col">
          <ContactCard
            title={`Contact the ${college.short} Dean's Office`}
            lines={[
              { label: "Dean", value: content.dean },
              ...content.contacts.map((c) => ({ ...c, href: c.label === "Email" ? `mailto:${c.value}` : undefined })),
            ]}
          />
          {progs.length > 0 ? (
            <RelatedLinks
              title="Degree programs"
              links={progs.map((p) => ({ label: `${p.name}, ${p.degree}`, href: `/academics/programs/${p.slug}` }))}
            />
          ) : (
            <RelatedLinks
              title="Explore"
              links={[
                { label: "All degree programs", href: "/academics/programs" },
                { label: "Certificates", href: "/academics/certificates" },
                { label: "Graduate admission", href: "/admissions/graduate" },
              ]}
            />
          )}
        </div>
        <p><Link to="/academics">All colleges and schools</Link></p>
      </div>
    </CmsPage>
  );
}

/** Old-CMS "jump to" menu. Defect: no label (select-missing-label). */
function JumpMenu({ depts, progs }: { depts: typeof departments; progs: typeof programs }) {
  const fixed = useScenario("academics-college-jump-select-label-001");
  const id = useId();
  const [to, setTo] = useState("");
  const navigate = useNavigate();
  return (
    <form className="cms-jump" data-a11y-scenario="academics-college-jump-select-label-001" onSubmit={(e) => { e.preventDefault(); if (to) navigate(to); }}>
      {fixed && <label htmlFor={id}>Jump to a department or program</label>}
      <select id={id} value={to} onChange={(e) => setTo(e.target.value)}>
        <option value="">-- Select --</option>
        <optgroup label="Departments">
          {depts.map((d) => <option key={d.slug} value={`/academics/departments/${d.slug}`}>{d.name}</option>)}
        </optgroup>
        {progs.length > 0 && (
          <optgroup label="Programs">
            {progs.map((p) => <option key={p.slug} value={`/academics/programs/${p.slug}`}>{p.name}, {p.degree}</option>)}
          </optgroup>
        )}
      </select>
      <Button variant="secondary" type="submit">Go</Button>
    </form>
  );
}
