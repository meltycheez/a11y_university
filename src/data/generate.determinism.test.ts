// Plan 09: the seeded generator must be reproducible, since its output is committed and builds never rerun it.
// Reruns it in place (safe: identical output is a no-op write) and diffs the bytes against the prior run.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";

const dir = join(process.cwd(), "src/data/generated");
const snapshot = () => Object.fromEntries(readdirSync(dir).map((f) => [f, readFileSync(join(dir, f), "utf8")]));

it("gen:data produces byte-identical output on a second run", () => {
  const before = snapshot();
  execFileSync(process.execPath, ["scripts/generate-data.ts"], { cwd: process.cwd(), stdio: "pipe" });
  expect(snapshot()).toEqual(before);
});
