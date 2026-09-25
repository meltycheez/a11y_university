// Common widgets (plan 06 #12) that have no baseline elsewhere: custom dropdown, date picker, toast.
// Each renders an accessible implementation once its scenario is fixed (or when no scenario is given) and a
// realistic defective one while the scenario is unfixed. Tabs, Accordion and Modal live in their own files.
import { useEffect, useId, useState } from "react";
import { useScenario } from "~/a11y/useScenario";

const marker = (scenario?: string) => (scenario ? { "data-a11y-scenario": scenario } : {});

export interface Option { value: string; label: string }

/**
 * Select. Fixed: a labeled native <select>.
 * Defect "mouse-only" (kbd-dropdown-inoperable): a styled <div> that opens a list of clickable <div> options;
 * nothing is focusable and the visible label isn't associated.
 */
export function Dropdown({ label, options, value, onChange, scenario, defect }: {
  label: string; options: Option[]; value: string; onChange: (value: string) => void; scenario?: string; defect?: "mouse-only";
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const fixed = useScenario(scenario);
  if (!scenario || fixed || !defect) {
    return (
      <div className="field" {...marker(scenario)}>
        <label htmlFor={id}>{label}</label>
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    );
  }
  const current = options.find((o) => o.value === value) ?? options[0];
  return (
    <div className="field" {...marker(scenario)}>
      <span className="field-label">{label}</span>
      <div className={`fake-select${open ? " is-open" : ""}`}>
        <div className="fake-select-value" onClick={() => setOpen((o) => !o)}>{current?.label}<span className="fake-select-caret" aria-hidden="true" /></div>
        {open && (
          <div className="fake-select-list">
            {options.map((o) => (
              <div key={o.value} className={`fake-select-option${o.value === value ? " is-selected" : ""}`} onClick={() => { onChange(o.value); setOpen(false); }}>
                {o.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const utc = (s: string) => new Date(`${s}T00:00:00Z`);

/**
 * Date picker. Fixed: a labeled native <input type="date"> with min/max.
 * Defect "mouse-only-grid" (kbd-div-button): a month grid of clickable <div> cells with <div> prev/next
 * arrows; no keyboard access, no names, the selected day shown by color only.
 */
export function DatePicker({ label, value, onChange, min, max, isAvailable = () => true, scenario, defect }: {
  label: string; value: string; onChange: (value: string) => void; min: string; max: string;
  isAvailable?: (date: string) => boolean; scenario?: string; defect?: "mouse-only-grid";
}) {
  const id = useId();
  const fixed = useScenario(scenario);
  const [month, setMonth] = useState(() => (value || min).slice(0, 7));
  if (!scenario || fixed || !defect) {
    return (
      <div className="field" {...marker(scenario)}>
        <label htmlFor={id}>{label}</label>
        <input id={id} type="date" value={value} min={min} max={max} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  const first = utc(`${month}-01`);
  const days = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const cells = [...Array(first.getUTCDay()).fill(null), ...Array.from({ length: days }, (_, i) => iso(new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), i + 1))))];
  const shift = (n: number) => setMonth(iso(new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + n, 1))).slice(0, 7));
  const title = first.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  return (
    <div className="field" {...marker(scenario)}>
      <span className="field-label">{label}</span>
      <div className="fake-calendar">
        <div className="fake-calendar-head">
          <div className="fake-calendar-nav" onClick={() => month > min.slice(0, 7) && shift(-1)}>‹</div>
          <span>{title}</span>
          <div className="fake-calendar-nav" onClick={() => month < max.slice(0, 7) && shift(1)}>›</div>
        </div>
        <div className="fake-calendar-grid">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i} className="fake-calendar-dow">{d}</span>)}
          {cells.map((d, i) => {
            if (!d) return <span key={i} />;
            const ok = d >= min && d <= max && isAvailable(d);
            return (
              <div key={d} className={`fake-calendar-day${ok ? "" : " is-disabled"}${d === value ? " is-selected" : ""}`} onClick={() => ok && onChange(d)}>
                {+d.slice(8)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Toast. Fixed: a persistent role="status" region, so the message is announced and stays until dismissed.
 * Defect "vanishes" (sr-status-not-announced): no live region, and the message disappears after 3 seconds.
 */
export function Toast({ message, onDismiss, scenario, defect }: { message: string | null; onDismiss: () => void; scenario?: string; defect?: "vanishes" }) {
  const fixed = useScenario(scenario);
  const broken = scenario && !fixed && defect === "vanishes";
  useEffect(() => {
    if (!broken || !message) return;
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [broken, message, onDismiss]);
  return (
    <div className="toast-region" role={broken ? undefined : "status"} {...marker(scenario)}>
      {message && (
        <div className="toast">
          <span>{message}</span>
          {!broken && <button type="button" className="toast-dismiss" onClick={onDismiss}>Dismiss</button>}
        </div>
      )}
    </div>
  );
}
