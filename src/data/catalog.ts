// Core catalog of the university's organizational units and the slugs that drive data-driven routes.
// Plan 03 expands the seed collections (faculty, news, events, athletes) into full datasets.

export interface College { slug: string; name: string; short: string }
export interface Department { slug: string; name: string; college: string }
export interface Program { slug: string; name: string; degree: string; level: "undergraduate" | "graduate"; department: string }
export interface Team { slug: string; name: string }
export interface Category { slug: string; name: string }
export interface Seed { slug: string; name: string }

export const colleges: College[] = [
  { slug: "engineering", name: "College of Engineering", short: "Engineering" },
  { slug: "business", name: "College of Business", short: "Business" },
  { slug: "arts-humanities", name: "College of Arts & Humanities", short: "Arts & Humanities" },
  { slug: "science", name: "College of Science", short: "Science" },
  { slug: "education", name: "College of Education", short: "Education" },
  { slug: "health-sciences", name: "College of Health Sciences", short: "Health Sciences" },
];

export const departments: Department[] = [
  { slug: "computer-science", name: "Computer Science", college: "engineering" },
  { slug: "mechanical-engineering", name: "Mechanical Engineering", college: "engineering" },
  { slug: "business-administration", name: "Business Administration", college: "business" },
  { slug: "english", name: "English", college: "arts-humanities" },
  { slug: "history", name: "History", college: "arts-humanities" },
  { slug: "mathematics", name: "Mathematics", college: "science" },
  { slug: "biology", name: "Biology", college: "science" },
  { slug: "chemistry", name: "Chemistry", college: "science" },
  { slug: "psychology", name: "Psychology", college: "science" },
  { slug: "nursing", name: "Nursing", college: "health-sciences" },
];

export const programs: Program[] = [
  { slug: "bs-computer-science", name: "Computer Science", degree: "B.S.", level: "undergraduate", department: "computer-science" },
  { slug: "ms-computer-science", name: "Computer Science", degree: "M.S.", level: "graduate", department: "computer-science" },
  { slug: "bs-mathematics", name: "Mathematics", degree: "B.S.", level: "undergraduate", department: "mathematics" },
  { slug: "bs-biology", name: "Biology", degree: "B.S.", level: "undergraduate", department: "biology" },
  { slug: "bs-chemistry", name: "Chemistry", degree: "B.S.", level: "undergraduate", department: "chemistry" },
  { slug: "ba-english", name: "English", degree: "B.A.", level: "undergraduate", department: "english" },
  { slug: "ba-history", name: "History", degree: "B.A.", level: "undergraduate", department: "history" },
  { slug: "ba-psychology", name: "Psychology", degree: "B.A.", level: "undergraduate", department: "psychology" },
  { slug: "bsn-nursing", name: "Nursing", degree: "B.S.N.", level: "undergraduate", department: "nursing" },
  { slug: "bs-mechanical-engineering", name: "Mechanical Engineering", degree: "B.S.", level: "undergraduate", department: "mechanical-engineering" },
  { slug: "bba-business-administration", name: "Business Administration", degree: "B.B.A.", level: "undergraduate", department: "business-administration" },
  { slug: "mba", name: "Business Administration", degree: "M.B.A.", level: "graduate", department: "business-administration" },
];

export const teams: Team[] = [
  { slug: "mens-basketball", name: "Men's Basketball" },
  { slug: "womens-basketball", name: "Women's Basketball" },
  { slug: "womens-soccer", name: "Women's Soccer" },
  { slug: "baseball", name: "Baseball" },
  { slug: "volleyball", name: "Volleyball" },
  { slug: "cross-country", name: "Cross Country" },
];

export const newsCategories: Category[] = [
  { slug: "research", name: "Research" },
  { slug: "campus", name: "Campus Life" },
  { slug: "athletics", name: "Athletics" },
  { slug: "alumni", name: "Alumni" },
];

export const eventCategories: Category[] = [
  { slug: "academic", name: "Academic" },
  { slug: "arts", name: "Arts & Culture" },
  { slug: "athletics", name: "Athletics" },
  { slug: "student-life", name: "Student Life" },
];

export const libraryGuides: Seed[] = [
  { slug: "citation-guide", name: "Citing Sources: APA, MLA & Chicago" },
  { slug: "nursing-evidence-based-practice", name: "Nursing: Evidence-Based Practice" },
  { slug: "local-history-archives", name: "Arcadia Falls Local History Archives" },
];

// Seed entries only; replaced by generated datasets in plan 03.
export const faculty: Seed[] = [
  { slug: "anjali-raman", name: "Anjali Raman, Ph.D." },
  { slug: "harold-mensah", name: "Harold Mensah, Ph.D." },
];

export const newsArticles: Seed[] = [
  { slug: "tide-pool-study-coastal-warming", name: "Biologists Track Coastal Warming Through Arcadia Tide Pools" },
  { slug: "engineering-robotics-lab-opens", name: "New Robotics Lab Opens in Sequoia Engineering Hall" },
];

export const events: Seed[] = [
  { slug: "fall-fest-2026", name: "Redwood State Fall Fest" },
  { slug: "research-symposium-2026", name: "Fall Undergraduate Research Symposium" },
];

export const athletes: Seed[] = [
  { slug: "maya-delgado", name: "Maya Delgado" },
  { slug: "jordan-whitfield", name: "Jordan Whitfield" },
];
