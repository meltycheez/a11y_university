// Converts raw Flow downloads (assets-src/flow/*.jpeg) into responsive WebP files in public/images
// and writes their dimensions plus manifest alt text to src/data/image-sizes.json. Skips outputs that are already up to date.
import { readdir, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets-src/flow";
const OUT = "public/images";
const WIDTHS = [480, 960, 1376];
const BUDGET_MB = 40;

const manifest = new Map(JSON.parse(await readFile("src/data/images.json", "utf8")).map((m) => [m.id, m]));
await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
const sizes = {};

for (const file of files) {
  const id = path.parse(file).name;
  if (!manifest.has(id)) console.warn(`warning: ${file} is not in src/data/images.json`);
  const input = path.join(SRC, file);
  const meta = await sharp(input).metadata();
  sizes[id] = { width: meta.width, height: meta.height, alt: manifest.get(id)?.alt ?? "" };
  const srcTime = (await stat(input)).mtimeMs;
  for (const w of WIDTHS.filter((w) => w <= meta.width || w === WIDTHS[0])) {
    const out = path.join(OUT, `${id}-${w}.webp`);
    const fresh = await stat(out).then((s) => s.mtimeMs >= srcTime, () => false);
    if (!fresh) await sharp(input).resize({ width: w }).webp({ quality: 78 }).toFile(out);
  }
}

await writeFile("src/data/image-sizes.json", JSON.stringify(sizes, null, 2) + "\n");
const missing = [...manifest.keys()].filter((id) => !sizes[id]);
let bytes = 0;
for (const f of await readdir(OUT)) bytes += (await stat(path.join(OUT, f))).size;
console.log(`${files.length} images optimized, ${missing.length} manifest entries not generated yet, public/images ${(bytes / 1e6).toFixed(1)} MB`);
if (bytes / 1e6 > BUDGET_MB) console.warn(`warning: public/images exceeds the ${BUDGET_MB} MB budget`);
