import { useEffect, useSyncExternalStore } from "react";
import { scenarios } from "./registry";
import { toggleFor, useA11yState } from "./state";

// Ref-counted set of scenarios mounted right now. Pages mount and unmount their scenarios on navigation,
// so this is always "what is on the current page".
const refCounts = new Map<string, number>();
let mounted: ReadonlySet<string> = new Set();
const empty: ReadonlySet<string> = new Set();
const listeners = new Set<() => void>();

function track(id: string, delta: 1 | -1) {
  const n = (refCounts.get(id) ?? 0) + delta;
  if (n > 0) refCounts.set(id, n);
  else refCounts.delete(id);
  mounted = new Set(refCounts.keys());
  listeners.forEach((l) => l());
}

export const useMountedScenarios = () =>
  useSyncExternalStore((l) => { listeners.add(l); return () => { listeners.delete(l); }; }, () => mounted, () => empty);

/**
 * Returns true when the scenario's category toggle is ON (render the fixed version), and registers the
 * instance for the on-page counts. Pass undefined to opt out (returns true, registers nothing).
 */
export function useScenario(id: string | undefined): boolean {
  const state = useA11yState();
  const scenario = id ? scenarios.get(id) : undefined;
  if (id && !scenario && import.meta.env.DEV) throw new Error(`Unknown accessibility scenario: ${id}`);

  useEffect(() => {
    if (!scenario) return;
    track(scenario.id, 1);
    return () => track(scenario.id, -1);
  }, [scenario]);

  return scenario ? state[toggleFor[scenario.category]] : true;
}
