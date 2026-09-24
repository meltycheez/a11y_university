// Writes the bulk datasets to src/data/generated/*.json. Seeded, so reruns are byte-identical.
// Run: npm run gen:data (Node 24 strips the types). Commit the output; builds never regenerate it.
import { writeFileSync } from "node:fs";
import { registerHooks } from "node:module";
import type {
  Athletics, AthleteProfile, AuditGroup, Course, CourseSection, DirectoryEntry, Game, GradeRecord, Hold,
  JobPosting, LedgerEntry, LibraryDatabase, PortalMessage, PortalStudent, RosterPlayer, ScheduledSection,
  StudentOrganization, TeamSeason, Term, TermGrades, TodoItem,
} from "../src/data/types";

// Let Node resolve the extensionless relative imports the app uses.
registerHooks({
  resolve(spec, ctx, next) {
    try { return next(spec, ctx); } catch (e) { if (spec.startsWith(".")) return next(`${spec}.ts`, ctx); throw e; }
  },
});
const { athletes, departments, faculty, leadership, teams } = await import("../src/data/catalog");
const { SITE_NOW, addDays } = await import("../src/data/site");
const { brand } = await import("../src/data/brand");

const SEED = 20260924;
const OUT = new URL("../src/data/generated/", import.meta.url);
const DOMAIN = "redwoodstate.example.edu";

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Each dataset gets its own stream so editing one never reshuffles the others.
let rand = mulberry32(SEED);
const stream = (n: number) => { rand = mulberry32(SEED + n); };
const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));
const pick = <T>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)];
const chance = (p: number) => rand() < p;
function sample<T>(xs: readonly T[], n: number): T[] {
  const copy = [...xs];
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy.slice(0, n);
}
const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const cents = (n: number) => Math.round(n * 100) / 100;
const write = (file: string, data: unknown) => writeFileSync(new URL(file, OUT), `${JSON.stringify(data, null, 2)}\n`);

// ---------- Names ----------
const FIRST = [
  "Aaliyah", "Adrian", "Aiyana", "Alejandro", "Amina", "Andre", "Anika", "Ben", "Bianca", "Brandon", "Camila", "Caleb",
  "Chiara", "Chloe", "Chinedu", "Colin", "Dalia", "Darius", "Elif", "Emeka", "Erin", "Esperanza", "Farah", "Gabriel",
  "Gemma", "Hamid", "Hana", "Hector", "Imani", "Ines", "Iris", "Jae-won", "Jamal", "Janelle", "Javier", "Joy", "Julian",
  "Kai", "Kalani", "Keisha", "Kiran", "Lars", "Leah", "Lucia", "Malik", "Marisol", "Mateo", "Maya", "Mohammed", "Nadia",
  "Nikhil", "Nina", "Omar", "Paloma", "Quinn", "Rafael", "Ravi", "Rosa", "Ruth", "Sanjay", "Sarah", "Selena", "Seth",
  "Shira", "Simone", "Soren", "Tamika", "Teresa", "Theo", "Tomas", "Uma", "Valentina", "Victor", "Wen", "Xavier",
  "Yara", "Yusuf", "Zainab", "Zoe", "Beatriz", "Connor", "Deepa", "Eli", "Francesca", "Graham", "Helena", "Ivan", "Kofi",
];
const LAST = [
  "Abernathy", "Achebe", "Aguilar", "Ahmadi", "Anand", "Bautista", "Becker", "Bergstrom", "Castellanos", "Chen", "Coleman",
  "Dang", "Desai", "Dominguez", "Duarte", "Eriksen", "Espinoza", "Farouk", "Fitzgerald", "Flores", "Galloway", "Gupta",
  "Hale", "Hashemi", "Hoang", "Holloway", "Iqbal", "Jaramillo", "Jensen", "Kapoor", "Kim", "Kowalczyk", "Lam", "Larkin",
  "Le", "Lopez", "Mahoney", "Malhotra", "McAllister", "Medina", "Morales", "Nakamura", "Novak", "Obi", "Okonkwo",
  "Olsen", "Osei", "Pacheco", "Patel", "Pham", "Quintero", "Ramirez", "Reyes", "Rosen", "Saldana", "Schmidt", "Shah",
  "Silva", "Soto", "Sullivan", "Takahashi", "Tanaka", "Thornton", "Torres", "Tsosie", "Underwood", "Valdez", "Vance",
  "Velasquez", "Walker", "Washington", "Weiss", "Whitehorse", "Wu", "Yazzie", "Young", "Zamora", "Zhang", "Bishop",
  "Costa", "Delacroix", "Friedman", "Gonzales", "Harper", "Ibarra", "Kealoha", "Lindahl", "Mbeki", "Nguyen", "Park",
];
const usedNames = new Set<string>([
  ...faculty, ...leadership, ...athletes,
].map((p) => p.name.split(",")[0]).concat("Jordan Alvarez"));
const nameRand = mulberry32(SEED - 1);
function newName(): string {
  for (;;) {
    const n = `${FIRST[Math.floor(nameRand() * FIRST.length)]} ${LAST[Math.floor(nameRand() * LAST.length)]}`;
    if (!usedNames.has(n)) { usedNames.add(n); return n; }
  }
}

// ---------- Buildings ----------
const BUILDINGS: Record<string, string> = {
  SEH: "Sequoia Engineering Hall", CSC: "Canopy Science Center", MAD: "Madrone Hall", ALD: "Alder Hall",
  SPR: "Spruce Hall", TNK: "Tanoak Hall", HUC: "Huckleberry Hall", SAL: "Salal Hall",
  HFA: "Hartwell Fine Arts Center", LAU: "Laurel Hall", FDR: "Founders Hall", LIB: "Sequoia Library",
  SU: "Rowan Student Union", OAC: "Owl Arena", WEL: "Wellness Center", CY: "Corporation Yard",
};

