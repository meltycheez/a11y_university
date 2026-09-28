import type { ScenarioDef } from "./types";

// /academics/courses (plan 06 #1, tier H). CSS scenarios live in src/styles/features/courses.css.
const page = { pages: ["/academics/courses"] };

export const coursesScenarios: ScenarioDef[] = [
  {
    id: "courses-keyword-label-001", rule: "input-missing-label", ...page, component: "CourseSearchForm", mechanism: "markup", severity: "critical",
    title: "Keyword search box has no label",
    description: "\"Keyword\" above the search box is a <span>, not a <label>, and the input has no placeholder or aria-label, so it has no accessible name.",
    fixDescription: "The text is a <label for> the input.",
  },
  {
    id: "courses-semester-select-001", rule: "select-missing-label", ...page, component: "CourseSearchForm", mechanism: "markup", severity: "critical",
    title: "Semester filter has no label",
    description: "The semester <select> sits next to \"Semester\" text that isn't associated with it, so it has no accessible name.",
    fixDescription: "The text is a <label for> the select.",
  },
  {
    id: "courses-add-button-empty-001", rule: "button-empty", ...page, component: "CourseRow", mechanism: "markup", severity: "critical",
    title: "\"Add to plan\" buttons are unnamed icons",
    description: "Each course row's add (+) and remove (−) buttons contain only a glyph, so every one is announced as just \"button\".",
    fixDescription: "Adds hidden text such as \"Add CS 101 to plan\".",
  },
  {
    id: "courses-facets-fieldset-001", rule: "fieldset-missing", ...page, component: "CourseFacets", mechanism: "markup", severity: "moderate",
    title: "Level and credits checkboxes aren't grouped",
    description: "The Level and Credits facets are bold paragraphs followed by checkboxes, with no <fieldset> or <legend>, so a checkbox like \"4\" has no context.",
    fixDescription: "Each facet is a <fieldset> with a <legend>.",
  },
  {
    id: "courses-sections-caption-001", rule: "table-no-caption", ...page, component: "CourseRow", mechanism: "markup", severity: "minor",
    title: "Section tables have no caption",
    description: "The class sections table inside each expanded course has no caption saying which course it lists.",
    fixDescription: "Each table has a caption such as \"Sections of CS 101\".",
  },
  {
    id: "courses-results-live-001", rule: "sr-results-no-live-region", ...page, component: "CourseResults", mechanism: "behavior", severity: "moderate",
    title: "Result count changes silently",
    description: "After a search or filter change the results reload (with a short \"Searching…\" delay) and \"Showing 1–20 of N courses\" updates, but nothing is announced.",
    fixDescription: "The count is a role=\"status\" live region.",
  },
  {
    id: "courses-expand-state-001", rule: "sr-accordion-state", ...page, component: "CourseRow", mechanism: "markup", severity: "moderate",
    title: "Course row toggles don't expose their state",
    description: "Course titles are buttons that show and hide the course details, but they have no aria-expanded or aria-controls, so screen readers can't tell whether a row is open.",
    fixDescription: "Buttons have aria-expanded and aria-controls pointing at the details.",
  },
  {
    id: "courses-add-status-001", rule: "sr-status-not-announced", ...page, component: "Toast", mechanism: "behavior", severity: "moderate",
    title: "\"Added to plan\" message isn't announced",
    description: "Adding a course shows a toast (\"CS 101 added to your plan\") that isn't a live region and disappears after 3 seconds.",
    fixDescription: "The toast is a persistent role=\"status\" region with a Dismiss button.",
  },
  {
    id: "courses-plan-remove-focus-001", rule: "focus-lost-on-update", ...page, component: "CoursePlan", mechanism: "behavior", severity: "serious",
    title: "Removing a planned course drops focus",
    description: "The Remove button in \"My course plan\" disappears with its course, so keyboard focus falls back to the top of the page.",
    fixDescription: "Focus moves to the \"My course plan\" heading after a removal.",
  },
  {
    id: "courses-seats-color-001", rule: "color-only-info", ...page, component: "CourseRow", mechanism: "markup", severity: "moderate",
    title: "Full sections shown in red only",
    description: "In the sections table, a full section's seat count is simply colored red.",
    fixDescription: "Full sections say \"Full\" (and the waitlist size) next to the count.",
  },
  {
    id: "courses-prereq-contrast-001", rule: "contrast-text-low", ...page, component: "CourseRow", mechanism: "css", severity: "serious",
    title: "Prerequisite line is light gray",
    description: "The prerequisites line in each course's details is #9a9a94 on white, about 2.8:1.",
    fixDescription: "Uses #767676, just above the 4.5:1 minimum.",
  },
];
