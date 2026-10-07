// Plan 11 §4: the CTF leaderboard. The one thing on the site kept in localStorage (ADR-061): every player uses
// the same laptop, so the board only needs to outlive reloads on that browser. Nothing else reads this key, so
// a reload still resets the site itself. Every access is wrapped: private windows, blocked storage and the
// prerender step all just see an empty board.
import { challenges, type ChallengeId } from "./challenges";
import * as remote from "./remote";

const KEY = "rsu-ctf-leaderboard";
/** The first try plus three retries, per handle per challenge. */
export const MAX_ATTEMPTS = 4;

export interface Best { score: number; flag: string; finishedAt: string; noMouse: boolean }
export interface Entry { handle: string; challengeId: ChallengeId; attempts: number; best?: Best }

export function load(): Entry[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((e): e is Entry => typeof e?.handle === "string" && typeof e?.attempts === "number") : [];
  } catch {
    return [];
  }
}

function save(entries: Entry[]) {
  try { localStorage.setItem(KEY, JSON.stringify(entries)); } catch { /* storage blocked: the board just doesn't persist */ }
}

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
const find = (entries: Entry[], handle: string, id: ChallengeId) => entries.find((e) => e.challengeId === id && same(e.handle, handle));

export const attemptsUsed = (handle: string, id: ChallengeId) => find(load(), handle, id)?.attempts ?? 0;

/** Uses up one attempt. False (and nothing saved) when the handle has none left. */
export function startAttempt(handle: string, id: ChallengeId): boolean {
  const entries = load();
  const entry = find(entries, handle, id);
  if (entry && entry.attempts >= MAX_ATTEMPTS) return false;
  if (entry) entry.attempts++;
  else entries.push({ handle: handle.trim(), challengeId: id, attempts: 1 });
  save(entries);
  return true;
}

/** Keeps the best finished score per handle per challenge. */
export function recordFinish(handle: string, id: ChallengeId, best: Best) {
  const entries = load();
  const entry = find(entries, handle, id) ?? { handle: handle.trim(), challengeId: id, attempts: 1 };
  if (!entries.includes(entry)) entries.push(entry);
  if (!entry.best || best.score > entry.best.score) entry.best = best;
  save(entries);
  remote.push(handle.trim(), id, best);
}

/** One entry per name per challenge, keeping the best score (the sheet has a row for every finished run). */
export function bestOf(rows: Entry[]): Entry[] {
  const out: Entry[] = [];
  for (const r of rows) {
    const e = find(out, r.handle, r.challengeId);
    if (!e) out.push({ ...r });
    else if (r.best && (!e.best || r.best.score > e.best.score)) e.best = r.best;
  }
  return out;
}

export type Source = "local" | "shared" | "offline";

/**
 * The board to show, fetched fresh every call. With the shared sheet configured it is the only source, so rows
 * deleted there disappear here; if it can't be reached, this browser's scores are shown instead.
 */
export async function loadBoard(): Promise<{ entries: Entry[]; source: Source }> {
  if (!remote.enabled) return { entries: load(), source: "local" };
  try {
    return { entries: bestOf(await remote.pull()), source: "shared" };
  } catch {
    return { entries: load(), source: "offline" };
  }
}

export interface Row { handle: string; score: number; detail?: Best }

export function rankChallenge(entries: Entry[], id: ChallengeId): Row[] {
  return entries.filter((e) => e.challengeId === id && e.best)
    .map((e) => ({ handle: e.handle, score: e.best!.score, detail: e.best }))
    .sort((a, b) => b.score - a.score);
}

/** Sum of each handle's best score per challenge. */
export function rankOverall(entries: Entry[]): Row[] {
  const totals = new Map<string, Row>();
  for (const e of entries) {
    if (!e.best) continue;
    const key = e.handle.trim().toLowerCase();
    const row = totals.get(key) ?? { handle: e.handle, score: 0 };
    row.score += e.best.score;
    totals.set(key, row);
  }
  return [...totals.values()].sort((a, b) => b.score - a.score);
}

const cell = (v: string | number | boolean) => `"${String(v).replace(/"/g, '""')}"`;

export function toCsv(entries: Entry[]): string {
  const title = new Map(challenges.map((c) => [c.id, c.title]));
  const rows = entries.map((e) => [e.handle, title.get(e.challengeId) ?? e.challengeId, e.attempts, e.best?.score ?? "", e.best?.flag ?? "", e.best?.finishedAt ?? "", e.best ? e.best.noMouse : ""]);
  return [["Name", "Challenge", "Attempts", "Best score", "Flag", "Finished at", "No mouse"], ...rows].map((r) => r.map(cell).join(",")).join("\n");
}
