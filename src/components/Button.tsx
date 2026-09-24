import { Link } from "react-router";

type Variant = "primary" | "secondary" | "ghost";

export function ButtonLink({ to, variant = "primary", children }: { to: string; variant?: Variant; children: React.ReactNode }) {
  return <Link to={to} className={`btn btn--${variant}`}>{children}</Link>;
}

export function Button({ variant = "primary", className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={["btn", `btn--${variant}`, className].filter(Boolean).join(" ")} {...rest} />;
}
