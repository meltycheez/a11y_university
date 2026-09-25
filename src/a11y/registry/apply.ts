import type { RuleKey } from "../rules";
import type { ScenarioDef } from "./types";

type Mech = ScenarioDef["mechanism"];
type Sev = NonNullable<ScenarioDef["severity"]>;
const d = (id: string, rule: RuleKey, component: string, mechanism: Mech, severity: Sev, title: string, description: string, fixDescription: string): ScenarioDef =>
  ({ id: `apply-${id}-001`, rule, pages: ["/admissions/apply"], component, mechanism, severity, title, description, fixDescription });

// /admissions/apply: five-step Application for Admission (plan 06 #8). Tier H.
export const applyScenarios: ScenarioDef[] = [
  // ---------- Errors ----------
  d("dob-split", "input-missing-label", "ApplyDateParts", "markup", "critical",
    "Dates are three unlabeled boxes", "Date of birth and graduation date are each three bare inputs (month, day, year) after one line of text; none of them has a label.", "Each date is a fieldset with a legend and Month, Day and Year labels."),
  d("progress-label", "aria-broken-reference", "ApplyProgress", "markup", "serious",
    "Progress list is labelled by a missing id", "The step list has aria-labelledby=\"apply-progress-title\", but no element has that id.", "Names the list with aria-label=\"Application progress\"."),
  d("gpa-for", "label-for-mismatch", "ApplyAcademic", "markup", "critical",
    "GPA label points at the wrong id", "The \"Cumulative GPA\" label has for=\"gpa-input\" but the input's id is \"gpa\".", "The label's for matches the input."),

  // ---------- Alerts ----------
  d("term-fieldset", "fieldset-missing", "ApplyProgram", "markup", "moderate",
    "Entry term radios are not grouped", "The entry term radio buttons follow a bold paragraph with no fieldset or legend.", "Wraps them in a fieldset with the legend \"Entry term\"."),
  d("back-link", "link-javascript", "ApplyNav", "markup", "moderate",
    "\"Back\" is an href=\"#\" link", "The Back control is <a href=\"#\"> with a click handler instead of a button.", "Uses a <button>."),
  d("review-heading-skip", "heading-skipped", "ApplyReview", "markup", "moderate",
    "Review sections jump from h2 to h4", "On the review step, the section summaries are <h4> under the step's <h2>.", "Uses <h3>."),

  // ---------- Manual ----------
  d("stepper-state", "sr-visual-only-state", "ApplyProgress", "markup", "serious",
    "Current step shown only by color", "The progress list shows the current and finished steps with a filled circle; nothing in the markup says which step you are on.", "Adds aria-current=\"step\" and hidden \"completed\" / \"current step\" text."),
  d("step-focus", "focus-lost-on-update", "ApplyForm", "behavior", "serious",
    "Next and Back leave focus behind", "Changing steps replaces the form, so focus is lost and screen readers aren't told a new step loaded.", "Focus moves to the new step's heading."),
  d("no-structure", "form-no-structure", "ApplyPersonal", "markup", "moderate",
    "Personal information is one long ungrouped list", "Step 1 has 14 fields in a single column with no headings or fieldsets.", "Groups the fields under Legal name, Contact, Mailing address and Citizenship fieldsets."),
  d("required-color", "color-only-required", "ApplyForm", "markup", "serious",
    "Required fields shown only in red", "Required labels are red; the only explanation is \"Required fields are in red\".", "Adds \"(required)\" to labels and the required attribute."),
  d("errors-not-announced", "sr-errors-not-announced", "ApplyForm", "behavior", "serious",
    "Step errors are not announced", "Errors appear next to fields when Next is pressed, but nothing is announced and focus stays on Next.", "An error summary with role=\"alert\" receives focus and links to each field; fields get aria-invalid and aria-describedby."),
  d("errors-vague", "form-vague-errors", "ApplyForm", "behavior", "moderate",
    "Errors say only \"Invalid\"", "Every error message reads \"Invalid\".", "Messages say what's wrong and how to fix it."),
  d("major-dropdown", "kbd-dropdown-inoperable", "Dropdown", "behavior", "critical",
    "First-choice major menu needs a mouse", "The major picker is a styled <div> list: it can't be reached or operated with the keyboard.", "Uses a labeled native <select>."),
  d("essay-instructions", "form-instructions-disappear", "ApplyEssays", "markup", "serious",
    "Essay prompts are placeholders", "Each essay's prompt and word limit are placeholder text, which vanishes as soon as you start typing.", "Shows the prompt above the box and links it with aria-describedby."),
  d("submit-status", "sr-status-not-announced", "ApplyReview", "behavior", "moderate",
    "Submission result is not announced", "\"Submitting…\" and the confirmation replace the review silently.", "Uses a role=\"status\" region and moves focus to the confirmation heading."),
];
