import { readFileSync } from "node:fs";
import { expect, test, vi } from "vitest";
import { search } from ".";

test('"computer science" returns every PRD result group', async () => {
  const index = readFileSync("public/search-index.json", "utf8");
  vi.stubGlobal("fetch", async () => new Response(index));
  const results = await search("computer science");
  const types = new Set(results.map((r) => r.type));
  for (const t of ["department", "program", "faculty", "course", "news", "page"]) expect(types).toContain(t);
  expect(results.filter((r) => r.type === "program").map((r) => r.title)).toEqual(
    expect.arrayContaining(["Computer Science, B.S.", "Computer Science, M.S."]),
  );
});
