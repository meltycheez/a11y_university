import type { ScenarioDef } from "./types";

// Employees (dated intranet). CSS scenarios live in src/styles/sections/intranet.css.
export const employeesScenarios: ScenarioDef[] = [
  // /employees (M)
  {
    id: "employees-home-hero-alt-001", rule: "img-missing-alt", pages: ["/employees"], component: "Hero", mechanism: "markup", severity: "critical",
    title: "Intranet banner photo has no alt attribute",
    description: "The office photo at the top of the intranet home has no alt attribute.",
    fixDescription: "Adds alt text describing the photo.",
  },
  {
    id: "employees-home-links-layout-table-001", rule: "table-layout", pages: ["/employees"], component: "EmployeesPage", mechanism: "markup", severity: "moderate",
    title: "Quick links laid out with a table",
    description: "The quick links are arranged in a three-column <table> used purely for layout.",
    fixDescription: "Quick links are a list styled as a grid.",
  },
  {
    id: "employees-home-announce-rotate-001", rule: "motion-autorotate-no-pause", pages: ["/employees"], component: "Announcements", mechanism: "behavior", severity: "serious",
    title: "Announcements rotate every 5 seconds",
    description: "Announcements replace each other every 5 seconds with no pause, stop or previous control, so slower readers can't finish them.",
    fixDescription: "All announcements are shown as a static list.",
  },
  {
    id: "employees-home-ess-link-001", rule: "link-javascript", pages: ["/employees"], component: "EmployeesPage", mechanism: "markup", severity: "moderate",
    title: "Employee Self-Service link goes nowhere",
    description: "\"RedwoodConnect Employee Self-Service\" is an href=\"#\" link whose click handler was left empty, so it does nothing.",
    fixDescription: "Links to Payroll Services, which explains how to reach self-service.",
  },
  {
    id: "employees-home-maintained-small-001", rule: "text-small", pages: ["/employees"], component: "EmployeesPage", mechanism: "css", severity: "minor",
    title: "\"Maintained by\" note at 10px",
    description: "The page maintainer note is 10px text.",
    fixDescription: "Uses 0.9rem.",
  },

  // /employees/hr (M)
  {
    id: "employees-hr-search-label-001", rule: "input-missing-label", pages: ["/employees/hr"], component: "HrPage", mechanism: "markup", severity: "critical",
    title: "HR search box has no label",
    description: "\"Search HR pages\" is a <span> next to the search input, so the input has no accessible name.",
    fixDescription: "The text is a <label for> the input.",
  },
  {
    id: "employees-hr-accordion-heading-001", rule: "heading-skipped", pages: ["/employees/hr"], component: "Accordion", mechanism: "markup", severity: "moderate",
    title: "HR unit accordion headings jump to h4",
    description: "The accordion under the \"HR units\" <h2> uses <h4> headings.",
    fixDescription: "Accordion headings are <h3>.",
  },
  {
    id: "employees-hr-units-caption-001", rule: "table-no-caption", pages: ["/employees/hr"], component: "HrPage", mechanism: "markup", severity: "minor",
    title: "Bargaining units table has no caption",
    description: "\"Bargaining units\" is bold text above the table instead of a <caption>.",
    fixDescription: "The title is the table's <caption>.",
  },
  {
    id: "employees-hr-negotiation-contrast-001", rule: "contrast-text-low", pages: ["/employees/hr"], component: "HrPage", mechanism: "css", severity: "serious",
    title: "\"In negotiation\" note is light gray",
    description: "The contract status note is #aaaaaa on white, about 2.3:1.",
    fixDescription: "Uses #555 (about 7.5:1).",
  },
  {
    id: "employees-hr-email-title-001", rule: "title-redundant", pages: ["/employees/hr"], component: "HrPage", mechanism: "markup", severity: "minor",
    title: "HR email link has a title that repeats its text",
    description: "The hr@ email link has a title attribute identical to its text.",
    fixDescription: "Removes the title attribute.",
  },

  // /employees/benefits (M)
  {
    id: "employees-benefits-year-select-001", rule: "select-missing-label", pages: ["/employees/benefits"], component: "BenefitsPage", mechanism: "markup", severity: "critical",
    title: "Plan year dropdown has no label",
    description: "\"Plan year\" is a <span> beside the select, so the select has no accessible name.",
    fixDescription: "The text is a <label for> the select.",
  },
  {
    id: "employees-benefits-medical-headers-001", rule: "table-header-association", pages: ["/employees/benefits"], component: "MedicalTable", mechanism: "markup", severity: "serious",
    title: "Medical plan cells reference missing header ids",
    description: "Cells in the medical premiums table have headers=\"medical-ee\" and so on, but the header cells' ids are \"med-ee\".",
    fixDescription: "Removes the broken headers attributes and uses scope on column and row headers.",
  },
  {
    id: "employees-benefits-recommended-color-001", rule: "color-only-info", pages: ["/employees/benefits"], component: "MedicalTable", mechanism: "markup", severity: "moderate",
    title: "No-premium plans shaded green",
    description: "Plans with a $0 employee-only premium are marked only by a green row background.",
    fixDescription: "Those plans carry a \"No premium\" badge.",
  },
  {
    id: "employees-benefits-medical-reflow-001", rule: "reflow-fixed-dimensions", pages: ["/employees/benefits"], component: "MedicalTable", mechanism: "css", severity: "serious",
    title: "Medical table is clipped on narrow screens",
    description: "The seven-column medical table is a fixed 62rem wide inside a container with overflow: hidden, so on phones or at 400% zoom the right-hand columns are cut off and can't be scrolled to.",
    fixDescription: "The table scrolls horizontally inside its own container.",
  },
  {
    id: "employees-benefits-dental-caption-001", rule: "table-no-caption", pages: ["/employees/benefits"], component: "BenefitsPage", mechanism: "markup", severity: "minor",
    title: "Dental and vision table has no caption",
    description: "The dental and vision table has no caption.",
    fixDescription: "Adds \"Dental and vision plans, monthly employee cost\".",
  },
  {
    id: "employees-benefits-readmore-001", rule: "link-generic", pages: ["/employees/benefits"], component: "BenefitsPage", mechanism: "markup", severity: "minor",
    title: "\"Read more\" link to the benefits summary",
    description: "Under \"Other benefits\", a second link to the benefits summary PDF reads \"Read more\".",
    fixDescription: "The link reads \"Read the full 2026 Benefits Summary\".",
  },

  // /employees/jobs (M)
  {
    id: "employees-jobs-filter-select-001", rule: "select-missing-label", pages: ["/employees/jobs"], component: "JobsPage", mechanism: "markup", severity: "critical",
    title: "Position type filter has no label",
    description: "\"Position type\" is a <span> above the filter select.",
    fixDescription: "The text is a <label for> the select.",
  },
  {
    id: "employees-jobs-count-live-001", rule: "sr-results-no-live-region", pages: ["/employees/jobs"], component: "JobsPage", mechanism: "behavior", severity: "moderate",
    title: "Result count changes silently",
    description: "Changing the filter updates \"Showing N of 21 positions\", but the count isn't a live region.",
    fixDescription: "The count has aria-live=\"polite\".",
  },
  {
    id: "employees-jobs-apply-generic-001", rule: "link-generic", pages: ["/employees/jobs"], component: "JobsPage", mechanism: "markup", severity: "minor",
    title: "Every posting says \"Apply here\"",
    description: "Each posting's application link reads \"Apply here\".",
    fixDescription: "Links read \"Apply for <title> (#<job id>)\".",
  },
  {
    id: "employees-jobs-closing-color-001", rule: "color-only-info", pages: ["/employees/jobs"], component: "JobsPage", mechanism: "markup", severity: "moderate",
    title: "Closing-soon dates shown in red only",
    description: "Postings that close within two weeks are marked only by a red closing date.",
    fixDescription: "Adds \"(Closing soon)\" after the date.",
  },
  {
    id: "employees-jobs-eeo-small-001", rule: "text-small", pages: ["/employees/jobs"], component: "JobsPage", mechanism: "css", severity: "minor",
    title: "Equal opportunity statement at 10px",
    description: "The EEO and accommodation statement, including the number to call for accommodations, is 10px text.",
    fixDescription: "Uses the body size.",
  },

  // /employees/policies (M)
  {
    id: "employees-policies-heading-empty-001", rule: "heading-empty", pages: ["/employees/policies"], component: "PoliciesPage", mechanism: "markup", severity: "moderate",
    title: "Empty heading above the policy table",
    description: "The CMS table title block was left blank, leaving an empty <h2>.",
    fixDescription: "The heading reads \"Policy index\".",
  },
  {
    id: "employees-policies-table-caption-001", rule: "table-no-caption", pages: ["/employees/policies"], component: "PoliciesPage", mechanism: "markup", severity: "minor",
    title: "Policy table has no caption",
    description: "The policy index table has no caption.",
    fixDescription: "Adds \"Employment policies and executive memoranda\".",
  },
  {
    id: "employees-policies-revised-contrast-001", rule: "contrast-text-low", pages: ["/employees/policies"], component: "PoliciesPage", mechanism: "css", severity: "serious",
    title: "Old revision years are grayed out",
    description: "Revision years before 2020 are #b0b0b0 on white, about 2.2:1.",
    fixDescription: "Uses the standard text color.",
  },
  {
    id: "employees-policies-clickhere-001", rule: "link-generic", pages: ["/employees/policies"], component: "PoliciesPage", mechanism: "markup", severity: "minor",
    title: "\"Click here to download policies (PDF)\"",
    description: "The policy collection download link starts with \"Click here\".",
    fixDescription: "The link reads \"Employee policy collection (PDF, 2 KB)\".",
  },
  {
    id: "employees-policies-emergency-newwindow-001", rule: "link-new-window", pages: ["/employees/policies"], component: "PoliciesPage", mechanism: "markup", severity: "minor",
    title: "Emergency Guide opens a new tab without warning",
    description: "The Emergency Guide PDF link uses target=\"_blank\" with no warning.",
    fixDescription: "Adds \"(opens in a new tab)\".",
  },
  {
    id: "employees-policies-conduct-doc-001", rule: "link-document", pages: ["/employees/policies"], component: "PoliciesPage", mechanism: "markup", severity: "minor",
    title: "Student Conduct Code link doesn't say it's a PDF",
    description: "\"Student Conduct Code\" downloads a PDF with no file type or size.",
    fixDescription: "Appends \"(PDF, 2 KB)\".",
  },

  // /employees/payroll (M)
  {
    id: "employees-payroll-print-empty-001", rule: "button-empty", pages: ["/employees/payroll"], component: "IconButton", mechanism: "markup", severity: "critical",
    title: "Print button is an unnamed icon",
    description: "The printer button next to the pay schedule heading contains only a hidden glyph.",
    fixDescription: "Adds hidden text \"Print the pay schedule\".",
  },
  {
    id: "employees-payroll-current-color-001", rule: "color-only-info", pages: ["/employees/payroll"], component: "PayrollPage", mechanism: "markup", severity: "moderate",
    title: "Current pay period is highlighted only",
    description: "The current pay period row is marked only by a yellow background.",
    fixDescription: "The row header says \"(current)\".",
  },
  {
    id: "employees-payroll-forms-heading-001", rule: "heading-possible", pages: ["/employees/payroll"], component: "PayrollPage", mechanism: "markup", severity: "moderate",
    title: "\"Forms\" is a bold paragraph",
    description: "The Forms section title is <p><strong>, not a heading.",
    fixDescription: "It is an <h2>.",
  },
  {
    id: "employees-payroll-noon-underline-001", rule: "underline-non-link", pages: ["/employees/payroll"], component: "PayrollPage", mechanism: "markup", severity: "minor",
    title: "Underlined \"noon\" looks like a link",
    description: "The deadline callout underlines \"noon\" for emphasis.",
    fixDescription: "Uses bold for emphasis.",
  },
  {
    id: "employees-payroll-cells-spacing-001", rule: "text-spacing-breaks", pages: ["/employees/payroll"], component: "PayrollPage", mechanism: "css", severity: "moderate",
    title: "Pay schedule cells clip with custom text spacing",
    description: "The schedule uses a fixed table layout with no wrapping and overflow: hidden on cells, so dates are cut off when users increase letter or word spacing.",
    fixDescription: "Cells size to their content.",
  },

  // /employees/directory (H)
  {
    id: "employees-directory-headers-001", rule: "table-header-association", pages: ["/employees/directory"], component: "LetterTable", mechanism: "markup", severity: "serious",
    title: "Directory cells reference missing header ids",
    description: "Each directory table's cells use headers=\"A-name\" and so on, while the header ids are \"dir-A-name\".",
    fixDescription: "Removes the broken headers attributes; names become row headers and columns use scope.",
  },
  {
    id: "employees-directory-email-empty-001", rule: "link-empty", pages: ["/employees/directory"], component: "LetterTable", mechanism: "markup", severity: "serious",
    title: "Email column links are icon-only",
    description: "Every email link in the directory is an envelope icon with no text, about 150 unnamed links.",
    fixDescription: "Adds hidden text such as \"Email Denise Carter, Ph.D.\".",
  },
  {
    id: "employees-directory-describedby-001", rule: "aria-broken-reference", pages: ["/employees/directory"], component: "LetterTable", mechanism: "markup", severity: "serious",
    title: "Tables described by a missing id",
    description: "Each table has aria-describedby=\"directory-help\", but the help paragraph's id is \"dir-help\".",
    fixDescription: "The help paragraph's id matches the reference.",
  },
  {
    id: "employees-directory-caption-001", rule: "table-no-caption", pages: ["/employees/directory"], component: "LetterTable", mechanism: "markup", severity: "minor",
    title: "Letter tables have no captions",
    description: "The directory is split into one table per letter, and none has a caption.",
    fixDescription: "Each table has a caption such as \"Faculty and staff, last names beginning with C\".",
  },
  {
    id: "employees-directory-letter-heading-001", rule: "heading-skipped", pages: ["/employees/directory"], component: "LetterTable", mechanism: "markup", severity: "moderate",
    title: "Letter headings jump to h4",
    description: "Letter headings (A, B, C…) are <h4> under the \"Faculty and staff A–Z\" <h2>.",
    fixDescription: "Letter headings are <h3>.",
  },
  {
    id: "employees-directory-letter-links-001", rule: "link-javascript", pages: ["/employees/directory"], component: "DirectoryPage", mechanism: "markup", severity: "minor",
    title: "Empty letters are href=\"#\" links",
    description: "Letters with no entries in the A–Z bar are still links, to \"#\", which jump to the top of the page.",
    fixDescription: "Empty letters are plain text.",
  },
  {
    id: "employees-directory-profile-newwindow-001", rule: "link-new-window", pages: ["/employees/directory"], component: "LetterTable", mechanism: "markup", severity: "minor",
    title: "Profile links open new tabs without warning",
    description: "Names with a faculty profile open it in a new tab, with no warning.",
    fixDescription: "Adds \"(opens in a new tab)\".",
  },
  {
    id: "employees-directory-location-small-001", rule: "text-small", pages: ["/employees/directory"], component: "LetterTable", mechanism: "css", severity: "minor",
    title: "Location column at 10px",
    description: "Building and room numbers are 10px text.",
    fixDescription: "Uses the table text size.",
  },
  {
    id: "employees-directory-focus-001", rule: "focus-indicator-missing", pages: ["/employees/directory"], component: "DirectoryPage", mechanism: "css", severity: "serious",
    title: "Directory links hide the focus outline",
    description: "Every link on the directory page, including the A–Z bar and the tables, sets outline: none on focus.",
    fixDescription: "Restores a visible focus outline.",
  },
  {
    id: "employees-directory-search-placeholder-001", rule: "placeholder-as-label", pages: ["/employees/directory"], component: "DirectoryPage", mechanism: "markup", severity: "moderate",
    title: "Directory search box is labeled only by its placeholder",
    description: "The name search box has no label; its only hint is the placeholder \"Name or title\", which disappears once you type.",
    fixDescription: "Adds a visible <label for> (\"Name or title\").",
  },
  {
    id: "employees-directory-count-live-001", rule: "sr-results-no-live-region", pages: ["/employees/directory"], component: "DirectoryPage", mechanism: "behavior", severity: "moderate",
    title: "Directory result count changes silently",
    description: "Typing a name or choosing a department filters the tables and updates \"N people found\", but the count isn't a live region.",
    fixDescription: "The count has role=\"status\".",
  },
  {
    id: "employees-directory-reflow-001", rule: "reflow-horizontal-scroll", pages: ["/employees/directory"], component: "LetterTable", mechanism: "css", severity: "serious",
    title: "Directory tables force the page to scroll sideways",
    description: "The tables have min-width: 58rem and their wrappers don't scroll, so the whole page scrolls horizontally on phones and at 400% zoom.",
    fixDescription: "Each table scrolls inside its own container.",
  },
];
