// Copies the prerendered 404 page to build/client/404.html, which static hosts serve for unknown paths.
import { copyFile } from "node:fs/promises";

await copyFile("build/client/404/index.html", "build/client/404.html");
console.log("postbuild: wrote build/client/404.html");
