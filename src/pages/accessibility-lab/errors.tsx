// Accessibility Lab: one isolated specimen per error rule (plan 08). Chrome around each specimen is
// accessible by construction; only the specimen-live markup carries the registered defect.
import { Field, Heading, IconButton } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Tabs } from "~/components/Tabs";
import { Specimen } from "./_Specimen";

export { inventoryMeta as meta } from "~/routes/meta";

const placeholder = `${import.meta.env.BASE_URL}favicon.svg`;

function ImgMissingAlt() {
  const id = "img-missing-alt-errors-lab";
  const fixed = useScenario(id);
  return <img src={placeholder} width={96} height={64} alt={fixed ? "A redwood grove on campus" : undefined} data-a11y-scenario={id} />;
}

function ImgEmptyAltMeaningful() {
  const id = "img-empty-alt-meaningful-errors-lab";
  const fixed = useScenario(id);
  return <img src={placeholder} width={96} height={64} alt={fixed ? "Fall enrollment reached a record 14,200 students" : ""} data-a11y-scenario={id} />;
}

function SelectMissingLabel() {
  const id = "select-missing-label-errors-lab";
  const fixed = useScenario(id);
  const select = (
    <select id="lab-term-select">
      <option>Fall 2027</option>
      <option>Spring 2028</option>
    </select>
  );
  return (
    <div className="field" data-a11y-scenario={id}>
      {fixed ? <label htmlFor="lab-term-select">Preferred term</label> : <span className="field-label">Preferred term</span>}
      {select}
    </div>
  );
}

function LinkEmpty() {
  const id = "link-empty-errors-lab";
  const fixed = useScenario(id);
  return (
    <a href="#" className="icon-button" data-a11y-scenario={id}>
      <span aria-hidden="true">&#9998;</span>
      {fixed && <span className="visually-hidden">Edit this profile</span>}
    </a>
  );
}

function HtmlLangCodeSample() {
  const id = "html-lang-missing-errors-lab";
  const fixed = useScenario(id);
  return (
    <>
      <pre><code>{fixed ? "<html lang=\"en\">" : "<html>"}</code></pre>
      <p>This is document-level: the Accessibility Lab always declares <code>lang</code> itself, so it's shown here as a code sample rather than a live toggle. The real scenario ships on every university page.</p>
    </>
  );
}

function PageTitleCodeSample() {
  const id = "page-title-missing-errors-lab";
  const fixed = useScenario(id);
  return (
    <>
      <pre><code>{fixed ? "<title>Course Search</title>" : "<title></title>"}</code></pre>
      <p>This is document-level: a page can only have one real &lt;title&gt;, so it's shown here as a code sample rather than a live toggle.</p>
    </>
  );
}

function DuplicateId() {
  const id = "duplicate-id-errors-lab";
  const fixed = useScenario(id);
  return (
    <div data-a11y-scenario={id}>
      <section id={fixed ? "lab-dup-a" : "lab-dup"}><h4>First section</h4><p>Content A.</p></section>
      <section id={fixed ? "lab-dup-b" : "lab-dup"}><h4>Second section</h4><p>Content B.</p></section>
    </div>
  );
}

