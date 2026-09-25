import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { AnyLink, ContactCard, RelatedLinks } from "~/components/blocks";
import { copyFor } from "../about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/policies/privacy");
const [collect, records, questions] = content.sections;
const ACT = "California Information Practices Act of 1977";

export default function PrivacyPage() {
  const underlineFixed = useScenario("utility-privacy-underline-001");
  useScenario("utility-privacy-legal-contrast-001"); // CSS scenario (flagship.css)
  const [p1, p2] = collect.paragraphs!;
  const [before, after] = p2.split(ACT);

  return (
    <>
      <Hero title="Privacy Statement" kicker="Website policies" lede={content.summary} variant="banner" />
      <div className="page-content longform privacy-page" data-a11y-scenario="utility-privacy-legal-contrast-001">
        <section className="stack" aria-labelledby="collect-heading">
          <h2 id="collect-heading">{collect.heading}</h2>
          <p>{p1}</p>
          <p data-a11y-scenario="utility-privacy-underline-001">
            {before}{underlineFixed ? <strong>{ACT}</strong> : <u>{ACT}</u>}{after}
          </p>
        </section>
        <section className="stack" aria-labelledby="records-heading">
          <h2 id="records-heading">{records.heading}</h2>
          {records.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
          <p>{records.links?.map((l) => <AnyLink key={l.href} href={l.href}>{l.label}</AnyLink>)}</p>
        </section>
        <ContactCard
          title={questions.heading!}
          lines={[
            { label: "Office", value: "Information Security Office" },
            { label: "Phone", value: "(707) 555-0109", href: "tel:7075550109" },
            { label: "Email", value: "privacy@redwoodstate.example.edu", href: "mailto:privacy@redwoodstate.example.edu" },
          ]}
        />
        <RelatedLinks title="Related" links={[{ label: "Accessibility at Redwood State", href: "/accessibility" }, { label: "Parents & Families (FERPA)", href: "/parents" }]} />
        <p className="page-updated">{content.updated}</p>
      </div>
    </>
  );
}
