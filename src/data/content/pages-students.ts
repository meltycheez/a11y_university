// Student services and library copy. Merged into `pageContent` in ./pages.
import type { PageContent } from "./pages";

export const studentPages: Record<string, PageContent> = {
  "/students": {
    summary: "Services, offices, and resources for current Redwood State students.",
    sections: [
      {
        heading: "Academics",
        links: [
          { label: "Office of the Registrar", href: "/students/registrar" },
          { label: "Academic Advising", href: "/students/advising" },
          { label: "Academic Calendar", href: "/academics/calendar" },
          { label: "Course Search", href: "/academics/courses" },
          { label: "Sequoia Library", href: "/library" },
        ],
      },
      {
        heading: "Health and wellness",
        links: [
          { label: "Student Health Center", href: "/students/health" },
          { label: "Counseling & Psychological Services", href: "/students/counseling" },
          { label: "Campus Recreation", href: "/students/recreation" },
        ],
      },
      {
        heading: "Campus life",
        links: [
          { label: "Housing & Residential Life", href: "/students/housing" },
          { label: "Dining Services", href: "/students/dining" },
          { label: "Student Organizations", href: "/students/organizations" },
          { label: "Career Center", href: "/students/careers" },
        ],
      },
      {
        heading: "Getting around",
        links: [
          { label: "Parking Services", href: "/students/parking" },
          { label: "Transportation", href: "/students/transportation" },
          { label: "Campus Safety", href: "/students/safety" },
          { label: "Campus Map", href: "/campus-map" },
        ],
      },
      {
        paragraphs: ["Log in to RedwoodConnect to register for classes, view your bill, and check holds."],
        links: [{ label: "RedwoodConnect", href: "/portal" }],
      },
    ],
  },

  "/students/registrar": {
    summary: "Registration, transcripts, enrollment verification, and graduation.",
    updated: "Updated Spring 2023",
    sections: [
      {
        paragraphs: [
          "The Office of the Registrar maintains student academic records and administers registration, grading, degree certification, and FERPA compliance. Most services are available self-service in RedwoodConnect.",
        ],
      },
      {
        heading: "Services",
        table: {
          columns: ["Service", "How", "Fee"],
          rows: [
            ["Official transcript (electronic)", "Order through RedwoodConnect", "$10"],
            ["Official transcript (paper, mailed)", "Order through RedwoodConnect", "$15"],
            ["Enrollment verification", "Self-service in RedwoodConnect", "Free"],
            ["Change of name or address", "Submit form with ID to Founders Hall 130", "Free"],
            ["Late add (after census)", "Petition signed by instructor and chair", "$25"],
            ["Application for graduation", "RedwoodConnect, two semesters before graduating", "$55"],
            ["Diploma replacement", "Paper form", "$30"],
          ],
        },
      },
      {
        heading: "Fall 2026 registration dates",
        list: [
          "Last day to add classes without a permission number: August 31",
          "Census date (last day to drop without a W): September 18",
          "Last day to withdraw from a class with a W: November 6",
          "Spring 2027 priority registration begins: November 2",
        ],
        links: [
          { label: "Academic Calendar 2026–27 (PDF)", href: "/documents/academic-calendar-2026-27.pdf" },
          { label: "FERPA Notice (PDF)", href: "/documents/ferpa-annual-notice.pdf" },
          { label: "Catalog Addendum 2026 (PDF)", href: "/documents/catalog-addendum-2025-26.pdf" },
        ],
      },
      {
        heading: "Contact",
        list: ["Founders Hall 130", "(707) 555-0130", "registrar@redwoodstate.example.edu", "Counter hours: M–F 9:00–4:00 (closed 12:00–1:00)"],
      },
    ],
  },

  "/students/advising": {
    summary: "Plan your path to graduation with a professional advisor and faculty mentor.",
    sections: [
      {
        paragraphs: [
          "Every RSU undergraduate has a professional advisor in the Academic Advising Center and a faculty mentor in their major. First-year students meet with their advisor at least twice each semester; after that, students must meet at least once a year to clear the advising hold before registration.",
        ],
        list: [
          "Schedule appointments through the Advising tab in RedwoodConnect.",
          "Drop-in advising: Monday–Thursday, 1–4 p.m., Sequoia Library 120.",
          "Exploring Majors advising for undeclared students.",
          "Degree Progress reports show how your courses apply to your degree.",
        ],
        links: [
          { label: "Degree Progress", href: "/portal/degree-progress" },
          { label: "Degree Programs", href: "/academics/programs" },
        ],
      },
    ],
  },

  "/students/careers": {
    summary: "Internships, jobs, and career planning for students and recent graduates.",
    sections: [
      {
        paragraphs: [
          "The Career Center helps students explore careers, find internships, and prepare for life after RSU. Services are free to students and to alumni for two years after graduation.",
        ],
        list: [
          "One-on-one career coaching and resume reviews",
          "OwlLink Careers job and internship postings, including on-campus jobs and Work-Study",
          "Mock interviews and professional headshots",
          "The Owl Closet: free professional clothing for interviews",
          "Fall and spring Career & Internship Fairs in Owl Arena",
        ],
        links: [
          { label: "Fall Career & Internship Fair", href: "/events/career-fair-fall-2026" },
          { label: "Read more", href: "/news" },
        ],
      },
      {
        heading: "Contact",
        list: ["Rowan Student Union 210", "(707) 555-0148", "careers@redwoodstate.example.edu"],
      },
    ],
  },

  "/students/counseling": {
    summary: "Free, confidential mental health support for Redwood State students.",
    sections: [
      {
        paragraphs: [
          "Counseling & Psychological Services (CAPS) offers short-term individual counseling, group counseling, crisis support, and referrals. Services are free and confidential for enrolled students.",
          "If you are in crisis, call or text 988 or call CAPS at (707) 555-0152 any time, day or night, and press 2 to speak with a counselor.",
        ],
      },
      {
        heading: "Services",
        list: [
          "Individual counseling (up to 10 sessions per academic year)",
          "Groups: Anxiety Toolbox, Grief and Loss, First-Gen Connections, LGBTQ+ Support, Graduate Student Balance",
          "Same-day crisis appointments",
          "Drop-In Chats: informal consultations at the Multicultural Center and Madrone Hall",
          "Psychiatric consultation through the Student Health Center",
        ],
      },
      {
        heading: "Hours and location",
        table: {
          columns: ["Day", "Hours"],
          rows: [
            ["Monday–Thursday", "8:00 a.m. – 6:00 p.m."],
            ["Friday", "8:00 a.m. – 5:00 p.m."],
            ["After hours and weekends", "Call (707) 555-0152, press 2"],
          ],
        },
        links: [
          { label: "Student Wellness Week", href: "/events/wellness-week" },
          { label: "Student Health Center", href: "/students/health" },
        ],
      },
    ],
  },

  "/students/health": {
    summary: "Primary care, pharmacy, and wellness services on campus.",
    sections: [
      {
        paragraphs: [
          "The Student Health Center in Huckleberry Hall provides primary care, sexual and reproductive health care, immunizations, laboratory testing, and a pharmacy. Most visits are covered by the Health Services Fee, with no charge at the time of service.",
        ],
      },
      {
        heading: "Hours",
        table: {
          caption: "Student Health Center hours, Fall 2026",
          columns: ["Service", "Monday–Friday", "Saturday", "Sunday"],
          rows: [
            ["Clinic (appointments)", "8:30 a.m. – 5:00 p.m.", "Closed", "Closed"],
            ["Walk-in urgent care", "9:00 a.m. – 4:00 p.m.", "10:00 a.m. – 2:00 p.m.", "Closed"],
            ["Pharmacy", "9:00 a.m. – 5:00 p.m.", "Closed", "Closed"],
            ["Laboratory", "8:30 a.m. – 4:30 p.m.", "Closed", "Closed"],
            ["24/7 nurse advice line", "(707) 555-0151", "(707) 555-0151", "(707) 555-0151"],
          ],
        },
      },
      {
        heading: "Immunization requirements",
        list: [
          "Measles, mumps, and rubella (MMR): two doses",
          "Tuberculosis screening questionnaire for all new students",
          "Meningococcal conjugate vaccine for students living in campus housing",
          "Hepatitis B for students under 18",
        ],
        paragraphs: ["Upload immunization records to the Patient Portal before your first semester. Students with missing records will have a registration hold."],
        links: [{ label: "Holds", href: "/portal/holds" }],
      },
    ],
  },

  "/students/housing": {
    summary: "Live among the redwoods in one of eight residential communities.",
    updated: "2026–27 rates",
    sections: [
      {
        paragraphs: [
          "About 4,050 students live on campus in eight residential communities, including Madrone Hall, which opened in August 2026 with 400 beds, a rooftop garden, and a maker space. Living on campus puts you minutes from class, dining, and the Recreation Center.",
        ],
      },
      {
        heading: "Residence halls",
        table: {
          caption: "Residential communities and 2026–27 academic-year rates",
          columns: ["Community", "Style", "Residents", "Annual rate (double)", "Annual rate (single)"],
          rows: [
            ["Madrone Hall", "Suite, first-year and Honors", "400", "$11,640", "$13,920"],
            ["Redwood Commons", "Traditional, first-year", "620", "$9,480", "$11,280"],
            ["Cypress Hall", "Traditional, first-year", "480", "$9,480", "$11,280"],
            ["Tanoak Village", "Suite", "560", "$10,380", "$12,300"],
            ["Huckleberry Court", "Suite, living-learning communities", "340", "$10,380", "$12,300"],
            ["Fern Glen Apartments", "Apartment, upper-division", "720", "$10,920", "$12,960"],
            ["Spruce Grove Apartments", "Apartment, upper-division", "610", "$10,920", "$12,960"],
            ["Alder Family Housing", "Apartment, students with families", "320", "$1,240 per month (2-bedroom)", "—"],
          ],
        },
      },
      {
        heading: "Living-learning communities",
        list: [
          "Sequoia Honors (Madrone Hall)",
          "Women in STEM (Huckleberry Court)",
          "Outdoor Leadership (Tanoak Village)",
          "Casa Redwood: Spanish language and Latinx culture (Cypress Hall)",
          "Native American Living Community (Huckleberry Court)",
        ],
      },
      {
        heading: "Apply for housing",
        paragraphs: [
          "New students apply through RedwoodConnect after accepting their offer of admission. A $300 deposit is due with the housing contract; first-year housing is guaranteed if the contract and deposit are received by May 1.",
        ],
        links: [
          { label: "2026–27 Housing Contract (PDF)", href: "/documents/housing-contract-2026-27.pdf" },
          { label: "Madrone Hall opens", href: "/news/madrone-hall-opens" },
          { label: "Dining plans", href: "/students/dining" },
        ],
      },
    ],
  },

  "/students/dining": {
    summary: "Meal plans, dining locations, and this week's menus.",
    sections: [
      {
        paragraphs: [
          "Redwood Dining serves more than 9,000 meals a day in two all-you-care-to-eat dining commons, six cafés, and a food truck. Menus feature produce from Canopy Farm and seafood from north coast fisheries.",
        ],
      },
      {
        heading: "Meal plans (per semester)",
        table: {
          columns: ["Plan", "Meals", "Dining Dollars", "Price"],
          rows: [
            ["Unlimited", "Unlimited dining commons access", "$150", "$3,420"],
            ["Owl 14", "14 meals per week", "$300", "$3,180"],
            ["Owl 10", "10 meals per week", "$400", "$2,960"],
            ["Block 100 (apartment residents)", "100 meals per semester", "$250", "$1,690"],
            ["Commuter 25", "25 meals per semester", "$100", "$420"],
          ],
        },
      },
      {
        heading: "Locations and hours",
        table: {
          columns: ["Location", "Weekdays", "Weekends"],
          rows: [
            ["The Grove Dining Commons", "7:00 a.m. – 9:00 p.m.", "9:00 a.m. – 8:00 p.m."],
            ["Madrone Kitchen", "7:30 a.m. – 10:00 p.m.", "10:00 a.m. – 10:00 p.m."],
            ["Tanoak Food Court", "10:30 a.m. – 7:00 p.m.", "Closed"],
            ["Stacks Café (Sequoia Library)", "7:30 a.m. – 11:00 p.m.", "11:00 a.m. – 11:00 p.m."],
            ["Canopy Coffee", "7:00 a.m. – 4:00 p.m.", "Closed"],
            ["Owl Bites Food Truck", "Varies; follow @RSUDining", "Varies"],
          ],
        },
      },
      {
        heading: "This week's menu",
        paragraphs: ["See the menu image below for this week's specials at The Grove. Allergen information is available at each station."],
        links: [{ label: "Click here for nutrition info", href: "/students/dining" }],
      },
    ],
  },

  "/students/parking": {
    summary: "Permits, lots, citations, and electric vehicle charging.",
    updated: "Rates effective Fall 2025",
    sections: [
      {
        paragraphs: [
          "All vehicles parked on campus Monday through Friday, 7 a.m. to 10 p.m., must display a valid permit. Permits are virtual and linked to your license plate. Enforcement uses license plate recognition.",
        ],
      },
      {
        heading: "Permit rates",
        table: {
          caption: "2025–26 and 2026–27 parking permit rates",
          columns: ["Permit", "Eligible lots", "Semester", "Annual"],
          rows: [
            ["General student (G)", "Lots B, C, D, F, J", "$189", "$360"],
            ["Resident student (R)", "Resident lots R1–R6", "$214", "$410"],
            ["Madrone Hall resident (RM)", "Lot M structure", "$246", "$470"],
            ["Motorcycle / scooter", "Designated motorcycle areas", "$48", "$92"],
            ["Faculty / staff (F)", "All F lots, G lots", "—", "$540 (payroll deduction)"],
            ["Evening (after 4:30 p.m.)", "All G and F lots", "$72", "$136"],
            ["Daily", "Lots A, B, C", "$6 per day", "—"],
            ["Hourly visitor", "Lot A, Canopy structure", "$2 per hour", "—"],
          ],
        },
      },
      {
        heading: "Lot guide",
        table: {
          columns: ["Lot", "Location", "Spaces", "Accessible spaces", "EV chargers"],
          rows: [
            ["A", "Canopy Drive entrance", "140", "8", "4"],
            ["B", "Behind Founders Hall", "380", "12", "6"],
            ["C", "Owl Arena", "620", "18", "8"],
            ["D", "Redwood Field", "450", "10", "0"],
            ["F", "Sequoia Engineering Hall", "210", "6", "4"],
            ["J", "Upper campus (shuttle)", "900", "12", "0"],
            ["M", "Madrone Hall structure", "360", "10", "12"],
            ["R1–R6", "Residence halls", "1,100", "30", "6"],
          ],
        },
      },
      {
        heading: "Citations and appeals",
        paragraphs: [
          "Citations may be appealed online within 21 calendar days of issue. Fines range from $40 (no valid permit) to $365 (unauthorized use of an accessible space).",
        ],
        links: [
          { label: "Parking Map (PDF)", href: "/documents/parking-map.pdf" },
          { label: "Transportation alternatives", href: "/students/transportation" },
          { label: "Read more", href: "/campus-map" },
        ],
      },
    ],
  },

  "/students/transportation": {
    summary: "Buses, shuttles, bikes, and rideshare options for getting to campus.",
    sections: [
      {
        paragraphs: [
          "Your student ID is your bus pass. RSU students ride Coastline Transit buses free throughout the county, and the campus shuttle connects upper campus, Lot J, and downtown Arcadia Falls.",
        ],
      },
      {
        heading: "Owl Shuttle schedule",
        table: {
          columns: ["Route", "Stops", "Frequency", "Hours (class days)"],
          rows: [
            ["Green Loop", "Founders Hall, Lot J, Madrone Hall, Canopy Science Center", "Every 10 minutes", "7:00 a.m. – 7:00 p.m."],
            ["Downtown Express", "Rowan Student Union, Arcadia Falls Transit Center", "Every 20 minutes", "7:00 a.m. – 11:00 p.m."],
            ["Night Owl", "All residence halls, Sequoia Library, Lot C", "On demand", "7:00 p.m. – 2:00 a.m."],
          ],
        },
      },
      {
        heading: "Other options",
        list: [
          "Bike racks at every building and secure bike lockers at Madrone Hall and Lot B",
          "Owl Bike Share: 120 e-bikes at 12 stations",
          "Carpool permits at half price for two or more riders",
          "Car-share vehicles in Lots A and R2",
          "Weekend Coastline Connector coach to Port Alder, Westmere, and the state capital",
        ],
        links: [{ label: "Parking Services", href: "/students/parking" }],
      },
    ],
  },

  "/students/safety": {
    summary: "Campus Safety, emergency alerts, and safety resources.",
    sections: [
      {
        paragraphs: [
          "The Redwood State University Police Department (UPD) and Campus Safety provide 24-hour patrol, emergency response, and safety escorts. In an emergency, call 911. For non-emergencies, call (707) 555-0160.",
        ],
      },
      {
        heading: "Safety resources",
        list: [
          "RSU Alert: emergency text and email notifications (all students are enrolled automatically)",
          "Safety escorts: call (707) 555-0161 from dusk to 2 a.m.",
          "Blue-light emergency phones at 64 locations",
          "Lost and found at the Cedar Building",
          "Annual Security and Fire Safety Report (Clery Act)",
          "Title IX and confidential advocacy services",
        ],
      },
      {
        heading: "Emergency preparedness",
        paragraphs: [
          "The north coast is earthquake and tsunami country. Know your nearest evacuation route: all of main campus is above the tsunami inundation zone, but the Marine Lab at Gull Rock Point is not. During a wildfire smoke event, check RSU Alert for class cancellations and clean-air rooms.",
        ],
        links: [
          { label: "Emergency Guide (PDF)", href: "/documents/emergency-guide.pdf" },
          { label: "Student Conduct Code (PDF)", href: "/documents/student-conduct-code.pdf" },
        ],
      },
    ],
  },

  "/students/organizations": {
    summary: "Find your people among more than 200 student clubs and organizations.",
    sections: [
      {
        paragraphs: [
          "Student organizations are registered through the Office of Student Life in Rowan Student Union. From the Redwood Outing Club to the Latinx Engineering Society, there is a group for every interest. Clubs can reserve space, apply for Associated Students funding, and table on Canopy Green.",
        ],
        list: [
          "Academic and professional",
          "Cultural and identity",
          "Outdoor and recreation",
          "Performing arts",
          "Service and advocacy",
          "Fraternities and sororities",
          "Club sports",
        ],
        links: [
          { label: "Redwood State Fall Fest", href: "/events/fall-fest-2026" },
          { label: "Start a new club (Student Conduct Code, PDF)", href: "/documents/student-conduct-code.pdf" },
        ],
      },
    ],
  },

  "/students/recreation": {
    summary: "Fitness, outdoor adventures, intramurals, and club sports.",
    sections: [
      {
        paragraphs: [
          "The Student Recreation Center is funded by the Recreation Center Fee and is free for enrolled students. It has a climbing wall, an indoor track, a 25-yard pool, and a fitness floor with views of the canopy.",
        ],
      },
      {
        heading: "Hours",
        table: {
          columns: ["Facility", "Monday–Thursday", "Friday", "Saturday–Sunday"],
          rows: [
            ["Recreation Center", "6:00 a.m. – 11:00 p.m.", "6:00 a.m. – 9:00 p.m.", "9:00 a.m. – 9:00 p.m."],
            ["Pool (lap swim)", "6:00 – 9:00 a.m., 11:30 a.m. – 1:30 p.m., 6:00 – 9:00 p.m.", "6:00 – 9:00 a.m.", "12:00 – 5:00 p.m."],
            ["Climbing wall", "3:00 – 10:00 p.m.", "3:00 – 8:00 p.m.", "12:00 – 6:00 p.m."],
            ["Outdoor Center (gear rental)", "10:00 a.m. – 6:00 p.m.", "10:00 a.m. – 6:00 p.m.", "Closed"],
          ],
        },
      },
      {
        heading: "Programs",
        list: [
          "Intramural leagues: basketball, flag football, soccer, volleyball, ultimate",
          "Group fitness: 60+ free classes per week",
          "Outdoor Adventures: kayaking the Silverfin River, redwood backpacking, surfing lessons",
          "Club sports: rugby, cycling, crew, climbing, and more",
        ],
      },
    ],
  },

  // Library
  "/library": {
    summary: "Books, articles, research help, study space, and archives at Sequoia Library.",
    sections: [
      {
        paragraphs: [
          "Sequoia Library holds more than 650,000 volumes, 180 research databases, and the Arcadia Falls Local History Archives. The library is open 24 hours during finals and offers 38 bookable study rooms.",
        ],
        links: [
          { label: "Library Search", href: "/library/search" },
          { label: "Databases A–Z", href: "/library/databases" },
          { label: "Research Guides", href: "/library/guides" },
          { label: "Study Room Reservations", href: "/library/study-rooms" },
          { label: "Library Hours", href: "/library/hours" },
          { label: "My Library Account", href: "/library/account" },
          { label: "Library Policies", href: "/library/policies" },
        ],
      },
      {
        heading: "Ask a librarian",
        paragraphs: [
          "Get help by chat, email, or in person at the Research Help Desk on the first floor. Subject librarians are available for 30-minute research consultations.",
        ],
        list: ["Phone: (707) 555-0170", "Email: askus@redwoodstate.example.edu"],
      },
      {
        heading: "News from the library",
        links: [{ label: "Sequoia Library digitizes a century of logging records", href: "/news/library-digitizes-logging-archives" }],
      },
    ],
  },

  "/library/search": {
    summary: "Search books, articles, media, and archival collections.",
    sections: [
      {
        paragraphs: [
          "OneSearch searches the library catalog, most article databases, and digital collections at once. Use the filters to narrow by format, date, subject, or availability. Off-campus access requires your RedwoodConnect login.",
        ],
        links: [{ label: "Databases A–Z", href: "/library/databases" }],
      },
    ],
  },

  "/library/databases": {
    summary: "An A–Z list of research databases licensed by Sequoia Library.",
    updated: "Database list last reviewed 2020",
    sections: [
      {
        paragraphs: [
          "Databases are licensed for current RSU students, faculty, and staff. Walk-in users may access most databases from library computers. Some vendors limit simultaneous users. Report access problems to eresources@redwoodstate.example.edu.",
        ],
        links: [{ label: "Research Guides", href: "/library/guides" }],
      },
    ],
  },

  "/library/guides": {
    summary: "Subject and course guides created by Sequoia Library librarians.",
    sections: [
      {
        links: [
          { label: "Citing Sources: APA, MLA & Chicago", href: "/library/guides/citation-guide" },
          { label: "Nursing: Evidence-Based Practice", href: "/library/guides/nursing-evidence-based-practice" },
          { label: "Arcadia Falls Local History Archives", href: "/library/guides/local-history-archives" },
        ],
      },
    ],
  },

  "/library/study-rooms": {
    summary: "Reserve a group study room in Sequoia Library.",
    sections: [
      {
        paragraphs: [
          "Current RSU students may reserve up to 2 hours per day and 6 hours per week. Rooms are held for 15 minutes past the start of a reservation. Rooms on the 3rd floor are designated quiet rooms.",
        ],
        links: [{ label: "Library Policies (PDF)", href: "/documents/library-policies.pdf" }],
      },
    ],
  },

  "/library/hours": {
    summary: "Sequoia Library hours for Fall 2026.",
    sections: [
      {
        table: {
          caption: "Fall semester hours, August 24 – December 11, 2026",
          columns: ["Location", "Monday–Thursday", "Friday", "Saturday", "Sunday"],
          rows: [
            ["Sequoia Library", "7:30 a.m. – 12:00 a.m.", "7:30 a.m. – 8:00 p.m.", "10:00 a.m. – 6:00 p.m.", "12:00 p.m. – 12:00 a.m."],
            ["Research Help Desk", "9:00 a.m. – 9:00 p.m.", "9:00 a.m. – 5:00 p.m.", "Closed", "1:00 p.m. – 7:00 p.m."],
            ["Local History Archives", "10:00 a.m. – 4:00 p.m.", "10:00 a.m. – 4:00 p.m.", "Closed", "Closed"],
            ["Learning Center & Writing Studio", "9:00 a.m. – 8:00 p.m.", "9:00 a.m. – 3:00 p.m.", "Closed", "3:00 p.m. – 8:00 p.m."],
            ["Stacks Café", "7:30 a.m. – 11:00 p.m.", "7:30 a.m. – 6:00 p.m.", "11:00 a.m. – 5:00 p.m.", "12:00 p.m. – 11:00 p.m."],
          ],
        },
        paragraphs: ["Finals week (December 12–18): open 24 hours. Closed November 26–27 for Thanksgiving."],
      },
    ],
  },

  "/library/policies": {
    summary: "Borrowing, fines, conduct, and collection policies.",
    updated: "Revised Fall 2018",
    sections: [
      {
        heading: "Borrowing",
        table: {
          columns: ["Patron type", "Books", "Loan period", "Renewals"],
          rows: [
            ["Undergraduate", "50", "28 days", "3"],
            ["Graduate", "75", "Semester", "3"],
            ["Faculty", "150", "Academic year", "Unlimited"],
            ["Staff", "50", "56 days", "3"],
            ["Community borrower", "10", "21 days", "1"],
            ["Course reserves (all)", "2", "2 hours", "0"],
          ],
        },
      },
      {
        heading: "Fines and fees",
        paragraphs: [
          "Sequoia Library does not charge overdue fines on regular loans. Course reserves accrue $1 per hour, and items 30 days overdue are billed as lost ($110 replacement plus $15 processing).",
        ],
      },
      {
        heading: "Conduct",
        paragraphs: [
          "Covered drinks are permitted throughout the library. Food is permitted on floors 1 and 2 only. Quiet floors (3 and 4) are for silent study.",
        ],
        links: [
          { label: "Full Library Policies (PDF)", href: "/documents/library-policies.pdf" },
          { label: "Click here", href: "/documents/library-policies.pdf" },
        ],
      },
    ],
  },

  "/library/account": {
    summary: "View your checkouts, holds, and interlibrary loan requests.",
    sections: [
      {
        paragraphs: ["Sign in with your RedwoodConnect username to renew items, place holds, and track interlibrary loan requests."],
        links: [{ label: "Library Policies", href: "/library/policies" }],
      },
    ],
  },
};
