import { useState } from "react";
import { Field } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Button } from "~/components/Button";
import { Callout } from "~/components/Callout";
import { DataTable } from "~/components/DataTable";
import { Hero } from "~/components/Hero";
import { AnyLink, ContactCard } from "~/components/blocks";
import { copyFor } from "./about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/contact");
const [switchboard, offices, emergencies] = content.sections;
type Office = string[];

export default function ContactPage() {
  const t = offices.table!;
  return (
    <>
      <Hero title="Contact Us" kicker="Redwood State University" lede={content.summary} variant="banner" />
      <div className="page-content contact-page">
        <div className="contact-layout">
          <ContactForm />
          <ContactCard
            title={switchboard.heading!}
            lines={[
              { label: "Address", value: "1400 Canopy Drive, Arcadia Falls, CA 95579" },
              { label: "Phone", value: "(707) 555-0100", href: "tel:7075550100" },
              { label: "Hours", value: "Monday through Friday, 8 a.m. to 5 p.m." },
              { label: "Email", value: "info@redwoodstate.example.edu", href: "mailto:info@redwoodstate.example.edu" },
            ]}
          />
        </div>

        <section aria-labelledby="offices-heading" className="stack">
          <h2 id="offices-heading">{offices.heading}</h2>
          <DataTable<Office>
            caption={t.caption!}
            rowHeader="office"
            rows={t.rows}
            columns={[
              { key: "office", header: "Office", render: (r) => r[0] },
              { key: "phone", header: "Phone", render: (r) => <a href={`tel:${r[1].replace(/\D/g, "")}`}>{r[1]}</a> },
              { key: "email", header: "Email", render: (r) => <a href={`mailto:${r[2]}`}>{r[2]}</a> },
              { key: "location", header: "Location", render: (r) => r[3] },
            ]}
          />
        </section>

        <Callout title={emergencies.heading} tone="warning">
          {emergencies.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
          {emergencies.links?.map((l) => <p key={l.href}><AnyLink href={l.href}>{l.label}</AnyLink></p>)}
        </Callout>
      </div>
    </>
  );
}

const topics = ["General question", "Admissions", "Financial aid", "Registrar and records", "Website feedback", "Something else"];

function ContactForm() {
  const [sent, setSent] = useState(false);
  const requiredFixed = useScenario("about-contact-required-color-001");
  const selectFixed = useScenario("about-contact-topic-select-001");
  const radiosFixed = useScenario("about-contact-reply-fieldset-001");
  const statusFixed = useScenario("about-contact-sent-status-001");
  const req = (label: string) => (requiredFixed ? `${label} (required)` : label);

  const radios = ["Email", "Phone"].map((r) => (
    <label key={r} className="radio">
      <input type="radio" name="reply" value={r.toLowerCase()} defaultChecked={r === "Email"} /> {r}
    </label>
  ));

  return (
    <section aria-labelledby="form-heading" className="contact-form-wrap">
      <h2 id="form-heading">Send us a message</h2>
      <p className="form-note" data-a11y-scenario="about-contact-required-color-001">
        {requiredFixed ? "Fields marked (required) must be filled in." : "Fields in red are required."} We reply within two business days.
      </p>
      <form
        className={`contact-form${requiredFixed ? "" : " contact-form--color-required"}`}
        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      >
        <Field scenario="about-contact-name-placeholder-001" id="contact-name" label={req("Your name")} defect="placeholder" name="name" autoComplete="name" required className="field--required" />
        <Field scenario="about-contact-email-label-001" id="contact-email" label={req("Email address")} defect="missing" name="email" type="email" autoComplete="email" required className="field--required" />

        <div className="field field--required" data-a11y-scenario="about-contact-topic-select-001">
          {selectFixed ? <label htmlFor="contact-topic">{req("Topic")}</label> : <span className="field-label">{req("Topic")}</span>}
          <select id="contact-topic" name="topic" required defaultValue="">
            <option value="" disabled>Choose one</option>
            {topics.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="field" data-a11y-scenario="about-contact-reply-fieldset-001">
          {radiosFixed
            ? <fieldset className="radio-group"><legend>How should we reply?</legend>{radios}</fieldset>
            : <><span className="field-label">How should we reply?</span><div className="radio-group">{radios}</div></>}
        </div>

        <div className="field">
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" rows={6} />
        </div>

        <Button type="submit">Send message</Button>
        <div data-a11y-scenario="about-contact-sent-status-001" {...(statusFixed ? { role: "status" } : {})}>
          {sent && <p className="form-sent">Thank you. Your message has been sent, and the right office will reply within two business days.</p>}
        </div>
      </form>
    </section>
  );
}
