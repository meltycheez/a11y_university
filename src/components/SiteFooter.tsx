import { Link } from "react-router";
import { brand } from "~/data/brand";
import { footerColumns } from "~/data/navigation";
import { LogoMark } from "./Logo";

// Fictional social networks (docs/WORLD.md) with generic glyphs: camera, play button, people.
const social = [
  { label: "PhotoPine", path: "M9 4h6l1.5 2H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.5Zm3 4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" },
  { label: "ReelWave", path: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-2 6v8l6-4Z" },
  { label: "WorkCircle", path: "M8 11a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm8 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM1.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5Zm14.5 0c0-1.9-.6-3.6-1.7-5 .5-.1 1.1-.2 1.7-.2 3 0 5.5 2.4 5.5 5.2Z" },
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
                <a href={`https://${s.label.toLowerCase()}.example/redwoodstate`}>
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