// ---------- Courses ----------
// Titles are listed by level; "|4" sets credits. Within a level the first titles are the core sequence
// that later prerequisites point to, and they are offered every term.
interface Subject {
  code: string; name: string; dept?: string; college: string; building: string;
  levels: Record<number, string[]>; topics: string[]; skills: string[]; activities: string[];
}
const SUBJECTS: Subject[] = [
  {
    code: "CS", name: "Computer Science", dept: "computer-science", college: "engineering", building: "SEH",
    levels: {
      100: ["Introduction to Programming|4", "Data Structures|4", "Discrete Structures for Computing", "Computing for Everyone", "Web Development Fundamentals"],
      200: ["Computer Organization", "Object-Oriented Design", "Systems Programming in C", "Introduction to Data Science", "Human-Computer Interaction", "The Command Line and Shell Scripting|1"],
      300: ["Algorithms", "Operating Systems", "Software Engineering", "Theory of Computation", "Database Systems", "Computer Networks", "Programming Languages", "Accessible and Inclusive Software Design", "Cloud Computing"],
      400: ["Machine Learning", "Computer Security", "Distributed Systems", "Compilers", "Computer Graphics", "Mobile Application Development", "Senior Project|4", "Natural Language Processing", "Quantum Computing Concepts"],
      500: ["Advanced Algorithms", "Advanced Operating Systems", "Research Methods in Computing", "Deep Learning"],
      600: ["Topics in Artificial Intelligence", "Graduate Seminar in Computing|1", "Master's Thesis|6"],
    },
    topics: ["abstraction and decomposition", "algorithm analysis", "recursion", "memory management", "concurrency", "testing and debugging", "version control", "data modeling", "network protocols", "security threats and mitigations", "performance measurement", "user-centered design"],
    skills: ["clean, well-tested code", "working in teams", "reasoning about correctness", "clear technical writing"],
    activities: ["complete weekly programming assignments", "build a term-long team project", "present design reviews to their peers", "work through hands-on labs in the SEH computing studios"],
  },
  {
    code: "ME", name: "Mechanical Engineering", dept: "mechanical-engineering", college: "engineering", building: "SEH",
    levels: {
      100: ["Introduction to Mechanical Engineering", "Engineering Graphics and CAD", "Engineering Problem Solving", "Engineering Ethics and Society|1"],
      200: ["Statics", "Dynamics", "Strength of Materials", "Manufacturing Processes|4"],
      300: ["Thermodynamics I", "Fluid Mechanics", "Heat Transfer", "Machine Design", "Mechatronics|4", "Materials Engineering", "Engineering Economics"],
      400: ["Robotics", "Renewable Energy Systems", "Vibrations and Controls", "Finite Element Analysis", "Senior Design I", "Senior Design II", "HVAC Systems Design"],
    },
    topics: ["free-body diagrams", "energy balances", "stress and strain", "material selection", "control systems", "sensor integration", "computer-aided design", "fatigue and failure", "fluid flow", "sustainable design"],
    skills: ["engineering judgment", "design documentation", "safe shop practice", "quantitative analysis"],
    activities: ["complete weekly problem sets", "design and test prototypes in the Sequoia makerspace", "write formal lab reports", "work with an industry sponsor"],
  },
  {
    code: "BUS", name: "Business Administration", dept: "business-administration", college: "business", building: "ALD",
    levels: {
      100: ["Introduction to Business", "Financial Accounting", "Managerial Accounting", "Business Communication"],
      200: ["Principles of Marketing", "Business Statistics", "Legal Environment of Business", "Management Information Systems", "Principles of Microeconomics", "Principles of Macroeconomics"],
      300: ["Corporate Finance", "Organizational Behavior", "Operations Management", "Consumer Behavior", "Entrepreneurship", "Human Resource Management", "Business Ethics", "Digital Marketing"],
      400: ["Strategic Management", "Investments", "Sustainable Business Practices", "International Business", "Business Analytics Capstone"],
      500: ["Managerial Economics", "Leading Organizations", "Financial Management for Managers"],
      600: ["Marketing Strategy", "Global Supply Chain Management", "MBA Capstone Consulting Project"],
    },
    topics: ["financial statements", "market segmentation", "cash flow analysis", "negotiation", "ethical decision making", "supply chains", "team leadership", "business law", "data-driven forecasting", "small business development"],
    skills: ["professional communication", "case analysis", "collaborative problem solving", "spreadsheet modeling"],
    activities: ["analyze case studies from North Coast businesses", "prepare a team business plan", "present recommendations to local employers", "complete spreadsheet modeling exercises"],
  },
  {
    code: "ENGL", name: "English", dept: "english", college: "arts-humanities", building: "SPR",
    levels: {
      100: ["College Composition", "Critical Reading and Writing", "Introduction to Literature", "Introduction to Creative Writing"],
      200: ["Survey of British Literature", "Survey of American Literature", "Literary Analysis", "Writing for the Professions", "Introduction to Linguistics"],
      300: ["Early Modern Drama", "The American Novel", "Literature of the Pacific Northwest", "Poetry Workshop", "Fiction Workshop", "Rhetoric and Composition Theory", "Native American Literatures", "Young Adult Literature"],
      400: ["Senior Seminar in Literature", "Advanced Nonfiction Workshop", "Teaching Writing", "Topics in Literary Theory", "Editing and Publishing"],
    },
    topics: ["close reading", "argument and evidence", "literary history", "revision strategies", "genre and form", "research writing", "narrative voice", "cultural context", "audience and purpose", "peer workshop practice"],
    skills: ["clear, persuasive prose", "careful textual analysis", "sustained revision", "responsible use of sources"],
    activities: ["write and revise several essays", "workshop drafts with classmates", "lead a class discussion", "assemble a final portfolio"],
  },
  {
    code: "HIST", name: "History", dept: "history", college: "arts-humanities", building: "SPR",
    levels: {
      100: ["World History to 1500", "World History since 1500", "United States History to 1877", "United States History since 1877"],
      200: ["Historical Methods", "History of California", "Modern Latin America", "East Asia since 1800", "Africa since 1800"],
      300: ["The American West", "Environmental History", "Indigenous Peoples of North America", "The Civil Rights Movement", "Modern Europe", "History of Science and Medicine", "Women in American History"],
      400: ["Public History and Archives", "Senior Research Seminar", "Oral History Methods", "Topics in Pacific World History"],
    },
    topics: ["primary source analysis", "historiography", "labor and migration", "empire and colonialism", "environmental change", "social movements", "archival research", "timber and fishing economies", "memory and commemoration", "citizenship"],
    skills: ["historical argument", "archival research", "evaluating evidence", "clear historical writing"],
    activities: ["work with collections in the Sequoia Library archives", "write a research paper from primary sources", "complete short response papers", "record and transcribe an oral history"],
  },
  {
    code: "MATH", name: "Mathematics", dept: "mathematics", college: "science", building: "TNK",
    levels: {
      100: ["Calculus I|4", "Calculus II|4", "Precalculus", "Statistics for Everyday Life", "Mathematics for Elementary Teachers"],
      200: ["Linear Algebra", "Calculus III|4", "Introduction to Proof", "Differential Equations", "Discrete Mathematics"],
      300: ["Probability", "Real Analysis I", "Abstract Algebra I", "Numerical Methods", "Mathematical Modeling", "Mathematical Statistics", "Graph Theory"],
      400: ["Real Analysis II", "Topology", "Complex Variables", "Senior Capstone in Mathematics"],
    },
    topics: ["limits and continuity", "vector spaces", "proof techniques", "probability distributions", "numerical approximation", "modeling with differential equations", "group theory", "convergence", "optimization", "statistical inference"],
    skills: ["rigorous reasoning", "clear mathematical writing", "computational fluency", "problem solving"],
    activities: ["complete weekly problem sets", "present proofs at the board", "use statistical and computational software", "complete a modeling project"],
  },
  {
    code: "BIOL", name: "Biology", dept: "biology", college: "science", building: "CSC",
    levels: {
      100: ["Principles of Biology I|4", "Principles of Biology II|4", "Human Biology", "Biology of the Redwood Coast", "Introduction to Marine Science"],
      200: ["Genetics|4", "Cell Biology", "Ecology|4", "Microbiology|4"],
      300: ["Marine Biology|4", "Evolution", "Animal Physiology|4", "Plant Biology", "Molecular Biology", "Conservation Biology", "Mycology", "Ornithology"],
      400: ["Forest Ecology Field Course|4", "Biology Research Seminar|1", "Immunology", "Bioinformatics", "Undergraduate Research|3"],
    },
    topics: ["cell structure and function", "inheritance", "evolutionary processes", "ecosystem dynamics", "coastal and tide pool ecology", "microbial diversity", "physiological systems", "field sampling methods", "molecular techniques", "scientific communication"],
    skills: ["experimental design", "field and lab technique", "data analysis", "scientific writing"],
    activities: ["complete weekly laboratory exercises", "take part in field trips to local forests and tide pools", "design an independent experiment", "present a research poster"],
  },
  {
    code: "CHEM", name: "Chemistry", dept: "chemistry", college: "science", building: "CSC",
    levels: {
      100: ["General Chemistry I|4", "General Chemistry II|4", "Chemistry in Society"],
      200: ["Organic Chemistry I|4", "Organic Chemistry II|4", "Quantitative Analysis|4"],
      300: ["Physical Chemistry I", "Biochemistry", "Instrumental Analysis|4", "Inorganic Chemistry", "Environmental Chemistry", "Physical Chemistry II"],
      400: ["Green Chemistry", "Advanced Organic Synthesis", "Chemistry Seminar|1", "Undergraduate Research in Chemistry|3"],
    },
    topics: ["stoichiometry", "chemical bonding", "reaction mechanisms", "thermodynamics", "kinetics", "spectroscopy", "laboratory safety", "green solvents", "chromatography", "equilibrium"],
    skills: ["safe laboratory practice", "quantitative reasoning", "careful record keeping", "scientific writing"],
    activities: ["complete weekly laboratory experiments", "maintain a detailed lab notebook", "analyze samples with modern instruments", "write formal lab reports"],
  },
  {
    code: "PSYC", name: "Psychology", dept: "psychology", college: "science", building: "HUC",
    levels: {
      100: ["Introduction to Psychology", "Psychology of Adjustment", "Careers in Psychology|1"],
      200: ["Research Methods in Psychology", "Statistics for the Behavioral Sciences", "Lifespan Development", "Social Psychology"],
      300: ["Cognitive Psychology", "Abnormal Psychology", "Biological Psychology", "Health Psychology", "Psychology of Sleep", "Cross-Cultural Psychology", "Learning and Behavior", "Industrial-Organizational Psychology"],
      400: ["Counseling Theories", "Advanced Research Laboratory", "History and Systems of Psychology", "Senior Seminar in Psychology"],
    },
    topics: ["research design", "memory and attention", "development across the lifespan", "social influence", "stress and coping", "the biology of behavior", "psychological disorders", "sleep and circadian rhythms", "cultural perspectives", "ethics in research"],
    skills: ["evaluating research claims", "APA-style writing", "basic statistical analysis", "ethical reasoning"],
    activities: ["participate in or design a small study", "write an APA-style research report", "discuss current research articles", "complete short reflection papers"],
  },
  {
    code: "NURS", name: "Nursing", dept: "nursing", college: "health-sciences", building: "SAL",
    levels: {
      100: ["Introduction to Professional Nursing", "Medical Terminology|1", "Nutrition for Health"],
      200: ["Pathophysiology", "Pharmacology for Nursing", "Health Assessment|4", "Fundamentals of Nursing Practice|5"],
      300: ["Medical-Surgical Nursing I|5", "Maternal and Newborn Nursing|4", "Pediatric Nursing|4", "Mental Health Nursing|4", "Nursing Research and Evidence-Based Practice", "Gerontological Nursing"],
      400: ["Medical-Surgical Nursing II|5", "Community and Rural Health Nursing|4", "Nursing Leadership and Management", "Capstone Clinical Practicum|5"],
    },
    topics: ["patient safety", "clinical reasoning", "evidence-based practice", "health assessment", "medication administration", "rural and community health", "therapeutic communication", "care of diverse populations", "interprofessional teamwork", "quality improvement"],
    skills: ["clinical judgment", "professional communication", "safe patient care", "reflective practice"],
    activities: ["complete scenarios in the nursing simulation center", "attend supervised clinical rotations at Port Alder Medical Center and regional clinics", "prepare care plans", "complete skills check-offs"],
  },
  {
    code: "GEOG", name: "Geography", college: "arts-humanities", building: "SPR",
    levels: {
      100: ["Physical Geography", "Human Geography", "World Regional Geography", "Geography of Food"],
      200: ["Introduction to GIS|4", "Maps and Society"],
      300: ["Geography of California", "Urban Geography", "Water Resources", "Climate and Weather"],
      400: ["Advanced GIS Applications|4", "Field Methods in Geography"],
    },
    topics: ["landforms and climate", "spatial analysis", "population and migration", "watersheds", "mapping technologies", "land use", "regional economies", "remote sensing"],
    skills: ["spatial reasoning", "map interpretation", "data visualization", "field observation"],
    activities: ["complete GIS lab exercises", "take part in local field trips", "produce a final map project", "analyze census and land-use data"],
  },
  {
    code: "ART", name: "Art", college: "arts-humanities", building: "HFA",
    levels: {
      100: ["Drawing I", "Two-Dimensional Design", "Art Appreciation", "Introduction to Ceramics"],
      200: ["Painting I", "Digital Photography", "Printmaking", "Art History: Prehistory to 1400", "Art History: 1400 to 1900"],
      300: ["Art History: Modern and Contemporary", "Sculpture", "Graphic Design Studio", "Illustration"],
      400: ["Senior Exhibition", "Professional Practices in Art"],
    },
    topics: ["composition", "color theory", "material exploration", "art history and criticism", "studio practice", "visual communication", "critique", "portfolio development"],
    skills: ["visual literacy", "studio craft", "constructive critique", "artistic research"],
    activities: ["complete studio projects", "participate in group critiques", "visit exhibitions in the Hartwell Fine Arts Center", "keep a sketchbook"],
  },
  {
    code: "MUS", name: "Music", college: "arts-humanities", building: "HFA",
    levels: {
      100: ["Music Appreciation", "Music Theory I", "Class Piano I|1", "Redwood Chorale|1", "Guitar for Beginners|1"],
      200: ["Music Theory II", "Aural Skills", "History of Jazz", "Symphonic Band|1"],
      300: ["Music History I", "Music History II", "Conducting", "World Music", "Orchestration"],
      400: ["Senior Recital|1", "Composition Seminar"],
    },
    topics: ["harmony and form", "listening skills", "performance practice", "music history", "ear training", "improvisation", "ensemble technique", "cultural traditions in music"],
    skills: ["critical listening", "musicianship", "ensemble collaboration", "performance preparation"],
    activities: ["attend and review live performances", "perform in class", "complete listening journals", "compose short pieces"],
  },
  {
    code: "EDUC", name: "Education", college: "education", building: "LAU",
    levels: {
      100: ["Introduction to Teaching", "Education in a Diverse Society"],
      200: ["Child and Adolescent Development", "Educational Technology"],
      300: ["Literacy Instruction", "Teaching Mathematics in Elementary Schools", "Inclusive Classrooms and Special Education", "Assessment of Learning", "Teaching English Learners"],
      400: ["Student Teaching Seminar|2", "Classroom Management"],
      500: ["Foundations of Educational Research", "Curriculum Design and Evaluation"],
    },
    topics: ["learning theory", "culturally responsive teaching", "lesson planning", "universal design for learning", "assessment", "family and community partnerships", "classroom technology", "literacy development"],
    skills: ["reflective practice", "instructional planning", "working with diverse learners", "professional communication"],
    activities: ["observe in local K–12 classrooms", "design and teach sample lessons", "build a teaching portfolio", "reflect on field experiences"],
  },
  {
    code: "ENVS", name: "Environmental Studies", college: "science", building: "CSC",
    levels: {
      100: ["Introduction to Environmental Studies", "Environment and Society"],
      200: ["Environmental Policy", "Climate Change Science", "Sustainable Food Systems"],
      300: ["Wildfire and Forest Management", "Environmental Justice", "Watershed Restoration", "Coastal Resource Management"],
      400: ["Environmental Studies Capstone"],
    },
    topics: ["climate systems", "forest management", "wildfire science", "environmental policy", "environmental justice", "restoration ecology", "sustainability", "community engagement"],
    skills: ["interdisciplinary analysis", "policy writing", "field observation", "community collaboration"],
    activities: ["take part in field trips to local watersheds", "write a policy brief", "work with a community partner", "complete a team research project"],
  },
  {
    code: "PHYS", name: "Physics", college: "science", building: "CSC",
    levels: {
      100: ["General Physics I|4", "General Physics II|4", "Physics for Scientists and Engineers I|4", "Physics for Scientists and Engineers II|4", "Astronomy"],
      200: ["Modern Physics", "Electronics|4"],
      300: ["Classical Mechanics", "Electricity and Magnetism", "Quantum Mechanics", "Thermal Physics", "Optics"],
      400: ["Advanced Physics Laboratory|4", "Physics Senior Seminar|1"],
    },
    topics: ["Newtonian mechanics", "energy and momentum", "waves and optics", "electric circuits", "electromagnetism", "quantum phenomena", "measurement and uncertainty", "thermal physics"],
    skills: ["quantitative reasoning", "experimental technique", "problem solving", "scientific communication"],
    activities: ["complete weekly lab experiments", "solve weekly problem sets", "analyze experimental uncertainty", "build simple instruments"],
  },
];

