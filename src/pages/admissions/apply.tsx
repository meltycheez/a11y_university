// /admissions/apply: three-step Application for Admission (plan 06 #8; tier H).
// Data lives in a module store: it survives client-side navigation and resets on reload. Nothing is sent.
// Scenarios: src/a11y/registry/apply.ts. CSS: styles/features/apply.css.
// Also the screen reader CTF (plan 11 §5): during a run the referral code is required and success shows the flag.
import { Fragment, useEffect, useRef, useState } from "react";
import { applyScenarios } from "~/a11y/registry/apply";
import { AnyLink } from "~/components/blocks";
import { Hero } from "~/components/Hero";
import { Dropdown } from "~/components/widgets";
import { ChallengeBanner } from "~/ctf/ChallengeBanner";
import { ChallengeComplete } from "~/ctf/ChallengeComplete";
import { ctfStore, revealFlag } from "~/ctf/store";
import { programs } from "~/data/catalog";
import { pageContent } from "~/data/content/pages";
import { confirmationCode, createStore, latency } from "~/lib/interactive";
import { useFixes } from "~/a11y/useFixes";

export { inventoryMeta as meta } from "~/routes/meta";

const intro = pageContent["/admissions/apply"];
const STEPS = ["Personal information", "Academics and program", "Essays and submit"];
const LAST = STEPS.length - 1;
const MAJORS = [
  ...programs.filter((p) => p.level === "undergraduate").map((p) => ({ value: p.slug, label: `${p.name}, ${p.degree}` })),
  { value: "undeclared", label: "Undeclared (exploring)" },
];
const TERMS = ["Fall 2027", "Spring 2028"];
const CITIZENSHIP = ["U.S. citizen", "U.S. permanent resident", "International (F-1 or J-1 visa)", "Other or prefer to discuss"];
// apply-citizenship-radios-001: the defective radios' only names, close enough to tell them apart.
const CITIZENSHIP_CODES = ["CIT_US", "CIT_PR", "CIT_INTL_F1_J1", "CIT_OTHER"];
const ESSAYS = [
  { id: "essay1", label: "Personal essay", limit: 350, prompt: "Describe a challenge you have faced and what you learned from it." },
  { id: "essay2", label: "Program essay", limit: 250, prompt: "Why are you interested in your first-choice major, and how will Redwood State help you reach your goals?" },
] as const;

type Data = Record<string, string>;
interface App { step: number; data: Data; status: "editing" | "submitting" | "submitted"; code: string }
const INITIAL: App = { step: 0, data: { citizenship: "", term: "", major: "", major2: "", type: "First-year", state: "CA", certify: "" }, status: "editing", code: "" };

// CTF: the code printed in /ctf/referral-code.svg. Compared without spaces, dashes or case.
const REFERRAL = "RSU7Q4K";
const squash = (s = "") => s.replace(/[^a-z0-9]/gi, "").toUpperCase();
// apply-tab-order-001: on step 1, Tab and Shift+Tab follow this scrambled order between the fields (a script
// overrides the browser's order). Focus still enters and leaves the form normally; reading order is unchanged.
const TAB_ORDER = ["last", "zip", "first", "email", "dob-y", "city", "dob-m", "street", "middle", "dob-d", "preferred", "phone"];
/** The field Tab (or Shift+Tab) should move to from `id`, or null to let the browser decide. */
export function scrambledTab(id: string, back: boolean): string | null {
  const i = TAB_ORDER.indexOf(id);
  if (i < 0) return null;
  if (back) return i > 0 ? TAB_ORDER[i - 1] : null;
  return TAB_ORDER[i + 1] ?? "citizenship"; // after the last scrambled field, carry on to the rest of the step
}
// apply-aria-label-junk-001: database-style aria-labels that override the visible labels (still guessable).
const JUNK_NAMES: Record<string, string> = { email: "email_addr", phone: "phone_mobile", street: "addr_line1", school: "hs_name" };
const CREST_ALT = "The official crest of Redwood State University, first adopted by the Board of Trustees in 1891 and redrawn in 1964 and again in 2009, showing a stylized coast redwood tree in pale mist gray rising from a ring of gold on a deep redwood red field, symbolizing the university's founding among the old-growth forests of the Arcadia Falls region and its enduring commitment to growth, knowledge and service to California.";
const store = createStore<App>(INITIAL);
/** The CTF fade-out (keep in step with .apply-card--blind in apply.css). */
const FADE_MS = 5000;
/** Time for the smooth scroll to the form before it starts fading. */
const SCROLL_MS = 700;
/** How long the "this step has problems" line keeps focus before focus jumps to the first problem field. */
export const INVALID_PAUSE_MS = 2500;

