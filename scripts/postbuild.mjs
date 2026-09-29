// React Router's static prerender nests every route under the BASE_PATH subdirectory (e.g.
// build/client/a11y_university/about/index.html) so in-app links resolve correctly, but GitHub Pages strips
// the "/a11y_university/" URL prefix before looking up files in the deployed artifact - it needs a flat root
// (this is also why Vite's own asset output isn't nested: build/client/assets, referenced as
// "/a11y_university/assets/...", relies on that same stripping). Flatten the nested output back up to the
// artifact root, then copy the prerendered 404 page to 404.html, which static hosts serve for unknown paths.
import { cp, copyFile, readdir, rm } from "node:fs/promises";
import path from "node:path";

const clientDir = "build/client";
const base = (process.env.BASE_PATH ?? "/").replace(/^\/|\/$/g, "");

if (base) {
  const nested = path.join(clientDir, base);
  for (const entry of await readdir(nested)) {
    await cp(path.join(nested, entry), path.join(clientDir, entry), { recursive: true, force: true });
  }
  await rm(nested, { recursive: true, force: true });
}

await copyFile(path.join(clientDir, "404", "index.html"), path.join(clientDir, "404.html"));
console.log(`postbuild: wrote ${clientDir}/404.html`);
