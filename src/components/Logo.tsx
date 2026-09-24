import { brand } from "~/data/brand";

/** Stylized redwood mark. Decorative when paired with the visible wordmark. */
export function LogoMark({ size = 44, title }: { size?: number; title?: string }) {
  return (
    <svg
      className="logo-mark"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <circle cx="24" cy="24" r="23" fill="var(--brand-redwood)" />
      <circle cx="24" cy="24" r="19.5" fill="none" stroke="var(--brand-gold)" strokeWidth="1.2" />
      <path d="M24 8 L31 20 H27.5 L33 29 H28.5 L34 37 H14 L19.5 29 H15 L20.5 20 H17 Z" fill="var(--brand-mist)" />
      <rect x="22.5" y="37" width="3" height="4" fill="var(--brand-mist)" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="wordmark">
      <span className="wordmark-name">Redwood State</span>
      <span className="wordmark-sub">University</span>
    </span>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <Wordmark />
      <span className="visually-hidden">{brand.name} home</span>
    </span>
  );
}

// SVG accessibility props shared by the brand marks: decorative unless a title is given.
const a11y = (title?: string) => ({ role: title ? "img" : undefined, "aria-hidden": title ? undefined : true, "aria-label": title, focusable: "false" as const });

/** University seal: redwood mark ringed by the name and founding year. */
export function Seal({ size = 120, title }: { size?: number; title?: string }) {
  return (
    <svg className="seal" width={size} height={size} viewBox="0 0 120 120" {...a11y(title)}>
      <defs>
        <path id="seal-top" d="M 60 104 A 44 44 0 1 1 60 16 A 44 44 0 1 1 60 104" />
        <path id="seal-bottom" d="M 12 60 A 48 48 0 0 0 108 60" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="var(--brand-redwood)" />
      <circle cx="60" cy="60" r="54" fill="none" stroke="var(--brand-gold)" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="var(--brand-gold)" strokeWidth="1.5" />
      <g fill="var(--brand-mist)" fontFamily="var(--font-serif)" fontWeight="650" letterSpacing="1">
        <text fontSize="8.5"><textPath href="#seal-top" startOffset="50%" textAnchor="middle">REDWOOD STATE UNIVERSITY</textPath></text>
        <text fontSize="7.5"><textPath href="#seal-bottom" startOffset="50%" textAnchor="middle">· FOUNDED 1911 ·</textPath></text>
      </g>
      <g transform="translate(36 37)">
        <path d="M24 8 L31 20 H27.5 L33 29 H28.5 L34 37 H14 L19.5 29 H15 L20.5 20 H17 Z" fill="var(--brand-mist)" />
        <rect x="22.5" y="37" width="3" height="4" fill="var(--brand-mist)" />
      </g>
    </svg>
  );
}

/** Athletics mark: Rowan the owl's face on a shield, for the Redwood Owls. */
export function AthleticsMark({ size = 48, title }: { size?: number; title?: string }) {
  return (
    <svg className="athletics-mark" width={size} height={size * 1.15} viewBox="0 0 48 55" {...a11y(title)}>
      <path d="M24 2 L45 9 V27 C45 40 36 49 24 53 C12 49 3 40 3 27 V9 Z" fill="var(--brand-redwood)" stroke="var(--brand-gold)" strokeWidth="2" />
      <path d="M12 16 L18 21 H30 L36 16 L35 30 C35 38 30 43 24 45 C18 43 13 38 13 30 Z" fill="var(--brand-fern)" />
      <circle cx="19" cy="28" r="5" fill="var(--brand-mist)" />
      <circle cx="29" cy="28" r="5" fill="var(--brand-mist)" />
      <circle cx="19" cy="28" r="2.2" fill="var(--brand-bark)" />
      <circle cx="29" cy="28" r="2.2" fill="var(--brand-bark)" />
      <path d="M24 32 L26.5 36 L24 39 L21.5 36 Z" fill="var(--brand-gold)" />
    </svg>
  );
}
