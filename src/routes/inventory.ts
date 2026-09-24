// Single source of truth for every route: drives routes.ts, prerendering, breadcrumbs, the sitemap,
// and later the Accessibility Lab page inventory and SITE_MAP.md.
import {
  athletes, colleges, departments, eventCategories, events, faculty, libraryGuides,
  newsArticles, newsCategories, programs, teams,
} from "../data/catalog";

export type Section =
  | "home" | "about" | "admissions" | "aid" | "academics" | "faculty" | "students" | "library"
  | "news" | "events" | "athletics" | "giving" | "employees" | "portal" | "audience" | "utility" | "lab";

/** Planned defect density: A accessible, L light (2–3), M typical (5–12), H heavy (15–25), T terrible (30+). */
export type Tier = "A" | "L" | "M" | "H" | "T";

export interface RouteEntry {
  path: string;
  title: string;
  section: Section;
  tier: Tier;
  /** Breadcrumb parent path; omitted for top-level pages. */
  parent?: string;
  summary?: string;
  /** Route pattern this page is an instance of, e.g. "/news/:slug". */
  pattern?: string;
}

/** A route definition as registered in routes.ts: one module per static path or per pattern. */
export interface RouteDef {
  id: string;
  path: string;
  module: string;
}

const STUB = "pages/StubPage.tsx";

const entries: RouteEntry[] = [];
const defs: RouteDef[] = [];

function page(path: string, title: string, section: Section, tier: Tier, extra: Partial<RouteEntry> & { module?: string } = {}) {
  const { module = STUB, ...rest } = extra;
  entries.push({ path, title, section, tier, ...rest });
  defs.push({ id: path, path, module });
}

function pattern<T extends { slug: string }>(
  pat: string, section: Section, tier: Tier, parent: string, items: T[], title: (item: T) => string,
  module = STUB,
) {
  defs.push({ id: pat, path: pat, module });
  for (const item of items) {
    entries.push({ path: pat.replace(":slug", item.slug), title: title(item), section, tier, parent, pattern: pat });
  }
}

// University
page("/", "Redwood State University", "home", "H", { module: "pages/HomePage.tsx" });
page("/about", "About Redwood State", "about", "L", { summary: "A public research university rooted in Northern California's redwood coast since 1911." });
page("/about/leadership", "University Leadership", "about", "M", { parent: "/about" });
page("/about/mission", "Mission, Vision & Values", "about", "L", { parent: "/about" });
page("/about/history", "Our History", "about", "M", { parent: "/about" });
page("/about/accreditation", "Accreditation", "about", "M", { parent: "/about" });
page("/about/strategic-plan", "Strategic Plan 2030: Deep Roots, Wide Branches", "about", "M", { parent: "/about" });
page("/campus-map", "Campus Map", "about", "T");
page("/contact", "Contact Us", "about", "M");
page("/search", "Search", "utility", "M");

// Admissions & financial aid
page("/admissions", "Admissions", "admissions", "M", { summary: "Find your place among the redwoods." });
page("/admissions/undergraduate", "Undergraduate Admissions", "admissions", "L", { parent: "/admissions" });
page("/admissions/graduate", "Graduate Admissions", "admissions", "M", { parent: "/admissions" });
page("/admissions/international", "International Admissions", "admissions", "M", { parent: "/admissions" });
page("/admissions/transfer", "Transfer Admissions", "admissions", "L", { parent: "/admissions" });
page("/admissions/freshman-requirements", "First-Year Requirements", "admissions", "M", { parent: "/admissions/undergraduate" });
page("/admissions/process", "How to Apply", "admissions", "M", { parent: "/admissions" });
page("/admissions/apply", "Application for Admission", "admissions", "H", { parent: "/admissions/process" });
page("/admissions/tuition", "Tuition & Fees", "admissions", "M", { parent: "/admissions" });
page("/admissions/scholarships", "Scholarships", "admissions", "M", { parent: "/admissions" });
page("/admissions/request-info", "Request Information", "admissions", "M", { parent: "/admissions" });
page("/admissions/visit", "Visit Campus", "admissions", "H", { parent: "/admissions" });
page("/admissions/faq", "Admissions FAQ", "admissions", "M", { parent: "/admissions" });
page("/financial-aid", "Financial Aid", "aid", "M");
page("/financial-aid/types", "Types of Aid", "aid", "M", { parent: "/financial-aid" });
page("/financial-aid/legacy-application", "Institutional Aid Application", "aid", "T", { parent: "/financial-aid" });

