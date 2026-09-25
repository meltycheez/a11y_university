import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Field, Heading } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import { Callout } from "~/components/Callout";
import { Modal } from "~/components/Modal";
import { DatePicker, Toast } from "~/components/widgets";
import { VideoEmbed } from "~/components/blocks";
import { SITE_NOW, addDays, formatDate } from "~/data/site";
import { confirmationCode, hash, latency } from "~/lib/interactive";
import { LinkList, Table, content } from "./_content";

export { inventoryMeta as meta } from "~/routes/meta";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayOf = (iso: string) => DAYS[new Date(`${iso}T00:00:00Z`).getUTCDay()];

// Weekday walking tours, bookable from tomorrow through eight weeks out (SITE_NOW, never the clock).
const FIRST = addDays(SITE_NOW, 1);
const LAST = addDays(SITE_NOW, 56);
const TIMES = ["10:00 a.m.", "2:00 p.m."];
const SPOTS = 20;
const isTourDay = (d: string) => d >= FIRST && d <= LAST && !["Saturday", "Sunday"].includes(dayOf(d));
/** Deterministic spots already taken; about one slot in eight is full. */
const takenSpots = (date: string, time: string) => (hash(`${date} ${time}`) % 8 === 0 ? SPOTS : hash(`${time} ${date}`) % 18);

const GALLERY = [
  { image: "campus-library-interior", defect: "DSC_0192.JPG", caption: "Sequoia Library reading room" },
  { image: "campus-dining-hall", defect: "DSC_0247.JPG", caption: "Lunch at the dining commons" },
  { image: "campus-housing-madrone", defect: "DSC_0311.JPG", caption: "A double room in Madrone Hall" },
];

