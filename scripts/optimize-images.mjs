// Converts raw Flow downloads (assets-src/flow/*.jpeg) into responsive WebP files in public/images
// and writes their dimensions to src/data/image-sizes.json. Skips outputs that are already up to date.
import { readdir, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets-src/flow";
const OUT = "public/images";
const WIDTHS = [480, 960, 1376];

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
const sizes = {};

for (const file of files) {
  const id = path.parse(file).name;
  const input = path.join(SRC, file);
  const meta = await sharp(input).metadata();
  sizes[id] = { width: meta.width, height: meta.height };
  const srcTime = (await stat(input)).mtimeMs;
  for (const w of WIDTHS.filter((w) => w <= meta.width || w === WIDTHS[0])) {
    const out = path.join(OUT, `${id}-${w}.webp`);
    const fresh = await stat(out).then((s) => s.mtimeMs >= srcTime, () => false);
    if (!fresh) await sharp(input).resize({ width: w }).webp({ quality: 78 }).toFile(out);
  }
  console.log(`${id}: ${meta.width}x${meta.height}`);
}

await writeFile("src/data/image-sizes.json", JSON.stringify(sizes, null, 2) + "\n");