const CLOSERS: Record<number, string[]> = {
  100: ["No prior experience required.", "Satisfies GE Area B.", "Open to all majors.", "Recommended for first-year students."],
  200: ["Recommended for sophomores.", "Required for the major.", "Satisfies GE Area B; majors should take the major section."],
  300: ["Intended for majors; others by permission of instructor.", "Junior standing recommended.", "Writing-intensive (WI) course."],
  400: ["Includes a substantial term project.", "Senior standing or consent of instructor.", "Capstone-eligible."],
  500: ["Graduate standing required.", "Open to advanced undergraduates with consent of the graduate coordinator."],
  600: ["Graduate standing required.", "May be repeated for credit with different topics."],
};

function describe(s: Subject, title: string, level: number): string {
  const [a, b, c] = sample(s.topics, 3);
  const word = level < 200 ? "introductory" : level < 300 ? "foundational" : level < 500 ? "upper-division" : "graduate";
  const t = pick([
    `${title} introduces students to ${a}, ${b}, and ${c}. Students ${pick(s.activities)}. ${pick(CLOSERS[level])}`,
    `A ${word} course covering ${a}, ${b}, and ${c}, with an emphasis on ${pick(s.skills)}. ${pick(CLOSERS[level])}`,
    `Examines ${a} and ${b} through readings, lectures, and applied work. Students ${pick(s.activities)} and build skill in ${pick(s.skills)}. ${pick(CLOSERS[level])}`,
    `Explores ${a}, ${b}, and ${c} as they apply to ${s.name.toLowerCase()}. ${pick(CLOSERS[level])}`,
  ]);
  return t;
}

const TERMS: Term[] = ["Fall 2026", "Spring 2027"];
const MWF = [["08:00", "08:50"], ["09:00", "09:50"], ["10:00", "10:50"], ["11:00", "11:50"], ["12:00", "12:50"], ["13:00", "13:50"], ["14:00", "14:50"]];
const TR = [["08:00", "09:15"], ["09:30", "10:45"], ["11:00", "12:15"], ["12:30", "13:45"], ["14:00", "15:15"], ["15:30", "16:45"]];
const EVENING = [["MW", "16:00", "17:15"], ["MW", "18:00", "19:15"], ["TR", "18:00", "19:15"], ["W", "18:00", "20:45"], ["T", "18:00", "20:45"], ["R", "18:00", "20:45"]];

interface Slot { term: Term; days: string; start: string; end: string }
const overlaps = (a: Slot, b: Slot) =>
  a.term === b.term && [...a.days].some((d) => b.days.includes(d)) && a.start < b.end && b.start < a.end;
const busy = new Map<string, Slot[]>();
const isFree = (key: string, s: Slot) => !(busy.get(key) ?? []).some((b) => overlaps(b, s));
const book = (key: string, s: Slot) => busy.set(key, [...(busy.get(key) ?? []), s]);

function timeSlot(term: Term, level: number): Slot {
  if (level >= 500 || (level >= 300 && chance(0.15))) { const [days, start, end] = pick(EVENING); return { term, days, start, end }; }
  if (chance(0.5)) { const [start, end] = pick(MWF); return { term, days: "MWF", start, end }; }
  const [start, end] = pick(TR);
  return { term, days: "TR", start, end };
}

// Adjuncts and lecturers: generated instructors per subject, also listed in the directory.
stream(1);
interface Instructor { slug: string; name: string; subject: string; title: string }
const adjuncts: Instructor[] = [];
for (const s of SUBJECTS) {
  const n = s.dept ? 2 : 3;
  for (let i = 0; i < n; i++) {
    const name = newName();
    adjuncts.push({ slug: slugify(name), name, subject: s.code, title: pick(["Lecturer", "Lecturer", "Adjunct Instructor", "Senior Lecturer", "Visiting Assistant Professor"]) });
  }
}
const nameOnly = (n: string) => n.split(",")[0];

stream(2);
const courses: Course[] = [];
let crn = 40117;
for (const s of SUBJECTS) {
  const core = faculty.filter((f) => f.department === s.dept);
  const extra = adjuncts.filter((a) => a.subject === s.code);
  const levelIds: Record<number, string[]> = {};
  for (const [lvl, titles] of Object.entries(s.levels)) {
    const level = Number(lvl);
    levelIds[level] = [];
    let num = level + 1;
    titles.forEach((raw, idx) => {
      const [title, cr] = raw.split("|");
      const id = `${s.code.toLowerCase()}-${num}`;
      levelIds[level].push(id);
      const below = levelIds[level - 100] ?? [];
      const gate = below.slice(0, 2);
      const prerequisites = level >= 200 && gate.length ? (chance(0.35) && gate.length > 1 ? gate : [pick(gate)]) : [];
      const terms: Term[] = idx < 4 || chance(0.3) ? [...TERMS] : [pick(TERMS)];
      const sections: CourseSection[] = [];
      for (const term of terms) {
        const count = level === 100 ? int(1, idx < 2 ? 3 : 2) : 1;
        for (let k = 0; k < count; k++) {
          const online = chance(0.1);
          const mode = online ? "Online" : chance(0.05) ? "Hybrid" : "In person";
          let slot: Slot = { term, days: "", start: "", end: "" };
          let room = "";
          let who: { slug: string; name: string };
          const pool = [...core.map((f) => ({ slug: f.slug, name: nameOnly(f.name) })), ...extra];
          for (let tries = 0; ; tries++) {
            who = (core.length && chance(0.65) ? pick(core.map((f) => ({ slug: f.slug, name: nameOnly(f.name) }))) : pick(pool));
            if (online) { slot = { term, days: "", start: "", end: "" }; room = ""; break; }
            slot = timeSlot(term, level);
            const bldg = level === 100 && s.code !== "NURS" && chance(0.15) ? "MAD" : s.building;
            room = `${bldg} ${int(1, 3)}${pick(["0", "1", "2", "3"])}${int(0, 9)}`;
            if ((isFree(who.slug, slot) && isFree(room, slot)) || tries > 50) break;
          }
          if (!online) { book(who.slug, slot); book(room, slot); }
          const capacity = level === 100 ? pick([35, 40, 60, 90, 120]) : level < 300 ? pick([30, 35, 40, 45]) : level < 500 ? pick([20, 24, 25, 30, 35]) : pick([12, 15, 18, 20]);
          const enrolled = chance(0.2) ? capacity : Math.round(capacity * (0.45 + rand() * 0.5));
          sections.push({
            crn: String(crn += int(3, 29)), section: online ? `8${k}` : `0${k + 1}`, term,
            instructor: who.name, instructorSlug: who.slug, mode,
            days: slot.days, start: slot.start, end: slot.end, room,
            building: room ? BUILDINGS[room.split(" ")[0]] : "",
            capacity, enrolled, waitlist: enrolled === capacity ? int(0, 12) : 0,
          });
        }
      }
      courses.push({
        id, code: `${s.code} ${num}`, subject: s.code, subjectName: s.name, ...(s.dept ? { department: s.dept } : {}),
        college: s.college, number: num, level: level >= 500 ? "graduate" : "undergraduate",
        title, credits: Number(cr ?? 3), terms, description: describe(s, title, level), prerequisites, sections,
      });
      num += int(2, 9);
    });
  }
}
const courseById = new Map(courses.map((c) => [c.id, c]));

