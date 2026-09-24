// Hand-written copy for college, department, and program pages. Keys are catalog slugs (src/data/catalog.ts).
// Department chairs are catalog faculty names, verbatim.

export interface Contact { label: string; value: string }

export interface CollegeContent {
  overview: string;
  dean: string;
  highlights: string[];
  contacts: Contact[];
  image: `college-${string}`;
}

export interface DepartmentContent {
  overview: string;
  chair: string;
  highlights: string[];
  contacts: Contact[];
  image: `dept-${string}`;
}

export interface ProgramContent {
  overview: string;
  requirements: { label: string; units: number }[];
  outcomes: string[];
  sampleCourses: string[];
  careers: string[];
  totalUnits: number;
}

const contacts = (office: string, ext: string, email: string, extra: Contact[] = []): Contact[] => [
  { label: "Office", value: office },
  { label: "Phone", value: `(707) 555-${ext}` },
  { label: "Email", value: `${email}@redwoodstate.example.edu` },
  ...extra,
];

export const collegeContent: Record<string, CollegeContent> = {
  engineering: {
    overview:
      "The College of Engineering prepares engineers and computer scientists to design technology for a changing world, from autonomous forest-monitoring drones to low-cost water sensors for rural communities. Students learn by building: every major includes a two-semester senior capstone with an industry, tribal, or public agency partner. The college is home to the Departments of Computer Science and Mechanical Engineering and to the new Robotics Lab in Sequoia Engineering Hall.",
    dean: "Dr. Victor Almeida",
    highlights: [
      "ABET-accredited B.S. programs in Computer Science and Mechanical Engineering",
      "New 6,000-square-foot Robotics Lab opened in Sequoia Engineering Hall in 2026",
      "Senior capstone projects with more than 40 industry and agency partners",
      "Student chapters of SHPE, SWE, NSBE, and ACM",
      "92% of graduates employed or in graduate school within six months",
    ],
    contacts: contacts("Sequoia Engineering Hall 200", "0210", "engineering", [{ label: "Hours", value: "Monday–Friday, 8 a.m. to 5 p.m." }]),
    image: "college-engineering",
  },
  business: {
    overview:
      "The College of Business educates ethical, analytical leaders for the businesses, nonprofits, and public agencies of the north coast and beyond. AACSB-accredited since 1998, the college offers the B.B.A. with seven concentrations and a hybrid M.B.A. designed for working professionals. Through the Small Business Development Center, students consult with more than 200 regional businesses every year.",
    dean: "Dr. Lorraine Whitaker",
    highlights: [
      "AACSB International accreditation, held by fewer than 6% of business schools worldwide",
      "Hybrid M.B.A. with evening and weekend residencies",
      "Student-managed Redwood Investment Fund with $1.2 million in assets",
      "North Coast Small Business Development Center, housed in Spruce Hall",
      "Concentrations in sustainable business, analytics, and hospitality and tourism",
    ],
    contacts: contacts("Spruce Hall 300", "0220", "business"),
    image: "college-business",
  },
  "arts-humanities": {
    overview:
      "The College of Arts & Humanities is the university's oldest college, tracing its roots to the normal school's English and history faculty. Today it offers programs in English, history, languages, art, music, theatre, philosophy, and Native American studies. Students write for the award-winning Toyon literary journal, perform with the Redwood Chorale, and work with the region's archives and museums.",
    dean: "Dr. Helena Marchetti",
    highlights: [
      "Toyon, the student literary journal, published continuously since 1954",
      "Redwood Chorale and the North Coast Repertory Theatre partnership",
      "Public history internships with the Arcadia Falls Historical Society",
      "Native American Studies program developed with regional tribal nations",
      "Reese Bullen Gallery exhibitions featuring students and faculty",
    ],
    contacts: contacts("Alder Hall 110", "0230", "cah"),
    image: "college-arts-humanities",
  },
  science: {
    overview:
      "The College of Science is RSU's largest college, enrolling more than 5,000 students in biology, chemistry, mathematics, psychology, physics, geology, and environmental science. Faculty lead nationally funded research in redwood canopy ecology, marine biology, green chemistry, and sleep science, and most research labs include undergraduates. The Canopy Science Center, opened in 2016, houses teaching and research labs and the Institute for Coastal Forest Resilience.",
    dean: "Dr. Raymond Kessler",
    highlights: [
      "$22 million in external research funding in 2025–26",
      "Kellerman Research Forest and the Trinidad Point Marine Lab for field research",
      "Canopy Science Center, a LEED Platinum research and teaching building",
      "Paid undergraduate research through the Canopy Summer Research Program",
      "Pre-health advising for medicine, dentistry, pharmacy, and veterinary medicine",
    ],
    contacts: contacts("Canopy Science Center 150", "0240", "science"),
    image: "college-science",
  },
  education: {
    overview:
      "The College of Education continues the university's founding mission: preparing teachers for the schools of rural Northern California. The college offers Multiple Subject, Single Subject, and Education Specialist credentials, the M.A. in Education, and the undergraduate Child Development major. Credential candidates complete a full year of clinical practice in partner districts from Crescent City to Ukiah.",
    dean: "Dr. Gloria Etsitty",
    highlights: [
      "Commission on Teacher Credentialing accredited programs",
      "Paid teacher residency with 14 partner school districts",
      "Rural Teacher Pathway scholarships for students who commit to teaching in the region",
      "Graduates include the 2026 California Teacher of the Year",
      "Children's Center lab school on campus",
    ],
    contacts: contacts("Fir Hall 200", "0250", "education"),
    image: "college-education",
  },
  "health-sciences": {
    overview:
      "The College of Health Sciences prepares nurses, public health professionals, and kinesiologists to care for rural and underserved communities. The college includes the School of Nursing, the Department of Public Health, and the Department of Kinesiology and Recreation. Students train in the Huckleberry Hall Simulation Center, which earned national accreditation in 2026, and complete clinical placements across six counties.",
    dean: "Dr. Samuel Whitehorse",
    highlights: [
      "CCNE-accredited B.S.N. with a 94% first-time NCLEX pass rate",
      "Nationally accredited Nursing Simulation Center in Huckleberry Hall",
      "Rural Health Scholars program with regional hospitals and tribal clinics",
      "B.S. in Public Health with community health and environmental health tracks",
      "Kinesiology students staff the Owl Athletics training room",
    ],
    contacts: contacts("Huckleberry Hall 300", "0260", "health"),
    image: "college-health-sciences",
  },
};

