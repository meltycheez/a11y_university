import type { RuleKey } from "../rules";
import type { ScenarioDef } from "./types";

type Mech = ScenarioDef["mechanism"];
type Sev = NonNullable<ScenarioDef["severity"]>;
const d = (id: string, rule: RuleKey, mechanism: Mech, severity: Sev, title: string, description: string, fixDescription: string): ScenarioDef =>
  ({ id, rule, pages: ["/accessibility-lab/aria"], component: "AriaLab", mechanism, severity, title, description, fixDescription });

export const labAriaScenarios: ScenarioDef[] = [
  d("broken-reference-aria-lab", "aria-broken-reference", "markup", "serious",
    "\"More info\" button references a missing id",
    "The button's aria-describedby points at an id that doesn't exist, so its extra description is never read.",
    "Adds the referenced element with a matching id."),
  d("invalid-attr-aria-lab", "aria-invalid-attr", "markup", "moderate",
    "Search field uses a misspelled aria attribute",
    "The search input has aria-lable instead of aria-label, so it has no accessible name. The same family of defect covers a misused or invalid role value.",
    "Corrects the attribute name to aria-label."),
  d("invalid-value-aria-lab", "aria-invalid-value", "markup", "serious",
    "Checkmark uses aria-hidden=\"yes\"",
    "The deposit-received checkmark has aria-hidden=\"yes\", which is not a valid value, so it isn't hidden from assistive technology.",
    "Uses aria-hidden=\"true\"."),
  d("required-children-aria-lab", "aria-required-children", "markup", "serious",
    "Sample tabs are missing required tab roles",
    "The tablist wraps plain buttons with no role=\"tab\", so its required children are missing.",
    "Adds role=\"tab\" to each tab button."),
  d("required-parent-aria-lab", "aria-required-parent", "markup", "moderate",
    "An orphaned tab has no tablist parent",
    "A role=\"tab\" element sits on its own with no role=\"tablist\" ancestor, so its role has no meaning.",
    "Wraps it in a role=\"tablist\" container."),
  d("hidden-focusable-aria-lab", "aria-hidden-focusable", "markup", "serious",
    "A focusable button sits inside aria-hidden",
    "A real, focusable button is wrapped in aria-hidden=\"true\", so it's hidden from screen readers but keyboard users can still tab into it.",
    "Removes aria-hidden from the wrapper."),
  d("live-region-aria-lab", "sr-results-no-live-region", "behavior", "moderate",
    "Search result count isn't announced",
    "Clicking Search updates a result count in the page, but nothing announces the change to screen reader users.",
    "Wraps the result count in a role=\"status\" live region."),
];
