// EventPage (/events/:slug): vendor calendar event detail, with the registration form (plan 06 #6) on events
// whose registration is still open.
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { ContactCard, RelatedLinks } from "~/components/blocks";
import { Img } from "~/components/Img";
import { eventsContent, type EventDetail, type RegistrationOption } from "~/data/content/events";
import { confirmationCode, latency } from "~/lib/interactive";
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
          {closed || !reg.options?.length ? (
            <>
              {reg.options && (
                <ul className="evd-options">
                  {reg.options.map((o) => <li key={o.id}>{o.label}<span className="evd-price">{price(o.price)}</span></li>)}
                </ul>
              )}
              <p>Online registration for this event has closed. Contact {contact.name} with questions.</p>
            </>
          ) : <RegistrationForm event={event} options={reg.options} />}
        </>
      )}
    </section>
  );
}

const MAX_ATTENDEES = 8;
const price = (n: number) => (n ? `$${n}` : "Free");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The vendor's registration form (plan 06 #6). Defects: a click-only <span> stepper for the attendee count,
 * required fields marked only by a red asterisk, "Invalid input" errors, and a confirmation that appears silently.
 */
function RegistrationForm({ event, options }: { event: EventDetail; options: RegistrationOption[] }) {
  const stepperFixed = useScenario("events-reg-stepper-001");
  const requiredFixed = useScenario("events-reg-required-001");
  const errorsFixed = useScenario("events-reg-errors-001");
  const confirmFixed = useScenario("events-reg-confirm-001");
  const [count, setCount] = useState(1);
  const [option, setOption] = useState(options[0].id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const id = `reg-${event.slug}`;
  const chosen = options.find((o) => o.id === option) ?? options[0];
  const setClamped = (n: number) => setCount(Math.min(MAX_ATTENDEES, Math.max(1, n || 1)));

  useEffect(() => { if (code && confirmFixed) confirmRef.current?.focus(); }, [code, confirmFixed]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = errorsFixed ? "Enter the name of the person registering." : "Invalid input";
    if (!EMAIL.test(email.trim())) next.email = errorsFixed ? "Enter an email address in the format name@example.com." : "Invalid input";
    setErrors(next);
    if (next.name || next.email) {
      if (errorsFixed) document.getElementById(`${id}-${next.name ? "name" : "email"}`)?.focus();
      return;
    }
    setBusy(true);
    await latency(`register-${event.slug}`);
    setBusy(false);
    setCode(confirmationCode(`${event.slug}|${option}|${count}|${name.trim().toLowerCase()}|${email.trim().toLowerCase()}`));
  }

  const req = requiredFixed ? <span className="evd-req-text"> (required)</span> : <span className="evd-req"> *</span>;
  const text = (field: "name" | "email", label: string, value: string, set: (v: string) => void, type: string, autoComplete: string) => {
    const err = errors[field];
    const errId = `${id}-${field}-error`;
    return (
      <div className={`field${err ? " has-error" : ""}`}>
        <label htmlFor={`${id}-${field}`}>{label}{req}</label>
        <input
          id={`${id}-${field}`} type={type} autoComplete={autoComplete} value={value} onChange={(e) => set(e.target.value)}
          aria-required={requiredFixed || undefined}
          aria-invalid={errorsFixed && err ? true : undefined}
          aria-describedby={errorsFixed && err ? errId : undefined}
        />
        {err && <span id={errId} className="evd-error">{err}</span>}
      </div>
    );
  };

  return (
    <>
      <div ref={confirmRef} tabIndex={-1} className="evd-confirm" role={confirmFixed ? "status" : undefined} data-a11y-scenario="events-reg-confirm-001">
        {code && (
          <>
            <p className="evd-confirm-title"><strong>You're registered for {event.title}.</strong></p>
            <p>Confirmation number <strong className="evd-code">{code}</strong>. {count} × {chosen.label}, total {price(chosen.price * count)}. A copy is on its way to {email.trim()}.</p>
          </>
        )}
      </div>
      {!code && (
        <form className="evd-form" noValidate onSubmit={submit} data-a11y-scenario="events-reg-required-001 events-reg-errors-001">
          <fieldset className="evd-choice">
            <legend>Registration option</legend>
            {options.map((o) => (
              <label key={o.id} className="evd-choice-item">
                <input type="radio" name={`${id}-option`} value={o.id} checked={option === o.id} onChange={() => setOption(o.id)} />
                <span>{o.label}</span>
                <span className="evd-price">{price(o.price)}</span>
              </label>
            ))}
          </fieldset>

          <div className="field evd-stepper" data-a11y-scenario="events-reg-stepper-001">
            {stepperFixed ? (
              <>
                <label htmlFor={`${id}-count`}>Number of attendees</label>
                <div className="evd-stepper-row">
                  <button type="button" className="evd-step" aria-label="Remove one attendee" disabled={count <= 1} onClick={() => setClamped(count - 1)}>−</button>
                  <input id={`${id}-count`} className="evd-count" type="number" min={1} max={MAX_ATTENDEES} value={count} onChange={(e) => setClamped(Number(e.target.value))} />
                  <button type="button" className="evd-step" aria-label="Add one attendee" disabled={count >= MAX_ATTENDEES} onClick={() => setClamped(count + 1)}>+</button>
                </div>
              </>
            ) : (
              <>
                <span className="field-label">Number of attendees</span>
                <div className="evd-stepper-row">
                  <span className="evd-step" onClick={() => setClamped(count - 1)}>−</span>
                  <span className="evd-count">{count}</span>
                  <span className="evd-step" onClick={() => setClamped(count + 1)}>+</span>
                </div>
              </>
            )}
            <span className="field-hint">Up to {MAX_ATTENDEES} per registration.</span>
          </div>

          {text("name", "Full name", name, setName, "text", "name")}
          {text("email", "Email", email, setEmail, "email", "email")}

          <p className="evd-total">Total: <strong>{price(chosen.price * count)}</strong>{chosen.price ? " (pay at check-in)" : ""}</p>
          <button type="submit" className="btn btn--primary" disabled={busy}>{busy ? "Registering…" : "Register"}</button>
        </form>
      )}
    </>
  );
}
