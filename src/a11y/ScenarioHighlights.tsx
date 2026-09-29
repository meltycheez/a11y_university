import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { scenarios } from "./registry";
import { toggleFor, useA11yState, type Category } from "./state";

export const CATEGORY_LABEL: Record<Category, string> = { error: "Error", alert: "Alert", manual: "Manual" };

export function CategoryIcon({ category }: { category: Category }) {
  const shape = {
    error: <><circle cx="8" cy="8" r="7" fill="currentColor" /><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="var(--hl-bg)" strokeWidth="1.8" strokeLinecap="round" /></>,
    alert: <><path d="M8 1.2 15 14H1z" fill="currentColor" /><path d="M8 5.6v4.2M8 11.6v.1" stroke="var(--hl-bg)" strokeWidth="1.8" strokeLinecap="round" /></>,
    manual: <><path d="M1 8s2.6-5 7-5 7 5 7 5-2.6 5-7 5-7-5-7-5z" fill="currentColor" /><circle cx="8" cy="8" r="2.3" fill="var(--hl-bg)" /></>,
  }[category];
  return <svg className="a11y-hl-icon" viewBox="0 0 16 16" width="11" height="11" aria-hidden="true" focusable="false">{shape}</svg>;
}

interface Box { key: string; category: Category; label: string; top: number; left: number; width: number; height: number; inside: boolean; stack: number }

const ORDER: Category[] = ["error", "alert", "manual"];
const MIN = 14;

function measure(categories: Category[]): Box[] {
  const boxes: Box[] = [];
  const pageWidth = document.documentElement.clientWidth || window.innerWidth;
  document.querySelectorAll<HTMLElement>("[data-a11y-scenario]").forEach((el, i) => {
    if (el.closest(".a11y-control, .a11y-hl-layer")) return;
    const titles = new Map<Category, string[]>();
    for (const id of el.getAttribute("data-a11y-scenario")!.split(/\s+/)) {
      const s = scenarios.get(id);
      if (s && categories.includes(s.category)) titles.set(s.category, [...(titles.get(s.category) ?? []), s.title]);
    }
    if (!titles.size || (el.checkVisibility && !el.checkVisibility({ visibilityProperty: true }))) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return; // display: none/contents, <noscript>
    const top = r.top + window.scrollY, left = Math.max(0, r.left + window.scrollX);
    if (top + r.height < 0 || left >= pageWidth) return; // parked off-screen, e.g. an unfocused skip link
    let inset = 0;
    for (const category of ORDER) {
      const list = titles.get(category);
      if (!list) continue;
      const width = Math.min(Math.max(r.width, MIN), pageWidth - left) - inset * 2;
      boxes.push({
        key: `${i}-${category}`, category, inside: top < 18, stack: 0,
        label: list.length > 1 ? `${list[0]} (+${list.length - 1} more)` : list[0],
        top: top + inset, left: left + inset, width: Math.max(width, MIN), height: Math.max(r.height, MIN) - inset * 2,
      });
      inset += 4; // an element with defects in several categories gets nested outlines
    }
  });
  // Labels of outlines that start at (nearly) the same corner would sit on top of each other: stack them.
  boxes.forEach((b, i) => {
    b.stack = boxes.slice(0, i).filter((o) => o.inside === b.inside && Math.abs(o.top - b.top) < 12 && Math.abs(o.left - b.left) < 120).length;
  });
  return boxes;
}

/**
 * Draws a dashed outline and a small label over every element carrying an active (unfixed) scenario in the
 * given categories. A separate aria-hidden layer, so it works on images and inputs and never changes the
 * markup that WAVE and axe evaluate.
 */
export function ScenarioHighlights({ show }: { show: Record<Category, boolean> }) {
  const state = useA11yState();
  const key = ORDER.filter((c) => show[c] && !state[toggleFor[c]]).join(",");
  const [boxes, setBoxes] = useState<Box[]>([]);

  useEffect(() => {
    const categories = key ? (key.split(",") as Category[]) : [];
    if (!categories.length) { setBoxes([]); return; }
    let frame = 0;
    const schedule = () => { frame ||= requestAnimationFrame(() => { frame = 0; setBoxes(measure(categories)); }); };
    const mo = new MutationObserver((records) => {
      const outside = (n: Node) => !(n instanceof Element ? n : n.parentElement)?.closest(".a11y-hl-layer");
      if (records.some((r) => outside(r.target))) schedule();
    });
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true); // sticky headers and inner scroll areas
    const timer = setInterval(schedule, 1000); // CSS transitions and marquees don't fire any event
    schedule();
    return () => {
      mo.disconnect(); ro.disconnect(); clearInterval(timer); cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
    };
  }, [key]);

  if (!boxes.length) return null;
  return createPortal(
    <div className="a11y-hl-layer" aria-hidden="true">
      {boxes.map((b) => (
        <div
          key={b.key}
          className={`a11y-hl a11y-hl--${b.category}${b.inside ? " a11y-hl--inside" : ""}`}
          style={{ top: b.top, left: b.left, width: b.width, height: b.height }}
        >
          <span
            className="a11y-hl-tag"
            style={{
              maxWidth: Math.min(320, Math.max(80, document.documentElement.clientWidth - b.left - 8)),
              ...(b.stack ? { [b.inside ? "top" : "bottom"]: `calc(${b.inside ? "0px" : "100%"} + ${b.stack * 16}px)` } : {}),
            }}
          >
            <CategoryIcon category={b.category} />
            <span>{b.label}</span>
          </span>
        </div>
      ))}
    </div>,
    document.body,
  );
}
