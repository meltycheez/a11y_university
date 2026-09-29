// Sequoia Library page data: a small OneSearch sample catalog, the patron account and research guide copy.
// Authors and titles are fictional (ADR-021); RSU people and publications match the news stories.
import { SITE_NOW } from "~/data/site";

export type Format = "Book" | "eBook" | "Article" | "Archival" | "Video";
export type Status = "Available" | "Checked out" | "Library use only" | "Online";

export interface CatalogRecord {
  id: string;
  title: string;
  author: string;
  year: number;
  format: Format;
  source?: string;
  subjects: string[];
  location: string;
  callNumber?: string;
  status: Status;
  due?: string;
}

export const records: CatalogRecord[] = [
  { id: "b1001", title: "Timber Towns of the North Coast, 1880–1960", author: "Mensah, Harold", year: 2011, format: "Book", subjects: ["Local history", "Logging", "Labor"], location: "Stacks, 4th floor", callNumber: "HD9757.C2 M46 2011", status: "Available" },
  { id: "b1002", title: "Arcadia Lumber Company payroll ledgers, 1902–1958", author: "Arcadia Lumber Company", year: 1958, format: "Archival", subjects: ["Local history", "Logging"], location: "Local History Archives", callNumber: "MS 14, Boxes 1–212", status: "Library use only" },
  { id: "b1003", title: "Warming trends in Arcadia tide pools, 2012–2026", author: "Begay, Naomi; Park, Ethan", year: 2026, format: "Article", source: "Annals of Coastal Ecology 41(2)", subjects: ["Marine biology", "Climate change"], location: "Online", status: "Online" },
  { id: "b1004", title: "Crown architecture and aboveground carbon in old-growth coast redwoods", author: "Santos, Miguel", year: 2026, format: "Article", source: "Pacific Journal of Forest Carbon 18(3)", subjects: ["Forest ecology", "Carbon"], location: "Online", status: "Online" },
  { id: "b1005", title: "Tide Pools of the Northern California Coast: A Field Guide", author: "Whitcomb, Laurel", year: 2019, format: "Book", subjects: ["Marine biology", "Field guides"], location: "Stacks, 3rd floor", callNumber: "QH105.C2 W45 2019", status: "Checked out", due: "2026-10-19" },
  { id: "b1006", title: "Salmon in the Silverfin: A River History", author: "Okonkwo, Adaeze", year: 2015, format: "Book", subjects: ["Fisheries", "Local history"], location: "Stacks, 4th floor", callNumber: "SH348 .O46 2015", status: "Available" },
  { id: "b1007", title: "Smoke on the Coast: Wildfire and Air Quality in the North", author: "Fernhaven Valley Media", year: 2022, format: "Video", subjects: ["Wildfire", "Air quality"], location: "Streaming", status: "Online" },
  { id: "b1008", title: "Writing with Sources: APA, MLA and Chicago for Students", author: "Marsh, Lena", year: 2024, format: "eBook", subjects: ["Citation", "Academic writing"], location: "Online", status: "Online" },
  { id: "b1009", title: "Evidence-Based Practice for Nurses: A Workbook", author: "Sandoval, Priya; Lindahl, Grete", year: 2023, format: "Book", subjects: ["Nursing", "Evidence-based practice"], location: "Course reserves, Circulation Desk", callNumber: "RT42 .S26 2023", status: "Library use only" },
  { id: "b1010", title: "Introduction to Mobile Robotics", author: "Farrow, Desmond", year: 2021, format: "Book", subjects: ["Robotics", "Engineering"], location: "Stacks, 2nd floor", callNumber: "TJ211.415 .F37 2021", status: "Checked out", due: "2026-10-28" },
  { id: "b1011", title: "Port Alder Tide, 1921–1989 (microfilm)", author: "Port Alder Tide", year: 1989, format: "Archival", subjects: ["Newspapers", "Local history"], location: "Local History Archives", callNumber: "MF 3, Reels 1–402", status: "Library use only" },
  { id: "b1012", title: "Green Solvents: Principles and Practice", author: "Adebayo, Tunde; Morel, Claire", year: 2020, format: "Book", subjects: ["Chemistry", "Sustainability"], location: "Stacks, 2nd floor", callNumber: "TP247.5 .A34 2020", status: "Available" },
  { id: "b1013", title: "Voices from the Woods: Arcadia Falls Oral History Project interviews", author: "Arcadia Falls Oral History Project", year: 2019, format: "Archival", subjects: ["Oral history", "Logging", "Local history"], location: "Online", status: "Online" },
  { id: "b1014", title: "Redwoods and People: A Cultural History of the Coast Forest", author: "Hale, Corinne", year: 2017, format: "Book", subjects: ["Forest ecology", "Local history"], location: "Stacks, 3rd floor", callNumber: "SD397.R3 H35 2017", status: "Checked out", due: "2026-10-12" },
];

