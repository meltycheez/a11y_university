import { useState } from "react";
import { Field } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Callout } from "~/components/Callout";
import { ContactCard } from "~/components/blocks";
import { LinkList, content } from "./_content";

export { inventoryMeta as meta } from "~/routes/meta";

const TERMS = ["Fall 2027", "Spring 2028", "Fall 2028", "Not sure yet"];
const INTERESTS = ["Arts & Humanities", "Business", "Education", "Engineering & Computer Science", "Health Sciences & Nursing", "Natural Sciences", "Exploring (undecided)"];
const TYPES = ["First-year student", "Transfer student", "Graduate student", "International student"];

export default function RequestInfo() {
  const c = content("/admissions/request-info")!;
  const intro = c.sections[0];
  const [sent, setSent] = useState(false);
  const reqFixed = useScenario("adm-reqinfo-required-color-001");
  const termFixed = useScenario("adm-reqinfo-term-select-001");
  const typeFixed = useScenario("adm-reqinfo-type-fieldset-001");
  const statusFixed = useScenario("adm-reqinfo-status-001");
  const req = (label: string) => (reqFixed ? `${label} (required)` : label);
  const reqProps = { className: "is-required", required: reqFixed, "data-a11y-scenario": "adm-reqinfo-required-color-001" };

  const radios = TYPES.map((t, i) => (
    <label key={t} className="adm-radio"><input type="radio" name="student-type" value={t} defaultChecked={i === 0} /> {t}</label>
  ));

  return (
    <div className="adm-reqinfo">
      <Hero title="Request Information" kicker="Admissions" lede={c.summary} variant="banner" />
      <div className="page-content adm-audience-body">
        <div className="stack adm-audience-main">
          <p>{intro.paragraphs![0]}</p>
          <form className="adm-form stack" onSubmit={(e) => { e.preventDefault(); setSent(true); }} noValidate={!reqFixed}>
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
              <fieldset className="adm-radios" data-a11y-scenario="adm-reqinfo-type-fieldset-001">
                <legend>I am a…</legend>
                {radios}
              </fieldset>
            ) : (
              <div className="adm-radios" data-a11y-scenario="adm-reqinfo-type-fieldset-001">
                <p className="field-label">I am a…</p>
                {radios}
              </div>
            )}

            <div className="field" data-a11y-scenario="adm-reqinfo-term-select-001">
              {termFixed ? <label htmlFor="ri-term">When do you plan to start?</label> : <span className="field-label">When do you plan to start?</span>}
              <select id="ri-term" name="term">{TERMS.map((t) => <option key={t}>{t}</option>)}</select>
            </div>
            <div className="field">
              <label htmlFor="ri-interest">Area of interest</label>
              <select id="ri-interest" name="interest">{INTERESTS.map((t) => <option key={t}>{t}</option>)}</select>
            </div>
            <button type="submit" className="btn btn--primary">Send me information</button>
            <div role={statusFixed ? "status" : undefined} data-a11y-scenario="adm-reqinfo-status-001">
              {sent && <p className="adm-form-thanks">Thanks! Your regional admissions counselor will follow up by email.</p>}
            </div>
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
