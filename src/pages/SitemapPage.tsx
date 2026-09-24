import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { pageTitle } from "~/data/brand";
import { inventory, type Section } from "~/routes/inventory";

export const meta: MetaFunction = () => [{ title: pageTitle("Site Map") }];

const sectionNames: Record<Section, string> = {
  home: "Home", about: "About", admissions: "Admissions", aid: "Financial Aid", academics: "Academics",
  faculty: "Faculty", students: "Students", library: "Library", news: "News", events: "Events",
  athletics: "Athletics", giving: "Giving", employees: "Faculty & Staff", portal: "Student Portal",
  audience: "Audiences", utility: "Utilities", lab: "Accessibility Lab",
};

export default function SitemapPage() {
  const groups = new Map<Section, typeof inventory[number][]>();
  for (const e of inventory) groups.set(e.section, [...(groups.get(e.section) ?? []), e]);

  return (
    <div className="page-content">
      <h1>Site Map</h1>
      <p>All {inventory.length} pages on the Redwood State University website.</p>
      <div className="sitemap-grid">
        {[...groups].map(([section, pages]) => (
          <section key={section} aria-labelledby={`sitemap-${section}`}>
            <h2 id={`sitemap-${section}`}>{sectionNames[section]}</h2>
            <ul>
              {pages.map((p) => (
                <li key={p.path}><Link to={p.path}>{p.title}</Link></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