// ---------- Directory ----------
stream(3);
const phones = sample(Array.from({ length: 199 }, (_, i) => i + 101), 199);
const emails = new Set<string>();
function email(slug: string) {
  const [first, ...rest] = slug.split("-");
  let e = `${first}.${rest.join("")}`;
  for (let i = 2; emails.has(e); i++) e = `${first}.${rest.join("")}${i}`;
  emails.add(e);
  return `${e}@${DOMAIN}`;
}
const phone = () => { const n = phones.shift()!; return `(707) 555-${String(n).padStart(4, "0")}`; };
const HOURS = ["MW 10:00–11:30 a.m.", "TR 1:00–2:30 p.m.", "M 2:00–4:00 p.m. and by appointment", "W 9:00–11:00 a.m.", "TR 10:00–11:00 a.m.", "By appointment (CanopyMeet or in person)", "MWF 11:00 a.m.–noon"];
const deptName = (slug: string) => departments.find((d) => d.slug === slug)!.name;
const deptBuilding = (slug: string) => SUBJECTS.find((s) => s.dept === slug)!.building;

const directory: DirectoryEntry[] = [];
for (const p of leadership) {
  directory.push({ slug: p.slug, name: p.name, title: p.title, kind: "leadership", department: "Office of the President", email: email(p.slug), phone: phone(), building: BUILDINGS.FDR, room: `FDR ${int(3, 4)}${int(0, 2)}${int(0, 9)}`, hasProfile: false });
}
for (const f of faculty) {
  const b = deptBuilding(f.department!);
  directory.push({ slug: f.slug, name: f.name, title: f.title, kind: "faculty", department: deptName(f.department!), departmentSlug: f.department, email: email(f.slug), phone: phone(), building: BUILDINGS[b], room: `${b} ${int(2, 3)}${int(0, 4)}${int(0, 9)}`, officeHours: pick(HOURS), hasProfile: true });
}
for (const a of adjuncts) {
  const s = SUBJECTS.find((x) => x.code === a.subject)!;
  directory.push({ slug: a.slug, name: a.name, title: a.title, kind: "faculty", department: s.name, ...(s.dept ? { departmentSlug: s.dept } : {}), email: email(a.slug), phone: phone(), building: BUILDINGS[s.building], room: `${s.building} ${int(1, 3)}${int(0, 4)}${int(0, 9)}`, officeHours: pick(HOURS), hasProfile: false });
}
const OFFICES: [string, string, string[]][] = [
  ["Office of the Registrar", "FDR", ["University Registrar", "Associate Registrar", "Records Specialist", "Graduation Evaluator", "Transcript Coordinator"]],
  ["Financial Aid & Scholarships", "FDR", ["Director of Financial Aid", "Financial Aid Counselor", "Financial Aid Counselor", "Scholarship Coordinator"]],
  ["Undergraduate Admissions", "FDR", ["Director of Admissions", "Admissions Counselor", "Admissions Counselor", "Transfer Admissions Coordinator", "Campus Visit Coordinator"]],
  ["Student Financial Services (Bursar)", "FDR", ["Bursar", "Student Accounts Specialist", "Cashier"]],
  ["Housing & Residential Life", "MAD", ["Director of Housing", "Residence Life Coordinator", "Residence Life Coordinator", "Housing Assignments Specialist"]],
  ["Sequoia Library", "LIB", ["Dean of the Library", "Research & Instruction Librarian", "Health Sciences Librarian", "Archivist and Special Collections Librarian", "Access Services Supervisor"]],
  ["Information Technology Services", "LIB", ["Chief Information Officer", "Service Desk Manager", "Systems Administrator", "Instructional Technologist"]],
  ["Human Resources", "FDR", ["Director of Human Resources", "HR Generalist", "Benefits Coordinator", "Recruitment Specialist"]],
  ["Payroll Services", "FDR", ["Payroll Manager", "Payroll Technician"]],
  ["Student Health Center", "WEL", ["Medical Director", "Nurse Practitioner", "Clinic Coordinator"]],
  ["Counseling & Psychological Services", "WEL", ["Director of Counseling", "Staff Psychologist", "Licensed Clinical Social Worker"]],
  ["Career Center", "SU", ["Director of Career Services", "Career Counselor", "Employer Relations Coordinator"]],
  ["University Police & Campus Safety", "CY", ["Chief of Police", "Emergency Management Coordinator", "Clery Compliance Officer"]],
  ["Parking & Transportation Services", "CY", ["Parking Services Manager", "Parking Services Representative"]],
  ["Dining Services", "SU", ["Director of Dining Services", "Catering Manager"]],
  ["Athletics", "OAC", ["Director of Athletics", "Associate Athletic Director for Compliance", "Sports Information Director", "Head Athletic Trainer"]],
  ["University Advancement", "FDR", ["Director of Annual Giving", "Alumni Relations Coordinator", "Gift Processing Specialist"]],
  ["Disability Resource Center", "LIB", ["Director of Disability Resources", "Accommodations Specialist", "Alternative Media Specialist"]],
  ["Academic Advising Center", "LIB", ["Director of Advising", "Academic Advisor", "Academic Advisor"]],
];
for (const [office, b, titles] of OFFICES) {
  for (const title of titles) {
    const name = newName();
    const slug = slugify(name);
    directory.push({ slug, name, title, kind: "staff", department: office, email: email(slug), phone: phone(), building: BUILDINGS[b], room: `${b} ${int(1, 2)}${int(0, 5)}${int(0, 9)}`, hasProfile: false });
  }
}
for (const d of departments) {
  const name = newName();
  const slug = slugify(name);
  const b = deptBuilding(d.slug);
  directory.push({ slug, name, title: "Department Coordinator", kind: "staff", department: d.name, departmentSlug: d.slug, email: email(slug), phone: phone(), building: BUILDINGS[b], room: `${b} ${int(1, 2)}0${int(0, 9)}`, hasProfile: false });
}
directory.sort((a, b) => (a.kind === "leadership" ? 0 : 1) - (b.kind === "leadership" ? 0 : 1) || nameOnly(a.name).split(" ").at(-1)!.localeCompare(nameOnly(b.name).split(" ").at(-1)!) || a.slug.localeCompare(b.slug));