const words = (s = "") => s.trim().split(/\s+/).filter(Boolean).length;
type Err = { field: string; message: string; /** Every input to mark as wrong, when more than `field`. */ parts?: string[] };
/** A month / day / year date's error: `field` is the first wrong part, `parts` all of them. Month and day take 1 or 01. */
const dateError = (d: Data, id: string, what: string, minYear: number, maxYear: number): Err | null => {
  const m = +d[`${id}-m`], day = +d[`${id}-d`], y = +d[`${id}-y`];
  const yearOk = y >= minYear && y <= maxYear && Number.isInteger(y);
  const monthOk = m >= 1 && m <= 12 && Number.isInteger(m);
  const dayOk = day >= 1 && Number.isInteger(day) && day <= new Date(Date.UTC(yearOk ? y : 2000, monthOk ? m : 1, 0)).getUTCDate();
  const bad = [!monthOk && "m", !dayOk && "d", !yearOk && "y"].filter((p): p is string => !!p);
  if (!bad.length) return null;
  const message = bad.length > 1 ? `Enter your ${what} as month (1 to 12), day and a year from ${minYear} to ${maxYear}.`
    : bad[0] === "m" ? `Enter the month of your ${what} as a number from 1 to 12.`
    : bad[0] === "d" ? `Enter a day that exists in that month for your ${what}.`
    : `Enter a year for your ${what} from ${minYear} to ${maxYear}.`;
  return { field: `${id}-${bad[0]}`, message, parts: bad.map((p) => `${id}-${p}`) };
};
/** Returns the errors for one step (fields are keyed by input id). `referral`: a CTF run needs the referral code. */
export function validateStep(step: number, d: Data, { referral = false } = {}): Err[] {
  const e: Err[] = [];
  const need = (field: string, message: string) => { if (!d[field]?.trim()) e.push({ field, message }); };
  if (step === 0) {
    need("first", "Enter your legal first name.");
    need("last", "Enter your legal last name.");
    const dob = dateError(d, "dob", "date of birth", 1940, 2012);
    if (dob) e.push(dob);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email ?? "")) e.push({ field: "email", message: "Enter an email address like name@example.com." });
    need("street", "Enter your street address.");
    need("city", "Enter your city.");
    if (!/^\d{5}$/.test(d.zip ?? "")) e.push({ field: "zip", message: "Enter a 5-digit ZIP code." });
    need("citizenship", "Choose your citizenship status.");
  } else if (step === 1) {
    need("school", "Enter the name of your high school.");
    need("school-city", "Enter the city and state of your high school.");
    const grad = dateError(d, "grad", "graduation date", 1980, 2028);
    if (grad) e.push(grad);
    if (!/^\d(\.\d{1,2})?$/.test(d.gpa ?? "") || +d.gpa > 5) e.push({ field: "gpa", message: "Enter your GPA as a number from 0.00 to 5.00, for example 3.45." });
    need("term", "Choose the term you want to start.");
    need("major", "Choose a first-choice major, or Undeclared.");
    if (referral && squash(d.referral) !== REFERRAL) e.push({ field: "referral", message: "Enter the application referral code shown on this step, for example RSU-1A2B." });
  } else if (step === 2) {
    for (const es of ESSAYS) {
      const n = words(d[es.id]);
      if (!n) e.push({ field: es.id, message: `Write your ${es.label.toLowerCase()}.` });
      else if (n > es.limit) e.push({ field: es.id, message: `Shorten your ${es.label.toLowerCase()} to ${es.limit} words or fewer (now ${n}).` });
    }
    if (d.certify !== "yes") e.push({ field: "certify", message: "Check the box to certify that your application is accurate." });
  }
  return e;
}

