import { useSyncExternalStore } from "react";

export type Category = "error" | "alert" | "manual";
export interface A11yState { fixErrors: boolean; fixAlerts: boolean; fixManual: boolean }

export const toggleFor: Record<Category, keyof A11yState> = { error: "fixErrors", alert: "fixAlerts", manual: "fixManual" };
const bodyClass: Record<keyof A11yState, string> = { fixErrors: "a11y-fix-errors", fixAlerts: "a11y-fix-alerts", fixManual: "a11y-fix-manual" };

const initial: A11yState = { fixErrors: false, fixAlerts: false, fixManual: false };
// Module memory only: client-side navigation keeps it, a reload resets it. Never persist this anywhere.
let state = initial;
const listeners = new Set<() => void>();

export const a11yStore = {
  get: () => state,
  set(patch: Partial<A11yState>) {
    state = { ...state, ...patch };
    for (const [key, cls] of Object.entries(bodyClass)) document.body.classList.toggle(cls, state[key as keyof A11yState]);
    listeners.forEach((l) => l());
  },
  fixAll() { a11yStore.set({ fixErrors: true, fixAlerts: true, fixManual: true }); },
  resetAll() { a11yStore.set(initial); },
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
};

/** The server snapshot is always `initial`, so pre-rendered HTML is the defective state and hydration matches. */
export const useA11yState = () => useSyncExternalStore(a11yStore.subscribe, a11yStore.get, () => initial);
