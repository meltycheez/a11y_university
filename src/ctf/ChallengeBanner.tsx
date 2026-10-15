// Plan 11 §3, reorganized in plan 13 §4: the challenge bar embedded on a CTF page. It holds everything for that
// challenge: the start view, the name step, the instructions, the run (score, hints, Fix switches, the pinned side
// panel) and the results, plus the source viewer and the leaderboard. Infrastructure: fully accessible, registers
// no scenarios.
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { FixControls } from "~/a11y/PopeTechWidget";
import { Modal } from "~/components/Modal";
import { challengeById, type Challenge, type ChallengeId, type SetupSection } from "./challenges";
import { LeaderboardButton, Scoring } from "./ChallengesPanel";
import { useConfirm } from "./ConfirmDialog";
import * as board from "./leaderboard";
import {
  checkStart, ctfStore, dismissResult, endRun, FIX_PENALTY, HIGHLIGHT_PENALTY, HINT_COSTS, hintCost, liveScore, REVEAL_PENALTY,
  retryWithFixes, revealPage, startRun, takeHint, type StartError,
} from "./store";

/** "Screen reader" → "screen reader", for "your screen reader" in running text. */
const lower = (t: string) => t[0].toLowerCase() + t.slice(1);

const pts = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n)}`;

/**
 * `onReset` puts the page's task back to its starting state (an empty form, cart or check-in box). The bar calls it
 * whenever a run starts, scored or comparison, and when a run is abandoned, so no attempt starts with the previous
 * attempt's answers (plan 13 §5).
 */
export function ChallengeBanner({ id, onReset }: { id: ChallengeId; onReset?: () => void }) {
  const { run, result, handle: lastHandle, compare } = ctfStore.use();
  const c = challengeById.get(id)!;
  const titleId = useId();
  const title = useRef<HTMLHeadingElement>(null);
  const [sourceOpen, setSourceOpen] = useState(false);
  // Starting replaces the Start button, so focus moves to the running state's heading.
  const [started, setStarted] = useState(0);
  // Before a run: "closed" is the heading and a Start Challenge button, "name" asks for the player's name,
  // "ready" shows the instructions with Start the Challenge at the bottom.
  const [stage, setStage] = useState<"closed" | "name" | "ready">("closed");
  const [handle, setHandle] = useState(lastHandle);
  const [error, setError] = useState<StartError | null>(null);
  const starting = !run && result?.id !== id;
  const comparing = compare === id; // after "Try again with all issues fixed": the next start is the comparison run
  // The name step disappears on Continue, so focus goes to the bar's heading to read the challenge from the top.
  useEffect(() => { if (stage === "ready") title.current?.focus(); }, [stage]);
  // Load the leaderboard early so View leaderboard opens with fresh scores (the shared sheet is slow).
  useEffect(() => { void board.loadBoard(); }, []);

  const begin = () => {
    const err = startRun(c.id, handle, { compare: comparing });
    setError(err);
    if (err) { setStage("name"); return; } // only if attempts ran out in another tab since the name step
    onReset?.();
    setStarted((n) => n + 1);
  };
  // Back to the instructions; focus the bar's heading after the results unmount (the stage may already be "ready").
  const focusTitle = () => setTimeout(() => title.current?.focus());
  const playAgain = () => { onReset?.(); dismissResult(); setStage("ready"); focusTitle(); };
  const tryFixed = () => { onReset?.(); retryWithFixes(c.id); setStage("ready"); focusTitle(); };

  const advanced = c.advanced && (
    <p className="ctf-meta ctf-advanced"><span className="ctf-badge">Advanced</span> Takes about {c.timeLimitMin} minutes. Scores go on this challenge's own leaderboard and don't count toward your overall total.</p>
  );
  let content: React.ReactNode;
  if (run && run.id !== id) {
    content = <p>Another challenge is running: <Link to={challengeById.get(run.id)!.path}>{challengeById.get(run.id)!.title}</Link>. Finish or abandon it there first.</p>;
  } else if (run) {
    content = <div className="ctf-banner-body"><Running challenge={c} focusKey={started} onReset={onReset} /></div>;
  } else if (result?.id === id) {
    content = <>{!result.compare && advanced}<Finished challenge={c} onPlayAgain={playAgain} onTryFixed={tryFixed} onSource={() => setSourceOpen(true)} /></>;
  } else if (stage === "closed") {
    content = <>
      <p className="ctf-context">
        Pope Tech created these challenges so anyone can experience a website using different assistive technologies.{" "}
        <Link to="/ctf">Learn more about Pope Tech Challenges</Link>.
      </p>
      {advanced}
      <div className="ctf-actions">
        <button type="button" className="ctf-btn ctf-btn--icon" onClick={() => setStage("name")}>
          Start Challenge
          <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8h11M9 4l4 4-4 4" /></svg>
        </button>
        <LeaderboardButton challenge={c.id} />
      </div>
    </>;
  } else if (stage === "name") {
    content = <>{advanced}<NameForm
      challenge={c} handle={handle} error={error}
      onChange={(h) => { setHandle(h); setError(null); }}
      onError={setError}
      onDone={() => setStage("ready")}
    /></>;
  } else if (comparing) {
    // After "Try again with all issues fixed": just what's different about the comparison run, then Start.
    content = <>
      <h3 className="ctf-h">Comparison run</h3>
      <p className="ctf-brief">Try the challenge again with your {lower(c.at)}. Now, every issue is fixed. Notice what's different from your first try.</p>
      <div className="ctf-before" id={`${titleId}-before`}>
        <h4 className="ctf-h4">Before you start</h4>
        <ul>
          {c.beforeStart && <li>Like your first run, {lower(c.beforeStart)}</li>}
          <li>This run isn't scored and doesn't use an attempt. Hints{c.reveal ? ` and ${c.reveal}` : ""} don't cost points.</li>
        </ul>
      </div>
      <div className="ctf-actions ctf-start-go">
        <button type="button" className="ctf-btn" onClick={begin} aria-describedby={`${titleId}-before`}>Start comparison run</button>
        <LeaderboardButton challenge={c.id} />
        <Link className="ctf-btn ctf-btn--quiet" to="/ctf">Explore more challenges</Link>
      </div>
    </>;
  } else {
    // The instructions: task, rules, setup, scoring, what happens when you start, then Start.
    content = <>
      {advanced}
      <p className="ctf-brief">{c.brief}</p>
      <AdvancedLink challenge={c} />
      <Rules challenge={c} />
      <Setup title={c.setupTitle} sections={c.setup} open />
      {c.moreSetup && <Setup title={c.moreSetup.title} sections={c.moreSetup.sections} />}
      <Scoring />
      <div className="ctf-before" id={`${titleId}-before`}>
        <h3 className="ctf-h4">Before you start</h3>
        <ul>
          {c.beforeStart && <li>{c.beforeStart}</li>}
          <li>Starting uses 1 of your {board.MAX_ATTEMPTS} attempts and turns off any Fix switches.</li>
          <li>During the challenge, the bar on this page lets you get hints, fixes or highlights for points. {c.panelLabel ?? "The instructions"} stay pinned to the side of the screen.</li>
        </ul>
      </div>
      <div className="ctf-actions ctf-start-go">
        <button type="button" className="ctf-btn" onClick={begin} aria-describedby={`${titleId}-before`}>Start the Challenge</button>
        <LeaderboardButton challenge={c.id} />
        <p className="ctf-meta">Playing as {handle.trim()}. <button type="button" className="ctf-link-btn" onClick={() => setStage("name")}>Change name</button></p>
      </div>
    </>;
  }

  return (
    <section className="ctf-banner" aria-labelledby={titleId}>
      <div className="ctf-banner-head">
        <img src={`${import.meta.env.BASE_URL}brand/pope-tech-mark.svg`} alt="" width="32" height="32" />
        {/* tabIndex: the widget moves focus here when its Challenges link brings you to this page. */}
        <h2 ref={title} id={titleId} className="ctf-banner-title" tabIndex={-1}>Pope Tech Challenge: {c.title}</h2>
        <p className="ctf-banner-at"><strong>Assistive technology: {c.at}</strong></p>
      </div>
      {content}
      <SourceModal challenge={c} open={sourceOpen} onClose={() => setSourceOpen(false)} />
    </section>
  );
}

/** Allowed / not allowed / costs points, as chips, with the full explanations one click away. */
function Rules({ challenge: c }: { challenge: Challenge }) {
  const costs = [
    { label: `Fix switches −${FIX_PENALTY}`, detail: `The Fix switches (in this bar once you start) remove this page's accessibility issues, one category at a time: errors, alerts or manual testing issues. Turning one on during a run costs ${FIX_PENALTY} points the first time. Fix All turns on all three, so it costs ${FIX_PENALTY * 3}. Turning a fix off again is free.` },
    { label: `Highlights −${HIGHLIGHT_PENALTY}`, detail: `Each Fix switch has a Highlight checkbox that outlines that category's issues on the page, so you can see where they are. Turning one on during a run costs ${HIGHLIGHT_PENALTY} points the first time. A fixed category has nothing left to highlight.` },
    { label: `Hints −${HINT_COSTS.join(", −")}`, detail: `There are ${c.hints.length} hints. They cost ${HINT_COSTS.join(", then ")} points.` },
    ...(c.reveal ? [{ label: `${c.reveal} −${REVEAL_PENALTY}`, detail: `The ${c.reveal} button in this bar brings the faded-out page back for the rest of the run. It costs ${REVEAL_PENALTY} points, once.` }] : []),
  ];
  const groups = [
    { key: "yes", title: "Allowed", icon: "✓", rules: c.allowed },
    { key: "no", title: "Discouraged", icon: "✕", rules: c.notAllowed },
    { key: "cost", title: "Costs points", icon: "−", rules: costs },
  ];
  return (
    <div className="ctf-rules">
      {groups.map((g) => (
        <div key={g.key} className={`ctf-rule-group ctf-rule-group--${g.key}`}>
          <h3 className="ctf-rule-title">{g.title}</h3>
          <ul className="ctf-chips">
            {g.rules.map((r) => <li key={r.label} className="ctf-chip"><span aria-hidden="true" className="ctf-chip-icon">{g.icon}</span>{r.label}</li>)}
          </ul>
        </div>
      ))}
      <details className="ctf-rules-more">
        <summary>More about what's allowed and what isn't</summary>
        {groups.map((g) => (
          <div key={g.key}>
            <h4 className="ctf-h4">{g.title}</h4>
            <dl className="ctf-rule-list">
              {g.rules.map((r) => <div key={r.label}><dt>{r.label}</dt><dd>{r.detail}</dd></div>)}
            </dl>
          </div>
        ))}
      </details>
    </div>
  );
}

