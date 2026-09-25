import type { ScenarioDef } from "./types";

// Giving (foundation site). /giving/donate is a plan 06/07 terrible page and registers its own scenarios.
// CSS scenarios live in src/styles/sections/foundation.css.
export const givingScenarios: ScenarioDef[] = [
  // /giving (M)
  {
    id: "giving-home-meter-value-001", rule: "aria-invalid-value", pages: ["/giving"], component: "GivingPage", mechanism: "markup", severity: "serious",
    title: "Campaign progress bar has aria-valuenow=\"56%\"",
    description: "The Wide Branches progress bar sets aria-valuenow to the string \"56%\" and no aria-valuemax, so its value is invalid.",
    fixDescription: "aria-valuenow=\"56\" with aria-valuemax=\"100\" and an aria-valuetext of \"$141 million of $250 million (56%)\".",
  },
  {
    id: "giving-home-ways-heading-001", rule: "heading-skipped", pages: ["/giving"], component: "GivingPage", mechanism: "markup", severity: "moderate",
    title: "\"Ways to give\" items jump to h4",
    description: "Each way to give is an <h4> directly under the \"Ways to give\" <h2>.",
    fixDescription: "Items are <h3>.",
  },
  {
    id: "giving-home-ways-generic-001", rule: "link-generic", pages: ["/giving"], component: "GivingPage", mechanism: "markup", severity: "minor",
    title: "Six \"Learn more\" links",
    description: "Every way to give ends in a link reading \"Learn more\", and they go to different places.",
    fixDescription: "Links describe the action (\"Start a monthly gift\", \"Set up payroll deduction\").",
  },
  {
    id: "giving-home-stats-contrast-001", rule: "contrast-text-low", pages: ["/giving"], component: "StatsBand", mechanism: "css", severity: "serious",
    title: "White stats on a gold band",
    description: "The giving stats band is white text on the brand gold (#c9a227), about 2.4:1.",
    fixDescription: "The band uses dark text on gold, about 7.2:1.",
  },
  {
    id: "giving-home-tax-small-001", rule: "text-small", pages: ["/giving"], component: "GivingPage", mechanism: "css", severity: "minor",
    title: "Tax-deductibility note set at 10px",
    description: "The Foundation's 501(c)(3) and tax-deduction note is 10px italic text.",
    fixDescription: "Uses 0.9rem.",
  },

  // /giving/priorities (M)
  {
    id: "giving-priorities-img-alt-001", rule: "img-missing-alt", pages: ["/giving/priorities"], component: "PrioritiesPage", mechanism: "markup", severity: "critical",
    title: "Priority photos have no alt attribute",
    description: "The photo on each giving priority has no alt attribute.",
    fixDescription: "Adds alt text describing each photo.",
  },
  {
    id: "giving-priorities-give-duplicate-001", rule: "link-nearby-duplicate", pages: ["/giving/priorities"], component: "PrioritiesPage", mechanism: "markup", severity: "moderate",
    title: "Five \"Give now\" buttons go to different funds",
    description: "Every priority has a \"Give now\" link, each preselecting a different fund, so a links list shows five identical names.",
    fixDescription: "Each reads \"Give to <fund name>\".",
  },
  {
    id: "giving-priorities-readmore-001", rule: "link-generic", pages: ["/giving/priorities"], component: "PrioritiesPage", mechanism: "markup", severity: "minor",
    title: "\"Read more\" under First-Generation Scholars",
    description: "The First-Generation Scholars priority links to its news story with \"Read more\".",
    fixDescription: "The link reads \"Read about the First-Generation Scholars expansion\".",
  },
  {
    id: "giving-priorities-give-focus-001", rule: "focus-indicator-missing", pages: ["/giving/priorities"], component: "PrioritiesPage", mechanism: "css", severity: "serious",
    title: "Give buttons have no focus indicator",
    description: "The gold Give buttons set outline: none and change nothing on focus.",
    fixDescription: "Restores a visible focus outline.",
  },
  {
    id: "giving-priorities-title-clip-001", rule: "reflow-clipped-text", pages: ["/giving/priorities"], component: "PrioritiesPage", mechanism: "css", severity: "moderate",
    title: "Priority titles clip at larger text sizes",
    description: "Priority titles sit in a fixed 1.6em-high box with overflow: hidden, so long names (\"Institute for Coastal Forest Resilience\") lose their second line on narrow screens or at 200% text.",
    fixDescription: "Titles grow with their content.",
  },

  // /giving/alumni (M)
  {
    id: "giving-alumni-photo-title-001", rule: "img-title-attr", pages: ["/giving/alumni"], component: "GivingAlumniPage", mechanism: "markup", severity: "minor",
    title: "Reunion photo carries a file-name title attribute",
    description: "The reunion photo has title=\"Homecoming_2025_reunion_tent\", copied from the media library, which shows as a tooltip and may be read aloud.",
    fixDescription: "Removes the title attribute.",
  },
  {
    id: "giving-alumni-challenges-heading-001", rule: "heading-possible", pages: ["/giving/alumni"], component: "GivingAlumniPage", mechanism: "markup", severity: "moderate",
    title: "\"Class gift challenges\" is a bold paragraph",
    description: "The section title is <p><strong>, not a heading.",
    fixDescription: "It is an <h2>.",
  },
  {
    id: "giving-alumni-table-caption-001", rule: "table-no-caption", pages: ["/giving/alumni"], component: "GivingAlumniPage", mechanism: "markup", severity: "minor",
    title: "Challenge table has no caption",
    description: "\"2026 Homecoming challenges\" is bold text above the table, not a <caption>.",
    fixDescription: "The title is the table's <caption>.",
  },
  {
    id: "giving-alumni-share-empty-001", rule: "button-empty", pages: ["/giving/alumni"], component: "IconButton", mechanism: "markup", severity: "critical",
    title: "Share button is an unnamed link icon",
    description: "The copy-link button next to \"Share the challenge\" contains only a hidden icon.",
    fixDescription: "Adds hidden text \"Copy link to this page\".",
  },

  // /giving/scholarships (M)
  {
    id: "giving-scholarships-duplicate-id-001", rule: "duplicate-id", pages: ["/giving/scholarships"], component: "ScholarshipsPage", mechanism: "markup", severity: "serious",
    title: "Two headings share id=\"scholarship-levels\"",
    description: "The \"How to establish a scholarship\" section was copied from \"Funding levels\" and kept its heading id, so both sections are labelled by the same duplicated id.",
    fixDescription: "The second heading has its own id (\"scholarship-steps\").",
  },
  {
    id: "giving-scholarships-underline-001", rule: "underline-non-link", pages: ["/giving/scholarships"], component: "ScholarshipsPage", mechanism: "markup", severity: "minor",
    title: "\"In perpetuity\" is underlined for emphasis",
    description: "The phrase \"in perpetuity\" is underlined, so it looks like a link.",
    fixDescription: "Uses italics for emphasis.",
  },
  {
    id: "giving-scholarships-clickhere-001", rule: "link-generic", pages: ["/giving/scholarships"], component: "ScholarshipsPage", mechanism: "markup", severity: "minor",
    title: "\"Click here to learn more\" link",
    description: "A link back to the giving home page reads \"Click here to learn more\".",
    fixDescription: "The link reads \"Other ways to give to Redwood State\".",
  },
  {
    id: "giving-scholarships-table-reflow-001", rule: "reflow-horizontal-scroll", pages: ["/giving/scholarships"], component: "ScholarshipsPage", mechanism: "css", severity: "serious",
    title: "Funding levels table forces a 48rem width",
    description: "The funding table has min-width: 48rem and its wrapper doesn't scroll, so the whole page scrolls sideways at 320 CSS px.",
    fixDescription: "The table is fluid inside a scrolling wrapper.",
  },
  {
    id: "giving-scholarships-updated-contrast-001", rule: "contrast-text-low", pages: ["/giving/scholarships"], component: "ScholarshipsPage", mechanism: "css", severity: "moderate",
    title: "\"Updated\" note is pale gold",
    description: "The \"Updated Fall 2020\" note is #c8b98a on white, about 2:1.",
    fixDescription: "Uses the muted text color.",
  },

  // /giving/campaigns (M)
  {
    id: "giving-campaigns-bars-state-001", rule: "sr-visual-only-state", pages: ["/giving/campaigns"], component: "CampaignsPage", mechanism: "markup", severity: "serious",
    title: "Priority progress bars are visual only",
    description: "Each priority's progress is a colored bar width with no text, role or value, so screen readers get only the priority name.",
    fixDescription: "Bars are role=\"progressbar\" with a name, value and valuetext (\"$68.2M of $110M (62%)\").",
  },
  {
    id: "giving-campaigns-bars-motion-001", rule: "motion-ignores-reduced-motion", pages: ["/giving/campaigns"], component: "CampaignsPage", mechanism: "css", severity: "minor",
    title: "Progress bars animate regardless of reduced motion",
    description: "The bars sweep in from zero on load even when the user has asked for reduced motion.",
    fixDescription: "The animation is off under prefers-reduced-motion.",
  },
  {
    id: "giving-campaigns-plan-newwindow-001", rule: "link-new-window", pages: ["/giving/campaigns"], component: "CampaignsPage", mechanism: "markup", severity: "minor",
    title: "Strategic Plan link opens a new tab without warning",
    description: "The link to Strategic Plan 2030 uses target=\"_blank\" with no warning.",
    fixDescription: "Adds \"(opens in a new tab)\".",
  },
  {
    id: "giving-campaigns-video-title-001", rule: "iframe-missing-title", pages: ["/giving/campaigns"], component: "VideoEmbed", mechanism: "markup", severity: "serious",
    title: "Campaign video frame has no title",
    description: "The campaign launch video iframe has no title attribute.",
    fixDescription: "Adds title=\"Wide Branches campaign launch\".",
  },
  {
    id: "giving-campaigns-givingday-heading-001", rule: "heading-skipped", pages: ["/giving/campaigns"], component: "CampaignsPage", mechanism: "markup", severity: "moderate",
    title: "\"Giving Day\" jumps to h5",
    description: "The Giving Day heading inside the callout is an <h5> after the page's <h2> sections.",
    fixDescription: "It is an <h3>.",
  },
];
