// Derived views over the scenario registry for the Accessibility Lab index (plan 08). Pure functions over
// `scenarios` and `rules`, so the lab never drifts from what's actually registered.
import { inventory, type RouteEntry } from "~/routes/inventory";
import { scenarios, type Scenario } from "./registry";
import { rules, type Area } from "./rules";
import type { Category } from "./state";

export const CATEGORIES: Category[] = ["error", "alert", "manual"];
export const AREAS: Area[] = [...new Set(Object.values(rules).flatMap((r) => r.areas))].sort();
export const ruleCount = Object.keys(rules).length;

export function categoryTotals(): Record<Category, number> {
  return Object.fromEntries(CATEGORIES.map((c) => [c, all().filter((s) => s.category === c).length])) as Record<Category, number>;
}

export function areaCategoryMatrix(): { area: Area; counts: Record<Category, number> }[] {
  return AREAS.map((area) => ({
    area,
    counts: Object.fromEntries(CATEGORIES.map((c) => [c, all().filter((s) => s.areas.includes(area) && s.category === c).length])) as Record<Category, number>,
  }));
}

const universityPaths = inventory.filter((e) => e.section !== "lab" && e.section !== "portal").map((e) => e.path);

/** A scenario's `pages` entries ("*", a ":slug" pattern, or an exact path) expanded to real routes. */
export function expandPages(pages: readonly string[]): string[] {
  return pages.flatMap((p) => (p === "*" ? universityPaths : p.includes(":") ? inventory.filter((e) => e.pattern === p).map((e) => e.path) : [p]));
}

export function all(): Scenario[] {
  return [...scenarios.values()];
}

export function pageInventory(): (RouteEntry & { scenarioCount: number })[] {
  return inventory.map((e) => ({ ...e, scenarioCount: all().filter((s) => expandPages(s.pages).includes(e.path)).length }));
}
