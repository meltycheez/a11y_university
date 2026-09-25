// Shared by page folders with many small scenarios on one page (financial aid, admissions, giving, athletics,
// academics): registers every scenario of a page on its root at load (plan 05 build guide, "Plan 06 additions")
// and gives short keys for them.
import type { ScenarioDef } from "~/a11y/registry";
import { useScenario } from "~/a11y/useScenario";

/** Key = id minus `prefix` and the trailing -NNN, e.g. "donate-amount-fieldset-001" → "amount-fieldset". */
export function useFixes(defs: ScenarioDef[], prefix: string) {
  const fixed = new Map<string, boolean>();
  const ids = new Map<string, string>();
  for (const d of defs) {
    const key = d.id.slice(prefix.length).replace(/-\d{3}$/, "");
    ids.set(key, d.id);
    // The registry array is constant, so the hook order never changes.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    fixed.set(key, useScenario(d.id));
  }
  const id = (key: string) => {
    const v = ids.get(key);
    if (!v) throw new Error(`Unknown scenario key: ${key}`);
    return v;
  };
  return {
    /** True when the scenario's toggle is ON (render the fixed version). */
    fix: (key: string) => (id(key), fixed.get(key)!),
    /** A key's full scenario id, e.g. for a component that takes a bare `scenario` prop. */
    id,
    /** Marker props for an instance root; several keys may share one element. */
    mark: (...keys: string[]) => ({ "data-a11y-scenario": keys.map(id).join(" ") }),
  };
}
