// /portal/schedule: week view plus the class list data grid.
import { Link, useLoaderData } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { faculty } from "~/data/catalog";
import portal from "~/data/generated/portal.json";
import type { PortalStudent } from "~/data/types";
import { PortalPage, time12 } from "./_PortalPage";

export { inventoryMeta as meta } from "~/routes/meta";

const days = [["M", "Monday"], ["T", "Tuesday"], ["W", "Wednesday"], ["R", "Thursday"], ["F", "Friday"]] as const;

export async function loader() {
  const p = portal as unknown as PortalStudent;
  return { term: p.currentTerm, classes: p.schedule };
}

export default function SchedulePage() {
  const { term, classes } = useLoaderData<typeof loader>();
  const captionFixed = useScenario("portal-sched-caption-001");
  useScenario("portal-sched-week-clip-001");
  const credits = classes.reduce((n, c) => n + c.credits, 0);

  return (
    <PortalPage title="Class Schedule" subtitle={`${term} · ${classes.length} classes · ${credits} credits`}>
      <section className="pt-card" aria-labelledby="week-heading">
        <h2 id="week-heading">Week at a Glance</h2>
        <div className="pt-week-frame" data-a11y-scenario="portal-sched-week-clip-001">
          <div className="pt-week">
            {days.map(([code, name]) => (
              <div key={code} className="pt-week-day">
                <h3>{name}</h3>
                {classes
                  .filter((c) => c.section.days.includes(code))
                  .sort((a, b) => a.section.start.localeCompare(b.section.start))
                  .map((c) => (
                    <p key={c.section.crn} className="pt-week-block">
                      <strong>{c.code}</strong><br />{time12(c.section.start)}–{time12(c.section.end)}<br />{c.section.room}
                    </p>
                  ))}
                {!classes.some((c) => c.section.days.includes(code)) && <p className="pt-muted">No classes</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-card" aria-labelledby="list-heading">
        <h2 id="list-heading">Class List</h2>
        <div className="table-wrap">
          <table className="pt-grid" data-a11y-scenario="portal-sched-caption-001">
            {captionFixed && <caption>{term} enrolled classes</caption>}
            <thead>
              <tr>
                <th scope="col">Course</th><th scope="col">Title</th><th scope="col">CRN</th><th scope="col" className="num">Credits</th>
                <th scope="col">Days &amp; Times</th><th scope="col">Location</th><th scope="col">Instructor</th><th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => {
                const s = c.section;
                const hasProfile = faculty.some((f) => f.slug === s.instructorSlug);
                return (
                  <tr key={s.crn}>
                    <th scope="row">{c.code}-{s.section}</th>
                    <td>{c.title}</td>
                    <td>{s.crn}</td>
                    <td className="num">{c.credits.toFixed(1)}</td>
                    <td>{s.days} {time12(s.start)}–{time12(s.end)}</td>
                    <td>
                      {s.room}, <SmartLink scenario="portal-sched-map-window-001" to="/campus-map" newWindow>{s.building}</SmartLink>
                    </td>
                    <td>{hasProfile ? <Link to={`/faculty/${s.instructorSlug}`}>{s.instructor}</Link> : s.instructor}</td>
                    <td>Enrolled</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="pt-muted">To add, drop, or swap classes, go to <Link to="/portal/registration">Registration</Link>.</p>
      </section>
    </PortalPage>
  );
}
