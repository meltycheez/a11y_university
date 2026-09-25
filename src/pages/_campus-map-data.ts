// Campus map data for /campus-map. Names and uses follow docs/WORLD.md ("Campus buildings") and the
// pageContent["/campus-map"] table; lot letters, locations and permits follow /students/parking.
// Coordinates are in a 1000 × 640 map space (north up). The map is not to scale.

export const MAP_W = 1000;
export const MAP_H = 640;

export type Category = "academic" | "housing" | "student-life" | "athletics" | "services";

export const categories: { value: Category; label: string }[] = [
  { value: "academic", label: "Academic buildings" },
  { value: "housing", label: "Residence halls" },
  { value: "student-life", label: "Student life and dining" },
  { value: "athletics", label: "Athletics and recreation" },
  { value: "services", label: "Campus services" },
];

type Side = "north" | "south" | "east" | "west";

export interface Building {
  slug: string;
  code: string;
  name: string;
  category: Category;
  /** x, y, width, height in map units. */
  box: [number, number, number, number];
  uses: string;
  hours: string;
  /** Side with the accessible (level, power-assisted) entrance. */
  door: Side;
  link: { href: string; label: string };
}

const ACADEMIC = "Monday–Friday 7:00 a.m. – 10:00 p.m.; Saturday 8:00 a.m. – 5:00 p.m.";
const HOUSING = "Residents and their guests (card access)";
const EVENTS = "Open for scheduled games and events";

const b = (
  code: string, name: string, category: Category, box: Building["box"], uses: string, door: Side,
  link: Building["link"], hours = category === "housing" ? HOUSING : ACADEMIC,
): Building => ({ slug: name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, ""), code, name, category, box, uses, hours, door, link });

const housing = { href: "/students/housing", label: "Housing & Residential Life" };

export const buildings: Building[] = [
  b("FDR", "Founders Hall", "academic", [430, 175, 140, 55], "Administration: President, Provost, Admissions, Financial Aid, Registrar, Student Financial Services", "south", { href: "/students/registrar", label: "Office of the Registrar" }, "Monday–Friday 8:00 a.m. – 5:00 p.m."),
  b("LIB", "Sequoia Library", "academic", [430, 400, 140, 60], "Library, Special Collections, Learning Center & Writing Studio, Stacks Café, advising, disability resources", "north", { href: "/library", label: "Sequoia Library" }, "Monday–Thursday 7:30 a.m. – 12:00 a.m.; Friday 7:30 a.m. – 8:00 p.m.; Saturday 10:00 a.m. – 6:00 p.m.; Sunday 12:00 p.m. – 12:00 a.m."),
  b("SEH", "Sequoia Engineering Hall", "academic", [620, 400, 110, 60], "Computer Science, Mechanical Engineering, Robotics and Autonomous Systems Lab", "west", { href: "/academics/colleges/engineering", label: "College of Engineering" }),
  b("CSC", "Canopy Science Center", "academic", [620, 250, 110, 60], "Biology, Chemistry, Environmental Studies, Physics", "west", { href: "/academics/colleges/science", label: "College of Science" }),
  b("TNK", "Tanoak Hall", "academic", [300, 320, 80, 55], "Mathematics", "east", { href: "/academics/departments/mathematics", label: "Department of Mathematics" }),
  b("HUC", "Huckleberry Hall", "academic", [300, 395, 90, 50], "Psychology", "east", { href: "/academics/departments/psychology", label: "Department of Psychology" }),
  b("ALD", "Alder Hall", "academic", [300, 170, 90, 55], "College of Business, Alder Hall Gallery", "south", { href: "/academics/colleges/business", label: "College of Business" }),
  b("SPR", "Spruce Hall", "academic", [300, 250, 80, 55], "English, History, Geography", "east", { href: "/academics/colleges/arts-humanities", label: "College of Arts & Humanities" }),
  b("LAU", "Laurel Hall", "academic", [610, 170, 90, 55], "College of Education", "south", { href: "/academics/colleges/education", label: "College of Education" }),
  b("SAL", "Salal Hall", "academic", [620, 325, 90, 55], "Nursing, Nursing Simulation Center", "west", { href: "/academics/departments/nursing", label: "School of Nursing" }),
  b("HFA", "Hartwell Fine Arts Center", "academic", [180, 250, 95, 70], "Art, Music, Burl Gallery, Fern Hollow Recital Hall", "east", { href: "/academics/colleges/arts-humanities", label: "College of Arts & Humanities" }),
  b("SU", "Rowan Student Union", "student-life", [460, 475, 120, 55], "The Grove Dining Commons, career center, clubs, Office of Student Involvement, Multicultural Center, First-Generation Scholars, Owl Pantry", "north", { href: "/students/dining", label: "Dining on campus" }, "Monday–Friday 7:00 a.m. – 11:00 p.m.; weekends 9:00 a.m. – 11:00 p.m."),
  b("WEL", "Wellness Center", "student-life", [440, 548, 90, 40], "Student Health Center, Counseling & Psychological Services", "north", { href: "/students/health", label: "Student Health Center" }, "Monday–Friday 8:30 a.m. – 5:00 p.m."),
  b("SRC", "Student Recreation Center", "athletics", [760, 470, 100, 60], "Fitness floor, pool, climbing wall, Outdoor Center", "west", { href: "/students/recreation", label: "Campus Recreation" }, "Monday–Friday 6:00 a.m. – 11:00 p.m.; weekends 8:00 a.m. – 8:00 p.m."),
  b("OAC", "Owl Arena", "athletics", [770, 330, 120, 100], "Basketball, volleyball, Commencement", "west", { href: "/athletics", label: "Redwood Owls Athletics" }, EVENTS),
  b("FIELD", "Redwood Field", "athletics", [760, 160, 160, 110], "Soccer and track", "south", { href: "/athletics/teams/womens-soccer", label: "Women's Soccer" }, EVENTS),
  b("HAR", "Harlan Field", "athletics", [880, 440, 100, 100], "Baseball", "west", { href: "/athletics/teams/baseball", label: "Baseball" }, EVENTS),
  b("MAD", "Madrone Hall", "housing", [170, 150, 100, 70], "Residence hall (opened August 2026), Housing & Residential Life office", "south", housing),
  b("RC", "Redwood Commons", "housing", [40, 140, 100, 55], "Residence hall", "east", housing),
  b("CYP", "Cypress Hall", "housing", [40, 215, 100, 55], "Residence hall", "east", housing),
  b("TV", "Tanoak Village", "housing", [40, 290, 100, 60], "Residence hall", "east", housing),
  b("HC", "Huckleberry Court", "housing", [40, 370, 100, 55], "Residence hall", "east", housing),
  b("AFH", "Alder Family Housing", "housing", [40, 445, 110, 60], "Family and graduate housing", "east", housing),
  b("SGA", "Spruce Grove Apartments", "housing", [170, 340, 95, 55], "Apartment-style housing", "east", housing),
  b("FGA", "Fern Glen Apartments", "housing", [170, 420, 100, 50], "Apartment-style housing", "east", housing),
  b("CY", "Corporation Yard", "services", [880, 560, 100, 40], "Facilities, University Police, parking office, lost and found", "west", { href: "/students/safety", label: "Campus safety" }, "Parking office: Monday–Friday 8:00 a.m. – 4:30 p.m.; University Police: 24 hours"),
];

