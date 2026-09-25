// /portal/profile: contact details plus the preferences form (changes live only in memory).
import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { Field, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import portal from "~/data/generated/portal.json";
import type { PortalStudent } from "~/data/types";
import { PortalPage } from "./_PortalPage";

export { inventoryMeta as meta } from "~/routes/meta";

export async function loader() {
  const p = portal as unknown as PortalStudent;
  return {
    student: { id: p.id, name: p.name, preferredName: p.preferredName, email: p.email, phone: p.phone, address: p.address, major: p.major, standing: p.classStanding, graduation: p.expectedGraduation, advisor: p.advisor, advisorSlug: p.advisorSlug },
  };
}

export default function ProfilePage() {
  const { student: s } = useLoaderData<typeof loader>();
  const [saved, setSaved] = useState(false);

  return (
    <PortalPage title="Profile" subtitle="Your contact information, emergency contacts, and preferences.">
      <div className="pt-widgets pt-widgets--2">
        <section className="pt-card" aria-labelledby="pf-personal">
          <h2 id="pf-personal">Personal Information</h2>
          <dl className="pt-dl">
            <div><dt>Legal name</dt><dd>{s.name}</dd></div>
            <div><dt>Student ID</dt><dd>{s.id}</dd></div>
            <div><dt>RSU email</dt><dd>{s.email}</dd></div>
            <div><dt>Program</dt><dd>{s.major}</dd></div>
            <div><dt>Class standing</dt><dd>{s.standing}</dd></div>
            <div><dt>Expected graduation</dt><dd>{s.graduation}</dd></div>
            <div><dt>Advisor</dt><dd><Link to={`/faculty/${s.advisorSlug}`}>{s.advisor}</Link></dd></div>
          </dl>
        </section>
        <section className="pt-card" aria-labelledby="pf-address">
          <h2 id="pf-address">Campus Address</h2>
          <p>{s.address.street}<br />{s.address.city}, {s.address.state} {s.address.zip}</p>
          <p className="pt-muted">Housing assignments are updated by <Link to="/students/housing">Housing &amp; Residential Life</Link>.</p>
          <h2>Privacy</h2>
          <p>
            Under FERPA you can restrict release of your directory information. Read the{" "}
            <SmartLink scenario="portal-profile-ferpa-pdf-001" to="/documents/ferpa-annual-notice.pdf" fileInfo="PDF, 2 KB">FERPA annual notice</SmartLink>.
          </p>
        </section>
      </div>

      <section className="pt-card" aria-labelledby="pf-prefs">
        <h2 id="pf-prefs">Preferences</h2>
        <p>Your chosen name will appear on class rosters and in RedwoodConnect.</p>
        <form className="pt-form" onSubmit={(e) => { e.preventDefault(); setSaved(true); }} onChange={() => setSaved(false)}>
          <Field scenario="portal-profile-for-mismatch-001" id="pf-chosen" label="Chosen first name" defect="for-mismatch" defaultValue={s.preferredName} autoComplete="given-name" />
          <Pronouns />
          <Field scenario="portal-profile-phone-placeholder-001" id="pf-phone" label="Mobile phone" defect="placeholder" type="tel" autoComplete="tel" />
          <RequiredFields email={s.email} />
          <TextAlerts />
          <p><button type="submit" className="btn btn--primary pt-btn">Save preferences</button></p>
          <p role="status" className="pt-saved">{saved ? "Preferences saved for this session." : ""}</p>
        </form>
      </section>
    </PortalPage>
  );
}

function Pronouns() {
  const fixed = useScenario("portal-profile-pronouns-label-001");
  return (
    <div className="field" data-a11y-scenario="portal-profile-pronouns-label-001">
      {fixed ? <label htmlFor="pf-pronouns">Pronouns</label> : <span className="field-label">Pronouns</span>}
      <select id="pf-pronouns" defaultValue="">
        <option value="">Prefer not to say</option>
        <option>she/her</option>
        <option>he/him</option>
        <option>they/them</option>
        <option>Use my name</option>
      </select>
    </div>
  );
}

function RequiredFields({ email }: { email: string }) {
  const fixed = useScenario("portal-profile-required-color-001");
  const fields = [
    { id: "pf-email", label: "Preferred email", type: "email", value: email, auto: "email" },
    { id: "pf-emergency", label: "Emergency contact name", type: "text", value: "Elena Alvarez", auto: "off" },
    { id: "pf-emergency-phone", label: "Emergency contact phone", type: "tel", value: "(707) 555-0143", auto: "off" },
  ];
  return (
    <div data-a11y-scenario="portal-profile-required-color-001">
      {fields.map((f) => (
        <div className="field" key={f.id}>
          <label htmlFor={f.id} className="pt-required">{f.label}{fixed && " (required)"}</label>
          <input id={f.id} type={f.type} defaultValue={f.value} autoComplete={f.auto} required={fixed} />
        </div>
      ))}
    </div>
  );
}

function TextAlerts() {
  const fixed = useScenario("portal-profile-radios-fieldset-001");
  const radios = ["Yes", "No"].map((v) => (
    <label key={v} className="pt-radio"><input type="radio" name="pf-alerts" value={v} defaultChecked={v === "Yes"} /> {v}</label>
  ));
  const question = "Receive RSU Alert emergency text messages at my mobile number";
  return fixed ? (
    <fieldset className="pt-fieldset" data-a11y-scenario="portal-profile-radios-fieldset-001"><legend>{question}</legend>{radios}</fieldset>
  ) : (
    <div className="pt-fieldset" data-a11y-scenario="portal-profile-radios-fieldset-001"><p className="field-label">{question}</p>{radios}</div>
  );
}
