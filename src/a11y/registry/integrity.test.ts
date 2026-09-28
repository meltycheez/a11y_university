import { expect, it } from "vitest";
import { inventory } from "~/routes/inventory";
import { rules } from "../rules";
import { scenarios } from "./index";

// Duplicate ids already throw at import time (see index.ts), so every test in the suite guards that one.
const university = inventory.filter((e) => e.section !== "lab" && e.section !== "portal").map((e) => e.path);
const expand = (page: string) =>
  page === "*" ? university : page.includes(":") ? inventory.filter((e) => e.pattern === page).map((e) => e.path) : [page];

it("every scenario has a valid WCAG success criterion format", () => {
  for (const s of scenarios.values())
    for (const sc of s.wcag) expect(sc, s.id).toMatch(/^\d+\.\d+\.\d+$/);
});

it("every scenario's pages resolve to a real route", () => {
  for (const s of scenarios.values())
    for (const page of s.pages) expect(expand(page), `${s.id}: "${page}"`).not.toHaveLength(0);
});

it("every rule key is used by at least one scenario", () => {
  const used = new Set([...scenarios.values()].map((s) => s.rule));
  const unused = Object.keys(rules).filter((k) => !used.has(k as never));
  expect(unused).toEqual([]);
});
