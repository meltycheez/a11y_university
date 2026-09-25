import type { RuleKey } from "../rules";
import type { ScenarioDef } from "./types";

type Mech = ScenarioDef["mechanism"];
type Sev = NonNullable<ScenarioDef["severity"]>;
const d = (id: string, rule: RuleKey, pages: string | string[], component: string, mechanism: Mech, severity: Sev, title: string, description: string, fixDescription: string): ScenarioDef =>
  ({ id, rule, pages: Array.isArray(pages) ? pages : [pages], component, mechanism, severity, title, description, fixDescription });

const AUDIENCE = ["/admissions/undergraduate", "/admissions/graduate", "/admissions/international", "/admissions/transfer"];

// Admissions (marketing site) and Financial Aid pages. Aid shares the marketing chrome, so it lives here.
export const admissionsScenarios: ScenarioDef[] = [
  // /admissions
  d("adm-home-apply-new-window-001", "link-new-window", "/admissions", "AdmissionsHome", "markup", "moderate",
    "\"Apply now\" opens a new tab without warning", "The hero \"Apply now\" button opens the application in a new tab with no indication.", "Adds \"(opens in a new tab)\" to the link text."),
  d("adm-home-card-alt-redundant-001", "alt-redundant", "/admissions", "Card", "markup", "minor",
    "Path card photos repeat the card title", "Each \"Choose your path\" card photo has alt text identical to the card title next to it, so it is read twice.", "Marks the photos decorative (alt=\"\")."),
  d("adm-home-video-title-001", "iframe-missing-title", "/admissions", "VideoEmbed", "markup", "serious",
    "Virtual tour video frame has no title", "The campus tour video iframe has no title attribute.", "Adds title=\"Redwood State campus tour video\"."),
  d("adm-home-stats-contrast-001", "contrast-text-low", "/admissions", "StatsBand", "css", "serious",
    "Gold statistics on white have low contrast", "The big \"By the numbers\" figures are brand gold (#c9a227) on white, about 2.4:1.", "Uses the dark redwood color for the figures (about 9:1)."),
  d("adm-home-card-clip-001", "reflow-clipped-text", "/admissions", "Card", "css", "moderate",
    "Path card text is clipped when zoomed", "Card descriptions sit in a fixed-height box with overflow hidden, so at 200% zoom the text is cut off.", "Removes the fixed height so the text wraps and grows."),
  d("adm-home-motion-001", "motion-ignores-reduced-motion", "/admissions", "AdmissionsHome", "css", "moderate",
    "Cards slide in even with reduced motion", "Path cards animate upward on load and ignore the prefers-reduced-motion setting.", "Turns the animation off when the user prefers reduced motion."),

  // AudienceLanding template
  d("adm-audience-cta-contrast-001", "contrast-text-low", AUDIENCE, "AudienceLanding", "css", "serious",
    "\"Start your application\" button text has low contrast", "The apply band's pill button is white text on a light coral gradient (#f08a65 to #f6a98a, 2.5:1 down to 1.9:1).", "Uses a dark redwood gradient behind the white text (above 7:1)."),
  d("adm-audience-table-caption-001", "table-no-caption", ["/admissions/undergraduate", "/admissions/graduate", "/admissions/international"], "AudienceLanding", "markup", "minor",
    "Deadline tables have no caption", "The key dates and deadline tables have no <caption>, so their purpose isn't announced when a screen reader enters them.", "Adds a caption to each table."),
  d("adm-transfer-adt-heading-001", "heading-possible", "/admissions/transfer", "TransferAdmissions", "markup", "moderate",
    "\"Associate Degree for Transfer\" is bold text, not a heading", "The Associate Degree for Transfer callout title is a bold paragraph styled like a heading.", "Makes it an <h2>."),
  d("adm-grad-handbook-doc-001", "link-document", "/admissions/graduate", "GraduateAdmissions", "markup", "minor",
    "Handbook link doesn't say it's a PDF", "\"Graduate Studies Handbook\" opens a PDF with no file type or size in the link.", "Adds \"(PDF, 2 KB)\" to the link."),
  d("adm-grad-updated-small-001", "text-small", "/admissions/graduate", "AudienceLanding", "css", "minor",
    "\"Updated\" note is 10px text", "The page's last-updated note is set in 10px type.", "Uses the standard 0.9rem note size."),
  d("adm-intl-hero-alt-001", "alt-suspicious", "/admissions/international", "Hero", "markup", "minor",
    "Hero photo alt is a file name", "The hero photo's alt text is \"intl_hero_banner_2024.jpg\".", "Marks the decorative hero photo alt=\"\"."),
  d("adm-intl-heading-skip-001", "heading-skipped", "/admissions/international", "InternationalAdmissions", "markup", "moderate",
    "\"What you will need\" skips to h4", "The \"What you will need\" heading is an <h4> right after the page <h1>, skipping two levels.", "Makes it an <h2>."),

  // /admissions/freshman-requirements
  d("adm-fresh-check-glyph-001", "sr-decorative-announced", "/admissions/freshman-requirements", "FreshmanRequirements", "markup", "minor",
    "Checkmark glyphs are read aloud", "Each eligibility item starts with a ✔ character that screen readers announce as \"heavy check mark\".", "Hides the glyphs with aria-hidden."),
  d("adm-fresh-ag-headers-001", "table-header-association", "/admissions/freshman-requirements", "Table", "markup", "serious",
    "A–G table headers attributes point to missing ids", "Cells in the A–G table use headers=\"ag-c1 ag-r0\"… but the header cells were re-keyed to ag-col1/ag-row0, so no cell is associated with its headers.", "Points each cell's headers attribute at the real header ids."),
  d("adm-fresh-new-row-color-001", "color-only-info", "/admissions/freshman-requirements", "FreshmanRequirements", "markup", "serious",
    "New requirement shown only by a gold row", "The new Quantitative Reasoning requirement is identified only by a gold row tint and a color legend.", "Restores \"(beginning Fall 2027)\" in the row text and drops the color legend."),
  d("adm-fresh-generic-link-001", "link-generic", "/admissions/freshman-requirements", "FreshmanRequirements", "markup", "minor",
    "\"Click here\" link", "The impacted majors callout links \"Click here for program details\".", "Uses \"Degree programs, including Nursing and Computer Science\"."),

  // /admissions/process
  d("adm-process-stepper-list-001", "list-structure", "/admissions/process", "AdmissionsProcess", "markup", "serious",
    "Stepper <li> items sit in a <div>", "The five-step stepper renders <li> elements inside a <div> instead of an <ol>.", "Wraps the steps in an <ol>."),
  d("adm-process-heading-skip-001", "heading-skipped", "/admissions/process", "AdmissionsProcess", "markup", "moderate",
    "Step titles jump from h1 to h3", "Each step title is an <h3> directly after the page <h1>.", "Makes step titles <h2>."),
  d("adm-process-portal-new-window-001", "link-new-window", "/admissions/process", "AdmissionsProcess", "markup", "moderate",
    "RedwoodConnect link opens a new tab without warning", "Step 4's RedwoodConnect login link opens a new tab with no warning.", "Adds \"(opens in a new tab)\"."),
  d("adm-process-start-js-link-001", "link-javascript", "/admissions/process", "StartLink", "behavior", "moderate",
    "\"Start the application\" is an href=\"#\" link", "The Step 2 button is <a href=\"#\"> that navigates in a click handler, so it has no real destination to open, copy or bookmark.", "Uses a real link to /admissions/apply."),
  d("adm-process-number-contrast-001", "contrast-text-low", "/admissions/process", "AdmissionsProcess", "css", "serious",
    "Step numbers have low contrast", "Step number circles are white text on light peach (#f2a383), about 2.0:1.", "Uses dark redwood circles (about 9:1)."),

  // /admissions/tuition
  d("adm-tuition-duplicate-link-001", "link-redundant", "/admissions/tuition", "Tuition", "markup", "minor",
    "Two adjacent schedule links go to the same PDF", "The 2026–27 and 2025–26 tuition schedule links sit next to each other and point to the same file.", "Removes the outdated duplicate link."),
  d("adm-tuition-fineprint-small-001", "text-small", "/admissions/tuition", "Tuition", "css", "minor",
    "Fee disclaimer is 10px", "\"Fees are subject to change…\" is set in 10px type.", "Uses body-size text."),
  d("adm-tuition-table-reflow-001", "reflow-horizontal-scroll", "/admissions/tuition", "Table", "css", "serious",
    "Undergraduate fee table forces page scrolling", "The undergraduate fee table has a 56rem minimum width and no scroll container, so at 320px the whole page scrolls sideways.", "Lets the table shrink and scroll inside its own container."),
  d("adm-tuition-coa-headers-001", "table-header-association", "/admissions/tuition", "Table", "markup", "serious",
    "Cost of attendance cells reference missing headers", "The cost of attendance table's headers attributes point at ids that no longer exist.", "Points headers at the real header cell ids."),

  // /admissions/scholarships
  d("adm-schol-hero-alt-long-001", "alt-long", "/admissions/scholarships", "Hero", "markup", "minor",
    "Hero photo has a 350-character alt", "The decorative hero photo has a long, detailed alt text that screen reader users must sit through.", "Marks the decorative photo alt=\"\"."),
  d("adm-schol-underline-001", "underline-non-link", "/admissions/scholarships", "Scholarships", "markup", "minor",
    "Underlined text that isn't a link", "\"one application\" is underlined with <u> for emphasis and looks like a link.", "Uses bold (<strong>) instead."),
  d("adm-schol-renewable-color-001", "color-only-info", "/admissions/scholarships", "Scholarships", "markup", "serious",
    "Renewable awards marked only by a green bar", "Renewable scholarships are identified only by a green left border explained in a color legend.", "Shows \"renewable\" in the amount text and drops the color legend."),
  d("adm-schol-generic-link-001", "link-generic", "/admissions/scholarships", "Scholarships", "markup", "minor",
    "\"Read more\" link", "The outside scholarships callout ends with \"Read more\".", "Uses \"Grants, loans, and work-study\"."),

  // /admissions/request-info
  d("adm-reqinfo-name-placeholder-001", "input-missing-label", "/admissions/request-info", "Field", "markup", "critical",
    "Name fields use placeholders instead of labels", "First and last name have placeholder text but no label, so they have no persistent accessible name.", "Adds visible <label> elements."),
  d("adm-reqinfo-email-for-001", "label-for-mismatch", "/admissions/request-info", "Field", "markup", "critical",
    "Email label points at the wrong id", "The Email <label for=\"ri-email-input\"> doesn't match the input's id (ri-email).", "Fixes the for attribute."),
  d("adm-reqinfo-term-select-001", "select-missing-label", "/admissions/request-info", "RequestInfo", "markup", "critical",
    "Start term select has no label", "\"When do you plan to start?\" is a <span>, so the select has no accessible name.", "Uses a <label for> for the select."),
  d("adm-reqinfo-type-fieldset-001", "fieldset-missing", "/admissions/request-info", "RequestInfo", "markup", "moderate",
    "Student type radios aren't grouped", "The \"I am a…\" radio buttons have no <fieldset>/<legend>, so the question isn't announced with each option.", "Wraps them in a fieldset with a legend."),
  d("adm-reqinfo-required-color-001", "color-only-required", "/admissions/request-info", "RequestInfo", "markup", "serious",
    "Required fields shown only in red", "Required fields are marked only by red label text (\"Fields in red are required\") and aren't marked required in code.", "Adds \"(required)\" to the labels and the required attribute."),
  d("adm-reqinfo-status-001", "sr-status-not-announced", "/admissions/request-info", "RequestInfo", "behavior", "moderate",
    "Thank-you message isn't announced", "After submitting, the confirmation appears silently; screen readers aren't told the form was sent.", "Puts the confirmation in a role=\"status\" live region."),

  // /admissions/visit (the date picker and booking dialog are plan 06)
  d("adm-visit-hero-alt-001", "img-missing-alt", "/admissions/visit", "Hero", "markup", "critical",
    "Hero photo has no alt attribute", "The Visit Campus hero photo has no alt attribute.", "Adds alt text describing the tour."),
  d("adm-visit-tips-heading-001", "heading-possible", "/admissions/visit", "Visit", "markup", "moderate",
    "\"Before you come\" is bold text", "\"Before you come\" is a bold paragraph styled as a heading.", "Makes it an <h2>."),
  d("adm-visit-schedule-caption-001", "table-no-caption", "/admissions/visit", "Table", "markup", "minor",
    "Tour schedule table has no caption", "The weekly tour schedule table has no <caption>.", "Adds a caption."),
  d("adm-visit-saturday-contrast-001", "contrast-text-low", "/admissions/visit", "Callout", "css", "serious",
    "Saturday tours note is pale gray", "The Saturday tours callout text is light gray (#9a9a92) on cream, about 2.5:1.", "Uses the body text color."),
  d("adm-visit-reserve-generic-001", "link-generic", "/admissions/visit", "ReserveLink", "markup", "moderate",
    "Every date link says just \"Reserve\"", "Each upcoming tour has a \"Reserve\" link with no date or time in its name.", "Adds the date and time as visually hidden link text."),
  d("adm-visit-reserve-focus-001", "focus-indicator-missing", "/admissions/visit", "ReserveLink", "css", "serious",
    "Reserve buttons hide the focus outline", "The pill \"Reserve\" links set outline: none on focus.", "Restores a visible focus ring."),
  d("adm-visit-more-dates-001", "kbd-div-button", "/admissions/visit", "Visit", "behavior", "serious",
    "\"Show more dates\" is a clickable div", "\"Show more dates\" is a <div> with a click handler: it isn't focusable and has no button role or expanded state.", "Uses a <button> with aria-expanded."),
  d("adm-visit-video-title-001", "iframe-missing-title", "/admissions/visit", "VideoEmbed", "markup", "serious",
    "Virtual tour video frame has no title", "The virtual tour iframe has no title attribute.", "Adds a title."),
  d("adm-visit-gallery-alt-001", "alt-suspicious", "/admissions/visit", "Visit", "markup", "minor",
    "Gallery photos use camera file names as alt", "The \"What you'll see\" photos have alt text like \"DSC_0192.JPG\".", "Marks them decorative (alt=\"\"), since each has a caption."),
  d("adm-visit-directions-new-window-001", "link-new-window", "/admissions/visit", "Visit", "markup", "moderate",
    "Directions link opens a new tab without warning", "\"Directions and parking\" opens in a new tab with no indication.", "Adds \"(opens in a new tab)\"."),

  // /admissions/faq
  d("adm-faq-heading-skip-001", "heading-skipped", "/admissions/faq", "Accordion", "markup", "moderate",
    "FAQ questions skip from h2 to h4", "Each accordion question heading is an <h4> under an <h2> category heading.", "Uses <h3> for the questions."),
  d("adm-faq-group-contrast-001", "contrast-text-low", "/admissions/faq", "AdmissionsFaq", "css", "serious",
    "Category headings are light coral", "FAQ category headings are light coral (#e8957a) on white, about 2.3:1.", "Uses dark redwood."),
  d("adm-faq-generic-link-001", "link-generic", "/admissions/faq", "AdmissionsFaq", "markup", "minor",
    "\"Click here\" email link", "The contact line's email link reads \"Click here\".", "Uses \"Email the Office of Admissions\"."),

  // /financial-aid
  d("aid-home-hero-alt-001", "alt-suspicious", "/financial-aid", "Hero", "markup", "minor",
    "Hero photo alt is a file name", "The hero photo's alt text is \"aid_hero_final_v2.jpg\".", "Marks the decorative hero photo alt=\"\"."),
  d("aid-home-deadline-contrast-001", "contrast-text-low", "/financial-aid", "FinancialAid", "css", "serious",
    "Priority deadline banner has low contrast", "The priority deadline banner is white text on brand gold (#c9a227), about 2.4:1.", "Uses dark text on the gold background."),
  d("aid-home-deadlines-caption-001", "table-no-caption", "/financial-aid", "Table", "markup", "minor",
    "Deadlines table has no caption", "The 2027–28 key deadlines table has no <caption>.", "Adds a caption."),
  d("aid-home-sap-justified-001", "text-justified", "/financial-aid", "FinancialAid", "css", "minor",
    "SAP policy text is justified", "The Satisfactory Academic Progress paragraph uses text-align: justify, creating uneven spacing.", "Left-aligns the paragraph."),
  d("aid-home-legacy-new-window-001", "link-new-window", "/financial-aid", "FinancialAid", "markup", "moderate",
    "Aid application link opens a new tab without warning", "\"Institutional Aid Application\" opens in a new tab with no indication.", "Adds \"(opens in a new tab)\"."),
  d("aid-home-email-icon-link-001", "link-empty", "/financial-aid", "FinancialAid", "markup", "serious",
    "Envelope icon link has no name", "The email icon link next to the contact card contains only an aria-hidden ✉ glyph.", "Adds visually hidden text \"Email the Financial Aid Office\"."),

  // /financial-aid/types
  d("aid-types-heading-skip-001", "heading-skipped", "/financial-aid/types", "AidTypes", "markup", "moderate",
    "Tab panel headings skip to h3", "Grants, Loans and Work-study headings inside the tabs are <h3> directly under the page <h1>.", "Makes them <h2>."),
  d("aid-types-source-color-001", "color-only-info", "/financial-aid/types", "AidTypes", "markup", "serious",
    "Grant source shown only by a colored dot", "The grants table's Source column shows only a blue, gold or red dot, explained by a legend.", "Shows the source name (Federal, State, Institutional) next to the dot."),
  d("aid-types-rate-aria-hidden-001", "aria-invalid-value", "/financial-aid/types", "AidTypes", "markup", "serious",
    "Info icon uses aria-hidden=\"yes\"", "The ⓘ icon in the interest rate header has aria-hidden=\"yes\", which is not a valid value, so it isn't hidden.", "Uses aria-hidden=\"true\"."),
  d("aid-types-generic-link-001", "link-generic", "/financial-aid/types", "AidTypes", "markup", "minor",
    "\"Click here\" link", "The Work-study tab links \"Click here\" to the Financial Aid overview.", "Uses \"Financial Aid overview\"."),
];
