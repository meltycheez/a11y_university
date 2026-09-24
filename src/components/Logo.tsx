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