export const patron = {
  name: "Jordan Alvarez",
  id: "RSU 2048 7731",
  type: "Undergraduate",
  expires: "2027-06-30",
  checkouts: [
    { id: "b1005", due: "2026-10-19", renewals: 0 },
    { id: "b1014", due: "2026-10-12", renewals: 1 },
    { id: "b1001", due: "2026-10-03", renewals: 3 },
  ],
  holds: [{ id: "b1010", placed: "2026-09-29", position: "2 of 3", pickup: "Circulation Desk, 1st floor" }],
  ill: [
    { title: "Fog drip and summer water use in coast redwood forests", source: "Journal of Western Hydrology 12(4)", requested: "2026-09-24", status: "Received: available in your account until October 15" },
    { title: "The Mill Town Family: Work and Home in Timber Country", source: "Book, Kestrel Bay University Library", requested: "2026-10-01", status: "Requested from lending library" },
  ],
};

export const today = SITE_NOW;

export interface GuideBox { title: string; paragraphs?: string[]; list?: string[]; links?: { label: string; href: string }[] }
export interface Guide {
  slug: string;
  summary: string;
  updated: string;
  librarian: { name: string; title: string; email: string; phone: string; room: string };
  boxes: GuideBox[];
  databases: string[];
  related: { label: string; href: string }[];
}

const keisha = { name: "Keisha Wu", title: "Research & Instruction Librarian", email: "keisha.wu@redwoodstate.edu", phone: "(707) 555-0298", room: "LIB 235" };
const julian = { name: "Julian Osei", title: "Health Sciences Librarian", email: "julian.osei@redwoodstate.edu", phone: "(707) 555-0172", room: "LIB 246" };
const graham = { name: "Graham Chen", title: "Archivist and Special Collections Librarian", email: "graham.chen@redwoodstate.edu", phone: "(707) 555-0189", room: "LIB 219" };

