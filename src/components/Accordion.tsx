import { useId, useState } from "react";
import { useScenario } from "~/a11y/useScenario";

export interface AccordionItem { title: string; content: React.ReactNode }

/**
 * Defect variants (plan 06 #12), shown while `scenario` is unfixed:
 * - "no-state" (sr-accordion-state): real buttons, but no aria-expanded / aria-controls.
 * - "div-trigger" (kbd-div-button): the header is a clickable <div>: no role, not focusable.
 */
export type AccordionDefect = "no-state" | "div-trigger";

/** Accessible accordion (disclosure buttons inside headings) with optional defect variants. */
export function Accordion({ items, headingLevel = 3, scenario, defect }: { items: AccordionItem[]; headingLevel?: 2 | 3 | 4; scenario?: string; defect?: AccordionDefect }) {
  const id = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const fixed = useScenario(scenario);
  const broken = scenario && !fixed ? defect : undefined;
  const H = `h${headingLevel}` as const;
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  return (
    <div className="accordion" {...(scenario ? { "data-a11y-scenario": scenario } : {})}>
      {items.map((item, i) => {
        const expanded = open.has(i);
        const inner = <><span>{item.title}</span><span className="accordion-icon" aria-hidden="true" /></>;
        return (
          <div className={`accordion-item${expanded ? " is-open" : ""}`} key={i}>
            {broken === "div-trigger" ? (
              <div className="accordion-heading accordion-trigger" onClick={() => toggle(i)}>{inner}</div>
            ) : (
              <H className="accordion-heading">
                <button
                  type="button"
                  aria-expanded={broken ? undefined : expanded}
                  aria-controls={broken ? undefined : `${id}-panel-${i}`}
                  id={`${id}-btn-${i}`}
                  onClick={() => toggle(i)}
                >
                  {inner}
                </button>
              </H>
            )}
            <div
              id={`${id}-panel-${i}`}
              role={broken ? undefined : "region"}
              aria-labelledby={broken ? undefined : `${id}-btn-${i}`}
              className="accordion-panel"
              hidden={!expanded}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
