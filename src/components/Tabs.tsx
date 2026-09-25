import { useId, useRef, useState } from "react";
import { useScenario } from "~/a11y/useScenario";

export interface TabItem { label: string; content: React.ReactNode }

/**
 * Defect variants (plan 06 #12), shown while `scenario` is unfixed:
 * - "broken-keys" (kbd-tabs-wrong-keys): correct roles, but arrow/Home/End do nothing and only the active tab is focusable.
 * - "no-roles" (sr-visual-only-state): plain buttons; the selected tab is shown by color only.
 * - "bad-children" (aria-required-children): role="tablist" around buttons that have no role="tab".
 */
export type TabsDefect = "broken-keys" | "no-roles" | "bad-children";

/** Accessible tabs (WAI-ARIA APG, automatic activation) with optional defect variants. */
export function Tabs({ tabs, label, scenario, defect }: { tabs: TabItem[]; label: string; scenario?: string; defect?: TabsDefect }) {
  const id = useId();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const fixed = useScenario(scenario);
  const broken = scenario && !fixed ? defect : undefined;

  const focusTab = (i: number) => {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => focusTab(active + 1),
      ArrowLeft: () => focusTab(active - 1),
      Home: () => focusTab(0),
      End: () => focusTab(tabs.length - 1),
    };
    const action = keys[e.key];
    if (action) { e.preventDefault(); action(); }
  };

  const aria = broken !== "no-roles" && broken !== "bad-children";
  return (
    <div className="tabs" {...(scenario ? { "data-a11y-scenario": scenario } : {})}>
      <div
        role={broken === "no-roles" ? undefined : "tablist"}
        aria-label={broken === "no-roles" ? undefined : label}
        className="tab-list"
        onKeyDown={broken ? undefined : onKeyDown}
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role={aria ? "tab" : undefined}
            id={`${id}-tab-${i}`}
            aria-selected={aria ? i === active : undefined}
            aria-controls={aria ? `${id}-panel-${i}` : undefined}
            tabIndex={broken === "no-roles" || broken === "bad-children" ? undefined : i === active ? 0 : -1}
            className={`tab${i === active ? " is-active" : ""}`}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={i}
          role={aria ? "tabpanel" : undefined}
          id={`${id}-panel-${i}`}
          aria-labelledby={aria ? `${id}-tab-${i}` : undefined}
          tabIndex={aria ? 0 : undefined}
          hidden={i !== active}
          className="tab-panel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