export const guides: Record<string, Guide> = {
  "citation-guide": {
    slug: "citation-guide",
    summary: "How to cite books, articles, websites and more in APA, MLA and Chicago style, plus tools that format citations for you.",
    updated: "Last updated: Aug 18, 2026",
    librarian: keisha,
    boxes: [
      {
        title: "Why cite?",
        paragraphs: [
          "Citations show your reader where your evidence came from, give credit to the people whose ideas you used, and let others find the same sources. Using someone else's words or ideas without credit is plagiarism under the RSU Student Conduct Code, even when it is accidental.",
          "Your instructor decides which style you use. If the assignment doesn't say, ask.",
        ],
      },
      {
        title: "Which style?",
        list: [
          "APA (7th edition): psychology, education, nursing, business and most social sciences.",
          "MLA (9th edition): English, languages and literature, and many humanities courses.",
          "Chicago (17th edition): history, art history and some fine arts. Notes-bibliography is most common in history.",
        ],
      },
      {
        title: "Quick examples: a journal article",
        list: [
          "APA: Begay, N., & Park, E. (2026). Warming trends in Arcadia tide pools, 2012–2026. Annals of Coastal Ecology, 41(2), 112–131.",
          "MLA: Begay, Naomi, and Ethan Park. \"Warming Trends in Arcadia Tide Pools, 2012–2026.\" Annals of Coastal Ecology, vol. 41, no. 2, 2026, pp. 112–131.",
          "Chicago: Begay, Naomi, and Ethan Park. \"Warming Trends in Arcadia Tide Pools, 2012–2026.\" Annals of Coastal Ecology 41, no. 2 (2026): 112–131.",
        ],
      },
      {
        title: "Citation managers",
        paragraphs: [
          "RSU Cite is licensed for everyone at Redwood State. It saves sources from OneSearch and most databases, formats bibliographies in thousands of styles, and plugs into your word processor. Workshops run every other Wednesday at 3 p.m. in LIB 140.",
        ],
        links: [{ label: "Citation Manager (RSU Cite) in Databases A–Z", href: "/library/databases#letter-c" }],
      },
      {
        title: "Get help",
        paragraphs: ["The Writing Studio in the Learning Center (first floor) reviews drafts and citations by appointment or drop-in. Librarians at the Research Help Desk can help you find missing citation details."],
      },
    ],
    databases: ["citation-manager-rsu-cite", "omnibus-article-search", "dissertations-theses-collection"],
    related: [{ label: "Academic advising", href: "/students/advising" }, { label: "Library Search", href: "/library/search" }],
  },
  "nursing-evidence-based-practice": {
    slug: "nursing-evidence-based-practice",
    summary: "Find, appraise and apply the best evidence for clinical questions. Built for NURS 310, NURS 420 and the B.S.N. capstone.",
    updated: "Last updated: Jan 9, 2026",
    librarian: julian,
    boxes: [
      {
        title: "Ask a focused question (PICO)",
        paragraphs: ["Turn a clinical problem into a searchable question by naming its parts:"],
        list: [
          "P: Patient, population or problem (adults after hip replacement)",
          "I: Intervention (early mobilization within 24 hours)",
          "C: Comparison (standard mobilization at 48 hours)",
          "O: Outcome (length of hospital stay)",
        ],
      },
      {
        title: "Levels of evidence",
        paragraphs: [
          "Start at the top of the evidence pyramid and work down: systematic reviews and meta-analyses, then randomized controlled trials, cohort and case-control studies, and finally expert opinion. Point-of-care summaries are a fast way to see what the best evidence says before you search the primary literature.",
        ],
      },
      {
        title: "Search tips",
        list: [
          "Search each PICO concept separately, then combine them with AND.",
          "Use subject headings in the Clinical Nursing Collection alongside keywords.",
          "Limit to the last 5 years for clinical practice questions, unless you need landmark studies.",
          "Save searches and set alerts from your database account.",
        ],
      },
      {
        title: "Clinical placements",
        paragraphs: ["Students at Port Alder Medical Center can reach every database below from hospital computers by signing in with RedwoodConnect. The B.S.N. Program Handbook explains how evidence projects are graded."],
        links: [{ label: "Nursing department", href: "/academics/departments/nursing" }],
      },
    ],
    databases: ["clinical-nursing-collection", "point-of-care-evidence-summaries", "biomedical-literature-search", "medication-reference-online", "behavioral-sciences-index"],
    related: [{ label: "Nursing, B.S.N.", href: "/academics/programs/bsn-nursing" }, { label: "Nursing Simulation Center earns accreditation", href: "/news/nursing-simulation-center-accreditation" }],
  },
  "local-history-archives": {
    slug: "local-history-archives",
    summary: "Photographs, ledgers, newspapers, maps and oral histories documenting Arcadia Falls, Fernhaven County and the North Coast.",
    updated: "Last updated: May 27, 2026",
    librarian: graham,
    boxes: [
      {
        title: "About the archives",
        paragraphs: [
          "The Arcadia Falls Local History Archives, on the second floor of Sequoia Library, collect the records of the communities of the North Coast. Holdings include timber company records, family papers, the Port Alder Tide on microfilm, county maps, and 612 interviews from the Arcadia Falls Oral History Project.",
          "In 2026 the library finished digitizing a century of logging records. More than 140,000 pages and images are now free to search online.",
        ],
      },
      {
        title: "Visit the reading room",
        list: [
          "Open Monday–Friday, 10:00 a.m. – 4:00 p.m.",
          "Request boxes at least two business days ahead by email.",
          "Pencils only; cameras without flash are welcome.",
          "Everyone is welcome. You don't need to be affiliated with RSU.",
        ],
      },
      {
        title: "Highlights",
        list: [
          "Arcadia Lumber Company payroll ledgers, 1902–1958 (MS 14)",
          "Logging camp and mill photographs, about 9,000 images",
          "Port Alder Tide, 1921–1989, on microfilm",
          "Arcadia Falls Oral History Project, 1994–2019",
        ],
        links: [{ label: "Logging Records Collection finding aid", href: "/documents/logging-records-finding-aid.pdf" }],
      },
      {
        title: "Donate materials",
        paragraphs: ["Do you have letters, photographs or business records from the region? The archivist will talk with you about donation, copying or loan for scanning. Please call before bringing materials."],
      },
    ],
    databases: ["arcadia-falls-logging-records", "north-coast-newspaper-archive", "california-digital-archive", "american-history-primary-sources"],
    related: [{ label: "Sequoia Library digitizes a century of logging records", href: "/news/library-digitizes-logging-archives" }, { label: "Department of History", href: "/academics/departments/history" }],
  },
};
