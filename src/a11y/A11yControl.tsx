import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { scenarios } from "./registry";
import { a11yStore, toggleFor, useA11yState, type Category } from "./state";
import { useMountedScenarios } from "./useScenario";

const toggles: { category: Category; label: string; noun: string }[] = [
  { category: "error", label: "Fix Errors", noun: "errors" },
  { category: "alert", label: "Fix Alerts", noun: "alerts" },
  { category: "manual", label: "Fix Manual Testing Issues", noun: "manual issues" },
];

/**
 * Floating Accessibility Test Controls. Infrastructure: must itself stay fully accessible and never
 * register scenarios. Counts are unique scenarios mounted on the current page.
 */
export function A11yControl() {
  const state = useA11yState();
  const mounted = useMountedScenarios();
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const toggleRef = useRef<HTMLButtonElement>(null);

  const onPage = (c: Category) => [...mounted].filter((id) => scenarios.get(id)?.category === c).length;

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

  const flip = (c: Category, label: string, noun: string) => {
    const on = !state[toggleFor[c]];
    a11yStore.set({ [toggleFor[c]]: on });
    setMessage(`${label} ${on ? "on" : "off"}. ${onPage(c)} ${noun} ${on ? "corrected" : "restored"} on this page.`);
  };

  return (
    <aside className="a11y-control" aria-label="Accessibility Test Controls">
      <button
        ref={toggleRef}
        type="button"
        className="a11y-control-toggle"
        aria-expanded={expanded}
        aria-controls="a11y-control-panel"
        onClick={() => setExpanded((e) => !e)}
      >
        Accessibility Test Controls
      </button>
      <div id="a11y-control-panel" className="a11y-control-panel" hidden={!expanded}>
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
              </li>
            );
          })}
        </ul>
        <div className="a11y-control-actions">
          <button type="button" onClick={() => { a11yStore.fixAll(); setMessage("All fixes on. Every scenario on this page is corrected."); }}>Fix All</button>
          <button type="button" onClick={() => { a11yStore.resetAll(); setMessage("All fixes off. Every scenario on this page is restored."); }}>Reset All</button>
        </div>
        <p><Link to="/accessibility-lab">Open the Accessibility Lab</Link></p>
      </div>
      <p role="status" className="visually-hidden">{message}</p>
    </aside>
  );
}
