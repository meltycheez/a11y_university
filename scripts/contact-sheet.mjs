// Writes assets-src/contact-sheet.html: every manifest image beside its id and alt text, for the human review gate.
// Open it in a browser; missing images show as empty tiles.
import { readFile, writeFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile("src/data/images.json", "utf8"));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const tiles = manifest.map((m) => `<figure><img src="../public/images/${m.id}-480.webp" alt="${esc(m.alt)}" loading="lazy"><figcaption><b>${m.id}</b> <i>${m.aspect}</i><br>${esc(m.alt) || "<em>(decorative)</em>"}</figcaption></figure>`);
await writeFile("assets-src/contact-sheet.html", `<!doctype html><html lang="en"><meta charset="utf-8"><title>RSU image contact sheet</title>
<style>body{font:14px system-ui;margin:1rem;background:#f4f4f2}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}figure{margin:0;background:#fff;padding:6px;border:1px solid #ccc}img{width:100%;height:160px;object-fit:contain;background:#ddd}</style>
<h1>RSU image contact sheet (${manifest.length})</h1><main>${tiles.join("\n")}</main></html>\n`);
console.log(`wrote assets-src/contact-sheet.html (${manifest.length} images)`);
