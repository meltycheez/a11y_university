import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Tabs } from "~/components/Tabs";
import { challengeForPath } from "~/ctf/challenges";
import { ChallengesPanel } from "~/ctf/ChallengesPanel";
import { ctfStore, FIX_PENALTY, HIGHLIGHT_PENALTY, noteHighlight } from "~/ctf/store";
import { createStore } from "~/lib/interactive";
import { usePathname } from "~/routes/usePathname";
import { scenarios } from "./registry";
import { CATEGORY_LABEL, CategoryIcon, ScenarioHighlights } from "./ScenarioHighlights";
import { a11yStore, toggleFor, useA11yState, type Category } from "./state";
import { useMountedScenarios } from "./useScenario";

const KEY_TEXT: Record<Category, string> = { error: "red dashed outline", alert: "yellow dashed outline", manual: "cyan dashed outline" };

const toggles: { category: Category; label: string; noun: string }[] = [
  { category: "error", label: "Fix Errors", noun: "errors" },
  { category: "alert", label: "Fix Alerts", noun: "alerts" },
  { category: "manual", label: "Fix Manual Testing Issues", noun: "manual issues" },
];

/**
 * The floating Pope Tech Accessibility Lab widget (formerly Accessibility Test Controls). A demonstration aid,
 * not a product: it switches this fictional site's planted issues on and off and starts the CTFs. The fix switches plus the CTF
 * Challenges tab (plan 11). Infrastructure: must itself stay fully accessible and never register scenarios.
 * Counts are unique scenarios mounted on the current page. The Challenges tab is the same on every page; each
 * challenge's own controls live in its page's challenge bar (ctf/ChallengeBanner.tsx).
 */
export function PopeTechWidget() {
  const highlight = highlightStore.use();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Landing on a challenge page closes the widget so the challenge bar is in view. If focus was in the widget
  // (the Challenges tab link), it moves to the challenge bar's heading rather than being lost.
  useEffect(() => {
    if (!challengeForPath(pathname)) return;
    const hadFocus = panelRef.current?.contains(document.activeElement);
    setExpanded(false);
    if (hadFocus) document.querySelector<HTMLElement>(".ctf-banner-title")?.focus();
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.code === "KeyA") {
        e.preventDefault();
        setExpanded(true);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <aside className="a11y-control" aria-label="Pope Tech Accessibility Lab">
      <button
        ref={toggleRef}
        type="button"
        className="a11y-control-toggle"
        aria-expanded={expanded}
        aria-controls="a11y-control-panel"
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Name: "Pope Tech Accessibility Lab", which contains the visible text (label in name, 2.5.3). */}
        <img src={`${import.meta.env.BASE_URL}brand/pope-tech-mark.svg`} alt="Pope Tech" width="36" height="36" />
        {" "}<span className="ptw-label">Accessibility Lab</span>
      </button>
      <div
        ref={panelRef}
        id="a11y-control-panel"
        className="a11y-control-panel"
        hidden={!expanded}
        onKeyDown={(e) => {
          // Esc inside a challenge modal closes only the modal.
          if (e.key === "Escape" && !(e.target as Element).closest("dialog")) { setExpanded(false); toggleRef.current?.focus(); }
        }}
      >
        <h2 className="ptw-title">Pope Tech Accessibility Lab</h2>
        <p className="ptw-disclaimer">A demonstration tool for this fictional university site: it turns the site's planted accessibility issues on and off, and starts the assistive technology challenges. It doesn't fix real websites.</p>
        <Tabs
          label="Pope Tech Accessibility Lab"
          tabs={[
            { label: "Fixes", content: <><FixControls /><p><Link to="/accessibility-lab">Open the Accessibility Lab</Link></p></> },
            { label: "Challenges", content: <ChallengesPanel /> },
          ]}
        />
      </div>
      <ScenarioHighlights show={highlight} />
    </aside>
  );
}

// Viewing aid only: module memory like the fix toggles, reset on reload. Shared by the widget and the challenge bar.
const highlightStore = createStore<Record<Category, boolean>>({ error: false, alert: false, manual: false });

/** The Fix switches, highlight checkboxes and Fix All / Reset All. In the widget's Fixes tab and in a running challenge's bar. */
export function FixControls() {
  const state = useA11yState();
  const mounted = useMountedScenarios();
  const { run } = ctfStore.use();
  const highlight = highlightStore.use();
  const [message, setMessage] = useState("");

  const onPage = (c: Category) => [...mounted].filter((id) => scenarios.get(id)?.category === c).length;

  const flip = (c: Category, label: string, noun: string) => {
    const on = !state[toggleFor[c]];
    const already = !!run?.fixes.includes(c);
    a11yStore.set({ [toggleFor[c]]: on });
    setMessage(`${label} ${on ? "on" : "off"}. ${onPage(c)} ${noun} ${on ? "corrected" : "restored"} on this page.${on && run && !already ? ` Challenge penalty: minus ${FIX_PENALTY} points.` : ""}`);
  };

  const flipHighlight = (c: Category, noun: string, on: boolean) => {
    highlightStore.set((h) => ({ ...h, [c]: on }));
    const charged = on && noteHighlight(c);
    setMessage((on ? `Highlighting ${state[toggleFor[c]] ? 0 : onPage(c)} ${noun} on this page.` : `Stopped highlighting ${noun}.`)
      + (charged ? ` Challenge penalty: minus ${HIGHLIGHT_PENALTY} points.` : ""));
  };

  const fixAll = () => {
    const charged = run ? (Object.keys(toggleFor) as Category[]).filter((c) => !run.fixes.includes(c)).length : 0;
    a11yStore.fixAll();
    setMessage(`All fixes on. Every scenario on this page is corrected.${charged ? ` Challenge penalty: minus ${charged * FIX_PENALTY} points.` : ""}`);
  };

  return (
    <>
      {run && <p className="ptw-warning">A challenge is running: each Fix switch costs {FIX_PENALTY} points and each highlight {HIGHLIGHT_PENALTY}, the first time per category.</p>}
      <ul className="a11y-control-switches">
        {toggles.map(({ category, label, noun }) => {
          const on = state[toggleFor[category]];
          const count = onPage(category);
          return (
            <li key={category}>
              <button type="button" role="switch" aria-checked={on} className="a11y-switch" onClick={() => flip(category, label, noun)}>
                <span className="a11y-switch-track" aria-hidden="true" />
                {label}
              </button>
              <span className="a11y-count">{on ? 0 : count} active / {count} on page</span>
              <div className="a11y-highlight-row">
                <label className="a11y-highlight-check">
                  <input type="checkbox" checked={highlight[category]} onChange={(e) => flipHighlight(category, noun, e.target.checked)} />
                  Highlight <span className="visually-hidden">{noun}</span>
                </label>
                {highlight[category] && (
                  <span className={`a11y-key a11y-hl--${category}`}>
                    <span className="a11y-key-swatch"><CategoryIcon category={category} /></span>
                    {CATEGORY_LABEL[category]}<span className="visually-hidden">, {KEY_TEXT[category]}</span>
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="a11y-control-actions">
        <button type="button" onClick={fixAll}>Fix All</button>
        <button type="button" onClick={() => { a11yStore.resetAll(); setMessage("All fixes off. Every scenario on this page is restored."); }}>Reset All</button>
      </div>
      <p role="status" className="visually-hidden">{message}</p>
    </>
  );
}

