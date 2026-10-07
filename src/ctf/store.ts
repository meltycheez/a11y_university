// Plan 11 §2: CTF run state. Module memory like a11y/state.ts: client-side navigation keeps a run, a reload
// ends it (the attempt it used stays used, because attempts live in the leaderboard).
import { a11yStore, toggleFor, type Category } from "~/a11y/state";
import { createStore, hash } from "~/lib/interactive";
import { challengeById, type ChallengeId } from "./challenges";
import * as board from "./leaderboard";

export const FIX_PENALTY = 150;
export const HIGHLIGHT_PENALTY = 25;
export const HINT_COSTS = [50, 75, 100];
export const REVEAL_PENALTY = 50;
const TIME_BONUS = 100;
const TIME_LIMIT = 20 * 60_000;

export interface Run { id: ChallengeId; handle: string; startedAt: number; fixes: Category[]; highlights: Category[]; hints: number; mouse: number;
  /** The player paid to see a page that fades out during the run (`Challenge.reveal`). */
  revealed?: boolean }
export interface Result { id: ChallengeId; handle: string; flag: string; score: number; breakdown: [string, number][]; mouse: number; trackMouse: boolean; attemptsLeft: number }

interface CtfState {
  run: Run | null;
  result: Result | null;
  /** Best score per challenge this session, for the widget list. */
  best: Partial<Record<ChallengeId, number>>;
  /** Last handle used, so players don't retype it per challenge. */
  handle: string;
  /** After a finish, the player chose to try this challenge again with every fix on: unscored, for comparison. */
  compare: ChallengeId | null;
}

const initial: CtfState = { run: null, result: null, best: {}, handle: "", compare: null };
export const ctfStore = createStore<CtfState>(initial);
const patch = (p: Partial<CtfState>) => ctfStore.set((s) => ({ ...s, ...p }));
const patchRun = (p: Partial<Run>) => ctfStore.set((s) => (s.run ? { ...s, run: { ...s.run, ...p } } : s));

export const hintCost = (used: number) => HINT_COSTS.slice(0, used).reduce((a, b) => a + b, 0);
export const penalties = (r: Run) => r.fixes.length * FIX_PENALTY + r.highlights.length * HIGHLIGHT_PENALTY + hintCost(r.hints) + (r.revealed ? REVEAL_PENALTY : 0);
export const liveScore = (r: Run) => Math.max(0, challengeById.get(r.id)!.basePoints - penalties(r));
export const timeBonus = (ms: number) => Math.max(0, Math.round(TIME_BONUS * (1 - ms / TIME_LIMIT)));

/** `RSU{<id>-<8 hex>}`, from the challenge and the values the player had to find. Never a literal in the bundle. */
export const makeFlag = (id: ChallengeId, parts: string[]) =>
  `RSU{${id}-${hash([id, ...parts.map((p) => p.trim().toLowerCase())].join("|")).toString(16).padStart(8, "0")}}`;

// Fixes turned on mid-run cost points once per category. Reset All during a run is free.
a11yStore.subscribe(() => {
  const run = ctfStore.get().run;
  if (!run) return;
  const state = a11yStore.get();
  const added = (Object.keys(toggleFor) as Category[]).filter((c) => state[toggleFor[c]] && !run.fixes.includes(c));
  if (added.length) patchRun({ fixes: [...run.fixes, ...added] });
});

/** Mouse clicks inside <main> during a run: shown on the result, never scored. */
const onPointer = (e: PointerEvent) => {
  const run = ctfStore.get().run;
  if (run && e.pointerType === "mouse" && (e.target as Element | null)?.closest?.("main")) patchRun({ mouse: run.mouse + 1 });
};

export type StartError = "handle" | "attempts";

/** Whether `handle` may start `id`, without using an attempt (the name step of the challenge bar). */
export function checkStart(id: ChallengeId, handle: string): StartError | null {
  const name = handle.trim();
  if (!name) return "handle";
  return board.attemptsUsed(name, id) >= board.MAX_ATTEMPTS ? "attempts" : null;
}

export function startRun(id: ChallengeId, handle: string): StartError | null {
  const name = handle.trim().slice(0, 24);
  if (!name) return "handle";
  if (!board.startAttempt(name, id)) return "attempts";
  a11yStore.resetAll(); // every run starts with every defect on (before the run exists, so it's free)
  patch({ run: { id, handle: name, startedAt: Date.now(), fixes: [], highlights: [], hints: 0, mouse: 0 }, result: null, handle: name, compare: null });
  if (challengeById.get(id)!.trackMouse) document.addEventListener("pointerdown", onPointer, true);
  return null;
}

/** True when this highlight costs points (the first time per category in a run). */
export function noteHighlight(c: Category): boolean {
  const run = ctfStore.get().run;
  if (!run || run.highlights.includes(c)) return false;
  patchRun({ highlights: [...run.highlights, c] });
  return true;
}

export function takeHint(): string | null {
  const run = ctfStore.get().run;
  const hints = run && challengeById.get(run.id)!.hints;
  if (!run || !hints || run.hints >= hints.length) return null;
  patchRun({ hints: run.hints + 1 });
  return hints[run.hints];
}

/** Shows the faded-out page again for the rest of the run, for REVEAL_PENALTY points once. */
export const revealPage = () => patchRun({ revealed: true });

export function endRun() {
  document.removeEventListener("pointerdown", onPointer, true);
  patch({ run: null });
}

/**
 * Called by a challenge page when the task is done: the run finishes and scores right away (the player never
 * types the flag). Returns the flag, or null when no run of this challenge is active (outside a run, pages
 * behave exactly as before plan 11).
 */
export function revealFlag(id: ChallengeId, parts: string[], now = Date.now()): string | null {
  const { run, best } = ctfStore.get();
  if (!run || run.id !== id) return null;
  const flag = makeFlag(id, parts);
  const c = challengeById.get(id)!;
  const bonus = timeBonus(now - run.startedAt);
  const breakdown: [string, number][] = [
    ["Base points", c.basePoints],
    ...(run.fixes.length ? [[`Fix switches used (${run.fixes.length})`, -run.fixes.length * FIX_PENALTY] as [string, number]] : []),
    ...(run.highlights.length ? [[`Highlights used (${run.highlights.length})`, -run.highlights.length * HIGHLIGHT_PENALTY] as [string, number]] : []),
    ...(run.hints ? [[`Hints used (${run.hints})`, -hintCost(run.hints)] as [string, number]] : []),
    ...(run.revealed ? [["Faded page shown again", -REVEAL_PENALTY] as [string, number]] : []),
    ["Time bonus", bonus],
  ];
  const score = Math.max(0, c.basePoints - penalties(run)) + bonus;
  board.recordFinish(run.handle, id, { score, flag, finishedAt: new Date(now).toISOString(), noMouse: c.trackMouse && run.mouse === 0 });
  const result: Result = {
    id, handle: run.handle, flag, score, breakdown, mouse: run.mouse, trackMouse: c.trackMouse,
    attemptsLeft: Math.max(0, board.MAX_ATTEMPTS - board.attemptsUsed(run.handle, id)),
  };
  endRun();
  patch({ result, best: { ...best, [id]: Math.max(best[id] ?? 0, score) } });
  return flag;
}

/** "Try again with every issue fixed": clears the result and turns every fix on. The page resets its own task. */
export function retryWithFixes(id: ChallengeId) {
  a11yStore.fixAll();
  patch({ result: null, compare: id });
}

export const isRunning = (id: ChallengeId) => ctfStore.get().run?.id === id;

export const dismissResult = () => patch({ result: null });
