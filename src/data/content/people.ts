// Faculty profiles and leadership bios. Names, titles and departments come from catalog.ts;
// this file adds the long-form copy. Image ids point at the image manifest (plan 04).
import { faculty, leadership } from "../catalog";

export interface FacultyProfile {
  slug: string;
  name: string;
  title: string;
  department: string;
  bio: string;
  researchInterests: string[];
  education: string[];
  publications: string[];
  office: string;
  officeHours: string;
  email: string;
  phone: string;
  courses?: string[];
  image: string;
  /** Stale-page hook: some profiles haven't been touched in years. */
  lastUpdated?: string;
  website?: { label: string; href: string };
}

export interface LeadershipBio {
  slug: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  office: string;
  email: string;
  phone: string;
  assistant?: { name: string; email: string; phone: string };
}

type FacultyDetails = Omit<FacultyProfile, "slug" | "name" | "title" | "department" | "image">;
type LeaderDetails = Omit<LeadershipBio, "slug" | "name" | "title" | "image">;

const facultyDetails: Record<string, FacultyDetails> = {
  "anjali-raman": {
    bio: "Anjali Raman studies how people with disabilities use, adapt and sometimes work around everyday technology. She joined Redwood State in 2009 and directs the Inclusive Interaction Lab in Sequoia Engineering Hall, where undergraduate and graduate researchers co-design tools with blind and low-vision users, older adults and people who rely on switch access or voice control. Her recent work examines how screen reader users build mental models of complex web applications such as learning management systems and online banking. Raman has served as chair of the Computer Science department, led the College of Engineering's curriculum review on accessibility in software courses, and advises the campus Women in Computing club. Before entering academia she worked as a software engineer on enterprise form systems, an experience she says taught her that most accessibility failures are small, predictable and preventable. She teaches Human-Computer Interaction every fall and a graduate seminar on accessible design in alternating springs.",
    researchInterests: ["Human-computer interaction", "Accessible computing and assistive technology", "Screen reader interaction with complex web applications", "Participatory design with older adults"],
    education: ["Ph.D., Computer Science, Lakemont University, 2006", "M.S., Computer Science, Lakemont University, 2003", "B.Tech., Computer Science and Engineering, Southern Peninsula Institute of Technology (India), 2000"],
    publications: [
      "Raman, A., Castellanos, J., & Holt, B. (2025). “Where am I on this page?” Orientation strategies of expert screen reader users in learning management systems. Journal of Accessible Interaction, 12(3), 41–68.",
      "Raman, A., & Kowalski, S. (2023). Low-cost voice interfaces for rural older adults: A two-year field deployment. Proceedings of the Pacific Conference on Human Factors in Computing, 211–224.",
      "Raman, A. (2021). Teaching accessibility across the undergraduate computing curriculum. Computing Education Review, 18(2), 97–115.",
      "Raman, A., Ellery, D., & Moon, T. (2018). Form errors and the people who find them. Journal of Interface Accessibility Practice, 9(1), 1–22.",
    ],
    office: "Sequoia Engineering Hall, Room 314",
    officeHours: "Tuesdays 1:00–3:00 p.m. and by appointment",
    email: "araman@redwoodstate.example.edu",
    phone: "(707) 555-0111",
    courses: ["Human-Computer Interaction", "Software Engineering", "Graduate Seminar in Accessible Design"],
    website: { label: "Inclusive Interaction Lab", href: "/academics/departments/computer-science" },
  },
  "marcus-bell": {
    bio: "Marcus Bell works on distributed systems and networking, with a particular focus on keeping networks running in places where connectivity is expensive, intermittent or both. His lab builds delay-tolerant software for rural clinics, fire lookouts and research stations along the North Coast, and he has partnered with county emergency services on mesh networks that stay up when cell towers go down. Bell joined Redwood State in 2015 after several years as a site reliability engineer and a postdoctoral appointment in networked systems. He teaches Operating Systems and Computer Networks and is known among students for take-home labs that involve deliberately breaking things. He coordinates the department's capstone program, matching senior teams with nonprofit and county partners, and serves on the university's Information Technology Advisory Committee. Outside the lab he coaches youth soccer in Arcadia Falls and is slowly restoring a 1970s sailboat.",
    researchInterests: ["Distributed systems", "Delay-tolerant and mesh networking", "Edge computing for rural infrastructure", "Reliability engineering"],
    education: ["Ph.D., Computer Science, Northgate University, 2011", "B.S., Computer Engineering, Ridgeport Polytechnic Institute, 2005"],
    publications: [
      "Bell, M., Tran, K., & Oyelaran, F. (2024). Store-and-forward telemetry for rural clinics: Lessons from three winters. Journal of Networked Systems in Practice, 7(2), 55–79.",
      "Bell, M. (2022). When the tower goes dark: Community mesh networks during wildfire evacuations. Proceedings of the Workshop on Resilient Networks, 14–22.",
      "Bell, M., & Kowalski, S. (2021). Energy-aware scheduling for solar-powered edge nodes. Letters on Embedded and Edge Systems, 3(4), 118–121.",
    ],
    office: "Sequoia Engineering Hall, Room 318",
    officeHours: "Mondays and Wednesdays 10:00–11:00 a.m.",
    email: "mbell@redwoodstate.example.edu",
    phone: "(707) 555-0112",
    courses: ["Operating Systems", "Computer Networks", "Senior Capstone Project I & II"],
  },
  "sofia-kowalski": {
    bio: "Sofia Kowalski designs small, low-power computers that sense the world and make sense of what they find. Her research combines embedded systems, sensor networks and on-device machine learning, and much of it happens outdoors. She is the faculty lead on the North Coast Smoke Mapping project, a student-built network of more than 120 air quality sensors mounted on schools, fire stations and farm buildings from the Oregon border to the hills south of Port Alder. Kowalski joined Redwood State in 2021. She teaches Embedded Systems and the department's introductory programming sequence, where she has redesigned labs around physical computing kits so first-year students write code that blinks, beeps and measures something on day one. Her students have presented at regional and national undergraduate research conferences, and three have gone on to graduate programs in electrical and computer engineering. She is a recipient of the College of Engineering's Early Career Teaching Award.",
    researchInterests: ["Embedded and cyber-physical systems", "Environmental sensor networks", "TinyML and on-device inference", "Undergraduate research in computing"],
    education: ["Ph.D., Electrical and Computer Engineering, Meridian State University, 2020", "M.S., Computer Science, Amber Coast University of Technology (Poland), 2014", "B.S., Computer Science, Amber Coast University of Technology (Poland), 2012"],
    publications: [
      "Kowalski, S., Sato, Y., Ferreira, L., & Okonkwo, A. (2026). A low-cost, community-hosted PM2.5 network for rural wildfire smoke monitoring. Environmental Sensing Letters, 5(1), 12–27.",
      "Kowalski, S., & Bell, M. (2024). Duty cycling strategies for solar sensor nodes in coastal fog. Pacific Journal of Embedded Sensing, 19(3), 301–318.",
      "Kowalski, S. (2022). Physical computing in CS1: Effects on retention among first-generation students. Computing Education Review, 19(1), 44–60.",
    ],
    office: "Sequoia Engineering Hall, Room 322",
    officeHours: "Thursdays 2:00–4:00 p.m.; drop-in lab hours Fridays in SEH 140",
    email: "skowalski@redwoodstate.example.edu",
    phone: "(707) 555-0113",
    courses: ["Introduction to Programming I", "Introduction to Programming II", "Embedded Systems"],
  },
  "kenji-watanabe": {
    bio: "Kenji Watanabe is a roboticist whose work sits at the intersection of control theory and field engineering. His group develops autonomous ground and aerial vehicles for forestry and environmental monitoring, including a climbing robot designed to carry instruments into the upper canopy of old-growth redwoods without damaging bark or epiphytes. Watanabe came to Redwood State in 2004 and was instrumental in planning the new Robotics and Autonomous Systems Lab in Sequoia Engineering Hall, which opened in fall 2026 and which he now directs. He has served as department chair, as faculty advisor to the Owls Robotics Club, and on review panels for federal research agencies. He teaches Dynamics, Control Systems and the senior mechatronics sequence. Colleagues describe him as the person who will stay until midnight to help a student debug a motor controller and then show up at 8 a.m. with coffee for the whole team.",
    researchInterests: ["Robotics and autonomous systems", "Nonlinear and adaptive control", "Field robotics for forestry and ecology", "Mechatronics education"],
    education: ["Ph.D., Mechanical Engineering, Kingsford University, 2002", "M.Eng., Mechanical Engineering, Northern Pines University (Japan), 1997", "B.Eng., Mechanical Engineering, Northern Pines University (Japan), 1995"],
    publications: [
      "Watanabe, K., Ortega, L., & Pham, R. (2025). A compliant tree-climbing robot for non-destructive canopy instrumentation. Field and Forest Robotics, 11(2), 88–107.",
      "Watanabe, K., & Santos, M. (2022). Autonomous placement of microclimate sensors in tall forest canopies. Proceedings of the International Symposium on Environmental Robotics, 45–53.",
      "Watanabe, K. (2019). Adaptive control of underactuated systems with uncertain contact. Annals of Adaptive Control, 22(8), 1–14.",
      "Watanabe, K., Lindsey, A., & Cho, H. (2014). Teaching control through hands-on mechatronics: A ten-year retrospective. Engineering Education Quarterly, 30(4), 211–230.",
    ],
    office: "Sequoia Engineering Hall, Room 205",
    officeHours: "Tuesdays and Thursdays 11:00 a.m.–12:00 p.m.",
    email: "kwatanabe@redwoodstate.example.edu",
    phone: "(707) 555-0114",
    courses: ["Dynamics", "Control Systems", "Mechatronics I & II"],
  },
  "rachel-goldberg": {
    bio: "Rachel Goldberg studies how heat and fluids move, and how to turn that motion into useful energy. Her current projects include small-scale wave energy converters tested in the RSU wave flume and off the Arcadia Falls jetty, and passive cooling systems for buildings in a warming coastal climate. She joined the Mechanical Engineering faculty in 2014 after working as a thermal engineer in the aerospace industry. Goldberg is the faculty advisor for the RSU Women in Engineering club and coordinates the department's summer bridge program for incoming engineering students. She teaches Thermodynamics, Fluid Mechanics and Heat Transfer, and was named the College of Engineering Outstanding Teacher in 2022. Her students routinely present at the Fall Undergraduate Research Symposium, and she is a strong advocate for putting instrumentation in students' hands as early as the sophomore year.",
    researchInterests: ["Marine renewable energy", "Heat transfer and thermal management", "Experimental fluid mechanics", "Passive building cooling"],
    education: ["Ph.D., Mechanical Engineering, Harborview Institute of Technology, 2012", "B.S., Mechanical Engineering, Eastbrook University, 2006"],
    publications: [
      "Goldberg, R., Achebe, N., & Whitman, S. (2025). Performance of a point-absorber wave energy converter in mixed coastal seas. Renewable Ocean Energy Journal, 8(1), 23–41.",
      "Goldberg, R. (2023). Passive radiative cooling for low-rise coastal buildings. Journal of Building Thermal Science, 15(2), 144–160.",
      "Goldberg, R., & Watanabe, K. (2020). A laboratory wave flume for undergraduate instruction. Engineering Education Quarterly, 36(3), 180–192.",
    ],
    office: "Sequoia Engineering Hall, Room 211",
    officeHours: "Mondays 1:00–3:00 p.m.",
    email: "rgoldberg@redwoodstate.example.edu",
    phone: "(707) 555-0115",
    courses: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer"],
  },
  "luis-ortega": {
    bio: "Luis Ortega builds robots that are soft, flexible and safe to work alongside. His lab uses 3D printing, silicone casting and textile fabrication to develop grippers, wearable assistive devices and biologically inspired actuators. A current project, funded by a state workforce grant, is developing a soft exosuit to reduce back strain for workers in agriculture and timber mills. Ortega joined Redwood State in 2023 after a postdoctoral fellowship in biomechanics. He grew up in a farming town in California's inland valleys and was the first in his family to attend college, and he mentors students through the First-Generation Scholars Program. He teaches Engineering Design and Graphics, Manufacturing Processes and a new elective in soft robotics, and helped design the fabrication bay in the new Robotics and Autonomous Systems Lab.",
    researchInterests: ["Soft robotics", "Wearable assistive devices and exosuits", "Additive manufacturing", "Occupational biomechanics"],
    education: ["Ph.D., Mechanical Engineering, Coastal Pines University, 2021", "B.S., Mechanical Engineering, San Aurelio State University, 2015"],
    publications: [
      "Ortega, L., Nakamura, E., & Bishop, T. (2025). A textile-based soft exosuit for lifting assistance in agricultural work. Journal of Wearable Robotics, 6(2), 70–86.",
      "Ortega, L., & Watanabe, K. (2024). Printable pneumatic actuators with embedded strain sensing. Soft Machines Letters, 4(1), 9–15.",
      "Ortega, L. (2021). Muscle-inspired variable stiffness actuators (Doctoral dissertation). Coastal Pines University.",
    ],
    office: "Sequoia Engineering Hall, Room 219",
    officeHours: "Wednesdays 3:00–5:00 p.m.",
    email: "lortega@redwoodstate.example.edu",
    phone: "(707) 555-0116",
    courses: ["Engineering Design and Graphics", "Manufacturing Processes", "Special Topics: Soft Robotics"],
  },
  "denise-carter": {
    bio: "Denise Carter is a scholar of strategic management whose research focuses on how small firms and rural economies adapt when a dominant industry declines. Her long-running study of North Coast communities after the timber downturn has followed more than 200 businesses over two decades, documenting which strategies helped them survive and which did not. Carter joined Redwood State in 2001, chaired the Department of Business Administration from 2012 to 2020, and led the college through its most recent accreditation review. She teaches Strategic Management, the capstone course for all B.B.A. students, as well as an M.B.A. seminar on regional economic development. She serves on the board of the Arcadia Falls Economic Development Council and has consulted for county governments, tribal enterprises and cooperative businesses throughout Northern California.",
    researchInterests: ["Strategic management", "Rural and regional economic development", "Small business resilience", "Cooperative and tribal enterprise"],
    education: ["Ph.D., Business Administration, Eastbrook University, 1999", "M.B.A., Harlow Springs State University, 1993", "B.A., Economics, Bellhaven College, 1990"],
    publications: [
      "Carter, D. (2024). After the mill: Twenty years of small business adaptation on California's North Coast. Journal of Regional Enterprise, 22(1), 1–29.",
      "Carter, D., & Mehta, A. (2021). Credit access and firm survival in timber-dependent counties. Rural Enterprise Economics Review, 14(3), 233–251.",
      "Carter, D., Lowe, P., & Adair, R. (2016). Cooperative conversion as a succession strategy. Cooperative Enterprise Quarterly, 9(2), 67–84.",
      "Carter, D. (2008). Strategic renewal in declining industries. Pacific Management Review, 31(4), 402–425.",
    ],
    office: "Alder Hall, Room 410",
    officeHours: "Tuesdays 3:00–4:30 p.m. and by appointment",
    email: "dcarter@redwoodstate.example.edu",
    phone: "(707) 555-0117",
    courses: ["Strategic Management", "M.B.A. Seminar in Regional Economic Development"],
  },
  "arjun-mehta": {
    bio: "Arjun Mehta teaches and researches corporate finance and financial technology, with an emphasis on community banks and credit unions. His work examines how small lenders adopt digital tools, how fintech competition affects lending in rural markets, and how financial literacy programs change borrowing behavior. Mehta joined Redwood State in 2016 after working as a credit risk analyst. He manages the Owl Investment Fund, a student-run portfolio of roughly $400,000 endowed by alumni, and advises the Finance and Investment Club. He teaches Financial Management, Investments and the M.B.A. core course in corporate finance. He is a frequent speaker at regional credit union conferences. Each spring he leads a free tax preparation clinic in which business students, trained and supervised by volunteer accountants, help low-income Arcadia Falls households file their returns. He also serves on the university's Investment Advisory Committee.",
    researchInterests: ["Corporate finance", "Financial technology and small lenders", "Household finance and financial literacy", "Rural credit markets"],
    education: ["Ph.D., Finance, Prairie Crest University, 2014", "M.B.A., Western India Institute of Management (India), 2008", "B.Com., Seaview University (India), 2006"],
    publications: [
      "Mehta, A., & Rios, C. (2025). Digital lending adoption among rural credit unions. Journal of Community Banking, 11(2), 88–112.",
      "Carter, D., & Mehta, A. (2021). Credit access and firm survival in timber-dependent counties. Rural Enterprise Economics Review, 14(3), 233–251.",
      "Mehta, A. (2019). Does financial literacy training reduce payday borrowing? Evidence from a field experiment. Household Finance Quarterly, 6(1), 15–39.",
    ],
    office: "Alder Hall, Room 415",
    officeHours: "Mondays and Wednesdays 2:00–3:00 p.m.",
    email: "amehta@redwoodstate.example.edu",
    phone: "(707) 555-0118",
    courses: ["Financial Management", "Investments", "Corporate Finance (M.B.A.)", "Student Managed Investment Fund"],
  },
  "hannah-lindqvist": {
    bio: "Hannah Lindqvist is a Lecturer in Business Administration specializing in marketing and entrepreneurship. Prior to joining RSU in 2017 she spent twelve years in brand management for outdoor apparel and consumer goods companies in the Pacific Northwest. At Redwood State she teaches Principles of Marketing, Consumer Behavior and New Venture Creation, and she coordinates the annual Owl Tank business pitch competition, which awards seed funding to student-led startups. She also serves as faculty liaison to the Small Business Development Center and supervises student consulting projects for local businesses. Her interests include experiential learning, social entrepreneurship and the marketing of sustainable products. Hannah is currently developing a new course on digital marketing analytics, which is expected to be offered beginning Fall 2019.",
    researchInterests: ["Brand management", "Entrepreneurship education", "Sustainable product marketing", "Experiential learning"],
    education: ["M.B.A., Northgate University, 2005", "B.A., Communication, Pine Hollow State University, 2001"],
    publications: [
      "Lindqvist, H. (2019). Owl Tank: Building an entrepreneurial pitch competition at a regional university. Entrepreneurial Classroom Quarterly, 4(2), 31–40.",
      "Lindqvist, H., & Carter, D. (2018). Student consulting as community engagement. Western Business Educators Proceedings, 112–118.",
      "Lindqvist, H. (2017). Green claims and brand trust in outdoor apparel. Presented at the Pacific Marketing Educators Conference, Harlow Springs, OR.",
    ],
    office: "Alder Hall, Room 122",
    officeHours: "Fall 2018: Tuesdays and Thursdays 9:30–10:30 a.m.",
    email: "hlindqvist@redwoodstate.example.edu",
    phone: "(707) 555-0119",
    courses: ["Principles of Marketing", "Consumer Behavior", "New Venture Creation"],
    lastUpdated: "Updated Spring 2019",
  },
  "james-oconnell": {
    bio: "James O'Connell teaches nineteenth-century British literature and environmental humanities. His scholarship reads Victorian novels and natural history writing alongside the industrial forestry, mining and shipping records of the same era, asking how literature helped readers imagine, and ignore, the landscapes their economies were consuming. His book, The Timber Sublime: Forests and Empire in Victorian Fiction, won a regional book prize in 2019. O'Connell joined Redwood State in 1998 and has served as director of the University Honors Program and as English department chair. He teaches the British Literature survey, seminars on Dickens and Hardy, and a popular general education course, Literature and the Environment, which includes a field trip to an old-growth grove. He is currently at work on a study of lighthouse keepers' logbooks as literary texts.",
    researchInterests: ["Victorian literature", "Ecocriticism and environmental humanities", "History of the novel", "Maritime and coastal literature"],
    education: ["Ph.D., English, Kingsford University, 1997", "M.A., English, St. Brendan's University (Ireland), 1991", "B.A., English and History, St. Brendan's University (Ireland), 1990"],
    publications: [
      "O'Connell, J. (2019). The Timber Sublime: Forests and Empire in Victorian Fiction. Coastline University Press.",
      "O'Connell, J. (2023). Keeping the light: Logbooks, weather and the lyric of duty. Nineteenth-Century Environments, 7(1), 58–81.",
      "O'Connell, J. (2014). Hardy's woodlanders and the economics of coppice. Studies in Victorian Landscape, 42(3), 311–330.",
      "O'Connell, J. (2006). Dickens and the fog of commerce. The Novel and Commerce, 18(2), 149–168.",
    ],
    office: "Spruce Hall, Room 208",
    officeHours: "Mondays and Wednesdays 1:30–2:30 p.m.",
    email: "joconnell@redwoodstate.example.edu",
    phone: "(707) 555-0120",
    courses: ["Survey of British Literature II", "Literature and the Environment", "Seminar: Dickens and Hardy"],
  },
  "amara-nwosu": {
    bio: "Amara Nwosu is a scholar of African and African diaspora literatures whose work traces how contemporary novelists write about migration, language and inheritance. Her first book, Mother Tongues: Language and Belonging in the New Nigerian Novel, examines code-switching and translation in fiction written across Nigeria, Britain and the United States. Her current project looks at family archives, letters and voice notes as literary forms. Nwosu joined the English department in 2016 and coordinates the minor in Ethnic and Global Literatures. She teaches courses in world literature, postcolonial theory and the African novel, as well as a writing-intensive seminar on literary research. She directs the department's visiting writers series and has brought more than two dozen poets and novelists to campus for readings open to the Arcadia Falls community.",
    researchInterests: ["African and African diaspora literature", "Postcolonial theory", "Multilingualism and translation in fiction", "Archives and life writing"],
    education: ["Ph.D., Comparative Literature, University of Westmere, 2015", "M.A., English, Western Hills University (Nigeria), 2009", "B.A., English, Eastern Highlands University (Nigeria), 2006"],
    publications: [
      "Nwosu, A. (2022). Mother Tongues: Language and Belonging in the New Nigerian Novel. Meridian Academic Press.",
      "Nwosu, A. (2025). Voice notes as epistolary form in diaspora fiction. Journal of Contemporary African Letters, 14(1), 22–47.",
      "Nwosu, A. (2019). Untranslated: Pidgin and the refusal of the glossary. Borderless Letters, 11(2), 101–120.",
    ],
    office: "Spruce Hall, Room 214",
    officeHours: "Tuesdays 10:00 a.m.–12:00 p.m.",
    email: "anwosu@redwoodstate.example.edu",
    phone: "(707) 555-0121",
    courses: ["World Literature", "The African Novel", "Introduction to Literary Research"],
  },
  "grace-yamamoto": {
    bio: "Grace Yamamoto is a poet and essayist who teaches creative writing at Redwood State. Her debut collection, Tidewrack, won the Western Poetry First Book Award and was praised for its attention to the working coastline, from crab boats and canneries to the family stories her grandparents carried home from wartime incarceration. Her poems and essays have appeared in literary journals across the country. Yamamoto joined RSU in 2022 and serves as faculty editor of Understory, the university's student literary magazine, and coordinates the Creative Writing concentration. She teaches introductory and advanced poetry workshops, a hybrid forms course and Writing Place, a class that sends students into the Arcadia Falls community to interview residents and write from what they hear. She is at work on a book of essays about fog.",
    researchInterests: ["Poetry and poetics", "Creative nonfiction and the lyric essay", "Japanese American memory and literature", "Place-based writing pedagogy"],
    education: ["M.F.A., Creative Writing (Poetry), Eastbrook University, 2017", "B.A., English, Kestrel Bay University, 2013"],
    publications: [
      "Yamamoto, G. (2021). Tidewrack: Poems. Salt Marsh Editions.",
      "Yamamoto, G. (2024). “Notes on Fog.” The Driftwood Review, 38(2), 14–29.",
      "Yamamoto, G. (2023). “Cannery Hours” and “Inventory, Barrack 14.” Northern Lights Quarterly, 61, 45–48.",
    ],
    office: "Spruce Hall, Room 221",
    officeHours: "Wednesdays 11:00 a.m.–1:00 p.m.",
    email: "gyamamoto@redwoodstate.example.edu",
    phone: "(707) 555-0122",
    courses: ["Introduction to Creative Writing", "Advanced Poetry Workshop", "Writing Place"],
  },
  "harold-mensah": {
    bio: "Harold Mensah taught United States and California history at Redwood State for thirty-four years before retiring in 2021. His research on the labor history of the redwood timber industry, and particularly on the Black, Mexican, Finnish and Indigenous workers whose stories were missing from company histories, reshaped how the region understands its own past. He founded the Arcadia Falls Oral History Project in 1994, recording more than 600 interviews with mill workers, loggers, cooks and their families, and his book Sawdust and Solidarity remains a standard text on Western timber labor. As Professor Emeritus, Mensah continues to work with the Sequoia Library's Special Collections, where he served as senior advisor on the digitization of the Arcadia Falls logging records. He occasionally guest lectures in the department's public history courses and remains, by his own description, “unretired in every way that counts.”",
    researchInterests: ["Labor history of the American West", "Timber industry and company towns", "Oral history methods", "California history"],
    education: ["Ph.D., History, Lakemont University, 1986", "M.A., History, St. Adrian's College, 1980", "B.A., History, Harmattan University (Ghana), 1977"],
    publications: [
      "Mensah, H. (2003). Sawdust and Solidarity: Workers, Race and the Redwood Timber Industry, 1880–1960. Coastline University Press.",
      "Mensah, H. (2012). Listening to the mill: Three decades of oral history on the North Coast. Pacific Journal of Oral History, 29(1), 5–31.",
      "Mensah, H. (1995). Company towns and the color line in the Pacific lumber trade. Journal of Western Timber History, 64(3), 377–402.",
      "Mensah, H., & Ruiz, C. (2020). Voices from the woods: An annotated guide to the Arcadia Falls Oral History Project. Sequoia Library Special Collections.",
    ],
    office: "Sequoia Library, Special Collections, Room 3B (emeritus office)",
    officeHours: "By appointment",
    email: "hmensah@redwoodstate.example.edu",
    phone: "(707) 555-0123",
  },
  "carmen-ruiz": {
    bio: "Carmen Ruiz is a historian of migration, agricultural labor and public memory in California and the U.S.–Mexico borderlands. Her research follows families who moved between central Mexico, California's inland farm valleys and the North Coast over the twentieth century, working in orchards, canneries and lumber camps. Her book, Seasons of Return, draws on family papers and interviews to show how migrants built lasting communities out of seasonal work. Ruiz joined Redwood State in 2014 and directs the Public History program, where students curate exhibits, record oral histories and work with local museums. She was the faculty lead on the Sequoia Library's project to digitize a century of Arcadia Falls logging records and trained the student archivists who scanned and described them. She teaches Latin American history, the history of California, and methods courses in public and digital history.",
    researchInterests: ["Migration and agricultural labor history", "U.S.–Mexico borderlands", "Public history and community archives", "Oral history"],
    education: ["Ph.D., History, Santa Lucerna University, 2012", "B.A., History and Chicana/o Studies, Meridian State University, 2005"],
    publications: [
      "Ruiz, C. (2020). Seasons of Return: Mexican Families and Migrant Labor in California, 1920–1980. Valley Oak Press.",
      "Ruiz, C. (2025). Payroll as archive: Reading timber company ledgers for workers' lives. Journal of Public History Practice, 9(2), 64–88.",
      "Mensah, H., & Ruiz, C. (2020). Voices from the woods: An annotated guide to the Arcadia Falls Oral History Project. Sequoia Library Special Collections.",
      "Ruiz, C. (2016). Cannery women and the politics of the shift. Western Labor History Review, 33(1), 40–63.",
    ],
    office: "Spruce Hall, Room 305",
    officeHours: "Tuesdays and Thursdays 2:00–3:00 p.m.",
    email: "cruiz@redwoodstate.example.edu",
    phone: "(707) 555-0124",
    courses: ["History of California", "Modern Latin America", "Introduction to Public History", "Digital History Methods"],
  },
  "william-tran": {
    bio: "William Tran is a historian of the Cold War and the Southeast Asian diaspora in the United States. His research uses refugee resettlement records, community newspapers and oral histories to understand how Vietnamese, Hmong, Lao and Cambodian families rebuilt their lives in small American cities after 1975, including several that settled along California's North Coast. He also works in digital humanities, building interactive maps and searchable collections from community archives. Tran joined Redwood State in 2022. He teaches U.S. History since 1945, the Vietnam War in History and Memory, and Asian American History, and he co-advises the Asian Pacific Islander Student Alliance. He is completing a book manuscript titled Resettled: Refugee Families and the Making of the Small-Town Pacific. He welcomes students interested in oral history and digital mapping to join his research team.",
    researchInterests: ["Cold War and U.S. foreign relations", "Southeast Asian American history", "Refugee resettlement", "Digital humanities and mapping"],
    education: ["Ph.D., History, University of Mirador Heights, 2021", "B.A., History, Ridgeport State University, 2014"],
    publications: [
      "Tran, W. (2024). Sponsors and strangers: Church networks and refugee resettlement in rural California, 1975–1985. Pacific Diaspora History, 17(2), 133–159.",
      "Tran, W. (2023). Mapping resettlement: A digital atlas of Southeast Asian refugee communities. Digital History Review, 8(1), 77–92.",
      "Tran, W. (2021). Resettled: Refugee families and the small-town Pacific, 1975–1995 (Doctoral dissertation). University of Mirador Heights.",
    ],
    office: "Spruce Hall, Room 311",
    officeHours: "Mondays 10:00 a.m.–12:00 p.m.",
    email: "wtran@redwoodstate.example.edu",
    phone: "(707) 555-0125",
    courses: ["U.S. History Since 1945", "The Vietnam War in History and Memory", "Asian American History"],
  },
  "olga-petrova": {
    bio: "Olga Petrova is a mathematician working in applied and computational topology. Her research develops tools from topological data analysis, particularly persistent homology, to find structure in noisy, high-dimensional data, and she has collaborated with ecologists, neuroscientists and materials scientists on problems ranging from the branching of tree canopies to the pore structure of soils. Petrova joined Redwood State in 2006 and served as chair of the Department of Mathematics from 2017 to 2023. She teaches Abstract Algebra, Topology and the capstone seminar for mathematics majors, and she has supervised more than forty undergraduate research projects. She founded the RSU Math Circle, a free Saturday program that brings middle and high school students from across the county to campus for problem solving. She is a past recipient of the university's Excellence in Teaching Award.",
    researchInterests: ["Applied and computational topology", "Topological data analysis", "Mathematical approaches to branching structures", "Mathematics outreach"],
    education: ["Ph.D., Mathematics, Eastbrook University, 2004", "Diploma (M.S. equivalent), Mathematics, White Nights State University (Russia), 1998"],
    publications: [
      "Petrova, O., & Santos, M. (2024). Persistent homology of redwood crown architecture. Annals of Applied Topology, 6(2), 115–138.",
      "Petrova, O., Liang, J., & Duarte, F. (2020). Stability of persistence diagrams under sampling noise. Topological Methods Letters, 12(4), 201–219.",
      "Petrova, O. (2015). Undergraduate research in topology: A practical guide. Notices of the Pacific Mathematical Society, 22(3), 30–36.",
    ],
    office: "Tanoak Hall, Room 402",
    officeHours: "Tuesdays and Thursdays 10:00–11:00 a.m.",
    email: "opetrova@redwoodstate.example.edu",
    phone: "(707) 555-0126",
    courses: ["Abstract Algebra", "Topology", "Senior Seminar in Mathematics"],
  },
  "samuel-adeyemi": {
    bio: "Samuel Adeyemi uses differential equations and stochastic models to study how populations grow, compete and spread disease. His recent work models salmon population dynamics in North Coast rivers under changing streamflow, and the transmission of respiratory infections in rural communities with limited health care access. He collaborates regularly with faculty in Biology and Nursing and with county public health staff. Adeyemi joined Redwood State in 2015 and coordinates the applied mathematics concentration. He teaches Calculus III, Differential Equations and Mathematical Modeling, a project-based course in which students build models for real problems brought by community partners. He is committed to widening participation in mathematics and co-directs the department's peer-led calculus workshops, which have measurably improved pass rates in first-year calculus.",
    researchInterests: ["Mathematical biology", "Epidemic modeling", "Population dynamics of anadromous fish", "Differential equations"],
    education: ["Ph.D., Applied Mathematics, Desert Ridge University, 2013", "M.Sc., Mathematics, Lagoon City University (Nigeria), 2008", "B.Sc., Mathematics, Savanna State University (Nigeria), 2005"],
    publications: [
      "Adeyemi, S., Park, E., & Morales, T. (2025). Streamflow-dependent recruitment in a coho salmon population model. Journal of Theoretical Fisheries Ecology, 12(4), 201–219.",
      "Adeyemi, S., & Harjo, M. (2022). Modeling influenza transmission in rural communities with limited clinic access. Journal of Rural Health Modeling, 5(1), 1–18.",
      "Adeyemi, S. (2018). Peer-led workshops and success in first-year calculus. Calculus Teaching Quarterly, 28(6), 54–66.",
    ],
    office: "Tanoak Hall, Room 408",
    officeHours: "Mondays, Wednesdays and Fridays 9:00–10:00 a.m.",
    email: "sadeyemi@redwoodstate.example.edu",
    phone: "(707) 555-0127",
    courses: ["Calculus III", "Differential Equations", "Mathematical Modeling"],
  },
  "lauren-fischer": {
    bio: "Lauren Fischer works in probability and combinatorics, studying random structures such as random graphs, random walks and random permutations, and asking what they look like when they get very large. She also has a strong interest in how students learn to reason about uncertainty, and has published on the use of simulation in introductory statistics. Fischer joined Redwood State in 2023 after a postdoctoral position in mathematics. She teaches Introduction to Probability, Discrete Mathematics and Elementary Statistics, and she has redesigned the statistics sequence around real datasets collected by RSU students and faculty, including tide pool temperature records and campus sleep surveys. She advises the Math Club and organizes Pi(e) Day, which she describes as the department's most important annual event.",
    researchInterests: ["Probability theory", "Random graphs and combinatorics", "Statistics education", "Simulation-based inference"],
    education: ["Ph.D., Mathematics, Tamarack University, 2021", "B.A., Mathematics, Calloway College, 2015"],
    publications: [
      "Fischer, L. (2025). Cycle structure of random permutations with restricted positions. Pacific Journal of Discrete Probability, 30, 1–24.",
      "Fischer, L., & Grant, H. (2023). Local limits of preferential attachment graphs with aging. Letters on Random Graphs, 9(2), 88–103.",
      "Fischer, L. (2024). Teaching inference with local data: A simulation-first introductory statistics course. Journal of Statistics Teaching, 32(1), 15–27.",
    ],
    office: "Tanoak Hall, Room 413",
    officeHours: "Wednesdays 1:00–3:00 p.m.",
    email: "lfischer@redwoodstate.example.edu",
    phone: "(707) 555-0128",
    courses: ["Elementary Statistics", "Discrete Mathematics", "Introduction to Probability"],
  },
  "miguel-santos": {
    bio: "Miguel Santos is a forest ecologist who has spent more than two decades climbing into the crowns of the tallest trees on Earth. His research examines how old-growth coast redwood canopies store carbon and water, host communities of epiphytes, soils and invertebrates found nowhere on the forest floor, and respond to drought and declining coastal fog. In 2026 his team published a study showing that redwood canopies hold substantially more carbon than standard models predict. Santos joined Redwood State in 2003 and directs the Canopy Ecology Lab and the university's field station at Tanoak Creek. He teaches Forest Ecology, General Ecology and a summer field course in canopy research methods, and has trained hundreds of students in technical tree climbing. He is a fellow of the Pacific Ecological Society.",
    researchInterests: ["Forest canopy ecology", "Carbon storage in old-growth forests", "Coast redwood physiology and fog", "Epiphyte communities"],
    education: ["Ph.D., Ecology, Meridian State University, 2001", "B.S., Biological Sciences, Southern Highlands University (Brazil), 1994"],
    publications: [
      "Santos, M., Begay, N., Whitcombe, R., & Petrova, O. (2026). Aboveground carbon in old-growth coast redwood canopies exceeds allometric predictions. Pacific Journal of Forest Carbon, 14(3), 201–224.",
      "Santos, M., & Watanabe, K. (2022). Autonomous placement of microclimate sensors in tall forest canopies. Proceedings of the International Symposium on Environmental Robotics, 45–53.",
      "Santos, M. (2017). Fog drip, drought and crown dieback in coast redwood. Pacific Forest Ecology, 41(2), 88–109.",
      "Santos, M., Lund, K., & Ibarra, P. (2010). Canopy soils as habitat: Invertebrate diversity in redwood crowns. Journal of Arboreal Ecology, 3(1), 12–31.",
    ],
    office: "Canopy Science Center, Room 230",
    officeHours: "Thursdays 1:00–3:00 p.m.",
    email: "msantos@redwoodstate.example.edu",
    phone: "(707) 555-0129",
    courses: ["General Ecology", "Forest Ecology", "Field Methods in Canopy Research"],
  },
  "naomi-begay": {
    bio: "Naomi Begay is a marine ecologist who studies how intertidal communities respond to warming seas and marine heatwaves. Since 2012 she and her students have monitored a network of tide pools along the Arcadia coast, logging water temperatures every fifteen minutes and surveying sea stars, mussels, anemones and algae each month at low tide. That long-term record has become one of the most detailed of its kind on the North Coast. Begay joined Redwood State in 2012 and coordinates the marine biology concentration. She teaches Marine Biology, Invertebrate Zoology and a field course in intertidal ecology, and she leads outreach programs that bring K–12 students and tribal youth to the shore. She is Native American and a strong advocate for Indigenous students in the sciences, and she serves as faculty advisor to the RSU Indigenous and Latinx Scientists Alliance.",
    researchInterests: ["Intertidal ecology", "Marine heatwaves and climate change", "Sea star wasting and recovery", "Long-term ecological monitoring"],
    education: ["Ph.D., Marine Biology, Cascade Coast University, 2010", "B.S., Biology, Desert Ridge University, 2003"],
    publications: [
      "Begay, N., Park, E., & Soto, A. (2026). Fourteen years of tide pool temperatures reveal accelerating warming on the North Coast. Annals of Coastal Ecology, 9(2), 67–90.",
      "Begay, N., & Ferris, L. (2021). Recovery trajectories of ochre sea stars after wasting disease. Intertidal Ecology Letters, 14(1), 31–44.",
      "Begay, N. (2016). Thermal stress and mussel bed structure in northern California. Annals of Rocky Shore Biology, 22(3), 150–167.",
    ],
    office: "Canopy Science Center, Room 244",
    officeHours: "Mondays 2:00–4:00 p.m. (check the tide table; field days take priority)",
    email: "nbegay@redwoodstate.example.edu",
    phone: "(707) 555-0130",
    courses: ["Marine Biology", "Invertebrate Zoology", "Field Course in Intertidal Ecology"],
  },
  "ethan-park": {
    bio: "Ethan Park is a molecular ecologist who reads the environment through DNA. His lab uses environmental DNA (eDNA), the genetic traces that organisms shed into water and soil, to track salmon, lamprey, amphibians and invasive species in North Coast watersheds without catching or handling a single animal. He also collaborates on genomic studies of intertidal invertebrates with the Begay lab. Park joined Redwood State in 2022 after a postdoctoral fellowship in conservation genomics. He teaches Genetics, Molecular Ecology and Bioinformatics for Biologists, and he built the department's first course-based undergraduate research experience in eDNA, in which every student in the class collects, sequences and analyzes their own samples. He works closely with tribal natural resource departments and watershed councils on monitoring projects.",
    researchInterests: ["Environmental DNA (eDNA) monitoring", "Conservation genomics of salmonids", "Molecular ecology", "Course-based undergraduate research"],
    education: ["Ph.D., Biology, Kestrel University (Canada), 2019", "B.S., Molecular Biology, Coastal Pines University, 2013"],
    publications: [
      "Park, E., Moreland, T., & Harjo, J. (2025). eDNA detection of coho salmon in small coastal streams: Seasonal sensitivity and sampling design. Freshwater Genetics, 18(1), 5–21.",
      "Begay, N., Park, E., & Soto, A. (2026). Fourteen years of tide pool temperatures reveal accelerating warming on the North Coast. Annals of Coastal Ecology, 9(2), 67–90.",
      "Park, E. (2023). A course-based eDNA research experience for introductory biology. Journal of Undergraduate Biology Education, 24(3), 210–222.",
    ],
    office: "Canopy Science Center, Room 251",
    officeHours: "Tuesdays 3:00–5:00 p.m.",
    email: "epark@redwoodstate.example.edu",
    phone: "(707) 555-0131",
    courses: ["Genetics", "Molecular Ecology", "Bioinformatics for Biologists"],
  },
  "fatima-haddad": {
    bio: "Fatima Haddad is a synthetic and green chemist who designs safer solvents and catalysts for chemical manufacturing. Much of the chemical industry still relies on solvents that are toxic, flammable or derived from petroleum; Haddad's lab develops alternatives from renewable feedstocks, including byproducts of the regional timber and agricultural industries. In 2026 her group received a $2.4 million federal grant, the largest single research award in the history of the Chemistry department, to scale up and test bio-based solvents with industry partners. Haddad joined Redwood State in 2008 and chairs the Department of Chemistry. She teaches Organic Chemistry and Green Chemistry, and has overhauled the organic teaching labs to reduce hazardous waste by more than half. She mentors many first-generation students and has supervised more than sixty undergraduate researchers.",
    researchInterests: ["Green and sustainable chemistry", "Bio-based solvents", "Homogeneous catalysis", "Waste reduction in teaching laboratories"],
    education: ["Ph.D., Chemistry, Prairie Crest University, 2005", "B.S., Chemistry, Cedar Coast University (Lebanon), 1999"],
    publications: [
      "Haddad, F., Brooks, D., & Lin, S. (2025). Lignin-derived cyclic ethers as replacement solvents for amide couplings. Green Synthesis Letters, 20(4), 512–523.",
      "Haddad, F., & Ochoa, R. (2021). Redesigning the organic teaching laboratory for waste minimization. Teaching Laboratory Chemistry, 14(7), 221–229.",
      "Haddad, F. (2017). Iron catalysts for transfer hydrogenation in renewable solvents. Catalysis in Renewable Media, 9(2), 330–341.",
      "Haddad, F., Kerr, J., & Abboud, L. (2012). Solvent selection guides: A critical comparison. Chemical Process Sustainability, 4(1), 17–34.",
    ],
    office: "Canopy Science Center, Room 310",
    officeHours: "Wednesdays 10:00 a.m.–12:00 p.m.",
    email: "fhaddad@redwoodstate.example.edu",
    phone: "(707) 555-0132",
    courses: ["Organic Chemistry I & II", "Green Chemistry"],
  },
  "daniel-brooks": {
    bio: "Daniel Brooks is an analytical chemist who develops methods for measuring very small amounts of chemicals in complicated samples such as river water, soil and smoke. His lab uses mass spectrometry and portable spectroscopic sensors to detect pesticides, pharmaceuticals and wildfire byproducts in North Coast watersheds. He is a co-investigator on the department's green solvents grant, responsible for analytical testing of solvent purity and environmental fate. Brooks joined Redwood State in 2013 and manages the department's Instrumentation Center, which serves researchers across the College of Science and local agencies. He teaches Quantitative Analysis, Instrumental Analysis and Environmental Chemistry. He is known for a standing offer to any student who can find a problem with a calibration curve that he has not already found.",
    researchInterests: ["Analytical and environmental chemistry", "Mass spectrometry", "Field-portable sensors", "Contaminants in coastal watersheds"],
    education: ["Ph.D., Analytical Chemistry, Lakemont University, 2010", "B.S., Chemistry, Bellhaven College, 2004"],
    publications: [
      "Brooks, D., Sato, Y., & Keene, M. (2024). Levoglucosan and PAHs in residential indoor air during wildfire smoke events. Environmental Analytical Letters, 16(3), 144–157.",
      "Haddad, F., Brooks, D., & Lin, S. (2025). Lignin-derived cyclic ethers as replacement solvents for amide couplings. Green Synthesis Letters, 20(4), 512–523.",
      "Brooks, D. (2019). Passive samplers for pesticide monitoring in small agricultural streams. Journal of Water Chemistry Methods, 11(1), 60–74.",
    ],
    office: "Canopy Science Center, Room 318",
    officeHours: "Mondays and Thursdays 3:00–4:00 p.m.",
    email: "dbrooks@redwoodstate.example.edu",
    phone: "(707) 555-0133",
    courses: ["Quantitative Analysis", "Instrumental Analysis", "Environmental Chemistry"],
  },
  "yuki-sato": {
    bio: "Yuki Sato is an atmospheric chemist who studies the tiny particles, or aerosols, that make up wildfire smoke and coastal fog. Her research asks how smoke particles change chemically as they age and travel, how they interact with marine fog, and what that means for air quality and human health on the North Coast. She works closely with the Computer Science department's North Coast Smoke Mapping project, calibrating its low-cost sensors against reference instruments in her lab. Sato joined Redwood State in 2023 after a postdoctoral appointment at a national atmospheric research laboratory. She teaches General Chemistry and Atmospheric Chemistry and is developing a course on air quality and environmental justice. She co-organizes the College of Science's weekly research seminar and serves on the county's wildfire smoke advisory group.",
    researchInterests: ["Atmospheric chemistry and aerosols", "Wildfire smoke aging and health", "Fog–aerosol interactions", "Low-cost sensor calibration"],
    education: ["Ph.D., Atmospheric Chemistry, Western Summit University, 2020", "B.S., Chemistry, Old Capital University (Japan), 2014"],
    publications: [
      "Sato, Y., Kowalski, S., & Grier, A. (2026). Humidity correction of low-cost optical particle sensors in a marine fog environment. Journal of Coastal Air Quality, 19(2), 77–91.",
      "Brooks, D., Sato, Y., & Keene, M. (2024). Levoglucosan and PAHs in residential indoor air during wildfire smoke events. Environmental Analytical Letters, 16(3), 144–157.",
      "Sato, Y. (2021). Photochemical aging of brown carbon in transported wildfire plumes. Journal of Atmospheric Aerosol Research, 34(5), 612–630.",
    ],
    office: "Canopy Science Center, Room 322",
    officeHours: "Tuesdays 11:00 a.m.–1:00 p.m.",
    email: "ysato@redwoodstate.example.edu",
    phone: "(707) 555-0134",
    courses: ["General Chemistry I", "Atmospheric Chemistry"],
  },
  "rebecca-stein": {
    bio: "Rebecca Stein is a cognitive psychologist who studies memory across the lifespan, with a focus on how healthy older adults remember what they intend to do, from taking medication on time to showing up for appointments. Her lab combines laboratory experiments with smartphone-based studies that follow participants through their everyday lives. Stein joined Redwood State in 2002 and has served as chair of the Department of Psychology and as president of the Faculty Senate. She teaches Cognitive Psychology, Research Methods and Statistics, and a senior seminar on memory and aging. She directs the department's honors thesis program and has mentored dozens of students who have gone on to graduate programs in psychology, neuroscience, social work and medicine. She is a fellow of the Western Society for Cognitive Science.",
    researchInterests: ["Prospective memory", "Cognitive aging", "Everyday memory and technology", "Research methods and replication"],
    education: ["Ph.D., Cognitive Psychology, Coastal Pines University, 2000", "B.A., Psychology, St. Adrian's College, 1994"],
    publications: [
      "Stein, R., Osei, P., & Marsh, L. (2025). Smartphone reminders and prospective memory in adults over 70: A 12-week field study. Journal of Memory and Everyday Cognition, 13(2), 99–118.",
      "Stein, R. (2019). Remembering to remember: Intentions, cues and aging. Advances in Applied Cognition, 7, 211–236.",
      "Stein, R., & Asante, K. (2016). Sleep quality and prospective memory in older adults. Aging and Cognition Letters, 5(4), 301–309.",
      "Stein, R., Ward, J., & Lim, C. (2009). Event-based versus time-based intentions in the laboratory and in daily life. Memory Research Quarterly, 17(1), 44–62.",
    ],
    office: "Huckleberry Hall, Room 330",
    officeHours: "Mondays and Wednesdays 11:00 a.m.–12:00 p.m.",
    email: "rstein@redwoodstate.example.edu",
    phone: "(707) 555-0135",
    courses: ["Cognitive Psychology", "Research Methods and Statistics", "Senior Seminar: Memory and Aging"],
  },
  "kwame-asante": {
    bio: "Kwame Asante is a health psychologist who studies sleep, circadian rhythms and their effects on learning, mood and wellbeing. His lab uses wrist-worn activity monitors, sleep diaries and daily surveys to understand how college students actually sleep and what institutions can do about it. In 2026 he led a widely covered study showing that RSU students slept longer and reported better mood after the university moved its earliest class start time from 8:00 to 8:30 a.m. Asante joined Redwood State in 2014. He teaches Health Psychology, Biological Psychology and a popular general education course, The Science of Sleep. He works closely with the Student Health and Counseling Center on campus wellness programming and helps organize Student Wellness Week each fall.",
    researchInterests: ["Sleep and circadian rhythms", "Health psychology", "Student wellbeing and academic performance", "Behavioral interventions"],
    education: ["Ph.D., Psychology, Kingsford University, 2012", "M.Phil., Psychology, Coastal Savanna University (Ghana), 2007", "B.A., Psychology, Harmattan University (Ghana), 2005"],
    publications: [
      "Asante, K., Moreno, I., & Chen, D. (2026). Later first-class start times and actigraphic sleep in university students: A natural experiment. Journal of Sleep and Student Health, 8(3), 145–162.",
      "Asante, K. (2021). Social jetlag and grades in first-year college students. Chronobiology in Education, 3(1), 22–38.",
      "Stein, R., & Asante, K. (2016). Sleep quality and prospective memory in older adults. Aging and Cognition Letters, 5(4), 301–309.",
    ],
    office: "Huckleberry Hall, Room 336",
    officeHours: "Tuesdays and Thursdays 1:00–2:00 p.m.",
    email: "kasante@redwoodstate.example.edu",
    phone: "(707) 555-0136",
    courses: ["Health Psychology", "Biological Psychology", "The Science of Sleep"],
  },
  "isabel-moreno": {
    bio: "Isabel Moreno is a developmental psychologist who studies how young children learn language and self-regulation in bilingual homes and classrooms. Her research, conducted in partnership with preschools and family resource centers in Arcadia Falls and surrounding communities, examines how switching between Spanish and English shapes attention, vocabulary and early literacy. Moreno joined Redwood State in 2022. She teaches Child Development, Developmental Psychology and Language Development, and runs the Growing Minds Lab, where undergraduate research assistants learn to conduct child-friendly studies and to communicate findings back to families. She also collaborated on the department's 2026 study of class start times and student sleep. A first-generation college graduate, Moreno is a faculty mentor with the First-Generation Scholars Program and speaks regularly with families about bilingual parenting.",
    researchInterests: ["Bilingual language development", "Executive function in early childhood", "Community-engaged developmental research", "Family and school partnerships"],
    education: ["Ph.D., Developmental Psychology, Santa Lucerna University, 2020", "B.A., Psychology, Ridgeport State University, 2014"],
    publications: [
      "Moreno, I., Alcalá, R., & Tsai, M. (2025). Language switching and attentional control in Spanish–English bilingual preschoolers. Bilingual Childhood Studies, 22(1), 50–71.",
      "Asante, K., Moreno, I., & Chen, D. (2026). Later first-class start times and actigraphic sleep in university students: A natural experiment. Journal of Sleep and Student Health, 8(3), 145–162.",
      "Moreno, I. (2022). Sharing results with families: Practices for community-engaged developmental science. Developmental Research in Practice, 4(2), 12–19.",
    ],
    office: "Huckleberry Hall, Room 342",
    officeHours: "Wednesdays 2:00–4:00 p.m.",
    email: "imoreno@redwoodstate.example.edu",
    phone: "(707) 555-0137",
    courses: ["Child Development", "Developmental Psychology", "Language Development"],
  },
  "patricia-nguyen": {
    bio: "Patricia Nguyen is Professor and Director of the School of Nursing at Redwood State. A board-certified family nurse practitioner, she practiced for fifteen years in rural and community clinics before joining the faculty in 2010. Her scholarship focuses on simulation-based nursing education, clinical judgment and the recruitment and retention of nurses in rural health systems. Under her leadership the School of Nursing expanded its B.S.N. enrollment by forty percent, launched an RN-to-B.S.N. pathway for working nurses, and in 2026 earned national accreditation for the Nursing Simulation Center in Salal Hall. Nguyen serves on the board of the North Coast Health Workforce Collaborative and chairs the regional nursing education consortium. She continues to see patients one day a month at a community clinic in Arcadia Falls.",
    researchInterests: ["Simulation-based nursing education", "Clinical judgment development", "Rural nursing workforce", "Nursing leadership"],
    education: ["D.N.P., Meridian State University, 2009", "M.S.N., Family Nurse Practitioner, Northgate University, 1998", "B.S.N., Ridgeport State University, 1994"],
    publications: [
      "Nguyen, P., Rahman, A., & Doyle, K. (2025). Simulation hours and clinical judgment in prelicensure nursing students: A multi-site comparison. Journal of Nursing Simulation, 21(2), 60–74.",
      "Nguyen, P. (2022). Growing our own: A regional pipeline for rural nurses. Rural Nursing Today, 17(1), 8–19.",
      "Nguyen, P., & Harjo, M. (2019). Community partnership models for rural clinical placements. Nursing Partnerships Quarterly, 12(3), 155–168.",
    ],
    office: "Salal Hall, Room 100 (School of Nursing Office)",
    officeHours: "Thursdays 9:00–11:00 a.m.; schedule through the Nursing office",
    email: "pnguyen@redwoodstate.example.edu",
    phone: "(707) 555-0138",
    courses: ["Leadership and Management in Nursing", "Professional Nursing Practice"],
  },
  "michael-harjo": {
    bio: "Michael Harjo is a nurse researcher whose work centers on Indigenous community health, chronic disease prevention and culturally grounded care. Native American himself, he spent a decade as a public health nurse in tribal health programs before earning his doctorate. His current research, conducted in partnership with tribal health clinics on the North Coast, evaluates a community health worker model for diabetes prevention that combines traditional foods, family-based education and telehealth follow-up. Harjo joined Redwood State in 2017. He teaches Community and Public Health Nursing, Nursing Research and Evidence-Based Practice, and a cross-listed course on health equity. He is a mentor for Native nursing students and serves on the university's Tribal Relations Advisory Council. He also volunteers at community health fairs across the county.",
    researchInterests: ["Indigenous community health", "Diabetes prevention", "Community-based participatory research", "Health equity in rural populations"],
    education: ["Ph.D., Nursing, Desert Ridge University, 2016", "M.S.N., Public Health Nursing, Red Plains University, 2008", "B.S.N., Red Plains University, 2003"],
    publications: [
      "Harjo, M., Sampson, L., & Two Bears, R. (2025). A community health worker model for diabetes prevention with North Coast tribal clinics: Year two outcomes. Journal of Indigenous Health Nursing, 9(1), 33–52.",
      "Adeyemi, S., & Harjo, M. (2022). Modeling influenza transmission in rural communities with limited clinic access. Journal of Rural Health Modeling, 5(1), 1–18.",
      "Harjo, M. (2020). Relational accountability in nursing research with tribal communities. Advances in Community Health Nursing, 43(2), 120–131.",
    ],
    office: "Salal Hall, Room 214",
    officeHours: "Mondays 1:00–3:00 p.m.",
    email: "mharjo@redwoodstate.example.edu",
    phone: "(707) 555-0139",
    courses: ["Community and Public Health Nursing", "Nursing Research and Evidence-Based Practice", "Health Equity"],
  },
  "aisha-rahman": {
    bio: "Aisha Rahman is a Clinical Assistant Professor and the Simulation Coordinator for the School of Nursing. A registered nurse with twelve years of experience in medical-surgical and intensive care units, she designs and runs the high-fidelity scenarios that B.S.N. students work through in the Nursing Simulation Center, from post-operative complications to rapid response events and end-of-life conversations. She led the self-study that earned the center national accreditation in 2026. Rahman joined Redwood State in 2019. She teaches Adult Health Nursing and the clinical skills lab sequence, and supervises students in their medical-surgical clinical rotations at Port Alder Medical Center. She is a certified healthcare simulation educator and is pursuing a doctorate in nursing practice with a focus on debriefing methods.",
    researchInterests: ["Healthcare simulation and debriefing", "Medical-surgical nursing", "Clinical skill acquisition", "Patient safety"],
    education: ["M.S.N., Nursing Education, Pine Hollow State University, 2017", "B.S.N., St. Adrian's College, 2011"],
    publications: [
      "Nguyen, P., Rahman, A., & Doyle, K. (2025). Simulation hours and clinical judgment in prelicensure nursing students: A multi-site comparison. Journal of Nursing Simulation, 21(2), 60–74.",
      "Rahman, A. (2023). Structured debriefing after rapid response simulations. Simulation Debriefing Quarterly, 15(4), 201–208.",
      "Rahman, A., & Liu, J. (2021). Low-cost task trainers for IV insertion practice. Skills Lab Innovations, 8(2), 44–47.",
    ],
    office: "Salal Hall, Room 120 (Nursing Simulation Center)",
    officeHours: "Tuesdays 8:00–10:00 a.m.",
    email: "arahman@redwoodstate.example.edu",
    phone: "(707) 555-0140",
    courses: ["Adult Health Nursing I", "Clinical Skills Lab", "Medical-Surgical Clinical Practicum"],
  },
};