// ---------- Student organizations ----------
stream(4);
const ORGS: [string, string, string][] = [
  ["Associated Students of Redwood State", "Student Government", "represents students on university committees and funds hundreds of campus events each year"],
  ["Residence Hall Association", "Student Government", "advocates for residents and plans hall programming across Madrone Hall and the other residence halls"],
  ["Graduate Student Council", "Student Government", "represents graduate students and runs the annual graduate research showcase"],
  ["Computing Society", "Academic", "hosts coding nights, tech talks, and the spring hackathon"],
  ["Women in Engineering and Computing", "Academic", "builds community among women and nonbinary students in engineering and computer science"],
  ["Pre-Health Professions Society", "Academic", "helps students prepare for medical, dental, and physician assistant programs"],
  ["Student Nurses' Association", "Academic", "supports nursing students with study groups, licensure exam preparation, and community health drives"],
  ["Psychology Club", "Academic", "brings researchers and clinicians to campus and organizes graduate school workshops"],
  ["History and Archives Collective", "Academic", "volunteers with the Sequoia Library archives and plans local history walks"],
  ["Math Circle", "Academic", "meets weekly to tackle competition problems and puzzles over pizza"],
  ["Entrepreneurs Club", "Academic", "connects student founders with local mentors and runs a pitch competition"],
  ["Robotics Team", "Academic", "designs and builds robots for regional collegiate competitions"],
  ["Black Student Union", "Cultural & Identity", "celebrates Black culture and advocates for Black students at Redwood State"],
  ["Latinx Student Alliance", "Cultural & Identity", "hosts cultural celebrations, mentorship, and family events for Latinx students"],
  ["Native American Student Association", "Cultural & Identity", "organizes the spring powwow and supports Native students and community"],
  ["Asian Pacific Islander Student Union", "Cultural & Identity", "shares API cultures through food, film, and the Lunar New Year festival"],
  ["Queer Student Union", "Cultural & Identity", "offers a welcoming space for LGBTQ+ students and allies"],
  ["First-Generation Student Network", "Cultural & Identity", "connects first-generation college students with peers, faculty mentors, and resources"],
  ["International Students Association", "Cultural & Identity", "welcomes international students and hosts the International Food Fair"],
  ["Redwood Outdoors Club", "Recreation", "leads hiking, kayaking, and camping trips across the North Coast"],
  ["Climbing Club", "Recreation", "climbs at the campus wall and organizes weekend trips to local crags"],
  ["Ultimate Frisbee (Club Sport)", "Club Sports", "competes in regional collegiate ultimate tournaments"],
  ["Rugby Club", "Club Sports", "fields men's and women's club rugby sides in the regional union"],
  ["Surf Club", "Club Sports", "surfs local breaks together and teaches beginners ocean safety"],
  ["Cycling Club", "Club Sports", "rides the coastal highways and races in collegiate road and mountain events"],
  ["Redwood Chorale Society", "Arts & Performance", "supports the Redwood Chorale and organizes student-led a cappella nights"],
  ["Theatre Guild", "Arts & Performance", "produces student-directed plays and a spring musical"],
  ["Film Society", "Arts & Performance", "screens independent films weekly and runs a short film festival"],
  ["The Understory (Literary Magazine)", "Media", "publishes student poetry, fiction, and art twice a year"],
  ["Owl Radio 88.3 (Student Radio)", "Media", "broadcasts student-run music and talk shows to the Arcadia Falls area"],
  ["The Redwood Ring (Student Newspaper)", "Media", "covers campus news, sports, and opinion in print and online"],
  ["Campus Sustainability Coalition", "Service & Advocacy", "runs the campus garden, bike repair clinics, and waste audits"],
  ["Campus Home Builders", "Service & Advocacy", "builds affordable housing with local nonprofit partners"],
  ["Owl Pantry Volunteers", "Service & Advocacy", "stocks and staffs the free Owl Pantry in the Student Union"],
  ["Disability Justice Collective", "Service & Advocacy", "advocates for access and disability culture on campus"],
  ["Salmon Watch", "Service & Advocacy", "monitors local creeks and helps with habitat restoration projects"],
  ["Chess Club", "Special Interest", "meets for casual games, lessons, and rated tournaments"],
  ["Tabletop Gaming Guild", "Special Interest", "gathers every week for board games and role-playing campaigns"],
  ["Interfaith Council", "Religious & Spiritual", "brings together students of many faith traditions for dialogue and service"],
  ["Catholic Student Community", "Religious & Spiritual", "offers weekly gatherings, retreats, and service trips"],
];
const organizations: StudentOrganization[] = ORGS.map(([name, category, focus]) => {
  const slug = slugify(name.replace(/\(.*?\)/g, ""));
  return {
    slug, name, category, description: `${name.replace(/ \(.*?\)/, "")} ${focus}. All students are welcome to join.`,
    meets: `${pick(["Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Every other Wednesday", "First Thursday of the month"])}, ${pick(["12:00–1:00 p.m.", "5:00–6:00 p.m.", "6:00–7:30 p.m.", "7:00–8:30 p.m."])}`,
    location: pick([`SU ${int(1, 2)}${int(0, 3)}${int(0, 9)}`, `${BUILDINGS.LIB} ${int(1, 3)}0${int(1, 9)}`, "Student Union Multipurpose Room", "Online (CanopyMeet)", `ALD ${int(1, 2)}${int(0, 5)}${int(0, 9)}`]),
    email: `${slug.split("-").slice(0, 3).join("")}@${DOMAIN}`, members: int(12, 180),
  };
});

// ---------- Jobs ----------
stream(5);
const JOBS: [string, JobPosting["category"], string, string, string, string[]][] = [
  ["Administrative Analyst/Specialist", "Staff", "Office of the Registrar", "Full-time, permanent", "$4,612–$6,934/month", ["Bachelor's degree or equivalent experience", "Two years of office experience", "Experience with student information systems preferred"]],
  ["Financial Aid Counselor", "Staff", "Financial Aid & Scholarships", "Full-time, permanent", "$4,398–$6,120/month", ["Bachelor's degree", "Knowledge of federal Title IV regulations", "Bilingual English/Spanish preferred"]],
  ["IT Service Desk Technician", "Staff", "Information Technology Services", "Full-time, permanent", "$4,110–$5,720/month", ["One year of help desk experience", "Familiarity with desktop and mobile operating systems"]],
  ["Web Accessibility Specialist", "Staff", "Information Technology Services", "Full-time, permanent", "$6,050–$8,480/month", ["Experience testing to WCAG 2.2 AA", "Proficiency with desktop and mobile screen readers", "HTML, CSS, and ARIA knowledge"]],
  ["Custodian", "Staff", "Facilities Management", "Full-time, permanent (night shift)", "$3,420–$4,215/month", ["Ability to lift 50 pounds", "Prior custodial experience preferred"]],
  ["Groundskeeper", "Staff", "Facilities Management", "Full-time, permanent", "$3,660–$4,580/month", ["Valid California driver's license", "Experience with irrigation and equipment operation"]],
  ["Residence Life Coordinator", "Staff", "Housing & Residential Life", "Full-time, live-on (12-month)", "$4,250–$5,100/month plus apartment", ["Master's degree in student affairs or related field", "Experience in residence life"]],
  ["Staff Psychologist", "Staff", "Counseling & Psychological Services", "Full-time, 10-month", "$7,920–$10,400/month", ["Licensed or license-eligible psychologist in California", "Experience with college students"]],
  ["Police Officer", "Staff", "University Police & Campus Safety", "Full-time, permanent", "$6,140–$8,020/month", ["State peace officer basic academy certificate", "Must pass background investigation"]],
  ["Development Officer", "Staff", "University Advancement", "Full-time, permanent", "$5,800–$7,900/month", ["Three years of fundraising experience", "Excellent written and verbal communication"]],
  ["Assistant Professor of Computer Science (Tenure-Track)", "Faculty", "Department of Computer Science", "Tenure-track, begins August 2027", "Commensurate with experience", ["Ph.D. in computer science or a closely related field by the start date", "Commitment to undergraduate teaching", "Research in systems, security, or human-computer interaction"]],
  ["Assistant Professor of Nursing (Tenure-Track)", "Faculty", "School of Nursing", "Tenure-track, begins August 2027", "Commensurate with experience", ["Doctorate in nursing (Ph.D. or D.N.P.)", "Active California RN license", "Clinical expertise in medical-surgical or community health nursing"]],
  ["Lecturer in Mathematics (Pool)", "Faculty", "Department of Mathematics", "Part-time, semester appointments", "Per course, based on salary schedule", ["Master's degree in mathematics or statistics", "College teaching experience preferred"]],
  ["Lecturer in English Composition (Pool)", "Faculty", "Department of English", "Part-time, semester appointments", "Per course, based on salary schedule", ["M.A. or M.F.A. in English, rhetoric, or creative writing", "Experience teaching first-year writing"]],
  ["Assistant Professor of Environmental Chemistry", "Faculty", "Department of Chemistry", "Tenure-track, begins August 2027", "Commensurate with experience", ["Ph.D. in chemistry", "Research program that can involve undergraduates"]],
  ["Student Assistant – Sequoia Library Circulation", "Student", "Sequoia Library", "Part-time, 10–15 hours/week", "$17.50/hour", ["Enrolled at least half-time", "Customer service experience helpful"]],
  ["Peer Tutor – Math & Science", "Student", "Learning Center", "Part-time, 6–12 hours/week", "$18.00/hour", ["Grade of A- or better in the courses you tutor", "Faculty recommendation"]],
  ["Student Assistant – Campus Recreation", "Student", "Campus Recreation", "Part-time, evenings and weekends", "$17.00/hour", ["CPR/First Aid certification (or willingness to obtain)"]],
  ["Undergraduate Research Assistant – Forest Ecology Lab", "Student", "Department of Biology", "Part-time, 8–10 hours/week", "$18.50/hour", ["Completed BIOL 101 and BIOL 102", "Comfortable doing field work in wet weather"]],
  ["Student Web Assistant", "Student", "University Communications", "Part-time, 10 hours/week", "$18.00/hour", ["Basic HTML and CSS", "Attention to detail"]],
  ["Orientation Leader", "Student", "Office of New Student Programs", "Seasonal (June–August)", "$17.00/hour plus housing", ["Good academic standing", "Enthusiasm for helping new students"]],
];
const jobs: JobPosting[] = JOBS.map(([title, category, department, appointment, salary, qualifications], i) => {
  const posted = addDays(SITE_NOW, -int(3, 40));
  const closes = chance(0.3) ? null : addDays(SITE_NOW, int(7, 45));
  const summaryLead = category === "Faculty" ? `The ${department} invites applications for a ${title.includes("Lecturer") ? "pool of part-time lecturers" : "full-time faculty position"}.` : `${department} is hiring a ${title.replace(/ \(.*\)$/, "")}.`;
  return {
    id: `${category[0]}${String(2026100 + i * 7 + int(0, 6))}`, title, category, department, appointment, salary, posted, closes,
    location: `${brand.address.city}, CA`,
    summary: `${summaryLead} ${pick(["The successful candidate will join a collaborative team serving a diverse student body.", "This position supports students, faculty, and staff across campus.", "Redwood State values candidates who can work effectively with students from many backgrounds."])} ${closes ? "Applications received by the closing date will receive full consideration." : "Open until filled; review of applications begins immediately."}`,
    qualifications,
  };
});

