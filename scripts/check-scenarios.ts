// After `npm run build`: checks that every registered scenario is present (data-a11y-scenario marker) in the
// prerendered HTML of every page it lists, and that every marker in the HTML is registered.
// Document-level scenarios (lang, title) have no marker and are skipped. Run: npm run check:scenarios
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";

registerHooks({
  resolve(spec, ctx, next) {
    try { return next(spec, ctx); } catch (e) { if (spec.startsWith(".")) return next(`${spec}.ts`, ctx); throw e; }
  },
});
const { scenarios } = await import("../src/a11y/registry/index");
const { inventory } = await import("../src/routes/inventory");

// "*" = every page with the university header and footer (the portal and lab have their own shells).
const university = inventory.filter((e) => e.section !== "lab" && e.section !== "portal").map((e) => e.path);
const expand = (page: string) =>
  page === "*" ? university : page.includes(":") ? inventory.filter((e) => e.pattern === page).map((e) => e.path) : [page];

const html = new Map<string, string>();
const read = (path: string) => {
  if (!html.has(path)) {
    const file = `build/client${path === "/" ? "" : path}/index.html`;
    html.set(path, existsSync(file) ? readFileSync(file, "utf8") : "");
  }
  return html.get(path)!;
};
const markers = (page: string) => new Set([...read(page).matchAll(/data-a11y-scenario="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)));

const problems: string[] = [];
for (const s of scenarios.values()) {
  const paths = s.pages.flatMap(expand);
  if (!paths.length) problems.push(`${s.id}: pages ${JSON.stringify(s.pages)} match no route`);
  if (s.mechanism === "document") continue;
  const missing = paths.filter((p) => !markers(p).has(s.id));
  if (missing.length) problems.push(`${s.id}: not rendered on ${missing.length}/${paths.length} pages (${missing.slice(0, 5).join(", ")}${missing.length > 5 ? ", …" : ""})`);
}
for (const path of inventory.map((e) => e.path)) {
  for (const id of markers(path)) if (!scenarios.has(id)) problems.push(`${path}: marker "${id}" is not registered`);
}

if (!existsSync("build/client/index.html")) { console.error("check:scenarios: run `npm run build` first"); process.exit(1); }
console.log(problems.length ? problems.join("\n") : `check:scenarios: all ${scenarios.size} scenarios render where registered`);
process.exit(problems.length ? 1 : 0);
