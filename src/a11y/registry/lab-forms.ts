import type { RuleKey } from "../rules";
import type { ScenarioDef } from "./types";

type Mech = ScenarioDef["mechanism"];
type Sev = NonNullable<ScenarioDef["severity"]>;
const d = (id: string, rule: RuleKey, mechanism: Mech, severity: Sev, title: string, description: string, fixDescription: string): ScenarioDef =>
  ({ id, rule, pages: ["/accessibility-lab/forms"], component: "FormsLab", mechanism, severity, title, description, fixDescription });

// Form Specimens (plan 08): labeling, grouping, instructions, errors, required fields, timeouts.
export const labFormsScenarios: ScenarioDef[] = [
  d("input-missing-label-forms-lab", "input-missing-label", "markup", "critical",
    "Email field has no label", "The email input has no associated <label>, so it has no persistent accessible name.", "Adds a visible <label for>."),
  d("select-missing-label-forms-lab", "select-missing-label", "markup", "critical",
    "Term select has no label", "The \"Term\" select is a plain <select> next to unassociated text, so it has no accessible name.", "Wraps the select in a <label for>."),
  d("label-for-mismatch-forms-lab", "label-for-mismatch", "markup", "critical",
    "Last name label points at the wrong id", "The <label for> doesn't match the input's id, so the label isn't programmatically associated.", "Fixes the for attribute to match the input's id."),
  d("fieldset-missing-forms-lab", "fieldset-missing", "markup", "moderate",
    "Campus radios aren't grouped", "Three \"Which campus?\" radio buttons have no <fieldset>/<legend>, so the question isn't announced with each option.", "Wraps them in a fieldset with a legend."),
  d("form-ungrouped-controls-forms-lab", "form-ungrouped-controls", "markup", "moderate",
    "Interest checkboxes aren't grouped", "Three \"Areas of interest\" checkboxes have no fieldset, legend, or heading tying them together.", "Wraps them in a fieldset with a legend."),
  d("form-instructions-disappear-forms-lab", "form-instructions-disappear", "behavior", "moderate",
    "Password hint disappears after the first keystroke", "A password field's format hint (\"8+ characters, one number\") is removed from the DOM as soon as the user starts typing.", "Keeps the hint visible and referenced via aria-describedby."),
  d("form-no-structure-forms-lab", "form-no-structure", "markup", "moderate",
    "Long form has no section headings", "Five unrelated fields run together in one flat sequence with no headings or fieldsets to group them.", "Adds section headings (\"Contact information\", \"Preferences\") grouping related fields."),
  d("form-vague-errors-forms-lab", "form-vague-errors", "behavior", "moderate",
    "Submit shows a single generic error", "After a failed submit, the form shows only \"There was an error.\" with no indication of which field or what's wrong.", "Shows a specific message (\"Email address is required.\") tied to the field."),
  d("sr-errors-not-announced-forms-lab", "sr-errors-not-announced", "behavior", "moderate",
    "Error message isn't announced", "The error text appears in the DOM after submit, but nothing tells assistive technology it appeared.", "Adds role=\"alert\" so the message is announced immediately."),
  d("form-required-unclear-forms-lab", "form-required-unclear", "markup", "moderate",
    "Required field isn't marked required", "A note far above the fields says \"* = required,\" but the field itself has no asterisk, no \"(required)\" text, and no required attribute.", "Adds \"(required)\" text and the required/aria-required attribute directly on the field."),
  d("color-only-required-forms-lab", "color-only-required", "markup", "serious",
    "Required field shown only in red", "A required field's label is red, explained by a \"Fields in red are required\" note, with no text or attribute marking it required.", "Adds \"(required)\" text and the required attribute."),
  d("form-timeout-no-warning-forms-lab", "form-timeout-no-warning", "behavior", "moderate",
    "Session expires with no warning", "A demo session silently expires 15 seconds after load with no warning beforehand.", "Shows a warning at the 10-second mark, 5 seconds before expiring."),
];