// Academics
page("/academics", "Academics", "academics", "L");
pattern("/academics/colleges/:slug", "academics", "M", "/academics", colleges, (c) => c.name);
pattern("/academics/departments/:slug", "academics", "M", "/academics", departments, (d) => `Department of ${d.name}`);
page("/academics/programs", "Degree Programs", "academics", "M", { parent: "/academics" });
pattern("/academics/programs/:slug", "academics", "L", "/academics/programs", programs, (p) => `${p.name}, ${p.degree}`);
page("/academics/minors", "Minors", "academics", "L", { parent: "/academics/programs" });
page("/academics/certificates", "Certificates", "academics", "L", { parent: "/academics/programs" });
page("/academics/catalog", "General Catalog 2025–2026", "academics", "T", { parent: "/academics" });
page("/academics/courses", "Course Search", "academics", "H", { parent: "/academics" });
page("/academics/calendar", "Academic Calendar", "academics", "M", { parent: "/academics" });

// Faculty
page("/faculty", "Faculty Directory", "faculty", "H");
pattern("/faculty/:slug", "faculty", "L", "/faculty", faculty, (f) => f.name);

// Students
page("/students", "Student Resources", "students", "M");
page("/students/registrar", "Office of the Registrar", "students", "M", { parent: "/students" });
page("/students/advising", "Academic Advising", "students", "L", { parent: "/students" });
page("/students/careers", "Career Center", "students", "M", { parent: "/students" });
page("/students/counseling", "Counseling & Psychological Services", "students", "L", { parent: "/students" });
page("/students/health", "Student Health Center", "students", "M", { parent: "/students" });
page("/students/housing", "Housing & Residential Life", "students", "M", { parent: "/students" });
page("/students/dining", "Dining Services", "students", "H", { parent: "/students" });
page("/students/parking", "Parking Services", "students", "H", { parent: "/students" });
page("/students/transportation", "Transportation", "students", "M", { parent: "/students" });
page("/students/safety", "Campus Safety", "students", "M", { parent: "/students" });
page("/students/organizations", "Student Organizations", "students", "M", { parent: "/students" });
page("/students/recreation", "Campus Recreation", "students", "M", { parent: "/students" });

// Library
page("/library", "Sequoia Library", "library", "H");
page("/library/search", "Library Search", "library", "M", { parent: "/library" });
page("/library/databases", "Databases A–Z", "library", "H", { parent: "/library" });
page("/library/guides", "Research Guides", "library", "M", { parent: "/library" });
pattern("/library/guides/:slug", "library", "M", "/library/guides", libraryGuides, (g) => g.name);
page("/library/study-rooms", "Study Room Reservations", "library", "H", { parent: "/library" });
page("/library/hours", "Library Hours", "library", "M", { parent: "/library" });
page("/library/policies", "Library Policies", "library", "M", { parent: "/library" });
page("/library/account", "My Library Account", "library", "M", { parent: "/library" });

// News
page("/news", "RSU News", "news", "M");
page("/news/archive", "News Archive", "news", "M", { parent: "/news" });
page("/news/search", "Search News", "news", "M", { parent: "/news" });
pattern("/news/category/:slug", "news", "M", "/news", newsCategories, (c) => `${c.name} News`);
pattern("/news/:slug", "news", "M", "/news", newsArticles, (a) => a.name);

// Events
page("/events", "Events Calendar", "events", "H");
page("/events/search", "Search Events", "events", "M", { parent: "/events" });
pattern("/events/category/:slug", "events", "M", "/events", eventCategories, (c) => `${c.name} Events`);
pattern("/events/:slug", "events", "M", "/events", events, (e) => e.name);

// Athletics
page("/athletics", "Redwood Owls Athletics", "athletics", "H");
page("/athletics/teams", "Teams", "athletics", "M", { parent: "/athletics" });
page("/athletics/schedule", "Composite Schedule", "athletics", "T", { parent: "/athletics" });
page("/athletics/scores", "Scores & Results", "athletics", "M", { parent: "/athletics" });
pattern("/athletics/teams/:slug", "athletics", "M", "/athletics/teams", teams, (t) => t.name);
pattern("/athletics/athletes/:slug", "athletics", "L", "/athletics/teams", athletes, (a) => a.name);

