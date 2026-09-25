// Form Specimens (plan 08): labeling, grouping, instructions, errors, required fields, and timeouts.
import { useEffect, useId, useState } from "react";
import { Field } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Specimen } from "./_Specimen";

export { inventoryMeta as meta } from "~/routes/meta";

function SelectMissingLabel() {
  const id = "select-missing-label-forms-lab";
  const fixed = useScenario(id);
  const selectId = useId();
  const control = (
    <select id={fixed ? selectId : undefined} data-a11y-scenario={id}>
      <option>Fall 2026</option>
      <option>Spring 2027</option>
    </select>
  );
  return fixed ? (
    <div className="field"><label htmlFor={selectId}>Term</label>{control}</div>
  ) : (
    <div className="field"><span className="field-label">Term</span>{control}</div>
  );
}

function FieldsetMissing() {
  const id = "fieldset-missing-forms-lab";
  const fixed = useScenario(id);
  const name = useId();
  const options = (
    <>
      <label><input type="radio" name={name} data-a11y-scenario={id} /> Arcadia Falls</label>{" "}
      <label><input type="radio" name={name} /> Coastal Extension</label>{" "}
      <label><input type="radio" name={name} /> Online</label>
    </>
  );
  return fixed ? <fieldset><legend>Which campus?</legend>{options}</fieldset> : <div>{options}</div>;
}

function UngroupedControls() {
  const id = "form-ungrouped-controls-forms-lab";
  const fixed = useScenario(id);
  const boxes = (
    <>
      <label><input type="checkbox" data-a11y-scenario={id} /> Research</label>{" "}
      <label><input type="checkbox" /> Athletics</label>{" "}
      <label><input type="checkbox" /> Alumni events</label>
    </>
  );
  return fixed ? <fieldset><legend>Areas of interest</legend>{boxes}</fieldset> : <div>{boxes}</div>;
}

function InstructionsDisappear() {
  const id = "form-instructions-disappear-forms-lab";
  const fixed = useScenario(id);
  const fieldId = useId();
  const hintId = `${fieldId}-hint`;
  const [touched, setTouched] = useState(false);
  const showHint = fixed || !touched;
  return (
    <div className="field">
      <label htmlFor={fieldId}>New password</label>
      {showHint && <span id={hintId} className="lab-forms-hint">8+ characters, one number</span>}
      <input
        id={fieldId}
        type="password"
        aria-describedby={showHint ? hintId : undefined}
        data-a11y-scenario={id}
        onChange={() => !fixed && setTouched(true)}
      />
    </div>
  );
}

function NoStructure() {
  const id = "form-no-structure-forms-lab";
  const fixed = useScenario(id);
  const fields = (
    <>
      <div className="field"><label>First name<input /></label></div>
      <div className="field"><label>Last name<input /></label></div>
      <div className="field"><label>Email<input type="email" /></label></div>
      <div className="field"><label>Preferred contact method<input /></label></div>
      <div className="field"><label>Newsletter opt-in<input type="checkbox" /></label></div>
    </>
  );
  return (
    <div data-a11y-scenario={id}>
      {fixed ? (
        <>
          <h3>Contact information</h3>
          <div className="field"><label>First name<input /></label></div>
          <div className="field"><label>Last name<input /></label></div>
          <div className="field"><label>Email<input type="email" /></label></div>
          <h3>Preferences</h3>
          <div className="field"><label>Preferred contact method<input /></label></div>
          <div className="field"><label>Newsletter opt-in<input type="checkbox" /></label></div>
        </>
      ) : fields}
    </div>
  );
}

