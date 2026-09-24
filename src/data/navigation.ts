// Site-wide navigation: audience bar, mega menu, and footer. Every href must exist in the route inventory.

export interface NavLink { label: string; href: string }
export interface MegaColumn { heading: string; links: NavLink[] }
export interface MegaSection {
  id: string;
  label: string;
  href: string;
  columns: MegaColumn[];
  feature: { title: string; text: string; href: string; image?: string };
}

export const audienceLinks: NavLink[] = [
  { label: "Students", href: "/students" },
  { label: "Faculty & Staff", href: "/faculty-staff" },
  { label: "Alumni", href: "/alumni" },
  { label: "Parents & Families", href: "/parents" },
  { label: "Visitors", href: "/visitors" },
];

export const utilityLinks: NavLink[] = [
  { label: "RedwoodConnect", href: "/portal" },
  { label: "Directory", href: "/employees/directory" },
  { label: "Library", href: "/library" },
  { label: "Give", href: "/giving" },
];

export const megaMenu: MegaSection[] = [
  {
    id: "about",
    label: "About",
    href: "/about",
    columns: [
      { heading: "Who We Are", links: [
        { label: "About Redwood State", href: "/about" },
        { label: "Mission & Values", href: "/about/mission" },
        { label: "History", href: "/about/history" },
        { label: "Leadership", href: "/about/leadership" },
      ] },
      { heading: "Institutional", links: [
        { label: "Strategic Plan 2030", href: "/about/strategic-plan" },
        { label: "Accreditation", href: "/about/accreditation" },
        { label: "Campus Map", href: "/campus-map" },
        { label: "Contact Us", href: "/contact" },
      ] },
    ],
    feature: { title: "Deep Roots, Wide Branches", text: "Read the strategic plan guiding Redwood State through 2030.", href: "/about/strategic-plan", image: "home-hero-quad" },
  },
  {
    id: "admissions",
    label: "Admissions & Aid",
    href: "/admissions",
    columns: [
      { heading: "Apply", links: [
        { label: "Undergraduate", href: "/admissions/undergraduate" },
        { label: "Graduate", href: "/admissions/graduate" },
        { label: "Transfer", href: "/admissions/transfer" },
        { label: "International", href: "/admissions/international" },
      ] },
      { heading: "Plan", links: [
        { label: "How to Apply", href: "/admissions/process" },
        { label: "Visit Campus", href: "/admissions/visit" },
        { label: "Request Information", href: "/admissions/request-info" },
        { label: "Admissions FAQ", href: "/admissions/faq" },
      ] },
      { heading: "Afford", links: [
        { label: "Tuition & Fees", href: "/admissions/tuition" },
        { label: "Financial Aid", href: "/financial-aid" },
        { label: "Scholarships", href: "/admissions/scholarships" },
      ] },
    ],
    feature: { title: "Visit Campus", text: "Walk the quad, meet students, and see the redwoods for yourself.", href: "/admissions/visit", image: "admissions-hero-tour" },
  },
  {
    id: "academics",
    label: "Academics",
    href: "/academics",
    columns: [
      { heading: "Colleges", links: [
        { label: "Engineering", href: "/academics/colleges/engineering" },
        { label: "Business", href: "/academics/colleges/business" },
        { label: "Arts & Humanities", href: "/academics/colleges/arts-humanities" },
        { label: "Science", href: "/academics/colleges/science" },
        { label: "Education", href: "/academics/colleges/education" },
        { label: "Health Sciences", href: "/academics/colleges/health-sciences" },
      ] },
      { heading: "Programs", links: [
        { label: "Degree Programs", href: "/academics/programs" },
        { label: "Minors", href: "/academics/minors" },
        { label: "Certificates", href: "/academics/certificates" },
        { label: "Faculty Directory", href: "/faculty" },
      ] },
      { heading: "Planning", links: [
        { label: "Course Search", href: "/academics/courses" },
        { label: "General Catalog", href: "/academics/catalog" },
        { label: "Academic Calendar", href: "/academics/calendar" },
        { label: "Registrar", href: "/students/registrar" },
      ] },
    ],
    feature: { title: "Hands-On From Day One", text: "Engineering students build in the new Sequoia robotics lab.", href: "/academics/colleges/engineering", image: "college-engineering" },
  },
  {
    id: "research",
    label: "Research & Library",
    href: "/library",
    columns: [
      { heading: "Sequoia Library", links: [
        { label: "Library Home", href: "/library" },
        { label: "Search the Collection", href: "/library/search" },
        { label: "Databases A–Z", href: "/library/databases" },
        { label: "Research Guides", href: "/library/guides" },
      ] },
      { heading: "Services", links: [
        { label: "Study Rooms", href: "/library/study-rooms" },
        { label: "Hours", href: "/library/hours" },
        { label: "My Account", href: "/library/account" },
        { label: "Policies", href: "/library/policies" },
      ] },
    ],
    feature: { title: "Research on the Coast", text: "Biologists track warming waters in Arcadia's tide pools.", href: "/news/tide-pool-study-coastal-warming", image: "news-tide-pool-study-coastal-warming" },
  },
  {
    id: "student-life",
    label: "Student Life",
    href: "/students",
    columns: [
      { heading: "Live", links: [
        { label: "Housing", href: "/students/housing" },
        { label: "Dining", href: "/students/dining" },
        { label: "Recreation", href: "/students/recreation" },
        { label: "Student Organizations", href: "/students/organizations" },
      ] },
      { heading: "Support", links: [
        { label: "Advising", href: "/students/advising" },
        { label: "Career Center", href: "/students/careers" },
        { label: "Health Center", href: "/students/health" },
        { label: "Counseling", href: "/students/counseling" },
      ] },
      { heading: "Get Around", links: [
        { label: "Parking", href: "/students/parking" },
        { label: "Transportation", href: "/students/transportation" },
        { label: "Campus Safety", href: "/students/safety" },
      ] },
    ],
    feature: { title: "Fall Fest", text: "Live music, food trucks, and pumpkin carving on Canopy Green.", href: "/events/fall-fest-2026", image: "campus-dining-hall" },
  },
  {
    id: "athletics",
    label: "Athletics",
    href: "/athletics",
    columns: [
      { heading: "Redwood Owls", links: [
        { label: "Athletics Home", href: "/athletics" },
        { label: "Teams", href: "/athletics/teams" },
        { label: "Schedule", href: "/athletics/schedule" },
        { label: "Scores", href: "/athletics/scores" },
      ] },
    ],
    feature: { title: "Owls Soccer Rolls On", text: "Women's soccer extends its unbeaten streak to nine.", href: "/athletics/teams/womens-soccer", image: "athletics-soccer-action" },
  },
  {
    id: "news",
    label: "News & Events",
    href: "/news",
    columns: [
      { heading: "News", links: [
        { label: "RSU News", href: "/news" },
        { label: "Research", href: "/news/category/research" },
        { label: "Campus Life", href: "/news/category/campus" },
        { label: "Archive", href: "/news/archive" },
      ] },
      { heading: "Events", links: [
        { label: "Events Calendar", href: "/events" },
        { label: "Academic Events", href: "/events/category/academic" },
        { label: "Arts & Culture", href: "/events/category/arts" },
        { label: "Search Events", href: "/events/search" },
      ] },
    ],
    feature: { title: "Undergraduate Research Symposium", text: "Over 200 students present their work this fall.", href: "/events/research-symposium-2026" },
  },
];