// ---------- Library databases ----------
stream(6);
const DBS: [string, string[], string, string][] = [
  ["Omnibus Article Search", ["Multidisciplinary"], "A broad starting point with scholarly journals, magazines, and newspapers across nearly every discipline.", "1975–present"],
  ["Scholarly Journals Archive", ["Multidisciplinary", "History", "Literature"], "Back issues of core academic journals in the humanities, social sciences, and sciences, digitized from the first issue.", "1665–five years ago"],
  ["National Newspapers Online", ["News", "Multidisciplinary"], "Full text of major U.S. newspapers, including daily editions and archived opinion pages.", "1980–present"],
  ["North Coast Newspaper Archive", ["News", "History", "Local History"], "Digitized regional newspapers from Fernhaven County and neighboring coastal counties, including the Arcadia Falls Courier and the Port Alder Tide.", "1889–1998"],
  ["Computing Literature Index", ["Computer Science", "Engineering"], "Conference proceedings, journals, and technical reports in computing, with citation tracking.", "1954–present"],
  ["Engineering Standards Library", ["Engineering", "Mechanical Engineering"], "Full text of engineering standards and technical papers. Limit of three simultaneous users.", "Current standards"],
  ["Engineering Abstracts Plus", ["Engineering", "Computer Science", "Physics"], "Abstracts and indexing for engineering, applied science, and technology literature.", "1969–present"],
  ["MathSearch Reviews", ["Mathematics", "Statistics"], "Reviews and bibliographic data for the mathematical research literature.", "1940–present"],
  ["Life Sciences Index", ["Biology", "Environmental Science"], "Indexing of life sciences journals, from molecular biology to ecology and marine science.", "1926–present"],
  ["Biomedical Literature Search", ["Nursing", "Health Sciences", "Biology"], "Citations and abstracts from biomedical and health sciences journals, freely searchable.", "1946–present"],
  ["Clinical Nursing Collection", ["Nursing", "Health Sciences"], "Full-text nursing and allied health journals, care sheets, evidence-based summaries, and continuing education modules.", "1937–present"],
  ["Point-of-Care Evidence Summaries", ["Nursing", "Health Sciences"], "Point-of-care summaries of clinical evidence with graded recommendations.", "Continuously updated"],
  ["Medication Reference Online", ["Nursing", "Health Sciences", "Chemistry"], "Drug monographs, interactions, and patient education handouts.", "Continuously updated"],
  ["Chemical Literature & Substances Search", ["Chemistry", "Biology"], "Search chemical literature and substances by name, structure, or reaction. Requires individual registration.", "1907–present"],
  ["Chemistry Journals Collection", ["Chemistry"], "Full-text chemistry journals from major scientific societies.", "1996–present"],
  ["Behavioral Sciences Index", ["Psychology", "Education", "Nursing"], "The core index for psychology and the behavioral sciences, including dissertations and book chapters.", "1887–present"],
  ["Psychology Tests & Measures", ["Psychology", "Education"], "Descriptions and full text of psychological tests and measurement instruments.", "1920–present"],
  ["Education Research Index", ["Education"], "Journal articles and reports in education research, policy, and practice.", "1966–present"],
  ["K–12 Teaching Resources", ["Education"], "Practitioner journals and lesson resources for K–12 teachers.", "1990–present"],
  ["Business Research Collection", ["Business", "Economics"], "Scholarly business journals, trade publications, company profiles, and industry reports.", "1886–present"],
  ["Company & Industry Profiles", ["Business"], "Financial data, SWOT analyses, and market research on public and private companies.", "Current"],
  ["Economic Data Explorer", ["Business", "Economics", "Statistics"], "U.S. and international economic indicators with charting and download tools.", "1913–present"],
  ["Legal Research Collection", ["Business", "Political Science", "Criminal Justice"], "Federal and state case law, statutes, and law reviews.", "1789–present"],
  ["Literary Criticism Collection", ["Literature", "English"], "Full-text literary criticism on authors and works from antiquity to the present.", "1973–present"],
  ["Language & Literature Bibliography", ["Literature", "English", "Linguistics"], "Indexing of scholarship on literature, language, linguistics, and folklore.", "1926–present"],
  ["Poetry & Short Fiction Archive", ["Literature", "English", "Creative Writing"], "Full-text poems, short stories, and author biographies.", "600–present"],
  ["World History Index & Primary Sources", ["History"], "Scholarship on world history since 1450, with linked primary source collections.", "1955–present"],
  ["American History Primary Sources", ["History", "Political Science"], "Letters, diaries, government documents, and pamphlets from U.S. history.", "1600–1990"],
  ["California Digital Archive", ["History", "Local History"], "Photographs, maps, and oral histories from California libraries and historical societies.", "1850–present"],
  ["Arcadia Falls Logging Records", ["Local History", "History", "Environmental Science"], "Company ledgers, photographs, and maps from Arcadia Falls timber operations, digitized by Sequoia Library Special Collections.", "1902–2004"],
  ["Environmental Science Index", ["Environmental Science", "Biology", "Geography"], "Research on ecology, pollution, energy, and resource management.", "1967–present"],
  ["GeoData Portal", ["Geography", "Environmental Science"], "GIS data layers, aerial imagery, and topographic maps for California.", "Varies by layer"],
  ["Visual Arts & Architecture Collection", ["Art"], "Full-text art journals and a large collection of images of artworks and buildings.", "1937–present"],
  ["Image Collection Online", ["Art", "History"], "Millions of high-quality images for teaching and research in the arts and humanities.", "Varies"],
  ["Music Periodicals & Scores", ["Music"], "Indexing of music periodicals plus streaming scores for study.", "1970–present"],
  ["Streaming Music Library", ["Music"], "Streaming classical, jazz, folk, and world music recordings.", "Varies"],
  ["Educational Video Collection", ["Multidisciplinary", "Education"], "Streaming educational documentaries and instructional videos, most with captions and transcripts.", "Varies"],
  ["Statistical Tables Online", ["Statistics", "Multidisciplinary"], "Tables and datasets from government and industry sources.", "1878–present"],
  ["Dissertations & Theses Collection", ["Multidisciplinary"], "Full text of doctoral dissertations and master's theses from around the world.", "1743–present"],
  ["Open Access Journals Directory", ["Multidisciplinary"], "A curated directory of peer-reviewed open access journals.", "Current"],
  ["Citation Manager (RSU Cite)", ["Multidisciplinary"], "Save, organize, and format citations in APA, MLA, and Chicago styles.", "Tool"],
];
const databases: LibraryDatabase[] = DBS.map(([name, subjects, description, coverage]) => ({
  slug: slugify(name), name, subjects, description, coverage,
  fullText: !/abstracts|index|reviews|bibliography|directory|citation/i.test(name) || chance(0.2),
  access: /Open Access|Biomedical Literature|Economic Data/.test(name) ? "Open access" : /Standards|Chemical Literature/.test(name) ? "On campus only" : "Campus & off-campus (RSU login)",
}));
databases.sort((a, b) => a.name.localeCompare(b.name));

