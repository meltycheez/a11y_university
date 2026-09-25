// EventPage (/events/:slug): vendor calendar event detail. The interactive registration form is plan 06 (#6);
// this page shows the registration options and deadline with an email fallback.
import { Link, useParams } from "react-router";
import { Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { ContactCard, RelatedLinks } from "~/components/blocks";
import { Img } from "~/components/Img";
import { eventsContent, type EventDetail } from "~/data/content/events";
import { formatDate, isPast } from "~/data/site";
import NotFoundPage from "~/pages/NotFoundPage";
import { categoryName, cost, eventList, formatTime, formatWhen } from "./_shared";

export { inventoryMeta as meta } from "~/routes/meta";

export default function EventPage() {
  const { slug = "" } = useParams();
  const event = eventsContent[slug];
  if (!event) return <NotFoundPage />;
  const more = eventList.filter((e) => e.category === event.category && e.slug !== event.slug);

  return (
    <article className="evd">
      <header className="evd-header">
        <p className="hero-kicker"><Link to={`/events/category/${event.category}`}>{categoryName(event.category)}</Link></p>
        <h1 id="page-title">{event.title}</h1>
        <p className="evd-when">{formatWhen(event)}</p>
      </header>

      <div className="evd-layout">
        <div className="evd-main">
          <Img image={event.image} alt={`${event.slug}_FINAL_web.jpg`} scenario="events-detail-img-alt-001" className="evd-image" sizes="(min-width: 60rem) 44rem, 100vw" loading="eager" />
          {event.description.map((p, i) => <p key={i}>{p}</p>)}
          {event.accessibilityNote && (
            <section className="evd-access">
              <Heading scenario="events-detail-access-heading-001" level={2} defect="fake">Accessibility</Heading>
              <p>{event.accessibilityNote}</p>
            </section>
          )}
          <Registration event={event} />
        </div>

        <aside className="evd-aside">
          <Facts event={event} />
          <ContactCard
            title="Event contact"
            lines={[
              { label: "Sponsor", value: event.contact.name },
              { label: "Email", value: event.contact.email, href: `mailto:${event.contact.email}` },
              ...(event.contact.phone ? [{ label: "Phone", value: event.contact.phone, href: `tel:+1${event.contact.phone.replace(/\D/g, "")}` }] : []),
            ]}
          />
          {more.length > 0 && <RelatedLinks title={`More ${categoryName(event.category)} events`} links={more.map((e) => ({ label: e.title, href: `/events/${e.slug}` }))} />}
        </aside>
      </div>
    </article>
  );
}

/** The vendor widget lays the event facts out in a borderless two-column table (events-detail-facts-table-001). */
function Facts({ event }: { event: EventDetail }) {
  const fixed = useScenario("events-detail-facts-table-001");
  const rows: [string, React.ReactNode][] = [
    ["When", formatWhen(event)],
    ["Where", <>
      {event.location}{" "}
      <SmartLink scenario="events-detail-directions-001" to="/campus-map" newWindow className="evd-directions">Get directions</SmartLink>
    </>],
    ["Cost", cost(event)],
    ["Capacity", event.capacity.toLocaleString("en-US")],
    ["Category", categoryName(event.category)],
  ];
  return (
    <section className="evd-facts" aria-labelledby="facts-heading" data-a11y-scenario="events-detail-facts-table-001">
      <h2 id="facts-heading">Event details</h2>
      {fixed
        ? <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        : <table><tbody>{rows.map(([k, v]) => <tr key={k}><td className="evd-facts-key">{k}</td><td>{v}</td></tr>)}</tbody></table>}
    </section>
  );
}

function Registration({ event }: { event: EventDetail }) {
  const { registration: reg, contact } = event;
  const closed = reg.deadline ? isPast(reg.deadline) : isPast(event.end);
  return (
    <section className="evd-registration" id="registration" aria-labelledby="registration-heading">
      <h2 id="registration-heading">Registration</h2>
      {!reg.required ? (
        <p>No registration is required. Just come by{isPast(event.end) ? "" : ` on ${formatDate(event.start)}`}.</p>
      ) : (
        <>
          {reg.deadline && (
            <p>
              <strong>{closed ? "Registration closed" : "Register by"} {formatDate(reg.deadline)}, {formatTime(reg.deadline)}.</strong>{" "}
              Space is limited to {event.capacity.toLocaleString("en-US")}.
            </p>
          )}
          {reg.options && (
            <ul className="evd-options">
              {reg.options.map((o) => <li key={o.id}>{o.label}<span className="evd-price">{o.price ? `$${o.price}` : "Free"}</span></li>)}
            </ul>
          )}
          {closed
            ? <p>Online registration for this event has closed. Contact {contact.name} with questions.</p>
            : (
              <>
                <p>Online registration is being moved to a new system. Until it opens, email the sponsor with your name, the option you want and the number of attendees.</p>
                <a className="btn btn--primary" href={`mailto:${contact.email}?subject=${encodeURIComponent(`Registration: ${event.title}`)}`}>Register by email</a>
              </>
            )}
        </>
      )}
    </section>
  );
}
