import { useEffect, useId, useRef } from "react";
import { useScenario } from "~/a11y/useScenario";

/**
 * Defect variants (plan 06 #12), shown while `scenario` is unfixed:
 * - "no-trap" (kbd-focus-trap-bad): opened non-modally, so Tab walks out into the page behind it.
 * - "no-restore" (focus-not-restored): modal, but focus is dropped on <body> when it closes.
 * - "no-semantics" (sr-modal-no-context): a styled <div> overlay: no dialog role or name, focus isn't moved, Esc does nothing.
 */
export type ModalDefect = "no-trap" | "no-restore" | "no-semantics";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  scenario?: string;
  defect?: ModalDefect;
}

/** Accessible modal on the native <dialog> element (focus trap, Esc, focus restore) with optional defect variants. */
export function Modal({ open, title, onClose, children, scenario, defect }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const fixed = useScenario(scenario);
  const broken = scenario && !fixed ? defect : undefined;
  const marker = scenario ? { "data-a11y-scenario": scenario } : {};

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) broken === "no-trap" ? dialog.show() : dialog.showModal();
    if (!open && dialog.open) {
      dialog.close();
      if (broken === "no-restore") (document.activeElement as HTMLElement | null)?.blur();
    }
  }, [open, broken]);

  const header = (
    <div className="modal-header">
      {broken === "no-semantics" ? <p className="modal-title">{title}</p> : <h2 id={titleId}>{title}</h2>}
      <button type="button" className="modal-close" onClick={onClose} aria-label={broken === "no-semantics" ? undefined : "Close"}>
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );

  if (broken === "no-semantics") {
    return open ? (
      <div className="modal-backdrop" onClick={onClose} {...marker}>
        <div className="modal modal--div" onClick={(e) => e.stopPropagation()}>
          {header}
          <div className="modal-body">{children}</div>
        </div>
      </div>
    ) : null;
  }

  return (
    <dialog ref={ref} className="modal" aria-labelledby={titleId} onClose={onClose} onCancel={onClose} {...marker}>
      {header}
      <div className="modal-body">{children}</div>
    </dialog>
  );
}
