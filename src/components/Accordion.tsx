import { useId, useState } from "react";

export interface AccordionItem { title: string; content: React.ReactNode }

/** Baseline accessible accordion (disclosure buttons inside headings). */
export function Accordion({ items, headingLevel = 3 }: { items: AccordionItem[]; headingLevel?: 2 | 3 | 4 }) {
  const id = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const H = `h${headingLevel}` as const;
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  return (
    <div className="accordion">
      {items.map((item, i) => {
        const expanded = open.has(i);
        return (
          <div className="accordion-item" key={i}>
            <H className="accordion-heading">
              <button type="button" aria-expanded={expanded} aria-controls={`${id}-panel-${i}`} id={`${id}-btn-${i}`} onClick={() => toggle(i)}>
                <span>{item.title}</span>
                <span className="accordion-icon" aria-hidden="true" />
              </button>
            </H>
            <div id={`${id}-panel-${i}`} role="region" aria-labelledby={`${id}-btn-${i}`} className="accordion-panel" hidden={!expanded}>
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