export type Permit = "visitor" | "general" | "resident";

export const permits: Record<Permit, { label: string; color: string }> = {
  visitor: { label: "Visitor and daily parking", color: "#7b4fa6" },
  general: { label: "General (G) permit parking", color: "#3f8f4f" },
  resident: { label: "Resident (R, RM) permit parking", color: "#d9822b" },
};

export const lots: { id: string; where: string; permit: Permit; box: [number, number, number, number] }[] = [
  { id: "A", where: "Canopy Drive entrance", permit: "visitor", box: [330, 545, 90, 40] },
  { id: "B", where: "Behind Founders Hall", permit: "general", box: [430, 110, 140, 50] },
  { id: "C", where: "Owl Arena", permit: "general", box: [905, 330, 80, 100] },
  { id: "D", where: "Redwood Field", permit: "general", box: [760, 95, 160, 50] },
  { id: "F", where: "Sequoia Engineering Hall", permit: "general", box: [620, 475, 110, 45] },
  { id: "J", where: "Upper campus (shuttle)", permit: "general", box: [250, 30, 300, 55] },
  { id: "M", where: "Madrone Hall structure", permit: "resident", box: [175, 85, 70, 50] },
  { id: "R", where: "Residence halls (R1–R6)", permit: "resident", box: [170, 490, 100, 40] },
];

export const ADDRESS = "1400 Canopy Drive, Arcadia Falls, CA 95579";

/** Point on the building's edge for its accessible entrance marker. */
export function doorPoint({ box: [x, y, w, h], door }: Building): [number, number] {
  return door === "north" ? [x + w / 2, y] : door === "south" ? [x + w / 2, y + h] : door === "east" ? [x + w, y + h / 2] : [x, y + h / 2];
}

const opposite: Record<Side, Side> = { north: "south", south: "north", east: "west", west: "east" };

/** Entrance list for the detail panel: the accessible one first. */
export const entrances = (bl: Building) => [
  { text: `${cap(bl.door)} entrance: level entry, power-assisted door`, accessible: true },
  { text: `${cap(opposite[bl.door])} entrance: four steps, no ramp`, accessible: false },
];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Rectangle as a path, because the GIS export draws every footprint as a <path>. */
export const rectPath = ([x, y, w, h]: [number, number, number, number]) => `M${x} ${y}h${w}v${h}h${-w}Z`;
