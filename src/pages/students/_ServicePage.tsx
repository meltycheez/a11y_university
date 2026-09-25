// ServicePage template for Student Affairs offices. Pages pick their own blocks (hours tables, Tabs,
// Accordion, Callout, VideoEmbed…); the template adds the office ContactCard and RelatedLinks when given.
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { ContactCard, RelatedLinks } from "~/components/blocks";
import { getEntry } from "~/routes/inventory";
import { content } from "~/pages/admissions/_content";

interface Props {
  path: string;
  image?: string;
  imageAlt?: string;
  imageScenario?: string;
  imageFixedAlt?: string;
  contact?: { label: string; value: string; href?: string }[];
  related?: { label: string; href: string }[];
  /** CSS scenario styled on the "updated" note. */
  updatedScenario?: string;
  className?: string;
  children: React.ReactNode;
}

export function ServicePage({ path, image, imageAlt = "", imageScenario, imageFixedAlt, contact, related, updatedScenario, className, children }: Props) {
  useScenario(updatedScenario);
  const c = content(path)!;
  const title = getEntry(path)!.title;
  return (
    <div className={["svc-page", className].filter(Boolean).join(" ")}>
      <Hero title={title} kicker="Student Affairs" lede={c.summary} image={image} imageAlt={imageScenario ? imageAlt || undefined : imageAlt} imageScenario={imageScenario} imageFixedAlt={imageFixedAlt} variant="banner" />
      <div className="svc-layout">
        <div className="page-content svc-main">{children}</div>
        {(contact || related) && (
          <div className="svc-aside stack">
            {contact && <ContactCard title={`Contact ${title}`} lines={contact} />}
            {related && <RelatedLinks links={related} />}
          </div>
        )}
      </div>
      {c.updated && <p className="page-updated" data-a11y-scenario={updatedScenario}>{c.updated}</p>}
    </div>
  );
}

/** "Rowan Student Union 210" / "(707) 555-0148" / "x@…" lists from the content, as ContactCard lines. */
export function contactLines(list: string[]) {
  return list.map((v) => {
    if (v.startsWith("(707)")) return { label: "Phone", value: v, href: `tel:+1${v.replace(/\D/g, "")}` };
    if (v.includes("@")) return { label: "Email", value: v, href: `mailto:${v}` };
    if (/hours/i.test(v)) return { label: "Hours", value: v.replace(/^[^:]*hours:\s*/i, "") };
    return { label: "Location", value: v };
  });
}
