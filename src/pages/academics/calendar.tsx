import { Link } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { RelatedLinks } from "~/components/blocks";
import { pageContent } from "~/data/content/pages";
import { CmsPage, PDF_INFO } from "./_cms";

export { inventoryMeta as meta } from "~/routes/meta";

const content = pageContent["/academics/calendar"];
const pdf = content.sections.flatMap((s) => s.links ?? [])[0];
const CLOSED = " (campus closed)";

export default function CalendarPage() {
  const captionFixed = useScenario("academics-calendar-caption-001");
  const headersFixed = useScenario("academics-calendar-headers-001");
  const colorFixed = useScenario("academics-calendar-closed-color-001");

  return (
    <CmsPage className="cms-calendar">
      <Hero title="Academic Calendar" lede={content.summary} variant="banner" />
      <div className="page-content">
        <Callout title="Census dates">
          <p>Census is September 18 (Fall 2026) and February 12 (Spring 2027). These are the university's official enrollment counts for each term.</p>
        </Callout>

        <p className="cms-legend" data-a11y-scenario="academics-calendar-closed-color-001">
          {colorFixed ? "Campus closures are marked “campus closed.”" : <>Dates shown in <span className="cms-full">red</span>: campus closed.</>}
        </p>

        {content.sections.map((s) => {
          const t = s.table!;
          const key = s.heading!.toLowerCase().replace(/\s+/g, "-");
          const cols = t.columns.map((c) => ({ label: c, id: `${key}-${c.toLowerCase()}` }));
          return (
            <section key={key} className="stack">
              <h2>{s.heading}</h2>
              <div className="table-scroll">
                <table className="cms-table cms-table--narrow" data-a11y-scenario="academics-calendar-caption-001 academics-calendar-headers-001">
                  {captionFixed && t.caption && <caption>{t.caption}</caption>}
                  <thead><tr>{cols.map((c) => <th key={c.id} id={c.id} scope="col">{c.label}</th>)}</tr></thead>
                  <tbody>
                    {t.rows.map(([date, event]) => {
                      const closed = event.endsWith(CLOSED);
                      const text = closed && !colorFixed ? event.slice(0, -CLOSED.length) : event;
                      return (
                        <tr key={date + event} className={closed && !colorFixed ? "cms-full" : undefined}>
                          {[date, text].map((cell, i) => (
                            <td key={i} headers={headersFixed ? cols[i].id : cols[i].label.toLowerCase()}>{cell}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        {pdf && (
          <p>
            Print version:{" "}
            <SmartLink scenario="academics-calendar-pdf-link-001" to={pdf.href} fileInfo={PDF_INFO}>
              {pdf.label.replace(/\s*\(PDF\)$/, "")}
            </SmartLink>
          </p>
        )}

        <RelatedLinks
          title="Related"
          links={[
            { label: "Office of the Registrar", href: "/students/registrar" },
            { label: "Course Search", href: "/academics/courses" },
            { label: "Events Calendar", href: "/events" },
          ]}
        />
        <p><Link to="/academics">Back to Academics</Link></p>
      </div>
    </CmsPage>
  );
}
