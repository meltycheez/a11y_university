// /portal/registration: the RedwoodConnect Student Registration SPA (plan 06 #2; a plan 07 "terrible" page, tier T).
// Class search, a shopping cart held in a module store (survives navigation, resets on reload), time-conflict
// checks against Jordan's schedule and the cart, priority reordering, and a fake Register with latency that ends
// in registered / waitlisted / error results. Every defect is registered in a11y/registry/registration.ts.
// Also the voice control CTF (plan 11 §6): register CTF_ORDER in that priority order to reveal the flag.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { Field, Heading, IconButton, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Tabs } from "~/components/Tabs";
import { Dropdown, Toast } from "~/components/widgets";
import courses from "~/data/generated/courses.json";
import portal from "~/data/generated/portal.json";
import type { Course, CourseSection, PortalStudent, Term } from "~/data/types";
import { ChallengeBanner } from "~/ctf/ChallengeBanner";
import { ChallengeComplete } from "~/ctf/ChallengeComplete";
import { isRunning, revealFlag } from "~/ctf/store";
import { createStore, latency } from "~/lib/interactive";
import { PortalPage, erpDate, time12 } from "./_PortalPage";

export { inventoryMeta as meta } from "~/routes/meta";

const slim = (c: { id: string; code: string; title: string; credits: number }, s: CourseSection) => ({
  crn: s.crn, courseId: c.id, subject: c.code.split(" ")[0], code: c.code, title: c.title, credits: c.credits,
  section: s.section, term: s.term, instructor: s.instructor, mode: s.mode, days: s.days, start: s.start, end: s.end,
  room: s.room, building: s.building, capacity: s.capacity, enrolled: s.enrolled, waitlist: s.waitlist,
});

export async function loader() {
  const p = portal as unknown as PortalStudent;
  const all = courses as unknown as Course[];
  return {
    sections: all.flatMap((c) => c.sections.map((s) => slim(c, s))),
    subjects: [...new Map(all.map((c) => [c.subject, c.subjectName])).entries()].sort((a, b) => a[1].localeCompare(b[1])),
    enrolled: p.schedule.map((e) => slim({ id: e.courseId, code: e.code, title: e.title, credits: e.credits }, e.section)),
    ticket: p.registration.timeTicket,
    maxCredits: p.registration.maxCredits,
    holds: p.holds.length,
  };
}

type Sec = ReturnType<typeof slim>;
type Status = "registered" | "waitlisted" | "error";
interface Result { crn: string; status: Status; message: string }

// Cart (CRNs in priority order), what this session registered, and the last results. Never persisted.
const regStore = createStore({
  cart: [] as string[],
  registered: [] as { crn: string; status: "registered" | "waitlisted" }[],
  results: null as { term: Term; items: Result[]; flag?: string; ctfNote?: string } | null,
});

// CTF target: MATH 101-02, CHEM 101-02, ENGL 111-01 (Spring 2027), registered in exactly this priority order.
const CTF_ORDER = ["44458", "45934", "43099"];

const TERMS: Term[] = ["Spring 2027", "Fall 2026"];
const when = (s: Sec) => (s.days ? `${s.days} ${time12(s.start)}–${time12(s.end)}` : "Online, asynchronous");
const overlaps = (a: Sec, b: Sec) =>
  a.crn !== b.crn && a.term === b.term && !!a.days && !!b.days && [...a.days].some((d) => b.days.includes(d)) && a.start < b.end && b.start < a.end;

/** Processes the cart in priority order: conflicts and the credit limit are checked against what is already held. */
function runRegistration(items: Sec[], enrolled: Sec[], max: number): Result[] {
  const held = [...enrolled];
  let credits = enrolled.reduce((n, s) => n + s.credits, 0);
  return items.map((s) => {
    const clash = held.find((h) => overlaps(h, s));
    if (clash) return { crn: s.crn, status: "error", message: `Time conflict with ${clash.code}-${clash.section} (${when(clash)}). Not registered.` };
    if (credits + s.credits > max) return { crn: s.crn, status: "error", message: `Adding ${s.credits} credits would exceed your ${max}-credit maximum. Not registered.` };
    if (s.enrolled >= s.capacity) return { crn: s.crn, status: "waitlisted", message: `Class is full. You are number ${s.waitlist + 1} on the waitlist.` };
    held.push(s);
    credits += s.credits;
    return { crn: s.crn, status: "registered", message: "Registered." };
  });
}

