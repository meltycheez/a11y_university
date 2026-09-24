import { Link } from "react-router";
import { brand } from "~/data/brand";
import { footerColumns } from "~/data/navigation";
import { LogoMark } from "./Logo";

const social = [
  { label: "Instagram", path: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" },
  { label: "YouTube", path: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3Z" },
  { label: "LinkedIn", path: "M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-2 6h4v12H2Zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21H9Z" },
];

export function SiteFooter() {
  const { address } = brand;
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <LogoMark size={56} />
          <p className="footer-name">{brand.name}</p>
          <address>
            {address.street}<br />
            {address.city}, {address.state} {address.zip}<br />
            <a href={`tel:${brand.phone.replace(/\D/g, "")}`}>{brand.phone}</a><br />
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </address>
          <ul className="social-links">
            {social.map((s) => (
              <li key={s.label}>
                <a href={`#social-${s.label.toLowerCase()}`}>
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d={s.path} fill="currentColor" /></svg>
                  <span className="visually-hidden">{brand.shortName} on {s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        {footerColumns.map((col) => (
          <nav className="footer-column" key={col.heading} aria-label={`Footer: ${col.heading}`}>
            <p className="footer-heading">{col.heading}</p>
            <ul>
              {col.links.map((l) => <li key={l.href}><Link to={l.href}>{l.label}</Link></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className="footer-legal">
        <div className="container legal-inner">
          <p>© 2026 {brand.name}. <em>{brand.motto}</em>: {brand.mottoTranslation}.</p>
          <p className="fictional-notice">
            Redwood State University is a fictional institution. This site is an accessibility testing fixture and contains intentional accessibility defects.
          </p>
        </div>
      </div>
    </footer>
  );
}
