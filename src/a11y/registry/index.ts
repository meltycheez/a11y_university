import { rules, type Rule } from "../rules";
import { globalScenarios } from "./global";
import { homeScenarios } from "./home";
import { aboutScenarios } from "./about";
import { givingScenarios } from "./giving";
import { employeesScenarios } from "./employees";
import { admissionsScenarios } from "./admissions";
import { studentsScenarios } from "./students";
import { academicsScenarios } from "./academics";
import { facultyScenarios } from "./faculty";
import { newsScenarios } from "./news";
import { eventsScenarios } from "./events";
import { libraryScenarios } from "./library";
import { athleticsScenarios } from "./athletics";
import { portalScenarios } from "./portal";
import { coursesScenarios } from "./courses";
import { registrationScenarios } from "./registration";
import { searchScenarios } from "./search";
import { visitScenarios } from "./visit";
import { applyScenarios } from "./apply";
import { legacyAidScenarios } from "./legacy-aid";
import { donateScenarios } from "./donate";
import { campusMapScenarios } from "./campus-map";
import type { Scenario, ScenarioDef } from "./types";

export type { Scenario, ScenarioDef } from "./types";

// One registry file per site area.
const defs: ScenarioDef[] = [
  ...globalScenarios, ...homeScenarios,
  ...aboutScenarios,
  ...givingScenarios,
  ...employeesScenarios,
  ...admissionsScenarios,
  ...studentsScenarios,
  ...academicsScenarios,
  ...facultyScenarios,
  ...newsScenarios,
  ...eventsScenarios,
  ...libraryScenarios,
  ...athleticsScenarios,
  ...portalScenarios,
  // Plan 06 features
  ...coursesScenarios,
  ...registrationScenarios,
  ...searchScenarios,
  ...visitScenarios,
  ...applyScenarios,
  ...legacyAidScenarios,
  ...donateScenarios,
  ...campusMapScenarios,
];
export const scenarios = new Map<string, Scenario>();
for (const def of defs) {
  if (scenarios.has(def.id)) throw new Error(`Duplicate scenario id: ${def.id}`);
  const rule: Rule = rules[def.rule];
  scenarios.set(def.id, {
    ...def,
    category: rule.category,
    wcag: def.wcag ?? rule.wcag,
    areas: def.areas ?? rule.areas,
    detectedBy: def.detectedBy ?? { wave: rule.wave, axe: rule.axe, manualOnly: rule.manualOnly },
  });
}