export const footerColumns: MegaColumn[] = [
  { heading: "Colleges", links: [
    { label: "Engineering", href: "/academics/colleges/engineering" },
    { label: "Business", href: "/academics/colleges/business" },
    { label: "Arts & Humanities", href: "/academics/colleges/arts-humanities" },
    { label: "Science", href: "/academics/colleges/science" },
    { label: "Education", href: "/academics/colleges/education" },
    { label: "Health Sciences", href: "/academics/colleges/health-sciences" },
  ] },
  { heading: "Resources", links: [
    { label: "RedwoodConnect", href: "/portal" },
    { label: "Sequoia Library", href: "/library" },
    { label: "Course Search", href: "/academics/courses" },
    { label: "Academic Calendar", href: "/academics/calendar" },
    { label: "Directory", href: "/employees/directory" },
    { label: "Campus Map", href: "/campus-map" },
  ] },
  { heading: "University", links: [
    { label: "About", href: "/about" },
    { label: "News", href: "/news" },
    { label: "Events", href: "/events" },
    { label: "Employment", href: "/employees/jobs" },
    { label: "Give", href: "/giving" },
    { label: "Contact", href: "/contact" },
  ] },
  { heading: "Policies", links: [
    { label: "Accessibility", href: "/accessibility" },
    { label: "Privacy", href: "/policies/privacy" },
    { label: "Campus Safety", href: "/students/safety" },
    { label: "Accreditation", href: "/about/accreditation" },
    { label: "Site Map", href: "/sitemap" },
  ] },
];
