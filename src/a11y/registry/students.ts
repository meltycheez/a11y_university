import type { RuleKey } from "../rules";
import type { ScenarioDef } from "./types";

type Mech = ScenarioDef["mechanism"];
type Sev = NonNullable<ScenarioDef["severity"]>;
const d = (id: string, rule: RuleKey, pages: string | string[], component: string, mechanism: Mech, severity: Sev, title: string, description: string, fixDescription: string): ScenarioDef =>
  ({ id, rule, pages: Array.isArray(pages) ? pages : [pages], component, mechanism, severity, title, description, fixDescription });

// Student Affairs services pages (ServicePage template).
export const studentsScenarios: ScenarioDef[] = [
  // /students
  d("stu-hub-quicklinks-empty-001", "link-empty", "/students", "StudentsHome", "markup", "serious",
    "Quick link icons have no text", "The RedwoodConnect, Canopy Learn, email and map quick links contain only aria-hidden icon glyphs.", "Adds a visible label under each icon."),
  d("stu-hub-quicklinks-focus-001", "focus-indicator-missing", "/students", "StudentsHome", "css", "serious",
    "Quick links hide the focus outline", "The round quick link icons set outline: none on focus.", "Restores a visible focus ring."),
  d("stu-hub-tile-redundant-001", "link-redundant", "/students", "StudentsHome", "markup", "minor",
    "Service tiles link twice to the same page", "Each popular service tile has a photo link and a title link to the same URL, both named the same.", "Combines photo and title into one link."),
  d("stu-hub-group-heading-001", "heading-possible", "/students", "StudentsHome", "markup", "moderate",
    "Resource group titles are bold text", "\"Academics\", \"Health and wellness\" and the other group titles are bold paragraphs, not headings.", "Makes them <h2>."),

  // /students/registrar
  d("stu-registrar-services-caption-001", "table-no-caption", "/students/registrar", "Table", "markup", "minor",
    "Services table has no caption", "The registrar services and fees table has no <caption>.", "Adds a caption."),
  d("stu-registrar-fee-describedby-001", "aria-broken-reference", "/students/registrar", "Registrar", "markup", "serious",
    "Services section describedby points nowhere", "The services section has aria-describedby=\"fee-note-2019\", an id removed in a redesign.", "Points aria-describedby at the fee note below the table."),
  d("stu-registrar-pdf-doc-001", "link-document", "/students/registrar", "Registrar", "markup", "minor",
    "Document links don't say they're PDFs", "The academic calendar, FERPA notice and catalog addendum links open PDFs with no file type or size.", "Adds \"(PDF, 2 KB)\" to each link."),
  d("stu-registrar-updated-small-001", "text-small", "/students/registrar", "ServicePage", "css", "minor",
    "\"Updated\" note is 10px text", "The page's last-updated note is 10px light gray type.", "Uses the standard note size and color."),

  // /students/advising
  d("stu-advising-img-title-001", "img-title-attr", "/students/advising", "Advising", "markup", "minor",
    "Photo has a title tooltip", "The library photo carries a title attribute (\"Sequoia Library reading room\") that shows as a hover tooltip.", "Removes the title attribute."),

  // /students/careers
  d("stu-careers-icons-announced-001", "sr-decorative-announced", "/students/careers", "Careers", "markup", "minor",
    "Emoji icons are read aloud", "Each service in \"What we offer\" starts with an emoji (\"speech balloon\", \"briefcase\"…) that screen readers announce.", "Hides the emoji with aria-hidden."),
  d("stu-careers-owllink-new-window-001", "link-new-window", "/students/careers", "Careers", "markup", "moderate",
    "OwlLink Careers opens a new tab without warning", "The OwlLink Careers link opens a new tab with no indication.", "Adds \"(opens in a new tab)\"."),
  d("stu-careers-fair-img-alt-001", "img-missing-alt", "/students/careers", "Card", "markup", "critical",
    "Career fair card photo has no alt", "The career fair card photo has no alt attribute.", "Adds alt text describing the photo."),
  d("stu-careers-generic-link-001", "link-generic", "/students/careers", "Careers", "markup", "minor",
    "\"Read more\" link", "A \"Read more\" link points to RSU News.", "Uses \"Student career stories in RSU News\"."),

  // /students/counseling
  d("stu-counseling-hours-caption-001", "table-no-caption", "/students/counseling", "Table", "markup", "minor",
    "Hours table has no caption", "The CAPS hours table has no <caption>.", "Adds a caption."),

  // /students/health
  d("stu-health-hero-alt-long-001", "alt-long", "/students/health", "Hero", "markup", "minor",
    "Hero photo has a very long alt", "The decorative hero photo has alt text over 300 characters describing every object in the room.", "Marks the decorative photo alt=\"\"."),
  d("stu-health-nurse-underline-001", "underline-non-link", "/students/health", "Health", "markup", "minor",
    "Underlined text that isn't a link", "\"24/7 nurse advice line\" is underlined with <u> and looks like a link.", "Uses bold instead."),
  d("stu-health-hours-headers-001", "table-header-association", "/students/health", "Table", "markup", "serious",
    "Hours table headers attributes point to missing ids", "Health Center hours cells use headers ids that don't exist in the table.", "Points headers at the real header ids."),
  d("stu-health-closed-contrast-001", "contrast-text-low", "/students/health", "Table", "css", "serious",
    "\"Closed\" cells are pale gray", "\"Closed\" in the hours table is light gray (#b0b0a8) on white, about 2.2:1.", "Uses #767676, just above the 4.5:1 minimum."),
  d("stu-health-portal-js-001", "link-javascript", "/students/health", "Health", "behavior", "moderate",
    "Patient Portal link is href=\"#\" with a popup script", "\"Open the Patient Portal\" is <a href=\"#\"> that opens a popup window from a click handler.", "Uses a real link to the portal."),

  // /students/housing
  d("stu-housing-table-clip-001", "reflow-clipped-text", "/students/housing", "Table", "css", "serious",
    "Residence hall table is cut off when zoomed", "The rates table doesn't wrap and its container hides overflow, so right-hand columns are clipped at 200% zoom or 320px.", "Lets cells wrap and the container scroll."),
  d("stu-housing-llc-heading-001", "heading-skipped", "/students/housing", "Housing", "markup", "moderate",
    "\"Living-learning communities\" skips to h4", "The heading is an <h4> between <h2> sections.", "Makes it an <h2>."),
  d("stu-housing-video-title-001", "iframe-missing-title", "/students/housing", "VideoEmbed", "markup", "serious",
    "Madrone Hall video frame has no title", "The Madrone Hall video iframe has no title attribute.", "Adds a title."),
  d("stu-housing-pdf-doc-001", "link-document", "/students/housing", "Housing", "markup", "minor",
    "Housing contract link doesn't say it's a PDF", "The 2026–27 Housing Contract link opens a PDF with no file type or size.", "Adds \"(PDF, 2 KB)\"."),

  // /students/dining (tier H)
  d("stu-dining-photo-alt-001", "alt-suspicious", "/students/dining", "Dining", "markup", "minor",
    "Dining photo alt is a file name", "The dining commons photo's alt is \"dining_hall_IMG_8834.jpg\".", "Marks it decorative (alt=\"\"); the caption describes it."),
  d("stu-dining-table-caption-001", "table-no-caption", "/students/dining", "Table", "markup", "minor",
    "Meal plan and hours tables have no caption", "The meal plans and the locations tables have no <caption>.", "Adds captions."),
  d("stu-dining-dollars-describedby-001", "aria-broken-reference", "/students/dining", "Dining", "markup", "serious",
    "\"Dining Dollars\" header describedby points nowhere", "The Dining Dollars column header references aria-describedby=\"dd-tooltip\", a tooltip that no longer exists.", "Points it at the Dining Dollars note under the table."),
  d("stu-dining-header-contrast-001", "contrast-text-low", "/students/dining", "Table", "css", "serious",
    "Table headers are white on light green", "Dining table header cells are white on light green (#8cc49a), about 2.0:1.", "Uses #458055, just above the 4.5:1 minimum."),
  d("stu-dining-late-color-001", "color-only-info", "/students/dining", "Dining", "markup", "serious",
    "Late-night locations shown only in purple", "Locations open late are identified only by a purple row tint and a color legend.", "Adds an \"Open late\" tag to those rows and drops the legend."),
  d("stu-dining-truck-new-window-001", "link-new-window", "/students/dining", "Dining", "markup", "moderate",
    "Food truck social link opens a new tab without warning", "The @RSUDining PhotoPine link opens a new tab with no indication.", "Adds \"(opens in a new tab)\"."),
  d("stu-dining-menu-heading-001", "heading-possible", "/students/dining", "Dining", "markup", "moderate",
    "\"This week's menu\" is bold text", "The menu section title is a bold paragraph, not a heading.", "Makes it an <h2>."),
  d("stu-dining-flyer-alt-001", "img-missing-alt", "/students/dining", "Img", "markup", "critical",
    "Hours flyer image has no alt", "The dining hours flyer image has no alt attribute, so its text is unavailable to screen readers.", "Adds alt text with the flyer's hours (short once a text version is shown)."),
  d("stu-dining-flyer-text-001", "text-in-image", "/students/dining", "Dining", "markup", "serious",
    "Hours are posted only as an image of text", "This week's dining hours are a flyer image with no text version on the page; the text can't be resized, restyled or translated.", "Adds a text version of the flyer below the image."),
  d("stu-dining-nutrition-generic-001", "link-generic", "/students/dining", "Dining", "markup", "minor",
    "\"Click here\" nutrition link", "The menu section links \"Click here for nutrition info\".", "Uses \"Nutrition and allergen information\"."),

  // /students/parking (tier H)
  d("stu-parking-hero-alt-001", "img-missing-alt", "/students/parking", "Hero", "markup", "critical",
    "Hero photo has no alt attribute", "The parking hero photo has no alt attribute.", "Adds alt text describing the photo."),
  d("stu-parking-permit-underline-001", "underline-non-link", "/students/parking", "Parking", "markup", "minor",
    "Underlined text that isn't a link", "\"must display a valid permit\" is underlined with <u> for emphasis.", "Uses bold instead."),
  d("stu-parking-buy-div-001", "kbd-div-button", "/students/parking", "BuyPermit", "behavior", "serious",
    "\"Buy a permit\" is a clickable span", "The \"Buy a permit\" button is a styled <span> with a click handler: not focusable, no role.", "Uses a real link to the student account."),
  d("stu-parking-permit-reflow-001", "reflow-horizontal-scroll", "/students/parking", "Table", "css", "serious",
    "Permit table forces page scrolling", "The permit rates table has a 52rem minimum width and no scroll container, so the page scrolls sideways at 320px.", "Lets the table scroll inside its own container."),
  d("stu-parking-lots-caption-001", "table-no-caption", "/students/parking", "Table", "markup", "minor",
    "Lot guide table has no caption", "The lot guide table has no <caption>.", "Adds a caption."),
  d("stu-parking-lots-headers-001", "table-header-association", "/students/parking", "Table", "markup", "serious",
    "Lot guide headers attributes point to missing ids", "Lot guide cells use headers ids that don't exist in the table.", "Points headers at the real header ids."),
  d("stu-parking-appeal-new-window-001", "link-new-window", "/students/parking", "Parking", "markup", "moderate",
    "Citation appeal link opens a new tab without warning", "\"Appeal a citation online\" opens the vendor site in a new tab with no indication.", "Adds \"(opens in a new tab)\"."),
  d("stu-parking-map-doc-001", "link-document", "/students/parking", "Parking", "markup", "moderate",
    "Parking map link doesn't say it's a PDF", "\"Parking Map\" opens a PDF with no file type or size.", "Adds \"(PDF, 2 KB)\"."),
  d("stu-parking-generic-link-001", "link-generic", "/students/parking", "Parking", "markup", "minor",
    "\"Read more\" link", "A \"Read more\" link points to the campus map.", "Uses \"Interactive campus map\"."),
  d("stu-parking-updated-small-001", "text-small", "/students/parking", "ServicePage", "css", "minor",
    "\"Rates effective\" note is 10px text", "The last-updated note is 10px light gray type.", "Uses the standard note size and color."),

  // /students/transportation
  d("stu-transit-photo-alt-redundant-001", "alt-redundant", "/students/transportation", "Transportation", "markup", "minor",
    "Shuttle photo alt repeats its caption", "The shuttle photo's alt text is identical to the caption beneath it.", "Marks the photo alt=\"\" since the caption describes it."),
  d("stu-transit-schedule-caption-001", "table-no-caption", "/students/transportation", "Table", "markup", "minor",
    "Shuttle schedule has no caption", "The Owl Shuttle schedule table has no <caption>.", "Adds a caption."),
  d("stu-transit-route-contrast-001", "contrast-text-low", "/students/transportation", "Table", "css", "serious",
    "Route name badges have low contrast", "Route names are white on light green badges (#8cc49a), about 2.0:1.", "Uses #458055, just above the 4.5:1 minimum."),
  d("stu-transit-video-title-001", "iframe-missing-title", "/students/transportation", "VideoEmbed", "markup", "serious",
    "Shuttle video frame has no title", "The \"How to ride the Owl Shuttle\" iframe has no title attribute.", "Adds a title."),

  // /students/safety
  d("stu-safety-alert-motion-001", "motion-animated-announcement", "/students/safety", "Safety", "css", "serious",
    "Emergency banner blinks forever", "The \"Emergency? Call 911\" banner pulses continuously with no way to stop it.", "Removes the animation."),
  d("stu-safety-alert-contrast-001", "contrast-text-low", "/students/safety", "Safety", "css", "serious",
    "Emergency banner text has low contrast", "The banner is white text on coral (#ec7b68), about 2.7:1.", "Uses #cb4534 behind the white text, just above the 4.5:1 minimum."),
  d("stu-safety-heading-empty-001", "heading-empty", "/students/safety", "Safety", "markup", "serious",
    "Shield icon sits in an empty heading", "A decorative shield icon is wrapped in an <h2> with no text.", "Renders the icon as a decorative span outside any heading."),
  d("stu-safety-pdf-doc-001", "link-document", "/students/safety", "Safety", "markup", "minor",
    "Emergency guide links don't say they're PDFs", "The Emergency Guide and Student Conduct Code links open PDFs with no file type or size.", "Adds \"(PDF, 2 KB)\"."),

  // /students/organizations
  d("stu-orgs-jump-js-001", "link-javascript", "/students/organizations", "Organizations", "behavior", "moderate",
    "Category jump links are href=\"#\"", "The category jump links are <a href=\"#\"> that scroll with a script and don't move keyboard focus.", "Uses real in-page anchors (href=\"#cat-…\")."),
  d("stu-orgs-heading-skip-001", "heading-skipped", "/students/organizations", "Organizations", "markup", "moderate",
    "Club names skip from h2 to h4", "Each organization name is an <h4> under its <h2> category.", "Uses <h3>."),
  d("stu-orgs-members-contrast-001", "contrast-text-low", "/students/organizations", "Organizations", "css", "serious",
    "Member counts are pale gray", "\"NN members\" is light gray (#a8a8a0) small text, about 2.4:1.", "Uses #767676, just above the 4.5:1 minimum."),
  d("stu-orgs-email-generic-001", "link-generic", "/students/organizations", "Organizations", "markup", "moderate",
    "Forty links all named \"Email\"", "Every club has an \"Email\" link with no club name.", "Uses \"Email <club name>\"."),
  d("stu-orgs-flyer-alt-001", "alt-suspicious", "/students/organizations", "Organizations", "markup", "serious",
    "Fall Fest flyer link is named by a file name", "The linked Fall Fest flyer's alt is \"fallfest_flyer_FINAL.png\", which becomes the link name.", "Uses the flyer's text as its alt."),

  // /students/recreation
  d("stu-rec-photo-alt-001", "img-missing-alt", "/students/recreation", "Recreation", "markup", "critical",
    "Climbing wall photo has no alt", "The Recreation Center photo has no alt attribute.", "Adds alt text describing the photo."),
  d("stu-rec-hours-caption-001", "table-no-caption", "/students/recreation", "Table", "markup", "minor",
    "Hours table has no caption", "The facility hours table has no <caption>.", "Adds a caption."),
  d("stu-rec-hours-clip-001", "reflow-clipped-text", "/students/recreation", "Table", "css", "serious",
    "Pool hours are cut off", "Hours cells in a fixed-layout table do not wrap and hide overflow, so the long pool schedule is cut off (more so when zoomed).", "Lets the cells wrap."),
  d("stu-rec-outdoor-new-window-001", "link-new-window", "/students/recreation", "Recreation", "markup", "moderate",
    "Outdoor Adventures sign-up opens a new tab without warning", "The trip sign-up link opens a new tab with no indication.", "Adds \"(opens in a new tab)\"."),
];
