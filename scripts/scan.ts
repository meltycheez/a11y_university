// Ad-hoc before/after axe scan for one page, for manual WAVE/axe comparison work (plan 10).
// Requires the built site running (`npm run build && npm run preview`). Run: npm run scan -- /academics/catalog
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const path = process.argv[2] ?? "/";
const base = process.env.BASE_URL ?? "http://localhost:4173";

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
await page.goto(`${base}${path}`);

const scan = () => new AxeBuilder({ page }).analyze();
const counts = (results: Awaited<ReturnType<typeof scan>>) => {
  const byId = new Map<string, number>();
  for (const v of [...results.violations, ...results.incomplete]) byId.set(v.id, v.nodes.length);
  return byId;
};

const before = counts(await scan());
await page.getByRole("button", { name: "Accessibility Test Controls" }).click();
await page.getByRole("button", { name: "Fix All" }).click();
const after = counts(await scan());
await browser.close();

const rows = [...new Set([...before.keys(), ...after.keys()])].sort()
  .map((id) => ({ rule: id, before: before.get(id) ?? 0, after: after.get(id) ?? 0 }));

console.log(`axe scan: ${base}${path}`);
console.table(rows.length ? rows : "no violations or incomplete checks either state");
