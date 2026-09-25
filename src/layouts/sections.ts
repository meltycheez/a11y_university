// Per-section chrome. Each section looks like it was built by a different office at a different time.
import type { Section } from "~/routes/inventory";
import type { NavLink } from "~/data/navigation";

export type ChromeVariant =
  | "flagship"   // home, about, audiences: newest university template
  | "marketing"  // admissions: glossy recruitment site
  | "cms"        // academics, faculty: older CMS with left sidebar
  | "services"   // student affairs
  | "library"    // dense vendor-style utility navigation
  | "magazine"   // news
  | "calendar"   // events vendor widget look
  | "sports"     // athletics: dark, bold
  | "foundation" // giving
  | "intranet"   // employees: plain, dated
  | "portal"     // student portal: enterprise app shell
  | "lab";       // accessibility lab tooling

export interface SectionConfig {
  variant: ChromeVariant;
  /** Office or site name shown in the section bar. */
  siteName?: string;
  siteHref?: string;
  tagline?: string;
  links?: NavLink[];
  /** Default hero image for placeholder pages in this section. */
  heroImage?: string;
}

export const sections: Record<Section, SectionConfig> = {
  home: { variant: "flagship", heroImage: "home-hero-quad" },
  about: { variant: "flagship", heroImage: "about-hero-campus" },
  audience: { variant: "flagship", heroImage: "visitors-hero-welcome" },
  utility: { variant: "flagship" },
  admissions: {
    variant: "marketing",
    siteName: "Admissions",
    siteHref: "/admissions",
    heroImage: "admissions-hero-tour",
    links: [
      { label: "Undergraduate", href: "/admissions/undergraduate" },
      { label: "Graduate", href: "/admissions/graduate" },
      { label: "Transfer", href: "/admissions/transfer" },
      { label: "International", href: "/admissions/international" },
      { label: "Cost & Aid", href: "/admissions/tuition" },
      { label: "Visit", href: "/admissions/visit" },
    ],
  },
  aid: {
    variant: "marketing",
    siteName: "Financial Aid & Scholarships",
    siteHref: "/financial-aid",
    heroImage: "aid-hero-advising",
    links: [
      { label: "Aid Overview", href: "/financial-aid" },
      { label: "Types of Aid", href: "/financial-aid/types" },
      { label: "Scholarships", href: "/admissions/scholarships" },
      { label: "Tuition & Fees", href: "/admissions/tuition" },
      { label: "Aid Application", href: "/financial-aid/legacy-application" },
    ],
  },
  academics: {
    variant: "cms",
    siteName: "Academics",
    siteHref: "/academics",
    heroImage: "academics-hero-lecture",
    links: [
      { label: "Colleges & Schools", href: "/academics" },
      { label: "Degree Programs", href: "/academics/programs" },
      { label: "Minors", href: "/academics/minors" },
      { label: "Certificates", href: "/academics/certificates" },
      { label: "Course Search", href: "/academics/courses" },
      { label: "General Catalog", href: "/academics/catalog" },
      { label: "Academic Calendar", href: "/academics/calendar" },
      { label: "Faculty Directory", href: "/faculty" },
    ],
  },
  faculty: {
    variant: "cms",
    siteName: "Academics",
    siteHref: "/academics",
    links: [
      { label: "Faculty Directory", href: "/faculty" },
      { label: "Colleges & Schools", href: "/academics" },
      { label: "Degree Programs", href: "/academics/programs" },
      { label: "Course Search", href: "/academics/courses" },
    ],
  },
  students: {
    variant: "services",
    siteName: "Student Affairs",
    siteHref: "/students",
    heroImage: "students-hero-lawn",
    links: [
      { label: "Registrar", href: "/students/registrar" },
      { label: "Advising", href: "/students/advising" },
      { label: "Careers", href: "/students/careers" },
      { label: "Health & Wellness", href: "/students/health" },
      { label: "Housing", href: "/students/housing" },
      { label: "Dining", href: "/students/dining" },
      { label: "Safety", href: "/students/safety" },
    ],
  },
  library: {
    variant: "library",
    siteName: "Sequoia Library",
    siteHref: "/library",
    tagline: "Open today 7:30 AM – 12:00 AM",
    heroImage: "library-hero-exterior",
    links: [
      { label: "Search", href: "/library/search" },
      { label: "Databases", href: "/library/databases" },
      { label: "Research Guides", href: "/library/guides" },
      { label: "Study Rooms", href: "/library/study-rooms" },
      { label: "Hours", href: "/library/hours" },
      { label: "Policies", href: "/library/policies" },
      { label: "My Account", href: "/library/account" },
    ],
  },
  news: {
    variant: "magazine",
    siteName: "RSU News",
    siteHref: "/news",
    heroImage: "news-tide-pool-study-coastal-warming",
    links: [
      { label: "Research", href: "/news/category/research" },
      { label: "Campus Life", href: "/news/category/campus" },
      { label: "Athletics", href: "/news/category/athletics" },
      { label: "Alumni", href: "/news/category/alumni" },
      { label: "Archive", href: "/news/archive" },
    ],
  },
  events: {
    variant: "calendar",
    heroImage: "events-hero-concert",
    siteName: "Events Calendar",
    siteHref: "/events",
    links: [
      { label: "Academic", href: "/events/category/academic" },
      { label: "Arts & Culture", href: "/events/category/arts" },
      { label: "Athletics", href: "/events/category/athletics" },
      { label: "Student Life", href: "/events/category/student-life" },
      { label: "Search", href: "/events/search" },
    ],
  },
  athletics: {
    variant: "sports",
    siteName: "Redwood Owls",
    siteHref: "/athletics",
    heroImage: "athletics-hero-arena",
    links: [
      { label: "Teams", href: "/athletics/teams" },
      { label: "Schedule", href: "/athletics/schedule" },
      { label: "Scores", href: "/athletics/scores" },
      { label: "Women's Soccer", href: "/athletics/teams/womens-soccer" },
      { label: "Basketball", href: "/athletics/teams/mens-basketball" },
    ],
  },
  giving: {
    variant: "foundation",
    siteName: "Redwood State Foundation",
    siteHref: "/giving",
    heroImage: "giving-hero-scholars",
    links: [
      { label: "Priorities", href: "/giving/priorities" },
      { label: "Scholarships", href: "/giving/scholarships" },
      { label: "Alumni Giving", href: "/giving/alumni" },
      { label: "Campaigns", href: "/giving/campaigns" },
    ],
  },
  employees: {
    variant: "intranet",
    heroImage: "employees-hero-office",
    siteName: "Faculty & Staff Intranet",
    siteHref: "/employees",
    links: [
      { label: "Human Resources", href: "/employees/hr" },
      { label: "Benefits", href: "/employees/benefits" },
      { label: "Payroll", href: "/employees/payroll" },
      { label: "Jobs", href: "/employees/jobs" },
      { label: "Policies", href: "/employees/policies" },
      { label: "Directory", href: "/employees/directory" },
    ],
  },
  portal: {
    variant: "portal",
    heroImage: "portal-banner-laptops",
    siteName: "RedwoodConnect",
    siteHref: "/portal",
    links: [
      { label: "Dashboard", href: "/portal" },
      { label: "Class Schedule", href: "/portal/schedule" },
      { label: "Registration", href: "/portal/registration" },
      { label: "Grades", href: "/portal/grades" },
      { label: "Degree Progress", href: "/portal/degree-progress" },
      { label: "Student Account", href: "/portal/account" },
      { label: "Holds", href: "/portal/holds" },
      { label: "To-Do List", href: "/portal/todo" },
      { label: "Messages", href: "/portal/messages" },
      { label: "Profile", href: "/portal/profile" },
    ],
  },
  lab: {
    variant: "lab",
    siteName: "Accessibility Lab",
    siteHref: "/accessibility-lab",
    links: [
      { label: "Overview", href: "/accessibility-lab" },
      { label: "Errors", href: "/accessibility-lab/errors" },
      { label: "Alerts", href: "/accessibility-lab/alerts" },
      { label: "Manual", href: "/accessibility-lab/manual" },
      { label: "Forms", href: "/accessibility-lab/forms" },
      { label: "Keyboard", href: "/accessibility-lab/keyboard" },
      { label: "Tables", href: "/accessibility-lab/tables" },
      { label: "ARIA", href: "/accessibility-lab/aria" },
    ],
  },
};
