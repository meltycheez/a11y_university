// /ctf: the marketing page for the assistive technology challenges. Short on purpose: the full rules live in
// each page's challenge bar. Standalone like /start and /leaderboard (shares their tokens). Infrastructure: must
// stay accessible. CSS: styles/features/ctf-page.css.
import { useEffect, useState } from "react";
import { Link, type MetaFunction } from "react-router";
import { scenarios } from "~/a11y/registry";
import { challenges, type ChallengeId } from "~/ctf/challenges";
import { arrow, AT_ICONS } from "~/ctf/icons";
import * as board from "~/ctf/leaderboard";

export const meta: MetaFunction = () => [{ title: "Take the Challenge · Pope Tech" }];

const BASE = import.meta.env.BASE_URL;
const PITCH: Record<ChallengeId, { hook: string; line: string; face: string[] }> = {
  "apply-sr": {
    hook: "Apply to college with your monitor off.", line: "Fill out a real application by ear. Five seconds in, the form disappears.",
    face: ["Fields that announce the wrong name", "A tab order that jumps all over the form", "A code that only appears in an image"],
  },
  "registration-voice": {
    hook: "Register for classes without lifting a finger.", line: "Search, drag and click with your voice alone. Hands stay off the keyboard.",
    face: ["Buttons that don't answer to what they say", "A cart you can only reorder by dragging", "A warning with a nameless button"],
  },
  "map-eyes": {
    hook: "Find your way across campus with your eyes.", line: "Pan the map and check in at the observatory with eye tracking only.",
    face: ["A map that only moves when you drag it", "A tooltip that vanishes if your gaze drifts", "A tiny button racing a timeout"],
  },
};
const count = (path: string, category: "error" | "alert") =>
  [...scenarios.values()].filter((s) => s.pages.includes(path) && s.category === category).length;

// WAVE's error (red square, white X) and alert (yellow triangle, black !) icons, redrawn. Decorative: the text says it.
const WaveError = () => (
  <svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true"><rect x="1" y="1" width="18" height="18" rx="2.5" fill="#c00" /><rect x="2.6" y="2.6" width="14.8" height="14.8" rx="1.5" fill="none" stroke="#fff" strokeWidth="1.2" /><path d="M6.5 6.5l7 7M13.5 6.5l-7 7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /></svg>
);
const WaveAlert = () => (
  <svg viewBox="0 0 22 20" width="24" height="22" aria-hidden="true"><path d="M11 1.2 21 18.8H1z" fill="#f7b500" stroke="#7a5800" strokeWidth="1.2" strokeLinejoin="round" /><rect x="10" y="6.6" width="2" height="6.6" rx="1" /><circle cx="11" cy="15.6" r="1.25" /></svg>
);

export default function CtfPage() {
  const [top, setTop] = useState<board.Row[] | null>(null);
  useEffect(() => {
    let live = true;
    void board.loadBoard().then((b) => { if (live) setTop(board.rankOverall(b.entries).slice(0, 3)); });
    return () => { live = false; };
  }, []);

  return (
    <main id="main-content" className="start cp">
      <section className="start-head cp-hero" aria-labelledby="cp-title">
        <div className="start-kicker"><img src={`${BASE}brand/pope-tech-mark.svg`} alt="" width="28" height="28" />Pope Tech Challenges</div>
        <h1 id="cp-title">No mouse. No screen. <span>No problem?</span></h1>
        <p className="start-lede">Three real tasks. Every accessibility issue switched on. One assistive technology each. Capture the flag and claim your spot on the leaderboard.</p>
        <div className="cp-hero-art" aria-hidden="true">
          {challenges.map((c) => <span key={c.id} className={`lb-icon lb-icon--${c.id}`}>{AT_ICONS[c.id]}</span>)}
        </div>
      </section>

      <section id="cp-challenges" className="cp-challenges" aria-labelledby="cp-challenges-title">
        <h2 id="cp-challenges-title" className="cp-h2">Choose your challenge</h2>
        <ul className="cp-cards">
          {challenges.map((c) => (
            <li key={c.id} className={`cp-card cp-card--${c.id}`}>
              <div className="lb-ch-head">
                <span className={`lb-icon lb-icon--${c.id}`}>{AT_ICONS[c.id]}</span>
                <div className="cp-card-title"><h3>{c.title}</h3><p>{c.at}</p></div>
              </div>
              <div className="cp-card-body">
                <p><strong>{PITCH[c.id].hook}</strong> {PITCH[c.id].line}</p>
                <div className="cp-face">
                  <h4 id={`cp-face-${c.id}`}>What you'll face</h4>
                  <ul aria-labelledby={`cp-face-${c.id}`}>{PITCH[c.id].face.map((f) => <li key={f}>{f}</li>)}</ul>
                  <ul className="cp-card-count" aria-label="Accessibility issues on the page">
                    <li><WaveError /><span><b>{count(c.path, "error")}</b> Errors</span></li>
                    <li><WaveAlert /><span><b>{count(c.path, "alert")}</b> Alerts</span></li>
                  </ul>
                </div>
                <Link className="start-cta" to={c.path}>Accept the challenge<span className="visually-hidden">: {c.title}</span> {arrow}</Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="cp-how" aria-labelledby="cp-how-title">
        <h2 id="cp-how-title" className="cp-h2">How it works</h2>
        <ol>
          <li><b>Pick your tech</b><span>Screen reader, voice control or eye tracking. That's all you get.</span></li>
          <li><b>Beat the page</b><span>Finish the task with every issue on. Fixes and hints cost points; speed earns them.</span></li>
          <li><b>Feel the difference</b><span>Then replay it with every issue fixed and see what accessible really means.</span></li>
        </ol>
      </section>

      <section className="cp-board" aria-labelledby="cp-board-title">
        <h2 id="cp-board-title" className="cp-h2">Who's on top?</h2>
        {top === null ? <p className="lb-loading" role="status">Loading scores…</p> : top.length ? (
          <ol className="cp-top">
            {top.map((r, i) => (
              <li key={r.handle}>
                <span className={`lb-rank lb-rank--${["gold", "silver", "bronze"][i]}`} aria-hidden="true">{i + 1}</span>
                <span className="cp-top-name">{r.handle}</span>
                <span className="cp-top-score">{r.score.toLocaleString("en-US")} points</span>
              </li>
            ))}
          </ol>
        ) : <p className="cp-board-empty">The board is empty. Your name could be first.</p>}
        <Link className="start-cta" to="/leaderboard">Full leaderboard {arrow}</Link>
      </section>

      <p className="lb-back"><Link to="/start">Back to the demo home</Link></p>
    </main>
  );
}
