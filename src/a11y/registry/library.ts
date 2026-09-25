import type { ScenarioDef } from "./types";

type Def = Omit<ScenarioDef, "pages" | "component"> & { severity: NonNullable<ScenarioDef["severity"]> };
const on = (pages: string[], component: string, defs: Def[]): ScenarioDef[] => defs.map((d) => ({ ...d, pages, component }));

// Sequoia Library: its own dense vendor-hosted site, including the study-room drag-to-book grid (plan 06 #12).
export const libraryScenarios: ScenarioDef[] = [
  // ---------- /library (tier H) ----------
  ...on(["/library"], "LibraryHome", [
    { id: "library-home-onesearch-label-001", rule: "input-missing-label", title: "OneSearch box has no label", description: "The Everything search box shows its prompt as plain text; the input has no accessible name.", fixDescription: "Uses a <label for> on the input.", mechanism: "markup", severity: "critical" },
    { id: "library-home-books-select-001", rule: "select-missing-label", title: "\"Search in\" select has no label", description: "The Books & Media field picker (Keyword, Title, Author, ISBN) has no label.", fixDescription: "Adds a visually hidden \"Search in\" label.", mechanism: "markup", severity: "critical" },
    { id: "library-home-articles-placeholder-001", rule: "placeholder-as-label", title: "Books and Articles boxes use placeholders as labels", description: "The Books & Media and Articles search boxes are labeled only by placeholder text.", fixDescription: "Adds visible labels.", mechanism: "markup", severity: "moderate" },
    { id: "library-home-search-submit-001", rule: "button-empty", title: "Search buttons are unlabeled icons", description: "Each search tab's magnifier submit button has no text.", fixDescription: "Adds visually hidden \"Search\" text.", mechanism: "markup", severity: "critical" },
    { id: "library-home-oa-newwindow-001", rule: "link-new-window", title: "Open Access Journals link opens a new tab silently", description: "The Open Access Journals Directory link opens an external site in a new tab with no warning.", fixDescription: "Adds \"(opens in a new tab)\".", mechanism: "markup", severity: "minor" },
    { id: "library-home-quicklinks-list-001", rule: "list-structure", title: "Quick links are <li> elements inside <div>s", description: "The vendor's quick-link columns wrap <li> items in a <div> instead of a list.", fixDescription: "Uses a <ul> for each column.", mechanism: "markup", severity: "moderate" },
    { id: "library-home-quicklinks-small-001", rule: "text-small", title: "Quick links are 11px", description: "The dense quick-link columns set link text at 11px.", fixDescription: "Uses 0.9rem.", mechanism: "css", severity: "minor" },
    { id: "library-home-quicklinks-focus-001", rule: "focus-indicator-missing", title: "Quick links hide the focus outline", description: "Quick links set outline: none, so keyboard focus is invisible in the densest part of the page.", fixDescription: "Restores a visible focus outline.", mechanism: "css", severity: "serious" },
    { id: "library-home-hours-contrast-001", rule: "contrast-text-low", title: "Hours widget text is pale", description: "The \"Hours today\" widget uses #8fa3b5 text on #eef3f7 (about 2.3:1).", fixDescription: "Uses #33475b (about 8.4:1).", mechanism: "css", severity: "serious" },
    { id: "library-home-space-img-title-001", rule: "img-title-attr", title: "Study spaces photo has a title tooltip", description: "The reading room photo has title=\"Reading room\" duplicating a vague alt.", fixDescription: "Removes the title and describes the photo in the alt text.", mechanism: "markup", severity: "minor" },
    { id: "library-home-tour-iframe-001", rule: "iframe-missing-title", title: "Library tour video frame has no title", description: "The embedded tour video iframe has no title attribute.", fixDescription: "Titles the frame \"Sequoia Library in 90 seconds\".", mechanism: "markup", severity: "serious" },
    { id: "library-home-learnmore-001", rule: "link-generic", title: "Research guides box ends in \"Learn more\"", description: "The link to all research guides reads only \"Learn more\".", fixDescription: "Reads \"See all research guides\".", mechanism: "markup", severity: "moderate" },
    { id: "library-home-chat-empty-001", rule: "link-empty", title: "Floating chat launcher has no text", description: "The chat bubble link in the corner contains only an SVG icon.", fixDescription: "Adds visually hidden \"Ask a librarian by email\".", mechanism: "markup", severity: "critical" },
  ]),

  // ---------- /library/search ----------
  ...on(["/library/search"], "LibrarySearch", [
    { id: "library-search-input-label-001", rule: "label-for-mismatch", title: "OneSearch label points at a missing id", description: "The \"Search OneSearch\" label's for attribute is onesearch-q-input; the input's id is onesearch-q.", fixDescription: "Points the label at the input.", mechanism: "markup", severity: "serious" },
    { id: "library-search-facets-fieldset-001", rule: "fieldset-missing", title: "Facet checkboxes aren't grouped", description: "Format and Availability checkboxes sit under bold paragraphs, not fieldsets with legends.", fixDescription: "Wraps each facet in a fieldset and legend.", mechanism: "markup", severity: "moderate" },
    { id: "library-search-status-color-001", rule: "color-only-info", title: "Availability is a colored dot", description: "Each result shows availability only as a green or red dot.", fixDescription: "Adds the status in text (\"Checked out, due October 19, 2026\").", mechanism: "markup", severity: "serious" },
    { id: "library-search-results-live-001", rule: "sr-results-no-live-region", title: "Result count updates silently", description: "Searching or ticking a facet changes \"N results\" with no announcement.", fixDescription: "Makes the count a role=\"status\" live region.", mechanism: "behavior", severity: "moderate" },
    { id: "library-search-save-empty-001", rule: "button-empty", title: "\"Save to list\" star buttons have no name", description: "The star button on each result contains only a ☆ glyph.", fixDescription: "Adds visually hidden \"Save <title> to my list\".", mechanism: "markup", severity: "critical" },
  ]),

  // ---------- /library/databases (tier H) ----------
  ...on(["/library/databases"], "DatabasesAZ", [
    { id: "library-db-nav-labelledby-001", rule: "aria-broken-reference", title: "A–Z nav is labelled by a missing id", description: "The letter navigation has aria-labelledby=\"az-heading\", but the \"Jump to:\" text has id=\"az-label\".", fixDescription: "Points aria-labelledby at az-label.", mechanism: "markup", severity: "serious" },
    { id: "library-db-empty-letter-001", rule: "link-javascript", title: "Letters with no databases are href=\"#\" links", description: "Letters like Q and X are links to \"#\" that go nowhere.", fixDescription: "Renders letters without databases as plain text.", mechanism: "markup", severity: "moderate" },
    { id: "library-db-subject-select-001", rule: "select-missing-label", title: "Subject filter has no label", description: "\"Subject\" is a <span> beside the select, not a label.", fixDescription: "Uses a <label for>.", mechanism: "markup", severity: "critical" },
    { id: "library-db-letter-heading-001", rule: "heading-skipped", title: "Letter headings are h4", description: "The A, B, C… section headings are <h4> directly under the <h1>.", fixDescription: "Makes them <h2>.", mechanism: "markup", severity: "moderate" },
    { id: "library-db-newwindow-001", rule: "link-new-window", title: "Database links open new tabs without warning", description: "Every database name opens the vendor site in a new tab with no indication.", fixDescription: "Adds \"(opens in a new tab)\" to each link.", mechanism: "markup", severity: "minor" },
    { id: "library-db-fulltext-alt-001", rule: "alt-suspicious", title: "Full-text icon alt is a file name", description: "The full-text icon's alt text is \"icon_fulltext.png\".", fixDescription: "Uses alt=\"Full text available\".", mechanism: "markup", severity: "minor" },
    { id: "library-db-desc-contrast-001", rule: "contrast-text-low", title: "Database descriptions are light gray", description: "Descriptions and coverage lines are #a0a8b0 on white (about 2.4:1).", fixDescription: "Uses #4b5560 (about 7.5:1).", mechanism: "css", severity: "serious" },
    { id: "library-db-entry-height-001", rule: "reflow-fixed-dimensions", title: "Entries have a fixed height", description: "Each entry is fixed at 7rem with overflow hidden, so text is cut off at 200% zoom or with larger text spacing.", fixDescription: "Lets entries grow with their content.", mechanism: "css", severity: "serious" },
    { id: "library-db-notice-underline-001", rule: "underline-non-link", title: "Licensing notice is underlined", description: "The login notice is underlined for emphasis and looks like a link.", fixDescription: "Uses bold instead of an underline.", mechanism: "css", severity: "minor" },
  ]),

  // ---------- /library/guides ----------
  ...on(["/library/guides"], "GuidesIndex", [
    { id: "library-guides-filter-label-001", rule: "input-missing-label", title: "Guide filter has no label", description: "The \"Filter guides\" text is a <span>, so the filter input has no accessible name.", fixDescription: "Uses a <label for>.", mechanism: "markup", severity: "critical" },
    { id: "library-guides-redundant-001", rule: "link-redundant", title: "Guide title and \"»\" link go to the same place", description: "Each guide card links its title and then repeats the title as a separate \"»\" link.", fixDescription: "Removes the duplicate link.", mechanism: "markup", severity: "minor" },
    { id: "library-guides-updated-small-001", rule: "text-small", title: "\"Last updated\" dates are 10px", description: "The update date on each guide card is 10px.", fixDescription: "Uses 0.85rem.", mechanism: "css", severity: "minor" },
  ]),

  // ---------- /library/guides/:slug ----------
  ...on(["/library/guides/:slug"], "GuidePage", [
    { id: "library-guide-box-heading-001", rule: "heading-possible", title: "Guide box titles aren't headings", description: "Each content box title is a bold paragraph, so the guide has no navigable structure.", fixDescription: "Makes box titles <h2>.", mechanism: "markup", severity: "moderate" },
    { id: "library-guide-box-contrast-001", rule: "contrast-text-low", title: "Box title bars are white on light teal", description: "Box title bars use white text on #7fb3c8 (about 2.2:1).", fixDescription: "Uses the dark library navy (#1e2d3b) bar.", mechanism: "css", severity: "serious" },
    { id: "library-guide-email-title-001", rule: "title-redundant", title: "Librarian email link repeats itself in a title", description: "The librarian's email link has a title attribute identical to its text.", fixDescription: "Removes the title attribute.", mechanism: "markup", severity: "minor" },
    { id: "library-guide-db-newwindow-001", rule: "link-new-window", title: "\"Best databases\" links open new tabs silently", description: "Recommended database links open in a new tab with no warning.", fixDescription: "Adds \"(opens in a new tab)\".", mechanism: "markup", severity: "minor" },
  ]),
  ...on(["/library/guides/local-history-archives"], "GuidePage", [
    { id: "library-guide-pdf-001", rule: "link-document", title: "Finding aid link doesn't say it's a PDF", description: "The \"Logging Records Collection finding aid\" link downloads a PDF with no file type or size.", fixDescription: "Adds \"(PDF, 2 KB)\".", mechanism: "markup", severity: "minor" },
  ]),

  // ---------- /library/study-rooms (tier H) ----------
  ...on(["/library/study-rooms"], "StudyRooms", [
    { id: "library-rooms-photo-alt-001", rule: "alt-redundant", title: "Reading room photo alt repeats the caption", description: "The photo's alt text is the same sentence as its caption.", fixDescription: "Describes the photo instead.", mechanism: "markup", severity: "minor" },
    { id: "library-rooms-date-select-001", rule: "select-missing-label", title: "Date picker select has no label", description: "\"Date\" is a <span>, so the date select has no accessible name.", fixDescription: "Uses a <label for>.", mechanism: "markup", severity: "critical" },
    { id: "library-rooms-tabindex-001", rule: "focus-positive-tabindex", title: "Date select has tabindex=\"1\"", description: "The date select jumps ahead of the skip link and page header in the tab order.", fixDescription: "Removes the positive tabindex.", mechanism: "markup", severity: "serious" },
    { id: "library-rooms-headers-001", rule: "table-header-association", title: "Slot cells reference ids that don't exist", description: "Time slots have headers=\"room-201 hour-9\", but the headers are r-201 and h-9, and room names are plain cells.", fixDescription: "Uses <th scope=\"row\"> and <th scope=\"col\"> and drops the headers attributes.", mechanism: "markup", severity: "serious" },
    { id: "library-rooms-color-only-001", rule: "color-only-info", title: "Open and booked slots are shown by color only", description: "Slots are empty green or gray cells with no text or legend.", fixDescription: "Writes \"Open\" or \"Booked\" in each slot and adds a legend.", mechanism: "markup", severity: "serious" },
    { id: "library-rooms-caption-001", rule: "table-no-caption", title: "Availability table has no caption", description: "The table doesn't say which day it shows.", fixDescription: "Adds a caption with the date.", mechanism: "markup", severity: "minor" },
    { id: "library-rooms-reflow-001", rule: "reflow-horizontal-scroll", title: "Availability table forces page scrolling", description: "The table has a 60rem minimum width and no scroll container, so at 320 CSS px the whole page scrolls sideways.", fixDescription: "Puts the table in its own keyboard-scrollable region, so only the table scrolls (data tables are exempt from reflow).", mechanism: "css", severity: "serious" },
    { id: "library-rooms-drag-001", rule: "kbd-drag-no-alternative", title: "Booking a room requires dragging", description: "A time range can only be chosen by pressing on an open slot and dragging across the row; the slots aren't focusable and there is no other way to pick a room and time.", fixDescription: "Adds a labeled Room / Start / Length form that books the same slots with the keyboard or single clicks, with errors in role=\"alert\".", mechanism: "behavior", severity: "serious" },
    { id: "library-rooms-toast-001", rule: "sr-status-not-announced", title: "Reservation confirmation toast vanishes silently", description: "After reserving, a toast with the confirmation number appears in the corner for 3 seconds and disappears. It isn't a live region, so screen readers never hear it, and slow readers miss it.", fixDescription: "The toast is a persistent role=\"status\" message with a Dismiss button.", mechanism: "behavior", severity: "moderate" },
    { id: "library-rooms-policies-pdf-001", rule: "link-document", title: "Policies PDF link gives no size", description: "\"Library Policies (PDF)\" gives no file size.", fixDescription: "Reads \"Library Policies (PDF, 2 KB)\".", mechanism: "markup", severity: "minor" },
  ]),

  // ---------- /library/hours ----------
  ...on(["/library/hours"], "LibraryHours", [
    { id: "library-hours-closed-color-001", rule: "color-only-info", title: "Closed days are only shaded red", description: "In \"This week\", closed days are empty red cells with no text.", fixDescription: "Writes \"Closed\" in the cell.", mechanism: "markup", severity: "serious" },
    { id: "library-hours-caption-001", rule: "table-no-caption", title: "Weekly hours table has no caption", description: "The weekly table has no caption naming the week.", fixDescription: "Adds a caption.", mechanism: "markup", severity: "minor" },
    { id: "library-hours-underline-001", rule: "underline-non-link", title: "Finals hours are underlined", description: "\"Finals week: open 24 hours\" is underlined for emphasis and looks like a link.", fixDescription: "Uses bold instead.", mechanism: "css", severity: "minor" },
    { id: "library-hours-heading-skip-001", rule: "heading-skipped", title: "\"Holiday closures\" jumps to h5", description: "The Holiday closures heading is an <h5> under an <h2>.", fixDescription: "Makes it an <h3>.", mechanism: "markup", severity: "moderate" },
  ]),

  // ---------- /library/policies ----------
  ...on(["/library/policies"], "LibraryPolicies", [
    { id: "library-policies-caption-001", rule: "table-no-caption", title: "Borrowing table has no caption", description: "The loan limits table has no caption.", fixDescription: "Adds \"Loan limits and periods by patron type\".", mechanism: "markup", severity: "minor" },
    { id: "library-policies-pdf-001", rule: "link-document", title: "Full policies PDF gives no size", description: "\"Full Library Policies (PDF)\" gives no file size.", fixDescription: "Adds \"(PDF, 2 KB)\".", mechanism: "markup", severity: "minor" },
    { id: "library-policies-click-here-001", rule: "link-generic", title: "\"Click here\" link", description: "The link to the account page reads \"Click here\".", fixDescription: "Reads \"Check your library account\".", mechanism: "markup", severity: "moderate" },
    { id: "library-policies-updated-small-001", rule: "text-small", title: "Revision date is 10px", description: "\"Revised Fall 2018\" is set at 10px.", fixDescription: "Uses 0.85rem.", mechanism: "css", severity: "minor" },
  ]),

  // ---------- /library/account ----------
  ...on(["/library/account"], "LibraryAccount", [
    { id: "library-account-checkbox-label-001", rule: "input-missing-label", title: "Renew checkboxes have no labels", description: "Each row's renew checkbox has no accessible name.", fixDescription: "Labels each checkbox \"Renew <title>\".", mechanism: "markup", severity: "critical" },
    { id: "library-account-due-color-001", rule: "color-only-info", title: "Overdue and due-soon dates are only colored", description: "Overdue dates are red and due-soon dates amber, with no text.", fixDescription: "Adds \"(Overdue)\" or \"(Due soon)\".", mechanism: "markup", severity: "serious" },
    { id: "library-account-renew-div-001", rule: "kbd-div-button", title: "\"Renew selected\" is a clickable div", description: "The Renew selected control is a <div> with a click handler: not focusable, no role.", fixDescription: "Uses a <button>.", mechanism: "behavior", severity: "serious" },
    { id: "library-account-renew-status-001", rule: "sr-status-not-announced", title: "Renewal result is not announced", description: "\"2 items renewed\" appears silently after renewing.", fixDescription: "Puts the message in a role=\"status\" live region.", mechanism: "behavior", severity: "moderate" },
  ]),
];
