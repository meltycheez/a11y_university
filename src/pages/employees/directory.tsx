// Employee directory: A–Z tables with an instant name/title and department filter (plan 06 #4).
import { useId, useState } from "react";
import { useLoaderData } from "react-router";
import { Field, Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { ContactCard } from "~/components/blocks";
import directory from "~/data/generated/directory.json";
import type { DirectoryEntry } from "~/data/types";
import { copyFor } from "../about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const lastName = (name: string) => name.split(",")[0].trim().split(/\s+/).pop()!;

// Runs at build time only (prerender), so the 150-person dataset stays out of the client bundle.
export function loader() {
  return (directory as DirectoryEntry[])
    .map(({ slug, name, title, department, email, phone, building, room, hasProfile }) => ({ slug, name, title, department, email, phone, building, room, hasProfile }))
    .sort((a, b) => lastName(a.name).localeCompare(lastName(b.name)) || a.name.localeCompare(b.name));
}

type Person = ReturnType<typeof loader>[number];
const content = copyFor("/employees/directory");
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const COLS = ["name", "title", "dept", "phone", "email", "loc"];
const mail = <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.4V17h16V7.4l-8 5.3Zm1.8-.4L12 11.1 18.2 7Z" /></svg>;

export default function DirectoryPage() {
  const people = useLoaderData<typeof loader>();
  const id = useId();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const liveFixed = useScenario("employees-directory-count-live-001");
  const lettersFixed = useScenario("employees-directory-letter-links-001");
  const describedFixed = useScenario("employees-directory-describedby-001");
  // CSS scenarios (intranet.css).
  useScenario("employees-directory-location-small-001");
  useScenario("employees-directory-focus-001");
  useScenario("employees-directory-reflow-001");

  const depts = [...new Set(people.map((p) => p.department))].sort();
  const needle = q.trim().toLowerCase();
  const found = people.filter((p) => (dept === "all" || p.department === dept) && (!needle || `${p.name} ${p.title}`.toLowerCase().includes(needle)));
  const groups = new Map<string, Person[]>();
  for (const p of found) {
    const l = lastName(p.name)[0].toUpperCase();
    groups.set(l, [...(groups.get(l) ?? []), p]);
  }

  return (
    <>
      <Hero title="Employee Directory" lede={content.summary} variant="banner" />
      <div
        className="page-content directory-page"
        data-a11y-scenario="employees-directory-location-small-001 employees-directory-focus-001 employees-directory-reflow-001"
      >
        <p id={describedFixed ? "directory-help" : "dir-help"}>
          {content.sections[0].paragraphs![0]} {people.length} people are listed, sorted by last name. Select a name to open a faculty profile.
        </p>

        <form className="intranet-search directory-filter" role="search" aria-label="Directory" onSubmit={(e) => e.preventDefault()}>
          <Field
            scenario="employees-directory-search-placeholder-001" id={`${id}-q`} label="Name or title" defect="placeholder" type="search"
            value={q} onChange={(e) => setQ(e.target.value)}
          />
          <div className="field">
            <label htmlFor={`${id}-dept`}>Department</label>
            <select id={`${id}-dept`} value={dept} onChange={(e) => setDept(e.target.value)}>
              <option value="all">All departments and offices</option>
              {depts.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </form>
        <p className="directory-count" role={liveFixed ? "status" : undefined} data-a11y-scenario="employees-directory-count-live-001">
          {found.length ? `${found.length} ${found.length === 1 ? "person" : "people"} found` : "No one matches your search."}
        </p>

        <nav aria-label="Jump to letter" className="directory-letters" data-a11y-scenario="employees-directory-letter-links-001">
          <ul>
            {LETTERS.map((l) => (
              <li key={l}>
                {groups.has(l)
                  ? <a href={`#letter-${l}`}>{l}</a>
                  : lettersFixed ? <span className="letter-empty">{l}</span> : <a href="#" className="letter-empty">{l}</a>}
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="listing-heading" className="stack">
          <h2 id="listing-heading">Faculty and staff A–Z</h2>
          {[...groups].map(([letter, list]) => <LetterTable key={letter} letter={letter} people={list} />)}
        </section>

        <Callout title="Update your listing">
          <p>Name, title, and office changes come from the HR record. Phone and room changes are made by your department's facilities coordinator.</p>
        </Callout>
        <ContactCard
          title="Directory corrections"
          lines={[
            { label: "Human Resources", value: "(707) 555-0180", href: "tel:7075550180" },
            { label: "Email", value: "hr@redwoodstate.edu", href: "mailto:hr@redwoodstate.edu" },
          ]}
        />
      </div>
    </>
  );
}

function LetterTable({ letter, people }: { letter: string; people: Person[] }) {
  const captionFixed = useScenario("employees-directory-caption-001");
  const headersFixed = useScenario("employees-directory-headers-001");
  const emailFixed = useScenario("employees-directory-email-empty-001");
  const headers = ["Name", "Title", "Department", "Phone", "Email", "Location"];
  const hid = (i: number) => (headersFixed ? undefined : `dir-${letter}-${COLS[i]}`);
  const ref = (i: number) => (headersFixed ? undefined : `${letter}-${COLS[i]}`);

  return (
    <div className="directory-group" id={`letter-${letter}`}>
      <Heading scenario="employees-directory-letter-heading-001" level={3} defect="skipped" defectLevel={4} className="directory-letter">{letter}</Heading>
      <div className="directory-table-wrap">
        <table
          className="data-table directory-table"
          aria-describedby="directory-help"
          data-a11y-scenario="employees-directory-caption-001 employees-directory-headers-001 employees-directory-describedby-001"
        >
          {captionFixed && <caption className="visually-hidden">Faculty and staff, last names beginning with {letter}</caption>}
          <thead><tr>{headers.map((h, i) => <th key={h} scope="col" id={hid(i)}>{h}</th>)}</tr></thead>
          <tbody>
            {people.map((p) => (
              <tr key={p.slug}>
                {headersFixed ? <th scope="row"><Name p={p} /></th> : <td headers={ref(0)}><Name p={p} /></td>}
                <td headers={ref(1)}>{p.title}</td>
                <td headers={ref(2)}>{p.department}</td>
                <td headers={ref(3)}><a href={`tel:${p.phone.replace(/\D/g, "")}`}>{p.phone}</a></td>
                <td headers={ref(4)}>
                  <a href={`mailto:${p.email}`} className="directory-email" data-a11y-scenario="employees-directory-email-empty-001">
                    {mail}{emailFixed && <span className="visually-hidden">Email {p.name}</span>}
                  </a>
                </td>
                <td headers={ref(5)} className="directory-location">{p.building} {p.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Name({ p }: { p: Person }) {
  if (!p.hasProfile) return <>{p.name}</>;
  return <SmartLink scenario="employees-directory-profile-newwindow-001" to={`/faculty/${p.slug}`} newWindow>{p.name}</SmartLink>;
}