/** Setting up the challenge's assistive technology, with links to help. Open before a run, collapsed during one. */
function Setup({ title, sections, open }: { title: string; sections: SetupSection[]; open?: boolean }) {
  return (
    <details className="ctf-rules-more ctf-setup" open={open}>
      <summary>{title}</summary>
      {sections.map((s, i) => (
        <div key={s.heading ?? i}>
          {s.heading && <h4 className="ctf-h4">{s.heading}</h4>}
          {s.text && <p>{s.text}</p>}
          {s.items && (s.ordered
            ? <ol className="ctf-instructions">{s.items.map((t) => <li key={t}>{t}</li>)}</ol>
            : <ul className="ctf-instructions">{s.items.map((t) => <li key={t}>{t}</li>)}</ul>)}
          {s.rows && (
            <table className="ctf-table ctf-setup-table">
              <thead><tr>{s.columns!.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
              <tbody>{s.rows.map(([a, b]) => <tr key={a}><th scope="row">{a}</th><td>{b}</td></tr>)}</tbody>
            </table>
          )}
          {s.links && (
            <ul className="ctf-instructions">
              {s.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}<span className="visually-hidden"> (opens in a new tab)</span></a>
                  {l.note && ` ${l.note}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </details>
  );
}

/** "More time? Try the advanced version: …" for a booth challenge that has one (`Challenge.harder`). */
function AdvancedLink({ challenge: c }: { challenge: Challenge }) {
  const h = c.harder && challengeById.get(c.harder);
  return h ? <p className="ctf-meta">More time? <Link to={h.path}>Try the advanced version: {h.title}</Link> ({h.at.toLowerCase()}, about {h.timeLimitMin} minutes).</p> : null;
}

const startErrors: Record<StartError, (h: string) => string> = {
  handle: () => "Enter your name to start.",
  name: () => "Please choose a different name.",
  attempts: (h) => `No attempts left for ${h.trim()} on this challenge.`,
};

/** The name step: one field and a submit button. It checks the name and attempts left but uses no attempt yet. */
function NameForm({ challenge: c, handle, error, onChange, onError, onDone }: {
  challenge: Challenge; handle: string; error: StartError | null;
  onChange: (h: string) => void; onError: (e: StartError) => void; onDone: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  useEffect(() => { input.current?.focus(); }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = checkStart(c.id, handle);
    if (err) { onError(err); input.current?.focus(); } else onDone();
  };

  return (
    <form onSubmit={submit} noValidate className="ctf-start">
      <label htmlFor={`${id}-handle`}>Your name</label>
      <div className="ctf-start-row">
        <input
          ref={input} id={`${id}-handle`} value={handle} maxLength={24} autoComplete="nickname" required
          aria-invalid={error ? true : undefined} aria-describedby={`${id}-handle-help${error ? ` ${id}-handle-error` : ""}`}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="submit" className="ctf-btn">Continue</button>
      </div>
      <p id={`${id}-handle-help`} className="ctf-meta">Shown on the leaderboard, so use a first name or nickname. {board.MAX_ATTEMPTS} attempts per name.</p>
      {error && <p id={`${id}-handle-error`} className="ctf-error" role="alert">{startErrors[error](handle)}{error === "attempts" ? " Try a different name." : ""}</p>}
    </form>
  );
}

function Running({ challenge: c, focusKey, onReset }: { challenge: Challenge; focusKey: number; onReset?: () => void }) {
  const { run } = ctfStore.use();
  const { ask, dialog } = useConfirm();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (focusKey) heading.current?.focus(); }, [focusKey]);
  if (!run) return null;
  const left = c.hints.length - run.hints;
  const free = !!run.compare; // comparison run: unscored, so no prices and no confirmations

  const hint = () => free ? void takeHint() : ask({
    title: `Reveal hint ${run.hints + 1} of ${c.hints.length}?`, message: `This hint costs ${HINT_COSTS[run.hints]} points.`,
    confirmLabel: `Reveal hint (−${HINT_COSTS[run.hints]})`, onConfirm: () => { takeHint(); },
  });
  const reveal = () => free ? revealPage() : ask({
    title: `${c.reveal}?`, message: `It stays visible for the rest of this run and costs ${REVEAL_PENALTY} points.`,
    confirmLabel: `${c.reveal} (−${REVEAL_PENALTY})`, onConfirm: revealPage,
  });
  const stop = () => { endRun(); onReset?.(); };
  const abandon = () => ask(free
    ? { title: "End the comparison run?", message: "Nothing is scored, and no attempt is used.", confirmLabel: "End comparison run", onConfirm: stop }
    : { title: "Abandon this challenge?", message: "Your run ends now and the attempt stays used.", confirmLabel: "Abandon challenge", danger: true, onConfirm: stop });

  return (
    <>
      <div className="ctf-run-head">
        <h3 className="ctf-h" ref={heading} tabIndex={-1}>{free ? "Comparison run" : "Challenge running"}</h3>
        {!free && <p role="status" className="ctf-score">Score: {liveScore(run)} points</p>}
      </div>
      <p className="ctf-brief">{free && "Every issue is fixed. "}{c.task} The full instructions stay pinned to the side of the screen.</p>
      {free && <p className="ctf-meta">This run isn't scored, so hints{c.reveal ? ` and ${c.reveal}` : ""} don't cost points.</p>}
      {run.hints > 0 && (
        <>
          <h4 className="ctf-h4">Hints</h4>
          <ol className="ctf-hints">{c.hints.slice(0, run.hints).map((h) => <li key={h}>{h}</li>)}</ol>
        </>
      )}
      <div className="ctf-actions">
        {left > 0 && <button type="button" className="ctf-btn" onClick={hint}>{free ? "Get a hint" : `Get a hint (−${HINT_COSTS[run.hints]})`}</button>}
        {c.reveal && !run.revealed && <button type="button" className="ctf-btn" onClick={reveal}>{free ? c.reveal : `${c.reveal} (−${REVEAL_PENALTY})`}</button>}
        <button type="button" className="ctf-btn ctf-btn--quiet" onClick={abandon}>{free ? "End comparison run" : "Abandon challenge"}</button>
      </div>
      {run.hints > 0 && !free && <p className="ctf-meta">Hints so far cost {hintCost(run.hints)} points.</p>}
      <details className="ctf-rules-more" open={!free}>
        <summary>{free ? "Fix switches (all on)" : "Fix switches and highlights (cost points)"}</summary>
        <div className="ctf-fixes"><FixControls /></div>
      </details>
      {dialog}
      <Dock challenge={c} />
    </>
  );
}

/**
 * The run's instructions, pinned to the side of the screen so they stay in view while the player works down the
 * page (voice and pointer players kept scrolling back up). Collapsible, no focus trap, and portalled out of <main>
 * so clicks on it don't count as mouse clicks on the page.
 */
function Dock({ challenge: c }: { challenge: Challenge }) {
  const { run } = ctfStore.use();
  // Open on wide screens, where the page makes room for it; on a phone it starts collapsed.
  const [open, setOpen] = useState(() => typeof window === "undefined" || !window.matchMedia || window.matchMedia("(min-width: 48rem)").matches);
  const id = useId();
  // On a page with the portal's left nav rail (registration), sit over the rail: the task never needs it, and the
  // page's fixed-width layout (portal-reg-layout-reflow-001) can't make room on the right. Elsewhere the page
  // reflows beside the open dock (.ctf-docked) rather than hiding controls underneath it.
  const [overRail] = useState(() => typeof document !== "undefined" && !!document.querySelector(".portal-rail"));
  useEffect(() => {
    document.body.classList.toggle("ctf-docked", open && !overRail);
    return () => document.body.classList.remove("ctf-docked");
  }, [open, overRail]);
  if (!run || typeof document === "undefined") return null;
  const help = `Hints${c.reveal ? `, ${c.reveal}` : ""} and Fix switches are in the challenge bar at the top of the page.`;
  return createPortal(
    <section className={`ctf-dock${open ? "" : " ctf-dock--closed"}${overRail ? " ctf-dock--rail" : ""}`} aria-labelledby={`${id}-title`}>
      <div className="ctf-dock-head">
        <h2 id={`${id}-title`} className="ctf-dock-title">{c.title} Instructions</h2>
        <button type="button" className="ctf-btn ctf-btn--quiet" aria-expanded={open} aria-controls={`${id}-body`} onClick={() => setOpen((o) => !o)}>
          {open ? "Hide" : "Show"}<span className="visually-hidden"> instructions</span>
        </button>
      </div>
      <div id={`${id}-body`} hidden={!open}>
        {!run.compare && <p className="ctf-meta">Score: {liveScore(run)} points</p>}
        {c.panelSteps && <>
          <h3 className="ctf-h4">Your task</h3>
          <ol className="ctf-instructions">{c.panelSteps.map((n) => <li key={n}>{n}</li>)}</ol>
        </>}
        {c.panelNotes.length > 0 && <ul className="ctf-instructions">{c.panelNotes.map((n) => <li key={n}>{n}</li>)}</ul>}
        {c.panelSections?.map((g) => (
          <details key={g.title} className="ctf-rules-more ctf-dock-section" open={g.open}>
            <summary>{g.title}</summary>
            {g.note && <p className="ctf-meta">{g.note}</p>}
            <dl className="ctf-rule-list">{g.rows.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl>
          </details>
        ))}
        {run.hints > 0 && <ol className="ctf-hints" aria-label="Hints">{c.hints.slice(0, run.hints).map((h) => <li key={h}>{h}</li>)}</ol>}
        <p><strong>Need help?</strong> {help} {run.compare ? "They're free in this run." : "Each one costs points."}</p>
        {!run.compare && <p><strong>Don't reload the page.</strong> It ends the run and uses up the attempt.</p>}
      </div>
    </section>,
    document.body,
  );
}

/**
 * The results, in the bar (plan 13 §4e): replaces the old congratulations box at the bottom of each page. Focus
 * moves to its heading when the task finishes, so screen reader users hear they finished and land on their results.
 */
function Finished({ challenge: c, onPlayAgain, onTryFixed, onSource }: {
  challenge: Challenge; onPlayAgain: () => void; onTryFixed: () => void; onSource: () => void;
}) {
  const { result } = ctfStore.use();
  const heading = useRef<HTMLHeadingElement>(null);
  const [rank, setRank] = useState<{ n: number; of: number } | null>(null);
  const flag = result?.flag;
  // After the page's own effects (some move or drop focus when their task finishes), so this wins.
  useEffect(() => {
    if (!flag) return;
    const t = setTimeout(() => heading.current?.focus());
    return () => clearTimeout(t);
  }, [flag]);
  // The rank comes from the same data as the leaderboard; the score shows without it until that loads.
  useEffect(() => {
    setRank(null);
    if (!result || result.compare) return;
    let live = true;
    void board.loadBoard().then((b) => {
      const rows = board.rankChallenge(b.entries, c.id);
      const i = rows.findIndex((r) => r.handle.trim().toLowerCase() === result.handle.trim().toLowerCase());
      if (live && i >= 0) setRank({ n: i + 1, of: rows.length });
    });
    return () => { live = false; };
  }, [result, c.id]);
  if (!result) return null;

  const advanced = c.harder && challengeById.get(c.harder);
  const keepGoing = (
    <div className="ctf-keep-going">
      <h4 className="ctf-h4">Keep going</h4>
      <div className="ctf-actions">
        {advanced && <Link className="ctf-btn ctf-btn--quiet" to={advanced.path}>Try the advanced {advanced.at.toLowerCase()} challenge</Link>}
        <Link className="ctf-btn ctf-btn--quiet" to="/ctf">Explore more challenges</Link>
      </div>
    </div>
  );
  const again = result.attemptsLeft > 0 && <button type="button" className="ctf-btn ctf-btn--quiet" onClick={onPlayAgain}>Play again for a better score</button>;

  if (result.compare) return (
    <div className="ctf-results">
      <div className="ctf-results-card">
        <h3 ref={heading} tabIndex={-1} className="ctf-h ctf-results-title">Comparison run complete</h3>
        <p className="ctf-brief">What felt easier this time? Each difference came from fixing an accessibility issue.</p>
        <p className="ctf-meta">This run wasn't scored, so your leaderboard score is unchanged. You have {result.attemptsLeft} {result.attemptsLeft === 1 ? "attempt" : "attempts"} left on this challenge.</p>
      </div>
      <div className="ctf-actions">
        <Link className="ctf-btn" to="/ctf">Explore more challenges</Link>
        {again}
        <LeaderboardButton challenge={c.id} />
      </div>
    </div>
  );
  return (
    <div className="ctf-results">
      <div className="ctf-results-card">
        <div className="ctf-results-top">
          <div>
            <h3 ref={heading} tabIndex={-1} className="ctf-h ctf-results-title">Challenge complete</h3>
            <p className="ctf-bigscore"><span>{result.score}</span> points</p>
          </div>
          {rank && <p className="ctf-rank">You're <strong>#{rank.n}</strong> of {rank.of} {rank.of === 1 ? "player" : "players"} on the {c.title} leaderboard.</p>}
        </div>
        <table className="ctf-table">
          <caption>Score breakdown</caption>
          <tbody>
            {result.breakdown.map(([label, n]) => <tr key={label}><th scope="row">{label}</th><td>{pts(n)}</td></tr>)}
            <tr className="ctf-total"><th scope="row">Total</th><td>{result.score}</td></tr>
          </tbody>
        </table>
        <Scoring />
        <p className="ctf-meta">Saved to the leaderboard as {result.handle}. You have {result.attemptsLeft} {result.attemptsLeft === 1 ? "attempt" : "attempts"} left on this challenge.</p>
        <p className="ctf-meta"><button type="button" className="ctf-link-btn" onClick={onSource}>View challenge source</button></p>
      </div>
      <p><strong>Compare the experience.</strong> Try the challenge again with every accessibility issue fixed. This run is free and isn't scored.</p>
      <div className="ctf-actions">
        <button type="button" className="ctf-btn" onClick={onTryFixed}>Try again with all issues fixed</button>
        {again}
        <LeaderboardButton challenge={c.id} />
      </div>
      {keepGoing}
    </div>
  );
}

function SourceModal({ challenge: c, open, onClose }: { challenge: Challenge; open: boolean; onClose: () => void }) {
  const [files, setFiles] = useState<[string, string][] | null>(null);
  useEffect(() => {
    if (!open || files) return;
    void Promise.all(c.sources.map(async ([label, load]) => [label, (await load()).default] as [string, string])).then(setFiles);
  }, [open, files, c]);

  return (
    <Modal open={open} title={`Challenge source: ${c.title}`} onClose={onClose}>
      <div className="ctf-source">
        <p>The real source of this challenge page and its registered accessibility issues. Each <code>fix("…")</code> branch is one issue a Fix switch corrects.</p>
        {!files && <p role="status">Loading source…</p>}
        {files?.map(([label, text]) => (
          <section key={label}>
            <h3 className="ctf-h4">{label}</h3>
            <pre tabIndex={0} role="region" aria-label={label}><code>{text}</code></pre>
          </section>
        ))}
      </div>
    </Modal>
  );
}
