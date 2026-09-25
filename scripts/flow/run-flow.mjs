// Standalone Flow runner: opens the Playwright MCP's signed-in Chrome profile directly (no MCP needed)
// and generates every manifest image that has no raw file yet, in batches, reusing generate.js.
// Usage: PLAYWRIGHT=<path to playwright package> node scripts/flow/run-flow.mjs [batchSize]
import { createHash } from "node:crypto";
import { appendFileSync, existsSync, readdirSync, readFileSync, unlinkSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright");
const PROJECT = "https://flow.google.com/project/6c0f8de2-e914-4113-b453-346d676da347";
const PROFILE = process.env.FLOW_PROFILE ?? path.join(homedir(), "AppData/Local/ms-playwright-mcp/mcp-chrome-101a2b8");
const BATCH = Number(process.argv[2] ?? 4);
const root = new URL("../../", import.meta.url);
const LOG = new URL("assets-src/flow-run.log", root);
const FLOW = new URL("assets-src/flow/", root);
const md5 = (f) => createHash("md5").update(readFileSync(new URL(f, FLOW))).digest("hex");
const log = (msg) => { const line = `${new Date().toISOString()} ${msg}`; console.log(line); appendFileSync(LOG, line + "\n"); };

const manifest = JSON.parse(readFileSync(new URL("src/data/images.json", root)));
const done = (id) => ["jpeg", "jpg", "png", "webp"].some((ext) => existsSync(new URL(`assets-src/flow/${id}.${ext}`, root)));
// generate.js is an `async (page) => {...}` expression with an /*ITEMS*/[] placeholder.
const template = readFileSync(new URL("generate.js", import.meta.url), "utf8");
const makeRun = (items) => (0, eval)(template.replace("/*ITEMS*/[]", JSON.stringify(items)).replace(/^\s*\/\/.*$/gm, ""));

const context = await chromium.launchPersistentContext(PROFILE, { channel: "chrome", headless: false, acceptDownloads: false, viewport: null });
const page = context.pages()[0] ?? (await context.newPage());
await page.goto(PROJECT);

// Wait (up to 15 min) for a manual sign-in if Google bounced us to a login page.
for (let i = 0; !(await page.getByRole("button", { name: "Start generation" }).count()); i++) {
  if (i === 0) log("waiting for Flow project page (sign in in the Chrome window if asked)...");
  if (i > 450) { log("gave up waiting for sign-in"); process.exit(1); }
  if (!page.url().includes("/project/") && page.url().startsWith("https://flow.google.com")) await page.goto(PROJECT).catch(() => {});
  await page.waitForTimeout(2000);
}
log("Flow project ready");

let failures = 0;
for (;;) {
  const todo = manifest.filter((m) => !done(m.id));
  if (!todo.length) { log("all images generated"); break; }
  const items = todo.slice(0, BATCH).map(({ id, aspect, prompt, text, plain }) => ({ id, aspect, prompt, text, plain }));
  log(`batch: ${items.map((i) => i.id).join(", ")} (${todo.length} remaining)`);
  try {
    for (const r of await makeRun(items)(page)) {
      if (r.error) { log(`FAIL ${r.id}: ${r.error}`); continue; }
      // A stray tile (e.g. from an interrupted run) shows up with the wrong shape: reject it so it regenerates.
      const [w, h] = r.dims.split("x").map(Number), [aw, ah] = items.find((i) => i.id === r.id).aspect.split(":").map(Number);
      if (Math.abs(w / h - aw / ah) > 0.05) { unlinkSync(new URL(r.file, FLOW)); log(`WRONG-ASPECT ${r.id} got ${r.dims}; deleted for retry`); continue; }
      log(`ok ${r.id} ${r.dims} ${r.seconds}s ${r.type}`);
    }
  } catch (e) {
    log(`batch error: ${e.message.split("\n")[0]}`);
  }
  // An older tile can resurface at the top of Flow's grid; drop byte-identical copies so they regenerate.
  const hashes = new Map(readdirSync(FLOW).filter((f) => !items.some((i) => f.startsWith(i.id + "."))).map((f) => [md5(f), f]));
  for (const f of readdirSync(FLOW).filter((f) => items.some((i) => f.startsWith(i.id + ".")))) {
    const twin = hashes.get(md5(f));
    if (twin) { unlinkSync(new URL(f, FLOW)); log(`DUP ${f} duplicated ${twin}; deleted for retry`); } else hashes.set(md5(f), f);
  }
  const stillTodo = items.filter((i) => !done(i.id)).length;
  failures = stillTodo === items.length ? failures + 1 : 0;
  if (failures >= 3) { log("3 batches in a row produced nothing; stopping"); break; }
  if (stillTodo) await page.goto(PROJECT).catch(() => {});
}
await context.close();