export default function Visit() {
  const c = content("/admissions/visit")!;
  const [intro, schedule] = c.sections;
  useScenario("adm-visit-saturday-contrast-001"); // CSS scenario (marketing.css): register only.

  return (
    <div className="adm-visit">
      <Hero title="Visit Campus" kicker="Admissions" lede={c.summary} image="admissions-hero-tour" imageScenario="adm-visit-hero-alt-001">
        <a href="#choose-date" className="btn btn--primary">Choose a tour date</a>
      </Hero>
      <div className="page-content">
        <p className="adm-lead">{intro.paragraphs![0]}</p>

        <section className="stack">
          <Heading scenario="adm-visit-tips-heading-001" level={2} defect="fake">Before you come</Heading>
          <ul>
            <li>Tours depart from the Welcome Center in Founders Hall 110.</li>
            <li>Plan on about 90 minutes of walking, including a residence hall and Sequoia Library.</li>
            <li>Wear comfortable shoes and bring a rain jacket.</li>
          </ul>
        </section>

        <section className="stack" aria-labelledby="schedule-heading">
          <h2 id="schedule-heading">{schedule.heading}</h2>
          <Table table={schedule.table!} caption="Weekly campus tour schedule" captionScenario="adm-visit-schedule-caption-001" />
          <div className="adm-saturday" data-a11y-scenario="adm-visit-saturday-contrast-001">
            <Callout title="Saturday tours">
              <p>Saturday tours run at 11:00 a.m. on select Saturdays, September through April. Dates fill quickly in the spring.</p>
            </Callout>
          </div>
        </section>

        <VisitScheduler />

        <section className="stack" aria-labelledby="virtual-heading">
          <h2 id="virtual-heading">Can't make it to the redwoods?</h2>
          <p>Join a virtual information session with an admissions counselor on Tuesdays at 5:00 p.m., or watch the tour video.</p>
          <VideoEmbed title="Redwood State virtual campus tour" titleScenario="adm-visit-video-title-001" />
        </section>

        <section className="stack" aria-labelledby="gallery-heading">
          <h2 id="gallery-heading">What you'll see</h2>
          <div className="gallery" data-a11y-scenario="adm-visit-gallery-alt-001">
            {GALLERY.map((g) => (
              <figure key={g.image}>
                <Img image={g.image} alt={g.defect} scenario="adm-visit-gallery-alt-001" fixedAlt="" sizes="(min-width: 60rem) 30vw, 100vw" aspect="4 / 3" />
                <figcaption>{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <nav className="related-links" aria-label="Plan your trip">
          <h2>Plan your trip</h2>
          <LinkList links={schedule.links!} fixes={{ "Directions and parking": { scenario: "adm-visit-directions-new-window-001", newWindow: true } }} />
        </nav>
      </div>
    </div>
  );
}

/**
 * Tour booking (plan 06 #12): date picker, time slots, a reservation dialog and a confirmation toast. Honors
 * ?date=YYYY-MM-DD&time=… links, read after hydration so the prerendered HTML stays query-free (ADR-015).
 */
function VisitScheduler() {
  const timeFixed = useScenario("visit-time-state-001");
  const guestsFixed = useScenario("visit-guests-select-001");
  const [params] = useSearchParams();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [pickerKey, setPickerKey] = useState(0);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState("1");
  const [busy, setBusy] = useState(false);
  const [booked, setBooked] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);
  const dismiss = useCallback(() => setToast(null), []);

  useEffect(() => {
    const d = params.get("date") ?? "";
    const t = params.get("time") ?? "";
    if (!isTourDay(d)) return;
    setDate(d);
    setTime(TIMES.includes(t) ? t : "");
    setPickerKey((k) => k + 1); // remount the picker so its month shows the linked date
  }, [params]);

  const left = (t: string) => SPOTS - takenSpots(date, t) - (booked[`${date} ${t}`] ?? 0);
  const pick = (d: string) => { setDate(d); setTime(""); };
  const when = date && time ? `${dayOf(date)}, ${formatDate(date)} at ${time}` : "";

  async function confirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const party = Number(guests);
    setBusy(true);
    await latency(`visit-${date}-${time}`);
    setBusy(false);
    setBooked((b) => ({ ...b, [`${date} ${time}`]: (b[`${date} ${time}`] ?? 0) + party }));
    setOpen(false);
    setToast(`You're booked for the ${when} campus tour (party of ${party}). Confirmation ${confirmationCode(`visit|${date}|${time}|${email.trim().toLowerCase()}`)}.`);
  }

  return (
    <section className="stack visit-scheduler" id="choose-date" aria-labelledby="dates-heading">
      <h2 id="dates-heading">Choose a date</h2>
      <p>Weekday campus walking tours run at 10:00 a.m. and 2:00 p.m. Pick a date, then a time, to reserve your spot.</p>

      <div className="visit-picker">
        <DatePicker key={pickerKey} label="Tour date" value={date} onChange={pick} min={FIRST} max={LAST} isAvailable={isTourDay} scenario="visit-datepicker-grid-001" defect="mouse-only-grid" />

        <div className="visit-times" data-a11y-scenario="visit-time-state-001">
          <p className="visit-times-label">{date ? `Tour times for ${dayOf(date)}, ${formatDate(date)}` : "Tour times"}</p>
          {!date && <p className="visit-note">Choose a date to see tour times.</p>}
          {date && !isTourDay(date) && <p className="visit-note">Tours run Monday through Friday, {formatDate(FIRST)} to {formatDate(LAST)}. Choose another date.</p>}
          {date && isTourDay(date) && (
            <div className="visit-time-list">
              {TIMES.map((t) => {
                const n = left(t);
                return (
                  <button key={t} type="button" className={`visit-time${t === time ? " is-selected" : ""}`} disabled={n <= 0}
                    aria-pressed={timeFixed ? t === time : undefined} onClick={() => setTime(t)}>
                    <span className="visit-time-at">{t}</span>
                    <span className="visit-time-left">{n > 0 ? `${n} spots left` : "Full"}</span>
                  </button>
                );
              })}
            </div>
          )}
          <button type="button" className="btn btn--primary visit-reserve" disabled={!when} onClick={() => setOpen(true)}>Reserve this tour</button>
        </div>
      </div>

      <Modal open={open} title="Reserve your campus tour" onClose={() => setOpen(false)} scenario="visit-modal-restore-001" defect="no-restore">
        <form className="visit-form" onSubmit={confirm}>
          <p className="visit-when"><strong>{when || "Choose a date and time first."}</strong><br />Welcome Center, Founders Hall 110</p>
          <Field scenario="visit-name-placeholder-001" id="visit-name" label="Visitor name" defect="placeholder" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="field">
            <label htmlFor="visit-email">Email</label>
            <input id="visit-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field" data-a11y-scenario="visit-guests-select-001">
            {guestsFixed ? <label htmlFor="visit-guests">How many in your group?</label> : <p className="field-label">How many in your group?</p>}
            <select id="visit-guests" value={guests} onChange={(e) => setGuests(e.target.value)}>
              {[1, 2, 3, 4, 5, 6].filter((n) => !time || n <= Math.max(1, left(time))).map((n) => <option key={n} value={n}>{n === 1 ? "Just me" : `${n} people`}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn--primary" disabled={busy || !when}>{busy ? "Reserving…" : "Confirm reservation"}</button>
        </form>
      </Modal>

      <Toast message={toast} onDismiss={dismiss} scenario="visit-toast-001" defect="vanishes" />
    </section>
  );
}
