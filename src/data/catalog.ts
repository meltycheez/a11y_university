// Core catalog of the university's organizational units and the slugs that drive data-driven routes.
// People, stories and events below are fixed so content (plan 03) and images (plan 04) agree.

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

// Fixed people, stories and events shared by content (plan 03) and images (plan 04).
// Slugs and names are stable: add fields elsewhere, never rename or remove entries here.

export interface Person { slug: string; name: string; title: string; department?: string }
export interface Story { slug: string; name: string; category: string }
export interface Athlete { slug: string; name: string; team: string }

export const leadership: Person[] = [
  { slug: "elena-vasquez-hart", name: "Elena Vásquez-Hart, Ph.D.", title: "President" },
  { slug: "david-okafor", name: "David Okafor, Ph.D.", title: "Provost and Vice President for Academic Affairs" },
  { slug: "mei-lin-chao", name: "Mei-Lin Chao, Ed.D.", title: "Vice President for Student Affairs" },
  { slug: "robert-haines", name: "Robert Haines, M.B.A.", title: "Vice President for Administration and Finance" },
  { slug: "priya-natarajan", name: "Priya Natarajan, Ph.D.", title: "Vice President for Research and Graduate Studies" },
  { slug: "thomas-harlan", name: "Thomas Harlan, J.D.", title: "Vice President for University Advancement" },
];

/** Faculty with full profiles and headshots. The ~150-person staff directory is generated (plan 03). */
export const faculty: Person[] = [
  { slug: "anjali-raman", name: "Anjali Raman, Ph.D.", title: "Professor", department: "computer-science" },
  { slug: "marcus-bell", name: "Marcus Bell, Ph.D.", title: "Associate Professor", department: "computer-science" },
  { slug: "sofia-kowalski", name: "Sofia Kowalski, Ph.D.", title: "Assistant Professor", department: "computer-science" },
  { slug: "kenji-watanabe", name: "Kenji Watanabe, Ph.D.", title: "Professor", department: "mechanical-engineering" },
  { slug: "rachel-goldberg", name: "Rachel Goldberg, Ph.D.", title: "Associate Professor", department: "mechanical-engineering" },
  { slug: "luis-ortega", name: "Luis Ortega, Ph.D.", title: "Assistant Professor", department: "mechanical-engineering" },
  { slug: "denise-carter", name: "Denise Carter, Ph.D.", title: "Professor", department: "business-administration" },
  { slug: "arjun-mehta", name: "Arjun Mehta, Ph.D.", title: "Associate Professor", department: "business-administration" },
  { slug: "hannah-lindqvist", name: "Hannah Lindqvist, Ph.D.", title: "Lecturer", department: "business-administration" },
  { slug: "james-oconnell", name: "James O'Connell, Ph.D.", title: "Professor", department: "english" },
  { slug: "amara-nwosu", name: "Amara Nwosu, Ph.D.", title: "Associate Professor", department: "english" },
  { slug: "grace-yamamoto", name: "Grace Yamamoto, M.F.A.", title: "Assistant Professor", department: "english" },
  { slug: "harold-mensah", name: "Harold Mensah, Ph.D.", title: "Professor Emeritus", department: "history" },
  { slug: "carmen-ruiz", name: "Carmen Ruiz, Ph.D.", title: "Associate Professor", department: "history" },
  { slug: "william-tran", name: "William Tran, Ph.D.", title: "Assistant Professor", department: "history" },
  { slug: "olga-petrova", name: "Olga Petrova, Ph.D.", title: "Professor", department: "mathematics" },
  { slug: "samuel-adeyemi", name: "Samuel Adeyemi, Ph.D.", title: "Associate Professor", department: "mathematics" },
  { slug: "lauren-fischer", name: "Lauren Fischer, Ph.D.", title: "Assistant Professor", department: "mathematics" },
  { slug: "miguel-santos", name: "Miguel Santos, Ph.D.", title: "Professor", department: "biology" },
  { slug: "naomi-begay", name: "Naomi Begay, Ph.D.", title: "Associate Professor", department: "biology" },
  { slug: "ethan-park", name: "Ethan Park, Ph.D.", title: "Assistant Professor", department: "biology" },
  { slug: "fatima-haddad", name: "Fatima Haddad, Ph.D.", title: "Professor", department: "chemistry" },
  { slug: "daniel-brooks", name: "Daniel Brooks, Ph.D.", title: "Associate Professor", department: "chemistry" },
  { slug: "yuki-sato", name: "Yuki Sato, Ph.D.", title: "Assistant Professor", department: "chemistry" },
  { slug: "rebecca-stein", name: "Rebecca Stein, Ph.D.", title: "Professor", department: "psychology" },
  { slug: "kwame-asante", name: "Kwame Asante, Ph.D.", title: "Associate Professor", department: "psychology" },
  { slug: "isabel-moreno", name: "Isabel Moreno, Ph.D.", title: "Assistant Professor", department: "psychology" },
  { slug: "patricia-nguyen", name: "Patricia Nguyen, D.N.P., R.N.", title: "Professor and Director of Nursing", department: "nursing" },
  { slug: "michael-harjo", name: "Michael Harjo, Ph.D., R.N.", title: "Associate Professor", department: "nursing" },
  { slug: "aisha-rahman", name: "Aisha Rahman, M.S.N., R.N.", title: "Clinical Assistant Professor", department: "nursing" },
];

