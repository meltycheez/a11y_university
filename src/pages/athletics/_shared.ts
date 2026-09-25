// Athletics helpers shared by the section's pages (no data imports: datasets are read in route loaders).
import { teams } from "~/data/catalog";
import type { Game } from "~/data/types";

const MON = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

export const teamName = (slug: string) => teams.find((t) => t.slug === slug)?.name ?? slug;
export const teamImage = (slug: string) => (slug === "womens-soccer" ? "athletics-soccer-action" : `athletics-${slug}`);

/** "2026-11-06" → "Nov. 6" (AP style, like the sports vendor's templates). */
export function shortDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${MON[m - 1]} ${d}`;
}

export const versus = (g: Game) => (g.site === "Away" ? `at ${g.opponent}` : `vs. ${g.opponent}`);
