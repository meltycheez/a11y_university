// Accessibility Lab: one isolated specimen per alert rule (plan 08). Chrome around each specimen is
// accessible by construction; only the specimen-live markup carries the registered defect.
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Field, Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Specimen } from "./_Specimen";

export { inventoryMeta as meta } from "~/routes/meta";

const placeholder = `${import.meta.env.BASE_URL}favicon.svg`;
const LONG_ALT = "This photograph shows the main quad of Redwood State University on a clear autumn afternoon, with students walking between classes past the tall coast redwood trees that give the campus its name, the historic clock tower visible in the background against a blue sky, and the newly renovated student union building to the right of the frame, its glass entrance reflecting the surrounding tree canopy.";

function AltSuspicious() {
  const id = "alt-suspicious-alerts-lab";
  const fixed = useScenario(id);
  return (
    <figure>
      <img src={placeholder} width={96} height={64} alt={fixed ? "" : "IMG_04213.jpg"} data-a11y-scenario={id} />
      <figcaption>Students gather on the quad between classes.</figcaption>
    </figure>
  );
}

function AltRedundant() {
  const id = "alt-redundant-alerts-lab";
  const fixed = useScenario(id);
  const caption = "The library reading room, open until midnight during finals week.";
  return (
    <figure>
      <img src={placeholder} width={96} height={64} alt={fixed ? "" : caption} data-a11y-scenario={id} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function AltLong() {
  const id = "alt-long-alerts-lab";
  const fixed = useScenario(id);
  return (
    <figure>
      <img src={placeholder} width={96} height={64} alt={fixed ? "" : LONG_ALT} data-a11y-scenario={id} />
      <figcaption>The quad in autumn.</figcaption>
    </figure>
  );
}

function ImgTitleAttr() {
  const id = "img-title-attr-alerts-lab";
  const fixed = useScenario(id);
  return <img src={placeholder} width={96} height={64} alt="Redwood grove" title={fixed ? undefined : "Redwood grove"} data-a11y-scenario={id} />;
}

function LinkRedundant() {
  const id = "link-redundant-alerts-lab";
  const fixed = useScenario(id);
  return (
    <p data-a11y-scenario={id}>
      <Link to="/academics/calendar">2027-28 academic calendar</Link>
      {!fixed && <> · <Link to="/academics/calendar">2027-28 academic calendar</Link></>}
    </p>
  );
}

function TableNoCaption() {
  const id = "table-no-caption-alerts-lab";
  const fixed = useScenario(id);
  return (
    <table className="data-table" data-a11y-scenario={id}>
      {fixed && <caption>Fall 2027 add/drop deadlines</caption>}
      <thead><tr><th scope="col">Action</th><th scope="col">Deadline</th></tr></thead>
      <tbody><tr><td>Add a course</td><td>Sept 4</td></tr></tbody>
    </table>
  );
}

function TableLayout() {
  const id = "table-layout-alerts-lab";
  const fixed = useScenario(id);
  if (fixed) {
    return (
      <div className="lab-layout-grid" data-a11y-scenario={id}>
        <div>Registrar</div><div>Room 210, Founders Hall</div>
        <div>Advising</div><div>Room 118, Founders Hall</div>
      </div>
    );
  }
  return (
    <table data-a11y-scenario={id}>
      <tbody>
        <tr><td>Registrar</td><td>Room 210, Founders Hall</td></tr>
        <tr><td>Advising</td><td>Room 118, Founders Hall</td></tr>
      </tbody>
    </table>
  );
}

function LinkNearbyDuplicate() {
  const id = "link-nearby-duplicate-alerts-lab";
  const fixed = useScenario(id);
  return (
    <p data-a11y-scenario={id}>
      <Link to="/admissions">{fixed ? "Learn more about admissions" : "Learn more"}</Link>
      {" · "}
      <Link to="/financial-aid">{fixed ? "Learn more about aid" : "Learn more"}</Link>
    </p>
  );
}

function FieldsetMissing() {
  const id = "fieldset-missing-alerts-lab";
  const fixed = useScenario(id);
  const options = (
    <>
      <p><label><input type="radio" name="lab-campus" defaultChecked /> Arcadia Falls</label></p>
      <p><label><input type="radio" name="lab-campus" /> North Coast</label></p>
      <p><label><input type="radio" name="lab-campus" /> Online</label></p>
    </>
  );
  return fixed
    ? <fieldset data-a11y-scenario={id}><legend>Campus</legend>{options}</fieldset>
    : <div data-a11y-scenario={id}>{options}</div>;
}

function EventHandlerDevice() {
  const id = "event-handler-device-alerts-lab";
  const fixed = useScenario(id);
  const [open, setOpen] = useState(false);
  return (
    <span
      data-a11y-scenario={id}
      onMouseOver={() => setOpen(true)}
      onMouseOut={() => setOpen(false)}
      onFocus={fixed ? () => setOpen(true) : undefined}
      onBlur={fixed ? () => setOpen(false) : undefined}
      tabIndex={fixed ? 0 : undefined}
    >
      Credit hour &#9432;
      {open && <span role="tooltip"> One credit hour is about 750 minutes of instruction.</span>}
    </span>
  );
}

function UnderlineNonLink() {
  const id = "underline-non-link-alerts-lab";
  const fixed = useScenario(id);
  return <p data-a11y-scenario={id}>{fixed ? <strong>emphasized text</strong> : <u>emphasized text</u>} needs a closer look.</p>;
}

function LinkJavascript() {
  const id = "link-javascript-alerts-lab";
  const fixed = useScenario(id);
  const navigate = useNavigate();
  return fixed
    ? <Link to="/accessibility-lab/alerts" data-a11y-scenario={id}>Refresh this page</Link>
    : <a href="#" data-a11y-scenario={id} onClick={(e) => { e.preventDefault(); navigate("/accessibility-lab/alerts"); }}>Refresh this page</a>;
}

export default function AlertsLab() {
  return (
    <>
      <h1>Alert Specimens</h1>
      <p>One isolated specimen per rule in the Fix Alerts category. Each section's caption names the scenario id, the expected tool finding, and what the fix changes.</p>

      <Specimen id="alt-suspicious-alerts-lab"><AltSuspicious /></Specimen>
      <Specimen id="alt-redundant-alerts-lab"><AltRedundant /></Specimen>
      <Specimen id="alt-long-alerts-lab"><AltLong /></Specimen>
      <Specimen id="img-title-attr-alerts-lab"><ImgTitleAttr /></Specimen>
      <Specimen id="link-redundant-alerts-lab"><LinkRedundant /></Specimen>
      <Specimen id="link-generic-alerts-lab">
        <SmartLink scenario="link-generic-alerts-lab" to="/academics/programs" defect="Click here">Degree programs</SmartLink>
      </Specimen>
      <Specimen id="link-document-alerts-lab">
        <SmartLink scenario="link-document-alerts-lab" to="/documents/sample.pdf" fileInfo="PDF, 240 KB">Course catalog addendum</SmartLink>
      </Specimen>
      <Specimen id="link-new-window-alerts-lab">
        <SmartLink scenario="link-new-window-alerts-lab" to="https://example.org" newWindow>Partner site</SmartLink>
      </Specimen>
      <Specimen id="underline-non-link-alerts-lab"><UnderlineNonLink /></Specimen>
      <Specimen id="heading-skipped-alerts-lab">
        <Heading scenario="heading-skipped-alerts-lab" level={2} defect="skipped" defectLevel={4}>Program highlights</Heading>
      </Specimen>
      <Specimen id="heading-possible-alerts-lab">
        <Heading scenario="heading-possible-alerts-lab" level={2} defect="fake">Before you apply</Heading>
      </Specimen>
      <Specimen id="text-small-alerts-lab">
        <TextSmall />
      </Specimen>
      <Specimen id="text-justified-alerts-lab">
        <TextJustified />
      </Specimen>
      <Specimen id="event-handler-device-alerts-lab"><EventHandlerDevice /></Specimen>
      <Specimen id="label-orphaned-alerts-lab">
        <Field scenario="label-orphaned-alerts-lab" id="lab-phone" label="Phone number" defect="orphaned" />
      </Specimen>
      <Specimen id="placeholder-as-label-alerts-lab">
        <Field scenario="placeholder-as-label-alerts-lab" id="lab-zip" label="ZIP code" defect="placeholder" />
      </Specimen>
      <Specimen id="table-no-caption-alerts-lab"><TableNoCaption /></Specimen>
      <Specimen id="table-layout-alerts-lab"><TableLayout /></Specimen>
      <Specimen id="title-redundant-alerts-lab">
        <SmartLink scenario="title-redundant-alerts-lab" to="/library" defectTitle="Sequoia Library">Sequoia Library</SmartLink>
      </Specimen>
      <Specimen id="link-nearby-duplicate-alerts-lab"><LinkNearbyDuplicate /></Specimen>
      <Specimen id="fieldset-missing-alerts-lab"><FieldsetMissing /></Specimen>
      <Specimen id="link-javascript-alerts-lab"><LinkJavascript /></Specimen>
    </>
  );
}

function TextSmall() {
  const id = "text-small-alerts-lab";
  useScenario(id);
  return <p className="lab-text-small" data-a11y-scenario={id}>Sample body copy at reduced size.</p>;
}

function TextJustified() {
  const id = "text-justified-alerts-lab";
  useScenario(id);
  return (
    <p className="lab-text-justified" data-a11y-scenario={id}>
      Redwood State's writing center offers free one-on-one appointments for any assignment, at any stage. Drop-in hours run every weekday afternoon in Founders Hall.
    </p>
  );
}
