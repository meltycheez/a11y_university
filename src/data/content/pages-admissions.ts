// Admissions and financial aid copy. Merged into `pageContent` in ./pages.
import type { PageContent } from "./pages";

const faq: [string, string][] = [
  ["When is the application deadline for fall 2027?", "The priority filing period for fall 2027 first-year and transfer applicants runs October 1 through December 1, 2026. Applications received after December 1 are considered on a space-available basis."],
  ["How much does it cost to apply?", "The application fee is $70 per application. Fee waivers are available for eligible low-income California residents and are requested directly in the online application."],
  ["Does Redwood State require standardized test scores?", "No. RSU does not require or consider standardized test scores for admission. If you submit scores, they may be used for placement in English and math courses."],
  ["What GPA do I need to be admitted?", "First-year applicants need at least a 2.50 GPA in the A–G college preparatory courses completed in grades 10 and 11. The middle 50% of admitted students in fall 2026 had GPAs between 3.18 and 3.82."],
  ["What are the A–G course requirements?", "You must complete 15 year-long college preparatory courses with a grade of C or better: history (2 years), English (4), mathematics (3), laboratory science (2), a language other than English (2), visual and performing arts (1), and a college preparatory elective (1)."],
  ["Is Redwood State impacted?", "Nursing and Computer Science are impacted programs with higher admission criteria. All other majors admit every eligible applicant from the local service area and most eligible applicants from outside it."],
  ["What is the local service area?", "Fernhaven County and the three neighboring north coast counties. Applicants from high schools and community colleges in these counties receive local admission priority."],
  ["Can I apply undeclared?", "Yes. About 12% of first-year students start as Exploring Majors. Advisors in the Exploring Majors program help you choose a major by the end of your second year."],
  ["When will I receive an admission decision?", "Most first-year applicants who apply by December 1 receive a decision by March 15. Transfer decisions are released on a rolling basis beginning in February."],
  ["How do I accept my offer of admission?", "Log in to RedwoodConnect, select Accept Offer, and pay the $250 enrollment deposit by May 1 (first-year) or June 1 (transfer). The deposit is credited toward your first-semester fees."],
  ["Can I defer my admission?", "Admitted first-year students may request a one-year deferral for military service, a religious mission, a serious medical condition, or a documented gap-year program. Submit the request before May 1."],
  ["Do I need to live on campus?", "First-year students who live outside a 30-mile radius of campus are expected to live on campus for their first year. Exemptions are available for students who are married, over 21, veterans, or living with a parent or guardian."],
  ["Is housing guaranteed?", "Housing is guaranteed for first-year students who submit the housing application and deposit by May 1. Madrone Hall, which opened in 2026, added 400 beds, and the university now also guarantees housing to returning second-year students."],
  ["How do I transfer my community college credits?", "Courses from California community colleges are evaluated using statewide articulation agreements. Out-of-state transcripts are evaluated course by course after admission. You can see how your courses were applied in your Degree Progress report in RedwoodConnect."],
  ["Do you offer the Associate Degree for Transfer (ADT) pathway?", "Yes. Students who complete an ADT in a similar major are guaranteed admission with junior standing and can finish in 60 additional units."],
  ["What English proficiency scores do international students need?", "Undergraduates need the minimum score on an approved English proficiency test; the Center for International Programs publishes the list of accepted tests and scores. Graduate programs may require higher scores."],
  ["Can I visit campus?", "Yes. Student-led walking tours run Monday through Friday at 10 a.m. and 2 p.m. and select Saturdays during the academic year. Reserve a spot on the Visit Campus page."],
  ["Are there scholarships for first-year students?", "Every admitted student is automatically considered for the Redwood Merit Award and the Canopy Scholarship. Complete the RSU General Scholarship Application by March 2 to be considered for more than 300 additional awards."],
  ["When should I file the FAFSA or California Dream Act Application?", "File as early as possible after October 1. The priority deadline for Cal Grant and RSU institutional aid is March 2, 2027. Use RSU's federal school code, RSU000."],
  ["How much does it cost to attend?", "For 2026–27, the estimated annual cost of attendance for a California resident living on campus is $30,856, including tuition, fees, housing, food, books, and personal expenses. About 71% of undergraduates receive financial aid."],
  ["Can I work on campus?", "Yes. More than 2,500 students work on campus each year in the library, dining halls, recreation center, and academic offices. Federal Work-Study students have priority for many positions."],
  ["Does RSU accept credit by exam?", "Yes. Qualifying scores on most college-level exams taken in high school earn college credit, and so do dual-enrollment courses. See the General Catalog for the full credit table."],
  ["Can I change my major after I am admitted?", "Most students can change majors at any time by submitting a Change of Major form. Impacted majors, such as Nursing and Computer Science, require an application and have limited space."],
  ["Is there an honors program?", "Yes. The Sequoia Honors College admits about 150 first-year students each year and offers small seminars, priority registration, and honors housing in Madrone Hall. Apply through the admission application."],
  ["Who can I talk to about my application?", "Your regional admissions counselor. Call (707) 555-0120, email admissions@redwoodstate.edu, or visit Founders Hall 110 Monday through Friday, 8 a.m. to 5 p.m."],
];

