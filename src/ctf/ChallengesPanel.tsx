// Plan 11 §3: the Pope Tech Accessibility Lab widget's Challenges tab. The same on every page: the challenge list, the leaderboard
// and the scoring rules. Everything for one challenge lives in its page's ChallengeBanner.
// Infrastructure: fully accessible, registers no scenarios.
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Modal } from "~/components/Modal";
import { Tabs } from "~/components/Tabs";
import { allChallenges, challengeById, challenges, type ChallengeId } from "./challenges";
import * as board from "./leaderboard";
import { ctfStore, FIX_PENALTY, HIGHLIGHT_PENALTY, HINT_COSTS, REVEAL_PENALTY } from "./store";

export function ChallengesPanel() {
  const { best } = ctfStore.use();
  return (
    <div className="ctf-panel">
      <h3 className="ctf-h">Assistive technology challenges</h3>
      <p>Complete a task on a university page using assistive technology, with every accessibility issue switched on. Each challenge page has a challenge bar with its instructions and a Start button.</p>
      <ul className="ctf-list">
        {allChallenges.map((c) => (
          <li key={c.id} className={c.advanced ? "ctf-list-hard" : undefined}>
            <Link to={c.path}>{c.title}</Link>{c.advanced && <> <span className="ctf-badge">Advanced</span></>}
            <span className="ctf-meta">
              {c.at} · about {c.timeLimitMin} min · {c.basePoints} points{c.advanced && " · own leaderboard"}
              {best[c.id] !== undefined && ` · your best this session: ${best[c.id]}`}
            </span>
          </li>
        ))}
      </ul>
      <div className="ctf-footer">
        <LeaderboardButton />
        <Scoring />
      </div>
    </div>
  );
}

export function Scoring() {
  return (
    <details className="ctf-scoring">
      <summary>How scoring works</summary>
      <ul>
        <li>Each challenge starts at 500 points.</li>
        <li>Once you start, you will get options to turn on fixes for errors, alerts and manual testing issues, highlight those issues on the page, show the form again (screen reader challenges) or get a hint. Each one costs points:</li>
        <li>The Fix switches remove the page's accessibility issues, one category at a time (errors, alerts or manual testing issues). They're in the challenge bar once you start, and in this widget's Fixes tab. Turning one on during a run costs {FIX_PENALTY} points the first time; Fix All turns on all three, so it costs {FIX_PENALTY * 3}.</li>
        <li>Each Fix switch has a Highlight checkbox that outlines that category's issues on the page. Turning one on during a run costs {HIGHLIGHT_PENALTY} points the first time.</li>
        <li>After you finish, you can replay the challenge with every issue fixed. That comparison run is free and isn't scored.</li>
        <li>Hints cost {HINT_COSTS.join(", then ")} points.</li>
        <li>Show the form (screen reader challenges, where the form fades out during a run) costs {REVEAL_PENALTY} points, once.</li>
        <li>Finishing quickly adds up to 100 points, falling to 0 at 5 minutes (20 minutes for the advanced version).</li>
        <li>Each name gets {board.MAX_ATTEMPTS} attempts per challenge (the first try plus {board.MAX_ATTEMPTS - 1} retries); the leaderboard keeps the best score. Starting a run uses an attempt, even if you reload or abandon it.</li>
      </ul>
    </details>
  );
}

/** "View leaderboard" plus the modal it opens. Opened from an advanced challenge, it starts on that challenge's own tab
 * (its scores aren't in Overall); otherwise on Overall. It shows the last loaded scores at once, then updates (plan 13 §2). */
export function LeaderboardButton({ challenge }: { challenge?: ChallengeId }) {
  const start = challenge && challengeById.get(challenge)?.advanced ? 1 + allChallenges.findIndex((c) => c.id === challenge) : 0;
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<board.Entry[]>([]);
  const [updating, setUpdating] = useState(false);
  useEffect(() => {
    if (!open) return;
    let live = true;
    setEntries(board.peekBoard().entries);
    setUpdating(true);
    void board.loadBoard().then((b) => { if (live) { setEntries(b.entries); setUpdating(false); } });
    return () => { live = false; };
  }, [open]);

  const table = (caption: string, rows: board.Row[]) =>
    rows.length ? (
      <table className="ctf-table ctf-board">
        <caption>{caption}</caption>
        <thead><tr><th scope="col">Rank</th><th scope="col">Name</th><th scope="col">Score</th></tr></thead>
        <tbody>{rows.slice(0, 25).map((r, i) => <tr key={r.handle}><td>{i + 1}</td><th scope="row">{r.handle}</th><td>{r.score}</td></tr>)}</tbody>
      </table>
    ) : <p>No finished runs yet.</p>;

  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([board.toCsv(entries)], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `ctf-leaderboard-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <button type="button" className="ctf-btn ctf-btn--quiet" onClick={() => setOpen(true)}>View leaderboard</button>
      <Modal open={open} title="Pope Tech Challenges leaderboard" onClose={() => setOpen(false)}>
        <p className="ctf-board-intro">Scores from the Pope Tech Challenges, where you complete a task on this site using assistive technology. Overall adds up each player's best score on the {challenges.length} main challenges. Each other tab is one challenge.</p>
        <p className="ctf-meta" role="status">{updating ? "Updating scores…" : ""}</p>
        <Tabs
          label="Leaderboard: overall, or by challenge"
          initial={start}
          group={{ before: 1, text: "By challenge:" }}
          tabs={[
            { label: "Overall", content: table(`Overall: each player's best scores on ${challenges.map((c) => c.title).join(", ")}, added up`, board.rankOverall(entries)) },
            ...allChallenges.map((c) => ({ label: c.advanced ? `${c.title} (advanced)` : c.title, content: table(`${c.title}: ${c.at.toLowerCase()} challenge${c.advanced ? ", advanced version, not in the overall total" : ""}`, board.rankChallenge(entries, c.id)) })),
          ]}
        />
        <div className="ctf-actions">
          <Link className="ctf-btn ctf-btn--quiet" to="/leaderboard" onClick={() => setOpen(false)}>Open the full leaderboard</Link>
          <button type="button" className="ctf-btn ctf-btn--quiet" onClick={exportCsv}>Export CSV</button>
        </div>
      </Modal>
    </>
  );
}