const leaderDetails: Record<string, LeaderDetails> = {
  "elena-vasquez-hart": {
    bio: "Elena Vásquez-Hart became the fourteenth president of Redwood State University in July 2021. A marine chemist by training, she has spent her career at public universities that serve first-generation and rural students, and she has made access, affordability and completion the center of her presidency. Under her leadership RSU launched Rooted in Place, the university's 2023–2030 strategic plan; expanded the First-Generation Scholars Program; opened Madrone Hall, the first new residence hall on campus in more than thirty years; and raised the four-year graduation rate by eight percentage points. Before coming to Arcadia Falls she served as provost at a regional public university in the Southwest and, earlier, as dean of a college of science. She was the first in her family to attend college, earning her bachelor's degree while working nights as a laboratory technician. Vásquez-Hart serves on the boards of the Port Alder Medical Center and a national association of public colleges. She and her husband, a retired high school music teacher, live in the President's Residence on Canopy Drive with two elderly and opinionated cats. She teaches one section of first-year seminar each fall.",
    office: "Founders Hall, Suite 400",
    email: "president@redwoodstate.example.edu",
    phone: "(707) 555-0101",
    assistant: { name: "Linda Castellano", email: "lcastellano@redwoodstate.example.edu", phone: "(707) 555-0151" },
  },
  "david-okafor": {
    bio: "David Okafor is Provost and Vice President for Academic Affairs, the university's chief academic officer. He oversees the six colleges, the Sequoia Library, the Graduate School, Undergraduate Studies, the Office of the Registrar and academic support programs. Okafor came to Redwood State in 2005 as an assistant professor of economics, and he later served as chair of the Department of Business Administration, associate dean and then dean of the College of Business before being appointed provost in 2020. As provost he led the university through its most recent regional reaccreditation, launched a general education redesign centered on place-based learning, and created the Faculty Success Initiative, which has increased tenure-track hiring for the first time in a decade. His research on the economics of higher education and student debt has been cited in state policy debates. Okafor holds a Ph.D. in economics and continues to teach an undergraduate course in labor economics every other spring. He is an avid distance runner and has completed the Silverfin River Marathon eleven times.",
    office: "Founders Hall, Suite 410",
    email: "provost@redwoodstate.example.edu",
    phone: "(707) 555-0102",
    assistant: { name: "Marisol Ybarra", email: "mybarra@redwoodstate.example.edu", phone: "(707) 555-0152" },
  },
  "mei-lin-chao": {
    bio: "Mei-Lin Chao serves as Vice President for Student Affairs, leading the division responsible for housing and residential life, dining, health and counseling, disability resources, recreation, student conduct, career services and the Rowan Student Union. A student affairs professional for more than twenty-five years, she began her career as a residence hall director and has worked at public universities in California and Washington. Since arriving at Redwood State in 2018, Chao has championed a holistic approach to student success that treats housing, food security and mental health as academic issues. She oversaw the planning and opening of Madrone Hall, expanded the Owl Pantry into a full basic-needs center, and doubled the size of the First-Generation Scholars Program. Chao earned her Ed.D. in higher education leadership with a dissertation on belonging among first-generation Asian American students. She chairs the university's Basic Needs Task Force and co-chairs the Campus Climate Committee. She can often be found at the Owls' Friday night volleyball matches and hosts open office hours for students every Wednesday afternoon.",
    office: "Rowan Student Union, Room 310",
    email: "studentaffairs@redwoodstate.example.edu",
    phone: "(707) 555-0103",
    assistant: { name: "Jordan Pike", email: "jpike@redwoodstate.example.edu", phone: "(707) 555-0153" },
  },
  "robert-haines": {
    bio: "Robert Haines is Vice President for Administration and Finance and the university's chief financial officer. His division includes the Budget Office, Controller, Procurement, Human Resources, Facilities Management, Environmental Health and Safety, University Police, Parking and Transportation Services and Information Technology Services. Haines joined Redwood State in 2012 as associate vice president for budget and was named vice president in 2016. He has guided the university through several difficult state budget cycles while protecting instructional funding, and led the financing and construction of Madrone Hall and the renovation of Sequoia Engineering Hall. He also oversaw the campus's transition to a new financial and HR system. Before entering higher education, Haines spent fourteen years in public finance, including as finance director for a mid-sized California county. He holds an M.B.A. and is a certified public accountant. He serves as treasurer of the RSU Foundation board and chairs the Campus Sustainability Council, which has set a goal of carbon neutrality for campus operations by 2040.",
    office: "Founders Hall, Suite 300",
    email: "vpaf@redwoodstate.example.edu",
    phone: "(707) 555-0104",
    assistant: { name: "Theresa Wong", email: "twong@redwoodstate.example.edu", phone: "(707) 555-0154" },
  },
  "priya-natarajan": {
    bio: "Priya Natarajan is Vice President for Research and Graduate Studies. She leads the Office of Research and Sponsored Programs, research compliance, technology transfer, the Graduate School and the university's field stations. Since her appointment in 2022, external research funding at RSU has grown to a record $31 million per year, supported by major awards in forest carbon science, green chemistry, coastal ecology and rural health. Natarajan has focused on building research infrastructure for a university of Redwood State's size: shared instrumentation, seed grants for early-career faculty, and paid research positions so that students who work to pay for college can still participate in research. She is an environmental engineer whose own research focuses on watershed restoration and water quality, and she spent nine years at a federal research laboratory before moving into university administration. Natarajan holds a Ph.D. in civil and environmental engineering. She chairs the university's Research Council and represents RSU on a statewide consortium for coastal and ocean research. She remains an adjunct professor in Mechanical Engineering.",
    office: "Founders Hall, Suite 220",
    email: "research@redwoodstate.example.edu",
    phone: "(707) 555-0105",
    assistant: { name: "Kevin Albrecht", email: "kalbrecht@redwoodstate.example.edu", phone: "(707) 555-0155" },
  },
  "thomas-harlan": {
    bio: "Thomas Harlan is Vice President for University Advancement and Executive Director of the RSU Foundation. He leads fundraising, alumni relations, and University Communications and Marketing. Harlan joined Redwood State in 2019 and is currently leading Deep Roots, Wide Branches: The Campaign for Redwood State, the most ambitious fundraising effort in the university's history, with a goal of $150 million for scholarships, faculty, research and facilities. Under his leadership annual giving has more than doubled and the number of alumni donors has grown for six consecutive years. A lawyer by training, Harlan practiced nonprofit and tribal law before moving into philanthropy, and he previously led major gifts programs at two public universities in the Pacific Northwest. He is Native American and serves on the board of a national Native American scholarship foundation. Harlan holds a J.D. and a B.A. in political science. He is a frequent presence at alumni gatherings from Arcadia Falls to Westmere and never misses the Homecoming alumni dinner.",
    office: "Advancement Center, 1520 Canopy Drive",
    email: "advancement@redwoodstate.example.edu",
    phone: "(707) 555-0106",
    assistant: { name: "Beth Ann Kilroy", email: "bkilroy@redwoodstate.example.edu", phone: "(707) 555-0156" },
  },
};

export const facultyProfiles: Record<string, FacultyProfile> = Object.fromEntries(
  faculty.map((p) => [
    p.slug,
    { slug: p.slug, name: p.name, title: p.title, department: p.department ?? "", image: `faculty-${p.slug}`, ...facultyDetails[p.slug] },
  ]),
);

export const leadershipBios: Record<string, LeadershipBio> = Object.fromEntries(
  leadership.map((p) => [p.slug, { slug: p.slug, name: p.name, title: p.title, image: `leader-${p.slug}`, ...leaderDetails[p.slug] }]),
);
