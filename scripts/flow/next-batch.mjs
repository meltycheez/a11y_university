// Writes run.js with the next N manifest images that have no raw file in assets-src/flow yet.
// Usage: node scripts/flow/next-batch.mjs [N] [id-prefix]
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const [n = 4, prefix = ""] = process.argv.slice(2);
const root = new URL("../../", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("src/data/images.json", root)));
const done = (id) => ["jpeg", "jpg", "png"].some((ext) => existsSync(new URL(`assets-src/flow/${id}.${ext}`, root)));
const todo = manifest.filter((m) => !done(m.id) && m.id.startsWith(prefix));
const items = todo.slice(0, Number(n)).map(({ id, aspect, prompt, text, plain }) => ({ id, aspect, prompt, text, plain }));
const template = readFileSync(new URL("generate.js", import.meta.url), "utf8");
writeFileSync(new URL("run.js", import.meta.url), template.replace("/*ITEMS*/[]", JSON.stringify(items)));
console.log(`${items.map((i) => i.id).join(", ") || "nothing to do"} (${todo.length} remaining)`);
