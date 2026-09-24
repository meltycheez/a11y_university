// Temporary page used by every route until its real template lands (plan 05).
// It renders the section's chrome, title, breadcrumbs, and links to child pages so navigation can be exercised.
import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { ButtonLink } from "~/components/Button";
import { Callout } from "~/components/Callout";
import { Card, CardGrid } from "~/components/Card";
import { Hero } from "~/components/Hero";
import { pageTitle } from "~/data/brand";
import { megaMenu } from "~/data/navigation";
import { sections } from "~/layouts/sections";
import { getChildren, getEntry } from "~/routes/inventory";
import { usePathname } from "~/routes/usePathname";

export const meta: MetaFunction = ({ location }) => {
  const entry = getEntry(location.pathname);
  return [{ title: pageTitle(entry?.title ?? "Page") }];
};

export default function StubPage() {
  const pathname = usePathname();
  const entry = getEntry(pathname);
  if (!entry) return null;

  const config = sections[entry.section];
  const children = getChildren(entry.path);
  const isHome = entry.path === "/";
  const showHeroImage = isHome || !entry.parent;
  const variant = config.variant === "cms" || config.variant === "intranet" || config.variant === "portal" ? "banner" : "overlay";

  return (
    <>
      <Hero
        title={isHome ? "Deep roots. Wide branches." : entry.title}
        kicker={isHome ? "Redwood State University" : config.siteName}
        lede={isHome ? "A public research university on California's redwood coast, where 18,000 students learn, discover, and grow." : entry.summary}
        image={showHeroImage ? config.heroImage : undefined}
        variant={variant}
      >
        {isHome && (
          <>
            <ButtonLink to="/admissions">Apply to Redwood State</ButtonLink>
            <ButtonLink to="/admissions/visit" variant="secondary">Plan a visit</ButtonLink>
          </>
        )}
      </Hero>

      <div className="page-content">
        {!isHome && (
          <Callout title="Page in progress">
            <p>The full content for this page is part of a later build phase. Use the links below to explore nearby pages.</p>
          </Callout>
        )}

        {isHome && (
          <section aria-labelledby="explore-heading" className="stack">
            <h2 id="explore-heading">Explore Redwood State</h2>
            <CardGrid>
              {megaMenu.map((s) => (
                <Card key={s.id} title={s.feature.title} href={s.feature.href} text={s.feature.text} image={s.feature.image} meta={s.label} />
              ))}
            </CardGrid>
          </section>
        )}

        {children.length > 0 && (
          <section aria-labelledby="children-heading" className="stack">
            <h2 id="children-heading">In this section</h2>
            <ul className="link-grid">
              {children.map((c) => (
                <li key={c.path}><Link to={c.path}>{c.title}</Link></li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
