// Academics hubs, faculty, news, events, athletics, giving, employees, and portal copy.
// Merged into `pageContent` in ./pages.
import type { PageContent } from "./pages";

export const sectionPages: Record<string, PageContent> = {
  // Academics
  "/academics": {
    summary: "Six colleges, 64 majors, and 29 graduate programs rooted in the redwood coast.",
    sections: [
      {
        paragraphs: [
          "Redwood State's academic programs combine the breadth of a comprehensive university with the attention of a small college. Classes average 27 students, and 68% of undergraduates complete research, an internship, or a field placement before graduating.",
        ],
      },
      {
        heading: "Colleges",
        links: [
          { label: "College of Engineering", href: "/academics/colleges/engineering" },
          { label: "College of Business", href: "/academics/colleges/business" },
          { label: "College of Arts & Humanities", href: "/academics/colleges/arts-humanities" },
          { label: "College of Science", href: "/academics/colleges/science" },
          { label: "College of Education", href: "/academics/colleges/education" },
          { label: "College of Health Sciences", href: "/academics/colleges/health-sciences" },
        ],
      },
      {
        heading: "Find a program",
        links: [
          { label: "Degree Programs", href: "/academics/programs" },
          { label: "Minors", href: "/academics/minors" },
          { label: "Certificates", href: "/academics/certificates" },
          { label: "Course Search", href: "/academics/courses" },
          { label: "General Catalog 2025–2026", href: "/academics/catalog" },
          { label: "Academic Calendar", href: "/academics/calendar" },
        ],
      },
    ],
  },

  "/academics/programs": {
    summary: "Search bachelor's and master's degree programs by college, level, and interest.",
    sections: [
      {
        paragraphs: [
          "Use the filters to browse programs by college and degree level. Each program page lists degree requirements, learning outcomes, sample courses, and career paths. Impacted programs are marked.",
        ],
        links: [
          { label: "Minors", href: "/academics/minors" },
          { label: "Certificates", href: "/academics/certificates" },
          { label: "Undergraduate admission", href: "/admissions/undergraduate" },
          { label: "Graduate admission", href: "/admissions/graduate" },
        ],
      },
    ],
  },

  "/academics/minors": {
    summary: "Add depth to any major with one of 48 minors.",
    sections: [
      {
        paragraphs: ["Most minors require 18–24 units, at least 9 of them upper-division and completed in residence at RSU. Declare a minor with the Change of Major/Minor form."],
        list: [
          "Applied Statistics", "Business Analytics", "Chemistry", "Computer Science", "Creative Writing", "Data Science",
          "Environmental Ethics", "Forest Ecology", "Geospatial Science", "Global Health", "History", "Journalism",
          "Marine Biology", "Mathematics", "Native American Studies", "Psychology", "Public History", "Robotics",
          "Spanish", "Sustainability", "Wildland Fire Science", "Writing and Rhetoric",
        ],
      },
    ],
  },

  "/academics/certificates": {
    summary: "Undergraduate and post-baccalaureate certificates.",
    updated: "Updated Spring 2021",
    sections: [
      {
        table: {
          columns: ["Certificate", "Level", "Units", "College"],
          rows: [
            ["Geographic Information Systems", "Undergraduate", "15", "Science"],
            ["Nonprofit Management", "Undergraduate", "12", "Business"],
            ["Cybersecurity Fundamentals", "Undergraduate", "15", "Engineering"],
            ["Teaching English to Speakers of Other Languages (TESOL)", "Post-baccalaureate", "15", "Arts & Humanities"],
            ["Public Health Nursing", "Post-baccalaureate", "9", "Health Sciences"],
            ["Special Education Added Authorization", "Post-baccalaureate", "12", "Education"],
          ],
        },
        links: [{ label: "Click here", href: "/documents/catalog-addendum-2025-26.pdf" }],
      },
    ],
  },

  "/academics/catalog": {
    summary: "The official General Catalog of Redwood State University for 2025–2026.",
    updated: "Catalog of record: 2025–2026. See addendum for changes effective Fall 2026.",
    sections: [
      {
        paragraphs: [
          "The General Catalog is the official statement of academic policies, degree requirements, and course descriptions. Students follow the requirements of the catalog in effect when they begin continuous enrollment (catalog rights, per University Policy AP-14-03). Changes to the catalog after publication appear in the Catalog Addendum.",
        ],
        links: [
          { label: "Catalog Addendum 2026 (PDF)", href: "/documents/catalog-addendum-2025-26.pdf" },
          { label: "Course Search", href: "/academics/courses" },
        ],
      },
    ],
  },

  "/academics/courses": {
    summary: "Search the Fall 2026 and Spring 2027 class schedule.",
    sections: [
      {
        paragraphs: ["Search by subject, course number, instructor, or keyword. Class availability updates nightly. Register for classes in RedwoodConnect."],
        links: [{ label: "Registration", href: "/portal/registration" }],
      },
    ],
  },

  "/academics/calendar": {
    summary: "Key academic dates for the 2026–27 academic year.",
    sections: [
      {
        heading: "Fall 2026",
        table: {
          caption: "Fall 2026 academic calendar",
          columns: ["Date", "Event"],
          rows: [
            ["August 17–21", "Faculty preparation week"],
            ["August 24", "First day of classes"],
            ["August 31", "Last day to add without permission number"],
            ["September 7", "Labor Day (campus closed)"],
            ["September 18", "Census date"],
            ["October 23–25", "Homecoming & Family Weekend"],
            ["November 2", "Spring 2027 registration begins (by time ticket)"],
            ["November 6", "Last day to withdraw with a W"],
            ["November 11", "Veterans Day (campus closed)"],
            ["November 23–27", "Fall break (no classes)"],
            ["December 11", "Last day of classes"],
            ["December 14–18", "Final examinations"],
            ["December 19", "Winter Commencement, Owl Arena"],
          ],
        },
      },
      {
        heading: "Spring 2027",
        table: {
          caption: "Spring 2027 academic calendar",
          columns: ["Date", "Event"],
          rows: [
            ["January 18", "Martin Luther King Jr. Day (campus closed)"],
            ["January 20", "First day of classes"],
            ["February 12", "Census date"],
            ["March 22–26", "Spring break"],
            ["March 31", "César Chávez Day (campus closed)"],
            ["April 9", "Last day to withdraw with a W"],
            ["May 7", "Last day of classes"],
            ["May 10–14", "Final examinations"],
            ["May 15–16", "Commencement, Redwood Field"],
          ],
        },
        links: [{ label: "Academic Calendar 2026–27 (PDF)", href: "/documents/academic-calendar-2026-27.pdf" }],
      },
    ],
  },

  "/faculty": {
    summary: "Find Redwood State faculty by name, department, or research interest.",
    sections: [
      {
        paragraphs: ["Search the directory of teaching and research faculty. For staff, see the Employee Directory."],
        links: [{ label: "Employee Directory", href: "/employees/directory" }],
      },
    ],
  },

  // News and events
  "/news": {
    summary: "Stories of research, campus life, athletics, and alumni from Redwood State.",
    sections: [
      {
        paragraphs: ["RSU News is published by the Office of University Communications. Media inquiries: (707) 555-0105 or news@redwoodstate.example.edu."],
        links: [
          { label: "Research", href: "/news/category/research" },
          { label: "Campus Life", href: "/news/category/campus" },
          { label: "Athletics", href: "/news/category/athletics" },
          { label: "Alumni", href: "/news/category/alumni" },
          { label: "News Archive", href: "/news/archive" },
        ],
      },
    ],
  },
  "/news/archive": {
    summary: "Every RSU News story, newest first.",
    sections: [{ paragraphs: ["Stories published before 2018 are available in the Local History Archives at Sequoia Library."], links: [{ label: "Search News", href: "/news/search" }] }],
  },
  "/news/search": {
    summary: "Search RSU News stories by keyword, category, or date.",
    sections: [{ paragraphs: ["Enter a keyword to search headlines and story text."] }],
  },
  "/events": {
    summary: "Lectures, performances, games, and student life events at Redwood State.",
    sections: [
      {
        paragraphs: ["Browse upcoming events by month or category. Events are free and open to the public unless noted. For disability-related accommodations at an event, contact the event sponsor at least five business days in advance."],
        links: [
          { label: "Academic", href: "/events/category/academic" },
          { label: "Arts & Culture", href: "/events/category/arts" },
          { label: "Athletics", href: "/events/category/athletics" },
          { label: "Student Life", href: "/events/category/student-life" },
        ],
      },
    ],
  },
  "/events/search": {
    summary: "Search the Redwood State events calendar.",
    sections: [{ paragraphs: ["Search by keyword, date range, or location."] }],
  },

  // Athletics
  "/athletics": {
    summary: "Home of the Redwood Owls: 14 IAA Division II teams.",
    sections: [
      {
        paragraphs: [
          "The Redwood Owls compete in Intercollegiate Athletic Association (IAA) Division II in the Pacific North Conference. Home games are played in Owl Arena and on Redwood Field. Students get in free with their ID. Look for Rowan the Redwood Owl on the sideline.",
        ],
        links: [
          { label: "Teams", href: "/athletics/teams" },
          { label: "Composite Schedule", href: "/athletics/schedule" },
          { label: "Scores & Results", href: "/athletics/scores" },
          { label: "Owls Basketball Home Opener", href: "/events/basketball-home-opener" },
        ],
      },
    ],
  },
  "/athletics/teams": {
    summary: "Redwood Owls varsity teams.",
    sections: [
      {
        links: [
          { label: "Men's Basketball", href: "/athletics/teams/mens-basketball" },
          { label: "Women's Basketball", href: "/athletics/teams/womens-basketball" },
          { label: "Women's Soccer", href: "/athletics/teams/womens-soccer" },
          { label: "Baseball", href: "/athletics/teams/baseball" },
          { label: "Volleyball", href: "/athletics/teams/volleyball" },
          { label: "Cross Country", href: "/athletics/teams/cross-country" },
        ],
      },
    ],
  },
  "/athletics/schedule": {
    summary: "Composite schedule for all Redwood Owls teams, 2026–27.",
    updated: "Schedule subject to change",
    sections: [{ paragraphs: ["All times Pacific. H = home, A = away, N = neutral site. * = conference game. Tickets: (707) 555-0165."] }],
  },
  "/athletics/scores": {
    summary: "Recent scores and results for the Redwood Owls.",
    sections: [{ paragraphs: ["Results are posted within an hour of the final whistle. Box scores are available for basketball, soccer, volleyball, and baseball."] }],
  },

  // Giving
  "/giving": {
    summary: "Your gift helps Redwood State students put down deep roots.",
    sections: [
      {
        paragraphs: [
          "Every year, gifts from alumni, parents, and friends fund scholarships, research, and programs that tuition and state support alone cannot. In 2025–26, 9,420 donors gave $21.6 million to Redwood State. The Redwood State University Foundation is a 501(c)(3) nonprofit organization; gifts are tax deductible to the extent allowed by law.",
        ],
        links: [
          { label: "Make a gift", href: "/giving/donate" },
          { label: "Giving Priorities", href: "/giving/priorities" },
          { label: "Wide Branches Campaign", href: "/giving/campaigns" },
        ],
      },
      {
        heading: "Ways to give",
        list: [
          "Online by credit card or bank transfer through RedwoodConnect ePay",
          "Monthly recurring gifts through the Evergreen Society",
          "Payroll deduction for faculty and staff",
          "Gifts of stock or appreciated securities",
          "Bequests and planned gifts through the Kellerman Legacy Circle",
          "Employer matching gifts",
        ],
      },
      {
        heading: "Contact the Office of Advancement",
        list: ["Founders Hall 320", "(707) 555-0190", "giving@redwoodstate.example.edu"],
      },
    ],
  },

  "/giving/donate": {
    summary: "Make a secure online gift to Redwood State University.",
    sections: [
      {
        paragraphs: [
          "Choose where your gift goes, enter an amount, and complete your payment. You will receive an email receipt for tax purposes. For assistance, call (707) 555-0190.",
        ],
      },
    ],
  },

  "/giving/priorities": {
    summary: "Where gifts make the greatest difference right now.",
    sections: [
      { heading: "Student Success Fund", paragraphs: ["Flexible support for scholarships, emergency grants, the Owl Pantry, and textbook assistance. Last year, emergency grants of $500 or less kept 640 students enrolled."] },
      { heading: "First-Generation Scholars", paragraphs: ["Mentoring, summer bridge, and $3,000 annual scholarships for students who are the first in their families to attend college. The program nearly doubled in 2026, to almost 500 students."], links: [{ label: "Read more", href: "/news/first-gen-scholars-expands" }] },
      { heading: "Institute for Coastal Forest Resilience", paragraphs: ["Endowed faculty positions and student research fellowships for the study of redwood forests, fire, and climate."] },
      { heading: "Redwood Owls Athletics", paragraphs: ["Scholarships for student-athletes and improvements to Redwood Field, including new lights and a video board."] },
      { heading: "Sequoia Library", paragraphs: ["Digitization of the Arcadia Falls Local History Archives and expanded 24-hour study space."] },
    ],
  },

  "/giving/alumni": {
    summary: "Give back to the place that gave you your start.",
    sections: [
      {
        paragraphs: [
          "Alumni participation matters. National rankings consider the percentage of alumni who give, and every gift, of any size, counts. Class gift challenges run each year during Homecoming, and the class with the highest participation earns the Golden Owl trophy.",
        ],
        list: [
          "Class of 2016 (10th reunion): goal $50,000 for the Class of 2016 Scholarship",
          "Class of 2001 (25th reunion): goal $125,000 for Canopy Green renovation",
          "Young Alumni Challenge: $10,000 match for gifts from graduates of the last decade",
        ],
        links: [
          { label: "Alumni Association", href: "/alumni" },
          { label: "Make a gift", href: "/giving/donate" },
        ],
      },
    ],
  },

  "/giving/scholarships": {
    summary: "Create a named, endowed scholarship at Redwood State.",
    updated: "Updated Fall 2020",
    sections: [
      {
        paragraphs: [
          "An endowed scholarship is invested by the RSU Foundation, and a portion of the earnings (currently 4.25% per year) is awarded to students in perpetuity. Endowed scholarships may be established with a minimum gift of $25,000, payable over five years. Current-use scholarships may be established with $2,500 per year.",
        ],
        table: {
          caption: "Scholarship funding levels",
          columns: ["Level", "Minimum gift", "Approximate annual award"],
          rows: [
            ["Current-use scholarship", "$2,500 per year", "$2,500"],
            ["Endowed scholarship", "$25,000", "$1,060"],
            ["Endowed Presidential Scholarship", "$100,000", "$4,250"],
            ["Endowed Full-Tuition Scholarship", "$250,000", "$10,600"],
          ],
        },
        links: [
          { label: "Student scholarships", href: "/admissions/scholarships" },
          { label: "Click here to learn more", href: "/giving" },
        ],
      },
    ],
  },

  "/giving/campaigns": {
    summary: "Wide Branches: The Campaign for Redwood State.",
    sections: [
      {
        paragraphs: [
          "Wide Branches is the largest fundraising campaign in Redwood State history: $250 million by June 2030 to advance the goals of Strategic Plan 2030. As of September 2026, donors have committed $141 million.",
        ],
        table: {
          caption: "Wide Branches campaign progress by priority",
          columns: ["Priority", "Goal", "Raised to date"],
          rows: [
            ["Student scholarships and success", "$110M", "$68.2M"],
            ["Faculty and research", "$70M", "$38.5M"],
            ["Facilities (Madrone Hall, Redwood Field)", "$45M", "$27.1M"],
            ["Unrestricted and annual support", "$25M", "$7.2M"],
            ["Total", "$250M", "$141.0M"],
          ],
        },
        links: [
          { label: "Strategic Plan 2030", href: "/about/strategic-plan" },
          { label: "Giving Priorities", href: "/giving/priorities" },
        ],
      },
      {
        heading: "Giving Day",
        paragraphs: ["Owl Giving Day, 24 hours of giving each April, raised $1.4 million from 3,860 donors in 2026."],
      },
    ],
  },

  // Employees
  "/employees": {
    summary: "Tools and information for Redwood State faculty and staff.",
    updated: "Page maintained by Human Resources",
    sections: [
      {
        links: [
          { label: "Human Resources", href: "/employees/hr" },
          { label: "Benefits", href: "/employees/benefits" },
          { label: "Payroll Services", href: "/employees/payroll" },
          { label: "Employment Opportunities", href: "/employees/jobs" },
          { label: "Employee Policies", href: "/employees/policies" },
          { label: "Employee Directory", href: "/employees/directory" },
          { label: "Academic Calendar", href: "/academics/calendar" },
        ],
      },
      {
        heading: "Announcements",
        list: [
          "Open enrollment for 2027 benefits runs October 12 – November 6, 2026.",
          "Required training: Preventing Discrimination and Harassment is due December 31 for all employees.",
          "Timesheets for the October 1–15 period are due October 16 by noon.",
        ],
      },
    ],
  },

  "/employees/hr": {
    summary: "Recruitment, classification, employee relations, and training.",
    sections: [
      {
        paragraphs: [
          "Human Resources supports RSU's 3,100 faculty and staff. HR is organized into Talent Acquisition, Classification & Compensation, Employee & Labor Relations, Benefits, and Learning & Development. Most employees are represented by one of six bargaining units.",
        ],
        table: {
          caption: "Bargaining units",
          columns: ["Unit", "Employee group", "Contract term"],
          rows: [
            ["Unit 3", "Faculty (RSU Faculty Association)", "July 2024 – June 2027"],
            ["Unit 2, 5, 7, 9", "Staff (Redwood Staff Employees Union)", "July 2025 – June 2028"],
            ["Unit 6", "Skilled trades", "July 2023 – June 2026 (in negotiation)"],
            ["Unit 8", "Public safety officers", "July 2025 – June 2027"],
            ["Unit 11", "Academic student employees", "July 2024 – June 2027"],
            ["Unit 4", "Academic support", "July 2025 – June 2028"],
          ],
        },
      },
      {
        heading: "Contact Human Resources",
        list: [
          "Founders Hall 210",
          "(707) 555-0180",
          "hr@redwoodstate.example.edu",
          "HR Service Center: Monday–Friday, 8 a.m. to 4:30 p.m.",
          "Director of Human Resources: Hector Pacheco",
        ],
        links: [
          { label: "Benefits", href: "/employees/benefits" },
          { label: "Employee Policies", href: "/employees/policies" },
        ],
      },
    ],
  },

  "/employees/benefits": {
    summary: "Medical, dental, vision, retirement, and leave benefits for eligible employees.",
    updated: "2026 plan year. 2027 rates available at open enrollment.",
    sections: [
      {
        paragraphs: [
          "Employees appointed at half-time or more for more than six months are eligible for benefits. New employees must enroll within 60 days of hire. Coverage begins the first day of the month following enrollment.",
        ],
      },
      {
        heading: "Medical plans",
        table: {
          caption: "2026 monthly medical premiums, employee share",
          columns: ["Plan", "Type", "Employee only", "Employee + 1", "Family", "Office visit copay", "Annual deductible"],
          rows: [
            ["Canopy HMO", "HMO", "$0", "$62", "$118", "$15", "$0"],
            ["North Coast PPO", "PPO", "$84", "$236", "$392", "$25 (in network)", "$500 / $1,000"],
            ["Redwood Health Savings Plan", "HDHP + HSA", "$0", "$0", "$38", "Deductible, then 10%", "$1,650 / $3,300"],
            ["Redwood Health Plan (Port Alder Medical Center network)", "HMO", "$0", "$48", "$96", "$15", "$0"],
          ],
        },
      },
      {
        heading: "Dental and vision",
        table: {
          columns: ["Plan", "Employee cost", "Coverage highlights"],
          rows: [
            ["Coastal Dental Plan PPO", "$0", "100% preventive, 80% basic, 50% major; $2,000 annual maximum"],
            ["Coastal Dental Plan HMO", "$0", "Copay schedule, no annual maximum"],
            ["ClearView Vision Plan", "$0", "Exam every 12 months, $10 copay; $150 frames allowance"],
          ],
        },
      },
      {
        heading: "Retirement",
        paragraphs: [
          "Most employees are members of the State Public Employees' Retirement System, a defined benefit plan. Employees hired after January 1, 2013 contribute 8% of salary (2% at 62 formula). Voluntary 403(b) and 457(b) plans are available.",
        ],
      },
      {
        heading: "Other benefits",
        list: [
          "Fee waiver: up to 6 units per semester for employees; transferable to dependents for 50% off",
          "Employee Assistance Program: free confidential counseling, (707) 555-0185",
          "Life insurance: 1x salary, employer paid",
          "Long-term disability",
          "Vacation: 14–24 days per year depending on service; 14 paid holidays",
          "Recreation Center membership at a reduced rate",
        ],
        links: [
          { label: "2026 Benefits Summary (PDF)", href: "/documents/benefits-summary-2026.pdf" },
          { label: "Read more", href: "/documents/benefits-summary-2026.pdf" },
        ],
      },
    ],
  },

  "/employees/jobs": {
    summary: "Join the Redwood State team: faculty, staff, and student positions.",
    sections: [
      {
        paragraphs: [
          "Redwood State University is an Equal Opportunity employer. We consider qualified applicants for employment without regard to race, religion, color, national origin, sex, sexual orientation, gender identity or expression, age, disability, genetic information, medical condition, marital status, or veteran status. Reasonable accommodations are available for applicants with disabilities; contact HR at (707) 555-0180.",
          "Positions are open until filled unless a closing date is listed. A background check is required for all positions.",
        ],
        links: [{ label: "Benefits", href: "/employees/benefits" }],
      },
    ],
  },

  "/employees/policies": {
    summary: "University policies governing employment at Redwood State.",
    updated: "Updated 2017",
    sections: [
      {
        paragraphs: [
          "Employment policies are established by the Board of Trustees, the collective bargaining agreements, and campus executive memoranda (EM). Where a policy conflicts with a collective bargaining agreement, the agreement governs. Policies below are provided in PDF format.",
        ],
        table: {
          columns: ["Policy", "Number", "Last revised"],
          rows: [
            ["Nondiscrimination, Harassment, and Retaliation", "EM 15-02", "2024"],
            ["Telecommuting", "EM 20-07", "2021"],
            ["Outside Employment and Conflict of Interest", "EM 09-11", "2016"],
            ["Workplace Violence Prevention", "EM 12-04", "2017"],
            ["Travel and Reimbursement", "EM 18-01", "2019"],
            ["Records Retention", "EM 07-03", "2012"],
            ["Emergency Operations", "EM 22-05", "2023"],
          ],
        },
        links: [
          { label: "Click here to download policies (PDF)", href: "/documents/benefits-summary-2026.pdf" },
          { label: "Emergency Guide (PDF)", href: "/documents/emergency-guide.pdf" },
          { label: "Student Conduct Code (PDF)", href: "/documents/student-conduct-code.pdf" },
        ],
      },
    ],
  },

  "/employees/payroll": {
    summary: "Pay dates, timesheets, direct deposit, and tax forms.",
    sections: [
      {
        paragraphs: [
          "Monthly salaried employees are paid on the last working day of the month. Hourly employees and student assistants are paid semi-monthly. Payroll Services is located in Founders Hall 220, (707) 555-0182, payroll@redwoodstate.example.edu.",
        ],
      },
      {
        heading: "Fall 2026 pay schedule",
        table: {
          caption: "Hourly and student employee pay periods",
          columns: ["Pay period", "Timesheet due", "Pay date"],
          rows: [
            ["August 16–31", "September 1, noon", "September 10"],
            ["September 1–15", "September 16, noon", "September 25"],
            ["September 16–30", "October 1, noon", "October 9"],
            ["October 1–15", "October 16, noon", "October 23"],
            ["October 16–31", "November 2, noon", "November 10"],
            ["November 1–15", "November 16, noon", "November 25"],
            ["November 16–30", "December 1, noon", "December 10"],
            ["December 1–15", "December 16, noon", "December 23"],
          ],
        },
      },
      {
        heading: "Forms",
        list: [
          "Direct deposit enrollment: update in RedwoodConnect Employee Self-Service",
          "Form W-4 and DE 4 withholding changes",
          "W-2 forms are available electronically by January 31",
        ],
      },
    ],
  },

  "/employees/directory": {
    summary: "Find faculty and staff by name, department, or phone number.",
    sections: [{ paragraphs: ["The directory lists faculty and staff who have agreed to be listed publicly. To update your listing, contact HR."] }],
  },

  // Student portal
  "/portal": { summary: "Your RedwoodConnect dashboard: classes, holds, account balance, and messages.", sections: [{ paragraphs: ["Welcome back. Check your To-Do List and Holds before Spring 2027 registration begins November 2."] }] },
  "/portal/schedule": { summary: "Your Fall 2026 class schedule.", sections: [{ paragraphs: ["Classes, meeting times, and locations for the current term."] }] },
  "/portal/grades": { summary: "Midterm and final grades by term.", sections: [{ paragraphs: ["Final grades for Fall 2026 will be available December 23."] }] },
  "/portal/degree-progress": { summary: "Your degree audit: completed, in-progress, and remaining requirements.", sections: [{ paragraphs: ["This report is unofficial. Contact your advisor with questions about how courses apply to your degree."] }] },
  "/portal/account": { summary: "Charges, payments, financial aid, and refunds.", sections: [{ paragraphs: ["Spring 2027 fees are due January 8, 2027."], links: [{ label: "Tuition & Fees", href: "/admissions/tuition" }] }] },
  "/portal/registration": { summary: "Add, drop, and swap classes.", sections: [{ paragraphs: ["Your Spring 2027 registration appointment is November 9, 2026 at 8:00 a.m."] }] },
  "/portal/holds": { summary: "Holds that may prevent registration or transcripts.", sections: [{ paragraphs: ["Resolve holds by contacting the office listed for each hold."] }] },
  "/portal/todo": { summary: "Items you need to complete.", sections: [{ paragraphs: ["Complete these items to avoid delays in registration or financial aid."] }] },
  "/portal/messages": { summary: "Messages from university offices.", sections: [{ paragraphs: ["Official university messages are also sent to your RSU email address."] }] },
  "/portal/profile": { summary: "Your contact information, emergency contacts, and preferences.", sections: [{ paragraphs: ["Your chosen name will appear on class rosters and in RedwoodConnect."] }] },
};
