// Runs the real WAVE browser extension (WebAIM) against one page, before and after "Fix All", and prints the
// distinct WAVE item types found in each state. Requires a running site (`npm run build && npm run preview`).
// Run: npm run wave -- /            (BASE_URL defaults to http://localhost:4173)
// The extension is downloaded from the Chrome Web Store into .cache/wave/ on first run (gitignored).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type BrowserContext, type Worker } from "@playwright/test";

// Only the extension service worker's chrome.tabs API is used, inside sw.evaluate().
declare const chrome: { tabs: { query(q: object): Promise<{ id?: number; url?: string }[]> } };

const WAVE_ID = "jbbplnpkjmmeebjpijfedlgcdilocofh";
const cacheDir = resolve(".cache/wave");
const extDir = resolve(cacheDir, "ext");
const path = process.argv[2] ?? "/";
const base = process.env.BASE_URL ?? "http://localhost:4173";
const url = new URL(path.replace(/^\/+/, "/"), base).href;

async function ensureExtension() {
  if (existsSync(resolve(extDir, "manifest.json"))) return;
  mkdirSync(extDir, { recursive: true });
  const crxUrl = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=140.0&acceptformat=crx2,crx3&x=id%3D${WAVE_ID}%26uc`;
  const crx = Buffer.from(await (await fetch(crxUrl)).arrayBuffer());
  const zip = resolve(cacheDir, "wave.zip");
  writeFileSync(zip, crx.subarray(12 + crx.readUInt32LE(8))); // strip the CRX3 header
  try { execFileSync("tar", ["-xf", zip, "-C", extDir]); } catch { execFileSync("unzip", ["-oq", zip, "-d", extDir]); }
}

interface WaveItem { id: string; description: string; count: number }
type Report = Record<"error" | "contrast" | "alert", WaveItem[]>;

async function runWave(context: BrowserContext, sw: Worker, fixAll: boolean): Promise<Report> {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  if (fixAll) {
    await page.getByRole("button", { name: "Accessibility Test Controls" }).click();
    await page.getByRole("button", { name: "Fix All" }).click();
    await page.getByRole("button", { name: "Accessibility Test Controls" }).click(); // collapse the panel again
  }
  await page.evaluate(() => {
    document.addEventListener("waveResults", (e) => { (window as never as { __wave: unknown }).__wave = (e as CustomEvent).detail; }, { once: true });
  });
  await sw.evaluate(async (target) => {
    const tab = (await chrome.tabs.query({})).find((t) => t.url?.startsWith(target));
    // @ts-expect-error serviceworker is WAVE's own global in service_worker.js
    await serviceworker.func.runWave(tab!.id, tab!.url);
  }, url);
  const raw = await page.waitForFunction(() => (window as never as { __wave?: unknown }).__wave, null, { timeout: 30_000 }).then((h) => h.jsonValue());
  await page.close();
  const detail = typeof raw === "string" ? JSON.parse(raw) : raw;
  const data = typeof detail.data === "string" ? JSON.parse(detail.data) : detail.data ?? detail;
  const cats = data.categories ?? data.statistics?.categories ?? data;
  const report: Report = { error: [], contrast: [], alert: [] };
  for (const key of Object.keys(report) as (keyof Report)[]) {
    for (const [id, item] of Object.entries<{ description?: string; count?: number }>(cats[key]?.items ?? {})) {
      report[key].push({ id, description: item.description ?? "", count: item.count ?? 0 });
    }
  }
  if (process.env.WAVE_DUMP) writeFileSync(resolve(cacheDir, `raw-${fixAll ? "fixed" : "default"}.json`), JSON.stringify(data, null, 2));
  return report;
}

await ensureExtension();
const context = await chromium.launchPersistentContext("", {
  channel: "chromium",
  args: [`--disable-extensions-except=${extDir}`, `--load-extension=${extDir}`],
});
const sw = context.serviceWorkers()[0] ?? await context.waitForEvent("serviceworker");

const print = (label: string, r: Report) => {
  const types = r.error.length + r.contrast.length + r.alert.length;
  console.log(`\n${label}: ${r.error.length} error types, ${r.contrast.length} contrast types, ${r.alert.length} alert types (${types} total)`);
  for (const key of ["error", "contrast", "alert"] as const) {
    for (const i of r[key]) console.log(`  ${key.padEnd(8)} ${String(i.count).padStart(3)}  ${i.id.padEnd(22)} ${i.description}`);
  }
};

console.log(`WAVE ${JSON.parse(readFileSync(resolve(extDir, "manifest.json"), "utf8")).version}: ${url}`);
const before = await runWave(context, sw, false);
print("Default (defects on)", before);
const after = await runWave(context, sw, true);
print("After Fix All", after);
await context.close();
