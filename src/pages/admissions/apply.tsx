// /admissions/apply: five-step Application for Admission (plan 06 #8; tier H).
// Data lives in a module store: it survives client-side navigation and resets on reload. Nothing is sent.
// Scenarios: src/a11y/registry/apply.ts. CSS: styles/features/apply.css.
import { Fragment, useEffect, useRef, useState } from "react";
import { applyScenarios } from "~/a11y/registry/apply";
import { AnyLink } from "~/components/blocks";
import { Hero } from "~/components/Hero";
import { Dropdown } from "~/components/widgets";
import { programs } from "~/data/catalog";
import { pageContent } from "~/data/content/pages";
import { confirmationCode, createStore, latency } from "~/lib/interactive";
import { useFixes } from "./_useFixes";

export { inventoryMeta as meta } from "~/routes/meta";

const intro = pageContent["/admissions/apply"];
const STEPS = ["Personal information", "Academic history", "Program choice", "Essays", "Review and submit"];
const MAJORS = [
  ...programs.filter((p) => p.level === "undergraduate").map((p) => ({ value: p.slug, label: `${p.name}, ${p.degree}` })),
  { value: "undeclared", label: "Undeclared (exploring)" },
];
const TERMS = ["Fall 2027", "Spring 2028"];
const CITIZENSHIP = ["U.S. citizen", "U.S. permanent resident", "International (F-1 or J-1 visa)", "Other or prefer to discuss"];
const ESSAYS = [
  { id: "essay1", label: "Personal essay", limit: 350, prompt: "Describe a challenge you have faced and what you learned from it." },
  { id: "essay2", label: "Program essay", limit: 250, prompt: "Why are you interested in your first-choice major, and how will Redwood State help you reach your goals?" },
] as const;

type Data = Record<string, string>;
interface App { step: number; data: Data; status: "editing" | "submitting" | "submitted"; code: string }
const INITIAL: App = { step: 0, data: { citizenship: "", term: "", major: "", major2: "", type: "First-year", state: "CA", certify: "" }, status: "editing", code: "" };
const store = createStore<App>(INITIAL);

const words = (s = "") => s.trim().split(/\s+/).filter(Boolean).length;
const validDate = (d: Data, id: string, minYear: number, maxYear: number) => {
  const m = +d[`${id}-m`], day = +d[`${id}-d`], y = +d[`${id}-y`];
  if (!(m >= 1 && m <= 12 && day >= 1 && y >= minYear && y <= maxYear)) return false;
  return day <= new Date(Date.UTC(y, m, 0)).getUTCDate();
};

type Err = { field: string; message: string };
/** Returns the errors for one step (fields are keyed by input id). */
export function validateStep(step: number, d: Data): Err[] {
  const e: Err[] = [];
  const need = (field: string, message: string) => { if (!d[field]?.trim()) e.push({ field, message }); };
  if (step === 0) {
    need("first", "Enter your legal first name.");
    need("last", "Enter your legal last name.");
    if (!validDate(d, "dob", 1940, 2012)) e.push({ field: "dob-m", message: "Enter your date of birth as month, day and four-digit year." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email ?? "")) e.push({ field: "email", message: "Enter an email address like name@example.com." });
    need("street", "Enter your street address.");
    need("city", "Enter your city.");
    if (!/^\d{5}$/.test(d.zip ?? "")) e.push({ field: "zip", message: "Enter a 5-digit ZIP code." });
    need("citizenship", "Choose your citizenship status.");
  } else if (step === 1) {
    need("school", "Enter the name of your high school.");
    need("school-city", "Enter the city and state of your high school.");
    if (!validDate(d, "grad", 1980, 2028)) e.push({ field: "grad-m", message: "Enter your graduation date (or expected date) as month, day and year." });
    if (!/^\d(\.\d{1,2})?$/.test(d.gpa ?? "") || +d.gpa > 5) e.push({ field: "gpa", message: "Enter your GPA as a number from 0.00 to 5.00, for example 3.45." });
  } else if (step === 2) {
    need("term", "Choose the term you want to start.");
    need("major", "Choose a first-choice major, or Undeclared.");
  } else if (step === 3) {
    for (const es of ESSAYS) {
      const n = words(d[es.id]);
      if (!n) e.push({ field: es.id, message: `Write your ${es.label.toLowerCase()}.` });
      else if (n > es.limit) e.push({ field: es.id, message: `Shorten your ${es.label.toLowerCase()} to ${es.limit} words or fewer (now ${n}).` });
    }
  } else if (step === 4) {
    if (d.certify !== "yes") e.push({ field: "certify", message: "Check the box to certify that your application is accurate." });
  }
  return e;
}

