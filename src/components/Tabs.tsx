import { useId, useRef, useState } from "react";

export interface TabItem { label: string; content: React.ReactNode }

/** Baseline accessible tabs (WAI-ARIA APG, automatic activation). */
export function Tabs({ tabs, label }: { tabs: TabItem[]; label: string }) {
  const id = useId();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

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

  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} className="tab-list" onKeyDown={onKeyDown}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            className="tab"
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div key={i} role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} tabIndex={0} hidden={i !== active} className="tab-panel">
          {tab.content}
        </div>
      ))}
    </div>
  );
}
