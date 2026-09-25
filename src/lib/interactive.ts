// Shared helpers for plan 06 interactive features. Everything is in memory and deterministic.
import { useSyncExternalStore } from "react";

/** Stable 32-bit hash (FNV-1a) of a string. */
export function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

/** Fake network latency for an action: 300–800 ms, fixed per key so runs are reproducible. */
export const latency = (key: string) => new Promise<void>((r) => setTimeout(r, 300 + (hash(key) % 501)));

/** Deterministic confirmation code, e.g. "RSU-7K2Q9M". */
export const confirmationCode = (seed: string) => "RSU-" + hash(seed).toString(36).toUpperCase().padStart(7, "0").slice(0, 6);

/**
 * Module-level store for state that must survive client-side navigation (a cart, portal edits) but reset on
 * reload, like the toggle store in a11y/state.ts. Never persisted.
 */
export function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();
  const store = {
    get: () => state,
    set(next: T | ((prev: T) => T)) {
      state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      listeners.forEach((l) => l());
    },
    subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
    /** Server snapshot is always `initial`, so prerendered HTML and hydration match. */
    use: () => useSyncExternalStore(store.subscribe, store.get, () => initial),
  };
  return store;
}
