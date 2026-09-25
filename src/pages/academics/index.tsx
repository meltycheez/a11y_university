import { Link } from "react-router";
import { Card, CardGrid } from "~/components/Card";
import { Hero } from "~/components/Hero";
import { RelatedLinks, StatsBand } from "~/components/blocks";
import { colleges } from "~/data/catalog";
import { collegeContent } from "~/data/content/academics";
import { pageContent } from "~/data/content/pages";
import { CmsPage, firstSentence } from "./_cms";

export { inventoryMeta as meta } from "~/routes/meta";

const content = pageContent["/academics"];
const findLinks = content.sections.find((s) => s.heading === "Find a program")?.links ?? [];

export default function AcademicsHub() {
  return (
    <CmsPage>
      <Hero title="Academics" lede={content.summary} image="academics-hero-lecture" variant="banner" />
      <div className="page-content">
        {content.sections[0].paragraphs?.map((p) => <p key={p} className="cms-lede">{p}</p>)}

        <StatsBand
          label="Academics at a glance"
          stats={[
            { value: "6", label: "Colleges" },
            { value: "64", label: "Majors" },
            { value: "29", label: "Graduate programs" },
            { value: "27", label: "Average class size" },
          ]}
        />

        <section className="stack" aria-labelledby="colleges-heading">
          <h2 id="colleges-heading">Colleges and Schools</h2>
          <CardGrid columns={3}>
            {colleges.map((c) => (
              <Card
                key={c.slug}
                title={c.name}
                href={`/academics/colleges/${c.slug}`}
                text={firstSentence(collegeContent[c.slug].overview)}
                image={collegeContent[c.slug].image}
                imageAlt={c.name}
                imageScenario="academics-hub-card-alt-redundant-001"
                imageFixedAlt=""
              />
            ))}
          </CardGrid>
        </section>

        <section className="stack" aria-labelledby="find-heading">
          <h2 id="find-heading">Find a program</h2>
          <ul className="link-grid">
            {findLinks.map((l) => <li key={l.href}><Link to={l.href}>{l.label}</Link></li>)}
          </ul>
        </section>

        <RelatedLinks
          title="Academic support"
          links={[
            { label: "Faculty Directory", href: "/faculty" },
            { label: "Academic Advising", href: "/students/advising" },
            { label: "Office of the Registrar", href: "/students/registrar" },
            { label: "Sequoia Library", href: "/library" },
          ]}
        />
      </div>
    </CmsPage>
  );
}
