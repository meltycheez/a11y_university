import type { ScenarioDef } from "./types";

// About section plus the flagship audience and utility pages (contact, alumni, parents, visitors,
// faculty-staff, accessibility, privacy). CSS scenarios live in src/styles/sections/flagship.css.
export const aboutScenarios: ScenarioDef[] = [
  // /about (L)
  {
    id: "about-overview-readmore-001", rule: "link-generic", pages: ["/about"], component: "AboutPage", mechanism: "markup", severity: "minor",
    title: "\"Read more\" link to the news site",
    description: "The last link in the \"Learn more about RSU\" list reads \"Read more\", which says nothing about where it goes.",
    fixDescription: "The link reads \"Redwood State news\".",
  },
  {
    id: "about-overview-stat-contrast-001", rule: "contrast-text-low", pages: ["/about"], component: "StatsBand", mechanism: "css", severity: "serious",
    title: "Stat labels are faint on the green band",
    description: "The small labels under each figure in the stats band are pale green (#6d9277) on dark green, about 3.3:1.",
    fixDescription: "Labels use near-white text (#f1f5f2), about 10:1.",
  },

  // /about/leadership (M)
  {
    id: "about-leadership-bio-trigger-001", rule: "link-javascript", pages: ["/about/leadership"], component: "LeaderCard", mechanism: "markup", severity: "moderate",
    title: "\"Read bio\" is a href=\"#\" link that opens a dialog",
    description: "Each bio trigger is an <a href=\"#\"> with a click handler, so it is announced as a link, can't be activated with Space, and every one reads just \"Read bio\".",
    fixDescription: "Triggers are <button>s, and each includes the leader's name in hidden text (\"Read bio: David Okafor, Ph.D.\").",
  },
  {
    id: "about-leadership-email-empty-001", rule: "link-empty", pages: ["/about/leadership"], component: "LeaderCard", mechanism: "markup", severity: "serious",
    title: "Envelope email links have no text",
    description: "The email link on each leader card contains only a decorative envelope icon, so it has no accessible name.",
    fixDescription: "Adds hidden text such as \"Email Mei-Lin Chao, Ed.D.\".",
  },
  {
    id: "about-leadership-name-heading-001", rule: "heading-possible", pages: ["/about/leadership"], component: "LeaderCard", mechanism: "markup", severity: "moderate",
    title: "Leader names are bold paragraphs",
    description: "Each leader's name looks like a card heading but is a <p><strong>, so the cabinet can't be navigated by heading.",
    fixDescription: "Names are <h3> headings under \"President's Cabinet\".",
  },
  {
    id: "about-leadership-photo-alt-001", rule: "alt-redundant", pages: ["/about/leadership"], component: "LeaderCard", mechanism: "markup", severity: "minor",
    title: "Headshot alt text repeats the name",
    description: "Each headshot's alt is the leader's name, which the card heading right below already says, so screen readers hear every name twice.",
    fixDescription: "Headshots are decorative (alt=\"\") because the name is adjacent.",
  },
  {
    id: "about-leadership-title-contrast-001", rule: "contrast-text-low", pages: ["/about/leadership"], component: "LeaderCard", mechanism: "css", severity: "serious",
    title: "Job titles are light gray",
    description: "Job titles on the leader cards are #9a9a92 on white, about 2.8:1.",
    fixDescription: "Titles use the muted text token (#5c5c56, about 6.6:1).",
  },
  {
    id: "about-leadership-trigger-focus-001", rule: "focus-indicator-missing", pages: ["/about/leadership"], component: "LeaderCard", mechanism: "css", severity: "serious",
    title: "\"Read bio\" triggers hide their focus ring",
    description: "The bio triggers are styled as pill buttons with outline: none, so keyboard focus is invisible.",
    fixDescription: "Restores a 3px focus outline.",
  },

  // /about/mission (L, deliberately light)
  {
    id: "about-mission-justified-001", rule: "text-justified", pages: ["/about/mission"], component: "MissionPage", mechanism: "css", severity: "minor",
    title: "Mission statement is fully justified",
    description: "The mission statement is set in large justified type, which opens uneven rivers of space between words.",
    fixDescription: "Left-aligns the statement.",
  },

  // /about/history (M)
  {
    id: "about-history-clickhere-001", rule: "link-generic", pages: ["/about/history"], component: "HistoryPage", mechanism: "markup", severity: "minor",
    title: "\"Click here\" link under the archives",
    description: "The last link in \"Explore the archives\" reads \"Click here\".",
    fixDescription: "The link reads \"Visit Sequoia Library\".",
  },
  {
    id: "about-history-year-heading-001", rule: "heading-skipped", pages: ["/about/history"], component: "Timeline", mechanism: "markup", severity: "moderate",
    title: "Timeline years jump from h2 to h4",
    description: "Each year in the timeline is an <h4> directly under the \"Timeline\" <h2>.",
    fixDescription: "Years are <h3>.",
  },
  {
    id: "about-history-timeline-list-001", rule: "list-structure", pages: ["/about/history"], component: "Timeline", mechanism: "markup", severity: "moderate",
    title: "Timeline items are <li> without a list",
    description: "The timeline widget renders <li> elements inside a <div>, so they aren't a list and assistive tech can't report the count.",
    fixDescription: "Wraps the items in an <ol>.",
  },
  {
    id: "about-history-marker-color-001", rule: "color-only-info", pages: ["/about/history"], component: "Timeline", mechanism: "markup", severity: "moderate",
    title: "Name changes and new buildings shown by marker color",
    description: "The legend says gold markers are name changes and green markers are new buildings; nothing else tells the milestones apart.",
    fixDescription: "Those milestones start with a text label (\"Name change:\", \"New building:\").",
  },
  {
    id: "about-history-timeline-reflow-001", rule: "reflow-horizontal-scroll", pages: ["/about/history"], component: "Timeline", mechanism: "css", severity: "serious",
    title: "Timeline has a fixed 60rem width",
    description: "The timeline is set to width: 60rem, so at 320 CSS px (400% zoom) the whole page scrolls sideways.",
    fixDescription: "The timeline is fluid (max-width: 100%).",
  },
  {
    id: "about-history-photo-alt-001", rule: "alt-redundant", pages: ["/about/history"], component: "HistoryPage", mechanism: "markup", severity: "minor",
    title: "Archive photo alt text repeats the caption",
    description: "Each photo in \"Campus through the years\" uses its caption as alt text, so the caption is read twice.",
    fixDescription: "Alt text describes what the photo shows; the caption gives the history.",
  },

  // /about/accreditation (M)
  {
    id: "about-accreditation-readmore-001", rule: "link-generic", pages: ["/about/accreditation"], component: "AccreditationPage", mechanism: "markup", severity: "minor",
    title: "\"Read more\" link to the action letter",
    description: "The reaffirmation paragraph ends with a \"Read more\" link to a PDF.",
    fixDescription: "The link reads \"Read the 2021 Commission action letter\".",
  },
  {
    id: "about-accreditation-letter-doc-001", rule: "link-document", pages: ["/about/accreditation"], component: "AccreditationPage", mechanism: "markup", severity: "minor",
    title: "Action letter link doesn't say it's a PDF",
    description: "\"2021 PACCU Commission Action Letter\" downloads a PDF with no file type or size.",
    fixDescription: "Appends \"(PDF, 2 KB)\".",
  },
  {
    id: "about-accreditation-conduct-newwindow-001", rule: "link-new-window", pages: ["/about/accreditation"], component: "AccreditationPage", mechanism: "markup", severity: "minor",
    title: "Student Conduct Code opens in a new tab without warning",
    description: "The Student Conduct Code link uses target=\"_blank\" and gives no warning.",
    fixDescription: "Adds \"(opens in a new tab)\".",
  },
  {
    id: "about-accreditation-table-headers-001", rule: "table-header-association", pages: ["/about/accreditation"], component: "SpecializedTable", mechanism: "markup", severity: "serious",
    title: "Accreditation table headers point at missing ids",
    description: "The old table widget gives each data cell a headers attribute (\"tbl-acc-program\") that doesn't match the header ids (\"acc-program\").",
    fixDescription: "Removes the broken headers attributes and uses scope on column and row headers.",
  },
  {
    id: "about-accreditation-review-color-001", rule: "color-only-info", pages: ["/about/accreditation"], component: "SpecializedTable", mechanism: "markup", severity: "moderate",
    title: "Upcoming reviews shown in red only",
    description: "Programs with a review before fall 2028 are marked only by red text, as the note under the table explains.",
    fixDescription: "Adds \"(review coming up)\" to those rows.",
  },
  {
    id: "about-accreditation-address-small-001", rule: "text-small", pages: ["/about/accreditation"], component: "AccreditationPage", mechanism: "css", severity: "minor",
    title: "Commission address set at 10px",
    description: "The accreditor's address and verification note is 10px text.",
    fixDescription: "Uses the body size (0.95rem).",
  },

  // /about/strategic-plan (M)
  {
    id: "about-strategic-goals-heading-001", rule: "heading-skipped", pages: ["/about/strategic-plan"], component: "StrategicPlanPage", mechanism: "markup", severity: "moderate",
    title: "\"Goals for 2030\" skips to h4",
    description: "Inside each pillar tab, \"Goals for 2030\" is an <h4> under the \"The four pillars\" <h2>.",
    fixDescription: "The heading is an <h3>.",
  },
  {
    id: "about-strategic-progress-labelledby-001", rule: "aria-broken-reference", pages: ["/about/strategic-plan"], component: "ProgressSection", mechanism: "markup", severity: "serious",
    title: "Progress region labelled by a missing id",
    description: "The progress section has aria-labelledby=\"progress-heading\", but its heading's id is \"progress-title\".",
    fixDescription: "The heading id matches the reference.",
  },
  {
    id: "about-strategic-progress-caption-001", rule: "table-no-caption", pages: ["/about/strategic-plan"], component: "ProgressSection", mechanism: "markup", severity: "minor",
    title: "Key indicators table title is a bold paragraph",
    description: "\"Strategic Plan 2030 key indicators\" sits above the table as bold text, not a <caption>.",
    fixDescription: "The title is the table's <caption>.",
  },
  {
    id: "about-strategic-progress-color-001", rule: "color-only-info", pages: ["/about/strategic-plan"], component: "ProgressSection", mechanism: "markup", severity: "serious",
    title: "On-pace status is a colored dot",
    description: "The Status column shows only a green or amber dot; the cell has no text.",
    fixDescription: "Each status cell says \"On pace\" or \"Behind pace\".",
  },
  {
    id: "about-strategic-stats-clip-001", rule: "reflow-clipped-text", pages: ["/about/strategic-plan"], component: "StatsBand", mechanism: "css", severity: "moderate",
    title: "Plan-at-a-glance tiles clip enlarged text",
    description: "Each stat tile has a fixed height and overflow: hidden, so labels are cut off at 200% text size.",
    fixDescription: "Tiles grow with their content.",
  },

  // /contact (M)
  {
    id: "about-contact-name-placeholder-001", rule: "placeholder-as-label", pages: ["/contact"], component: "ContactForm", mechanism: "markup", severity: "moderate",
    title: "Name field is labelled only by its placeholder",
    description: "\"Your name\" appears only as placeholder text, which disappears as soon as you type.",
    fixDescription: "Adds a visible <label>.",
  },
  {
    id: "about-contact-email-label-001", rule: "input-missing-label", pages: ["/contact"], component: "ContactForm", mechanism: "markup", severity: "critical",
    title: "Email field has no label",
    description: "\"Email address\" is a <span> above the input, so the field has no accessible name.",
    fixDescription: "The text is a <label for> the input.",
  },
  {
    id: "about-contact-topic-select-001", rule: "select-missing-label", pages: ["/contact"], component: "ContactForm", mechanism: "markup", severity: "critical",
    title: "Topic dropdown has no label",
    description: "The Topic <select> has a visible <span> above it but no associated label.",
    fixDescription: "The text is a <label for> the select.",
  },
  {
    id: "about-contact-reply-fieldset-001", rule: "fieldset-missing", pages: ["/contact"], component: "ContactForm", mechanism: "markup", severity: "moderate",
    title: "Reply preference radios aren't grouped",
    description: "The Email and Phone radios follow a plain text question, with no fieldset or legend tying them together.",
    fixDescription: "Wraps the radios in a <fieldset> with the question as its <legend>.",
  },
  {
    id: "about-contact-required-color-001", rule: "color-only-required", pages: ["/contact"], component: "ContactForm", mechanism: "markup", severity: "serious",
    title: "Required fields are marked by red labels",
    description: "\"Fields in red are required\": the only sign a field is required is its red label.",
    fixDescription: "Required labels say \"(required)\" and the note explains it.",
  },
  {
    id: "about-contact-sent-status-001", rule: "sr-status-not-announced", pages: ["/contact"], component: "ContactForm", mechanism: "behavior", severity: "moderate",
    title: "\"Message sent\" confirmation isn't announced",
    description: "After Send, a thank-you message appears below the button, but it isn't in a live region, so screen reader users hear nothing.",
    fixDescription: "The confirmation is inside a role=\"status\" region.",
  },

  // /alumni (M)
  {
    id: "audience-alumni-hero-alt-001", rule: "alt-suspicious", pages: ["/alumni"], component: "Hero", mechanism: "markup", severity: "minor",
    title: "Hero photo alt is its file name",
    description: "The alumni hero photo's alt text is \"reunion_final_v2.jpg\".",
    fixDescription: "Alt describes the photo.",
  },
  {
    id: "audience-alumni-card-redundant-001", rule: "link-redundant", pages: ["/alumni"], component: "FeatureCard", mechanism: "markup", severity: "minor",
    title: "Card photo and title are separate links to the same page",
    description: "In \"Stay connected\", each card's photo and title link to the same page, so keyboard and screen reader users meet every link twice.",
    fixDescription: "Only the title is a link; the photo is decorative.",
  },
  {
    id: "audience-alumni-chapter-hover-001", rule: "event-handler-device", pages: ["/alumni"], component: "Chapter", mechanism: "behavior", severity: "serious",
    detectedBy: { manualOnly: true },
    title: "Chapter contacts appear on mouseover only",
    description: "Each chapter's description and email show only while the mouse is over it; keyboard and touch users can't reveal them. (React attaches the handler by delegation, so tools that look for onmouseover attributes won't see it.)",
    fixDescription: "Chapter names are disclosure buttons with aria-expanded.",
  },
  {
    id: "audience-alumni-video-title-001", rule: "iframe-missing-title", pages: ["/alumni"], component: "VideoEmbed", mechanism: "markup", severity: "serious",
    title: "Homecoming video frame has no title",
    description: "The Homecoming highlights video iframe has no title attribute.",
    fixDescription: "Adds title=\"Homecoming 2025 highlights\".",
  },
  {
    id: "audience-alumni-social-empty-001", rule: "link-empty", pages: ["/alumni"], component: "AlumniPage", mechanism: "markup", severity: "serious",
    title: "Alumni social links are icon-only",
    description: "The PhotoPine, ReelWave and WorkCircle links under \"Follow RSU Alumni\" contain only a hidden glyph, so they have no name.",
    fixDescription: "Adds hidden text such as \"RSU Alumni on PhotoPine\".",
  },
  {
    id: "audience-alumni-badge-contrast-001", rule: "contrast-text-low", pages: ["/alumni"], component: "AlumniPage", mechanism: "css", severity: "serious",
    title: "\"Free membership\" badge is white on gold",
    description: "The badge next to the association heading is white text on gold (#c9a227), about 2.4:1.",
    fixDescription: "The badge uses dark text on gold, about 7.2:1.",
  },

  // /parents (L)
  {
    id: "audience-parents-hero-alt-long-001", rule: "alt-long", pages: ["/parents"], component: "Hero", mechanism: "markup", severity: "minor",
    title: "Hero photo has a paragraph of alt text",
    description: "The hero photo's alt text runs over 350 characters of scene detail.",
    fixDescription: "Uses a one-sentence description.",
  },
  {
    id: "audience-parents-ferpa-doc-001", rule: "link-document", pages: ["/parents"], component: "ParentsPage", mechanism: "markup", severity: "minor",
    title: "FERPA notice link doesn't say it's a PDF",
    description: "\"FERPA notice\" downloads a PDF with no file type or size.",
    fixDescription: "Appends \"(PDF, 2 KB)\".",
  },

  // /visitors (L)
  {
    id: "audience-visitors-tour-title-001", rule: "iframe-missing-title", pages: ["/visitors"], component: "VideoEmbed", mechanism: "markup", severity: "serious",
    title: "Virtual tour frame has no title",
    description: "The virtual campus tour iframe has no title attribute.",
    fixDescription: "Adds title=\"Virtual campus tour\".",
  },
  {
    id: "audience-visitors-transit-newwindow-001", rule: "link-new-window", pages: ["/visitors"], component: "VisitorsPage", mechanism: "markup", severity: "minor",
    title: "Transit link opens a new tab without warning",
    description: "\"Transit routes and schedules\" opens in a new tab with no warning.",
    fixDescription: "Adds \"(opens in a new tab)\".",
  },

  // /faculty-staff (L)
  {
    id: "audience-facstaff-heading-empty-001", rule: "heading-empty", pages: ["/faculty-staff"], component: "FacultyStaffPage", mechanism: "markup", severity: "moderate",
    title: "Empty heading above the quick links",
    description: "The CMS section title was left blank, leaving an empty <h2> above the quick links.",
    fixDescription: "The heading reads \"Quick links\".",
  },

  // /accessibility (L, deliberately light)
  {
    id: "utility-accessibility-updated-small-001", rule: "text-small", pages: ["/accessibility"], component: "AccessibilityPage", mechanism: "css", severity: "minor",
    title: "\"Updated\" date set at 10px",
    description: "The statement's last-updated date is 10px light text at the bottom of the page.",
    fixDescription: "Uses the standard 0.9rem page-updated style.",
  },

  // /policies/privacy (L)
  {
    id: "utility-privacy-underline-001", rule: "underline-non-link", pages: ["/policies/privacy"], component: "PrivacyPage", mechanism: "markup", severity: "minor",
    title: "Underlined law name looks like a link",
    description: "\"California Information Practices Act of 1977\" is underlined with <u> for emphasis and looks like a link.",
    fixDescription: "Uses <strong> for emphasis.",
  },
  {
    id: "utility-privacy-legal-contrast-001", rule: "contrast-text-low", pages: ["/policies/privacy"], component: "PrivacyPage", mechanism: "css", severity: "serious",
    title: "Privacy statement body text is light gray",
    description: "The legal body copy is #8c8c85 on white, about 3.4:1.",
    fixDescription: "Body text uses the standard text color.",
  },
];
