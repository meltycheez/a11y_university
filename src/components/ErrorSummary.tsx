// The error summary a fixed form shows above its fields when a submit fails (plan 14 §6). It takes focus, so screen
// reader users hear the count and land on the list, and each link moves focus into its field. Infrastructure: always
// accessible, registers no scenarios. CSS: styles/components.css (.error-summary).
import { useEffect, useId, useRef, useState } from "react";

export interface FieldError { id: string; label: string; message: string }

/** Follows an error link into its field. A plain #id link only scrolls; this focuses the field (and scrolls to it). */
export function focusField(e: React.MouseEvent<HTMLAnchorElement>) {
  const el = document.getElementById(e.currentTarget.hash.slice(1));
  // A wrapper (a custom dropdown, a date group) links to its first control.
  const target = el?.matches(FOCUSABLE) ? el : el?.querySelector<HTMLElement>(FOCUSABLE);
  if (!target) return;
  e.preventDefault();
  // Show the whole group with its legend (a radio's own row isn't enough to see what it's asking), then focus.
  (target.closest("fieldset") ?? target).scrollIntoView?.({ block: "center" });
  // focusVisible: draw the focus ring even though this came from a mouse click (browsers that support it).
  target.focus({ preventScroll: true, focusVisible: true } as FocusOptions);
}
const FOCUSABLE = "input:not([type=hidden]), select, textarea, button, [tabindex]:not([tabindex='-1'])";

/**
 * Clears a message, then shows the new one a moment later. A repeat submit then visibly refreshes it, and screen
 * readers read it again: an alert or status whose text doesn't change isn't announced twice.
 */
export function showFresh<T>(set: (v: T) => void, empty: T, value: T) {
  set(empty);
  setTimeout(() => set(value), FRESH_MS);
}
export const FRESH_MS = 100;

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const nameOf = (el: Control) =>
  ((el.type === "radio" || el.type === "checkbox") && el.closest("fieldset")?.querySelector("legend")?.textContent
    || el.labels?.[0]?.textContent || el.getAttribute("aria-label") || el.name)!.replace(/\s*\((required|optional)\)\s*$/i, "").trim();
const reason = (el: Control, label: string) => {
  if (el.type === "email") return "Enter an email address like name@example.com.";
  if (el.type === "radio") return "Choose one option.";
  if (el.type === "checkbox") return "Check the box to continue.";
  if (el instanceof HTMLSelectElement) return "Select an option.";
  // "Your name" → "Enter your name."; "First name" → "Enter your first name."
  if (el.validity.valueMissing) return `Enter ${/^your /i.test(label) ? "" : "your "}${label.toLowerCase()}.`;
  return el.validationMessage || "Check this field.";
};

/**
 * The form's invalid fields, from the browser's own checks (`required`, `type="email"`): one entry per field, one per
 * radio group (linked to its first button). Marks each field `aria-invalid` until it's fixed. Use with `noValidate`.
 */
export function formErrors(form: HTMLFormElement): FieldError[] {
  const errors: FieldError[] = [];
  const groups = new Set<string>();
  for (const el of [...form.elements] as Control[]) {
    if (!("validity" in el) || el.disabled) continue;
    const bad = !el.validity.valid;
    if (bad) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
    if (!bad || (el.type === "radio" && groups.has(el.name))) continue;
    if (el.type === "radio") groups.add(el.name);
    const label = nameOf(el);
    errors.push({ id: el.id, label, message: reason(el, label) });
  }
  return errors.filter((e) => e.id); // a field the summary can't link to would be a dead link
}

/** `attempt` goes up on each failed submit: the summary takes focus each time, even if the errors are the same. */
export function ErrorSummary({ errors, attempt }: { errors: FieldError[]; attempt: number }) {
  const box = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => { if (attempt) box.current?.focus(); }, [attempt]);
  if (!errors.length) return null;
  return (
    <div ref={box} className="error-summary" tabIndex={-1} role="alert" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="error-summary-title">Form errors ({errors.length}): Select a link to go to the field with the error.</h2>
      <ul>
        {errors.map((e) => <li key={e.id}><a href={`#${e.id}`} onClick={focusField}>{e.label}</a>: {e.message}</li>)}
      </ul>
    </div>
  );
}

/**
 * For a form that validates with the browser's own checks: `check(form)` returns true when it can submit; otherwise
 * the summary (render `summary` at the top of the form) lists what to fix and takes focus. `clear()` hides it.
 */
export function useErrorSummary() {
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [attempt, setAttempt] = useState(0);
  const check = (form: HTMLFormElement) => {
    const found = formErrors(form);
    // Every submit clears the old summary first, then shows what's still wrong (and takes focus again).
    setErrors([]);
    if (found.length) setTimeout(() => { setErrors(found); setAttempt((n) => n + 1); }, FRESH_MS);
    return !found.length;
  };
  return { check, clear: () => setErrors([]), summary: <ErrorSummary errors={errors} attempt={attempt} /> };
}
