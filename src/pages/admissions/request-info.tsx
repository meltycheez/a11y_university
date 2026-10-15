// /admissions/request-info. Also the booth screen reader CTF (plan 12): during a run the form fades out, Tab jumps
// around (adm-reqinfo-tab-order-001), and sending it with every field filled and every question answered reveals the flag.
import { useRef, useState } from "react";
import { Field } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { useErrorSummary } from "~/components/ErrorSummary";
import { Hero } from "~/components/Hero";
import { Callout } from "~/components/Callout";
import { ContactCard } from "~/components/blocks";
import { ChallengeBanner } from "~/ctf/ChallengeBanner";
import { isRunning, notRunningNote, revealFlag } from "~/ctf/store";
import { useBlindRun } from "~/ctf/useBlindRun";
import { LinkList, content } from "./_content";

export { inventoryMeta as meta } from "~/routes/meta";

const TERMS = ["Fall 2027", "Spring 2028", "Fall 2028", "Not sure yet"];
const INTERESTS = ["Arts & Humanities", "Business", "Education", "Engineering & Computer Science", "Health Sciences & Nursing", "Natural Sciences", "Exploring (undecided)"];
const TYPES = ["First-year student", "Transfer student", "Graduate student", "International student"];
// adm-reqinfo-tab-order-001: Tab and Shift+Tab follow this order between the fields; after the last, on to the term
// list (skipping the I am a buttons), then Area of interest and Send me information as normal. It starts with the
// form's first field so Shift+Tab from there leaves the form instead of looping. Reading order is unchanged.
const TAB_ORDER = ["ri-first", "ri-email", "ri-last", "ri-phone"];
function scrambledTab(id: string, back: boolean): string | null {
  const i = TAB_ORDER.indexOf(id);
  if (i < 0) return null;
  if (back) return i > 0 ? TAB_ORDER[i - 1] : null;
  return TAB_ORDER[i + 1] ?? "ri-term";
}