export const departmentContent: Record<string, DepartmentContent> = {
  "computer-science": {
    overview:
      "The Department of Computer Science offers the B.S. and M.S. in Computer Science and a minor in data science. The curriculum balances theory and practice, with small lab sections, a required software engineering sequence, and a senior capstone. Faculty research spans machine learning for environmental sensing, human-computer interaction and accessibility, and distributed systems. The B.S. is an impacted program.",
    chair: "Anjali Raman, Ph.D.",
    highlights: [
      "ABET-accredited B.S. in Computer Science",
      "Student-built wildfire smoke sensor network covering four counties",
      "Accessible Computing Lab, focused on inclusive software design",
      "Annual Owl Hacks hackathon",
      "Accelerated B.S./M.S. pathway: complete both degrees in five years",
    ],
    contacts: contacts("Sequoia Engineering Hall 310", "0211", "cs", [{ label: "Advising", value: "Walk-in, Tuesdays and Thursdays, 1–3 p.m." }]),
    image: "dept-computer-science",
  },
  "mechanical-engineering": {
    overview:
      "The Department of Mechanical Engineering educates engineers in thermal-fluid systems, mechanics, design, and manufacturing, with an emphasis on renewable energy and robotics. Students use the Robotics Lab, the Machine Shop, and the Wave Energy Test Flume, and many compete on the Formula SAE and Human Powered Vehicle teams.",
    chair: "Kenji Watanabe, Ph.D.",
    highlights: [
      "ABET-accredited B.S. in Mechanical Engineering",
      "Wave Energy Test Flume, one of three at a West Coast public university",
      "Formula SAE and Human Powered Vehicle competition teams",
      "Fundamentals of Engineering (FE) exam pass rate above the national average",
    ],
    contacts: contacts("Sequoia Engineering Hall 220", "0212", "me"),
    image: "dept-mechanical-engineering",
  },
  "business-administration": {
    overview:
      "The Department of Business Administration administers the B.B.A. and M.B.A. degrees and the minors in business and business analytics. Concentrations include accounting, finance, management, marketing, analytics, sustainable business, and hospitality and tourism. Pursuant to AACSB Standard 4, curricula are reviewed through the department's Assurance of Learning process each academic year.",
    chair: "Denise Carter, Ph.D.",
    highlights: [
      "Seven B.B.A. concentrations",
      "Hybrid M.B.A. for working professionals",
      "Volunteer Income Tax Assistance (VITA) site serving 700 households a year",
      "Redwood Investment Fund, managed by students",
    ],
    contacts: contacts("Spruce Hall 210", "0221", "busadmin"),
    image: "dept-business-administration",
  },
  english: {
    overview:
      "The Department of English offers the B.A. in English with concentrations in literature, creative writing, and English education, the M.A. in English, and the TESOL certificate. Majors study literature from Chaucer to contemporary Indigenous writers, take workshops with published poets and novelists, and edit the Toyon literary journal.",
    chair: "James O'Connell, Ph.D.",
    highlights: [
      "Toyon literary journal, published since 1954",
      "Visiting Writers Series, bringing six authors to campus each year",
      "Writing Studio tutoring staffed by English majors",
      "English Single Subject credential pathway",
    ],
    contacts: contacts("Alder Hall 230", "0231", "english"),
    image: "dept-english",
  },
  history: {
    overview:
      "The Department of History offers the B.A. in History with concentrations in U.S., world, and public history, and minors in history and public history. The department has particular strength in the history of the American West, environmental history, and California Indian history. Students work with the Arcadia Falls Local History Archives and complete internships with museums and historical societies.",
    chair: "Carmen Ruiz, Ph.D.",
    highlights: [
      "Public history concentration with museum and archive internships",
      "Student digitization of the Arcadia Falls logging archives",
      "Phi Alpha Theta honor society chapter",
      "History-Social Science Single Subject credential pathway",
    ],
    contacts: contacts("Alder Hall 310", "0232", "history"),
    image: "dept-history",
  },
  mathematics: {
    overview:
      "The Department of Mathematics offers the B.S. in Mathematics with concentrations in pure mathematics, applied mathematics, statistics, and mathematics education, as well as minors in mathematics and applied statistics. The department also teaches nearly 6,000 students each year in general education and service courses, supported by the Math Learning Center.",
    chair: "Olga Petrova, Ph.D.",
    highlights: [
      "Concentrations in pure, applied, statistics, and teaching",
      "Math Learning Center with free drop-in tutoring",
      "Undergraduate research in mathematical ecology and data science",
      "Putnam Competition team and Math Circle for local high schoolers",
    ],
    contacts: contacts("Canopy Science Center 410", "0241", "math"),
    image: "dept-mathematics",
  },
  biology: {
    overview:
      "The Department of Biology is one of the largest on campus, offering the B.S. in Biology with concentrations in cellular and molecular biology, ecology, marine biology, botany, and zoology. Faculty and students study tide pools, redwood canopies, salmon, and the microbial world, using the Kellerman Research Forest and the Trinidad Point Marine Lab as outdoor laboratories.",
    chair: "Miguel Santos, Ph.D.",
    highlights: [
      "Trinidad Point Marine Lab and the Kellerman Research Forest",
      "Redwood canopy research using rope-access climbing",
      "Five concentrations, including marine biology",
      "Vertebrate Museum and Herbarium with 90,000 specimens",
      "Strong pre-health outcomes for medical, dental, and veterinary schools",
    ],
    contacts: contacts("Canopy Science Center 210", "0242", "biology"),
    image: "dept-biology",
  },
  chemistry: {
    overview:
      "The Department of Chemistry offers the B.S. in Chemistry, including an American Chemical Society certified track and a biochemistry concentration, and a minor in chemistry. Research groups focus on green solvents, environmental analytical chemistry, and marine natural products, supported by a $2.4 million federal grant awarded in 2026.",
    chair: "Fatima Haddad, Ph.D.",
    highlights: [
      "ACS-certified degree track",
      "$2.4 million grant for green solvent research",
      "NMR, mass spectrometry, and X-ray facilities available to undergraduates",
      "Chemistry Club outreach to 30 regional schools",
    ],
    contacts: contacts("Canopy Science Center 310", "0243", "chemistry"),
    image: "dept-chemistry",
  },
  psychology: {
    overview:
      "The Department of Psychology offers the B.A. in Psychology and a minor in psychology. Students study development, cognition, social behavior, clinical science, and research methods, and many join faculty labs studying sleep, rural mental health, and child development. The department's sleep study helped move RSU's earliest classes from 8 a.m. to 8:30 a.m.",
    chair: "Rebecca Stein, Ph.D.",
    highlights: [
      "Research labs in sleep, cognition, and rural mental health",
      "Psi Chi honor society chapter",
      "Field placements with counseling and social service agencies",
      "Preparation for graduate study in psychology, counseling, and social work",
    ],
    contacts: contacts("Fir Hall 320", "0244", "psychology"),
    image: "dept-psychology",
  },
  nursing: {
    overview:
      "The School of Nursing offers the pre-licensure B.S.N. and an RN-to-B.S.N. pathway for registered nurses. Students train in the nationally accredited Simulation Center in Huckleberry Hall and complete clinical rotations at hospitals, clinics, and tribal health centers across the north coast. The B.S.N. is an impacted program with a separate application.",
    chair: "Patricia Nguyen, D.N.P., R.N.",
    highlights: [
      "CCNE-accredited B.S.N.",
      "94% first-time NCLEX-RN pass rate (2025)",
      "Nationally accredited Nursing Simulation Center",
      "Clinical partnerships with 22 regional health care sites",
      "Online RN-to-B.S.N. pathway",
    ],
    contacts: contacts("Huckleberry Hall 310", "0261", "nursing", [{ label: "Pre-nursing advising", value: "Huckleberry Hall 305" }]),
    image: "dept-nursing",
  },
};