export default function ApplyPage() {
  const { fix, mark } = useFixes(applyScenarios, "apply-");
  const app = store.use();
  const { step, data } = app;
  const heading = useRef<HTMLHeadingElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const moveFocus = useRef<"heading" | "summary" | null>(null);

  useEffect(() => {
    if (moveFocus.current === "heading") heading.current?.focus();
    if (moveFocus.current === "summary") summary.current?.focus();
    moveFocus.current = null;
  });

  const [errors, setErrors] = useState<Err[]>([]);
  const setData = (patch: Data) => store.set((a) => ({ ...a, data: { ...a.data, ...patch } }));
  const errFor = (id: string) => errors.find((e) => e.field === id);
  const errText = (e: Err) => (fix("errors-vague") ? e.message : "Invalid");
  const announce = fix("errors-not-announced");
  const reqFixed = fix("required-color");

  const go = (to: number) => {
    if (fix("step-focus")) moveFocus.current = "heading";
    setErrors([]);
    store.set((a) => ({ ...a, step: to }));
  };
  const next = () => {
    const found = validateStep(step, data);
    setErrors(found);
    if (found.length) { if (announce) moveFocus.current = "summary"; return; }
    go(step + 1);
  };
  const submit = async () => {
    const found = validateStep(4, data);
    setErrors(found);
    if (found.length) { if (announce) moveFocus.current = "summary"; return; }
    store.set((a) => ({ ...a, status: "submitting" }));
    await latency("apply-submit");
    if (fix("submit-status")) moveFocus.current = "heading";
    store.set((a) => ({ ...a, status: "submitted", code: confirmationCode(`${a.data.email}|${a.data.major}|${a.data.term}`) }));
  };

  /** Props shared by every input: value binding, required marking and error wiring. */
  const bind = (id: string, required = true) => {
    const e = errFor(id);
    return {
      id, name: id, value: data[id] ?? "",
      onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setData({ [id]: ev.target.value }),
      ...(required && reqFixed ? { required: true } : {}),
      ...(e && announce ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` } : {}),
    };
  };
  const labelText = (text: string, required = true) => (
    <>{text}{required && reqFixed && " (required)"}{!required && " (optional)"}</>
  );
  const labelClass = (required = true) => (required && !reqFixed ? "apply-req" : undefined);
  const errorMsg = (id: string) => {
    const e = errFor(id);
    return e ? <p id={`${id}-error`} className="apply-error">{errText(e)}</p> : null;
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

  /** Month / day / year boxes. Defective: three bare inputs after a line of text (apply-dob-split-001). */
  const dateParts = (id: string, label: string, autoComplete?: [string, string, string]) => {
    const parts = [["m", "Month", 2], ["d", "Day", 2], ["y", "Year", 4]] as const;
    const inputs = parts.map(([p, name, size], i) => (
      <Fragment key={p}>
        {fix("dob-split") && <label htmlFor={`${id}-${p}`}>{name}</label>}
        <input {...bind(`${id}-${p}`)} className={`apply-date-${p}`} inputMode="numeric" maxLength={size} size={size}
          autoComplete={autoComplete?.[i]} aria-describedby={errFor(`${id}-m`) && announce ? `${id}-m-error` : undefined} aria-invalid={errFor(`${id}-m`) && announce ? true : undefined} />
        {!fix("dob-split") && i < 2 && <span aria-hidden="true">/</span>}
      </Fragment>
    ));
    return fix("dob-split") ? (
      <fieldset className="apply-date">
        <legend className={labelClass()}>{labelText(label)}</legend>
        <div className="apply-date-row">{inputs}</div>
        {errorMsg(`${id}-m`)}
      </fieldset>
    ) : (
      <div className="apply-date">
        <p className={`apply-label ${labelClass() ?? ""}`}>{label}</p>
        <div className="apply-date-row">{inputs}</div>
        <p className="apply-hint">MM / DD / YYYY</p>
        {errorMsg(`${id}-m`)}
      </div>
    );
  };

  // A plain function, not a component, so re-renders never remount the inputs inside.
  const group = (legend: string, children: React.ReactNode) =>
    fix("no-structure") ? <fieldset className="apply-group"><legend>{legend}</legend>{children}</fieldset> : children;

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
        {text("city", "City", { autoComplete: "address-level2" })}
        <div className="field">
          <label htmlFor="state">State</label>
          <select {...bind("state", false)}>{["CA", "AZ", "NV", "OR", "WA", "Other U.S.", "Outside the U.S."].map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        {text("zip", "ZIP code", { inputMode: "numeric", autoComplete: "postal-code" })}
      </>)}
      {group("Citizenship and residency", <>
        <div className="field">
          <label htmlFor="citizenship" className={labelClass()}>{labelText("Citizenship status")}</label>
          <select {...bind("citizenship")}>
            <option value="">Select one</option>
            {CITIZENSHIP.map((c) => <option key={c}>{c}</option>)}
          </select>
          {errorMsg("citizenship")}
        </div>
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
        <input {...bind("gpa")} inputMode="decimal" className="apply-short" />
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
    ["Academic history", [["High school", `${data.school}, ${data["school-city"]}`], ["Graduation", `${data["grad-m"]}/${data["grad-d"]}/${data["grad-y"]}`], ["GPA", data.gpa]]],
    ["Program choice", [["Entry term", data.term], ["Applying as", `${data.type} student`], ["First choice", pick(MAJORS, data.major)], ["Second choice", data.major2 ? pick(MAJORS, data.major2) : "None"]]],
    ["Essays", ESSAYS.map((es) => [es.label, `${words(data[es.id])} words`] as [string, string])],
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
      <label className="apply-check">
        <input type="checkbox" id="certify" checked={data.certify === "yes"} onChange={(e) => setData({ certify: e.target.checked ? "yes" : "" })}
          aria-invalid={errFor("certify") && announce ? true : undefined} aria-describedby={errFor("certify") && announce ? "certify-error" : undefined} />
        {" "}I certify that the information in this application is complete and accurate.
      </label>
      {errorMsg("certify")}
    </div>
  );

  const bodies = [personal, academic, program, essays, review];
  const done = app.status === "submitted";

  return (
    <div className="apply-page">
      <Hero title="Application for Admission" kicker="Admissions" lede={intro.summary} variant="banner" />
      <div className="page-content">
        <div className="apply-intro">
          {intro.sections[0].paragraphs!.map((p) => <p key={p}>{p}</p>)}
          <p><AnyLink href={intro.sections[0].links![0].href}>Read the Admissions FAQ</AnyLink></p>
        </div>

        <div className="apply-card" {...mark("step-focus", "no-structure", "required-color", "errors-not-announced", "errors-vague", "dob-split", "major-dropdown", "essay-instructions", "review-heading-skip", "back-link", "submit-status", "gpa-for", "term-fieldset")}>
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
                <h2 ref={heading} tabIndex={-1}>Application submitted</h2>
                <p>Thank you, {data.first}. Your application for {data.term} ({pick(MAJORS, data.major)}) has been received.</p>
                <p>Confirmation number: <strong className="apply-code">{app.code}</strong></p>
                <p>Watch your email for your OwlLink portal login within three business days. This is a demonstration site, so nothing was sent.</p>
                <button type="button" className="btn btn--secondary" onClick={() => store.set(INITIAL)}>Start a new application</button>
              </section>
            )}
          </div>

          {!done && (
            <form className="apply-form" noValidate onSubmit={(e) => { e.preventDefault(); if (step < 4) next(); else void submit(); }}>
              <h2 ref={heading} tabIndex={-1} className="apply-step-title">Step {step + 1} of 5: {STEPS[step]}</h2>
              {!reqFixed && <p className="apply-note">Required fields are in <span className="apply-req">red</span>.</p>}
              {reqFixed && <p className="apply-note">All fields are required unless marked optional.</p>}
              <div ref={summary} tabIndex={announce ? -1 : undefined} role={announce ? "alert" : undefined} className="apply-summary">
                {announce && errors.length > 0 && (
                  <>
                    <p className="apply-summary-title">Please fix {errors.length} {errors.length === 1 ? "problem" : "problems"} on this step:</p>
                    <ul>{errors.map((e) => <li key={e.field}><a href={`#${e.field}`}>{errText(e)}</a></li>)}</ul>
                  </>
                )}
              </div>
              {bodies[step]}
              <div className="apply-nav">
                {step > 0 && (fix("back-link")
                  ? <button type="button" className="btn btn--secondary" onClick={() => go(step - 1)}>Back</button>
                  : <a href="#" className="apply-back" onClick={(e) => { e.preventDefault(); go(step - 1); }}>Back</a>)}
                <button type="submit" className="btn btn--primary" disabled={app.status === "submitting"}>{step < 4 ? "Next" : "Submit application"}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