// ---------- Athletics ----------
stream(7);
// First eight are Pacific North Conference members; the rest are non-conference.
const OPPONENTS = ["Cascade State", "Summit State", "Cedar Valley University", "North Shore University", "Stonebridge Tech", "Timberline College", "Harbor Point University", "Kestrel Bay State", "Amberfield University", "Juniper Valley College", "Westmere University", "Foxglove College", "Granite Bluff University", "Copper Creek State"];
const CONFERENCE = OPPONENTS.slice(0, 8);
const HOMETOWNS = ["Port Alder, Calif.", "Westmere, Calif.", "Santa Lucerna, Calif.", "Kestrel Bay, Calif.", "San Aurelio, Calif.", "Arcadia Falls, Calif.", "Pine Hollow, Calif.", "Mirador Heights, Calif.", "Ridgeport, Calif.", "Calloway, Calif.", "Harlow Springs, Ore.", "Quillan Falls, Ore.", "Larkspur Flats, Nev.", "Kalehua, Hawaii", "Makani Point, Hawaii", "Tamsin Ridge, Idaho", "Wrenfield, Wash.", "Brightwater, Calif.", "Fernhaven, Calif.", "Hollis Landing, Calif.", "Alder Cove, Calif.", "Saguaro Mesa, Ariz.", "Port Tallis, B.C.", "Eskerby, Sweden"];
const CLASSES: RosterPlayer["classYear"][] = ["Fr.", "So.", "Jr.", "Sr.", "Gr."];
interface Sport { season: string; start: string; games: number; positions: string[]; height: boolean; time: string[] }
const SPORTS: Record<string, Sport> = {
  "mens-basketball": { season: "2026–27", start: "2026-11-06", games: 26, positions: ["G", "G", "F", "F", "C", "G/F"], height: true, time: ["7:00 p.m.", "5:30 p.m.", "2:00 p.m."] },
  "womens-basketball": { season: "2026–27", start: "2026-11-07", games: 26, positions: ["G", "G", "F", "F", "C", "G/F"], height: true, time: ["5:00 p.m.", "7:30 p.m.", "1:00 p.m."] },
  "womens-soccer": { season: "2026", start: "2026-08-21", games: 17, positions: ["GK", "D", "D", "M", "M", "F"], height: false, time: ["4:00 p.m.", "7:00 p.m.", "1:00 p.m."] },
  baseball: { season: "2026", start: "2026-02-06", games: 30, positions: ["RHP", "LHP", "C", "INF", "OF", "RHP"], height: true, time: ["2:00 p.m.", "6:00 p.m.", "12:00 p.m."] },
  volleyball: { season: "2026", start: "2026-08-28", games: 24, positions: ["OH", "MB", "S", "L", "OPP", "DS"], height: true, time: ["7:00 p.m.", "5:00 p.m.", "1:00 p.m."] },
  "cross-country": { season: "2026", start: "2026-08-29", games: 8, positions: ["Distance"], height: false, time: ["9:00 a.m.", "8:30 a.m.", "10:00 a.m."] },
};
const inches = (lo: number, hi: number) => { const n = int(lo, hi); return `${Math.floor(n / 12)}-${n % 12}`; };
function score(team: string): { result: NonNullable<Game["result"]>; w: number; l: number } {
  if (team === "cross-country") { const n = int(6, 14); const place = int(1, Math.min(6, n)); return { result: { score: `${place}${["st", "nd", "rd"][place - 1] ?? "th"} of ${n} teams` }, w: 0, l: 0 }; }
  const win = chance(0.6);
  let a: number, b: number;
  if (team.includes("basketball")) { a = int(62, 92); b = a - int(1, 18); }
  else if (team === "volleyball") { a = 3; b = int(0, 2); }
  else if (team === "baseball") { a = int(3, 12); b = a - int(1, 5); if (b < 0) b = 0; }
  else { a = int(1, 4); b = int(0, a - 1); }
  if (team === "womens-soccer" && chance(0.12)) return { result: { outcome: "T", score: `${a - 1}-${a - 1}` }, w: 0, l: 0 };
  return win ? { result: { outcome: "W", score: `${a}-${b}` }, w: 1, l: 0 } : { result: { outcome: "L", score: `${b}-${a}` }, w: 0, l: 1 };
}
const teamSeasons: TeamSeason[] = teams.map((t) => {
  const sp = SPORTS[t.slug];
  const schedule: Game[] = [];
  let date = sp.start, w = 0, l = 0, tie = 0;
  for (let i = 0; i < sp.games; i++) {
    const cc = t.slug === "cross-country";
    const opponent = cc ? pick(["Owl Invitational", "Juniper Valley Classic", "North Shore Open", "Summit State Invitational", "Stonebridge Tech Invitational", "Amberfield Stampede"]) : i === 0 && t.slug === "mens-basketball" ? "Cascade State" : pick(OPPONENTS);
    const site: Game["site"] = cc ? (opponent === "Owl Invitational" ? "Home" : "Away") : i === 0 ? "Home" : chance(0.08) ? "Neutral" : chance(0.5) ? "Home" : "Away";
    const g: Game = {
      date, time: pick(sp.time), opponent, site,
      location: site === "Home" ? (t.slug.includes("basketball") || t.slug === "volleyball" ? "Owl Arena" : t.slug === "baseball" ? "Harlan Field" : t.slug === "cross-country" ? "Arcadia Falls Community Forest" : "Redwood Field") : site === "Neutral" ? pick(["Mirage Valley, Nev.", "Westmere, Calif.", "Harlow Springs, Ore."]) : `${opponent}`,
      conference: !cc && CONFERENCE.includes(opponent) && i > 3,
    };
    if (date < SITE_NOW) { const s = score(t.slug); g.result = s.result; w += s.w; l += s.l; if (s.result.outcome === "T") tie++; }
    schedule.push(g);
    date = addDays(date, t.slug === "baseball" ? pick([1, 1, 6]) : t.slug === "cross-country" ? pick([7, 14]) : pick([3, 4, 7]));
  }
  const members = athletes.filter((a) => a.team === t.slug);
  const numbers = sample(Array.from({ length: 45 }, (_, i) => i + 1), 15);
  const roster: RosterPlayer[] = Array.from({ length: 15 }, (_, i) => {
    const catalogAthlete = members[i];
    const name = catalogAthlete?.name ?? newName();
    return {
      number: t.slug === "cross-country" ? "" : String(numbers[i]), name, position: pick(sp.positions), classYear: pick(CLASSES), hometown: pick(HOMETOWNS),
      ...(sp.height ? { height: t.slug.startsWith("mens") || t.slug === "baseball" ? inches(70, 84) : inches(64, 76) } : {}),
      ...(catalogAthlete ? { athleteSlug: catalogAthlete.slug } : {}),
    };
  });
  roster.sort((a, b) => Number(a.number) - Number(b.number) || a.name.localeCompare(b.name));
  const played = schedule.some((g) => g.result);
  return {
    slug: t.slug, season: sp.season, headCoach: newName(), conference: "Pacific North Conference",
    record: t.slug === "cross-country" ? `${schedule.filter((g) => g.result).length} meets completed` : played ? `${w}-${l}${tie ? `-${tie}` : ""}` : "0-0",
    schedule, roster,
  };
});
const MAJORS = ["Kinesiology", "Biology", "Business Administration", "Psychology", "Computer Science", "Environmental Studies", "Nursing", "Communication"];
function stats(team: string): { label: string; value: string }[] {
  if (team.includes("basketball")) return [{ label: "PPG", value: (8 + rand() * 12).toFixed(1) }, { label: "RPG", value: (2 + rand() * 7).toFixed(1) }, { label: "APG", value: (1 + rand() * 5).toFixed(1) }, { label: "FG%", value: `.${int(410, 560)}` }];
  if (team === "womens-soccer") return [{ label: "GP", value: String(int(10, 12)) }, { label: "Goals", value: String(int(2, 11)) }, { label: "Assists", value: String(int(1, 7)) }, { label: "Shots", value: String(int(15, 40)) }];
  if (team === "baseball") return [{ label: "AVG", value: `.${int(265, 360)}` }, { label: "HR", value: String(int(2, 11)) }, { label: "RBI", value: String(int(18, 45)) }, { label: "SB", value: String(int(1, 15)) }];
  if (team === "volleyball") return [{ label: "Kills", value: String(int(90, 210)) }, { label: "K/S", value: (2 + rand() * 2).toFixed(2) }, { label: "Digs", value: String(int(40, 150)) }, { label: "Blocks", value: String(int(10, 60)) }];
  return [{ label: "8K PR", value: `${int(27, 29)}:${String(int(0, 59)).padStart(2, "0")}.${int(0, 9)}` }, { label: "Best finish", value: "1st, Owl Invitational" }, { label: "Meets", value: String(teamSeasons.find((t) => t.slug === team)!.schedule.filter((g) => g.result).length) }];
}
const athleteProfiles: AthleteProfile[] = athletes.map((a, i) => {
  const r = teamSeasons.find((t) => t.slug === a.team)!.roster.find((p) => p.athleteSlug === a.slug)!;
  if (a.slug === "priya-castillo") r.classYear = "Sr.";
  return {
    slug: a.slug, name: a.name, team: a.team, number: r.number, position: r.position, classYear: r.classYear, hometown: r.hometown,
    highSchool: `${r.hometown.split(",")[0]} High School`, major: MAJORS[i], ...(r.height ? { height: r.height } : {}), stats: stats(a.team),
  };
});
const athleticsData: Athletics = { teams: teamSeasons, athletes: athleteProfiles };

// ---------- Portal student ----------
stream(8);
const lvl = (subject: string, level: number) => courses.filter((c) => c.subject === subject && Math.floor(c.number / 100) * 100 === level);
const cs = (level: number, i: number) => lvl("CS", level)[i];
const first = (subject: string) => lvl(subject, 100)[0];
const history: [string, Course[]][] = [
  ["Fall 2024", [cs(100, 0), cs(100, 1), lvl("MATH", 100)[0], first("ENGL"), first("HIST")]],
  ["Spring 2025", [cs(100, 2), lvl("MATH", 100)[1], first("PHYS"), first("PSYC")]],
  ["Fall 2025", [cs(200, 0), cs(200, 1), lvl("MATH", 200)[0], first("ART")]],
  ["Spring 2026", [cs(300, 0), cs(300, 1), first("MUS"), first("GEOG")]],
];
const POINTS: Record<string, number> = { A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2 };
const gpa = (rs: GradeRecord[]) => Math.round((rs.reduce((s, r) => s + POINTS[r.grade] * r.credits, 0) / rs.reduce((s, r) => s + r.credits, 0)) * 100) / 100;
const grades: TermGrades[] = history.map(([term, list]) => {
  const rs = list.map((c) => ({ courseId: c.id, code: c.code, title: c.title, credits: c.credits, grade: pick(["A", "A", "A-", "A-", "B+", "B+", "B", "B-", "C+"]) }));
  return { term, courses: rs, termGpa: gpa(rs) };
});
const allGrades = grades.flatMap((g) => g.courses);
const done = new Map(grades.flatMap((g) => g.courses.map((r) => [r.courseId, { grade: r.grade, term: g.term }] as const)));
for (const c of done.keys()) for (const p of courseById.get(c)!.prerequisites) if (!done.has(p)) throw new Error(`Jordan lacks ${p} for ${c}`);

// Current term: remaining CS core first, then electives, avoiding time conflicts.
const wanted = [cs(300, 2), cs(300, 3), cs(400, 0), first("ENVS"), first("EDUC"), lvl("BIOL", 100)[3]];
const schedule: ScheduledSection[] = [];
const mine: Slot[] = [];
for (const c of wanted) {
  if (schedule.length === 4) break;
  if (!c.prerequisites.every((p) => done.has(p))) continue;
  const sec = c.sections.find((s) => s.term === "Fall 2026" && s.mode !== "Online" && !mine.some((m) => overlaps(m, s)));
  if (!sec) continue;
  mine.push(sec);
  schedule.push({ courseId: c.id, code: c.code, title: c.title, credits: c.credits, section: sec });
}
const current = new Set(schedule.map((s) => s.courseId));

const auditCourse = (c: Course) => {
  const d = done.get(c.id);
  return { courseId: c.id, code: c.code, title: c.title, credits: c.credits, status: d ? "complete" as const : current.has(c.id) ? "in-progress" as const : "not-started" as const, ...(d ?? (current.has(c.id) ? { term: "Fall 2026" } : {})) };
};
const csElectives = lvl("CS", 400).slice(0, -1);
const groups: AuditGroup[] = [
  { name: "Lower-Division Core", requiredCredits: 0, courses: [cs(100, 0), cs(100, 1), cs(100, 2), cs(200, 0), cs(200, 1)].map(auditCourse) },
  { name: "Mathematics", requiredCredits: 0, courses: [lvl("MATH", 100)[0], lvl("MATH", 100)[1], lvl("MATH", 200)[0]].map(auditCourse) },
  { name: "Upper-Division Core", requiredCredits: 0, courses: lvl("CS", 300).slice(0, 4).map(auditCourse) },
  { name: "Upper-Division Electives (choose 3)", requiredCredits: 9, courses: csElectives.map(auditCourse) },
  { name: "Capstone", requiredCredits: 0, courses: [lvl("CS", 400).at(-1)!].map(auditCourse) },
  { name: "General Education", requiredCredits: 24, courses: [first("ENGL"), first("HIST"), first("PSYC"), first("PHYS"), first("ART"), first("MUS"), first("ENVS")].map(auditCourse) },
];
for (const g of groups) if (!g.requiredCredits) g.requiredCredits = g.courses.reduce((s, c) => s + c.credits, 0);
const creditsEarned = allGrades.reduce((s, r) => s + r.credits, 0);
const inProgress = schedule.reduce((s, r) => s + r.credits, 0);

