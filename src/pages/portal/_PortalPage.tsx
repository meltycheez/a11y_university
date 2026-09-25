// PortalPage template: the RedwoodConnect page header (title, subtitle, toolbar) inside the layout's PortalShell,
// plus small formatters shared by the portal views. Portal data is read in each route's loader.
import { IconButton } from "~/a11y/helpers";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const money = (n: number) => usd.format(n);

/** "09:30" → "9:30 a.m." */
export function time12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "a.m." : "p.m."}`;
}

/** "2026-10-15" → "10/15/2026" (the ERP's date format). */
export const erpDate = (iso: string) => { const [y, m, d] = iso.slice(0, 10).split("-"); return `${m}/${d}/${y}`; };

const printer = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" focusable="false">
    <path d="M6 2h12v5H6zM4 8h16a2 2 0 0 1 2 2v7h-4v5H6v-5H2v-7a2 2 0 0 1 2-2Zm4 8v4h8v-4Z" />
  </svg>
);

export function PortalPage({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="pt-page">
      <div className="pt-pagehead">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="pt-subtitle">{subtitle}</p>}
        </div>
        <div className="pt-toolbar">
          <span className="pt-refreshed">Data as of 10/05/2026 7:00 AM</span>
          <IconButton scenario="portal-template-print-empty-001" label="Print this page" icon={printer} onClick={() => window.print()} className="pt-icon-btn" />
        </div>
      </div>
      {children}
    </div>
  );
}
