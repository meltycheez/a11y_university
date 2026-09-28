import type { ScenarioDef } from "./types";

type Def = Omit<ScenarioDef, "pages" | "component"> & { severity: NonNullable<ScenarioDef["severity"]> };
const on = (pages: string[], component: string, defs: Def[]): ScenarioDef[] => defs.map((d) => ({ ...d, pages, component }));

// Global search (plan 06 #5): the header box (global chrome, every university page) and /search.
export const searchScenarios: ScenarioDef[] = [
  ...on(["*"], "SiteSearch", [
    { id: "global-search-submit-empty-001", rule: "button-empty", title: "Header search button is an unnamed icon", description: "The magnifier submit button next to the header search box contains only an SVG, so it is announced as \"button\".", fixDescription: "Adds visually hidden \"Search\" text.", mechanism: "markup", severity: "critical" },
    { id: "global-search-suggest-001", rule: "kbd-dropdown-inoperable", title: "Search suggestions work with the mouse only", description: "Typing in the header box opens a list of suggested pages built from clickable <div>s. The input isn't a combobox, the list isn't announced, and arrow keys, Enter and Escape do nothing with it.", fixDescription: "Uses the ARIA combobox pattern: role=\"combobox\" with aria-expanded and aria-activedescendant, a listbox of options, Up/Down to move, Enter to open a page and Escape to close.", mechanism: "behavior", severity: "serious" },
  ]),

  // ---------- /search (tier M) ----------
  ...on(["/search"], "SearchPage", [
    { id: "search-page-placeholder-001", rule: "placeholder-as-label", title: "Search box is labeled only by its placeholder", description: "The results page search box has no visible label; \"Search terms\" is placeholder text that disappears as soon as you type.", fixDescription: "Adds a visible \"Search terms\" label.", mechanism: "markup", severity: "moderate" },
    { id: "search-page-count-live-001", rule: "sr-results-no-live-region", title: "Result count changes silently", description: "\"Searching…\" and \"N results for …\" update in a plain paragraph, so screen reader users aren't told the search finished.", fixDescription: "Makes the count a role=\"status\" live region.", mechanism: "behavior", severity: "moderate" },
    { id: "search-page-facet-state-001", rule: "sr-visual-only-state", title: "Selected type filter shown by color only", description: "The type filter buttons (All, Courses, News…) show the active filter only by a dark fill; they expose no pressed state.", fixDescription: "Adds aria-pressed to each filter button.", mechanism: "markup", severity: "serious" },
    { id: "search-page-facet-label-001", rule: "aria-broken-reference", title: "Filter group label points at a missing id", description: "The filter button group has aria-labelledby=\"search-facets-label\", but no element has that id, so the group has no name.", fixDescription: "Gives the \"Filter by type\" text the referenced id.", mechanism: "markup", severity: "serious" },
    { id: "search-page-didyoumean-001", rule: "link-javascript", title: "\"Did you mean\" is a # link run by script", description: "The spelling suggestion is <a href=\"#\"> with a click handler, so it can't be opened in a new tab or bookmarked, and it goes nowhere without JavaScript.", fixDescription: "Links to /search?q=<suggestion>.", mechanism: "markup", severity: "moderate" },
    { id: "search-page-result-heading-001", rule: "heading-skipped", title: "Result titles jump from h2 to h4", description: "Each result title is an <h4> under its group's <h2>.", fixDescription: "Makes result titles <h3>.", mechanism: "markup", severity: "moderate" },
    { id: "search-page-snippet-contrast-001", rule: "contrast-text-low", title: "Result snippets are pale gray", description: "Result excerpts are #9a9a9a on white (about 2.8:1).", fixDescription: "Uses #767676, just above the 4.5:1 minimum.", mechanism: "css", severity: "serious" },
  ]),
];
