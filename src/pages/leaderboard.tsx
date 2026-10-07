// /leaderboard: the CTF leaderboard, standalone like /start (shares its header and tokens). Infrastructure: must stay accessible.
// Scores come from the shared Google Sheet when configured (src/ctf/remote.ts), else this browser; reloaded on
// every visit, every 30 seconds and whenever the tab comes back into view.
// CSS: styles/features/leaderboard.css.
import { useEffect, useState } from "react";
import { Link, type MetaFunction } from "react-router";
import { challenges } from "~/ctf/challenges";
import { arrow, AT_ICONS } from "~/ctf/icons";
import * as board from "~/ctf/leaderboard";

export const meta: MetaFunction = () => [{ title: "Leaderboard · Pope Tech Challenges" }];

const BASE = import.meta.env.BASE_URL;
const MEDALS = ["gold", "silver", "bronze"];
const REFRESH_MS = 30_000;
const key = (h: string) => h.trim().toLowerCase();

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<board.Entry[] | null>(null);
  const [source, setSource] = useState<board.Source>("local");
  useEffect(() => {
    let live = true;
    const refresh = () => void board.loadBoard().then((b) => { if (live) { setEntries(b.entries); setSource(b.source); } });
    const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
    refresh();
    const t = setInterval(refresh, REFRESH_MS);
    document.addEventListener("visibilitychange", onVisible);
    return () => { live = false; clearInterval(t); document.removeEventListener("visibilitychange", onVisible); };
  }, []);

  const overall = board.rankOverall(entries ?? []);
  const perChallenge = new Map(challenges.map((c) => [c.id, board.rankChallenge(entries ?? [], c.id)]));
  const best = (handle: string, id: (typeof challenges)[number]["id"]) => perChallenge.get(id)!.find((r) => key(r.handle) === key(handle))?.score;

  return (
    <main id="main-content" className="start lb">
      <header className="start-head">
        <div className="start-kicker"><img src={`${BASE}brand/pope-tech-mark.svg`} alt="" width="28" height="28" />Pope Tech Challenges</div>
        <h1>Leaderboard</h1>
        <p className="start-lede">The best scores from the assistive technology challenges. Each name's total is the sum of its best run on every challenge.</p>
        <p className="lb-source">
          <span className={`lb-dot lb-dot--${source}`} aria-hidden="true" />
          {source === "shared" ? "Shared scores from every device" : source === "offline" ? "Couldn't reach the shared scores. Showing this device only." : "Scores from this device"}
        </p>
      </header>

      {entries === null ? <p className="lb-loading" role="status">Loading scores…</p> : overall.length === 0 ? (
        <section className="lb-empty" aria-labelledby="lb-empty-title">
          <div className="lb-empty-art" aria-hidden="true">
            {challenges.map((c) => <span key={c.id} className={`lb-icon lb-icon--${c.id}`}>{AT_ICONS[c.id]}</span>)}
          </div>
          <h2 id="lb-empty-title">No finished runs yet</h2>
          <p>Be the first name on the board. Pick a challenge to start.</p>
          <ul className="lb-empty-links">
            {challenges.map((c) => <li key={c.id}><Link className="start-cta" to={c.path}>{c.title} {arrow}</Link></li>)}
          </ul>
        </section>
      ) : (
        <>
          <section className="lb-podium-wrap" aria-labelledby="lb-top-title">
            <h2 id="lb-top-title" className="lb-h2">Top players</h2>
            <ol className="lb-podium">
              {overall.slice(0, 3).map((r, i) => (
                <li key={r.handle} className={`lb-podium-item lb-podium-item--${MEDALS[i]}`}>
                  <span className="lb-medal" aria-hidden="true">{i + 1}</span>
                  <span className="visually-hidden">Rank {i + 1}: </span>
                  <span className="lb-podium-name">{r.handle}</span>
                  <span className="lb-podium-score">{r.score.toLocaleString("en-US")} <small>points</small></span>
                  <span className="lb-podium-step" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </section>

          <section className="lb-card" aria-labelledby="lb-overall-title">
            <h2 id="lb-overall-title" className="lb-h2">Overall standings</h2>
            <div className="lb-table-wrap" tabIndex={0} role="region" aria-labelledby="lb-overall-title">
              <table className="lb-table">
                <thead>
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">Name</th>
                    {challenges.map((c) => <th key={c.id} scope="col">{c.title}</th>)}
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {overall.slice(0, 50).map((r, i) => (
                    <tr key={r.handle}>
                      <td><span className={`lb-rank${i < 3 ? ` lb-rank--${MEDALS[i]}` : ""}`}>{i + 1}</span></td>
                      <th scope="row">{r.handle}</th>
                      {challenges.map((c) => <td key={c.id} className="lb-num">{best(r.handle, c.id) ?? <><span aria-hidden="true">–</span><span className="visually-hidden">Not finished</span></>}</td>)}
                      <td className="lb-num lb-total">{r.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <ul className="lb-challenges">
            {challenges.map((c) => {
              const rows = perChallenge.get(c.id)!;
              return (
                <li key={c.id} className={`lb-ch lb-ch--${c.id}`}>
                  <div className="lb-ch-head">
                    <span className={`lb-icon lb-icon--${c.id}`}>{AT_ICONS[c.id]}</span>
                    <div><h2>{c.title}</h2><p>{c.at}</p></div>
                  </div>
                  {rows.length ? (
                    <ol className="lb-ch-list">
                      {rows.slice(0, 5).map((r, i) => (
                        <li key={r.handle}>
                          <span className={`lb-rank${i < 3 ? ` lb-rank--${MEDALS[i]}` : ""}`} aria-hidden="true">{i + 1}</span>
                          <span className="lb-ch-name">{r.handle}</span>
                          {r.detail?.noMouse && <span className="lb-badge">No mouse</span>}
                          <span className="lb-num">{r.score}</span>
                        </li>
                      ))}
                    </ol>
                  ) : <p className="lb-ch-empty">No finished runs yet.</p>}
                  <Link className="lb-ch-play" to={c.path}>Play {c.title} {arrow}</Link>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <p className="lb-back"><Link to="/ctf">About the challenges</Link> · <Link to="/start">Back to the demo home</Link></p>
    </main>
  );
}