// Giving
page("/giving", "Give to Redwood State", "giving", "M");
page("/giving/donate", "Make a Gift", "giving", "T", { parent: "/giving" });
page("/giving/priorities", "Giving Priorities", "giving", "M", { parent: "/giving" });
page("/giving/alumni", "Alumni Giving", "giving", "M", { parent: "/giving" });
page("/giving/scholarships", "Endowed Scholarships", "giving", "M", { parent: "/giving" });
page("/giving/campaigns", "Campaigns", "giving", "M", { parent: "/giving" });

// Employees
page("/employees", "Faculty & Staff Resources", "employees", "M");
page("/employees/hr", "Human Resources", "employees", "M", { parent: "/employees" });
page("/employees/benefits", "Benefits", "employees", "M", { parent: "/employees/hr" });
page("/employees/jobs", "Employment Opportunities", "employees", "M", { parent: "/employees/hr" });
page("/employees/policies", "Employee Policies", "employees", "M", { parent: "/employees/hr" });
page("/employees/payroll", "Payroll Services", "employees", "M", { parent: "/employees" });
page("/employees/directory", "Employee Directory", "employees", "H", { parent: "/employees" });

// Student portal
page("/portal", "RedwoodConnect Dashboard", "portal", "M");
page("/portal/schedule", "Class Schedule", "portal", "M", { parent: "/portal" });
page("/portal/grades", "Grades", "portal", "M", { parent: "/portal" });
page("/portal/degree-progress", "Degree Progress", "portal", "H", { parent: "/portal" });
page("/portal/account", "Student Account", "portal", "M", { parent: "/portal" });
page("/portal/registration", "Registration", "portal", "T", { parent: "/portal" });
page("/portal/holds", "Holds", "portal", "M", { parent: "/portal" });
page("/portal/todo", "To-Do List", "portal", "L", { parent: "/portal" });
page("/portal/messages", "Messages", "portal", "H", { parent: "/portal" });
page("/portal/profile", "Profile", "portal", "M", { parent: "/portal" });

// Audiences & utility
page("/alumni", "Alumni", "audience", "M");
page("/parents", "Parents & Families", "audience", "L");
page("/visitors", "Visitors", "audience", "L");
page("/faculty-staff", "Faculty & Staff", "audience", "L");
page("/accessibility", "Accessibility at Redwood State", "utility", "L");
page("/policies/privacy", "Privacy Statement", "utility", "L");
page("/sitemap", "Site Map", "utility", "A", { module: "pages/SitemapPage.tsx" });

// Accessibility Lab (tooling; accessible by default)
page("/accessibility-lab", "Accessibility Lab", "lab", "A");
for (const [slug, title] of [
  ["errors", "Error Specimens"], ["alerts", "Alert Specimens"], ["manual", "Manual Testing Specimens"],
  ["forms", "Form Specimens"], ["keyboard", "Keyboard Specimens"], ["tables", "Table Specimens"], ["aria", "ARIA Specimens"],
] as const) {
  page(`/accessibility-lab/${slug}`, title, "lab", "A", { parent: "/accessibility-lab" });
}

export const inventory: readonly RouteEntry[] = entries;
export const routeDefs: readonly RouteDef[] = defs;

const byPath = new Map(entries.map((e) => [e.path, e]));

export function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function getEntry(pathname: string): RouteEntry | undefined {
  return byPath.get(normalizePath(pathname));
}

/** Breadcrumb trail from Home to the given page (inclusive). */
export function getTrail(pathname: string): RouteEntry[] {
  const trail: RouteEntry[] = [];
  let entry = getEntry(pathname);
  while (entry) {
    trail.unshift(entry);
    entry = entry.parent ? byPath.get(entry.parent) : undefined;
  }
  if (trail[0]?.path !== "/") {
    const home = byPath.get("/");
    if (home) trail.unshift(home);
  }
  return trail;
}

export function getChildren(path: string): RouteEntry[] {
  return entries.filter((e) => e.parent === path);
}

export function allRoutePaths(): string[] {
  return entries.map((e) => e.path);
}
