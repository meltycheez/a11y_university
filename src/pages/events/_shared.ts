// Events calendar helpers. Event times are stored with their Pacific offset; we read the wall-clock parts
// straight from the string so output never depends on the viewer's time zone.
import { eventCategories } from "~/data/catalog";
import { eventsContent, type EventDetail } from "~/data/content/events";
import { addDays, formatDate } from "~/data/site";

export const eventList: EventDetail[] = Object.values(eventsContent).sort((a, b) => a.start.localeCompare(b.start));

export const categoryName = (slug: string) => eventCategories.find((c) => c.slug === slug)?.name ?? slug;

export const day = (iso: string) => iso.slice(0, 10);

/** "16:00" → "4 p.m.", "19:30" → "7:30 p.m." (AP style, as the calendar vendor prints it). */
export function formatTime(iso: string): string {
  const [h, m] = iso.slice(11, 16).split(":").map(Number);
  const suffix = h < 12 ? "a.m." : "p.m.";
  const h12 = h % 12 || 12;
  return h === 12 && m === 0 ? "noon" : `${h12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${suffix}`;
}

export function formatWhen(e: EventDetail): string {
  const same = day(e.start) === day(e.end);
  return same
    ? `${formatDate(e.start)}, ${formatTime(e.start)}–${formatTime(e.end)}`
    : `${formatDate(e.start)}, ${formatTime(e.start)} – ${formatDate(e.end)}, ${formatTime(e.end)}`;
}

/** Events that fall on an ISO day (multi-day events appear on every day they run). */
export const eventsOn = (iso: string, list = eventList) => list.filter((e) => day(e.start) <= iso && iso <= day(e.end));

/** Weeks (Sunday first) covering a month; days outside the month are null. */
export function monthWeeks(year: number, month: number): (string | null)[][] {
  const first = `${year}-${String(month).padStart(2, "0")}-01`;
  const lead = new Date(`${first}T00:00:00Z`).getUTCDay();
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => addDays(first, i))];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

export const shortDate = (iso: string) => {
  const [, m, d] = iso.split("-").map(Number);
  return { month: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][m - 1], day: d };
};

export const cost = (e: EventDetail) => {
  const prices = e.registration.options?.map((o) => o.price) ?? [];
  const max = Math.max(0, ...prices);
  return max === 0 ? "Free" : `Free–$${max}`;
};
