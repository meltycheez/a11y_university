import type { RuleKey } from "../rules";
import type { ScenarioDef } from "./types";

type Mech = ScenarioDef["mechanism"];
type Sev = NonNullable<ScenarioDef["severity"]>;
const PAGE = "/accessibility-lab/alerts";
const d = (rule: RuleKey, mechanism: Mech, severity: Sev, title: string, description: string, fixDescription: string, extra: Partial<ScenarioDef> = {}): ScenarioDef => ({
  id: `${rule}-alerts-lab`, rule, title, description, fixDescription, pages: [PAGE], component: "AlertsLab", mechanism, severity, ...extra,
});

// One isolated specimen per alert rule (plan 08). Ids get an "-alerts-lab" suffix so counts stay
// unambiguous from the site's own instances of the same rule.
export const labAlertsScenarios: ScenarioDef[] = [
  d("alt-suspicious", "markup", "minor",
    "Photo alt is a camera file name", "The photo's alt text is \"IMG_04213.jpg\", a camera file name rather than a description.", "Marks the decorative photo alt=\"\" (a caption already describes it)."),
  d("alt-redundant", "markup", "minor",
    "Photo alt repeats the visible caption", "The photo's alt text duplicates the caption text right next to it, so it is read twice.", "Marks the decorative photo alt=\"\"."),
  d("alt-long", "markup", "minor",
    "Photo alt is a 300-character paragraph", "The photo's alt text is a long, detailed paragraph a screen reader user must sit through.", "Marks the decorative photo alt=\"\" (a caption already describes it)."),
  d("img-title-attr", "markup", "minor",
    "Image title duplicates its alt text", "The photo carries a title attribute identical to its alt text, which some browsers announce as a redundant tooltip.", "Removes the redundant title attribute."),
  d("link-redundant", "markup", "minor",
    "Two adjacent links go to the same place", "Two links sit next to each other and point at the same destination.", "Removes the duplicate, keeping one link."),
  d("link-generic", "markup", "minor",
    "\"Click here\" link", "The link text is \"Click here\", which is meaningless out of context.", "Uses \"Degree programs\"."),
  d("link-document", "markup", "minor",
    "Document link doesn't say it's a PDF", "\"Course catalog addendum\" opens a PDF with no file type or size in the link text.", "Adds \"(PDF, 240 KB)\" to the link."),
  d("link-new-window", "markup", "moderate",
    "Link opens a new tab without warning", "\"Partner site\" opens in a new tab with no indication in the link text.", "Adds \"(opens in a new tab)\"."),
  d("underline-non-link", "markup", "minor",
    "Underlined text that isn't a link", "\"emphasized text\" is underlined with <u> for emphasis and looks like a link.", "Uses bold (<strong>) instead."),
  d("heading-skipped", "markup", "moderate",
    "Heading skips two levels", "\"Program highlights\" renders as an <h4> directly under an <h2>, skipping a level.", "Makes it an <h3>."),
  d("heading-possible", "markup", "moderate",
    "Bold text styled like a heading", "\"Before you apply\" is a bold paragraph that looks like a heading but isn't one.", "Makes it a real heading."),
  d("text-small", "css", "minor",
    "Body copy is 0.6rem", "The sample paragraph is set well below the standard body size.", "Uses the standard body text size."),
  d("text-justified", "css", "minor",
    "Justified body text", "The sample paragraph uses text-align: justify, creating uneven word spacing.", "Left-aligns the paragraph."),
  d("event-handler-device", "behavior", "moderate",
    "Tooltip opens on hover only", "The info control reveals its tooltip on mouseover only; keyboard users have no way to open it.", "Adds a focus handler so keyboard users can open it too.",
    { detectedBy: { manualOnly: true } }),
  d("label-orphaned", "markup", "minor",
    "Label isn't associated with its field", "The \"Phone number\" <label> has no for attribute, so it isn't programmatically linked to the input.", "Adds a for attribute matching the input's id."),
  d("placeholder-as-label", "markup", "moderate",
    "Placeholder used instead of a label", "\"ZIP code\" appears only as placeholder text, which disappears once typing starts and isn't a real label.", "Adds a visible <label for>."),
  d("table-no-caption", "markup", "minor",
    "Data table has no caption", "The specimen table has proper header cells but no <caption> describing its purpose.", "Adds a caption."),
  d("table-layout", "markup", "moderate",
    "Table used for visual layout", "A <table> with no headers or caption is used only to lay out two columns visually, not to present tabular data.", "Replaces it with a <div> grid; layout isn't a table's job."),
  d("title-redundant", "markup", "minor",
    "Link title duplicates its text", "The link's title attribute repeats its own link text word for word.", "Removes the redundant title attribute."),
  d("link-nearby-duplicate", "markup", "minor",
    "Two nearby links share the same text", "Two adjacent \"Learn more\" links point at different destinations with no way to tell them apart out of context.", "Gives each link distinct, specific text."),
  d("fieldset-missing", "markup", "moderate",
    "Radio group has no fieldset or legend", "The campus choice radio buttons have no <fieldset>/<legend>, so the question isn't announced with each option.", "Wraps them in a fieldset with a legend."),
  d("link-javascript", "behavior", "moderate",
    "Link is really a click handler", "The link is <a href=\"#\"> that navigates in a click handler, so it has no real destination to open, copy or bookmark.", "Uses a real link to the destination."),
];
