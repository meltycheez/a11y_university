// AudienceLanding template (undergraduate, graduate, international, transfer). Every page gets the apply
// CtaBand and the counselor ContactCard; pages pick their own StatsBand, Callout, RelatedLinks, etc.
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { ContactCard, CtaBand } from "~/components/blocks";
import { getEntry } from "~/routes/inventory";
import { content } from "./_content";

interface Props {
  path: string;
  image: string;
  imageAlt?: string;
  imageScenario?: string;
  imageFixedAlt?: string;
  /** CSS scenario styled on the "updated" note. */
  updatedScenario?: string;
  className?: string;
  children: React.ReactNode;
}

export function AudienceLanding({ path, image, imageAlt, imageScenario, imageFixedAlt, updatedScenario, className, children }: Props) {
  useScenario("adm-audience-cta-contrast-001"); // CSS scenarios (marketing.css): register only.
  useScenario(updatedScenario);
  const c = content(path)!;
  return (
    <div className={["adm-audience", className].filter(Boolean).join(" ")}>
      <Hero title={getEntry(path)!.title} kicker="Admissions" lede={c.summary} image={image} imageAlt={imageAlt} imageScenario={imageScenario} imageFixedAlt={imageFixedAlt} />
      <div className="page-content adm-audience-body">
        <div className="stack adm-audience-main">{children}</div>
        <ContactCard
          title="Talk to an admissions counselor"
          lines={[
            { label: "Phone", value: "(707) 555-0120", href: "tel:+17075550120" },
            { label: "Email", value: "admissions@redwoodstate.edu", href: "mailto:admissions@redwoodstate.edu" },
            { label: "Visit", value: "Founders Hall 110, Monday–Friday, 8 a.m. to 5 p.m." },
          ]}
        />
      </div>
      <div data-a11y-scenario="adm-audience-cta-contrast-001">
        <CtaBand title="Ready to apply?" text="The online Application for Admission takes about 45 minutes. Check the deadline for your term before you begin." action={{ label: "Start your application", href: "/admissions/apply" }} />
      </div>
      {c.updated && <p className="page-updated" data-a11y-scenario={updatedScenario}>{c.updated}</p>}
    </div>
  );
}
