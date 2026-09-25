import { useState } from "react";
import { Tabs } from "~/components/Tabs";
import { useScenario } from "~/a11y/useScenario";
import { Specimen } from "./_Specimen";

export { inventoryMeta as meta } from "~/routes/meta";

function BrokenReferenceSpecimen() {
  const id = "broken-reference-aria-lab";
  const fixed = useScenario(id);
  return (
    <div data-a11y-scenario={id}>
      <button type="button" aria-describedby={fixed ? "lab-aria-ref-target" : "lab-aria-ref-missing"}>More info</button>
      {fixed && <span id="lab-aria-ref-target" className="visually-hidden">Opens details about the redwood restoration project.</span>}
    </div>
  );
}

function InvalidAttrSpecimen() {
  const id = "invalid-attr-aria-lab";
  const fixed = useScenario(id);
  const attr: Record<string, string> = fixed ? { "aria-label": "Search" } : { "aria-lable": "Search" };
  return (
    <div data-a11y-scenario={id}>
      <input type="search" {...attr} />
    </div>
  );
}

function InvalidValueSpecimen() {
  const id = "invalid-value-aria-lab";
  const fixed = useScenario(id);
  return (
    <p data-a11y-scenario={id}>
      Housing deposit received <span aria-hidden={(fixed ? "true" : "yes") as unknown as boolean}>✓</span>
    </p>
  );
}

function RequiredParentSpecimen() {
  const id = "required-parent-aria-lab";
  const fixed = useScenario(id);
  const tab = <div role="tab" data-a11y-scenario={id}>Orphaned tab</div>;
  return fixed ? <div role="tablist">{tab}</div> : tab;
}

function HiddenFocusableSpecimen() {
  const id = "hidden-focusable-aria-lab";
  const fixed = useScenario(id);
  return (
    <div aria-hidden={fixed ? undefined : true} data-a11y-scenario={id}>
      <button type="button">Hidden but still focusable</button>
    </div>
  );
}

function LiveRegionSpecimen() {
  const id = "live-region-aria-lab";
  const fixed = useScenario(id);
  const [count, setCount] = useState<number | null>(null);
  return (
    <div data-a11y-scenario={id}>
      <button type="button" onClick={() => setCount((c) => (c ?? 0) + 1)}>Search</button>
      <p role={fixed ? "status" : undefined}>{count !== null ? `${count} results found` : "No search run yet."}</p>
    </div>
  );
}

export default function AriaLab() {
  return (
    <>
      <h1>ARIA Specimens</h1>
      <p>
        Each specimen isolates one ARIA misuse: a broken reference, an invalid attribute or value, a required parent or child missing, a
        hidden-but-focusable control, or an unannounced live region.
      </p>
      <Specimen id="broken-reference-aria-lab"><BrokenReferenceSpecimen /></Specimen>
      <Specimen id="invalid-attr-aria-lab"><InvalidAttrSpecimen /></Specimen>
      <Specimen id="invalid-value-aria-lab"><InvalidValueSpecimen /></Specimen>
      <Specimen id="required-children-aria-lab">
        <Tabs
          label="Sample tabs"
          scenario="required-children-aria-lab"
          defect="bad-children"
          tabs={[{ label: "One", content: <p>One</p> }, { label: "Two", content: <p>Two</p> }]}
        />
      </Specimen>
      <Specimen id="required-parent-aria-lab"><RequiredParentSpecimen /></Specimen>
      <Specimen id="hidden-focusable-aria-lab"><HiddenFocusableSpecimen /></Specimen>
      <Specimen id="live-region-aria-lab"><LiveRegionSpecimen /></Specimen>
    </>
  );
}