export const admissionsPages: Record<string, PageContent> = {
  "/admissions": {
    summary: "Find your place among the redwoods.",
    updated: "Updated September 2026",
    sections: [
      {
        paragraphs: [
          "At Redwood State, your classroom might be a tide pool, a 300-foot redwood, or a robotics lab. Our students come from every corner of California and 40 countries to learn in small classes from faculty who know their names. Applications for fall 2027 open October 1.",
        ],
        links: [
          { label: "Apply now", href: "/admissions/apply" },
          { label: "Request information", href: "/admissions/request-info" },
          { label: "Visit campus", href: "/admissions/visit" },
        ],
      },
      {
        heading: "Choose your path",
        links: [
          { label: "First-year students", href: "/admissions/undergraduate" },
          { label: "Transfer students", href: "/admissions/transfer" },
          { label: "Graduate students", href: "/admissions/graduate" },
          { label: "International students", href: "/admissions/international" },
        ],
      },
      {
        heading: "By the numbers",
        list: [
          "19:1 student-to-faculty ratio",
          "64 undergraduate majors",
          "71% of undergraduates receive financial aid",
          "1,200-acre research forest",
          "92% of graduates employed or in graduate school within a year",
        ],
      },
      {
        heading: "Affordable by design",
        paragraphs: [
          "California residents pay $8,876 a year in tuition and campus fees, and many pay nothing thanks to Cal Grants, Pell Grants, and the Redwood Promise, which covers tuition for families earning under $80,000.",
        ],
        links: [
          { label: "Tuition & Fees", href: "/admissions/tuition" },
          { label: "Scholarships", href: "/admissions/scholarships" },
          { label: "Financial Aid", href: "/financial-aid" },
        ],
      },
    ],
  },

  "/admissions/undergraduate": {
    summary: "Start your degree at Redwood State as a first-year student.",
    sections: [
      {
        paragraphs: [
          "First-year students at RSU join a Canopy Community, a small group of 25 students who take two courses together in their first semester and live on the same floor of a residence hall. It is one of the reasons 80% of our first-year students return for their second year.",
        ],
      },
      {
        heading: "Fall 2027 key dates",
        table: {
          columns: ["Date", "Milestone"],
          rows: [
            ["October 1, 2026", "Application opens; FAFSA and CADAA open"],
            ["December 1, 2026", "Priority application deadline"],
            ["March 2, 2027", "Cal Grant and RSU scholarship deadline"],
            ["March 15, 2027", "Most admission decisions released"],
            ["April 17, 2027", "Owl Day admitted student celebration"],
            ["May 1, 2027", "Enrollment and housing deposit deadline"],
            ["June–July 2027", "Orientation sessions"],
          ],
        },
      },
      {
        links: [
          { label: "First-Year Requirements", href: "/admissions/freshman-requirements" },
          { label: "How to Apply", href: "/admissions/process" },
          { label: "Degree Programs", href: "/academics/programs" },
          { label: "Housing", href: "/students/housing" },
        ],
      },
    ],
  },

  "/admissions/freshman-requirements": {
    summary: "What you need to be admitted to Redwood State as a first-year student.",
    updated: "Updated for Fall 2027 admission",
    sections: [
      {
        heading: "Minimum eligibility",
        list: [
          "Graduate from high school or earn a high school equivalency certificate.",
          "Complete the 15 A–G courses with a grade of C or better.",
          "Earn a GPA of 2.50 or higher in A–G courses taken in grades 10 and 11 (California residents). Nonresidents need a 3.00.",
        ],
      },
      {
        heading: "A–G subject requirements",
        table: {
          caption: "College preparatory subject requirements",
          columns: ["Subject", "Area", "Years required", "Notes"],
          rows: [
            ["History / Social Science", "A", "2", "Including one year of U.S. history"],
            ["English", "B", "4", "College preparatory composition and literature"],
            ["Mathematics", "C", "3", "Algebra, geometry, and intermediate algebra; 4 recommended"],
            ["Laboratory Science", "D", "2", "One biological and one physical science"],
            ["Language Other Than English", "E", "2", "Same language; American Sign Language accepted"],
            ["Visual & Performing Arts", "F", "1", "Dance, drama, music, or visual art"],
            ["College Preparatory Elective", "G", "1", "An additional course from areas A–F"],
            ["Quantitative Reasoning (beginning Fall 2027)", "C/D/G", "1 additional", "Recommended; required for Fall 2029 applicants"],
          ],
        },
      },
      {
        heading: "Impacted majors",
        paragraphs: [
          "Nursing (B.S.N.) and Computer Science (B.S.) receive more eligible applicants than they can accommodate. Admission to these majors uses a higher GPA threshold and considers completion of chemistry (Nursing) or four years of math (Computer Science).",
        ],
        links: [{ label: "Click here for program details", href: "/academics/programs" }],
      },
    ],
  },

  "/admissions/process": {
    summary: "Five steps from application to your first day at Redwood State.",
    sections: [
      { heading: "Step 1: Explore programs", paragraphs: ["Browse our majors and choose a first-choice and alternate major. You can also apply as an Exploring Major."], links: [{ label: "Degree Programs", href: "/academics/programs" }] },
      { heading: "Step 2: Apply", paragraphs: ["Complete the online Application for Admission between October 1 and December 1. You will self-report your high school or college coursework; transcripts are not required until you are admitted."], links: [{ label: "Application for Admission", href: "/admissions/apply" }] },
      { heading: "Step 3: Apply for financial aid", paragraphs: ["Submit the FAFSA or the California Dream Act Application by March 2 using RSU school code RSU000, and complete the RSU General Scholarship Application."], links: [{ label: "Financial Aid", href: "/financial-aid" }] },
      { heading: "Step 4: Check RedwoodConnect", paragraphs: ["After you apply, you will receive a RedwoodConnect login. Check your To-Do List for missing documents and your admission decision."], links: [{ label: "RedwoodConnect", href: "/portal" }] },
      { heading: "Step 5: Accept your offer", paragraphs: ["Accept your offer and pay the enrollment deposit by May 1, then apply for housing and sign up for orientation."] },
    ],
  },

  "/admissions/apply": {
    summary: "Apply for admission to Redwood State University for Fall 2027.",
    sections: [
      {
        paragraphs: [
          "The application takes about 45 minutes. You can save your progress and return later. Have your high school or college coursework, grades, and a list of activities ready before you begin.",
          "Need help? Call the Office of Admissions at (707) 555-0120.",
        ],
        links: [{ label: "Admissions FAQ", href: "/admissions/faq" }],
      },
    ],
  },

  "/admissions/graduate": {
    summary: "Master's degrees, credentials, and certificates at Redwood State.",
    updated: "Updated Fall 2024",
    sections: [
      {
        paragraphs: [
          "The Division of Graduate Studies offers 29 graduate programs, including the M.S. in Computer Science, the M.B.A., the M.S. in Natural Resources, the M.A. in English, and teaching credentials. Most programs admit for fall only; see individual program pages for deadlines.",
        ],
      },
      {
        heading: "General requirements",
        list: [
          "A bachelor's degree from a regionally accredited institution.",
          "A GPA of 3.00 or higher in the last 60 semester units attempted.",
          "Good standing at the last institution attended.",
          "Program-specific materials: statement of purpose, letters of recommendation, writing sample or portfolio.",
          "Graduate admission test scores are not required by most programs.",
        ],
      },
      {
        heading: "Deadlines",
        table: {
          columns: ["Program", "Priority deadline", "Final deadline"],
          rows: [
            ["M.S. Computer Science", "January 15", "April 1"],
            ["M.B.A.", "February 1", "June 1 (rolling)"],
            ["M.S. Natural Resources", "January 15", "March 1"],
            ["M.A. English", "February 15", "April 15"],
            ["Multiple Subject Credential", "March 1", "May 1"],
          ],
        },
        links: [
          { label: "M.S. Computer Science", href: "/academics/programs/ms-computer-science" },
          { label: "M.B.A.", href: "/academics/programs/mba" },
          { label: "Graduate Studies Handbook (PDF)", href: "/documents/catalog-addendum-2025-26.pdf" },
        ],
      },
    ],
  },

  "/admissions/international": {
    summary: "Study among the redwoods: admission for international students.",
    sections: [
      {
        paragraphs: [
          "Redwood State welcomes about 420 international students from more than 40 countries. The Center for International Programs supports you from your I-20 application through Optional Practical Training after graduation.",
        ],
      },
      {
        heading: "What you will need",
        list: [
          "Completed application and $70 fee.",
          "Official academic records, translated into English and evaluated by a recognized credential evaluation service if from outside the U.S.",
          "Proof of English proficiency: the undergraduate minimum score on an approved English proficiency test.",
          "Financial documentation showing $44,900 available for one year of study and living expenses.",
          "A copy of your passport.",
        ],
      },
      {
        heading: "Deadlines",
        table: {
          columns: ["Term", "Application deadline", "Document deadline"],
          rows: [
            ["Fall 2027", "March 1, 2027", "May 1, 2027"],
            ["Spring 2028", "September 1, 2027", "October 15, 2027"],
          ],
        },
        links: [{ label: "Tuition for nonresidents", href: "/admissions/tuition" }],
      },
    ],
  },

  "/admissions/transfer": {
    summary: "Finish your bachelor's degree at Redwood State.",
    sections: [
      {
        paragraphs: [
          "About one in three RSU students started at another college. We admit transfer students in fall and spring, and our Transfer Success Center helps you plan a path to graduation in two years.",
        ],
      },
      {
        heading: "Upper-division transfer requirements",
        list: [
          "Complete at least 60 transferable semester units (90 quarter units).",
          "Earn a 2.00 GPA or higher in transferable coursework (2.40 for nonresidents).",
          "Complete the Golden Four general education courses with a C- or better: oral communication, written communication, critical thinking, and quantitative reasoning.",
          "Be in good standing at your last college.",
        ],
      },
      {
        heading: "Associate Degree for Transfer",
        paragraphs: [
          "If you earn an ADT from a California community college in a similar major, you are guaranteed admission with priority consideration and can complete your degree in 60 additional units.",
        ],
        links: [
          { label: "How to Apply", href: "/admissions/process" },
          { label: "Academic Advising", href: "/students/advising" },
        ],
      },
    ],
  },

  "/admissions/tuition": {
    summary: "2026–27 tuition, campus fees, and estimated cost of attendance.",
    updated: "2026–27 rates approved by the Board of Trustees, June 2026",
    sections: [
      {
        paragraphs: [
          "Redwood State is one of the most affordable public universities in the West. The rates below are for full-time students (more than 6 units per semester) for the 2026–27 academic year. Fees are subject to change without notice by the Board of Trustees.",
        ],
      },
      {
        heading: "Undergraduate tuition and fees",
        table: {
          caption: "2026–27 undergraduate tuition and mandatory campus fees, full-time",
          columns: ["Fee", "Resident, per semester", "Resident, per year", "Nonresident, per year"],
          rows: [
            ["State tuition", "$3,042", "$6,084", "$6,084"],
            ["Nonresident tuition ($396 per unit, 30 units)", "—", "—", "$11,880"],
            ["Student Success Fee", "$513", "$1,026", "$1,026"],
            ["Health Services Fee", "$206", "$412", "$412"],
            ["Health Facilities Fee", "$11", "$22", "$22"],
            ["Associated Students Fee", "$102", "$204", "$204"],
            ["Rowan Student Union Fee", "$249", "$498", "$498"],
            ["Recreation Center Fee", "$178", "$356", "$356"],
            ["Instructionally Related Activities Fee", "$95", "$190", "$190"],
            ["Technology Fee", "$42", "$84", "$84"],
            ["Total tuition and fees", "$4,438", "$8,876", "$20,756"],
          ],
        },
      },
      {
        heading: "Graduate tuition and fees",
        table: {
          caption: "2026–27 graduate tuition, full-time",
          columns: ["Fee", "Resident, per year", "Nonresident, per year"],
          rows: [
            ["State tuition", "$7,176", "$7,176"],
            ["Nonresident tuition ($396 per unit, 24 units)", "—", "$9,504"],
            ["Mandatory campus fees", "$2,792", "$2,792"],
            ["M.B.A. professional program fee", "$3,600", "$3,600"],
            ["Total (M.S. and M.A. programs)", "$9,968", "$19,472"],
            ["Total (M.B.A.)", "$13,568", "$23,072"],
          ],
        },
      },
      {
        heading: "Estimated cost of attendance",
        table: {
          caption: "2026–27 estimated undergraduate cost of attendance",
          columns: ["Expense", "Resident, on campus", "Resident, off campus", "Resident, with family", "Nonresident, on campus"],
          rows: [
            ["Tuition and fees", "$8,876", "$8,876", "$8,876", "$20,756"],
            ["Housing and food", "$17,420", "$15,960", "$6,210", "$17,420"],
            ["Books and supplies", "$1,030", "$1,030", "$1,030", "$1,030"],
            ["Transportation", "$1,150", "$1,640", "$1,820", "$1,150"],
            ["Personal and miscellaneous", "$2,380", "$2,380", "$2,110", "$2,380"],
            ["Total", "$30,856", "$29,886", "$20,046", "$42,736"],
          ],
        },
      },
      {
        heading: "Payment and deadlines",
        paragraphs: [
          "Fall 2026 fees were due August 14, 2026. Spring 2027 fees are due January 8, 2027. Students may enroll in the RSU Payment Plan to spread each semester's charges over four installments for a $35 enrollment fee.",
        ],
        links: [
          { label: "2026–27 Tuition Schedule (PDF)", href: "/documents/tuition-schedule-2025-26.pdf" },
          { label: "2025–26 Tuition Schedule (PDF)", href: "/documents/tuition-schedule-2025-26.pdf" },
          { label: "Student Account in RedwoodConnect", href: "/portal/account" },
          { label: "Financial Aid", href: "/financial-aid" },
        ],
      },
    ],
  },

  "/admissions/scholarships": {
    summary: "More than $9 million in scholarships awarded to Redwood State students each year.",
    updated: "2027–28 application opens October 1, 2026",
    sections: [
      {
        paragraphs: [
          "Complete one application, the RSU General Scholarship Application, and you will be matched with every scholarship you qualify for. The application for 2027–28 awards opens October 1 and closes March 2, 2027.",
        ],
      },
      {
        heading: "Featured scholarships",
        table: {
          caption: "Selected Redwood State scholarships",
          columns: ["Scholarship", "Amount", "Eligibility", "Deadline"],
          rows: [
            ["Redwood Merit Award", "$2,000–$5,000 per year, renewable", "Admitted first-year students with a 3.50+ GPA; automatic consideration", "December 1"],
            ["Canopy Scholarship", "$1,500 per year, renewable", "Admitted students from Fernhaven County or the neighboring north coast counties", "December 1"],
            ["Redwood Promise", "Full tuition", "California residents with family income under $80,000", "March 2 (FAFSA/CADAA)"],
            ["First-Generation Scholars Award", "$3,000 per year", "First-generation students enrolled in the First-Gen Scholars program", "March 2"],
            ["Kellerman Forestry Scholarship", "$4,000", "Natural resources or biology majors with junior standing", "March 2"],
            ["Clara B. Whitcomb Teaching Scholarship", "$2,500", "Students in a teaching credential program", "March 2"],
            ["Owl Transfer Award", "$2,000", "New transfer students with a 3.30+ GPA", "March 2"],
            ["Silverfin Tribal Scholars Award", "$5,000", "Enrolled members or descendants of a California tribe", "March 2"],
            ["Sequoia Engineering Scholarship", "$3,500", "Engineering and computer science majors", "March 2"],
            ["Huckleberry Nursing Scholarship", "$2,500", "Students admitted to the B.S.N. program", "March 2"],
            ["Graduate Equity Fellowship", "$6,000", "Graduate students from underrepresented groups", "February 1"],
          ],
        },
      },
      {
        heading: "Outside scholarships",
        paragraphs: [
          "If you receive a scholarship from an outside organization, report it to the Financial Aid Office. Checks should be made payable to Redwood State University and mailed to Student Accounts, Founders Hall 140.",
        ],
        links: [
          { label: "Endowed Scholarships (for donors)", href: "/giving/scholarships" },
          { label: "Read more", href: "/financial-aid/types" },
        ],
      },
    ],
  },

  "/admissions/request-info": {
    summary: "Tell us about yourself and we will send information about Redwood State.",
    sections: [
      {
        paragraphs: [
          "Complete the form to receive information about academic programs, campus life, and upcoming events in your area. Your regional admissions counselor will follow up by email.",
        ],
        links: [{ label: "Privacy Statement", href: "/policies/privacy" }],
      },
    ],
  },

  "/admissions/visit": {
    summary: "See the redwoods for yourself. Tour campus with a current student.",
    sections: [
      {
        paragraphs: [
          "Campus tours last about 90 minutes and cover academic buildings, a residence hall, Sequoia Library, and Rowan Student Union. Tours depart from the Welcome Center in Founders Hall 110. Wear comfortable shoes and bring a rain jacket: it is the north coast.",
        ],
      },
      {
        heading: "Tour schedule",
        table: {
          columns: ["Tour", "Days", "Times"],
          rows: [
            ["Campus walking tour", "Monday–Friday", "10:00 a.m. and 2:00 p.m."],
            ["Saturday tour", "Select Saturdays, September–April", "11:00 a.m."],
            ["Madrone Hall residence tour", "Monday, Wednesday, Friday", "3:30 p.m."],
            ["Virtual information session", "Tuesdays", "5:00 p.m."],
          ],
        },
        links: [
          { label: "Fall Admissions Open House", href: "/events/admissions-open-house" },
          { label: "Directions and parking", href: "/visitors" },
          { label: "Campus Map", href: "/campus-map" },
        ],
      },
    ],
  },

  "/admissions/faq": {
    summary: "Answers to the questions we hear most often from applicants and families.",
    updated: "Updated September 2026",
    sections: faq.map(([heading, answer]) => ({ heading, paragraphs: [answer] })),
  },

  "/financial-aid": {
    summary: "Grants, scholarships, loans, and work-study to help pay for your Redwood State education.",
    updated: "Updated for 2027–28 aid year",
    sections: [
      {
        paragraphs: [
          "The Office of Financial Aid & Scholarships helps students and families pay for college. In 2025–26, 71% of RSU undergraduates received aid, and 58% paid no tuition at all after grants.",
        ],
      },
      {
        heading: "How financial aid works",
        list: [
          "File the FAFSA (or the California Dream Act Application) after October 1 using school code RSU000.",
          "Complete the RSU General Scholarship Application by March 2.",
          "Check your RedwoodConnect To-Do List for verification documents.",
          "Review and accept your aid offer in RedwoodConnect. Offers for new students are sent beginning in March.",
          "Aid is disbursed to your student account about 10 days before each semester begins.",
        ],
      },
      {
        heading: "Key deadlines for 2027–28",
        table: {
          columns: ["Date", "Deadline"],
          rows: [
            ["October 1, 2026", "FAFSA and CADAA open"],
            ["March 2, 2027", "Cal Grant, Middle Class Scholarship, and RSU priority deadline"],
            ["June 30, 2027", "Last day to submit verification documents for full-year aid"],
          ],
        },
      },
      {
        heading: "Satisfactory Academic Progress",
        paragraphs: [
          "To keep receiving aid, students must maintain a cumulative GPA of 2.00 (3.00 for graduate students), complete 67% of attempted units, and graduate within 150% of the units required for their degree. SAP is reviewed at the end of each spring semester pursuant to 34 CFR 668.34.",
        ],
      },
      {
        heading: "Contact us",
        list: [
          "Founders Hall 120",
          "Phone: (707) 555-0125",
          "Email: finaid@redwoodstate.edu",
          "Walk-in hours: Monday–Thursday, 9 a.m. to 4 p.m.",
        ],
        links: [
          { label: "Types of Aid", href: "/financial-aid/types" },
          { label: "Scholarships", href: "/admissions/scholarships" },
          { label: "Institutional Aid Application", href: "/financial-aid/legacy-application" },
          { label: "Tuition & Fees", href: "/admissions/tuition" },
        ],
      },
    ],
  },

  "/financial-aid/types": {
    summary: "Grants, loans, and work-study available to Redwood State students.",
    updated: "Award amounts shown for 2026–27",
    sections: [
      {
        heading: "Grants",
        paragraphs: ["Grants are need-based aid that does not have to be repaid."],
        table: {
          caption: "Grant programs, 2026–27",
          columns: ["Grant", "Source", "Annual amount", "Eligibility"],
          rows: [
            ["Federal Pell Grant", "Federal", "Up to $7,395", "Undergraduates with exceptional financial need"],
            ["Federal SEOG", "Federal", "$200–$1,200", "Pell recipients with the greatest need"],
            ["Cal Grant A", "State", "Covers state tuition", "California residents meeting GPA and income limits"],
            ["Cal Grant B", "State", "Tuition plus $1,648 access award", "California residents with low family income"],
            ["Middle Class Scholarship", "State", "Varies", "California residents with family income up to $226,000"],
            ["State University Grant", "Institutional", "Up to state tuition", "California residents and AB 540 students with need"],
            ["Redwood Promise", "Institutional", "Remaining tuition", "Family income under $80,000"],
          ],
        },
      },
      {
        heading: "Loans",
        paragraphs: ["Loans must be repaid with interest. Borrow only what you need."],
        table: {
          caption: "Federal Direct Loan limits and rates",
          columns: ["Loan", "Annual limit", "Interest rate (2026–27)", "Notes"],
          rows: [
            ["Direct Subsidized (undergraduate)", "$3,500–$5,500 by class level", "6.39%", "No interest while enrolled at least half time"],
            ["Direct Unsubsidized (undergraduate)", "$2,000 additional", "6.39%", "Interest accrues from disbursement"],
            ["Direct Unsubsidized (graduate)", "$20,500", "7.94%", ""],
            ["Parent PLUS", "Cost of attendance minus other aid", "8.94%", "Credit check required"],
          ],
        },
      },
      {
        heading: "Work-study",
        paragraphs: [
          "Federal Work-Study provides part-time jobs on campus and with community partners. Students earn at least $17.25 an hour and are paid biweekly. Positions are posted on OwlLink Careers through the Career Center.",
        ],
        links: [
          { label: "Career Center", href: "/students/careers" },
          { label: "Click here", href: "/financial-aid" },
        ],
      },
    ],
  },

  "/financial-aid/legacy-application": {
    summary: "Application for institutional grants and emergency aid.",
    updated: "Form revised 08/2017",
    sections: [
      {
        paragraphs: [
          "Use this form to apply for State University Grant (SUG), Educational Opportunity Program (EOP) grants, and the RSU Emergency Aid Fund. You must also have a current FAFSA or CADAA on file. Incomplete applications will not be processed. Allow 4–6 weeks for processing.",
          "NOTE: This form replaces form FA-12B. Students who submitted FA-12B prior to 7/1/2017 must resubmit.",
        ],
        links: [{ label: "Financial Aid home", href: "/financial-aid" }],
      },
    ],
  },
};
