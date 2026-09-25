// /library/guides: research guide listing.
import { useState } from "react";
import { Link } from "react-router";
import { Field } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { ContactCard, RelatedLinks } from "~/components/blocks";
import { libraryGuides } from "~/data/catalog";
import { guides } from "../_data";

export { inventoryMeta as meta } from "~/routes/meta";

export default function GuidesIndex() {
  const [filter, setFilter] = useState("");
  const redundantFixed = useScenario("library-guides-redundant-001");
  useScenario("library-guides-updated-small-001"); // CSS scenario (library.css)
  const shown = libraryGuides.filter((g) => `${g.name} ${guides[g.slug].summary}`.toLowerCase().includes(filter.toLowerCase().trim()));

  return (
    <div className="page-content lib-guides">
      <header>
        <h1 id="page-title">Research Guides</h1>
        <p>Subject and course guides created by Sequoia Library librarians. Each guide lists the best databases, search tips and a librarian you can contact.</p>
      </header>

      <Field scenario="library-guides-filter-label-001" id="guide-filter" label="Filter guides" defect="missing" type="search" value={filter} onChange={(e) => setFilter(e.target.value)} className="lib-guides-filter" />

      <ul className="lib-guide-list" data-a11y-scenario="library-guides-redundant-001 library-guides-updated-small-001">
        {shown.map((g) => {
          const guide = guides[g.slug];
          const href = `/library/guides/${g.slug}`;
          return (
            <li key={g.slug} className="lib-guide-card">
              <h2><Link to={href}>{g.name}</Link></h2>
              <p>{guide.summary}</p>
              <p className="lib-guide-owner">{guide.librarian.name}, {guide.librarian.title}</p>
              <p className="lib-guide-updated">{guide.updated}</p>
              {!redundantFixed && <Link to={href} className="lib-guide-view">{g.name} »</Link>}
            </li>
          );
        })}
      </ul>
      {shown.length === 0 && <p>No guides match “{filter}”. Ask a librarian to recommend sources.</p>}

      <div className="lib-two-col">
        <ContactCard title="Request a course guide" lines={[{ label: "Research & Instruction", value: "Keisha Wu, LIB 235" }, { label: "Email", value: "keisha.wu@redwoodstate.example.edu", href: "mailto:keisha.wu@redwoodstate.example.edu" }]} />
        <RelatedLinks title="Find sources" links={[{ label: "Databases A–Z", href: "/library/databases" }, { label: "Library Search", href: "/library/search" }]} />
      </div>
    </div>
  );
}
