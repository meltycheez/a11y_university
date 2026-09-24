import { Link, Outlet } from "react-router";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { NavItem } from "~/components/NavItem";
import { LogoMark } from "~/components/Logo";
import { SiteFooter } from "~/components/SiteFooter";
import { SiteHeader } from "~/components/SiteHeader";
import { brand } from "~/data/brand";
import { getEntry, type Section } from "~/routes/inventory";
import { usePathname } from "~/routes/usePathname";
import { sections, type SectionConfig } from "./sections";

export default function UniversityLayout() {
  const pathname = usePathname();
  const section: Section = getEntry(pathname)?.section ?? "utility";
  const config = sections[section];

  if (config.variant === "portal") return <PortalShell config={config} />;
  if (config.variant === "lab") return <LabShell config={config} />;

  const sidebar = config.variant === "cms" || config.variant === "intranet";

  return (
    <div className={`site site--${config.variant}`} data-section={section}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />
      {config.siteName && <SectionBar config={config} withLinks={!sidebar} />}
      <div className={`page-frame container${sidebar ? " page-frame--sidebar" : ""}`}>
        {sidebar && config.links && (
          <nav className="section-sidebar" aria-label={`${config.siteName} navigation`}>
            <p className="section-sidebar-title">{config.siteName}</p>
            <ul>
              {config.links.map((l) => (
                <li key={l.href}><NavItem to={l.href}>{l.label}</NavItem></li>
              ))}
            </ul>
          </nav>
        )}
        <main id="main-content" tabIndex={-1} className="page-main">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}

function SectionBar({ config, withLinks }: { config: SectionConfig; withLinks: boolean }) {
  return (
    <div className={`section-bar section-bar--${config.variant}`}>
      <div className="container section-bar-inner">
        <p className="section-bar-name">
          <Link to={config.siteHref ?? "/"}>{config.siteName}</Link>
          {config.tagline && <span className="section-bar-tagline">{config.tagline}</span>}
        </p>
        {withLinks && config.links && (
          <nav aria-label={`${config.siteName} sections`} className="section-bar-nav">
            <ul>
              {config.links.map((l) => (
                <li key={l.href}><NavItem to={l.href}>{l.label}</NavItem></li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

/** Enterprise-style student portal shell (vendor ERP look), still branded RSU. */
function PortalShell({ config }: { config: SectionConfig }) {
  return (
    <div className="site site--portal" data-section="portal">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="portal-appbar">
        <Link to="/" className="portal-home">
          <LogoMark size={30} />
          <span className="visually-hidden">{brand.name} home</span>
        </Link>
        <Link to="/portal" className="portal-product">{config.siteName}</Link>
        <span className="portal-term">Fall 2026</span>
        <span className="portal-user">
          <span className="portal-avatar" aria-hidden="true">JA</span>
          Jordan Alvarez
        </span>
      </header>
      <div className="portal-body">
        <nav className="portal-rail" aria-label="Portal">
          <ul>
            {config.links?.map((l) => (
              <li key={l.href}><NavItem to={l.href}>{l.label}</NavItem></li>
            ))}
          </ul>
        </nav>
        <main id="main-content" tabIndex={-1} className="portal-main">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/** Accessibility Lab tooling shell: deliberately separate from (and cleaner than) the university chrome. */
function LabShell({ config }: { config: SectionConfig }) {
  return (
    <div className="site site--lab" data-section="lab">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="lab-header">
        <div className="container lab-header-inner">
          <Link to="/accessibility-lab" className="lab-title">RSU Accessibility Lab</Link>
          <Link to="/">Back to the university site</Link>
        </div>
      </header>
      <div className="container page-frame page-frame--sidebar">
        <nav className="section-sidebar" aria-label="Lab pages">
          <ul>
            {config.links?.map((l) => (
              <li key={l.href}><NavItem to={l.href}>{l.label}</NavItem></li>
            ))}
          </ul>
        </nav>
        <main id="main-content" tabIndex={-1} className="page-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
