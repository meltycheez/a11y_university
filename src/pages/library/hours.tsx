// /library/hours: this week's hours by location plus the semester schedule from pageContent.
import { Heading } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { ContactCard, ContentSection } from "~/components/blocks";
import { pageContent } from "~/data/content/pages";
import { addDays, SITE_NOW } from "~/data/site";

export { inventoryMeta as meta } from "~/routes/meta";

const WEEK_START = addDays(SITE_NOW, -new Date(`${SITE_NOW}T00:00:00Z`).getUTCDay()); // Sunday of this week
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
/** Semester table columns: 1 Mon–Thu, 2 Fri, 3 Sat, 4 Sun. */
const COLUMN = [4, 1, 1, 1, 1, 2, 3];

export default function LibraryHours() {
  const colorFixed = useScenario("library-hours-closed-color-001");
  const captionFixed = useScenario("library-hours-caption-001");
  useScenario("library-hours-underline-001"); // CSS scenario (library.css)
  const content = pageContent["/library/hours"];
  const rows = content?.sections[0].table?.rows ?? [];
  const week = DAYS.map((d, i) => ({ d, iso: addDays(WEEK_START, i) }));

  return (
    <div className="page-content lib-hours">
      <header>
        <h1 id="page-title">Library Hours</h1>
        <p>{content?.summary}</p>
      </header>

      <section aria-labelledby="week-heading">
        <h2 id="week-heading">This week</h2>
        <div className="table-scroll" data-a11y-scenario="library-hours-closed-color-001 library-hours-caption-001">
          <table className="lib-hours-table">
            {captionFixed && <caption>Hours by location, week of October {Number(WEEK_START.slice(8))}, 2026</caption>}
            <thead>
              <tr>
                <th scope="col">Location</th>
                {week.map(({ d, iso }) => <th key={iso} scope="col" className={iso === SITE_NOW ? "is-today" : undefined}>{d} {Number(iso.slice(5, 7))}/{Number(iso.slice(8))}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]}>
                  <th scope="row">{row[0]}</th>
                  {week.map(({ iso }, i) => {
                    const value = row[COLUMN[i]];
                    const closed = value === "Closed";
                    return (
                      <td key={iso} className={`${closed ? "lib-closed" : ""}${iso === SITE_NOW ? " is-today" : ""}`}>
                        {closed && !colorFixed ? "" : value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="exceptions-heading" className="stack">
        <h2 id="exceptions-heading">Finals and holidays</h2>
        <p>
          <span className="lib-underline" data-a11y-scenario="library-hours-underline-001">Finals week (December 12–18): open 24 hours.</span>{" "}
          Your RSU ID is required to enter between midnight and 7:30 a.m.
        </p>
        <Heading scenario="library-hours-heading-skip-001" level={3} defect="skipped" defectLevel={5}>Holiday closures</Heading>
        <ul>
          <li>Thanksgiving: closed Thursday, November 26 and Friday, November 27</li>
          <li>Winter break: reduced hours December 19 – January 17, posted in early December</li>
        </ul>
      </section>

      {content && <ContentSection section={{ heading: "Fall semester schedule", table: content.sections[0].table }} />}

      <ContactCard title="Questions about hours?" lines={[{ label: "Circulation Desk", value: "(707) 555-0271", href: "tel:+17075550271" }, { label: "Email", value: "askus@redwoodstate.edu", href: "mailto:askus@redwoodstate.edu" }]} />
    </div>
  );
}
