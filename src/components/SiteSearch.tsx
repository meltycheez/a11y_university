// Header search box with live suggestions (plan 06 #5). Global chrome: its two scenarios are on every page.
// Defective: the submit button is an unnamed icon, and suggestions are a plain list of clickable <div>s with no
// combobox semantics and no keyboard support. Fixed: named button and the APG combobox (listbox popup) pattern.
import { useEffect, useRef, useState } from "react";
import { Form, useNavigate } from "react-router";
import { useScenario } from "~/a11y/useScenario";
import { suggest, type SearchResult } from "~/search";

export function SiteSearch() {
  const buttonFixed = useScenario("global-search-submit-empty-001");
  const comboFixed = useScenario("global-search-suggest-001");
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [items, setItems] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const latest = useRef("");

  useEffect(() => {
    const q = value.trim();
    latest.current = q;
    setActive(-1);
    if (q.length < 2) { setItems([]); return; }
    suggest(q).then((r) => latest.current === q && setItems(r), () => setItems([]));
  }, [value]);

  const shown = open && items.length > 0;
  const go = (r: SearchResult) => { setOpen(false); setValue(""); navigate(r.url); };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!comboFixed) return; // defective: arrow keys, Enter on a suggestion and Escape do nothing
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!items.length) return;
      setOpen(true);
      const n = items.length;
      setActive((a) => (e.key === "ArrowDown" ? (a + 1) % n : a <= 0 ? n - 1 : a - 1));
    } else if (e.key === "Escape") {
      if (shown) { e.preventDefault(); setOpen(false); setActive(-1); }
    } else if (e.key === "Enter" && shown && active >= 0) {
      e.preventDefault();
      go(items[active]);
    }
  };

  const listId = "site-search-suggestions";
  const optionId = (i: number) => `site-search-opt-${i}`;
  const comboProps = comboFixed
    ? { role: "combobox", "aria-expanded": shown, "aria-controls": listId, "aria-autocomplete": "list" as const, "aria-activedescendant": shown && active >= 0 ? optionId(active) : undefined }
    : {};

  return (
    <Form action="/search" method="get" role="search" className="site-search" data-a11y-scenario="global-search-submit-empty-001 global-search-suggest-001" onSubmit={() => setOpen(false)}>
      <label htmlFor="site-search-q" className="visually-hidden">Search Redwood State</label>
      <input
        id="site-search-q" name="q" type="search" placeholder="Search Redwood State" autoComplete="off"
        value={value}
        onChange={(e) => { setValue(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        {...comboProps}
      />
      <button type="submit" className="site-search-submit">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
          <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M15.5 15.5 L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        {buttonFixed && <span className="visually-hidden">Search</span>}
      </button>
      {shown && (comboFixed ? (
        <ul id={listId} role="listbox" aria-label="Suggestions" className="site-search-list">
          {items.map((r, i) => (
            <li key={r.id} id={optionId(i)} role="option" aria-selected={i === active} className={`site-search-option${i === active ? " is-active" : ""}`}
              onMouseDown={(e) => e.preventDefault()} onClick={() => go(r)}>
              {r.title}
            </li>
          ))}
        </ul>
      ) : (
        <div className="site-search-list">
          {items.map((r) => (
            <div key={r.id} className="site-search-option" onMouseDown={(e) => e.preventDefault()} onClick={() => go(r)}>{r.title}</div>
          ))}
        </div>
      ))}
    </Form>
  );
}
