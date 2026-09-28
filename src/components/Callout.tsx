export function Callout({ id, title, tone = "info", children }: { id?: string; title?: string; tone?: "info" | "warning" | "success"; children: React.ReactNode }) {
  return (
    <aside id={id} className={`callout callout--${tone}`} aria-label={title}>
      {title && <p className="callout-title">{title}</p>}
      <div className="callout-body">{children}</div>
    </aside>
  );
}
