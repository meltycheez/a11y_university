// Scenario helpers for the defect patterns pages repeat most. Each renders the defective markup while its
// scenario's toggle is OFF and the fixed markup when ON, and marks its root with data-a11y-scenario.
// The registry entry decides which rule a given use represents; the helper only switches markup.
import { Link } from "react-router";
import { useScenario } from "./useScenario";

const marker = (id: string) => ({ "data-a11y-scenario": id });
const base = import.meta.env.BASE_URL;
const isExternal = (to: string) => /^(https?:|mailto:|tel:)/.test(to) || to.startsWith("/documents/");
const href = (to: string) => (to.startsWith("/") ? base + to.slice(1) : to);

interface SmartLinkProps {
  scenario: string;
  to: string;
  /** Link text once fixed (the descriptive version). */
  children: React.ReactNode;
  /** Link text while defective, e.g. "Read more", "Click here". Omit to keep `children`. */
  defect?: React.ReactNode;
  /** Opens a new window; while defective there is no warning. */
  newWindow?: boolean;
  /** File type and size appended once fixed, e.g. "PDF, 240 KB". */
  fileInfo?: string;
  /** `title` attribute shown only while defective (title-redundant / img-title-attr patterns). */
  defectTitle?: string;
  className?: string;
}

/** Generic, new-window, document and redundant-title link defects. */
export function SmartLink({ scenario, to, children, defect, newWindow, fileInfo, defectTitle, className }: SmartLinkProps) {
  const fixed = useScenario(scenario);
  const text = fixed || defect === undefined ? children : defect;
  const extra = fixed && (newWindow || fileInfo)
    ? <> <span className="link-meta">({[fileInfo, newWindow && "opens in a new tab"].filter(Boolean).join(", ")})</span></>
    : null;
  const props = { className, title: fixed ? undefined : defectTitle, ...marker(scenario), ...(newWindow ? { target: "_blank", rel: "noopener" } : {}) };
  return isExternal(to) || newWindow
    ? <a href={href(to)} {...props}>{text}{extra}</a>
    : <Link to={to} {...props}>{text}{extra}</Link>;
}

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  scenario: string;
  /** Accessible name once fixed. */
  label: string;
  icon: React.ReactNode;
}

/** Icon-only button: no accessible name while defective (button-empty). */
export function IconButton({ scenario, label, icon, className, ...rest }: IconButtonProps) {
  const fixed = useScenario(scenario);
  return (
    <button type="button" className={["icon-button", className].filter(Boolean).join(" ")} {...marker(scenario)} {...rest}>
      <span aria-hidden="true">{icon}</span>
      {fixed && <span className="visually-hidden">{label}</span>}
    </button>
  );
}

type FieldDefect = "missing" | "placeholder" | "orphaned" | "for-mismatch";
interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  scenario: string;
  id: string;
  label: string;
  /**
   * missing: visible text is not a <label>. placeholder: no label, placeholder only.
   * orphaned: a <label> with no `for`. for-mismatch: `for` points at a wrong id.
   */
  defect: FieldDefect;
  hint?: string;
}

/** Text input with a labeling defect; fixed = a visible <label for>. */
export function Field({ scenario, id, label, defect, hint, placeholder, className, ...rest }: FieldProps) {
  const fixed = useScenario(scenario);
  const hintId = hint ? `${id}-hint` : undefined;
  let labelEl: React.ReactNode;
  if (fixed) labelEl = <label htmlFor={id}>{label}</label>;
  else if (defect === "missing") labelEl = <span className="field-label">{label}</span>;
  else if (defect === "orphaned") labelEl = <label className="field-label">{label}</label>;
  else if (defect === "for-mismatch") labelEl = <label htmlFor={`${id}-input`}>{label}</label>;
  return (
    <div className={["field", className].filter(Boolean).join(" ")} {...marker(scenario)}>
      {labelEl}
      {hint && <span id={hintId} className="field-hint">{hint}</span>}
      <input id={id} aria-describedby={fixed ? hintId : undefined} placeholder={defect === "placeholder" && !fixed ? label : placeholder} {...rest} />
    </div>
  );
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
interface HeadingProps {
  scenario: string;
  /** Level once fixed. */
  level: HeadingLevel;
  /** skipped: wrong level (`defectLevel`). fake: bold paragraph. empty: heading element with no text. */
  defect: "skipped" | "fake" | "empty";
  defectLevel?: HeadingLevel;
  className?: string;
  children: React.ReactNode;
}

export function Heading({ scenario, level, defect, defectLevel, className, children }: HeadingProps) {
  const fixed = useScenario(scenario);
  if (!fixed && defect === "fake") return <p className={["fake-heading", className].filter(Boolean).join(" ")} {...marker(scenario)}><strong>{children}</strong></p>;
  const H = `h${fixed || defect !== "skipped" ? level : (defectLevel ?? level)}` as const;
  return <H className={className} {...marker(scenario)}>{!fixed && defect === "empty" ? null : children}</H>;
}
