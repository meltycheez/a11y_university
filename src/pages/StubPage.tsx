// Temporary page used by every route until its real template lands (plan 05).
// It renders the section's chrome, title, breadcrumbs, and links to child pages so navigation can be exercised.
import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { Callout } from "~/components/Callout";
import { pageContent, type PageSection } from "~/data/content/pages";
import { Hero } from "~/components/Hero";
import { pageTitle } from "~/data/brand";
import { sections } from "~/layouts/sections";
import { getChildren, getEntry } from "~/routes/inventory";
import { usePathname } from "~/routes/usePathname";

export const meta: MetaFunction = ({ location }) => {
  const entry = getEntry(location.pathname);
  return [{ title: pageTitle(entry?.title ?? "Page") }];
};

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

/** Generic renderer for hand-written page copy until each page gets its own template (plan 05). */
function ContentSection({ section }: { section: PageSection }) {
  const { heading, paragraphs, list, table, links } = section;
  return (
    <section className="stack">
      {heading && <h2>{heading}</h2>}
      {paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
      {list && <ul>{list.map((item, i) => <li key={i}>{item}</li>)}</ul>}
      {table && (
        <div className="table-scroll">
          <table>
            {table.caption && <caption>{table.caption}</caption>}
            <thead><tr>{table.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
            <tbody>{table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
      {links && (
        <ul className="link-list">
          {links.map((l) => (
            <li key={l.href + l.label}>{l.href.startsWith("/documents/") || l.href.startsWith("http") ? <a href={l.href.startsWith("/") ? import.meta.env.BASE_URL + l.href.slice(1) : l.href}>{l.label}</a> : <Link to={l.href}>{l.label}</Link>}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
