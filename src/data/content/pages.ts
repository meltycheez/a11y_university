// Hand-written copy for static (non-pattern) university pages, keyed by inventory route path.
// The search indexer reads `pageContent`; keep the export name and field shapes stable.
// Section files are merged here so each office's copy can live in its own file.
import { admissionsPages } from "./pages-admissions";
import { studentPages } from "./pages-students";
import { sectionPages } from "./pages-sections";

export interface PageSection {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
  table?: { caption?: string; columns: string[]; rows: string[][] };
  links?: { label: string; href: string }[];
}

export interface PageContent {
  summary?: string;
  /** Freeform "last updated" note as the office would write it, e.g. "Updated Spring 2019". */
  updated?: string;
  sections: PageSection[];
}

const universityPages: Record<string, PageContent> = {
  "/about": {
    summary: "A public research university rooted in Northern California's redwood coast since 1911.",
    updated: "Updated August 2026",
    sections: [
      {
        paragraphs: [
          "Redwood State University is a public comprehensive university on the far north coast of California, where the old-growth forest meets the Pacific. Founded in 1911 as Arcadia Falls Normal School to train teachers for the timber towns of the region, RSU today enrolls about 18,000 students in six colleges and more than 90 undergraduate and graduate programs.",
          "Our 310-acre campus sits on a terrace above the Silverfin River, a ten-minute walk from downtown Arcadia Falls. Students study marine biology in the tide pools at Gull Rock Point, test engineering prototypes in Sequoia Engineering Hall, and cross Canopy Green under second-growth redwoods on the way to class.",
        ],
      },
      {
        heading: "Redwood State at a glance",
        table: {
          caption: "Fall 2026 facts and figures",
          columns: ["Measure", "Figure"],
          rows: [
            ["Total enrollment", "17,940"],
            ["Undergraduates", "15,610"],
            ["Graduate students", "2,330"],
            ["First-generation college students", "46%"],
            ["Student-to-faculty ratio", "19:1"],
            ["Full-time faculty", "702"],
            ["Undergraduate majors", "64"],
            ["Graduate programs", "29"],
            ["Campus size", "310 acres, plus the 1,200-acre Tanoak Creek Research Forest"],
            ["Athletics", "14 IAA Division II teams, the Redwood Owls"],
            ["Living alumni", "112,000+"],
          ],
        },
      },
      {
        heading: "A university of place",
        paragraphs: [
          "RSU's research and teaching grow out of the landscape around it. Faculty and students study redwood canopy ecology, coastal fisheries, wildfire smoke, and the economies of rural communities. The university partners with the Indigenous peoples whose homelands include this coast on stewardship, language revitalization, and student support.",
          "We are also a university of opportunity. Nearly half of our students are the first in their families to attend college, and RSU is designated a Hispanic-Serving Institution by the U.S. Department of Education.",
        ],
      },
      {
        heading: "Learn more about RSU",
        links: [
          { label: "Mission, Vision & Values", href: "/about/mission" },
          { label: "Our History", href: "/about/history" },
          { label: "University Leadership", href: "/about/leadership" },
          { label: "Strategic Plan 2030", href: "/about/strategic-plan" },
          { label: "Accreditation", href: "/about/accreditation" },
          { label: "Campus Map", href: "/campus-map" },
          { label: "Read more", href: "/news" },
        ],
      },
    ],
  },

  "/about/mission": {
    summary: "Deep roots, wide branches: why Redwood State exists and what we value.",
    updated: "Approved by the Academic Senate and the President, May 2024",
    sections: [
      {
        heading: "Mission",
        paragraphs: [
          "Redwood State University educates students from California's north coast and around the world to think rigorously, act with integrity, and serve their communities. Through teaching, research, and creative work rooted in the natural and cultural landscape of the redwood region, we expand opportunity and help build a sustainable, just future.",
        ],
      },
      {
        heading: "Vision",
        paragraphs: [
          "By 2030, Redwood State will be recognized as the leading public university for place-based learning in the American West: a university where every student, whatever their background, finds a path to a degree and a life of purpose.",
        ],
      },
      {
        heading: "Our motto",
        paragraphs: [
          "The university motto, Radices altae, rami lati (Deep roots, wide branches), was adopted in 1961 when the institution became Redwood State College. It describes a redwood's strength: a shallow but wide-spreading root system that interlocks with its neighbors, so that the grove stands together. It is a fitting image for a university that asks its students to be grounded in knowledge and generous in reach.",
        ],
      },
      {
        heading: "Values",
        list: [
          "Access: we remove barriers to higher education and measure our success by the success of all our students.",
          "Stewardship: we care for the forests, rivers, and coast that sustain our region, and for the public trust placed in us.",
          "Inquiry: we pursue knowledge with curiosity, honesty, and rigor, and we share what we learn.",
          "Belonging: we build a campus where people of every identity and background are respected and supported.",
          "Partnership: we work alongside tribal nations, local communities, and employers as equals.",
          "Integrity: we act transparently and hold ourselves accountable.",
        ],
      },
      {
        heading: "Land acknowledgment",
        paragraphs: [
          "Redwood State University sits on the unceded ancestral lands of the Indigenous peoples whose homelands include this coast, who have stewarded this place since time immemorial. We acknowledge their ongoing relationship with these lands and waters, and we commit to supporting tribal sovereignty and Native student success.",
        ],
      },
    ],
  },

  "/about/history": {
    summary: "From a two-room normal school to a public university of 18,000 students.",
    updated: "Updated Spring 2025",
    sections: [
      {
        paragraphs: [
          "Redwood State began in the fall of 1911, when 34 students and three instructors met in two rented rooms above the Arcadia Falls Mercantile. The State of California had chartered Arcadia Falls Normal School to train teachers for the one-room schoolhouses of the lumber camps and coastal ranches. More than a century later, the university still carries that founding purpose: bringing education to a region that is far from everywhere else.",
        ],
      },
      {
        heading: "Timeline",
        table: {
          caption: "Key dates in Redwood State history",
          columns: ["Year", "Milestone"],
          rows: [
            ["1911", "Arcadia Falls Normal School opens with 34 students and three instructors in rented rooms downtown."],
            ["1914", "The school moves to the Canopy Drive terrace; Founders Hall, the first permanent building, is completed."],
            ["1921", "Renamed Arcadia Falls State Teachers College and authorized to grant the bachelor's degree."],
            ["1927", "First intercollegiate athletics; the teams are nicknamed the Timbermen."],
            ["1935", "Enrollment passes 500. The college library moves into the new Whitcomb wing of Founders Hall."],
            ["1946", "Veterans returning from World War II double enrollment in two years."],
            ["1961", "Becomes Redwood State College and joins the state college system; the motto Radices altae, rami lati is adopted."],
            ["1968", "Sequoia Library opens on Canopy Green."],
            ["1972", "Redwood State becomes Redwood State University. Athletics teams become the Redwood Owls."],
            ["1978", "Tanoak Creek Research Forest, 1,200 acres of second-growth redwood, is donated by the Kellerman family."],
            ["1989", "The College of Engineering is established; Sequoia Engineering Hall opens in 1994."],
            ["2003", "Owl Arena opens, replacing the 1951 Men's Gymnasium."],
            ["2011", "Centennial year. Enrollment reaches 15,000 and the Centennial Campaign raises $112 million."],
            ["2016", "The Canopy Science Center opens, the university's first net-zero energy building."],
            ["2020", "Classes move online in March; the campus reopens fully in fall 2021."],
            ["2022", "RSU is designated a Hispanic-Serving Institution."],
            ["2024", "Strategic Plan 2030: Deep Roots, Wide Branches is adopted."],
            ["2026", "Madrone Hall opens with 400 new beds. Fall enrollment reaches a record 17,940."],
          ],
        },
      },
      {
        heading: "Presidents of the university",
        paragraphs: [
          "Redwood State has had 13 presidents. Dr. Elena Vásquez-Hart became the 13th president in July 2021 and is the first Latina to lead the university.",
        ],
        links: [{ label: "Meet the current leadership team", href: "/about/leadership" }],
      },
      {
        heading: "Explore the archives",
        paragraphs: [
          "Photographs, yearbooks, and the papers of the normal school's first principal, Clara B. Whitcomb, are held in the Arcadia Falls Local History Archives at Sequoia Library.",
        ],
        links: [
          { label: "Arcadia Falls Local History Archives", href: "/library/guides/local-history-archives" },
          { label: "Click here", href: "/library" },
        ],
      },
    ],
  },

  "/about/leadership": {
    summary: "The president's cabinet guides Redwood State's academic, student, financial, research, and advancement work.",
    updated: "Updated July 2026",
    sections: [
      {
        paragraphs: [
          "Redwood State University is led by President Elena Vásquez-Hart and a cabinet of vice presidents, each responsible for a major area of the university. The cabinet works with the Academic Senate, Associated Students, and staff councils under the system of shared governance set out in the university's constitution.",
          "The president reports to the Board of Trustees of the state university system and is advised by the RSU Advisory Board, a group of alumni, business leaders, and tribal representatives from across the north coast.",
        ],
      },
      {
        heading: "Contact the Office of the President",
        list: [
          "Founders Hall 300, 1400 Canopy Drive, Arcadia Falls, CA 95579",
          "Phone: (707) 555-0101",
          "Email: president@redwoodstate.example.edu",
        ],
        links: [{ label: "Strategic Plan 2030", href: "/about/strategic-plan" }],
      },
    ],
  },

  "/about/accreditation": {
    summary: "Redwood State University is accredited by the Pacific Accrediting Commission for Colleges and Universities.",
    updated: "Updated Fall 2023",
    sections: [
      {
        heading: "Institutional accreditation",
        paragraphs: [
          "Redwood State University is accredited by the Pacific Accrediting Commission for Colleges and Universities (PACCU), 400 Harbor Plaza, Suite 900, Westmere, CA. The university was first accredited in 1949 and most recently received reaffirmation of accreditation for ten years in 2021. The next reaffirmation review is scheduled for 2030–31, with a Mid-Cycle Review completed in spring 2025.",
          "Accreditation documents, including the Institutional Report, the Commission action letter, and the Mid-Cycle Review, are available below. Questions may be directed to the Office of Academic Planning and Assessment at (707) 555-0112.",
        ],
        links: [
          { label: "2021 PACCU Commission Action Letter (PDF)", href: "/documents/catalog-addendum-2025-26.pdf" },
          { label: "Read more", href: "/documents/catalog-addendum-2025-26.pdf" },
        ],
      },
      {
        heading: "Specialized and program accreditation",
        table: {
          caption: "Programs holding specialized accreditation",
          columns: ["Program", "Accrediting body", "Next review"],
          rows: [
            ["B.S. Computer Science", "Engineering Programs Accreditation Board (EPAB), Computing Commission", "2028–29"],
            ["B.S. Mechanical Engineering", "Engineering Programs Accreditation Board (EPAB)", "2028–29"],
            ["B.B.A. and M.B.A.", "Association for Business School Accreditation (ABSA)", "2027–28"],
            ["B.S.N. Nursing", "National Council for Nursing Program Accreditation (NCNPA)", "2031"],
            ["B.S. Chemistry (CESC track)", "Chemical Education Standards Council (CESC)", "2027"],
            ["Teacher Credential Programs", "State Teacher Credentialing Board", "2029"],
            ["Counseling & Psychological Services", "Council for Counseling Center Accreditation (CCCA)", "2028"],
          ],
        },
      },
      {
        heading: "Student complaints",
        paragraphs: [
          "Students who believe the university has not complied with accreditation standards may file a complaint with PACCU after first exhausting the university's internal grievance procedures, described in the Student Conduct Code.",
        ],
        links: [{ label: "Student Conduct Code (PDF)", href: "/documents/student-conduct-code.pdf" }],
      },
    ],
  },

  "/about/strategic-plan": {
    summary: "Strategic Plan 2030 sets four pillars to guide Redwood State through the end of the decade.",
    updated: "Adopted June 2024; 2026 progress report added September 2026",
    sections: [
      {
        paragraphs: [
          "Strategic Plan 2030: Deep Roots, Wide Branches was developed over 18 months with input from more than 3,200 students, faculty, staff, alumni, and community partners. It sets four pillars, each with measurable goals, and is reviewed annually by the University Planning Council.",
        ],
      },
      {
        heading: "Pillar 1: Student Success",
        paragraphs: [
          "Every student who comes to Redwood State should leave with a degree and a plan. We will close equity gaps in graduation, strengthen advising, and make the cost of a degree predictable.",
        ],
        list: [
          "Raise the six-year graduation rate from 58% to 70%.",
          "Eliminate equity gaps for first-generation, Pell-eligible, and underrepresented students.",
          "Assign every first-year student a professional advisor and a faculty mentor.",
          "Expand the First-Generation Scholars program to 1,000 students.",
        ],
      },
      {
        heading: "Pillar 2: Place-Based Research",
        paragraphs: [
          "Our location is our advantage. We will grow research that matters to the redwood coast and to places like it everywhere: forests, fisheries, fire, water, and rural health.",
        ],
        list: [
          "Double external research funding to $60 million a year.",
          "Launch the Institute for Coastal Forest Resilience in the Canopy Science Center.",
          "Guarantee a paid research or creative experience to every interested undergraduate.",
        ],
      },
      {
        heading: "Pillar 3: Community & Belonging",
        paragraphs: [
          "Redwood State will be a place where everyone belongs. We will invest in housing, basic needs, and the people who make the university work.",
        ],
        list: [
          "Add 1,000 beds of student housing, beginning with Madrone Hall (opened 2026).",
          "Guarantee first- and second-year students access to on-campus housing.",
          "Deepen partnerships with the Indigenous peoples whose homelands include this coast.",
          "Improve faculty and staff retention through competitive pay and professional development.",
        ],
      },
      {
        heading: "Pillar 4: Sustainable Stewardship",
        paragraphs: [
          "We will manage our campus, our forest, and our finances for the long term.",
        ],
        list: [
          "Reach carbon neutrality for campus operations by 2035.",
          "Complete the $250 million Wide Branches campaign.",
          "Maintain a balanced budget and a reserve of at least 15% of operating expenses.",
        ],
      },
      {
        heading: "Progress to date",
        table: {
          caption: "Strategic Plan 2030 key indicators",
          columns: ["Indicator", "2023 baseline", "Fall 2026", "2030 target"],
          rows: [
            ["Six-year graduation rate", "58%", "61%", "70%"],
            ["First-year retention", "76%", "80%", "88%"],
            ["External research funding", "$30.4M", "$38.9M", "$60M"],
            ["On-campus beds", "3,650", "4,050", "4,650"],
            ["Wide Branches campaign", "$0", "$141M", "$250M"],
          ],
        },
        links: [{ label: "Wide Branches campaign", href: "/giving/campaigns" }],
      },
    ],
  },

  "/campus-map": {
    summary: "Find buildings, parking, and accessible routes on the Redwood State campus.",
    updated: "Map updated Fall 2021",
    sections: [
      {
        paragraphs: [
          "Use the interactive map to find academic buildings, residence halls, dining locations, and parking. Select a building to see its address, hours, and accessible entrances. A printable parking map is also available.",
        ],
        links: [
          { label: "Parking Map (PDF)", href: "/documents/parking-map.pdf" },
          { label: "Parking Services", href: "/students/parking" },
          { label: "Visitor information", href: "/visitors" },
        ],
      },
      {
        heading: "Major buildings",
        table: {
          columns: ["Building", "Code", "Uses"],
          rows: [
            ["Founders Hall", "FH", "Administration, Office of the President, Registrar"],
            ["Sequoia Library", "LIB", "Library, Learning Center, Writing Studio"],
            ["Sequoia Engineering Hall", "SEH", "College of Engineering, Robotics Lab"],
            ["Canopy Science Center", "CSC", "Biology, Chemistry, Institute for Coastal Forest Resilience"],
            ["Madrone Hall", "MAD", "Residence hall (opened 2026)"],
            ["Owl Arena", "ARENA", "Basketball, volleyball, Commencement"],
            ["Redwood Field", "FIELD", "Soccer and track"],
            ["Rowan Student Union", "TSU", "Dining, bookstore, student organizations"],
            ["Huckleberry Hall", "HH", "College of Health Sciences, Student Health Center"],
            ["Spruce Hall", "SPR", "College of Business"],
            ["Alder Hall", "ALD", "College of Arts & Humanities"],
            ["Fir Hall", "FIR", "College of Education, Psychology"],
          ],
        },
      },
    ],
  },

  "/contact": {
    summary: "Reach the right office at Redwood State University.",
    sections: [
      {
        heading: "Main switchboard",
        list: [
          "Redwood State University, 1400 Canopy Drive, Arcadia Falls, CA 95579",
          "Phone: (707) 555-0100, Monday through Friday, 8 a.m. to 5 p.m.",
          "Email: info@redwoodstate.example.edu",
        ],
      },
      {
        heading: "Frequently contacted offices",
        table: {
          caption: "Campus office directory",
          columns: ["Office", "Phone", "Email", "Location"],
          rows: [
            ["Admissions", "(707) 555-0120", "admissions@redwoodstate.example.edu", "Founders Hall 110"],
            ["Financial Aid", "(707) 555-0125", "finaid@redwoodstate.example.edu", "Founders Hall 120"],
            ["Registrar", "(707) 555-0130", "registrar@redwoodstate.example.edu", "Founders Hall 130"],
            ["Student Accounts", "(707) 555-0132", "studentaccounts@redwoodstate.example.edu", "Founders Hall 140"],
            ["Housing & Residential Life", "(707) 555-0140", "housing@redwoodstate.example.edu", "Redwood Commons 101"],
            ["Student Health Center", "(707) 555-0150", "health@redwoodstate.example.edu", "Huckleberry Hall 100"],
            ["Campus Safety (non-emergency)", "(707) 555-0160", "safety@redwoodstate.example.edu", "Cedar Building"],
            ["Sequoia Library", "(707) 555-0170", "library@redwoodstate.example.edu", "Sequoia Library"],
            ["Human Resources", "(707) 555-0180", "hr@redwoodstate.example.edu", "Founders Hall 210"],
            ["Advancement and Giving", "(707) 555-0190", "giving@redwoodstate.example.edu", "Founders Hall 320"],
            ["Athletics", "(707) 555-0195", "owls@redwoodstate.example.edu", "Owl Arena"],
            ["Media Relations", "(707) 555-0105", "news@redwoodstate.example.edu", "Founders Hall 305"],
          ],
        },
      },
      {
        heading: "Emergencies",
        paragraphs: ["For emergencies on campus, call 911. Campus Safety officers are on duty 24 hours a day."],
        links: [{ label: "Campus Safety", href: "/students/safety" }],
      },
    ],
  },

  // Audience and utility pages
  "/alumni": {
    summary: "Stay connected to Redwood State and more than 112,000 fellow Owls.",
    sections: [
      {
        paragraphs: [
          "The RSU Alumni Association keeps graduates connected through regional chapters, career networking, and events like Homecoming & Family Weekend. Membership is free for all graduates.",
        ],
        list: [
          "Update your contact information to receive Redwood Rings, the alumni magazine.",
          "Join a chapter in Westmere, Kestrel Bay, San Aurelio, the state capital, or the Pacific Northwest.",
          "Mentor a current student through the Owl-to-Owl program.",
          "Order transcripts or verify your degree through the Registrar.",
        ],
        links: [
          { label: "Alumni Giving", href: "/giving/alumni" },
          { label: "Homecoming 2026", href: "/events/homecoming-2026" },
          { label: "Alumni News", href: "/news/category/alumni" },
          { label: "Order transcripts", href: "/students/registrar" },
        ],
      },
    ],
  },

  "/parents": {
    summary: "Resources for the parents and families of Redwood State students.",
    sections: [
      {
        paragraphs: [
          "Families are partners in student success. The Office of Family Programs answers questions, hosts Family Weekend each October, and publishes a monthly family newsletter during the academic year.",
          "Under the federal Family Educational Rights and Privacy Act (FERPA), the university cannot share most education records with parents unless the student gives written consent through RedwoodConnect.",
        ],
        links: [
          { label: "FERPA notice (PDF)", href: "/documents/ferpa-annual-notice.pdf" },
          { label: "Tuition & Fees", href: "/admissions/tuition" },
          { label: "Housing", href: "/students/housing" },
          { label: "Campus Safety", href: "/students/safety" },
        ],
      },
      {
        heading: "Contact Family Programs",
        list: ["Phone: (707) 555-0145", "Email: families@redwoodstate.example.edu"],
      },
    ],
  },

  "/visitors": {
    summary: "Plan your visit to Redwood State and Arcadia Falls.",
    sections: [
      {
        paragraphs: [
          "Arcadia Falls is about five hours north of Westmere on the coast highway, and 15 minutes from the Arcadia–North Coast Regional Airport. Visitor parking is available in Lot A off Canopy Drive; permits can be purchased from pay stations or the ParkRSU app.",
        ],
        links: [
          { label: "Campus Map", href: "/campus-map" },
          { label: "Visitor parking", href: "/students/parking" },
          { label: "Schedule an admissions tour", href: "/admissions/visit" },
          { label: "Events Calendar", href: "/events" },
        ],
      },
      {
        heading: "Places to stay",
        list: [
          "The Canopy Inn, 0.4 miles from campus, offers an RSU rate.",
          "Silverfin River Lodge, downtown Arcadia Falls.",
          "Gull Rock Point Campground (seasonal), 12 miles north.",
        ],
      },
    ],
  },

  "/faculty-staff": {
    summary: "Quick links for Redwood State faculty and staff.",
    sections: [
      {
        links: [
          { label: "Faculty & Staff Resources", href: "/employees" },
          { label: "Human Resources", href: "/employees/hr" },
          { label: "Benefits", href: "/employees/benefits" },
          { label: "Payroll", href: "/employees/payroll" },
          { label: "Employee Directory", href: "/employees/directory" },
          { label: "Academic Calendar", href: "/academics/calendar" },
          { label: "Employment Opportunities", href: "/employees/jobs" },
        ],
      },
    ],
  },

  "/accessibility": {
    summary: "Redwood State University is committed to making its websites, courses, and campus accessible to everyone.",
    updated: "Updated March 2022",
    sections: [
      {
        heading: "Our commitment",
        paragraphs: [
          "Redwood State University strives to ensure that its websites conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, in accordance with Section 508 of the Rehabilitation Act, Title II of the Americans with Disabilities Act, and state university system policy.",
          "Some older pages, PDF documents, and third-party systems may not yet meet these standards. We are working to remediate them.",
        ],
      },
      {
        heading: "Report a barrier",
        paragraphs: [
          "If you encounter content you cannot access, contact the Web Accessibility Coordinator. Please include the page address and a description of the problem. We will respond within five business days.",
        ],
        list: ["Email: accessibility@redwoodstate.example.edu", "Phone: (707) 555-0108"],
      },
      {
        heading: "Student accommodations",
        paragraphs: [
          "Students with disabilities can request academic accommodations through the Disability Resource Center, Sequoia Library, Room 140, (707) 555-0155.",
        ],
      },
    ],
  },

  "/policies/privacy": {
    summary: "How Redwood State University collects, uses, and protects information on its websites.",
    updated: "Updated Spring 2019",
    sections: [
      {
        heading: "Information we collect",
        paragraphs: [
          "When you visit redwoodstate.example.edu, our servers automatically log standard information such as your IP address, browser type, the pages you visit, and the date and time of your visit. This information is used in aggregate to maintain and improve the site. We use cookies to remember preferences and to support analytics.",
          "Information you submit in forms, such as a request for information or an application, is used only for the purpose for which it was collected and is handled in accordance with the California Information Practices Act of 1977.",
        ],
      },
      {
        heading: "Education records",
        paragraphs: [
          "Student education records are protected under FERPA. See the annual FERPA notice for details on your rights.",
        ],
        links: [{ label: "Annual FERPA Notice (PDF)", href: "/documents/ferpa-annual-notice.pdf" }],
      },
      {
        heading: "Questions",
        paragraphs: ["Contact the Information Security Office at (707) 555-0109 or privacy@redwoodstate.example.edu."],
      },
    ],
  },
};

export const pageContent: Record<string, PageContent> = {
  ...universityPages,
  ...admissionsPages,
  ...studentPages,
  ...sectionPages,
};