const svg = (body: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">${body}</svg>`)}`;
const statusIcon: Record<Status, { src: string; label: string }> = {
  registered: { src: svg('<circle cx="8" cy="8" r="8" fill="#2e7d32"/><path d="m4 8 3 3 5-6" stroke="#fff" stroke-width="2" fill="none"/>'), label: "Registered" },
  waitlisted: { src: svg('<circle cx="8" cy="8" r="8" fill="#b45309"/><path d="M8 4v4l3 2" stroke="#fff" stroke-width="2" fill="none"/>'), label: "Waitlisted" },
  error: { src: svg('<circle cx="8" cy="8" r="8" fill="#b42318"/><path d="m5 5 6 6M11 5l-6 6" stroke="#fff" stroke-width="2"/>'), label: "Not registered" },
};
const plus = <svg viewBox="0 0 16 16" width="14" height="14" focusable="false"><path d="M7 2h2v5h5v2H9v5H7V9H2V7h5Z" fill="currentColor" /></svg>;
const check = <svg viewBox="0 0 16 16" width="16" height="16" focusable="false" aria-hidden="true"><path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="2.2" fill="none" /></svg>;
const cross = <svg viewBox="0 0 16 16" width="16" height="16" focusable="false" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2.2" /></svg>;
const warn = <svg viewBox="0 0 16 16" width="14" height="14" focusable="false" aria-hidden="true"><path d="M8 1 15 14H1Z" fill="#b42318" /><path d="M7.2 5.5h1.6v4.5H7.2zM7.2 11h1.6v1.6H7.2z" fill="#fff" /></svg>;

export default function RegistrationPage() {
  const d = useLoaderData<typeof loader>();
  const store = regStore.use();
  const [term, setTerm] = useState<Term>("Spring 2027");
  const [processing, setProcessing] = useState(false);
  const [finished, setFinished] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);
  const cartHeading = useRef<HTMLHeadingElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const focusFixed = useScenario("portal-reg-cart-focus-001");
  const restoreFixed = useScenario("portal-reg-processing-restore-001");
  useScenario("portal-reg-layout-reflow-001");

  const byCrn = useMemo(() => new Map(d.sections.map((s) => [s.crn, s])), [d.sections]);
  const enrolled = [...d.enrolled, ...store.registered.filter((r) => r.status === "registered").map((r) => byCrn.get(r.crn)!)].filter((s) => s.term === term);
  const waitlisted = store.registered.filter((r) => r.status === "waitlisted").map((r) => byCrn.get(r.crn)!).filter((s) => s.term === term);
  const cart = store.cart.map((c) => byCrn.get(c)!).filter((s) => s.term === term);
  const statusOf = (crn: string) =>
    enrolled.some((s) => s.crn === crn) ? "Enrolled" : waitlisted.some((s) => s.crn === crn) ? "Waitlisted" : store.cart.includes(crn) ? "In cart" : null;

  // Defective: the pressed control unmounts or changes and focus drops to <body>. Fixed: focus the cart heading.
  const cartChanged = (message: string) => {
    setToast(message);
    if (focusFixed) cartHeading.current?.focus();
  };
  const add = (s: Sec) => {
    regStore.set((st) => ({ ...st, cart: st.cart.includes(s.crn) ? st.cart : [...st.cart, s.crn] }));
    cartChanged(`${s.code}-${s.section} added to your ${s.term} cart.`);
  };
  const remove = (s: Sec) => {
    regStore.set((st) => ({ ...st, cart: st.cart.filter((c) => c !== s.crn) }));
    cartChanged(`${s.code}-${s.section} removed from your cart.`);
  };
  const reorder = (from: number, to: number) => {
    if (from === to || to < 0 || to >= cart.length) return;
    const order = cart.map((s) => s.crn);
    order.splice(to, 0, ...order.splice(from, 1));
    regStore.set((st) => ({ ...st, cart: [...st.cart.filter((c) => !order.includes(c)), ...order] }));
  };
  const register = async () => {
    setProcessing(true);
    await latency(`reg-submit-${cart.map((s) => s.crn).join("-")}`);
    const items = runRegistration(cart, enrolled, d.maxCredits);
    const kept = items.filter((r) => r.status !== "error");
    let flag: string | undefined, ctfNote: string | undefined;
    if (isRunning("registration-voice")) {
      const done = cart.map((s) => s.crn).join() === CTF_ORDER.join() && items.every((r) => r.status === "registered");
      if (done) flag = revealFlag("registration-voice", CTF_ORDER) ?? undefined;
      else ctfNote = "Challenge not complete yet: register exactly the three classes in the instructions, in that priority order, and nothing else.";
    }
    regStore.set((st) => ({
      cart: st.cart.filter((c) => !kept.some((r) => r.crn === c)),
      registered: [...st.registered, ...kept.map((r) => ({ crn: r.crn, status: r.status as "registered" | "waitlisted" }))],
      results: { term, items, flag, ctfNote },
    }));
    setProcessing(false);
    setFinished((n) => n + 1);
  };
  useEffect(() => {
    if (!finished) return;
    // Defective: the overlay is removed and focus is dropped. Fixed: focus moves to the results heading.
    if (restoreFixed) resultsHeading.current?.focus();
    else (document.activeElement as HTMLElement | null)?.blur();
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps

  const [ticketDate, ticketTime] = d.ticket.split("T");

  return (
    <PortalPage title="Registration" subtitle={`${term} · Class search and shopping cart`}>
      <ChallengeBanner id="registration-voice" />
      <section className="pt-card rg-intro">
        <p>
          Spring 2027 time ticket: <strong>{erpDate(ticketDate)} {time12(ticketTime)}</strong> · Maximum <strong>{d.maxCredits}</strong> credits ·{" "}
          <Link to="/portal/holds">{d.holds} holds on your record</Link>
        </p>
        <p>
          Add classes to your cart, drag them into priority order, then select Register. Registration dates are listed in the{" "}
          <SmartLink scenario="portal-reg-calendar-pdf-001" to="/documents/academic-calendar-2026-27.pdf" fixedTo="/academics/calendar">academic calendar</SmartLink>.
          Look up required books at the{" "}
          <SmartLink scenario="portal-reg-store-window-001" to="https://bookstore.redwoodstate.edu/textbooks" newWindow>RSU Bookstore</SmartLink>.
        </p>
        <div className="rg-term">
          <Dropdown label="Term" scenario="portal-reg-term-dropdown-001" defect="mouse-only" value={term} onChange={(v) => setTerm(v as Term)} options={TERMS.map((t) => ({ value: t, label: t === "Fall 2026" ? "Fall 2026 (late add)" : t }))} />
        </div>
      </section>

      <div className="rg-layout" data-a11y-scenario="portal-reg-layout-reflow-001">
        <Cart
          term={term} cart={cart} enrolled={enrolled} max={d.maxCredits} sections={d.sections} headingRef={cartHeading}
          processing={processing} onAdd={add} onRemove={remove} onReorder={reorder} onRegister={register}
        />
        <div className="rg-main">
          <Tabs
            label="Registration"
            scenario="portal-reg-tabs-keys-001"
            defect="broken-keys"
            tabs={[
              { label: "Find Classes", content: <ClassSearch term={term} sections={d.sections} subjects={d.subjects} statusOf={statusOf} onAdd={add} /> },
              { label: `Current Schedule (${enrolled.length + waitlisted.length})`, content: <CurrentSchedule term={term} enrolled={enrolled} waitlisted={waitlisted} /> },
            ]}
          />
        </div>
      </div>

      <Results results={store.results} byCrn={byCrn} headingRef={resultsHeading} />
      <Processing open={processing} />
      <Toast message={toast} onDismiss={dismissToast} scenario="portal-reg-toast-001" defect="vanishes" />
    </PortalPage>
  );
}

// ---------- Shopping cart ----------

interface CartProps {
  term: Term; cart: Sec[]; enrolled: Sec[]; max: number; sections: Sec[]; processing: boolean;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onAdd: (s: Sec) => void; onRemove: (s: Sec) => void; onReorder: (from: number, to: number) => void; onRegister: () => void;
}

function Cart({ term, cart, enrolled, max, sections, processing, headingRef, onAdd, onRemove, onReorder, onRegister }: CartProps) {
  const headingFixed = useScenario("portal-reg-cart-heading-skip-001");
  const dragFixed = useScenario("portal-reg-drag-001");
  const colorFixed = useScenario("portal-reg-conflict-color-001");
  const announceFixed = useScenario("portal-reg-conflict-announce-001");
  const removeFixed = useScenario("portal-reg-remove-js-001");
  const confirmFixed = useScenario("portal-reg-confirm-name-001");
  const namesFixed = useScenario("portal-reg-name-mismatch-001");
  useScenario("portal-reg-target-size-001");
  const [confirming, setConfirming] = useState(false);
  useScenario("portal-reg-cart-focus-ring-001");
  useScenario("portal-reg-footnote-contrast-001");
  const dragFrom = useRef(-1);
  const H = headingFixed ? "h2" : "h4";

  const move = (i: number, dir: -1 | 1, crn: string) => {
    onReorder(i, i + dir);
    // Keep focus on the pressed button after the list re-renders in its new order.
    requestAnimationFrame(() => document.getElementById(`rg-move-${dir < 0 ? "up" : "down"}-${crn}`)?.focus());
  };

  return (
    <section
      className="pt-card rg-cart"
      aria-labelledby="rg-cart-heading"
      data-a11y-scenario="portal-reg-cart-focus-001 portal-reg-drag-001 portal-reg-conflict-color-001 portal-reg-conflict-announce-001 portal-reg-remove-js-001 portal-reg-cart-focus-ring-001 portal-reg-footnote-contrast-001 portal-reg-processing-trap-001 portal-reg-processing-restore-001 portal-reg-spinner-motion-001 portal-reg-confirm-name-001 portal-reg-name-mismatch-001 portal-reg-target-size-001"
    >
      <H id="rg-cart-heading" ref={headingRef} tabIndex={-1} className="rg-cart-heading" data-a11y-scenario="portal-reg-cart-heading-skip-001">
        Shopping Cart: {term} ({cart.length})
      </H>
      <CreditMeter enrolled={enrolled} cart={cart} max={max} />

      {cart.length === 0 ? (
        <p className="pt-muted">Your cart is empty. Find classes or add a section by CRN.</p>
      ) : (
        <ol className="rg-cart-list">
          {cart.map((s, i) => {
            const clashes = [...enrolled, ...cart].filter((o) => overlaps(o, s));
            return (
              <li
                key={s.crn}
                className={`rg-cart-item${clashes.length ? " rg-conflict" : ""}`}
                draggable
                onDragStart={(e) => { dragFrom.current = i; e.dataTransfer.setData("text/plain", s.crn); }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); onReorder(dragFrom.current, i); }}
              >
                <span className="rg-grip" aria-hidden="true" title="Drag to reorder" />
                <span className="rg-prio">{i + 1}</span>
                <div className="rg-cart-body">
                  <strong>{s.code}-{s.section}</strong> {s.title}
                  <span className="rg-cart-when">{when(s)} · {s.credits} cr · CRN {s.crn}</span>
                  {/* Present from the start so role="alert" announces the text when a conflict appears. */}
                  <p className="rg-conflict-msg" role={announceFixed ? "alert" : undefined}>
                    {colorFixed && clashes.length > 0 && <>{warn} Time conflict with {clashes.map((c) => `${c.code}-${c.section}`).join(", ")}</>}
                  </p>
                </div>
                <div className="rg-cart-actions">
                  {dragFixed && (
                    <>
                      <button type="button" id={`rg-move-up-${s.crn}`} className="rg-move" aria-disabled={i === 0} onClick={() => i > 0 && move(i, -1, s.crn)}>
                        <span aria-hidden="true">↑</span><span className="visually-hidden">Move {s.code}-{s.section} up</span>
                      </button>
                      <button type="button" id={`rg-move-down-${s.crn}`} className="rg-move" aria-disabled={i === cart.length - 1} onClick={() => i < cart.length - 1 && move(i, 1, s.crn)}>
                        <span aria-hidden="true">↓</span><span className="visually-hidden">Move {s.code}-{s.section} down</span>
                      </button>
                    </>
                  )}
                  {removeFixed ? (
                    <button type="button" className="pt-linkbtn" onClick={() => onRemove(s)}>Remove<span className="visually-hidden"> {s.code}-{s.section}</span></button>
                  ) : (
                    <a href="#" onClick={(e) => { e.preventDefault(); onRemove(s); }}>Remove</a>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
      {cart.length > 1 && <p className="pt-muted">{dragFixed ? "Use the arrow buttons or drag classes to set priority." : "Drag classes to set priority."} Higher priority classes are processed first.</p>}
      {cart.length > 0 && !confirming && (
        <p>
          <button type="button" className="btn pt-btn" onClick={() => setConfirming(true)} disabled={processing}
            aria-label={namesFixed ? undefined : "Submit enrollment request"}>Register</button>
        </p>
      )}
      {cart.length > 0 && confirming && (
        <div className="rg-confirm">
          <p>Submit registration for {cart.length} {cart.length === 1 ? "class" : "classes"} in this priority order?</p>
          {confirmFixed ? (
            <p className="rg-confirm-actions">
              <button type="button" className="btn pt-btn" onClick={() => { setConfirming(false); onRegister(); }}>Confirm registration</button>
              <button type="button" className="pt-linkbtn" onClick={() => setConfirming(false)}>Cancel</button>
            </p>
          ) : (
            <p className="rg-confirm-actions">
              <button type="button" className="rg-confirm-icon" onClick={() => { setConfirming(false); onRegister(); }}>{check}</button>
              <button type="button" className="rg-confirm-icon" onClick={() => setConfirming(false)}>{cross}</button>
            </p>
          )}
        </div>
      )}
      <QuickAdd term={term} sections={sections} onAdd={onAdd} />
      <p className="rg-cart-note">Credit totals include classes you are already enrolled in. Registering for more than {max} credits requires approval from your college dean.</p>
    </section>
  );
}

function CreditMeter({ enrolled, cart, max }: { enrolled: Sec[]; cart: Sec[]; max: number }) {
  const fixed = useScenario("portal-reg-meter-value-001");
  const have = enrolled.reduce((n, s) => n + s.credits, 0);
  const add = cart.reduce((n, s) => n + s.credits, 0);
  const total = have + add;
  // The vendor widget writes the display string into aria-valuenow; the cast gets it past the DOM types.
  const value = fixed
    ? { "aria-valuenow": Math.min(total, max), "aria-valuetext": `${total} of ${max} credits` }
    : { "aria-valuenow": `${total} credits` as unknown as number };
  return (
    <div className="rg-meter-wrap" data-a11y-scenario="portal-reg-meter-value-001">
      <p id="rg-meter-label" className="rg-meter-label">Credits: {have} enrolled + {add} in cart = <strong>{total}</strong> of {max}</p>
      <div className="rg-meter" role="progressbar" aria-labelledby="rg-meter-label" aria-valuemin={0} aria-valuemax={max} {...value}>
        <div className="rg-meter-fill" style={{ width: `${Math.min(100, (total / max) * 100)}%` }} />
      </div>
      {total > max && <p className="rg-over">{warn} Over the {max}-credit maximum. Classes past the limit will not be registered.</p>}
    </div>
  );
}

function QuickAdd({ term, sections, onAdd }: { term: Term; sections: Sec[]; onAdd: (s: Sec) => void }) {
  const fixed = useScenario("portal-reg-crn-vague-001");
  const namesFixed = useScenario("portal-reg-name-mismatch-001");
  const [crn, setCrn] = useState("");
  const [error, setError] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = crn.trim();
    const s = sections.find((x) => x.crn === value && x.term === term);
    if (!s) {
      setError(!fixed ? "Invalid entry." : /^\d{5}$/.test(value)
        ? `No ${term} section has CRN ${value}. Check the CRN in Find Classes.`
        : "Enter a 5-digit CRN, for example 40145.");
      return;
    }
    setError("");
    setCrn("");
    onAdd(s);
  };
  return (
    <form className="rg-quick" onSubmit={submit} noValidate data-a11y-scenario="portal-reg-crn-vague-001">
      <Field
        scenario="portal-reg-crn-label-001" id="rg-crn" label="Add by CRN" defect="missing" inputMode="numeric" autoComplete="off"
        value={crn} onChange={(e) => setCrn(e.target.value)} aria-invalid={fixed && error ? true : undefined} aria-describedby={fixed && error ? "rg-crn-error" : undefined}
      />
      <button type="submit" className="btn pt-btn" aria-label={namesFixed ? undefined : "Enroll"}>Add</button>
      <p id="rg-crn-error" className="rg-error" role="alert">{error}</p>
    </form>
  );
}

// ---------- Class search ----------

interface SearchProps { term: Term; sections: Sec[]; subjects: [string, string][]; statusOf: (crn: string) => string | null; onAdd: (s: Sec) => void }
const initialQuery = { subject: "CS", keyword: "", openOnly: false, mode: "" };

function ClassSearch({ term, sections, subjects, statusOf, onAdd }: SearchProps) {
  const subjectFixed = useScenario("portal-reg-subject-label-001");
  const liveFixed = useScenario("portal-reg-results-live-001");
  const expandFixed = useScenario("portal-reg-adv-expandable-001");
  const hiddenFixed = useScenario("portal-reg-adv-hidden-focus-001");
  const namesFixed = useScenario("portal-reg-name-mismatch-001");
  useScenario("portal-reg-seats-note-small-001");
  const [form, setForm] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [searching, setSearching] = useState(false);
  const [advOpen, setAdvOpen] = useState(false);
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    await latency(`reg-search-${form.subject}-${form.keyword}-${form.mode}`);
    setQuery(form);
    setSearching(false);
  };

  const kw = query.keyword.trim().toLowerCase();
  const found = sections.filter((s) =>
    s.term === term && (!query.subject || s.subject === query.subject) && (!query.mode || s.mode === query.mode) &&
    (!query.openOnly || s.enrolled < s.capacity) &&
    (!kw || `${s.code} ${s.title} ${s.instructor} ${s.crn}`.toLowerCase().includes(kw)));
  const byCourse = new Map<string, Sec[]>();
  for (const s of found) byCourse.set(s.courseId, [...(byCourse.get(s.courseId) ?? []), s]);
  const groups = [...byCourse.values()];
  const subjectName = subjects.find(([c]) => c === query.subject)?.[1] ?? "all subjects";
  const expand = expandFixed ? { "aria-expanded": advOpen, "aria-controls": "rg-adv" } : { "aria-expandable": advOpen ? "true" : "false" };
  const advHidden = hiddenFixed ? { hidden: !advOpen } : { "aria-hidden": !advOpen };

  return (
    <div className="rg-search">
      <h2>Find Classes</h2>
      <form className="rg-search-form" onSubmit={submit}>
        <div className="field" data-a11y-scenario="portal-reg-subject-label-001">
          {subjectFixed ? <label htmlFor="rg-subject">Subject</label> : <span className="field-label">Subject</span>}
          <select id="rg-subject" value={form.subject} onChange={(e) => set({ subject: e.target.value })}>
            <option value="">All subjects</option>
            {subjects.map(([code, name]) => <option key={code} value={code}>{name} ({code})</option>)}
          </select>
        </div>
        <Field scenario="portal-reg-keyword-placeholder-001" id="rg-keyword" label="Keyword, course number or instructor" defect="placeholder" value={form.keyword} onChange={(e) => set({ keyword: e.target.value })} autoComplete="off" />
        <div className="rg-search-actions">
          <button type="submit" className="btn pt-btn" aria-label={namesFixed ? undefined : "Find"}>Search</button>
          <button type="button" className="pt-linkbtn" onClick={() => setAdvOpen((o) => !o)} {...expand} data-a11y-scenario="portal-reg-adv-expandable-001">
            {advOpen ? "Fewer search options" : "More search options"}
          </button>
        </div>
        <div id="rg-adv" className={`rg-adv${advOpen ? "" : " is-collapsed"}`} {...advHidden} data-a11y-scenario="portal-reg-adv-hidden-focus-001">
          <label className="rg-check"><input type="checkbox" checked={form.openOnly} onChange={(e) => set({ openOnly: e.target.checked })} /> Open sections only</label>
          <div className="field">
            <label htmlFor="rg-mode">Instruction mode</label>
            <select id="rg-mode" value={form.mode} onChange={(e) => set({ mode: e.target.value })}>
              <option value="">Any</option><option>In person</option><option>Hybrid</option><option>Online</option>
            </select>
          </div>
        </div>
      </form>

      <h2>Search Results</h2>
      <p className="rg-count" role={liveFixed ? "status" : undefined} data-a11y-scenario="portal-reg-results-live-001">
        {searching ? "Searching…" : `${groups.length} courses (${found.length} sections) in ${subjectName}, ${term}.`}
      </p>
      {groups.map((secs) => (
        <div key={secs[0].courseId} className="rg-course">
          <Heading scenario="portal-reg-course-heading-001" level={3} defect="fake" className="rg-course-title">
            {secs[0].code} · {secs[0].title} ({secs[0].credits} credits)
          </Heading>
          <SectionGrid secs={secs} statusOf={statusOf} onAdd={onAdd} />
        </div>
      ))}
      <p className="rg-seats-note" data-a11y-scenario="portal-reg-seats-note-small-001">
        Seat counts refresh every 15 minutes. Waitlisted students are notified by RSU email when a seat opens and have 24 hours to claim it.
      </p>
    </div>
  );
}

function seats(s: Sec) {
  const left = s.capacity - s.enrolled;
  if (left <= 0) return { state: "full", text: `Full, waitlist ${s.waitlist}` };
  if (left <= 5) return { state: "few", text: `${left} of ${s.capacity} seats left` };
  return { state: "open", text: `Open, ${left} of ${s.capacity} seats` };
}

function SectionGrid({ secs, statusOf, onAdd }: { secs: Sec[]; statusOf: SearchProps["statusOf"]; onAdd: (s: Sec) => void }) {
  const gridFixed = useScenario("portal-reg-grid-children-001");
  const seatsFixed = useScenario("portal-reg-seats-color-001");
  const controlsFixed = useScenario("portal-reg-details-controls-001");
  const [open, setOpen] = useState<string[]>([]);
  // Vendor grid: role="grid" on nested <div>s with no row/gridcell roles. Fixed: a plain data table.
  const [Grid, Head, Body, Row, Th, Td]: React.ElementType[] = gridFixed
    ? ["table", "thead", "tbody", "tr", "th", "td"]
    : ["div", "div", "div", "div", "div", "div"];
  const label = `${secs[0].code} sections`;
  const cols = ["Seats", "Section", "CRN", "Days & times", "Instructor", "Location", "Details", "Add"];
  return (
    <div className="table-wrap">
      <Grid
        className={`rg-grid${gridFixed ? "" : " rg-grid--div"}`}
        {...(gridFixed ? {} : { role: "grid", "aria-label": label })}
        data-a11y-scenario="portal-reg-grid-children-001 portal-reg-seats-color-001 portal-reg-details-controls-001"
      >
        {gridFixed && <caption className="visually-hidden">{label}</caption>}
        <Head className="rg-head"><Row className="rg-row">{cols.map((c) => <Th key={c} className="rg-cell" {...(gridFixed ? { scope: "col" } : {})}>{c}</Th>)}</Row></Head>
        <Body className="rg-body">
          {secs.map((s) => {
            const seat = seats(s);
            const status = statusOf(s.crn);
            const isOpen = open.includes(s.crn);
            const detailsId = `rg-sec-${s.crn}-details`;
            return [
              <Row key={s.crn} className="rg-row">
                <Td className="rg-cell"><span className={`rg-seat rg-seat--${seat.state}`} />{seatsFixed && <span className="rg-seat-text">{seat.text}</span>}</Td>
                <Td className="rg-cell">{s.section}</Td>
                <Td className="rg-cell">{s.crn}</Td>
                <Td className="rg-cell">{when(s)}</Td>
                <Td className="rg-cell">{s.instructor}</Td>
                <Td className="rg-cell">{s.room || s.mode}</Td>
                <Td className="rg-cell">
                  <button
                    type="button" className="pt-linkbtn" aria-expanded={isOpen}
                    // Defective: points at the id the old template used; the details row is rg-sec-<crn>-details.
                    aria-controls={controlsFixed ? detailsId : `details-${s.crn}`}
                    onClick={() => setOpen((o) => (isOpen ? o.filter((c) => c !== s.crn) : [...o, s.crn]))}
                  >
                    Details<span className="visually-hidden"> for {s.code}-{s.section}</span>
                  </button>
                </Td>
                <Td className="rg-cell">
                  {status ? <span className="rg-in">{status}</span> : (
                    <IconButton scenario="portal-reg-add-empty-001" label={`Add ${s.code}-${s.section} to cart`} icon={plus} className="rg-add" onClick={() => onAdd(s)} />
                  )}
                </Td>
              </Row>,
              <Row key={`${s.crn}-d`} id={detailsId} className="rg-row rg-details" hidden={!isOpen}>
                <Td className="rg-cell" colSpan={8}>
                  {s.mode}{s.building && ` · ${s.building}, room ${s.room.split(" ").pop()}`} · Instructor: {s.instructor} · Enrolled {s.enrolled} of {s.capacity} · Waitlist {s.waitlist}
                </Td>
              </Row>,
            ];
          })}
        </Body>
      </Grid>
    </div>
  );
}

// ---------- Current schedule, results, processing overlay ----------

function CurrentSchedule({ term, enrolled, waitlisted }: { term: Term; enrolled: Sec[]; waitlisted: Sec[] }) {
  const captionFixed = useScenario("portal-reg-schedule-caption-001");
  const rows = [...enrolled.map((s) => ({ s, status: "Enrolled" })), ...waitlisted.map((s) => ({ s, status: "Waitlisted" }))];
  return (
    <div>
      <h2>Current Schedule</h2>
      {rows.length === 0 && <p>You are not enrolled in any {term} classes yet.</p>}
      <div className="table-wrap">
        <table className="pt-grid" data-a11y-scenario="portal-reg-schedule-caption-001">
          {captionFixed && <caption>{term} classes</caption>}
          <thead>
            <tr><th scope="col">Class</th><th scope="col">Title</th><th scope="col">CRN</th><th scope="col" className="num">Credits</th><th scope="col">Days &amp; times</th><th scope="col">Location</th><th scope="col">Status</th></tr>
          </thead>
          <tbody>
            {rows.map(({ s, status }) => (
              <tr key={s.crn}>
                <th scope="row">{s.code}-{s.section}</th><td>{s.title}</td><td>{s.crn}</td><td className="num">{s.credits.toFixed(1)}</td>
                <td>{when(s)}</td><td>{s.room || s.mode}</td><td>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Results({ results, byCrn, headingRef }: { results: { term: Term; items: Result[]; flag?: string; ctfNote?: string } | null; byCrn: Map<string, Sec>; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const altFixed = useScenario("portal-reg-result-icon-alt-001");
  return (
    <div className="rg-results" data-a11y-scenario="portal-reg-result-icon-alt-001">
      {results && (
        <section className="pt-card" aria-labelledby="rg-results-heading">
          <h2 id="rg-results-heading" ref={headingRef} tabIndex={-1}>Registration Results: {results.term}</h2>
          <div className="table-wrap">
            <table className="pt-grid">
              <caption className="visually-hidden">Registration results</caption>
              <thead><tr><th scope="col">Status</th><th scope="col">Class</th><th scope="col">Message</th></tr></thead>
              <tbody>
                {results.items.map((r) => {
                  const s = byCrn.get(r.crn)!;
                  const icon = statusIcon[r.status];
                  return (
                    <tr key={r.crn} className={`rg-result rg-result--${r.status}`}>
                      <td><img src={icon.src} width={16} height={16} alt={altFixed ? "" : undefined} className="rg-result-icon" />{altFixed && <span className="rg-result-text">{icon.label}</span>}</td>
                      <th scope="row">{s.code}-{s.section} {s.title}</th>
                      <td>{r.message}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {results.flag && <ChallengeComplete id="registration-voice" onRetry={() => regStore.set({ cart: [], registered: [], results: null })} />}
          {results.ctfNote && <p className="rg-error">{results.ctfNote}</p>}
          <p>Registered and waitlisted classes appear under Current Schedule and on your <Link to="/portal/schedule">class schedule</Link> after the nightly update.</p>
        </section>
      )}
    </div>
  );
}

function Processing({ open }: { open: boolean }) {
  const trapFixed = useScenario("portal-reg-processing-trap-001");
  useScenario("portal-reg-spinner-motion-001");
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open, trapFixed]);
  const body = (
    <>
      <span className="rg-spinner" aria-hidden="true" />
      <p id="rg-processing-title" className="rg-processing-title">Processing your registration…</p>
      <p>Please don't close this window.</p>
    </>
  );
  // Defective: a styled overlay <div>; focus stays behind it and Tab keeps walking the page.
  if (!trapFixed) return open ? <div className="rg-overlay"><div className="rg-processing">{body}</div></div> : null;
  return (
    <dialog ref={ref} className="rg-processing" aria-labelledby="rg-processing-title" aria-busy="true" onCancel={(e) => e.preventDefault()}>
      {body}
    </dialog>
  );
}