export default function RequestInfo() {
  const c = content("/admissions/request-info")!;
  const intro = c.sections[0];
  const [sent, setSent] = useState(false);
  const reqFixed = useScenario("adm-reqinfo-required-color-001");
  const termFixed = useScenario("adm-reqinfo-term-select-001");
  const typeFixed = useScenario("adm-reqinfo-type-fieldset-001");
  const statusFixed = useScenario("adm-reqinfo-status-001");
  const tabFixed = useScenario("adm-reqinfo-tab-order-001");
  const { card, countdown, cardClass } = useBlindRun<HTMLFormElement>("reqinfo-sr", ".adm-form :is(input, select, textarea)");
  const [ctfNote, setCtfNote] = useState("");
  const form = useRef<HTMLFormElement>(null);

  const { check, summary, clear } = useErrorSummary();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Fixed: our error summary at the top of the form, instead of the browser's one-at-a-time bubbles (plan 14 §6).
    if (reqFixed && !check(e.currentTarget)) { setCtfNote(""); return; }
    if (isRunning("reqinfo-sr")) {
      const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
      const wrong = [
        !d.first?.trim() && "first name", !d.last?.trim() && "last name", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email ?? "") && "email",
        !d["student-type"] && "I am a", !d.term && "start term", !d.interest && "area of interest", // any answer, just not left unselected
      ].filter(Boolean);
      if (wrong.length) { setCtfNote(`Challenge not complete yet: check ${wrong.join(", ")}.`); return; }
      setCtfNote("");
      revealFlag("reqinfo-sr", [d.first, d.last, d.email]); // the challenge bar shows the results
    } else setCtfNote(notRunningNote("reqinfo-sr"));
    setSent(true);
  };
  const reset = () => {
    form.current?.reset();
    form.current?.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    setSent(false); setCtfNote(""); clear();
  };
  const req = (label: string) => (reqFixed ? `${label} (required)` : label);
  const reqProps = { className: "is-required", required: reqFixed, "data-a11y-scenario": "adm-reqinfo-required-color-001" };

  // Every question starts unanswered: no radio checked, each list on an empty "Select one".
  // The first button has an id so the error summary can link to the group.
  const radios = TYPES.map((t, i) => (
    <label key={t} className="adm-radio"><input type="radio" id={i ? undefined : "ri-type"} name="student-type" value={t} required={reqFixed} /> {t}</label>
  ));
  const pick = <option value="">Select one</option>;

  return (
    <div className="adm-reqinfo">
      <Hero title="Request Information" kicker="Admissions" lede={c.summary} variant="banner" />
      <div className="page-content adm-audience-body">
        <div className="stack adm-audience-main">
          <p>{intro.paragraphs![0]}</p>
          {/* Every run starts with an empty form. */}
          <ChallengeBanner id="reqinfo-sr" onReset={reset} />
          {/* Visual only: the challenge bar's warning already says the form fades out, and focus then moves to the form. */}
          {countdown > 0 && <div className="ctf-countdown" aria-hidden="true">Form hides in <b>{countdown}</b></div>}
          <form
            ref={(el) => { form.current = el; card.current = el; }}
            className={`adm-form stack ${cardClass}`} onSubmit={submit} noValidate data-a11y-scenario="adm-reqinfo-tab-order-001"
            onKeyDown={(e) => {
              if (e.key !== "Tab" || tabFixed) return;
              const to = scrambledTab((e.target as HTMLElement).id, e.shiftKey);
              const el = to && document.getElementById(to);
              if (el) { e.preventDefault(); el.focus(); }
            }}
          >
            {reqFixed && summary}
            {!reqFixed && <p className="adm-form-note">Fields in red are required.</p>}
            <div className="adm-form-row">
              <Field scenario="adm-reqinfo-name-placeholder-001" defect="placeholder" id="ri-first" name="first" label={req("First name")} autoComplete="given-name" {...reqProps} />
              <Field scenario="adm-reqinfo-name-placeholder-001" defect="placeholder" id="ri-last" name="last" label={req("Last name")} autoComplete="family-name" {...reqProps} />
            </div>
            <Field scenario="adm-reqinfo-email-for-001" defect="for-mismatch" id="ri-email" name="email" type="email" label={req("Email")} autoComplete="email" {...reqProps} />
            <div className="field">
              <label htmlFor="ri-phone">Mobile phone (optional)</label>
              <input id="ri-phone" name="phone" type="tel" autoComplete="tel" />
            </div>

            {typeFixed ? (
              <fieldset className="adm-radios is-required" data-a11y-scenario="adm-reqinfo-type-fieldset-001">
                <legend>{req("I am a…")}</legend>
                {radios}
              </fieldset>
            ) : (
              <div className="adm-radios is-required" data-a11y-scenario="adm-reqinfo-type-fieldset-001">
                <p className="field-label">I am a…</p>
                {radios}
              </div>
            )}

            <div className="field is-required" data-a11y-scenario="adm-reqinfo-term-select-001">
              {termFixed ? <label htmlFor="ri-term">{req("When do you plan to start?")}</label> : <span className="field-label">When do you plan to start?</span>}
              <select id="ri-term" name="term" required={reqFixed}>{pick}{TERMS.map((t) => <option key={t}>{t}</option>)}</select>
            </div>
            <div className="field is-required">
              <label htmlFor="ri-interest">{req("Area of interest")}</label>
              <select id="ri-interest" name="interest" required={reqFixed}>{pick}{INTERESTS.map((t) => <option key={t}>{t}</option>)}</select>
            </div>
            <button type="submit" className="btn btn--primary">Send me information</button>
            <div role={statusFixed ? "status" : undefined} data-a11y-scenario="adm-reqinfo-status-001">
              {sent && <p className="adm-form-thanks">Thanks! Your regional admissions counselor will follow up by email.</p>}
            </div>
            {/* Challenge feedback, not part of the site: always announced. */}
            <p className="ctf-error" role="alert">{ctfNote}</p>
          </form>
          <Callout title="Your privacy">
            <p>We use your information only to send you admissions materials. You can unsubscribe at any time.</p>
            <LinkList links={intro.links!} />
          </Callout>
        </div>
        <ContactCard
          title="Prefer to talk?"
          lines={[
            { label: "Phone", value: "(707) 555-0120", href: "tel:+17075550120" },
            { label: "Email", value: "admissions@redwoodstate.edu", href: "mailto:admissions@redwoodstate.edu" },
          ]}
        />
      </div>
    </div>
  );
}
