import type { RuleKey } from "../rules";
import type { ScenarioDef } from "./types";

type Mech = ScenarioDef["mechanism"];
type Sev = NonNullable<ScenarioDef["severity"]>;
const PAGE = "/accessibility-lab/errors";
const d = (rule: RuleKey, mechanism: Mech, severity: Sev, title: string, description: string, fixDescription: string): ScenarioDef => ({
  id: `${rule}-errors-lab`, rule, title, description, fixDescription, pages: [PAGE], component: "ErrorsLab", mechanism, severity,
});

// One isolated specimen per error rule (plan 08). Ids get an "-errors-lab" suffix so counts stay
// unambiguous from the site's own instances of the same rule.
export const labErrorsScenarios: ScenarioDef[] = [
  d("img-missing-alt", "markup", "critical",
    "Photo has no alt attribute", "The specimen photo has no alt attribute at all.", "Adds alt=\"A redwood grove on campus\"."),
  d("img-empty-alt-meaningful", "markup", "serious",
    "Meaningful photo marked decorative", "A photo that conveys real information has alt=\"\", so screen readers skip it entirely.", "Adds real alt text describing the photo."),
  d("input-missing-label", "markup", "critical",
    "Text field has no label", "The email field has no associated <label>, so it has no accessible name.", "Adds a visible <label for>."),
  d("select-missing-label", "markup", "critical",
    "Select has no label", "\"Preferred term\" is a <span> next to the select, not a <label>, so the select has no accessible name.", "Wraps the select in a <label for>."),
  d("button-empty", "markup", "serious",
    "Icon-only button has no name", "The close button contains only a × glyph with no accessible name.", "Adds visually hidden text \"Close\"."),
  d("link-empty", "markup", "serious",
    "Icon-only link has no name", "The link contains only an aria-hidden glyph, so it has no accessible name.", "Adds visually hidden link text."),
  d("html-lang-missing", "document", "serious",
    "Page language not set", "The <html> element ships with no lang attribute, so screen readers guess the pronunciation language.", "Sets lang=\"en\" on <html>."),
  d("page-title-missing", "document", "serious",
    "Page has no title", "The document <title> is empty, so the browser tab and screen reader announcement carry no page name.", "Sets a real page title."),
  d("heading-empty", "markup", "moderate",
    "Heading element has no text", "The section heading element renders with no text content.", "Gives the heading real text."),
  d("duplicate-id", "markup", "moderate",
    "Two elements share one id", "Both specimen sections use id=\"lab-dup\", so id-based references (labels, ARIA, anchors) can only ever reach one of them.", "Gives each section a unique id."),
  d("aria-broken-reference", "markup", "serious",
    "aria-describedby points at a missing id", "The button's aria-describedby references an id that doesn't exist on the page.", "Adds the referenced element with a matching id."),
  d("aria-invalid-attr", "markup", "moderate",
    "Misspelled aria attribute", "The search field carries aria-lable instead of aria-label, so assistive tech ignores it as an unknown attribute.", "Corrects it to aria-label."),
  d("aria-invalid-value", "markup", "serious",
    "aria-hidden has an invalid value", "The checkmark's aria-hidden=\"yes\" is not a valid value, so it isn't hidden from assistive tech.", "Uses aria-hidden=\"true\"."),
  d("iframe-missing-title", "markup", "serious",
    "Video frame has no title", "The embedded video iframe has no title attribute, so screen readers announce it only as \"iframe\".", "Adds title=\"Campus tour video\"."),
  d("table-header-association", "markup", "serious",
    "Table cells reference the wrong header ids", "Data cells use headers=\"wrong-col wrong-row\", ids that don't exist on any header cell.", "Points each cell's headers attribute at the real header ids."),
  d("aria-required-children", "markup", "serious",
    "Tablist wraps children with no tab role", "A role=\"tablist\" contains plain buttons with no role=\"tab\", which is not a valid child for the pattern.", "Adds role=\"tab\" to each child."),
  d("aria-required-parent", "markup", "moderate",
    "role=\"tab\" has no tablist parent", "An element with role=\"tab\" sits with no ancestor carrying role=\"tablist\", the role it requires.", "Wraps it in a role=\"tablist\" container."),
  d("svg-control-unlabeled", "markup", "serious",
    "SVG icon button has no accessible name", "The print button's inline SVG icon has no accessible name, and the button itself has none either.", "Adds visually hidden text \"Print this page\"."),
  d("input-image-no-alt", "markup", "critical",
    "Image input has no alt", "The <input type=\"image\"> submit control has no alt attribute, so it has no accessible name.", "Adds alt=\"Submit search\"."),
  d("list-structure", "markup", "serious",
    "List items sit in a <div>, not a list", "Three <li> elements are wrapped in a <div> instead of an <ol>, so they aren't announced as a list.", "Wraps the items in an <ol>."),
  d("aria-hidden-focusable", "markup", "serious",
    "Focusable button hidden from assistive tech", "A real, focusable button sits inside an aria-hidden=\"true\" container, so keyboard users can tab to a control screen readers never announce.", "Removes aria-hidden from the container."),
  d("label-for-mismatch", "markup", "critical",
    "Label points at the wrong id", "The \"Last name\" label's for attribute doesn't match the input's id.", "Fixes the for attribute to match."),
  // WAVE detects both of these as red "Contrast Errors", not Alerts (ADR-055); moved here from lab-manual.ts.
  d("contrast-text-low", "css", "serious",
    "Body text has low contrast", "This paragraph is set in light gray (#9a9a92) on white, about 2.5:1 — below the 4.5:1 minimum for body text.", "Uses #717171, just above the 4.5:1 minimum against the specimen box."),
  d("contrast-ui-low", "css", "serious",
    "Button border has low contrast", "This button's visible border is a very light gray (#d8d8d2) on white, about 1.2:1 — below the 3:1 minimum for UI components.", "Uses #8c8c8c, just above the 3:1 minimum against the specimen box."),
];
