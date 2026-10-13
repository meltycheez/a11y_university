// Plan 11 §3: the challenge bar embedded on a CTF page. It holds everything for that challenge: the brief, the
// Start form, the instructions, score and hints during a run, the result, the source viewer and the leaderboard.
// Infrastructure: fully accessible, registers no scenarios.
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { FixControls } from "~/a11y/PopeTechWidget";
import { Modal } from "~/components/Modal";
import { challengeById, type Challenge, type ChallengeId } from "./challenges";
import { LeaderboardButton, Scoring } from "./ChallengesPanel";
import { useConfirm } from "./ConfirmDialog";
import * as board from "./leaderboard";
import { checkStart, ctfStore, dismissResult, endRun, FIX_PENALTY, HIGHLIGHT_PENALTY, HINT_COSTS, hintCost, liveScore, REVEAL_PENALTY, revealPage, startRun, takeHint, type StartError } from "./store";

// ponytail: matched on the instruction copy (the attempt line); flag such lines in challenges.ts if more appear.
const SCORED_ONLY = /uses up the attempt/;
/** The run's steps. A comparison run uses no attempt, so that line is dropped. */
const steps = (c: Challenge, compare?: boolean) => (compare ? c.instructions.filter((i) => !SCORED_ONLY.test(i)) : c.instructions);

const pts = (n: number) =>`${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n)}`;

