// Plan 11 §3: the Pope Tech Accessibility Lab widget's Challenges tab. The same on every page: the challenge list, the leaderboard
// and the scoring rules. Everything for one challenge lives in its page's ChallengeBanner.
// Infrastructure: fully accessible, registers no scenarios.
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Modal } from "~/components/Modal";
import { Tabs } from "~/components/Tabs";
import { challenges } from "./challenges";
import * as board from "./leaderboard";
import { ctfStore, FIX_PENALTY, HIGHLIGHT_PENALTY, HINT_COSTS } from "./store";

export function ChallengesPanel() {
  const { best } = ctfStore.use();
  return (
    <div className="ctf-panel">
      <h3 className="ctf-h">Assistive technology challenges</h3>
      <p>Complete a task on a university page using assistive technology, with every accessibility issue switched on. Each challenge page has a challenge bar with its instructions and a Start button.</p>
      <ul className="ctf-list">
        {challenges.map((c) => (
          <li key={c.id}>
            <Link to={c.path}>{c.title}</Link>
            <span className="ctf-meta">{c.at} · {c.basePoints} points{best[c.id] !== undefined && ` · your best this session: ${best[c.id]}`}</span>
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
        <li>Turning on a Fix switch during a run costs {FIX_PENALTY} points, once per category (Fix All counts as three).</li>
        <li>Turning on a highlight costs {HIGHLIGHT_PENALTY} points, once per category.</li>
        <li>Hints cost {HINT_COSTS.join(", then ")} points.</li>
        <li>Finishing quickly adds up to 100 points, falling to 0 at 20 minutes.</li>
        <li>Each name gets {board.MAX_ATTEMPTS} attempts per challenge (the first try plus {board.MAX_ATTEMPTS - 1} retries); the leaderboard keeps the best score. Starting a run uses an attempt, even if you reload or abandon it.</li>
      </ul>
    </details>
  );
}

/** "View leaderboard" plus the modal it opens. */
export function LeaderboardButton() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<board.Entry[]>([]);
  useEffect(() => {
    if (!open) return;
    let live = true;
    void board.loadBoard().then((b) => { if (live) setEntries(b.entries); });
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
      <Modal open={open} title="CTF Leaderboard" onClose={() => setOpen(false)}>
        <Tabs
          label="Leaderboard"
          tabs={[
            { label: "Overall", content: table("Overall: sum of each name's best score per challenge", board.rankOverall(entries)) },
            ...challenges.map((c) => ({ label: c.title, content: table(`${c.title} (${c.at})`, board.rankChallenge(entries, c.id)) })),
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
