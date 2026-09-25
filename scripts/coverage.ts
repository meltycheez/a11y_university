// Coverage report (plan 07): rule keys with no instance, coverage areas below 3 scenarios on 3 pages, and
// per-route counts against the route's tier. Run: npm run coverage  (exit 1 when a requirement fails)
import { registerHooks } from "node:module";

registerHooks({
  resolve(spec, ctx, next) {
    try { return next(spec, ctx); } catch (e) { if (spec.startsWith(".")) return next(`${spec}.ts`, ctx); throw e; }
  },
});
const { scenarios } = await import("../src/a11y/registry/index");
const { rules } = await import("../src/a11y/rules");
const { inventory } = await import("../src/routes/inventory");

const university = inventory.filter((e) => e.section !== "lab" && e.section !== "portal").map((e) => e.path);
const expand = (page: string) =>
  page === "*" ? university : page.includes(":") ? inventory.filter((e) => e.pattern === page).map((e) => e.path) : [page];

const all = [...scenarios.values()];
const byRule = new Map<string, number>();
const areaScenarios = new Map<string, number>();
const areaPages = new Map<string, Set<string>>();
const perPage = new Map<string, { page: number; chrome: number }>();
for (const s of all) {
  byRule.set(s.rule, (byRule.get(s.rule) ?? 0) + 1);
  const paths = s.pages.flatMap(expand);
  for (const a of s.areas) {
    areaScenarios.set(a, (areaScenarios.get(a) ?? 0) + 1);
    const set = areaPages.get(a) ?? new Set();
    paths.forEach((p) => set.add(p));
    areaPages.set(a, set);
  }
  for (const p of paths) {
    const c = perPage.get(p) ?? { page: 0, chrome: 0 };
    s.pages.includes("*") ? c.chrome++ : c.page++;
    perPage.set(p, c);
  }
}

const problems: string[] = [];
const unused = Object.keys(rules).filter((k) => !byRule.has(k));
if (unused.length) problems.push(`rules with no instance (${unused.length}): ${unused.join(", ")}`);
const areas = new Set(Object.values(rules).flatMap((r) => r.areas));
for (const a of areas) {
  const n = areaScenarios.get(a) ?? 0, pages = areaPages.get(a)?.size ?? 0;
  if (n < 3 || pages < 3) problems.push(`area "${a}": ${n} scenarios on ${pages} pages (need 3 and 3)`);
}

// Page-level budgets from the build guide (chrome counted separately). T = 30+.
const budget: Record<string, [number, number]> = { A: [0, 0], L: [0, 2], M: [3, 8], H: [8, 15], T: [30, Infinity] };
const offTier: string[] = [];
for (const e of inventory) {
  const c = perPage.get(e.path) ?? { page: 0, chrome: 0 };
  const [lo, hi] = budget[e.tier];
  if (c.page < lo || c.page > hi) offTier.push(`${e.path} (${e.tier}): ${c.page} page-level`);
}

const cats = { error: 0, alert: 0, manual: 0 };
for (const s of all) cats[s.category]++;
console.log(`${all.length} scenarios (E ${cats.error} / A ${cats.alert} / M ${cats.manual}), ${byRule.size}/${Object.keys(rules).length} rules used`);
console.log(`chrome ("*") scenarios: ${all.filter((s) => s.pages.includes("*")).length}`);
console.log([...areas].sort().map((a) => `  ${a}: ${areaScenarios.get(a) ?? 0} scenarios / ${areaPages.get(a)?.size ?? 0} pages`).join("\n"));
if (offTier.length) console.log(`\noutside tier budget (${offTier.length}):\n  ${offTier.join("\n  ")}`);
if (problems.length) console.log(`\nFAIL:\n  ${problems.join("\n  ")}`);
process.exit(problems.length ? 1 : 0);
