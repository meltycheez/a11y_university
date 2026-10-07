// A site-styled confirmation (never the browser's window.confirm). Infrastructure: accessible, no scenarios.
import { useState } from "react";
import { Modal } from "~/components/Modal";

export interface ConfirmOptions { title: string; message: string; confirmLabel: string; danger?: boolean; onConfirm: () => void }

/** `ask(options)` opens the dialog; render `dialog` once. Esc, the × button and Cancel all cancel. */
export function useConfirm() {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const close = () => setOpts(null);
  const dialog = (
    <Modal open={!!opts} title={opts?.title ?? "Confirm"} onClose={close}>
      {/* Only while open: a closed <dialog> is still in the DOM, and WAVE flags an unlabeled button inside it. */}
      {opts && (
        <div className="ctf-confirm">
          <p>{opts.message}</p>
          <div className="ctf-actions">
            <button type="button" className={`ctf-btn${opts.danger ? " ctf-btn--danger" : ""}`} onClick={() => { opts.onConfirm(); close(); }}>
              {opts.confirmLabel}
            </button>
            <button type="button" className="ctf-btn ctf-btn--quiet" onClick={close}>Cancel</button>
          </div>
        </div>
      )}
    </Modal>
  );
  return { ask: setOpts, dialog };
}