export const newsArticles: Story[] = [
  { slug: "tide-pool-study-coastal-warming", name: "Biologists Track Coastal Warming Through Arcadia Tide Pools", category: "research" },
  { slug: "engineering-robotics-lab-opens", name: "New Robotics Lab Opens in Sequoia Engineering Hall", category: "campus" },
  { slug: "redwood-canopy-carbon-study", name: "Old-Growth Redwood Canopies Store More Carbon Than Expected, RSU Study Finds", category: "research" },
  { slug: "nursing-simulation-center-accreditation", name: "Nursing Simulation Center Earns National Accreditation", category: "campus" },
  { slug: "womens-soccer-conference-title", name: "Owls Women's Soccer Clinches First Conference Title Since 2009", category: "athletics" },
  { slug: "first-gen-scholars-expands", name: "First-Generation Scholars Program Doubles in Size", category: "campus" },
  { slug: "alumna-salmon-sensor-startup", name: "Alumna's Startup Uses River Sensors to Track Salmon Runs", category: "alumni" },
  { slug: "library-digitizes-logging-archives", name: "Sequoia Library Digitizes a Century of Arcadia Falls Logging Records", category: "campus" },
  { slug: "wildfire-smoke-sensor-network", name: "Student-Built Sensor Network Maps Wildfire Smoke Across the North Coast", category: "research" },
  { slug: "mens-basketball-season-preview", name: "Men's Basketball Season Preview: Young Roster, High Expectations", category: "athletics" },
  { slug: "sleep-study-later-classes", name: "Students Slept Better After 7:30 a.m. Classes Moved Later, Psychology Study Shows", category: "research" },
  { slug: "alum-california-teacher-of-year", name: "Education Alum Named State Teacher of the Year", category: "alumni" },
  { slug: "madrone-hall-opens", name: "Madrone Hall Opens With 400 New Beds and a Rooftop Garden", category: "campus" },
  { slug: "green-chemistry-grant", name: "$2.4 Million Grant Funds Green Solvent Research in Chemistry", category: "research" },
  { slug: "cross-country-all-american", name: "Cross Country's Priya Castillo Named All-American", category: "athletics" },
];

export const events: Story[] = [
  { slug: "fall-fest-2026", name: "Redwood State Fall Fest", category: "student-life" },
  { slug: "research-symposium-2026", name: "Fall Undergraduate Research Symposium", category: "academic" },
  { slug: "homecoming-2026", name: "Homecoming & Family Weekend 2026", category: "student-life" },
  { slug: "career-fair-fall-2026", name: "Fall Career & Internship Fair", category: "academic" },
  { slug: "fall-choral-concert", name: "Redwood Chorale Fall Concert", category: "arts" },
  { slug: "faculty-art-exhibition", name: "Faculty Art Exhibition: Understory", category: "arts" },
  { slug: "basketball-home-opener", name: "Owls Basketball Home Opener vs. Cascade State", category: "athletics" },
  { slug: "admissions-open-house", name: "Fall Admissions Open House", category: "academic" },
  { slug: "wellness-week", name: "Student Wellness Week", category: "student-life" },
  { slug: "redwood-lecture-climate", name: "Redwood Lecture Series: Forests in a Warming World", category: "academic" },
];

export const athletes: Athlete[] = [
  { slug: "maya-delgado", name: "Maya Delgado", team: "womens-soccer" },
  { slug: "jordan-whitfield", name: "Jordan Whitfield", team: "mens-basketball" },
  { slug: "tasha-greene", name: "Tasha Greene", team: "womens-basketball" },
  { slug: "diego-alvarez", name: "Diego Alvarez", team: "baseball" },
  { slug: "leilani-kahale", name: "Leilani Kahale", team: "volleyball" },
  { slug: "priya-castillo", name: "Priya Castillo", team: "cross-country" },
  { slug: "noah-lindgren", name: "Noah Lindgren", team: "mens-basketball" },
  { slug: "sierra-blackwood", name: "Sierra Blackwood", team: "womens-soccer" },
];
