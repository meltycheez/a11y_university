// /giving/donate: Donation Form, one of the six terrible pages (plan 06 #7, plan 07; tier T).
// Everything stays on this page: the card fields are checked for format only, never against real card rules,
// and nothing is transmitted. Scenarios: src/a11y/registry/donate.ts. CSS: styles/features/donate.css.
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Field, IconButton, SmartLink } from "~/a11y/helpers";
import { donateScenarios } from "~/a11y/registry/donate";
import { ContactCard } from "~/components/blocks";
import { Hero } from "~/components/Hero";
import { Modal } from "~/components/Modal";
import { pageContent } from "~/data/content/pages";
import { SITE_NOW } from "~/data/site";
import { confirmationCode, latency } from "~/lib/interactive";
import { useFixes } from "~/a11y/useFixes";

export { inventoryMeta as meta } from "~/routes/meta";

const intro = pageContent["/giving/donate"];
const slug = (name: string) => name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
// Same funds and slugs as /giving/priorities, which links here with ?fund=<slug>.
const FUNDS = pageContent["/giving/priorities"].sections.map((s) => ({ slug: slug(s.heading!), name: s.heading!, text: s.paragraphs![0] }));
const AMOUNTS: [string, string][] = [
  ["25", "Stocks a shelf at the Owl Pantry"],
  ["50", "Covers a semester textbook rental"],
  ["100", "A week of groceries for a student family"],
  ["250", "Half of an emergency grant"],
  ["500", "One emergency grant that keeps a student enrolled"],
];
const FREQS = [{ value: "once", label: "One time" }, { value: "monthly", label: "Monthly" }, { value: "annually", label: "Annually" }];
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const YEAR = +SITE_NOW.slice(0, 4);
const YEARS = Array.from({ length: 10 }, (_, i) => String(YEAR + i));
const STATES = ["CA", "AZ", "NV", "OR", "WA", "Other"];

