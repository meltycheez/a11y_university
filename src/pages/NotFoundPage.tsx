import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { SiteSearch } from "~/components/SiteSearch";
import { pageTitle } from "~/data/brand";

export const meta: MetaFunction = () => [{ title: pageTitle("Page Not Found") }];

export default function NotFoundPage() {
  return (
    <div className="page-content not-found">
      <p className="not-found-code">404</p>
      <h1>We couldn't find that page</h1>
      <p>The page may have moved during our website redesign, or the address may be mistyped.</p>
      <SiteSearch />
      <ul className="link-grid">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/admissions">Admissions</Link></li>
        <li><Link to="/academics">Academics</Link></li>
        <li><Link to="/sitemap">Site Map</Link></li>
      </ul>
    </div>
  );
}
