// The site's fixed "today". Calendars, the portal and "upcoming" lists read this, never the clock,
// so every load renders the same content.
export const SITE_NOW = "2026-10-05";
export const CURRENT_TERM = "Fall 2026";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Adds days to an ISO date (YYYY-MM-DD) in UTC, so the result never depends on the local time zone. */
export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** "2026-10-05" → "October 5, 2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export const isPast = (iso: string) => iso.slice(0, 10) < SITE_NOW;
