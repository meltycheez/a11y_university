import { Link } from "react-router";
import { getTrail } from "~/routes/inventory";
import { usePathname } from "~/routes/usePathname";

export function Breadcrumbs() {
  const pathname = usePathname();
  const trail = getTrail(pathname);
  if (trail.length < 2) return null;
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((entry, i) => {
          const last = i === trail.length - 1;
          const label = entry.path === "/" ? "Home" : entry.title;
          return (
            <li key={entry.path}>
              {last ? <span aria-current="page">{label}</span> : <Link to={entry.path}>{label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
