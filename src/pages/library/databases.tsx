// /library/databases: Databases A–Z (src/data/generated/databases.json) with subject filter and letter jumps.
import { useState } from "react";
import { Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { RelatedLinks } from "~/components/blocks";
import databases from "~/data/generated/databases.json";
import type { LibraryDatabase } from "~/data/types";

export { inventoryMeta as meta } from "~/routes/meta";

const all = databases as LibraryDatabase[];
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const SUBJECTS = [...new Set(all.flatMap((d) => d.subjects))].sort();
const FULLTEXT_ICON = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect x="2" y="1" width="12" height="14" rx="1" fill="#0f5a8a"/><path d="M5 5h6M5 8h6M5 11h4" stroke="#fff" stroke-width="1.5"/></svg>')}`;
const proxy = (slug: string) => `https://proxy.redwoodstate.edu/login?url=https://db.example.com/${slug}`;

export default function DatabasesAZ() {
  const [subject, setSubject] = useState("");
  const navFixed = useScenario("library-db-nav-labelledby-001");
  const jumpFixed = useScenario("library-db-empty-letter-001");
  const selectFixed = useScenario("library-db-subject-select-001");
  const iconFixed = useScenario("library-db-fulltext-alt-001");
  useScenario("library-db-desc-contrast-001"); // CSS scenarios (library.css)
  useScenario("library-db-entry-height-001");
  useScenario("library-db-notice-underline-001");

  const list = subject ? all.filter((d) => d.subjects.includes(subject)) : all;
  const byLetter = new Map<string, LibraryDatabase[]>();
  for (const d of list) {
    const l = d.name[0].toUpperCase();
    byLetter.set(l, [...(byLetter.get(l) ?? []), d]);
  }

  return (
    <div className="page-content lib-db">
      <header>
        <h1 id="page-title">Databases A–Z</h1>
        <p>An A–Z list of research databases licensed by Sequoia Library.</p>
        <p className="lib-notice" data-a11y-scenario="library-db-notice-underline-001">
          Databases are licensed for current RSU students, faculty, and staff. Off-campus access requires your RedwoodConnect login.
        </p>
      </header>

      <div className="lib-db-tools">
        <nav className="lib-az" aria-labelledby={navFixed ? "az-label" : "az-heading"} data-a11y-scenario="library-db-nav-labelledby-001 library-db-empty-letter-001">
          <p id="az-label" className="lib-az-label">Jump to:</p>
          <ul>
            {LETTERS.map((l) => (
              <li key={l}>
                {byLetter.has(l)
                  ? <a href={`#letter-${l.toLowerCase()}`}>{l}</a>
                  : jumpFixed ? <span className="lib-az-none">{l}</span> : <a href="#" className="lib-az-none">{l}</a>}
              </li>
            ))}
          </ul>
        </nav>
        <div className="lib-db-filter" data-a11y-scenario="library-db-subject-select-001">
          {selectFixed ? <label htmlFor="db-subject">Subject</label> : <span className="lib-tool-label">Subject</span>}
          <select id="db-subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">All subjects ({all.length})</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <p className="lib-count">{list.length} databases{subject && ` in ${subject}`}</p>

      <div className="lib-db-list" data-a11y-scenario="library-db-desc-contrast-001 library-db-entry-height-001 library-db-fulltext-alt-001">
        {[...byLetter].map(([letter, dbs]) => (
          <section key={letter} id={`letter-${letter.toLowerCase()}`} className="lib-db-letter">
            <Heading scenario="library-db-letter-heading-001" level={2} defect="skipped" defectLevel={4} className="lib-db-letter-heading">{letter}</Heading>
            {dbs.map((d) => (
              <div key={d.slug} className="lib-db-entry">
                <p className="lib-db-name">
                  <SmartLink scenario="library-db-newwindow-001" to={proxy(d.slug)} newWindow>{d.name}</SmartLink>
                  {d.fullText && <img src={FULLTEXT_ICON} width="16" height="16" className="lib-db-icon" alt={iconFixed ? "Full text available" : "icon_fulltext.png"} />}
                </p>
                <p className="lib-db-desc">{d.description}</p>
                <p className="lib-db-meta">{d.subjects.join(", ")} · Coverage: {d.coverage} · {d.access}</p>
              </div>
            ))}
          </section>
        ))}
      </div>

      <p className="page-updated">Database list last reviewed 2020</p>
      <RelatedLinks title="Need help choosing?" links={[{ label: "Research Guides", href: "/library/guides" }, { label: "Library Search", href: "/library/search" }]} />
    </div>
  );
}
