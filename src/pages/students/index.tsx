import { Link } from "react-router";
import { Heading } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import { CtaBand } from "~/components/blocks";
import { LinkList, content } from "~/pages/admissions/_content";

export { inventoryMeta as meta } from "~/routes/meta";

const QUICK = [
  { label: "RedwoodConnect", href: "/portal", icon: "▦" },
  { label: "Canopy Learn", href: "https://learn.redwoodstate.edu", icon: "✎" },
  { label: "Student email", href: "https://mail.redwoodstate.edu", icon: "✉" },
  { label: "Campus Map", href: "/campus-map", icon: "⌖" },
];

const POPULAR = [
  { label: "Housing & Residential Life", href: "/students/housing", image: "campus-housing-madrone" },
  { label: "Dining Services", href: "/students/dining", image: "campus-dining-hall" },
  { label: "Career Center", href: "/students/careers", image: "campus-career-center" },
  { label: "Campus Recreation", href: "/students/recreation", image: "campus-rec-center" },
];

export default function StudentsHome() {
  const c = content("/students")!;
  const groups = c.sections.slice(0, 4);
  const portal = c.sections[4];
  const quickFixed = useScenario("stu-hub-quicklinks-empty-001");
  const tileFixed = useScenario("stu-hub-tile-redundant-001");
  useScenario("stu-hub-quicklinks-focus-001"); // CSS scenario (services.css)

  return (
    <div className="svc-hub">
      <Hero title="Student Resources" kicker="Student Affairs" lede={c.summary} image="students-hero-lawn" imageAlt="" />
      <div className="page-content">
        <nav aria-label="Quick links" className="svc-quick" data-a11y-scenario="stu-hub-quicklinks-empty-001 stu-hub-quicklinks-focus-001">
          <ul>
            {QUICK.map((q) => (
              <li key={q.label}>
                <a href={q.href.startsWith("/") ? import.meta.env.BASE_URL + q.href.slice(1) : q.href}>
                  <span aria-hidden="true" className="svc-quick-icon">{q.icon}</span>
                  {quickFixed && <span className="svc-quick-label">{q.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section className="stack" aria-labelledby="popular-heading">
          <h2 id="popular-heading">Popular services</h2>
          <ul className="svc-tiles" data-a11y-scenario="stu-hub-tile-redundant-001">
            {POPULAR.map((p) => (
              <li key={p.href} className="svc-tile">
                {tileFixed ? (
                  <Link to={p.href}>
                    <Img image={p.image} alt="" sizes="(min-width: 60rem) 22vw, 50vw" aspect="4 / 3" />
                    <span className="svc-tile-title">{p.label}</span>
                  </Link>
                ) : (
                  <>
                    <Link to={p.href}><Img image={p.image} alt={p.label} sizes="(min-width: 60rem) 22vw, 50vw" aspect="4 / 3" /></Link>
                    <Link to={p.href} className="svc-tile-title">{p.label}</Link>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        <div className="svc-groups">
          {groups.map((g) => (
            <section key={g.heading} className="svc-group stack">
              <Heading scenario="stu-hub-group-heading-001" level={2} defect="fake">{g.heading}</Heading>
              <LinkList links={g.links!} />
            </section>
          ))}
        </div>

        <CtaBand title="RedwoodConnect" text={portal.paragraphs![0]} action={{ label: "Log in to RedwoodConnect", href: "/portal" }} />
      </div>
    </div>
  );
}
