export function Callout({ title, tone = "info", children }: { title?: string; tone?: "info" | "warning" | "success"; children: React.ReactNode }) {
  return (
    <aside className={`callout callout--${tone}`} aria-label={title}>
      {title && <p className="callout-title">{title}</p>}
      <div className="callout-body">{children}</div>
    </aside>
  );
}
