// /events/category/:slug: the vendor calendar's category listing.
import { Link, useParams } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { CtaBand, RelatedLinks } from "~/components/blocks";
import { Img } from "~/components/Img";
import { eventCategories } from "~/data/catalog";
import { isPast } from "~/data/site";
import NotFoundPage from "~/pages/NotFoundPage";
import { cost, day, eventList, formatWhen, shortDate } from "../_shared";

export { inventoryMeta as meta } from "~/routes/meta";

const ctas: Record<string, { title: string; text: string; action: { label: string; href: string } }> = {
  academic: { title: "Visit campus", text: "Prospective students and families can tour campus and meet faculty at an open house.", action: { label: "Plan a visit", href: "/admissions/visit" } },
  arts: { title: "Support the arts", text: "Gifts to the Hartwell Fine Arts Center keep student performances free for students.", action: { label: "Make a gift", href: "/giving" } },
  athletics: { title: "Full Owls schedule", text: "Every home and away game for all 14 Redwood Owls teams.", action: { label: "Composite schedule", href: "/athletics/schedule" } },
  "student-life": { title: "Get involved", text: "Student organizations host events all year, from club fairs to cultural nights.", action: { label: "Student organizations", href: "/students/organizations" } },
};

export default function EventsCategory() {
  const { slug = "" } = useParams();
  const category = eventCategories.find((c) => c.slug === slug);
  useScenario("events-category-meta-contrast-001"); // CSS scenario (calendar.css)
  if (!category) return <NotFoundPage />;
  const list = eventList.filter((e) => e.category === slug);

  return (
    <div className="page-content evc" data-a11y-scenario="events-category-meta-contrast-001">
      <header>
        <p className="hero-kicker">Events Calendar</p>
        <h1 id="page-title">{category.name} Events</h1>
        <p>{list.length} {list.length === 1 ? "event" : "events"} this fall.</p>
      </header>

      <ul className="evc-list">
        {list.map((e) => {
          const badge = shortDate(day(e.start));
          return (
            <li key={e.slug} className="evc-item">
              <span className="evc-badge" aria-hidden="true"><span>{badge.month}</span><strong>{badge.day}</strong></span>
              <Img image={e.image} scenario="events-category-img-alt-001" fixedAlt="" className="evc-thumb" sizes="10rem" aspect="4 / 3" />
              <div>
                <h2 className="evc-title"><Link to={`/events/${e.slug}`}>{e.title}</Link></h2>
                <p className="evc-meta">{formatWhen(e)}{isPast(e.end) && " (past event)"}</p>
                <p className="evc-meta">{e.location} · {cost(e)}</p>
                <p>{e.description[0].split(". ")[0]}.</p>
                <SmartLink scenario="events-category-details-001" to={`/events/${e.slug}`} defect="Details" className="evc-more">
                  Details<span className="visually-hidden">: {e.title}</span>
                </SmartLink>
              </div>
            </li>
          );
        })}
      </ul>

      <CtaBand {...ctas[slug]} />
      <RelatedLinks
        title="Other categories"
        links={[{ label: "All events (calendar)", href: "/events" }, ...eventCategories.filter((c) => c.slug !== slug).map((c) => ({ label: `${c.name} events`, href: `/events/category/${c.slug}` }))]}
      />
    </div>
  );
}
