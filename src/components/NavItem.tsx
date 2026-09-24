import { Link } from "react-router";
import { normalizePath } from "~/routes/inventory";
import { usePathname } from "~/routes/usePathname";

/** Navigation link marked aria-current="page" on exact match (trailing-slash tolerant, unlike NavLink). */
export function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  const current = usePathname() === normalizePath(to);
  return (
    <Link to={to} aria-current={current ? "page" : undefined}>
      {children}
    </Link>
  );
}
