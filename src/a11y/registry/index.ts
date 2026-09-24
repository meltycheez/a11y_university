import { rules, type Rule } from "../rules";
import { globalScenarios } from "./global";
import { homeScenarios } from "./home";
import type { Scenario, ScenarioDef } from "./types";

export type { Scenario, ScenarioDef } from "./types";

// Add each new registry file here.
const defs: ScenarioDef[] = [...globalScenarios, ...homeScenarios];

export const scenarios = new Map<string, Scenario>();
for (const def of defs) {
  if (scenarios.has(def.id)) throw new Error(`Duplicate scenario id: ${def.id}`);
  const rule: Rule = rules[def.rule];
  scenarios.set(def.id, {
    ...def,
    category: rule.category,
    wcag: def.wcag ?? rule.wcag,
    detectedBy: def.detectedBy ?? { wave: rule.wave, axe: rule.axe, manualOnly: rule.manualOnly },
  });
}