// Requirement blocks per program sum to totalUnits.
const ge = (units = 48) => ({ label: "General Education", units });

export const programContent: Record<string, ProgramContent> = {
  "bs-computer-science": {
    overview:
      "The B.S. in Computer Science gives students a strong foundation in programming, algorithms, systems, and software engineering, with electives in machine learning, security, human-computer interaction, and game development. Students finish with a two-semester capstone building software for a real client.",
    requirements: [ge(), { label: "Lower-division core", units: 24 }, { label: "Mathematics and science support", units: 16 }, { label: "Upper-division core", units: 18 }, { label: "Upper-division electives", units: 9 }, { label: "Senior capstone", units: 6 }],
    outcomes: [
      "Analyze complex problems and apply computing principles to identify solutions.",
      "Design, implement, and evaluate software that meets user needs, including accessibility.",
      "Communicate effectively with technical and nontechnical audiences.",
      "Recognize professional and ethical responsibilities in computing practice.",
      "Function effectively as a member of a software development team.",
    ],
    sampleCourses: ["CS 111 Introduction to Programming", "CS 211 Data Structures", "CS 311 Algorithms", "CS 346 Operating Systems", "CS 358 Human-Computer Interaction and Accessibility", "CS 458 Software Engineering Capstone"],
    careers: ["Software engineer", "Web and mobile developer", "Data engineer", "Security analyst", "UX engineer", "Graduate study in computer science"],
    totalUnits: 121,
  },
  "ms-computer-science": {
    overview:
      "The M.S. in Computer Science is a 30-unit program with thesis and project options. Students specialize in machine learning, systems, or human-centered computing and work closely with faculty on research. Most students complete the degree in two years; accelerated B.S./M.S. students finish in one.",
    requirements: [{ label: "Core courses", units: 12 }, { label: "Specialization electives", units: 12 }, { label: "Thesis or project", units: 6 }],
    outcomes: [
      "Demonstrate advanced knowledge in a computing specialization.",
      "Conduct independent research or a substantial software project.",
      "Critically evaluate current computing literature.",
      "Present technical work in writing and orally at a professional level.",
    ],
    sampleCourses: ["CS 511 Advanced Algorithms", "CS 530 Machine Learning", "CS 546 Distributed Systems", "CS 558 Accessible and Inclusive Design", "CS 599 Thesis"],
    careers: ["Senior software engineer", "Machine learning engineer", "Research scientist", "Community college instructor", "Ph.D. study"],
    totalUnits: 30,
  },
  "bs-mathematics": {
    overview:
      "The B.S. in Mathematics develops rigorous reasoning and problem-solving skills. Choose a concentration in pure mathematics, applied mathematics, statistics, or mathematics education. Small upper-division classes and undergraduate research opportunities prepare students for graduate school, teaching, and careers in data and finance.",
    requirements: [ge(), { label: "Calculus and linear algebra", units: 16 }, { label: "Upper-division core", units: 18 }, { label: "Concentration", units: 18 }, { label: "Programming requirement", units: 3 }, { label: "Free electives", units: 17 }],
    outcomes: [
      "Construct and communicate rigorous mathematical proofs.",
      "Model real-world problems using mathematical and statistical methods.",
      "Use computational tools to explore and solve mathematical problems.",
      "Read and present mathematical literature.",
    ],
    sampleCourses: ["MATH 109 Calculus I", "MATH 241 Linear Algebra", "MATH 310 Introduction to Proof", "MATH 351 Real Analysis", "MATH 381 Mathematical Modeling", "STAT 333 Applied Regression"],
    careers: ["Secondary mathematics teacher", "Actuary", "Data analyst", "Statistician", "Operations research analyst", "Graduate study"],
    totalUnits: 120,
  },
  "bs-biology": {
    overview:
      "The B.S. in Biology combines a broad foundation in the life sciences with a concentration in cellular and molecular biology, ecology, marine biology, botany, or zoology. Field courses take students into the redwood forest, the Mad Fork River, and the tide pools at Trinidad Point.",
    requirements: [ge(), { label: "Biology core", units: 20 }, { label: "Chemistry, physics, and math support", units: 22 }, { label: "Concentration", units: 21 }, { label: "Free electives", units: 9 }],
    outcomes: [
      "Explain the core concepts of evolution, structure and function, and ecology.",
      "Design experiments, collect data, and analyze results using statistics.",
      "Conduct field and laboratory research safely and ethically.",
      "Communicate scientific findings in writing and orally.",
    ],
    sampleCourses: ["BIOL 105 Principles of Biology", "BIOL 240 Genetics", "BIOL 330 Ecology", "BIOL 340 Marine Invertebrate Zoology", "BIOL 365 Redwood Forest Ecology", "BIOL 480 Senior Research"],
    careers: ["Wildlife or fisheries biologist", "Laboratory technician", "Environmental consultant", "Physician or other health professional", "Science teacher"],
    totalUnits: 120,
  },
  "bs-chemistry": {
    overview:
      "The B.S. in Chemistry offers a rigorous, laboratory-intensive education, with an ACS-certified track and a biochemistry concentration. Students gain hands-on experience with modern instrumentation and can join research groups working on green chemistry and environmental analysis.",
    requirements: [ge(), { label: "General and organic chemistry", units: 20 }, { label: "Physics and calculus", units: 16 }, { label: "Upper-division chemistry core", units: 20 }, { label: "Advanced electives and research", units: 12 }, { label: "Free electives", units: 4 }],
    outcomes: [
      "Apply principles of analytical, inorganic, organic, physical, and biochemistry.",
      "Operate modern chemical instrumentation and interpret data.",
      "Practice laboratory safety and chemical hygiene.",
      "Communicate chemical research to scientific audiences.",
    ],
    sampleCourses: ["CHEM 109 General Chemistry I", "CHEM 324 Organic Chemistry I", "CHEM 361 Physical Chemistry", "CHEM 341 Instrumental Analysis", "CHEM 438 Biochemistry", "CHEM 485 Green Chemistry"],
    careers: ["Chemist", "Environmental analyst", "Pharmaceutical researcher", "Quality control specialist", "Graduate or medical school"],
    totalUnits: 120,
  },
  "ba-english": {
    overview:
      "The B.A. in English cultivates close reading, clear writing, and an understanding of how stories shape culture. Concentrate in literature, creative writing, or English education, and graduate with a portfolio of polished writing.",
    requirements: [ge(), { label: "Lower-division core", units: 9 }, { label: "Upper-division core", units: 15 }, { label: "Concentration", units: 15 }, { label: "Language other than English", units: 6 }, { label: "Free electives", units: 27 }],
    outcomes: [
      "Interpret literary and cultural texts from diverse traditions.",
      "Write clear, persuasive, and well-researched prose.",
      "Apply critical and theoretical approaches to texts.",
      "Revise and edit writing for a range of audiences.",
    ],
    sampleCourses: ["ENGL 105 Introduction to Literary Study", "ENGL 220 Creative Writing", "ENGL 334 Shakespeare", "ENGL 345 Literature of the American West", "ENGL 363 Native American Literatures", "ENGL 490 Senior Seminar"],
    careers: ["Teacher", "Editor or publisher", "Technical writer", "Communications specialist", "Law school", "Nonprofit program manager"],
    totalUnits: 120,
  },
  "ba-history": {
    overview:
      "The B.A. in History teaches students to ask good questions about the past and to answer them with evidence. Concentrate in U.S., world, or public history, and work with primary sources in the Arcadia Falls Local History Archives.",
    requirements: [ge(), { label: "Lower-division surveys", units: 12 }, { label: "Historical methods", units: 3 }, { label: "Upper-division electives", units: 21 }, { label: "Senior seminar", units: 3 }, { label: "Free electives", units: 33 }],
    outcomes: [
      "Analyze primary and secondary sources critically.",
      "Construct evidence-based historical arguments.",
      "Explain the diversity of human experience across time and place.",
      "Conduct original research and present it in writing.",
    ],
    sampleCourses: ["HIST 110 United States History to 1877", "HIST 210 Historical Methods", "HIST 336 California Indian History", "HIST 352 Environmental History of the American West", "HIST 380 Introduction to Public History", "HIST 490 Senior Seminar"],
    careers: ["Teacher", "Archivist or museum professional", "Park ranger or interpreter", "Policy analyst", "Law school"],
    totalUnits: 120,
  },
  "ba-psychology": {
    overview:
      "The B.A. in Psychology introduces students to the scientific study of behavior and mental processes. Students complete a research methods and statistics sequence and can join faculty labs or earn credit through field placements with community agencies.",
    requirements: [ge(), { label: "Foundations", units: 9 }, { label: "Research methods and statistics", units: 8 }, { label: "Content areas", units: 15 }, { label: "Upper-division electives", units: 9 }, { label: "Free electives", units: 31 }],
    outcomes: [
      "Describe major concepts and findings across the subfields of psychology.",
      "Design and interpret psychological research.",
      "Apply psychological principles to personal, social, and organizational issues.",
      "Demonstrate ethical reasoning in research and practice.",
    ],
    sampleCourses: ["PSYC 104 Introduction to Psychology", "PSYC 241 Statistics for Psychology", "PSYC 311 Developmental Psychology", "PSYC 320 Cognitive Psychology", "PSYC 356 Sleep and Health", "PSYC 480 Field Placement"],
    careers: ["Case manager", "Behavioral technician", "Human resources specialist", "Research assistant", "Graduate study in counseling, social work, or psychology"],
    totalUnits: 120,
  },
  "bsn-nursing": {
    overview:
      "The pre-licensure B.S.N. prepares students to take the NCLEX-RN and practice as registered nurses. After completing prerequisites, students are admitted to a six-semester nursing sequence combining classroom, simulation, and clinical learning, with an emphasis on rural and community health.",
    requirements: [ge(39), { label: "Science prerequisites", units: 20 }, { label: "Nursing theory", units: 30 }, { label: "Clinical practicum", units: 27 }, { label: "Statistics and elective", units: 4 }],
    outcomes: [
      "Provide safe, evidence-based, patient-centered nursing care.",
      "Collaborate effectively in interprofessional health care teams.",
      "Promote health equity in rural and underserved communities.",
      "Demonstrate professional values, leadership, and clinical judgment.",
    ],
    sampleCourses: ["NURS 210 Foundations of Nursing Practice", "NURS 315 Adult Health Nursing", "NURS 330 Maternal and Newborn Nursing", "NURS 345 Psychiatric and Mental Health Nursing", "NURS 420 Community and Public Health Nursing", "NURS 480 Clinical Capstone"],
    careers: ["Registered nurse", "Public health nurse", "Emergency or critical care nurse", "School nurse", "Graduate study for nurse practitioner"],
    totalUnits: 120,
  },
  "bs-mechanical-engineering": {
    overview:
      "The B.S. in Mechanical Engineering prepares students to design and analyze mechanical and thermal systems. The program emphasizes hands-on design, from first-year projects in the Machine Shop to a senior capstone, with electives in renewable energy, robotics, and manufacturing.",
    requirements: [ge(39), { label: "Mathematics and science", units: 30 }, { label: "Engineering fundamentals", units: 18 }, { label: "Mechanical engineering core", units: 24 }, { label: "Technical electives", units: 9 }, { label: "Senior design", units: 6 }],
    outcomes: [
      "Apply engineering, science, and mathematics to solve complex problems.",
      "Design systems that meet specified needs with consideration of public health, safety, and the environment.",
      "Conduct experiments and interpret data.",
      "Work effectively on multidisciplinary teams.",
      "Recognize ethical and professional responsibilities.",
    ],
    sampleCourses: ["ENGR 115 Introduction to Engineering Design", "ME 220 Statics", "ME 331 Thermodynamics", "ME 345 Fluid Mechanics", "ME 410 Renewable Energy Systems", "ME 490 Senior Design"],
    careers: ["Mechanical engineer", "Energy systems engineer", "Manufacturing engineer", "Robotics engineer", "Project engineer"],
    totalUnits: 126,
  },
  "bba-business-administration": {
    overview:
      "The B.B.A. provides a broad business foundation and a concentration in accounting, finance, management, marketing, analytics, sustainable business, or hospitality and tourism. Students work on consulting projects with regional businesses and can manage real money in the Redwood Investment Fund.",
    requirements: [ge(), { label: "Lower-division business core", units: 21 }, { label: "Upper-division business core", units: 24 }, { label: "Concentration", units: 15 }, { label: "Free electives", units: 12 }],
    outcomes: [
      "Apply core business knowledge to organizational problems.",
      "Use quantitative analysis to support business decisions.",
      "Communicate professionally in writing and presentations.",
      "Evaluate the ethical and environmental impacts of business decisions.",
    ],
    sampleCourses: ["BUS 110 Introduction to Business", "ACCT 201 Financial Accounting", "BUS 340 Organizational Behavior", "BUS 350 Marketing Principles", "BUS 370 Business Analytics", "BUS 497 Strategic Management"],
    careers: ["Accountant", "Financial analyst", "Marketing coordinator", "Operations manager", "Entrepreneur"],
    totalUnits: 120,
  },
  mba: {
    overview:
      "The M.B.A. is a 36-unit hybrid program for working professionals, combining online coursework with monthly weekend residencies on campus. Students can complete the degree in 20 months and may add an emphasis in sustainable enterprise or health care management.",
    requirements: [{ label: "Core courses", units: 24 }, { label: "Emphasis electives", units: 9 }, { label: "Strategic consulting capstone", units: 3 }],
    outcomes: [
      "Integrate functional business knowledge to lead organizations.",
      "Make data-informed strategic decisions.",
      "Lead teams ethically and inclusively.",
      "Develop sustainable strategies that create long-term value.",
    ],
    sampleCourses: ["MBA 610 Managerial Accounting", "MBA 620 Corporate Finance", "MBA 630 Leading Organizations", "MBA 645 Data-Driven Decision Making", "MBA 660 Sustainable Enterprise", "MBA 690 Strategic Consulting Capstone"],
    careers: ["General manager", "Health care administrator", "Nonprofit executive director", "Financial manager", "Management consultant"],
    totalUnits: 36,
  },
};
