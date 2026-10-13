import type { RuleKey } from "../rules";
import type { ScenarioDef } from "./types";

type Mech = ScenarioDef["mechanism"];
type Sev = NonNullable<ScenarioDef["severity"]>;
const d = (id: string, rule: RuleKey, component: string, mechanism: Mech, severity: Sev, title: string, description: string, fixDescription: string): ScenarioDef =>
  ({ id: `apply-${id}-001`, rule, pages: ["/admissions/apply"], component, mechanism, severity, title, description, fixDescription });

// /admissions/apply: two-step Application for Admission (plan 06 #8; two steps since plan 12). Tier H.
// Also the screen reader CTF (plan 11 §5): the "CTF" entries below exist to make the form miserable, but still
// possible, to complete with a screen reader.
export const applyScenarios: ScenarioDef[] = [
  // ---------- Errors ----------
  d("progress-label", "aria-broken-reference", "ApplyProgress", "markup", "serious",
    "Progress list is labelled by a missing id", "The step list has aria-labelledby=\"apply-progress-title\", but no element has that id.", "Names the list with aria-label=\"Application progress\"."),
  // CTF
  // Both fields still have a label, so no tool flags it: only a person notices the names are swapped.
  { ...d("name-mismatch", "label-for-mismatch", "ApplyPersonal", "markup", "critical",
    "City and State labels are swapped", "The City label has for=\"state\" and the State label has for=\"city\", so each field is announced with the other's name.", "Each label points at its own field."),
    detectedBy: { manualOnly: true } },
  d("next-name", "button-empty", "ApplyNav", "markup", "critical",
    "Next and Submit are unnamed icon buttons", "The step's main button shows only an arrow (or a check mark on the last step) and has no accessible name.", "The button reads \"Next\" or \"Submit application\"."),
  d("certify-hidden", "aria-hidden-focusable", "ApplyReview", "markup", "serious",
    "Certify checkbox is inside aria-hidden", "The required \"I certify…\" checkbox sits in an aria-hidden=\"true\" wrapper: it still takes focus but screen readers say nothing useful about it.", "Removes aria-hidden."),
  // The aria-label still names the field, so no tool flags the broken label.
  { ...d("gpa-for", "label-for-mismatch", "ApplyAcademic", "markup", "serious",
    "GPA label points at the wrong id", "The \"Cumulative GPA\" label has for=\"gpa-input\" but the input's id is \"gpa\"; the field is named only by aria-label=\"gpa_cum\".", "The label's for matches the input and the aria-label is removed."),
    detectedBy: { manualOnly: true } },

  // ---------- Alerts ----------
  d("dob-split", "placeholder-as-label", "ApplyDateParts", "markup", "serious",
    "Date of birth is three boxes named by placeholders", "Date of birth is three inputs after one line of text, named only by MM, DD and YYYY placeholders that vanish as you type.", "The date is a fieldset with a legend and Month, Day and Year labels."),
  d("citizenship-radios", "fieldset-missing", "ApplyPersonal", "markup", "serious",
    "Citizenship radio buttons are named by codes", "Each citizenship option is a radio button with aria-label codes like \"CIT_US\", followed by plain text, with no <label> and no group.", "A fieldset with the legend \"Citizenship status\" and a <label> for each option."),
  d("term-fieldset", "fieldset-missing", "ApplyProgram", "markup", "moderate",
    "Entry term radios are not grouped", "The entry term radio buttons follow a bold paragraph with no fieldset or legend.", "Wraps them in a fieldset with the legend \"Entry term\"."),
  d("back-link", "link-javascript", "ApplyNav", "markup", "moderate",
    "\"Back\" is an href=\"#\" link", "The Back control is <a href=\"#\"> with a click handler instead of a button.", "Uses a <button>."),
  // CTF
  d("code-image-alt", "alt-suspicious", "ApplyProgram", "markup", "serious",
    "Referral code image's alt is a file name", "The image that shows the application referral code has alt=\"image123.png\". The code only reaches screen readers through the referral field's aria-label (\"ref_code: type R S U 7 Q 4 K\"), which overrides the visible label.", "The alt text gives the code: \"Your application referral code: RSU-7Q4K\", and the field uses its visible label."),
  d("crest-alt", "alt-long", "ApplyForm", "markup", "minor",
    "Decorative crest has a 400-character alt", "A decorative university crest above the form has a very long alt text describing its history, read before every visit to the form.", "The crest is decorative: alt=\"\"."),
  d("fake-heading", "heading-possible", "ApplyForm", "markup", "moderate",
    "Step titles are bold text, not headings", "\"Step 1 of 2: About you\" and the other step title are bold <div>s, so heading navigation can't find them.", "Each step title is an <h2>."),
  d("review-heading-skip", "heading-skipped", "ApplyReview", "markup", "moderate",
    "Review section jumps from h2 to h4", "On step 2, the summary of your answers is an <h4> under the step's <h2>.", "Uses <h3>."),

  // ---------- Manual ----------
  d("stepper-state", "sr-visual-only-state", "ApplyProgress", "markup", "serious",
    "Current step shown only by color", "The progress list shows the current and finished steps with a filled circle; nothing in the markup says which step you are on.", "Adds aria-current=\"step\" and hidden \"completed\" / \"current step\" text."),
  d("step-focus", "focus-lost-on-update", "ApplyForm", "behavior", "serious",
    "Next and Back leave focus behind", "Changing steps replaces the form, so focus is lost and screen readers aren't told a new step loaded.", "Focus moves to the new step's heading."),
  d("no-structure", "form-no-structure", "ApplyPersonal", "markup", "moderate",
    "About you is one long ungrouped list", "Step 1 has 8 inputs and 4 radio buttons in a single column with no headings or fieldsets.", "Groups the fields under Name and date of birth, Contact information and Citizenship fieldsets."),
  d("required-color", "color-only-required", "ApplyForm", "markup", "serious",
    "Required fields shown only in red", "Required labels are red; the only explanation is \"Required fields are in red\".", "Adds \"(required)\" to labels and the required attribute."),
  d("errors-not-announced", "sr-errors-not-announced", "ApplyForm", "behavior", "serious",
    "Step errors are only half announced", "When Next finds errors, focus lands on a line that says how many problems there are, then jumps to the first problem field a few seconds later. The fields aren't marked invalid, their error text isn't connected to them, and there's no list of what's wrong.", "An error summary with role=\"alert\" receives focus and links to each field; fields get aria-invalid and aria-describedby."),
  d("errors-vague", "form-vague-errors", "ApplyForm", "behavior", "moderate",
    "Errors say only \"Invalid\"", "Every error message reads \"Invalid\".", "Messages say what's wrong and how to fix it."),
  d("major-dropdown", "kbd-dropdown-inoperable", "Dropdown", "behavior", "critical",
    "First-choice major menu needs a mouse", "The major picker is a styled <div> list: it can't be reached or operated with the keyboard.", "Uses a labeled native <select>."),
  d("essay-instructions", "form-instructions-disappear", "ApplyEssays", "markup", "serious",
    "Short answer prompt is a placeholder", "The short answer's prompt and word limit are placeholder text, which vanishes as soon as you start typing.", "Shows the prompt above the box and links it with aria-describedby."),
  // CTF
  d("tab-order", "focus-order-mismatch", "ApplyPersonal", "behavior", "serious",
    "Tab order jumps around the form", "On step 1 a script reorders Tab between the fields: Legal first name → City → Legal last name → Email → Year of birth → Month of birth → Day of birth. Focus enters and leaves the form normally.", "Tab follows the visual order of the fields."),
  d("aria-label-junk", "label-in-name-mismatch", "ApplyForm", "markup", "serious",
    "Email announces a database name instead of its label", "The Email field has aria-label=\"email_addr\", which overrides its visible label.", "Removes the aria-label override, so the visible label is used."),
  d("live-spam", "sr-live-region-noisy", "ApplyForm", "behavior", "serious",
    "Autosave interrupts every minute", "An assertive live region announces \"Draft saved at …\" every minute, interrupting whatever the screen reader was reading.", "The autosave note is plain text and is not announced."),
  d("submit-status", "sr-status-not-announced", "ApplyReview", "behavior", "moderate",
    "Submission result is not announced", "\"Submitting…\" and the confirmation replace the review silently.", "Uses a role=\"status\" region and moves focus to the confirmation heading."),
];
