import type { ScenarioDef } from "./types";

// ---------- /faculty/:slug: defects vary by profile ----------
// Profiles are edited by each department's web liaison, so some are clean and some carry years of drift.
// Profiles not listed here have only the section template defects (L); the heaviest reach M.
export type ProfileDefect =
  | "photoMissingAlt" | "photoFilenameAlt" | "fakeHeadings" | "emailGeneric" | "websiteNewWindow" | "updatedSmall" | "officeContrast";

export const profileDefects: Record<string, ProfileDefect[]> = {
  "anjali-raman": ["websiteNewWindow"],
  "marcus-bell": ["photoMissingAlt"],
  "kenji-watanabe": ["photoFilenameAlt", "officeContrast"],
  "denise-carter": ["emailGeneric"],
  "hannah-lindqvist": ["photoFilenameAlt", "fakeHeadings", "emailGeneric", "updatedSmall", "officeContrast"],
  "james-oconnell": ["photoMissingAlt", "fakeHeadings", "emailGeneric"],
  "harold-mensah": ["photoMissingAlt", "fakeHeadings", "emailGeneric", "officeContrast"],
  "carmen-ruiz": ["photoMissingAlt"],
  "olga-petrova": ["officeContrast"],
  "samuel-adeyemi": ["photoFilenameAlt", "emailGeneric"],
  "miguel-santos": ["photoFilenameAlt"],
  "fatima-haddad": ["photoMissingAlt", "officeContrast"],
  "rebecca-stein": ["emailGeneric"],
  "patricia-nguyen": ["photoFilenameAlt", "fakeHeadings"],
};

export const profileScenarioId: Record<ProfileDefect, string> = {
  photoMissingAlt: "faculty-profile-photo-alt-001",
  photoFilenameAlt: "faculty-profile-photo-alt-suspicious-001",
  fakeHeadings: "faculty-profile-fake-headings-001",
  emailGeneric: "faculty-profile-email-link-generic-001",
  websiteNewWindow: "faculty-profile-website-new-window-001",
  updatedSmall: "faculty-profile-updated-small-001",
  officeContrast: "faculty-profile-contact-contrast-001",
};

const profilesWith = (d: ProfileDefect) =>
  Object.entries(profileDefects).filter(([, ds]) => ds.includes(d)).map(([slug]) => `/faculty/${slug}`);

type ProfileDef = Omit<ScenarioDef, "id" | "pages" | "component">;
const profileDefs: Record<ProfileDefect, ProfileDef> = {
  photoMissingAlt: {
    rule: "img-missing-alt",
    title: "Profile headshot has no alt attribute",
    description: "The headshot at the top of the profile has no alt attribute.",
    fixDescription: "Adds alt text describing the headshot.",
    mechanism: "markup",
    severity: "critical",
  },
  photoFilenameAlt: {
    rule: "alt-suspicious",
    title: "Profile headshot alt text is a file name",
    description: "The headshot's alt text is the uploaded file name (for example \"lindqvist_headshot_2019.jpg\").",
    fixDescription: "Uses alt text describing the headshot.",
    mechanism: "markup",
    severity: "minor",
  },
  fakeHeadings: {
    rule: "heading-possible",
    title: "Profile section titles are bold text, not headings",
    description: "Biography, Research Interests, Education and the other section titles are bold paragraphs, so the profile has no heading structure below the name.",
    fixDescription: "Uses <h2> headings.",
    mechanism: "markup",
    severity: "moderate",
  },
  emailGeneric: {
    rule: "link-generic",
    title: "Email link says \"click here\"",
    description: "The contact card's email link reads \"Click here to email\" instead of the address.",
    fixDescription: "Shows the email address as the link text.",
    mechanism: "markup",
    severity: "moderate",
  },
  websiteNewWindow: {
    rule: "link-new-window",
    title: "Lab website link opens a new tab without warning",
    description: "The lab website link has target=\"_blank\" with no indication that it opens a new tab.",
    fixDescription: "Adds \"(opens in a new tab)\" to the link.",
    mechanism: "markup",
    severity: "minor",
  },
  updatedSmall: {
    rule: "text-small",
    title: "\"Last updated\" note is 10px",
    description: "The page-updated note at the bottom of the profile is set at 10px.",
    fixDescription: "Uses the standard small text size (0.9rem).",
    mechanism: "css",
    severity: "minor",
  },
  officeContrast: {
    rule: "contrast-text-low",
    title: "Contact card text has low contrast",
    description: "This profile's contact card uses a light gray (#a3a39b) for office, hours and phone, about 2.4:1 on the card background.",
    fixDescription: "Uses the body text and muted text colors.",
    mechanism: "css",
    severity: "serious",
  },
};