function AriaBrokenReference() {
  const id = "aria-broken-reference-errors-lab";
  const fixed = useScenario(id);
  return (
    <div data-a11y-scenario={id}>
      <button type="button" aria-describedby="lab-ref-target">Delete account</button>
      {fixed && <span id="lab-ref-target">This can't be undone.</span>}
    </div>
  );
}

function AriaInvalidAttr() {
  const id = "aria-invalid-attr-errors-lab";
  const fixed = useScenario(id);
  const badAttr = { "aria-lable": "Search" } as Record<string, string>;
  return (
    <input type="search" placeholder="Search the site" data-a11y-scenario={id} {...(fixed ? { "aria-label": "Search" } : badAttr)} />
  );
}

function AriaInvalidValue() {
  const id = "aria-invalid-value-errors-lab";
  const fixed = useScenario(id);
  return <span aria-hidden={(fixed ? "true" : "yes") as "true"} data-a11y-scenario={id}>&#10003;</span>;
}

function IframeMissingTitle() {
  const id = "iframe-missing-title-errors-lab";
  const fixed = useScenario(id);
  return <iframe src="about:blank" width={320} height={180} title={fixed ? "Campus tour video" : undefined} data-a11y-scenario={id} />;
}

function TableHeaderAssociation() {
  const id = "table-header-association-errors-lab";
  const fixed = useScenario(id);
  return (
    <table className="data-table" data-a11y-scenario={id}>
      <caption>Course enrollment by term</caption>
      <thead>
        <tr><th scope="col" id="lab-th-term">Term</th><th scope="col" id="lab-th-count">Enrolled</th></tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" id="lab-th-row">Fall 2027</th>
          <td headers={fixed ? "lab-th-row lab-th-count" : "wrong-col wrong-row"}>412</td>
        </tr>
      </tbody>
    </table>
  );
}

function AriaRequiredParent() {
  const id = "aria-required-parent-errors-lab";
  const fixed = useScenario(id);
  const tab = <div role="tab" data-a11y-scenario={id}>Standalone tab</div>;
  return fixed ? <div role="tablist">{tab}</div> : tab;
}

function InputImageNoAlt() {
  const id = "input-image-no-alt-errors-lab";
  const fixed = useScenario(id);
  return <input type="image" src={placeholder} width={40} height={40} alt={fixed ? "Submit search" : undefined} data-a11y-scenario={id} />;
}

function ListStructure() {
  const id = "list-structure-errors-lab";
  const fixed = useScenario(id);
  const items = (
    <>
      <li>Submit your application</li>
      <li>Send transcripts</li>
      <li>Schedule an interview</li>
    </>
  );
  return fixed ? <ol data-a11y-scenario={id}>{items}</ol> : <div data-a11y-scenario={id}>{items}</div>;
}

function AriaHiddenFocusable() {
  const id = "aria-hidden-focusable-errors-lab";
  const fixed = useScenario(id);
  return (
    <div aria-hidden={fixed ? undefined : true} data-a11y-scenario={id}>
      <button type="button">Hidden but focusable</button>
    </div>
  );
}

export default function ErrorsLab() {
  return (
    <>
      <h1>Error Specimens</h1>
      <p>One isolated specimen per rule in the Fix Errors category. Each section's caption names the scenario id, the expected tool finding, and what the fix changes.</p>

      <Specimen id="img-missing-alt-errors-lab"><ImgMissingAlt /></Specimen>
      <Specimen id="img-empty-alt-meaningful-errors-lab"><ImgEmptyAltMeaningful /></Specimen>
      <Specimen id="input-missing-label-errors-lab">
        <Field scenario="input-missing-label-errors-lab" id="lab-email" label="Email address" defect="missing" />
      </Specimen>
      <Specimen id="select-missing-label-errors-lab"><SelectMissingLabel /></Specimen>
      <Specimen id="button-empty-errors-lab">
        <IconButton scenario="button-empty-errors-lab" label="Close" icon={<span>&times;</span>} />
      </Specimen>
      <Specimen id="link-empty-errors-lab"><LinkEmpty /></Specimen>
      <Specimen id="html-lang-missing-errors-lab"><HtmlLangCodeSample /></Specimen>
      <Specimen id="page-title-missing-errors-lab"><PageTitleCodeSample /></Specimen>
      <Specimen id="heading-empty-errors-lab">
        <Heading scenario="heading-empty-errors-lab" level={3} defect="empty">Section title</Heading>
      </Specimen>
      <Specimen id="duplicate-id-errors-lab"><DuplicateId /></Specimen>
      <Specimen id="aria-broken-reference-errors-lab"><AriaBrokenReference /></Specimen>
      <Specimen id="aria-invalid-attr-errors-lab"><AriaInvalidAttr /></Specimen>
      <Specimen id="aria-invalid-value-errors-lab"><AriaInvalidValue /></Specimen>
      <Specimen id="iframe-missing-title-errors-lab"><IframeMissingTitle /></Specimen>
      <Specimen id="table-header-association-errors-lab"><TableHeaderAssociation /></Specimen>
      <Specimen id="aria-required-children-errors-lab">
        <Tabs
          scenario="aria-required-children-errors-lab"
          defect="bad-children"
          label="Sample tabs"
          tabs={[{ label: "One", content: <p>One</p> }, { label: "Two", content: <p>Two</p> }]}
        />
      </Specimen>
      <Specimen id="aria-required-parent-errors-lab"><AriaRequiredParent /></Specimen>
      <Specimen id="svg-control-unlabeled-errors-lab">
        <IconButton
          scenario="svg-control-unlabeled-errors-lab"
          label="Print this page"
          icon={<svg width="16" height="16" aria-hidden="true"><rect width="16" height="16" /></svg>}
        />
      </Specimen>
      <Specimen id="input-image-no-alt-errors-lab"><InputImageNoAlt /></Specimen>
      <Specimen id="list-structure-errors-lab"><ListStructure /></Specimen>
      <Specimen id="aria-hidden-focusable-errors-lab"><AriaHiddenFocusable /></Specimen>
      <Specimen id="label-for-mismatch-errors-lab">
        <Field scenario="label-for-mismatch-errors-lab" id="lab-lastname" label="Last name" defect="for-mismatch" />
      </Specimen>
    </>
  );
}
