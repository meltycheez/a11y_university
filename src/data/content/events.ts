// Event details. Titles and categories come from catalog.ts; this file adds the long-form copy.
// Times are America/Los_Angeles (PDT -07:00 until Nov 1, 2026; PST -08:00 after).
// Image ids point at the image manifest (plan 04).
import { events } from "../catalog";

export interface RegistrationOption { id: string; label: string; price: number }

export interface EventRegistration {
  required: boolean;
  options?: RegistrationOption[];
  /** ISO datetime. */
  deadline?: string;
}

export interface EventDetail {
  slug: string;
  title: string;
  category: string;
  /** ISO datetime with offset. */
  start: string;
  end: string;
  location: string;
  description: string[];
  capacity: number;
  registration: EventRegistration;
  image: string;
  contact: { name: string; email: string; phone?: string };
  accessibilityNote?: string;
}

type EventDetails = Omit<EventDetail, "slug" | "title" | "category" | "image">;

const details: Record<string, EventDetails> = {
  "fall-fest-2026": {
    start: "2026-10-16T16:00:00-07:00",
    end: "2026-10-16T21:00:00-07:00",
    location: "Canopy Green",
    description: [
      "Redwood State's favorite fall tradition is back. Join students, faculty, staff and neighbors on Canopy Green for an evening of live music, food trucks, lawn games, a pumpkin-carving contest and the annual Rowan's Lantern Walk through the campus grove.",
      "The main stage features student bands and the Redwood Chorale from 5:00 to 7:00 p.m., followed by a headlining set from a regional folk-rock band. More than 40 student organizations will host booths with games, crafts and giveaways, and the Owl Pantry will run a cider and cocoa station. Rowan the Redwood Owl will be available for photos from 4:30 to 6:00 p.m.",
      "Food trucks accept cash and card. Each RSU student receives two free food tickets with a valid student ID at the welcome tent while supplies last.",
    ],
    capacity: 3000,
    registration: { required: false },
    contact: { name: "Office of Student Involvement", email: "involvement@redwoodstate.example.edu", phone: "(707) 555-0160" },
    accessibilityNote: "Canopy Green is accessible from the Rowan Student Union plaza via paved paths. An accessible viewing area is located to the left of the main stage. ASL interpretation will be provided for the main stage 5:00–8:00 p.m. To request other accommodations, contact the Office of Student Involvement by October 9.",
  },

  "research-symposium-2026": {
    start: "2026-11-19T09:00:00-08:00",
    end: "2026-11-19T16:00:00-08:00",
    location: "Canopy Science Center, Atrium and Lecture Halls 101–104",
    description: [
      "The Fall Undergraduate Research Symposium showcases original research, scholarship and creative work by Redwood State undergraduates from every college. More than 180 students will present posters, oral presentations and performances covering topics from tide pool warming and wildfire smoke to Victorian novels, soft robotics and bilingual child development.",
      "Poster sessions run in the Canopy Science Center atrium from 9:00 to 11:30 a.m. and 1:30 to 3:30 p.m. Oral presentations take place in Lecture Halls 101–104 throughout the day. The keynote address, at noon in Lecture Hall 101, will be delivered by Priya Natarajan, Ph.D., Vice President for Research and Graduate Studies. Awards will be announced at 3:45 p.m.",
      "Faculty are encouraged to bring classes. The symposium is free and open to the public; attendees do not need to register. Student presenters must submit an abstract through RedwoodConnect by the deadline below and have their faculty mentor's approval.",
    ],
    capacity: 800,
    registration: {
      required: true,
      options: [
        { id: "poster", label: "Student presenter: poster", price: 0 },
        { id: "oral", label: "Student presenter: oral presentation (15 min)", price: 0 },
        { id: "performance", label: "Student presenter: creative work / performance", price: 0 },
        { id: "judge", label: "Faculty or staff judge", price: 0 },
      ],
      deadline: "2026-10-23T23:59:00-07:00",
    },
    contact: { name: "Office of Undergraduate Research", email: "urso@redwoodstate.example.edu", phone: "(707) 555-0161" },
  },

  "homecoming-2026": {
    start: "2026-10-23T09:00:00-07:00",
    end: "2026-10-25T14:00:00-07:00",
    location: "Campus-wide; check-in at the Rowan Student Union",
    description: [
      "Come home to the redwoods. Homecoming & Family Weekend brings alumni, families and friends back to Arcadia Falls for three days of reunions, tours, athletics and celebration.",
      "Friday highlights include open classes, tours of the new Robotics and Autonomous Systems Lab in Sequoia Engineering Hall, the dedication of Madrone Hall at 3:00 p.m. and the Alumni Awards Dinner at 6:30 p.m. in the Rowan Student Union Redwood Ballroom, honoring this year's Distinguished and Young Alumni Award recipients. Saturday begins with the Family Brunch on Canopy Green, followed by the Homecoming Parade down Canopy Drive at 11:00 a.m. and the women's soccer Homecoming match against Klamath Valley at Redwood Field at 1:00 p.m., where the 2009 conference champions will be recognized at halftime. The Owls volleyball team hosts Siskiyou State in Owl Arena at 7:00 p.m.",
      "Sunday closes the weekend with the 50-year and 25-year class reunion breakfasts and a guided walk through the old-growth grove at the Tanoak Creek Field Station.",
      "General admission to most events is free. Tickets are required for the Alumni Awards Dinner and the Family Brunch and must be purchased in advance. A full schedule will be available at check-in.",
    ],
    capacity: 5000,
    registration: {
      required: true,
      options: [
        { id: "general", label: "General weekend registration (free)", price: 0 },
        { id: "family-brunch", label: "Family Brunch, Saturday (per person)", price: 18 },
        { id: "family-brunch-child", label: "Family Brunch, child 12 and under", price: 8 },
        { id: "alumni-dinner", label: "Alumni Awards Dinner, Friday (per person)", price: 45 },
        { id: "reunion-breakfast", label: "Class Reunion Breakfast, Sunday", price: 20 },
      ],
      deadline: "2026-10-16T17:00:00-07:00",
    },
    contact: { name: "Office of Alumni Relations", email: "alumni@redwoodstate.example.edu", phone: "(707) 555-0162" },
    accessibilityNote: "Accessible parking is available in Lots A and C. Golf cart shuttles will run between the Rowan Student Union, Redwood Field and Owl Arena on Saturday. The Tanoak Creek grove walk follows an unpaved trail with steep sections.",
  },

  "career-fair-fall-2026": {
    start: "2026-10-14T10:00:00-07:00",
    end: "2026-10-14T15:00:00-07:00",
    location: "Owl Arena, Main Floor",
    description: [
      "Meet more than 110 employers recruiting for full-time jobs, internships and summer positions. The Fall Career & Internship Fair is open to all RSU students and recent alumni, from first-years exploring options to graduating seniors and graduate students.",
      "Participating organizations include regional health systems, school districts, engineering and technology firms, state and federal agencies, tribal governments, nonprofit organizations and national employers. A searchable list of employers and the positions they are recruiting for is available in the Careers tab of RedwoodConnect.",
      "Career Services recommends dressing in business casual attire and bringing several copies of your résumé. Drop-in résumé reviews are offered in the Career Services office, Rowan Student Union Room 210, every weekday the week before the fair. A free professional clothing closet is available to students by appointment.",
      "Employers: booth registration includes one six-foot table, two chairs, lunch for two representatives and access to the student résumé book. Nonprofit and public agency rates are available.",
    ],
    capacity: 2500,
    registration: {
      required: true,
      options: [
        { id: "student", label: "Student or alumni attendee (free, RSU ID required)", price: 0 },
        { id: "employer", label: "Employer booth", price: 350 },
        { id: "employer-nonprofit", label: "Employer booth: nonprofit, public agency or tribal government", price: 175 },
        { id: "employer-power-cord", label: "Add-on: electrical outlet", price: 40 },
      ],
      deadline: "2026-10-02T17:00:00-07:00",
    },
    contact: { name: "Career Services", email: "careers@redwoodstate.example.edu", phone: "(707) 555-0163" },
  },

  "fall-choral-concert": {
    start: "2026-11-21T19:30:00-08:00",
    end: "2026-11-21T21:15:00-08:00",
    location: "Fern Hollow Recital Hall, Hartwell Fine Arts Center",
    description: [
      "The Redwood Chorale, Redwood State's premier auditioned choir, presents its annual fall concert under the direction of Dr. Stephen Marlowe. This year's program, Songs of Water and Stone, pairs Renaissance motets with contemporary works inspired by rivers, oceans and mountains, including the West Coast premiere of a new piece commissioned from a Northern California composer.",
      "The concert also features the RSU Women's Ensemble and the University Men's Glee Club, and concludes with a combined performance of all three ensembles joined by the RSU Chamber Orchestra.",
      "Doors open at 7:00 p.m. Seating is general admission. Latecomers will be seated between pieces.",
    ],
    capacity: 420,
    registration: {
      required: true,
      options: [
        { id: "general", label: "General admission", price: 15 },
        { id: "senior", label: "Seniors (65+) and RSU faculty/staff", price: 10 },
        { id: "student", label: "Students (any school, with ID)", price: 0 },
      ],
    },
    contact: { name: "Department of Music Box Office", email: "boxoffice@redwoodstate.example.edu", phone: "(707) 555-0164" },
  },

  "faculty-art-exhibition": {
    start: "2026-10-08T17:00:00-07:00",
    end: "2026-12-10T17:00:00-08:00",
    location: "Burl Gallery, Hartwell Fine Arts Center",
    description: [
      "Understory brings together new work by fourteen faculty artists from the Department of Art and Design, spanning painting, printmaking, ceramics, photography, textiles, sculpture and digital media. Taking its title from the layer of forest that grows beneath the redwood canopy, the exhibition explores what flourishes in shade, in the margins and in the spaces between.",
      "An opening reception with the artists will be held Thursday, October 8, from 5:00 to 7:00 p.m., with light refreshments. Gallery talks by participating faculty will take place on selected Thursdays at noon throughout the run of the show.",
      "Gallery hours are Tuesday through Friday, 10:00 a.m. to 5:00 p.m., and Saturday, noon to 4:00 p.m. The gallery is closed November 26–28 for the Thanksgiving holiday. Admission is free.",
    ],
    capacity: 120,
    registration: { required: false },
    contact: { name: "Burl Gallery", email: "gallery@redwoodstate.example.edu" },
  },

  "basketball-home-opener": {
    start: "2026-11-06T19:00:00-08:00",
    end: "2026-11-06T21:00:00-08:00",
    location: "Owl Arena",
    description: [
      "Pack Owl Arena as the Redwood Owls men's basketball team opens its home schedule against longtime rival Cascade State. Led by junior guard Jordan Whitfield and sophomore center Noah Lindgren, the Owls look to start the season strong in front of the home crowd.",
      "It's a Blackout the Arena night: wear black, and the first 1,000 students through the doors receive a free Blackout T-shirt. The Owls Pep Band and Spirit Squad will perform, and Rowan the Redwood Owl will lead a halftime half-court shot contest for a chance to win free textbooks for spring semester.",
      "Doors open at 6:00 p.m. The women's basketball team plays its home opener in the same arena at 4:30 p.m.; a single ticket is good for both games.",
    ],
    capacity: 3200,
    registration: {
      required: true,
      options: [
        { id: "adult", label: "General admission, adult", price: 12 },
        { id: "youth-senior", label: "Youth (K–12) and seniors (65+)", price: 6 },
        { id: "student", label: "RSU students (free with ID; claim online)", price: 0 },
        { id: "reserved", label: "Reserved courtside seat", price: 25 },
      ],
    },
    contact: { name: "Owls Ticket Office", email: "tickets@redwoodstate.example.edu", phone: "(707) 555-0165" },
    accessibilityNote: "Wheelchair-accessible and companion seating is available on the concourse level in sections 102, 108 and 114. Assistive listening devices are available at Guest Services near the main entrance.",
  },

  "admissions-open-house": {
    start: "2026-11-14T09:00:00-08:00",
    end: "2026-11-14T14:00:00-08:00",
    location: "Rowan Student Union, Redwood Ballroom",
    description: [
      "Discover Redwood State at our Fall Admissions Open House for prospective first-year and transfer students and their families. Meet faculty from all six colleges, talk with current students, learn about financial aid and scholarships, and tour campus, including residence halls, the Sequoia Library and the new Robotics and Autonomous Systems Lab.",
      "The day begins with check-in and a welcome from the Office of Admissions at 9:00 a.m., followed by an academic fair, breakout sessions on the admissions process, financial aid, the First-Generation Scholars Program and the honors program, and student-led campus tours departing every 20 minutes. Lunch at the Canopy Commons dining hall is included for registered guests.",
      "Can't make it to Arcadia Falls? A virtual open house will be streamed live from 10:00 to 11:30 a.m. with a presentation from admissions counselors and a live Q&A with current students.",
      "Students who apply for fall 2027 admission by the priority deadline of November 30 will have their application fee waived. Ask about the fee waiver code at check-in.",
    ],
    capacity: 600,
    registration: {
      required: true,
      options: [
        { id: "in-person", label: "In-person visit (includes lunch)", price: 0 },
        { id: "guest", label: "Additional in-person guest", price: 0 },
        { id: "virtual", label: "Virtual open house (livestream)", price: 0 },
      ],
      deadline: "2026-11-10T23:59:00-08:00",
    },
    contact: { name: "Office of Admissions", email: "admissions@redwoodstate.example.edu", phone: "(707) 555-0166" },
  },

  "wellness-week": {
    start: "2026-09-28T09:00:00-07:00",
    end: "2026-10-02T17:00:00-07:00",
    location: "Various locations; hub at the Rowan Student Union Plaza",
    description: [
      "Student Wellness Week is a five-day celebration of physical, mental and social wellbeing, hosted by the Student Health and Counseling Center, Recreation and Wellness, and the Department of Psychology. Each day focuses on a different theme: Move (Monday), Rest (Tuesday), Nourish (Wednesday), Connect (Thursday) and Breathe (Friday).",
      "Highlights include free group fitness classes at the Recreation Center, a sleep science workshop led by Kwame Asante, Ph.D., a cooking demonstration at the Owl Pantry, therapy dogs on Canopy Green, a guided forest bathing walk in the campus grove and free flu shots at the Student Health Center (bring your RedwoodConnect ID).",
      "Students who attend at least three Wellness Week events can enter a prize drawing for a new bicycle, a semester parking permit or a free month of massage therapy at the Recreation Center. Pick up a Wellness Passport at the hub table.",
    ],
    capacity: 1500,
    registration: { required: false },
    contact: { name: "Student Health and Counseling Center", email: "wellness@redwoodstate.example.edu", phone: "(707) 555-0167" },
  },

  "redwood-lecture-climate": {
    start: "2026-10-29T19:00:00-07:00",
    end: "2026-10-29T20:30:00-07:00",
    location: "Canopy Science Center, Lecture Hall 101",
    description: [
      "The Redwood Lecture Series brings leading thinkers to Arcadia Falls to discuss the ideas shaping our region and our world. This fall's lecture, Forests in a Warming World, features Miguel Santos, Ph.D., professor of biology and director of the Canopy Ecology Lab, whose recent research found that old-growth redwood canopies store far more carbon than scientists had estimated.",
      "Drawing on more than twenty years of climbing and measuring the tallest trees on Earth, Santos will discuss what redwood forests can teach us about carbon, fog and climate resilience, and what warming and drought may mean for the forests that define the North Coast. The talk will be followed by a moderated conversation and audience Q&A with Naomi Begay, Ph.D., associate professor of biology.",
      "The lecture is free and open to the public, but seating is limited and registration is required. A reception will follow in the Canopy Science Center atrium. The lecture will be recorded and posted online within two weeks.",
    ],
    capacity: 350,
    registration: {
      required: true,
      options: [
        { id: "general", label: "General admission (free)", price: 0 },
        { id: "reception", label: "General admission plus post-lecture reception (free)", price: 0 },
      ],
      deadline: "2026-10-27T17:00:00-07:00",
    },
    contact: { name: "Office of the Provost, Redwood Lecture Series", email: "redwoodlecture@redwoodstate.example.edu", phone: "(707) 555-0168" },
    accessibilityNote: "Live captioning will be displayed on screen. Lecture Hall 101 has wheelchair seating in the front and rear rows and a hearing loop.",
  },
};

export const eventsContent: Record<string, EventDetail> = Object.fromEntries(
  events.map((s) => [s.slug, { slug: s.slug, title: s.name, category: s.category, image: `event-${s.slug}`, ...details[s.slug] }]),
);