export const facultyScenarios: ScenarioDef[] = [
  // ---------- /faculty (directory with filters, view toggle and "Load more": plan 06 #4, tier H) ----------
  ...([
    {
      id: "faculty-dir-photo-link-empty-001", rule: "link-empty", mechanism: "markup", severity: "serious",
      title: "Headshot links have no text",
      description: "In card view each headshot is wrapped in a link to the profile, but the image has alt=\"\", so the link has no accessible name.",
      fixDescription: "Removes the extra link; the name link already goes to the profile and the photo stays decorative.",
    },
    {
      id: "faculty-dir-name-label-001", rule: "input-missing-label", mechanism: "markup", severity: "critical",
      title: "Name filter has no label",
      description: "\"Name\" above the first filter box is a <span>, so the input has no accessible name.",
      fixDescription: "The text is a <label for> the input.",
    },
    {
      id: "faculty-dir-region-labelledby-001", rule: "aria-broken-reference", mechanism: "markup", severity: "serious",
      title: "Results region points to a missing heading id",
      description: "The results <section> has aria-labelledby=\"results-heading\", but the heading's id is \"fac-results-heading\", so the reference is broken.",
      fixDescription: "aria-labelledby points at the real heading id.",
    },
    {
      id: "faculty-dir-name-heading-skip-001", rule: "heading-skipped", mechanism: "markup", severity: "moderate",
      title: "Card names skip from h2 to h4",
      description: "In card view each faculty name is an <h4> directly under the \"Faculty\" <h2>.",
      fixDescription: "Names are <h3>.",
    },
    {
      id: "faculty-dir-email-duplicate-001", rule: "link-nearby-duplicate", mechanism: "markup", severity: "minor",
      title: "Every entry's email link says \"Email\"",
      description: "Every card and table row has an \"Email\" link; the same text points to thirty different addresses.",
      fixDescription: "Link text is the email address.",
    },
    {
      id: "faculty-dir-table-caption-001", rule: "table-no-caption", mechanism: "markup", severity: "minor",
      title: "Table view has no caption",
      description: "Switching to table view shows a directory table with no caption.",
      fixDescription: "The table has the caption \"Faculty directory\".",
    },
    {
      id: "faculty-dir-phone-small-001", rule: "text-small", mechanism: "css", severity: "minor",
      title: "Office and phone lines are 10px",
      description: "Office and phone details on each card are set at 10px.",
      fixDescription: "Uses 0.875rem.",
    },
    {
      id: "faculty-dir-title-contrast-001", rule: "contrast-text-low", mechanism: "css", severity: "serious",
      title: "Faculty titles are light gray",
      description: "Academic titles (\"Associate Professor\") on the cards are #a0a09a on white, about 2.6:1.",
      fixDescription: "Uses the muted text color (#5c5c56, about 6.6:1).",
    },
    {
      id: "faculty-dir-name-focus-001", rule: "focus-indicator-missing", mechanism: "css", severity: "serious",
      title: "Name links hide the focus outline",
      description: "Directory name links set outline: none, so keyboard focus is invisible.",
      fixDescription: "Restores a visible focus outline.",
    },
    {
      id: "faculty-dir-count-live-001", rule: "sr-results-no-live-region", mechanism: "behavior", severity: "moderate",
      title: "Filter results change silently",
      description: "Typing in a filter or choosing a department updates the list and \"Showing N of 30 faculty\" immediately, but nothing is announced.",
      fixDescription: "The count is a role=\"status\" live region.",
    },
    {
      id: "faculty-dir-view-toggle-color-001", rule: "color-only-info", mechanism: "markup", severity: "moderate",
      title: "Selected view shown by color only",
      description: "The Cards / Table buttons show the current view only with a green background, and don't expose aria-pressed.",
      fixDescription: "The buttons have aria-pressed, and the selected one is bold with a thick underline.",
    },
    {
      id: "faculty-dir-load-more-focus-001", rule: "focus-lost-on-update", mechanism: "behavior", severity: "serious",
      title: "\"Load more\" doesn't move focus",
      description: "\"Load more\" appends entries but leaves focus on the button, below the new entries; when the last batch loads the button disappears and focus falls back to the top of the page.",
      fixDescription: "Focus moves to the first newly loaded entry's name link.",
    },
  ] satisfies Omit<ScenarioDef, "pages" | "component">[]).map((s): ScenarioDef => ({ ...s, pages: ["/faculty"], component: "FacultyDirectory" })),

  // ---------- /faculty/:slug ----------
  ...(Object.keys(profileDefs) as ProfileDefect[]).map((d): ScenarioDef => ({
    ...profileDefs[d],
    id: profileScenarioId[d],
    pages: profilesWith(d),
    component: "ProfilePage",
  })),
];
