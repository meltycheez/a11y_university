// Temporary page used by every route until its real template lands (plan 05).
// It renders the section's chrome, title, breadcrumbs, and links to child pages so navigation can be exercised.
import { Link } from "react-router";
import { Callout } from "~/components/Callout";
import { ContentSection } from "~/components/blocks";
import { pageContent } from "~/data/content/pages";
import { Hero } from "~/components/Hero";
import { sections } from "~/layouts/sections";
import { getChildren, getEntry } from "~/routes/inventory";
import { usePathname } from "~/routes/usePathname";

export { inventoryMeta as meta } from "~/routes/meta";

export default function StubPage() {
  const pathname = usePathname();
  const entry = getEntry(pathname);
  if (!entry) return null;

  const config = sections[entry.section];
  const children = getChildren(entry.path);
  const content = pageContent[entry.path];
  const variant = config.variant === "cms" || config.variant === "intranet" || config.variant === "portal" ? "banner" : "overlay";

  return (
    <>
      <Hero
        title={entry.title}
        kicker={config.siteName}
        lede={content?.summary ?? entry.summary}
        image={entry.parent ? undefined : config.heroImage}
        variant={variant}
      />

      <div className="page-content">
        {content ? (
          <>
            {content.sections.map((section, i) => <ContentSection key={i} section={section} />)}
            {content.updated && <p className="page-updated">{content.updated}</p>}
          </>
        ) : (
          <Callout title="Page in progress">
            <p>The full content for this page is part of a later build phase. Use the links below to explore nearby pages.</p>
          </Callout>
        )}

        {children.length > 0 && (
          <section aria-labelledby="children-heading" className="stack">
            <h2 id="children-heading">In this section</h2>
            <ul className="link-grid">
              {children.map((c) => (
                <li key={c.path}><Link to={c.path}>{c.title}</Link></li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