/** `onAbandon` lets the page reset its task when the player abandons (or ends a comparison run). */
export function ChallengeBanner({ id, onAbandon }: { id: ChallengeId; onAbandon?: () => void }) {
  const { run, result, handle: lastHandle, compare } = ctfStore.use();
  const c = challengeById.get(id)!;
  const titleId = useId();
  const title = useRef<HTMLHeadingElement>(null);
  const [sourceOpen, setSourceOpen] = useState(false);
  // Starting replaces the Start button, so focus moves to the running state's heading.
  const [started, setStarted] = useState(0);
  // Before a run: "closed" is the heading and a Start Challenge button, "name" asks for the player's name,
  // "ready" shows the whole challenge with Start the Challenge at the bottom. A run or result shows it all.
  const [stage, setStage] = useState<"closed" | "name" | "ready">("closed");
  const [handle, setHandle] = useState(lastHandle);
  const [error, setError] = useState<StartError | null>(null);
  const starting = !run && result?.id !== id;
  const comparing = compare === id; // after "Try again with all issues fixed": the next start is the comparison run
  // The name step disappears on Continue, so focus goes to the bar's heading to read the challenge from the top.
  useEffect(() => { if (stage === "ready") title.current?.focus(); }, [stage]);

  const begin = () => {
    const err = startRun(c.id, handle, { compare: comparing });
    setError(err);
    if (err) setStage("name"); // only if attempts ran out in another tab since the name step
    else setStarted((n) => n + 1);
  };

  let body: React.ReactNode;
  if (run?.id === id) body = <Running challenge={c} focusKey={started} onAbandon={onAbandon} />;
  else if (run) body = <p>Another challenge is running: <Link to={challengeById.get(run.id)!.path}>{challengeById.get(run.id)!.title}</Link>. Finish or abandon it there first.</p>;
  else if (result?.id === id) body = <Finished challenge={c} />;
  else body = (
    <>
      {comparing && <p className="ptw-warning"><strong>Comparison run:</strong> every accessibility issue is fixed, so you can compare the experience. It isn't scored, uses no attempt, and hints are free. The form hides again, like your first run.</p>}
      <p>{c.brief}</p>
      <HarderLink challenge={c} />
      <p className="ctf-meta">For example: {c.atExamples.join(", ")}.</p>
      <p className="ctf-meta">Player: {handle.trim()} <button type="button" className="ctf-link-btn" onClick={() => setStage("name")}>Change name</button></p>
    </>
  );

  return (
    <section className="ctf-banner" aria-labelledby={titleId}>
      <div className="ctf-banner-head">
        <img src={`${import.meta.env.BASE_URL}brand/pope-tech-mark.svg`} alt="" width="32" height="32" />
        {/* tabIndex: the widget moves focus here when its Challenges link brings you to this page. */}
        <h2 ref={title} id={titleId} className="ctf-banner-title" tabIndex={-1}>Pope Tech Challenge: {c.title}</h2>
        <p className="ctf-banner-at"><strong>Assistive technology: {c.at}</strong></p>
      </div>
      {c.advanced && <p className="ctf-meta"><span className="ctf-badge">Harder</span> About {c.timeLimitMin} minutes, with its own leaderboard (not counted in the overall total).</p>}
      {starting && stage === "closed" ? <div className="ctf-actions">
        <button type="button" className="ctf-btn ctf-btn--icon" onClick={() => setStage("name")}>
          Start Challenge
          <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8h11M9 4l4 4-4 4" /></svg>
        </button>
        <LeaderboardButton challenge={c.id} />
      </div> : starting && stage === "name" ? (
        <NameForm
          challenge={c} handle={handle} error={error}
          onChange={(h) => { setHandle(h); setError(null); }}
          onError={setError}
          onDone={() => setStage("ready")}
        />
      ) : <>
      <Rules challenge={c} />
      <Setup challenge={c} />
      <div className="ctf-banner-body">{body}</div>
      <div className="ctf-actions ctf-banner-tools">
        {/* No source during a run: it gives the answers away (see the "Source code" rule). */}
        {run?.id !== id && <button type="button" className="ctf-btn ctf-btn--quiet" onClick={() => setSourceOpen(true)}>View challenge source</button>}
        <LeaderboardButton challenge={c.id} />
      </div>
      <Scoring />
      {starting && (
        <div className="ctf-start-go">
          {c.warning && <p className="ptw-warning" id={`${titleId}-warning`}><strong>Heads up:</strong> {c.warning}</p>}
          <p className="ctf-meta" id={`${titleId}-uses`}>{comparing
            ? `Every Fix switch stays on. Not scored, and no attempt is used.${c.reveal ? ` ${c.reveal} is free in this run.` : ""}`
            : `Starting turns every Fix switch off and uses one of your ${board.MAX_ATTEMPTS} attempts. Once you start, you will get options in this bar to turn on fixes for errors, alerts and manual testing issues, highlight those issues on the page${c.reveal ? ", show the form again" : ""} or get a hint. Each one costs points (see "Costs points" above). The instructions also stay pinned to the side of the screen.`}</p>
          <button type="button" className="ctf-btn" onClick={begin} aria-describedby={`${c.warning ? `${titleId}-warning ` : ""}${titleId}-uses`}>{comparing ? "Start comparison run" : "Start the Challenge"}</button>
        </div>
      )}
      <SourceModal challenge={c} open={sourceOpen} onClose={() => setSourceOpen(false)} />
      </>}
    </section>
  );
}

/** Allowed / not allowed / costs points, as chips, with the full explanations one click away. */
function Rules({ challenge: c }: { challenge: Challenge }) {
  const costs = [
    { label: `Fix switches −${FIX_PENALTY}`, detail: `The Fix switches (in this bar once you start, and in the Accessibility Lab widget) remove this page's accessibility issues, one category at a time: errors, alerts or manual testing issues. Turning one on during a run costs ${FIX_PENALTY} points the first time. Fix All turns on all three, so it costs ${FIX_PENALTY * 3}. Turning a fix off again is free.` },
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

/** Suggested settings and commands for the challenge's assistive technology, collapsed. */
function Setup({ challenge: c }: { challenge: Challenge }) {
  return (
    <details className="ctf-rules-more ctf-setup">
      <summary>Set up your assistive technology</summary>
      {c.setup.map((s) => (
        <div key={s.heading}>
          <h4 className="ctf-h4">{s.heading}</h4>
          {s.items && <ul className="ctf-instructions">{s.items.map((i) => <li key={i}>{i}</li>)}</ul>}
          {s.rows && (
            <table className="ctf-table ctf-setup-table">
              <thead><tr>{s.columns!.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
              <tbody>{s.rows.map(([a, b]) => <tr key={a}><th scope="row">{a}</th><td>{b}</td></tr>)}</tbody>
            </table>
          )}
          {s.link && <p><a href={s.link.href} target="_blank" rel="noopener noreferrer">{s.link.label}<span className="visually-hidden"> (opens in a new tab)</span></a></p>}
        </div>
      ))}
    </details>
  );
}

/** "More time? Try the harder version: …" for a booth challenge that has one (`Challenge.harder`). */
export function HarderLink({ challenge: c }: { challenge: Challenge }) {
  const h = c.harder && challengeById.get(c.harder);
  return h ? <p className="ctf-meta">More time? <Link to={h.path}>Try the harder version: {h.title}</Link> ({h.at.toLowerCase()}, about {h.timeLimitMin} minutes).</p> : null;
}

const startErrors: Record<StartError, (h: string) => string> = {
  handle: () => "Enter your name to start.",
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
      <p id={`${id}-handle-help`} className="ctf-meta">Shown on the leaderboard. {board.MAX_ATTEMPTS} attempts per name.</p>
      {error && <p id={`${id}-handle-error`} className="ctf-error" role="alert">{startErrors[error](handle)}{error === "attempts" ? " Try a different name." : ""}</p>}
    </form>
  );
}

function Running({ challenge: c, focusKey, onAbandon }: { challenge: Challenge; focusKey: number; onAbandon?: () => void }) {
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
  const abandon = () => ask({
    title: "Abandon this challenge?", message: "Your run ends now and the attempt stays used.", confirmLabel: "Abandon challenge", danger: true, onConfirm: () => { endRun(); onAbandon?.(); },
  });

  return (
    <>
      <h3 className="ctf-h" ref={heading} tabIndex={-1}>{free ? "Comparison run" : "Challenge running"}</h3>
      <p className="ctf-meta">Player: {run.handle}</p>
      {free
        ? <p className="ctf-meta">Every issue is fixed. Not scored.</p>
        : <p role="status" className="ctf-score">Score: {liveScore(run)} points</p>}
      <h4 className="ctf-h4">Instructions</h4>
      <ol className="ctf-instructions">{steps(c, run.compare).map((i) => <li key={i}>{i}</li>)}</ol>
      <p className="ctf-flag-note">{free ? "Finishing the task completes the comparison run." : "Finishing the task completes the challenge and saves your score automatically."}</p>
      {run.hints > 0 && (
        <>
          <h4 className="ctf-h4">Hints</h4>
          <ol className="ctf-hints">{c.hints.slice(0, run.hints).map((h) => <li key={h}>{h}</li>)}</ol>
        </>
      )}
      <div className="ctf-actions">
        {left > 0 && <button type="button" className="ctf-btn" onClick={hint}>{free ? "Get a hint" : `Get a hint (−${HINT_COSTS[run.hints]})`}</button>}
        {c.reveal && !run.revealed && <button type="button" className="ctf-btn" onClick={reveal}>{free ? c.reveal : `${c.reveal} (−${REVEAL_PENALTY})`}</button>}
        <button type="button" className="ctf-btn ctf-btn--quiet" onClick={abandon}>{free ? "End comparison run" : "Abandon"}</button>
      </div>
      {run.hints > 0 && !free && <p className="ctf-meta">Hints so far cost {hintCost(run.hints)} points.</p>}
      <h4 className="ctf-h4">Fix switches</h4>
      <div className="ctf-fixes"><FixControls /></div>
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
  return createPortal(
    <section className={`ctf-dock${open ? "" : " ctf-dock--closed"}${overRail ? " ctf-dock--rail" : ""}`} aria-labelledby={`${id}-title`}>
      <div className="ctf-dock-head">
        <h2 id={`${id}-title`} className="ctf-dock-title">{c.title}: instructions</h2>
        <button type="button" className="ctf-btn ctf-btn--quiet" aria-expanded={open} aria-controls={`${id}-body`} onClick={() => setOpen((o) => !o)}>
          {open ? "Hide" : "Show"}<span className="visually-hidden"> instructions</span>
        </button>
      </div>
      <div id={`${id}-body`} hidden={!open}>
        {!run.compare && <p className="ctf-meta">Score: {liveScore(run)} points</p>}
        <ol className="ctf-instructions">{steps(c, run.compare).map((i) => <li key={i}>{i}</li>)}</ol>
        {run.hints > 0 && <ol className="ctf-hints" aria-label="Hints">{c.hints.slice(0, run.hints).map((h) => <li key={h}>{h}</li>)}</ol>}
        <p className="ctf-meta">Hints, Fix switches and Abandon are in the challenge bar at the top of the page.</p>
      </div>
    </section>,
    document.body,
  );
}

function Finished({ challenge: c }: { challenge: Challenge }) {
  const { result } = ctfStore.use();
  // No focus move: the page's congratulations (ChallengeComplete) takes focus when the task finishes.
  if (!result) return null;
  if (result.compare) return (
    <>
      <h3 className="ctf-h">Comparison run complete</h3>
      <p>Not scored. Your leaderboard score is unchanged. Attempts left on this challenge: {result.attemptsLeft}.</p>
      <button type="button" className="ctf-btn" onClick={dismissResult}>Play again</button>
    </>
  );
  return (
    <>
      <h3 className="ctf-h">Challenge complete</h3>
      <p>Flag: <code className="ctf-flag">{result.flag}</code></p>
      <table className="ctf-table">
        <caption className="visually-hidden">Score breakdown for {c.title}</caption>
        <tbody>
          {result.breakdown.map(([label, n]) => <tr key={label}><th scope="row">{label}</th><td>{pts(n)}</td></tr>)}
          <tr className="ctf-total"><th scope="row">Score</th><td>{result.score}</td></tr>
        </tbody>
      </table>
      {result.trackMouse && <p className="ctf-meta">{result.mouse === 0 ? "Completed without a mouse." : `Mouse clicks on the page: ${result.mouse} (not scored).`}</p>}
      <p>Saved to the leaderboard as {result.handle}. Attempts left on this challenge: {result.attemptsLeft}.</p>
      <button type="button" className="ctf-btn" onClick={dismissResult}>Play again</button>
    </>
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