function VagueErrors() {
  const id = "form-vague-errors-forms-lab";
  const fixed = useScenario(id);
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const [submitted, setSubmitted] = useState(false);
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} data-a11y-scenario={id}>
      {submitted && !fixed && <p className="lab-forms-error">There was an error.</p>}
      <div className="field">
        <label htmlFor={fieldId}>Email address</label>
        <input id={fieldId} type="email" aria-describedby={submitted && fixed ? errorId : undefined} />
        {submitted && fixed && <span id={errorId} className="lab-forms-error">Email address is required.</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

function ErrorsNotAnnounced() {
  const id = "sr-errors-not-announced-forms-lab";
  const fixed = useScenario(id);
  const [submitted, setSubmitted] = useState(false);
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} data-a11y-scenario={id}>
      <div className="field">
        <label>Student ID<input /></label>
      </div>
      {submitted && <p role={fixed ? "alert" : undefined}>Student ID is required.</p>}
      <button type="submit">Submit</button>
    </form>
  );
}

function RequiredUnclear() {
  const id = "form-required-unclear-forms-lab";
  const fixed = useScenario(id);
  return (
    <div>
      <p className="lab-forms-required-note">* = required</p>
      <div className="field">
        <label>Legal name{fixed && " (required)"}<input required={fixed} aria-required={fixed} data-a11y-scenario={id} /></label>
      </div>
    </div>
  );
}

function ColorOnlyRequired() {
  const id = "color-only-required-forms-lab";
  const fixed = useScenario(id);
  return (
    <div>
      {!fixed && <p className="lab-forms-required-note">Fields in <span className="lab-forms-required-red">red</span> are required.</p>}
      <div className="field">
        <label className={fixed ? undefined : "lab-forms-required-red"}>Date of birth{fixed && " (required)"}</label>
        <input required={fixed} data-a11y-scenario={id} />
      </div>
    </div>
  );
}

function TimeoutNoWarning() {
  const id = "form-timeout-no-warning-forms-lab";
  const fixed = useScenario(id);
  const [status, setStatus] = useState<"active" | "warning" | "expired">("active");
  useEffect(() => {
    setStatus("active");
    const warn = fixed ? setTimeout(() => setStatus("warning"), 10_000) : undefined;
    const expire = setTimeout(() => setStatus("expired"), 15_000);
    return () => { if (warn) clearTimeout(warn); clearTimeout(expire); };
  }, [fixed]);
  return (
    <p className="lab-forms-session" data-a11y-scenario={id}>
      {status === "active" && "Session active."}
      {status === "warning" && "Your session will expire in 5 seconds."}
      {status === "expired" && "Session expired."}
    </p>
  );
}

export default function FormsLab() {
  return (
    <>
      <h1>Form Specimens</h1>
      <p>Isolated form defects: labeling, grouping, disappearing instructions, vague or unannounced errors, unclear required fields, and a silent session timeout.</p>
      <Specimen id="input-missing-label-forms-lab">
        <Field scenario="input-missing-label-forms-lab" id="lab-forms-email" label="Email address" defect="missing" type="email" />
      </Specimen>
      <Specimen id="select-missing-label-forms-lab"><SelectMissingLabel /></Specimen>
      <Specimen id="label-for-mismatch-forms-lab">
        <Field scenario="label-for-mismatch-forms-lab" id="lab-forms-lastname" label="Last name" defect="for-mismatch" />
      </Specimen>
      <Specimen id="fieldset-missing-forms-lab"><FieldsetMissing /></Specimen>
      <Specimen id="form-ungrouped-controls-forms-lab"><UngroupedControls /></Specimen>
      <Specimen id="form-instructions-disappear-forms-lab"><InstructionsDisappear /></Specimen>
      <Specimen id="form-no-structure-forms-lab"><NoStructure /></Specimen>
      <Specimen id="form-vague-errors-forms-lab"><VagueErrors /></Specimen>
      <Specimen id="sr-errors-not-announced-forms-lab"><ErrorsNotAnnounced /></Specimen>
      <Specimen id="form-required-unclear-forms-lab"><RequiredUnclear /></Specimen>
      <Specimen id="color-only-required-forms-lab"><ColorOnlyRequired /></Specimen>
      <Specimen id="form-timeout-no-warning-forms-lab"><TimeoutNoWarning /></Specimen>
    </>
  );
}
