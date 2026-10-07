// Optional shared leaderboard in a Google Sheet, through the Apps Script web app in scripts/leaderboard-sheet.gs.
// Off unless VITE_LEADERBOARD_URL is set at build time; then every finish is also sent there and the leaderboard
// is read from the sheet alone (leaderboard.loadBoard). Attempts stay per browser (leaderboard.ts).
import { challenges, type ChallengeId } from "./challenges";
import type { Best, Entry } from "./leaderboard";

const URL_: string | undefined = import.meta.env.VITE_LEADERBOARD_URL;
export const enabled = Boolean(URL_);

const ids = new Set<string>(challenges.map((c) => c.id));

/** Fire and forget: a failed send only means the finish isn't shared. text/plain avoids a CORS preflight. */
export function push(handle: string, challengeId: ChallengeId, best: Best) {
  if (!URL_) return;
  fetch(URL_, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ handle, challengeId, ...best }) })
    .catch(() => { /* offline: the local board still has it */ });
}

/** Every finish in the sheet, as entries (attempts unknown: 0). */
export async function pull(): Promise<Entry[]> {
  if (!URL_) return [];
  const res = await fetch(URL_, { cache: "no-store" }); // always the sheet as it is now
  const rows: unknown = await res.json();
  if (!Array.isArray(rows)) return [];
  return rows.flatMap((r) => {
    const handle = String(r?.handle ?? "").trim(); // Sheets turns a name like "007" into a number
    if (!handle || !ids.has(r.challengeId) || !Number.isFinite(+r.score)) return [];
    return [{ handle, challengeId: r.challengeId, attempts: 0, best: { score: +r.score, flag: String(r.flag ?? ""), finishedAt: String(r.finishedAt ?? ""), noMouse: r.noMouse === true || r.noMouse === "TRUE" } }];
  });
}
