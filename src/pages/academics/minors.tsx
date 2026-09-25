import { SmartLink } from "~/a11y/helpers";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { RelatedLinks } from "~/components/blocks";
import { pageContent } from "~/data/content/pages";
import { CmsPage } from "./_cms";

export { inventoryMeta as meta } from "~/routes/meta";

const content = pageContent["/academics/minors"];
const [rules, declare] = content.sections[0].paragraphs?.[0].split(/(?<=\.) (?=Declare)/) ?? [];

export default function MinorsPage() {
  const minors = content.sections[0].list ?? [];
  return (
    <CmsPage>
      <Hero title="Minors" lede={content.summary} variant="banner" />
      <div className="page-content">
        <Callout title="Minor requirements">
          <p>{rules}</p>
        </Callout>
        <section className="stack">
          <h2>Minors A–Z</h2>
          <ul className="cms-columns">{minors.map((m) => <li key={m}>{m}</li>)}</ul>
        </section>
        <p>
          {declare} The form is available{" "}
          <SmartLink scenario="academics-minors-link-generic-001" to="/students/registrar" defect="here">
            from the Office of the Registrar
          </SmartLink>.
        </p>
        <RelatedLinks
          title="Related"
          links={[
            { label: "Degree Programs", href: "/academics/programs" },
            { label: "Certificates", href: "/academics/certificates" },
            { label: "Academic Advising", href: "/students/advising" },
          ]}
        />
      </div>
    </CmsPage>
  );
}
