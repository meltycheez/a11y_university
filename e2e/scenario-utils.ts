import { inventory } from "../src/routes/inventory";
import { scenarios } from "../src/a11y/registry";

const university = inventory.filter((e) => e.section !== "lab" && e.section !== "portal").map((e) => e.path);

/** Same page-pattern expansion the build-time scripts use (scripts/check-scenarios.ts, scripts/coverage.ts). */
export function expand(page: string): string[] {
  if (page === "*") return university;
  if (page.includes(":")) return inventory.filter((e) => e.pattern === page).map((e) => e.path);
  return [page];
}

/** Every axe rule id an error-category scenario registered on `path` expects to trigger while defective. */
export function expectedAxeRules(path: string): string[] {
  const ids = new Set<string>();
  for (const s of scenarios.values()) {
    if (s.category !== "error") continue;
    if (!s.pages.some((p) => expand(p).includes(path))) continue;
    for (const id of s.detectedBy.axe ?? []) ids.add(id);
  }
  return [...ids];
}