const ledgerRaw: [string, string, string, LedgerEntry["type"], number][] = [
  ["2026-01-05", "Spring 2026", "Balance forward from Fall 2025", "charge", 0],
  ["2026-01-08", "Spring 2026", "Tuition – Undergraduate Resident", "charge", 3871],
  ["2026-01-08", "Spring 2026", "Campus Fees (Student Union, Health, Instructionally Related Activities)", "charge", 1016],
  ["2026-01-08", "Spring 2026", "Housing – Redwood Commons, Double", "charge", 6245],
  ["2026-01-08", "Spring 2026", "Meal Plan – Owl 14", "charge", 2180],
  ["2026-01-12", "Spring 2026", "Federal Pell Grant", "aid", -3697.5],
  ["2026-01-12", "Spring 2026", "Redwood Promise Grant", "aid", -3871],
  ["2026-01-12", "Spring 2026", "Federal Direct Subsidized Loan (net of origination fee)", "aid", -2721.5],
  ["2026-01-20", "Spring 2026", "Online Payment – Thank you", "payment", -1500],
  ["2026-02-15", "Spring 2026", "Online Payment – Thank you", "payment", -1522],
  ["2026-07-20", "Fall 2026", "Tuition – Undergraduate Resident", "charge", 3871],
  ["2026-07-20", "Fall 2026", "Campus Fees (Student Union, Health, Instructionally Related Activities)", "charge", 1042],
  ["2026-07-20", "Fall 2026", "Housing – Madrone Hall, Double", "charge", 6420],
  ["2026-07-20", "Fall 2026", "Meal Plan – Owl 14", "charge", 2240],
  ["2026-08-17", "Fall 2026", "Federal Pell Grant", "aid", -3697.5],
  ["2026-08-17", "Fall 2026", "Redwood Promise Grant", "aid", -3871],
  ["2026-08-17", "Fall 2026", "Federal Direct Subsidized Loan (net of origination fee)", "aid", -2721.5],
  ["2026-08-24", "Fall 2026", "Online Payment – Thank you", "payment", -1500],
  ["2026-08-31", "Fall 2026", "Parking Permit – Semester General (G)", "charge", 238],
  ["2026-09-15", "Fall 2026", "Online Payment – Thank you", "payment", -1200],
  ["2026-09-28", "Fall 2026", "Library Fine – Overdue Item", "charge", 15],
];
let bal = 0;
const ledger: LedgerEntry[] = ledgerRaw.map(([date, term, description, type, amount]) => {
  bal = Math.round(bal * 100 + amount * 100) / 100;
  return { date, term, description, type, amount: cents(amount), balance: bal };
});

const holds: Hold[] = [
  { code: "HLTH", name: "Immunization Compliance", office: "Student Health Center", reason: "Your measles, mumps, and rubella (MMR) second-dose record is missing. Upload documentation through the Patient Portal.", added: "2026-09-02", blocks: ["Registration"], url: "/students/health" },
  { code: "ADV1", name: "Advising Required", office: "Academic Advising Center", reason: "Meet with your major advisor before registering for Spring 2027. Your advisor will release this hold after your appointment.", added: "2026-09-21", blocks: ["Registration"], url: "/students/advising" },
];
const todos: TodoItem[] = [
  { id: "todo-mmr", title: "Upload MMR immunization record", office: "Student Health Center", due: addDays(SITE_NOW, 11), status: "open", url: "/students/health" },
  { id: "todo-advising", title: "Schedule a Spring 2027 advising appointment", office: "Academic Advising Center", due: addDays(SITE_NOW, 18), status: "open", url: "/students/advising" },
  { id: "todo-payment", title: "Make installment payment", office: "Student Financial Services", due: "2026-10-15", status: "open", url: "/portal/account" },
  { id: "todo-fafsa", title: "Submit your 2027–28 FAFSA", office: "Financial Aid & Scholarships", due: "2027-03-02", status: "open", url: "/financial-aid" },
  { id: "todo-title-ix", title: "Complete Title IX and Sexual Misconduct Prevention training", office: "Office of Equity & Compliance", due: addDays(SITE_NOW, 25), status: "open", url: "/policies/privacy" },
  { id: "todo-housing", title: "Sign 2026–27 housing contract", office: "Housing & Residential Life", due: "2026-06-01", status: "complete", url: "/students/housing" },
  { id: "todo-aid", title: "Accept Fall 2026 financial aid offer", office: "Financial Aid & Scholarships", due: "2026-07-15", status: "complete", url: "/financial-aid" },
  { id: "todo-ferpa", title: "Review FERPA release and emergency contacts", office: "Office of the Registrar", due: null, status: "complete", url: "/portal/profile" },
];
const messages: PortalMessage[] = [
  { id: "msg-1", from: "Marcus Bell, Ph.D.", office: "Department of Computer Science", subject: "Spring 2027 advising appointments are open", date: addDays(SITE_NOW, -1), read: false, body: ["Hi Jordan,", "I've opened advising slots for Spring 2027 registration. Please book a 20-minute appointment before your registration time ticket on November 9. Bring a draft plan that includes your remaining upper-division core courses.", "Best,\nProf. Bell"] },
  { id: "msg-2", from: "Student Health Center", office: "Student Health Center", subject: "Action required: immunization record missing", date: "2026-09-02", read: false, body: ["Our records show your second MMR dose has not been documented. A registration hold has been placed on your account.", "Upload your record in the Patient Portal or bring it to the Wellness Center, Room 110. Holds are usually released within two business days."] },
  { id: "msg-3", from: "Sequoia Library", office: "Access Services", subject: "Overdue item: Foundations of Algorithm Design (3rd ed.)", date: "2026-09-28", read: true, body: ["The item below is overdue and a $15.00 fine has been added to your student account.", "Call number QA76.9 .A43 R44 2023. Return it to any Sequoia Library book drop to stop further fines."] },
  { id: "msg-4", from: "Student Financial Services", office: "Student Financial Services (Bursar)", subject: "Your October installment is due October 15", date: addDays(SITE_NOW, -5), read: true, body: ["This is a reminder that your next installment payment is due on October 15, 2026.", "Payments after the due date are subject to a $25 late fee. View your account and pay online in RedwoodConnect."] },
  { id: "msg-5", from: "Office of the Registrar", office: "Office of the Registrar", subject: "Spring 2027 registration time tickets posted", date: addDays(SITE_NOW, -7), read: true, body: ["Registration time tickets for Spring 2027 are now available on the Registration page.", "Resolve any holds before your appointment time. Holds prevent registration."] },
  { id: "msg-6", from: "Career Center", office: "Career Center", subject: "Fall Career & Internship Fair – employers announced", date: addDays(SITE_NOW, -9), read: true, body: ["More than 60 employers will attend the Fall Career & Internship Fair in the Student Union, including several software and engineering firms hiring interns for summer 2027.", "Stop by the Career Center for a resume review before the fair."] },
  { id: "msg-7", from: "Housing & Residential Life", office: "Housing & Residential Life", subject: "Madrone Hall fire alarm testing", date: addDays(SITE_NOW, -14), read: true, body: ["Fire alarm testing will take place in Madrone Hall between 9:00 a.m. and noon. Alarms may sound several times. You do not need to evacuate during testing."] },
  { id: "msg-8", from: "Financial Aid & Scholarships", office: "Financial Aid & Scholarships", subject: "Fall 2026 aid disbursed", date: "2026-08-17", read: true, body: ["Your Fall 2026 financial aid has been applied to your student account. Any credit balance will be refunded by direct deposit within 14 days."] },
];

const portal: PortalStudent = {
  id: "R00482913", name: "Jordan Alvarez", preferredName: "Jordan",
  email: `jordan.alvarez@student.${DOMAIN}`, phone: "(707) 555-0187",
  address: { street: "Madrone Hall, Room 312", city: "Arcadia Falls", state: "CA", zip: brand.address.zip },
  program: "bs-computer-science", major: "Computer Science, B.S.", catalogYear: "2024–2025", classStanding: "Junior",
  expectedGraduation: "Spring 2028", advisor: "Marcus Bell, Ph.D.", advisorSlug: "marcus-bell",
  currentTerm: "Fall 2026", schedule, grades, cumulativeGpa: gpa(allGrades), creditsEarned,
  degreeAudit: { program: "bs-computer-science", totalRequired: 120, completed: creditsEarned, inProgress, groups },
  account: { ledger, balance: bal, nextDue: { date: "2026-10-15", amount: cents(Math.min(bal, 1200)) } },
  registration: { term: "Spring 2027", timeTicket: "2026-11-09T08:00", maxCredits: 18 },
  holds, todos, messages,
};

write("courses.json", courses);
write("directory.json", directory);
write("organizations.json", organizations);
write("jobs.json", jobs);
write("databases.json", databases);
write("athletics.json", athleticsData);
write("portal.json", portal);
console.log(`gen:data: ${courses.length} courses (${courses.reduce((s, c) => s + c.sections.length, 0)} sections), ${directory.length} directory, ${organizations.length} orgs, ${jobs.length} jobs, ${databases.length} databases, ${teamSeasons.length} teams, ${athleteProfiles.length} athletes, portal schedule ${schedule.length} courses`);
