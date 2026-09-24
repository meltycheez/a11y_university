// Fictional institution. Everything here is invented; rename in one place if needed.
export const brand = {
  name: "Redwood State University",
  shortName: "Redwood State",
  abbreviation: "RSU",
  founded: 1911,
  motto: "Radices altae, rami lati",
  mottoTranslation: "Deep roots, wide branches",
  mascot: "Redwood Owls",
  address: { street: "1400 Canopy Drive", city: "Arcadia Falls", state: "CA", zip: "95579" },
  phone: "(707) 555-0100",
  email: "info@redwoodstate.example.edu",
  portalName: "RedwoodConnect",
  libraryName: "Sequoia Library",
} as const;

export const pageTitle = (title: string) =>
  title === brand.name ? brand.name : `${title} | ${brand.name}`;
