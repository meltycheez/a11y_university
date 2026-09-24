import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useScenario } from "~/a11y/useScenario";
import { megaMenu, type MegaSection } from "~/data/navigation";
import { Img } from "./Img";

/** Scenario nav-megamenu-hover-001: hover-only while defective, disclosure buttons once fixed. */
export function MegaMenu() {
  const fixed = useScenario("nav-megamenu-hover-001");
  return fixed ? <DisclosureMegaMenu /> : <HoverMegaMenu />;
}

/** Defect: panels open on CSS :hover only. Keyboard and touch users never reach the panel links. */
function HoverMegaMenu() {
  return (
    <nav className="mega-nav mega-nav--hover" aria-label="Main" data-a11y-scenario="nav-megamenu-hover-001">
      <ul className="mega-list">
        {megaMenu.map((section) => (
          <li key={section.id} className="mega-item">
            <Link to={section.href} className="mega-trigger">
              {section.label}
              <span className="mega-caret" aria-hidden="true" />
            </Link>
            <div className="mega-panel">
              <MegaPanelContent section={section} />
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Disclosure buttons: Enter/Space toggle, Esc closes and returns focus, Left/Right move between triggers. */
function DisclosureMegaMenu() {
  const [openId, setOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => setOpenId(null), [pathname]);

  useEffect(() => {
    if (!openId) return;
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenId(null);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [openId]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && openId) {
      const trigger = navRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="mega-${openId}"]`);
      setOpenId(null);
      trigger?.focus();
      return;
    }
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const triggers = [...(navRef.current?.querySelectorAll<HTMLButtonElement>(".mega-trigger") ?? [])];
    const i = triggers.indexOf(e.target as HTMLButtonElement);
    if (i < 0) return;
    e.preventDefault();
    triggers[(i + (e.key === "ArrowRight" ? 1 : -1) + triggers.length) % triggers.length].focus();
  };

  return (
    <nav className="mega-nav" aria-label="Main" ref={navRef} onKeyDown={onKeyDown}>
      <ul className="mega-list">
        {megaMenu.map((section) => {
          const open = openId === section.id;
          return (
            <li key={section.id} className={`mega-item${open ? " is-open" : ""}`}>
              <button
                type="button"
                className="mega-trigger"
                aria-expanded={open}
                aria-controls={`mega-${section.id}`}
                onClick={() => setOpenId(open ? null : section.id)}
              >
                {section.label}
                <span className="mega-caret" aria-hidden="true" />
              </button>
              <div id={`mega-${section.id}`} className="mega-panel" hidden={!open}>
                <MegaPanelContent section={section} />
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MegaPanelContent({ section }: { section: MegaSection }) {
  return (
    <div className="mega-panel-inner">
      <div className="mega-columns">
        {section.columns.map((col) => (
          <div className="mega-column" key={col.heading}>
            <p className="mega-heading">{col.heading}</p>
            <ul>
              {col.links.map((link) => (
                <li key={link.href}><Link to={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mega-feature">
        {section.feature.image && <Img image={section.feature.image} alt="" sizes="20rem" aspect="16 / 9" />}
        <p className="mega-feature-title">
          <Link to={section.feature.href}>{section.feature.title}</Link>
        </p>
        <p>{section.feature.text}</p>
      </div>
    </div>
  );
}