const svg = (s: string) => `data:image/svg+xml,${encodeURIComponent(s)}`;
const SECURE_BADGE = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="168" height="40" viewBox="0 0 168 40"><rect width="168" height="40" rx="6" fill="#2f5d3a"/><rect x="12" y="18" width="16" height="13" rx="2" fill="#fff"/><path d="M15 18v-4a5 5 0 0 1 10 0v4" fill="none" stroke="#fff" stroke-width="2.5"/><text x="38" y="26" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#fff">Secure checkout</text></svg>`);
const CARD_STRIP = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="150" height="30" viewBox="0 0 150 30">${["#1f4b8f", "#c9502a", "#2b7a4b", "#5b3c88"].map((c, i) => `<rect x="${i * 38 + 1}" y="1" width="34" height="28" rx="4" fill="${c}"/><rect x="${i * 38 + 5}" y="8" width="26" height="4" fill="#fff" opacity=".7"/><rect x="${i * 38 + 5}" y="19" width="12" height="3" fill="#fff" opacity=".7"/>`).join("")}</svg>`);

const WARN_MS = 3 * 60_000;   // fixed state: warning at 3:00
const EXPIRE_MS = 4 * 60_000; // both states: gift cleared at 4:00

type Gift = {
  amount: string; other: string; freq: string; fund: string;
  tribute: boolean; tributeType: string; honoree: string; notify: string;
  first: string; last: string; email: string; phone: string; street: string; city: string; state: string; zip: string;
  card: string; expMonth: string; expYear: string; cvv: string; anonymous: boolean;
};
const EMPTY: Gift = {
  amount: "100", other: "", freq: "once", fund: "", tribute: false, tributeType: "honor", honoree: "", notify: "",
  first: "", last: "", email: "", phone: "", street: "", city: "", state: "CA", zip: "",
  card: "", expMonth: "", expYear: "", cvv: "", anonymous: false,
};
type Step = "form" | "review" | "processing" | "done";
type FieldError = { field: string; message: string };

const money = (g: Gift) => (g.amount === "other" ? g.other : g.amount);
const fundName = (s: string) => FUNDS.find((f) => f.slug === s)?.name ?? "";
const freqText = (f: string) => ({ once: "one-time", monthly: "monthly", annually: "annual" })[f] ?? f;

/** Format-only checks. The card number is never checked against real card rules. */
export function validateGift(g: Gift): FieldError[] {
  const e: FieldError[] = [];
  const add = (field: string, message: string) => e.push({ field, message });
  if (g.amount === "other" && !(/^\d+$/.test(g.other) && +g.other >= 5)) add("other-amount", "Other amount: enter whole dollars, $5 or more.");
  if (!g.fund) add("fund", "Designation: choose a fund for your gift.");
  if (g.tribute && !g.honoree.trim()) add("tribute-name", "Honoree's full name: enter the name of the person you are honoring.");
  if (!g.first.trim()) add("first", "First name: enter your first name.");
  if (!g.last.trim()) add("last", "Last name: enter your last name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email)) add("email", "Email: enter an address like name@example.com.");
  if (!g.street.trim()) add("street", "Street address: enter your street address.");
  if (!g.city.trim()) add("city", "City: enter your city.");
  if (!/^\d{5}$/.test(g.zip)) add("zip", "ZIP code: enter 5 digits.");
  if (!/^\d{13,19}$/.test(g.card.replace(/[\s-]/g, ""))) add("cc-number", "Card number: enter 13 to 19 digits.");
  if (!g.expMonth || !g.expYear || `${g.expYear}-${g.expMonth}` < SITE_NOW.slice(0, 7)) add("exp-month", "Expiration date: choose a month and year that has not passed.");
  if (!/^\d{3,4}$/.test(g.cvv)) add("cvv", "Security code: enter the 3 or 4 digits on your card.");
  return e;
}

export default function DonatePage() {
  const { fix, mark } = useFixes(donateScenarios, "donate-");
  const [g, setG] = useState<Gift>(EMPTY);
  const [step, setStep] = useState<Step>("form");
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [tip, setTip] = useState(false);
  const [code, setCode] = useState("");
  const set = <K extends keyof Gift>(k: K, v: Gift[K]) => setG((p) => ({ ...p, [k]: v }));
  const { search } = useLocation();
  const summaryRef = useRef<HTMLDivElement>(null);
  const tributeBox = useRef<HTMLInputElement>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const focusStep = useRef(false);

  // ?fund= from /giving/priorities, read after hydration so the first render matches the prerender.
  useEffect(() => {
    const f = new URLSearchParams(search).get("fund");
    if (f && FUNDS.some((x) => x.slug === f)) setG((p) => ({ ...p, fund: f }));
  }, [search]);

  // Fixed states move focus to the new step's heading after it renders.
  useEffect(() => {
    if (focusStep.current) { focusStep.current = false; stepHeading.current?.focus(); }
  }, [step]);

  const H = fix("section-heading-skip") ? "h2" : "h3";
  const Sub = fix("section-heading-skip") ? "h3" : "h4";
  const req = fix("required-unclear") ? { required: true } : {};
  const errFor = (id: string) => errors.find((e) => e.field === id);
  const errMsg = (e: FieldError) => (fix("errors-vague") ? e.message : "Invalid entry");
  // Per-field error wiring: color only while defective; aria-invalid + inline text once fixed.
  const inv = (id: string): { "aria-invalid"?: true; "aria-describedby"?: string; className?: string } => {
    const e = errFor(id);
    if (!e) return {};
    return fix("errors-color-only") ? { "aria-invalid": true, "aria-describedby": `${id}-error`, className: "is-invalid" } : { className: "is-invalid" };
  };
  const inlineErr = (id: string) => {
    const e = errFor(id);
    return e && fix("errors-color-only") ? <p id={`${id}-error`} className="donate-field-error"><span aria-hidden="true">⚠ </span>{errMsg(e)}</p> : null;
  };
  const chipId = (group: string, i: number) => (fix("chip-duplicate-id") ? `${group}-${i}` : `chip-${i}`);

  const review = (ev: React.FormEvent) => {
    ev.preventDefault();
    const found = validateGift(g);
    setErrors(found);
    if (found.length) {
      if (fix("errors-not-announced")) requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    focusStep.current = fix("review-focus-lost");
    setStep("review");
  };
  const edit = () => { focusStep.current = fix("review-focus-lost"); setStep("form"); };
  const complete = async () => {
    setStep("processing");
    await latency("donate-complete");
    setCode(confirmationCode(`${g.email}|${money(g)}|${g.fund}|${g.freq}`));
    focusStep.current = fix("confirm-status");
    setStep("done");
  };
  const removeTribute = () => {
    set("tribute", false);
    if (fix("tribute-focus-lost")) requestAnimationFrame(() => tributeBox.current?.focus());
  };
  const expire = () => { setG(EMPTY); setErrors([]); setStep("form"); };
  const restart = () => { setG(EMPTY); setErrors([]); setStep("form"); };

  const current = step === "form" ? 0 : step === "done" ? 2 : 1;
  const summaryFixed = fix("errors-not-announced");

  const amountChips = (
    <>
      {AMOUNTS.map(([v, caption], i) => (
        <label key={v} className="donate-chip">
          <input type="radio" name="amount" id={chipId("amount", i)} value={v} checked={g.amount === v} onChange={() => set("amount", v)} />
          <span className="donate-chip-amount">${v}</span>
          <span className="donate-chip-caption">{caption}</span>
        </label>
      ))}
      <label className="donate-chip">
        <input type="radio" name="amount" id={chipId("amount", AMOUNTS.length)} value="other" checked={g.amount === "other"} onChange={() => set("amount", "other")} />
        <span className="donate-chip-amount">Other</span>
        <span className="donate-chip-caption">Any amount of $5 or more</span>
      </label>
    </>
  );

  const freqRadios = FREQS.map((f, i) => (
    <label key={f.value} className="donate-chip donate-chip--small">
      <input type="radio" name="freq" id={chipId("freq", i)} value={f.value} checked={g.freq === f.value} onChange={() => set("freq", f.value)} />
      <span className="donate-chip-amount">{f.label}</span>
    </label>
  ));

  const donorField = (id: keyof Gift, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <>
      <Field scenario="donate-donor-placeholder-001" defect="placeholder" id={id} name={id} label={label}
        value={g[id] as string} onChange={(e) => set(id, e.target.value)} {...req} {...props} {...inv(id)} />
      {inlineErr(id)}
    </>
  );

  const form = (
    <form className="donate-form" onSubmit={review} noValidate {...mark("form-fixed-width", "required-unclear", "section-heading-skip", "fineprint-small", "promise-underline")}>
      <div ref={summaryRef} className="donate-errors" tabIndex={summaryFixed ? -1 : undefined} role={summaryFixed ? "alert" : undefined}
        {...mark("errors-not-announced", "errors-color-only", "errors-vague")}>
        {errors.length > 0 && (
          <>
            <p className="donate-errors-title">{summaryFixed ? `Please fix ${errors.length} ${errors.length === 1 ? "problem" : "problems"} before continuing:` : "Please correct the following errors:"}</p>
            <ul>
              {errors.map((e) => (
                <li key={e.field}>{summaryFixed ? <a href={`#${e.field}`}>{errMsg(e)}</a> : errMsg(e)}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      {fix("required-unclear") && <p className="donate-required-note">Fields marked * are required.</p>}

      <section className="donate-section">
        <H className="donate-section-title">Your gift</H>
        <p className="donate-promise">
          {fix("promise-underline") ? <strong>100% of your gift</strong> : <u>100% of your gift</u>} goes to the fund you choose.
        </p>

        <div className="donate-amount" {...mark("amount-fieldset", "chip-focus", "chip-caption-contrast", "chip-duplicate-id")}>
          {fix("amount-fieldset")
            ? <fieldset className="donate-chips"><legend className="donate-q">Gift amount *</legend>{amountChips}</fieldset>
            : <div className="donate-chips"><p className="donate-q">Gift amount *</p>{amountChips}</div>}
        </div>

        <div className={`donate-other${fix("amount-instructions-vanish") ? " donate-other--keep" : ""}`} {...mark("amount-custom-label", "amount-instructions-vanish")}>
          {fix("amount-custom-label") && <label htmlFor="other-amount">Other amount (USD)</label>}
          <div className="donate-other-row">
            <span className="donate-currency" aria-hidden={fix("amount-custom-label") || undefined}>$</span>
            <input id="other-amount" name="other-amount" inputMode="numeric" value={g.other}
              onChange={(e) => setG((p) => ({ ...p, other: e.target.value, amount: "other" }))}
              aria-describedby={[fix("amount-instructions-vanish") ? "other-hint" : "", inv("other-amount")["aria-describedby"] ?? ""].filter(Boolean).join(" ") || undefined}
              aria-invalid={inv("other-amount")["aria-invalid"]} className={inv("other-amount").className} />
          </div>
          <span id="other-hint" className="donate-other-hint">Minimum $5, whole dollars only.</span>
          {inlineErr("other-amount")}
        </div>

        <div className="donate-freq" {...mark("frequency-visual-state")}>
          {fix("frequency-visual-state") ? (
            <fieldset className="donate-chips"><legend className="donate-q">How often?</legend>{freqRadios}</fieldset>
          ) : (
            <div className="donate-chips">
              <p className="donate-q">How often?</p>
              {FREQS.map((f, i) => (
                <button key={f.value} type="button" id={chipId("freq", i)} className={`donate-freq-btn${g.freq === f.value ? " is-selected" : ""}`} onClick={() => set("freq", f.value)}>
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="field donate-fund" {...mark("fund-select-label")}>
          {fix("fund-select-label") ? <label htmlFor="fund">Designate my gift to *</label> : <p className="donate-q">Designate my gift to *</p>}
          <select id="fund" name="fund" value={g.fund} onChange={(e) => set("fund", e.target.value)} {...req} {...inv("fund")}>
            <option value="">Select a fund</option>
            {FUNDS.map((f) => <option key={f.slug} value={f.slug}>{f.name}</option>)}
          </select>
          {inlineErr("fund")}
          {g.fund && <p className="donate-fund-text">{FUNDS.find((f) => f.slug === g.fund)?.text}</p>}
        </div>

        <div className="donate-tribute-wrap" {...mark("tribute-remove-button", "tribute-orphan-label", "tribute-heading-fake", "tribute-focus-lost")}>
          <label className="donate-check">
            <input ref={tributeBox} type="checkbox" checked={g.tribute} onChange={(e) => set("tribute", e.target.checked)} /> Give in honor or memory of someone
          </label>
          {g.tribute && (
            <div className="donate-tribute">
              <div className="donate-tribute-head">
                {fix("tribute-heading-fake") ? <Sub className="donate-sub">Tribute gift</Sub> : <p className="donate-sub"><strong>Tribute gift</strong></p>}
                <IconButton scenario="donate-tribute-remove-button-001" label="Remove tribute" icon="×" className="donate-tribute-remove" onClick={removeTribute} />
              </div>
              <fieldset className="donate-inline-radios">
                <legend>This gift is</legend>
                {[["honor", "In honor of"], ["memory", "In memory of"]].map(([v, l]) => (
                  <label key={v}><input type="radio" name="tribute-type" value={v} checked={g.tributeType === v} onChange={() => set("tributeType", v)} /> {l}</label>
                ))}
              </fieldset>
              <Field scenario="donate-tribute-orphan-label-001" defect="orphaned" id="tribute-name" name="tribute-name" label="Honoree's full name *"
                value={g.honoree} onChange={(e) => set("honoree", e.target.value)} {...req} {...inv("tribute-name")} />
              {inlineErr("tribute-name")}
              <div className="field">
                <label htmlFor="tribute-notify">Email the honoree or their family (optional)</label>
                <input id="tribute-notify" type="email" value={g.notify} onChange={(e) => set("notify", e.target.value)} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="donate-section">
        <H className="donate-section-title">Your information</H>
        <div className="donate-row">
          {donorField("first", "First name *", { autoComplete: "given-name" })}
          {donorField("last", "Last name *", { autoComplete: "family-name" })}
        </div>
        {donorField("email", "Email *", { type: "email", autoComplete: "email" })}
        {donorField("phone", "Phone", { type: "tel", autoComplete: "tel" })}
        {donorField("street", "Street address *", { autoComplete: "street-address" })}
        <div className="donate-row">
          {donorField("city", "City *", { autoComplete: "address-level2" })}
          <div className="field donate-state">
            <label htmlFor="state">State</label>
            <select id="state" value={g.state} onChange={(e) => set("state", e.target.value)}>{STATES.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
          {donorField("zip", "ZIP code *", { inputMode: "numeric", autoComplete: "postal-code" })}
        </div>
        <label className="donate-check">
          <input type="checkbox" checked={g.anonymous} onChange={(e) => set("anonymous", e.target.checked)} /> Please list my gift as anonymous
        </label>
      </section>

      <section className="donate-section"
        {...mark("card-number-for", "card-hint-describedby", "secure-img-alt", "card-logos-alt", "expiry-select-label", "cvv-hover-help")}>
        <H className="donate-section-title">Payment</H>
        <p className="donate-demo-note">Demonstration site: no payment is processed, and nothing you enter leaves this page.</p>
        <div className="donate-badges">
          <img src={SECURE_BADGE} width={168} height={40} {...(fix("secure-img-alt") ? { alt: "Secure checkout: your card details are encrypted" } : {})} />
          <img src={CARD_STRIP} width={150} height={30} alt={fix("card-logos-alt") ? "We accept all major credit and debit cards" : "accepted_cards.gif"} />
        </div>
        <div className="field">
          <label htmlFor={fix("card-number-for") ? "cc-number" : "card-number"}>Card number *</label>
          <input id="cc-number" name="cc-number" inputMode="numeric" autoComplete="off" value={g.card} onChange={(e) => set("card", e.target.value)} {...req}
            {...inv("cc-number")} aria-describedby={[fix("card-hint-describedby") ? "card-hint" : "cc-hint", inv("cc-number")["aria-describedby"]].filter(Boolean).join(" ")} />
          <span id="card-hint" className="field-hint">Numbers only; spaces are fine.</span>
          {inlineErr("cc-number")}
        </div>
        <div className="donate-row">
          {fix("expiry-select-label") ? (
            <fieldset className="donate-expiry">
              <legend className="donate-q">Expiration date *</legend>
              <label htmlFor="exp-month">Month</label>
              <select id="exp-month" value={g.expMonth} onChange={(e) => set("expMonth", e.target.value)} {...req} {...inv("exp-month")}>
                <option value="">MM</option>{MONTHS.map((m) => <option key={m}>{m}</option>)}
              </select>
              <label htmlFor="exp-year">Year</label>
              <select id="exp-year" value={g.expYear} onChange={(e) => set("expYear", e.target.value)} {...req} {...inv("exp-month")}>
                <option value="">YYYY</option>{YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
              {inlineErr("exp-month")}
            </fieldset>
          ) : (
            <div className="donate-expiry">
              <span className="donate-q">Expiration *</span>
              <select id="exp-month" value={g.expMonth} onChange={(e) => set("expMonth", e.target.value)} {...inv("exp-month")}>
                <option value="">MM</option>{MONTHS.map((m) => <option key={m}>{m}</option>)}
              </select>
              {" / "}
              <select id="exp-year" value={g.expYear} onChange={(e) => set("expYear", e.target.value)} {...inv("exp-month")}>
                <option value="">YYYY</option>{YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
          )}
          <div className="field donate-cvv">
            <label htmlFor="cvv">Security code *</label>
            <div className="donate-cvv-row">
              <input id="cvv" name="cvv" inputMode="numeric" autoComplete="off" maxLength={4} value={g.cvv} onChange={(e) => set("cvv", e.target.value)} {...req}
                {...inv("cvv")} aria-describedby={[fix("cvv-hover-help") ? "cvv-help" : "", inv("cvv")["aria-describedby"] ?? ""].filter(Boolean).join(" ") || undefined} />
              {fix("cvv-hover-help") ? (
                <button type="button" className="donate-cvv-toggle" aria-expanded={tip} aria-controls="cvv-help" onClick={() => setTip((t) => !t)}>What is this?</button>
              ) : (
                <span className="donate-cvv-icon" onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>?</span>
              )}
            </div>
            <p id="cvv-help" className="donate-tip" hidden={!tip}>The 3-digit number on the back of your card (4 digits on the front for some cards).</p>
            {inlineErr("cvv")}
          </div>
        </div>
      </section>

      <button type="submit" className="btn btn--primary donate-submit">Review my gift</button>
      <p className="donate-fineprint">
        Redwood State University Foundation is a 501(c)(3) nonprofit organization. Gifts are tax-deductible to the extent allowed by law; no goods or services are provided in exchange.
        Monthly and annual gifts repeat on the same day each period until you cancel by calling (707) 555-0190.
      </p>
    </form>
  );

  const rows: [string, string][] = [
    ["Amount", `$${money(g)} (${freqText(g.freq)})`],
    ["Fund", fundName(g.fund)],
    ...(g.tribute ? [["Tribute", `${g.tributeType === "honor" ? "In honor of" : "In memory of"} ${g.honoree}`] as [string, string]] : []),
    ["Donor", `${g.first} ${g.last}${g.anonymous ? " (anonymous)" : ""}`],
    ["Email", g.email],
    ["Address", `${g.street}, ${g.city}, ${g.state} ${g.zip}`],
    ["Card", `ending in ${g.card.replace(/\D/g, "").slice(-4)}`],
  ];

  return (
    <div className="donate-page">
      <Hero title="Make a Gift" kicker="Redwood State Foundation" lede={intro.summary} variant="banner" />
      <div className="page-content donate-layout">
        <div className="donate-main">
          <p className="lede-paragraph">{intro.sections[0].paragraphs![0]}</p>
          <ol className="donate-progress" {...mark("progress-aria-current")}>
            {["Gift details", "Review", "Confirmation"].map((label, i) => (
              <li key={label} className={i === current ? "is-current" : i < current ? "is-done" : undefined}
                aria-current={i === current ? ((fix("progress-aria-current") ? "step" : "yes") as "step") : undefined}>
                <span className="donate-progress-num">{i + 1}</span> {label}
              </li>
            ))}
          </ol>

          <div className="donate-steps" {...mark("review-layout-table", "review-edit-javascript", "review-focus-lost", "confirm-status")}>
            {step === "form" && form}
            {(step === "review" || step === "processing") && (
              <section className="donate-review">
                <H ref={stepHeading} tabIndex={-1} className="donate-section-title">Review your gift</H>
                {fix("review-layout-table") ? (
                  <dl className="donate-review-list">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
                ) : (
                  <table className="donate-review-table" cellPadding={4}><tbody>{rows.map(([k, v]) => <tr key={k}><td className="donate-review-key">{k}</td><td>{v}</td></tr>)}</tbody></table>
                )}
                <div className="donate-review-actions">
                  {fix("review-edit-javascript")
                    ? <button type="button" className="btn btn--secondary" onClick={edit} disabled={step === "processing"}>Edit gift details</button>
                    : <a href="#" className="donate-edit-link" onClick={(e) => { e.preventDefault(); if (step === "review") edit(); }}>Edit</a>}
                  <button type="button" className="btn btn--primary" onClick={complete} disabled={step === "processing"}>Complete my gift</button>
                </div>
              </section>
            )}
            <div className="donate-status" role={fix("confirm-status") ? "status" : undefined}>
              {step === "processing" && <p className="donate-processing">Processing your gift…</p>}
              {step === "done" && (
                <section className="donate-thanks">
                  <H ref={stepHeading} tabIndex={-1} className="donate-section-title">Thank you, {g.first}!</H>
                  <p>Your {freqText(g.freq)} gift of ${money(g)} to the {fundName(g.fund)} is complete.</p>
                  <p>Confirmation number: <strong className="donate-code">{code}</strong></p>
                  <p>A tax receipt would be emailed to {g.email}. This is a demonstration site, so nothing was charged or sent.</p>
                  <button type="button" className="btn btn--secondary" onClick={restart}>Make another gift</button>
                </section>
              )}
            </div>
          </div>
        </div>

        <aside className="donate-aside">
          <ContactCard title="Questions about giving?" lines={[
            { label: "Phone", value: "(707) 555-0190", href: "tel:+17075550190" },
            { label: "Office", value: "Founders Hall 320" },
          ]} />
          <p>
            Need help with your gift?{" "}
            <SmartLink scenario="donate-help-link-generic-001" to="mailto:giving@redwoodstate.example.edu" defect="Click here">Contact the Office of Advancement</SmartLink>
          </p>
          <p>
            Gifts of stock, planned gifts and payroll deduction are handled by the{" "}
            <SmartLink scenario="donate-contact-title-redundant-001" to="mailto:giving@redwoodstate.example.edu" defectTitle="Office of Advancement">Office of Advancement</SmartLink>.
          </p>
          <p><SmartLink scenario="donate-ways-new-window-001" to="/giving" newWindow>Other ways to give</SmartLink></p>
        </aside>
      </div>
      <DonateSession active={step !== "done"} extendable={fix("timeout-no-extend")}
        onExpire={expire} onRestart={restart} marker={mark("timeout-no-extend", "timeout-modal-context")} />
    </div>
  );
}

/**
 * Session timer (donate-timeout-no-extend-001). Defective: the gift is cleared at 4:00 with no warning.
 * Fixed: a warning dialog at 3:00 with a countdown and "Continue my gift", which restarts the clock.
 * Timers are cleared on unmount and restart when the toggle changes.
 */
function DonateSession({ active, extendable, onExpire, onRestart, marker }: {
  active: boolean; extendable: boolean; onExpire: () => void; onRestart: () => void; marker: Record<string, string>;
}) {
  const [phase, setPhase] = useState<"ok" | "warn" | "expired">("ok");
  const [epoch, setEpoch] = useState(0);
  const [left, setLeft] = useState(60);
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const timers = [setTimeout(() => { expireRef.current(); setPhase("expired"); }, EXPIRE_MS)];
    if (extendable) timers.push(setTimeout(() => setPhase("warn"), WARN_MS));
    const tick = extendable ? setInterval(() => setLeft(Math.max(0, Math.ceil((EXPIRE_MS - (Date.now() - start)) / 1000))), 1000) : undefined;
    return () => { timers.forEach(clearTimeout); clearInterval(tick); };
  }, [active, epoch, extendable]);

  const extend = () => { setPhase("ok"); setLeft(60); setEpoch((n) => n + 1); };
  const restart = () => { setPhase("ok"); setLeft(60); setEpoch((n) => n + 1); onRestart(); };

  return (
    <div className="donate-session" {...marker}>
      {extendable && (
        <Modal open={phase === "warn"} title="Are you still there?" onClose={extend}>
          <p>For your security, this gift form will be cleared in {left} seconds.</p>
          <button type="button" className="btn btn--primary" onClick={extend}>Continue my gift</button>
        </Modal>
      )}
      <Modal open={phase === "expired"} title="Session expired" onClose={restart}
        scenario="donate-timeout-modal-context-001" defect="no-semantics">
        <p>Your session has expired. For your security, the information you entered has been cleared.</p>
        <button type="button" className="btn btn--primary" onClick={restart}>Start over</button>
      </Modal>
    </div>
  );
}
