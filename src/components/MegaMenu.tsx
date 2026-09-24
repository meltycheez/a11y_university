import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { megaMenu } from "~/data/navigation";
import { Img } from "./Img";

/** Baseline accessible mega menu: disclosure buttons, Esc to close, closes on navigation. */
export function MegaMenu() {
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
    }
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
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
