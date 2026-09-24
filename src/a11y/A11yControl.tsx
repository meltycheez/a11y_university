import { useState } from "react";

/**
 * Placeholder for the floating Accessibility Test Controls.
 * Plan 02 wires this to the scenario engine (toggles, counts, Fix All / Reset All).
 */
export function A11yControl() {
  const [expanded, setExpanded] = useState(false);
  return (
    <aside className="a11y-control" aria-label="Accessibility Test Controls">
      <button type="button" className="a11y-control-toggle" aria-expanded={expanded} aria-controls="a11y-control-panel" onClick={() => setExpanded((e) => !e)}>
        Accessibility Test Controls
      </button>
      <div id="a11y-control-panel" className="a11y-control-panel" hidden={!expanded}>
        <p>The fix toggles arrive with the scenario engine (plan 02).</p>
        <p><a href="/accessibility-lab">Open the Accessibility Lab</a></p>
      </div>
    </aside>
  );
}
