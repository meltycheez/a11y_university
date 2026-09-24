// Types for the generated datasets in src/data/generated/*.json (written by scripts/generate-data.ts).
// Dates are ISO strings (YYYY-MM-DD); times are 24-hour "HH:MM". Money is in dollars.

export type Term = "Fall 2026" | "Spring 2027";
export type InstructionMode = "In person" | "Online" | "Hybrid";

export interface CourseSection {
  crn: string;
  section: string;
  term: Term;
  instructor: string;
  /** Slug of the instructor's entry in directory.json. */
  instructorSlug: string;
  mode: InstructionMode;
  /** Registrar day codes, e.g. "MWF", "TR"; "" for asynchronous online sections. */
  days: string;
  start: string;
  end: string;
  /** e.g. "SEH 214"; "" for online sections. */
  room: string;
  building: string;
  capacity: number;
  enrolled: number;
  waitlist: number;
}

export interface Course {
  /** Stable id, e.g. "cs-101". */
  id: string;
  /** Display code, e.g. "CS 101". */
  code: string;
  subject: string;
  subjectName: string;
  /** Catalog department slug when the subject belongs to one. */
  department?: string;
  college: string;
  number: number;
  level: "undergraduate" | "graduate";
  title: string;
  credits: number;
  terms: Term[];
  description: string;
  /** Course ids. */
  prerequisites: string[];
  sections: CourseSection[];
}

export interface DirectoryEntry {
  slug: string;
  name: string;
  title: string;
  kind: "leadership" | "faculty" | "staff";
  /** Office or department display name. */
  department: string;
  /** Catalog department slug for academic staff. */
  departmentSlug?: string;
  email: string;
  phone: string;
  building: string;
  room: string;
  officeHours?: string;
  /** True when a /faculty/:slug profile page exists. */
  hasProfile: boolean;
}

export interface StudentOrganization {
  slug: string;
  name: string;
  category: string;
  description: string;
  meets: string;
  location: string;
  email: string;
  members: number;
}

export interface JobPosting {
  id: string;
  title: string;
  category: "Staff" | "Faculty" | "Student";
  department: string;
  appointment: string;
  salary: string;
  posted: string;
  /** ISO date, or null when open until filled. */
  closes: string | null;
  location: string;
  summary: string;
  qualifications: string[];
}

export interface LibraryDatabase {
  slug: string;
  name: string;
  subjects: string[];
  description: string;
  coverage: string;
  fullText: boolean;
  access: "Campus & off-campus (RSU login)" | "On campus only" | "Open access";
}

export interface GameResult {
  outcome?: "W" | "L" | "T";
  /** e.g. "3-1", "78-71", "2nd of 11 teams". */
  score: string;
}

export interface Game {
  date: string;
  time: string;
  opponent: string;
  site: "Home" | "Away" | "Neutral";
  location: string;
  conference: boolean;
  result?: GameResult;
}

export interface RosterPlayer {
  number: string;
  name: string;
  position: string;
  classYear: "Fr." | "So." | "Jr." | "Sr." | "Gr.";
  hometown: string;
  height?: string;
  /** Catalog athlete slug when the player has a profile page. */
  athleteSlug?: string;
}

export interface TeamSeason {
  slug: string;
  season: string;
  headCoach: string;
  conference: string;
  record: string;
  schedule: Game[];
  roster: RosterPlayer[];
}

export interface AthleteProfile {
  slug: string;
  name: string;
  team: string;
  number: string;
  position: string;
  classYear: RosterPlayer["classYear"];
  hometown: string;
  highSchool: string;
  major: string;
  height?: string;
  stats: { label: string; value: string }[];
}

export interface Athletics {
  teams: TeamSeason[];
  athletes: AthleteProfile[];
}

export interface GradeRecord {
  courseId: string;
  code: string;
  title: string;
  credits: number;
  grade: string;
}

export interface TermGrades {
  term: string;
  courses: GradeRecord[];
  termGpa: number;
}

export interface ScheduledSection {
  courseId: string;
  code: string;
  title: string;
  credits: number;
  section: CourseSection;
}

export interface AuditCourse {
  courseId: string;
  code: string;
  title: string;
  credits: number;
  status: "complete" | "in-progress" | "not-started";
  grade?: string;
  term?: string;
}

export interface AuditGroup {
  name: string;
  requiredCredits: number;
  courses: AuditCourse[];
}

export interface LedgerEntry {
  date: string;
  term: string;
  description: string;
  type: "charge" | "payment" | "aid";
  /** Positive for charges, negative for payments and aid. */
  amount: number;
  balance: number;
}

export interface Hold {
  code: string;
  name: string;
  office: string;
  reason: string;
  added: string;
  blocks: string[];
  url: string;
}

export interface TodoItem {
  id: string;
  title: string;
  office: string;
  due: string | null;
  status: "open" | "complete";
  url: string;
}

export interface PortalMessage {
  id: string;
  from: string;
  office: string;
  subject: string;
  date: string;
  read: boolean;
  body: string[];
}

export interface PortalStudent {
  id: string;
  name: string;
  preferredName: string;
  email: string;
  phone: string;
  address: { street: string; city: string; state: string; zip: string };
  program: string;
  major: string;
  catalogYear: string;
  classStanding: string;
  expectedGraduation: string;
  advisor: string;
  advisorSlug: string;
  currentTerm: Term;
  schedule: ScheduledSection[];
  grades: TermGrades[];
  cumulativeGpa: number;
  creditsEarned: number;
  degreeAudit: { program: string; totalRequired: number; completed: number; inProgress: number; groups: AuditGroup[] };
  account: { ledger: LedgerEntry[]; balance: number; nextDue: { date: string; amount: number } };
  registration: { term: Term; timeTicket: string; maxCredits: number };
  holds: Hold[];
  todos: TodoItem[];
  messages: PortalMessage[];
}