export default function ApplyPage() {
  const { fix, mark } = useFixes(applyScenarios, "apply-");
  const app = store.use();
  const { run } = ctfStore.use();
  const ctfRun = run?.id === "apply-sr";
  const { step, data } = app;
  const heading = useRef<HTMLElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const invalidMsg = useRef<HTMLParagraphElement>(null);
  const moveFocus = useRef<"heading" | "summary" | "invalid" | null>(null);
  const [errors, setErrors] = useState<Err[]>([]);

  // CTF: when a run starts, scroll the form into view, then count down while it fades out (.apply-card--blind),
  // then put focus on the
  // form's first field. A run resumed by navigating back later skips straight past this.
  const runStart = ctfRun ? run.startedAt : 0;
  const lastRun = useRef(runStart); // a run already going when the page mounts doesn't count down again
  const card = useRef<HTMLDivElement>(null);
  const [scrolling, setScrolling] = useState(false); // the form stays visible until it has scrolled into view
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    const fresh = runStart !== 0 && runStart !== lastRun.current;
    lastRun.current = runStart;
    if (!fresh) { setScrolling(false); setCountdown(0); return; }
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    card.current?.scrollIntoView?.({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setScrolling(true);
    let left = FADE_MS / 1000;
    let t: ReturnType<typeof setInterval> | undefined;
    const fade = setTimeout(() => {
      setScrolling(false);
      setCountdown(left);
      t = setInterval(() => {
        setCountdown(--left);
        if (left > 0) return;
        clearInterval(t);
        document.querySelector<HTMLElement>(".apply-form :is(input, select, textarea)")?.focus();
      }, 1000);
    }, reduce ? 0 : SCROLL_MS);
    return () => { clearTimeout(fade); clearInterval(t); };
  }, [runStart]);

  useEffect(() => {
    if (moveFocus.current === "heading") heading.current?.focus();
    if (moveFocus.current === "summary") summary.current?.focus();
    if (moveFocus.current === "invalid") {
      // apply-errors-not-announced-001 (defective): focus the "this step has problems" line, then after a pause
      // jump to the first problem field, unless the user has already moved on.
      invalidMsg.current?.focus();
      const first = errors[0]?.field;
      setTimeout(() => {
        if (document.activeElement !== invalidMsg.current || !first) return;
        const el = document.getElementById(first);
        if (!el) return;
        const control = el.matches("input, select, textarea, button") ? el : el.querySelector<HTMLElement>("input, select, textarea, button, [tabindex='0']");
        // The mouse-only major menu (apply-major-dropdown-001) has nothing focusable: land on its wrapper, which
        // reads its label and current value, so the user still hears where the problem is.
        if (!control && !el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
        (control ?? el).focus();
      }, INVALID_PAUSE_MS);
    }
    moveFocus.current = null;
  });

  // apply-live-spam-001: a fake autosave every 60 s. Defective: announced assertively every time.
  const [saved, setSaved] = useState("");
  useEffect(() => {
    if (app.status !== "editing") return;
    const t = setInterval(() => setSaved(new Date().toLocaleTimeString("en-US")), 60000);
    return () => clearInterval(t);
  }, [app.status]);
  const setData = (patch: Data) => store.set((a) => ({ ...a, data: { ...a.data, ...patch } }));
  const errFor = (id: string) => errors.find((e) => e.field === id || e.parts?.includes(id));
  const errText = (e: Err) => (fix("errors-vague") ? e.message : "Invalid");
  const announce = fix("errors-not-announced");
  const reqFixed = fix("required-color");

  const go = (to: number) => {
    if (fix("step-focus")) moveFocus.current = "heading";
    setErrors([]);
    store.set((a) => ({ ...a, step: to }));
  };
  const next = () => {
    const found = validateStep(step, data, { referral: ctfRun });
    setErrors(found);
    if (found.length) { moveFocus.current = announce ? "summary" : "invalid"; return; }
    go(step + 1);
  };
  const submit = async () => {
    const found = validateStep(LAST, data);
    // A CTF run can't skip the referral step by editing earlier steps from the review.
    if (ctfRun && validateStep(1, data, { referral: true }).length) found.push({ field: "certify", message: "Go back to Academics and program and enter your application referral code." });
    setErrors(found);
    if (found.length) { moveFocus.current = announce ? "summary" : "invalid"; return; }
    store.set((a) => ({ ...a, status: "submitting" }));
    await latency("apply-submit");
    if (fix("submit-status")) moveFocus.current = "heading";
    revealFlag("apply-sr", [data.first, data.last, squash(data.referral)]); // during a run: completes it
    store.set((a) => ({ ...a, status: "submitted", code: confirmationCode(`${a.data.email}|${a.data.major}|${a.data.term}`) }));
  };

  /** Props shared by every input: value binding, required marking and error wiring. */
  const bind = (id: string, required = true) => {
    const e = errFor(id);
    return {
      id, name: id, value: data[id] ?? "",
      onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setData({ [id]: ev.target.value }),
      ...(required && reqFixed ? { required: true } : {}),
      ...(e ? { "data-error": "" } : {}), // red border, shown whether or not errors are announced
      ...(e && announce ? { "aria-invalid": true as const, "aria-describedby": `${e.field}-error` } : {}),
      ...(!fix("aria-label-junk") && JUNK_NAMES[id] ? { "aria-label": JUNK_NAMES[id] } : {}),
    };
  };
  const labelText = (text: string, required = true) => (
    <>{text}{required && reqFixed && " (required)"}{!required && " (optional)"}</>
  );
  const labelClass = (required = true) => (required && !reqFixed ? "apply-req" : undefined);
  const errorMsg = (id: string) => {
    const e = errFor(id);
    return e ? <p id={`${e.field}-error`} className="apply-error">{errText(e)}</p> : null;
  };
  const text = (id: string, label: string, opts: { required?: boolean; type?: string; autoComplete?: string; labelFor?: string; inputMode?: "numeric" | "decimal" } = {}) => {
    const { required = true, labelFor, ...rest } = opts;
    return (
      <div className="field">
        <label htmlFor={labelFor ?? id} className={labelClass(required)}>{labelText(label, required)}</label>
        <input {...bind(id, required)} {...rest} />
        {errorMsg(id)}
      </div>
    );
  };

  /** Month / day / year boxes. Defective: three inputs named only by MM / DD / YYYY placeholders after a line of text (apply-dob-split-001). */
  const dateParts = (id: string, label: string, autoComplete?: [string, string, string]) => {
    const parts = [["m", "Month", 2], ["d", "Day", 2], ["y", "Year", 4]] as const;
    const err = errors.find((e) => e.field.startsWith(`${id}-`));
    const inputs = parts.map(([p, name, size], i) => (
      <Fragment key={p}>
        {fix("dob-split") && <label htmlFor={`${id}-${p}`}>{name}</label>}
        <input {...bind(`${id}-${p}`)} className={`apply-date-${p}`} inputMode="numeric" maxLength={size} size={size}
          autoComplete={autoComplete?.[i]} placeholder={fix("dob-split") ? undefined : ["MM", "DD", "YYYY"][i]}
          aria-describedby={err && announce ? `${err.field}-error` : undefined} />
        {!fix("dob-split") && i < 2 && <span aria-hidden="true">/</span>}
      </Fragment>
    ));
    return fix("dob-split") ? (
      <fieldset className="apply-date">
        <legend className={labelClass()}>{labelText(label)}</legend>
        <div className="apply-date-row">{inputs}</div>
        {err && errorMsg(err.field)}
      </fieldset>
    ) : (
      <div className="apply-date">
        <p className={`apply-label ${labelClass() ?? ""}`}>{label}</p>
        <div className="apply-date-row">{inputs}</div>
        {err && errorMsg(err.field)}
      </div>
    );
  };

  // A plain function, not a component, so re-renders never remount the inputs inside.
  const group = (legend: string, children: React.ReactNode) =>
    fix("no-structure") ? <fieldset className="apply-group"><legend>{legend}</legend>{children}</fieldset> : children;

  // apply-citizenship-radios-001. Defective: radios named only by codes, followed by plain text, no labels and no group.
  const citizenshipRadios = CITIZENSHIP.map((c, i) => {
    const input = (
      <input type="radio" name="citizenship" value={c} id={i === 0 ? "citizenship" : `citizenship-${i}`} checked={data.citizenship === c}
        onChange={() => setData({ citizenship: c })} aria-label={fix("citizenship-radios") ? undefined : CITIZENSHIP_CODES[i]} aria-invalid={errFor("citizenship") && announce ? true : undefined} />
    );
    return fix("citizenship-radios")
      ? <label key={c} className="apply-radio">{input} {c}</label>
      : <span key={c} className="apply-radio">{input} <span>{c}</span></span>;
  });
  const citizenship = (
    <div className="field">
      {fix("citizenship-radios")
        ? <fieldset className="apply-radios"><legend className={labelClass()}>{labelText("Citizenship status")}</legend>{citizenshipRadios}</fieldset>
        : <div className="apply-radios"><p className={`apply-label ${labelClass() ?? ""}`}>Citizenship status</p>{citizenshipRadios}</div>}
      {errorMsg("citizenship")}
    </div>
  );

  const personal = (
    <div className={fix("no-structure") ? "apply-grouped" : "apply-flat"}>
      {group("Legal name", <>
        {text("first", "Legal first name", { autoComplete: "given-name" })}
        {text("middle", "Middle name", { required: false, autoComplete: "additional-name" })}
        {text("last", "Legal last name", { autoComplete: "family-name" })}
        {text("preferred", "Preferred first name", { required: false, autoComplete: "nickname" })}
        {dateParts("dob", "Date of birth", ["bday-month", "bday-day", "bday-year"])}
      </>)}
      {group("Contact information", <>
        {text("email", "Email", { type: "email", autoComplete: "email" })}
        {text("phone", "Mobile phone", { required: false, type: "tel", autoComplete: "tel" })}
      </>)}
      {group("Mailing address", <>
        {text("street", "Street address", { autoComplete: "street-address" })}
        {text("city", "City", { autoComplete: "address-level2", labelFor: fix("name-mismatch") ? undefined : "state" })}
        <div className="field">
          <label htmlFor={fix("name-mismatch") ? "state" : "city"}>State</label>
          <select {...bind("state", false)}>{["CA", "AZ", "NV", "OR", "WA", "Other U.S.", "Outside the U.S."].map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        {text("zip", "ZIP code", { inputMode: "numeric", autoComplete: "postal-code" })}
      </>)}
      {group("Citizenship and residency", <>
        {citizenship}
        <label className="apply-check">
          <input type="checkbox" checked={data.firstgen === "yes"} onChange={(e) => setData({ firstgen: e.target.checked ? "yes" : "" })} />
          {" "}Neither of my parents or guardians completed a four-year college degree
        </label>
      </>)}
    </div>
  );

  const academic = (
    <div className="apply-grouped">
      {text("school", "High school name")}
      {text("school-city", "High school city and state")}
      {dateParts("grad", "Graduation date (or expected)")}
      <div className="field">
        <label htmlFor={fix("gpa-for") ? "gpa" : "gpa-input"} className={labelClass()}>{labelText("Cumulative GPA")}</label>
        <input {...bind("gpa")} inputMode="decimal" className="apply-short" aria-label={fix("gpa-for") ? undefined : "gpa_cum"} />
        <p className="apply-hint">Unweighted, on a 4.0 scale. Weighted GPAs up to 5.0 are accepted.</p>
        {errorMsg("gpa")}
      </div>
      {text("college", "College courses taken in high school (dual enrollment)", { required: false })}
    </div>
  );

  const termRadios = TERMS.map((t) => (
    <label key={t} className="apply-radio">
      <input type="radio" name="term" value={t} checked={data.term === t} onChange={() => setData({ term: t })}
        aria-invalid={errFor("term") && announce ? true : undefined} id={t === TERMS[0] ? "term" : undefined} /> {t}
    </label>
  ));
  const program = (
    <div className="apply-grouped">
      <div>
        {fix("term-fieldset")
          ? <fieldset className="apply-radios"><legend className={labelClass()}>{labelText("Entry term")}</legend>{termRadios}</fieldset>
          : <div className="apply-radios"><p className={`apply-label ${labelClass() ?? ""}`}><strong>Entry term</strong></p>{termRadios}</div>}
        {errorMsg("term")}
      </div>
      <fieldset className="apply-radios">
        <legend>I am applying as a</legend>
        {["First-year", "Transfer"].map((t) => (
          <label key={t} className="apply-radio"><input type="radio" name="type" value={t} checked={data.type === t} onChange={() => setData({ type: t })} /> {t} student</label>
        ))}
      </fieldset>
      <div className={labelClass() ? "apply-dropdown apply-dropdown--req" : "apply-dropdown"} id="major">
        <Dropdown label={reqFixed ? "First-choice major (required)" : "First-choice major"} options={[{ value: "", label: "Choose a major" }, ...MAJORS]}
          value={data.major ?? ""} onChange={(v) => setData({ major: v })} scenario="apply-major-dropdown-001" defect="mouse-only" />
        {errorMsg("major")}
      </div>
      <div className="field">
        <label htmlFor="major2">Second-choice major (optional)</label>
        <select {...bind("major2", false)}><option value="">None</option>{MAJORS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}</select>
      </div>
      <label className="apply-check">
        <input type="checkbox" checked={data.housing === "yes"} onChange={(e) => setData({ housing: e.target.checked ? "yes" : "" })} /> I'm interested in living on campus
      </label>
      <div className="apply-referral">
        <img src={`${import.meta.env.BASE_URL}ctf/referral-code.svg`} width="360" height="120"
          alt={fix("code-image-alt") ? "Your application referral code: RSU-7Q4K" : "image123.png"} />
        <div className="field">
          <label htmlFor="referral" className={labelClass(ctfRun)}>{labelText("Application referral code", ctfRun)}</label>
          {/* apply-code-image-alt-001: with the image's alt a file name, the code lives only in this aria-label (it overrides the visible label). */}
          <input {...bind("referral", ctfRun)} autoComplete="off" aria-label={fix("code-image-alt") ? undefined : "ref_code: type R S U 7 Q 4 K"} />
          {errorMsg("referral")}
        </div>
      </div>
    </div>
  );

  const essays = (
    <div className="apply-grouped">
      {ESSAYS.map((es) => {
        const n = words(data[es.id]);
        const keep = fix("essay-instructions");
        const described = [keep ? `${es.id}-prompt` : "", errFor(es.id) && announce ? `${es.id}-error` : ""].filter(Boolean).join(" ");
        return (
          <div key={es.id} className="field apply-essay">
            <label htmlFor={es.id} className={labelClass()}>{labelText(es.label)}</label>
            {keep && <p id={`${es.id}-prompt`} className="apply-prompt">{es.prompt} Up to {es.limit} words.</p>}
            <textarea {...bind(es.id)} rows={8} placeholder={keep ? undefined : `${es.prompt} (${es.limit} words max)`}
              aria-describedby={described || undefined} />
            <p className={`apply-count${n > es.limit ? " is-over" : ""}`}>{n} / {es.limit} words</p>
            {errorMsg(es.id)}
          </div>
        );
      })}
    </div>
  );

  const Sub = fix("review-heading-skip") ? "h3" : "h4";
  const pick = (list: { value: string; label: string }[], v: string) => list.find((x) => x.value === v)?.label ?? "—";
  const reviewRows: [string, [string, string][]][] = [
    ["Personal information", [
      ["Name", [data.first, data.middle, data.last].filter(Boolean).join(" ")],
      ["Date of birth", `${data["dob-m"]}/${data["dob-d"]}/${data["dob-y"]}`],
      ["Email", data.email], ["Address", `${data.street}, ${data.city}, ${data.state} ${data.zip}`], ["Citizenship", data.citizenship],
    ]],
    ["Academics and program", [["High school", `${data.school}, ${data["school-city"]}`], ["Graduation", `${data["grad-m"]}/${data["grad-d"]}/${data["grad-y"]}`], ["GPA", data.gpa],
      ["Entry term", data.term], ["Applying as", `${data.type} student`], ["First choice", pick(MAJORS, data.major)], ["Second choice", data.major2 ? pick(MAJORS, data.major2) : "None"]]],
  ];
  const review = (
    <div className="apply-grouped">
      {reviewRows.map(([title, rows], i) => (
        <section key={title} className="apply-review-section">
          <div className="apply-review-head">
            <Sub>{title}</Sub>
            <button type="button" className="apply-edit" onClick={() => go(i)}>Edit {title.toLowerCase()}</button>
          </div>
          <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || "—"}</dd></div>)}</dl>
        </section>
      ))}
      <div aria-hidden={fix("certify-hidden") ? undefined : "true"}>
        <label className="apply-check">
          <input type="checkbox" id="certify" checked={data.certify === "yes"} onChange={(e) => setData({ certify: e.target.checked ? "yes" : "" })}
          aria-invalid={errFor("certify") && announce ? true : undefined} aria-describedby={errFor("certify") && announce ? "certify-error" : undefined} />
          {" "}I certify that the information in this application is complete and accurate.
        </label>
      </div>
      {errorMsg("certify")}
    </div>
  );

  const bodies = [personal, <>{academic}{program}</>, <>{essays}{review}</>];
  const done = app.status === "submitted";

  return (
    <div className="apply-page">
      <Hero title="Application for Admission" kicker="Admissions" lede={intro.summary} variant="banner" />
      <div className="page-content">
        <div className="apply-intro">
          {intro.sections[0].paragraphs!.map((p) => <p key={p}>{p}</p>)}
          <p><AnyLink href={intro.sections[0].links![0].href}>Read the Admissions FAQ</AnyLink></p>
        </div>

        <ChallengeBanner id="apply-sr" />
        {/* Visual only: the challenge bar's warning already says the form fades out, and focus then moves to the form. */}
        {countdown > 0 && <div className="apply-countdown" aria-hidden="true">Form hides in <b>{countdown}</b></div>}
        <div ref={card} className={`apply-card${ctfRun && !run.revealed && !scrolling ? " apply-card--blind" : ""}`} {...mark("name-mismatch", "next-name", "citizenship-radios", "certify-hidden", "code-image-alt", "crest-alt", "fake-heading", "tab-order", "aria-label-junk", "live-spam", "step-focus", "no-structure", "required-color", "errors-not-announced", "errors-vague", "dob-split", "major-dropdown", "essay-instructions", "review-heading-skip", "back-link", "submit-status", "gpa-for", "term-fieldset")}>
          <img className="apply-crest" src={`${import.meta.env.BASE_URL}favicon.svg`} width="56" height="56" alt={fix("crest-alt") ? "" : CREST_ALT} />
          <ol className="apply-steps" {...mark("progress-label", "stepper-state")}
            {...(fix("progress-label") ? { "aria-label": "Application progress" } : { "aria-labelledby": "apply-progress-title" })}>
            {STEPS.map((label, i) => {
              const state = done || i < step ? "done" : i === step ? "current" : "todo";
              return (
                <li key={label} className={`apply-step is-${state}`} aria-current={fix("stepper-state") && state === "current" ? "step" : undefined}>
                  <span className="apply-step-num" aria-hidden="true">{state === "done" ? "✓" : i + 1}</span>
                  <span className="apply-step-label">
                    {fix("stepper-state") && state === "done" && <span className="visually-hidden">Completed: </span>}
                    {label}
                    {fix("stepper-state") && state === "current" && <span className="visually-hidden"> (current step)</span>}
                  </span>
                </li>
              );
            })}
          </ol>

          <div role={fix("submit-status") ? "status" : undefined} className="apply-status">
            {app.status === "submitting" && <p className="apply-submitting">Submitting your application…</p>}
            {done && (
              <section className="apply-done">
                <h2 ref={heading as React.RefObject<HTMLHeadingElement>} tabIndex={-1}>Application submitted</h2>
                <p>Thank you, {data.first}. Your application for {data.term} ({pick(MAJORS, data.major)}) has been received.</p>
                <p>Confirmation number: <strong className="apply-code">{app.code}</strong></p>
                <ChallengeComplete id="apply-sr" onRetry={() => store.set(INITIAL)} />
                <p>Watch your email for your OwlLink portal login within three business days. This is a demonstration site, so nothing was sent.</p>
                <button type="button" className="btn btn--secondary" onClick={() => store.set(INITIAL)}>Start a new application</button>
              </section>
            )}
          </div>

          {!done && (
            <form className="apply-form" noValidate onSubmit={(e) => { e.preventDefault(); if (step < LAST) next(); else void submit(); }}
              onKeyDown={(e) => {
                if (e.key !== "Tab" || step !== 0 || fix("tab-order")) return;
                const to = scrambledTab((e.target as HTMLElement).id, e.shiftKey);
                const el = to && document.getElementById(to);
                if (el) { e.preventDefault(); el.focus(); }
              }}>
              {fix("fake-heading")
                ? <h2 ref={heading as React.RefObject<HTMLHeadingElement>} tabIndex={-1} className="apply-step-title">Step {step + 1} of {STEPS.length}: {STEPS[step]}</h2>
                : <div ref={heading as React.RefObject<HTMLDivElement>} tabIndex={-1} className="apply-step-title"><b>Step {step + 1} of {STEPS.length}: {STEPS[step]}</b></div>}
              <p className="apply-autosave" aria-live={fix("live-spam") ? undefined : "assertive"}>{saved ? `Draft saved at ${saved}` : "Your draft saves automatically."}</p>
              {!reqFixed && <p className="apply-note">Required fields are in <span className="apply-req">red</span>.</p>}
              {reqFixed && <p className="apply-note">All fields are required unless marked optional.</p>}
              <div ref={summary} tabIndex={announce ? -1 : undefined} role={announce ? "alert" : undefined} className="apply-summary">
                {announce && errors.length > 0 && (
                  <>
                    <p className="apply-summary-title">Please fix {errors.length} {errors.length === 1 ? "problem" : "problems"} on this step:</p>
                    <ul>{errors.map((e) => <li key={e.field}><a href={`#${e.field}`}>{errText(e)}</a></li>)}</ul>
                  </>
                )}
                {!announce && errors.length > 0 && (
                  <p ref={invalidMsg} tabIndex={-1} className="apply-summary-title">
                    This step has {errors.length} {errors.length === 1 ? "problem" : "problems"}. Moving you to the first one.
                  </p>
                )}
              </div>
              {bodies[step]}
              <div className="apply-nav">
                {step > 0 && (fix("back-link")
                  ? <button type="button" className="btn btn--secondary" onClick={() => go(step - 1)}>Back</button>
                  : <a href="#" className="apply-back" onClick={(e) => { e.preventDefault(); go(step - 1); }}>Back</a>)}
                <button type="submit" className="btn btn--primary" disabled={app.status === "submitting"}>
                  {fix("next-name") ? (step < LAST ? "Next" : "Submit application") : <span aria-hidden="true" className="apply-next-icon">{step < LAST ? "→" : "✓"}</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
