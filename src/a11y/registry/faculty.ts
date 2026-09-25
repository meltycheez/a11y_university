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
  // ---------- /faculty (static directory; search and filters are plan 06) ----------
  {
    id: "faculty-dir-photo-link-empty-001",
    rule: "link-empty",
    title: "Headshot links have no text",
    description: "Each headshot is wrapped in a link to the profile, but the image has alt=\"\", so the link has no accessible name.",
    fixDescription: "Removes the extra link; the name link already goes to the profile and the photo stays decorative.",
    pages: ["/faculty"],
    component: "FacultyDirectory",
    mechanism: "markup",
    severity: "serious",
  },
  {
    id: "faculty-dir-region-labelledby-001",
    rule: "aria-broken-reference",
    title: "Department sections point to missing heading ids",
    description: "Each department <section> has aria-labelledby=\"dept-…\", but the headings' ids end in \"-heading\", so the reference is broken.",
    fixDescription: "aria-labelledby points at the real heading id.",
    pages: ["/faculty"],
    component: "FacultyDirectory",
    mechanism: "markup",
    severity: "serious",
  },
  {
    id: "faculty-dir-dept-heading-skip-001",
    rule: "heading-skipped",
    title: "Department headings skip from h1 to h4",
    description: "Department group headings are <h4>, directly under the page <h1> and the index <h2>.",
    fixDescription: "Uses <h2>.",
    pages: ["/faculty"],
    component: "FacultyDirectory",
    mechanism: "markup",
    severity: "moderate",
  },
  {
    id: "faculty-dir-email-duplicate-001",
    rule: "link-nearby-duplicate",
    title: "Thirty links all say \"Email\"",
    description: "Every directory entry has an \"Email\" link; the same text points to thirty different addresses.",
    fixDescription: "Link text is the email address.",
    pages: ["/faculty"],
    component: "FacultyDirectory",
    mechanism: "markup",
    severity: "minor",
  },
  {
    id: "faculty-dir-phone-small-001",
    rule: "text-small",
    title: "Office and phone lines are 10px",
    description: "Office and phone details in each entry are set at 10px.",
    fixDescription: "Uses 0.875rem.",
    pages: ["/faculty"],
    component: "FacultyDirectory",
    mechanism: "css",
    severity: "minor",
  },
  {
    id: "faculty-dir-title-contrast-001",
    rule: "contrast-text-low",
    title: "Faculty titles are light gray",
    description: "Academic titles (\"Associate Professor\") are #a0a09a on white, about 2.6:1.",
    fixDescription: "Uses the muted text color (#5c5c56, about 6.6:1).",
    pages: ["/faculty"],
    component: "FacultyDirectory",
    mechanism: "css",
    severity: "serious",
  },
  {
    id: "faculty-dir-name-focus-001",
    rule: "focus-indicator-missing",
    title: "Name links hide the focus outline",
    description: "Directory name links set outline: none, so keyboard focus is invisible.",
    fixDescription: "Restores a visible focus outline.",
    pages: ["/faculty"],
    component: "FacultyDirectory",
    mechanism: "css",
    severity: "serious",
  },

  // ---------- /faculty/:slug ----------
  ...(Object.keys(profileDefs) as ProfileDefect[]).map((d): ScenarioDef => ({
    ...profileDefs[d],
    id: profileScenarioId[d],
    pages: profilesWith(d),
    component: "ProfilePage",
  })),
];
