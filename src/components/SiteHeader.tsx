import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { audienceLinks, utilityLinks } from "~/data/navigation";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { SiteSearch } from "./SiteSearch";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-inner">
          <nav aria-label="Audiences" className="audience-nav">
            <ul>
              {audienceLinks.map((l) => <li key={l.href}><Link to={l.href}>{l.label}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Quick links" className="quick-nav">
            <ul>
              {utilityLinks.map((l) => <li key={l.href}><Link to={l.href}>{l.label}</Link></li>)}
            </ul>
          </nav>
        </div>
      </div>
      <div className="brand-bar">
        <div className="container brand-inner">
          <Link to="/" className="brand-link"><Logo /></Link>
          <SiteSearch />
          <button type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen((o) => !o)}>
            <span className="menu-toggle-bars" aria-hidden="true" />
            Menu
          </button>
        </div>
      </div>
      <div id="primary-nav" className={`primary-nav${menuOpen ? " is-open" : ""}`}>
        <div className="container">
          <MegaMenu />
        </div>
      </div>
    </header>
  );
}
