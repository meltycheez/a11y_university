import { Link } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Img } from "~/components/Img";
import orgs from "~/data/generated/organizations.json";
import { LinkList, content } from "~/pages/admissions/_content";
import { ServicePage } from "./_ServicePage";

export { inventoryMeta as meta } from "~/routes/meta";

// Static grouping by category; the filterable directory is plan 06-style interaction.
const groups = [...new Set(orgs.map((o) => o.category))].map((category) => ({
  category,
  id: `cat-${category.toLowerCase().replace(/[^a-z]+/g, "-")}`,
  items: orgs.filter((o) => o.category === category),
}));

export default function Organizations() {
  const intro = content("/students/organizations")!.sections[0];
  const levelFixed = useScenario("stu-orgs-heading-skip-001");
  const jumpFixed = useScenario("stu-orgs-jump-js-001");
  useScenario("stu-orgs-members-contrast-001"); // CSS scenario (services.css)
  const H = levelFixed ? "h3" : "h4";
  const [fest, conduct] = intro.links!;

  return (
    <ServicePage
      path="/students/organizations"
      image="campus-student-orgs"
      contact={[{ label: "Office of Student Life", value: "Rowan Student Union" }]}
      related={[{ label: "Campus Recreation", href: "/students/recreation" }, { label: "Events", href: "/events" }]}
    >
      <p>{intro.paragraphs![0]}</p>

      <nav aria-label="Organization categories" className="svc-jump" data-a11y-scenario="stu-orgs-jump-js-001">
        <ul>
          {groups.map((g) => (
            <li key={g.id}>
              {jumpFixed
                ? <a href={`#${g.id}`}>{g.category}</a>
                : <a href="#" onClick={(e) => { e.preventDefault(); document.getElementById(g.id)?.scrollIntoView(); }}>{g.category}</a>}
            </li>
          ))}
        </ul>
      </nav>

      <div className="svc-orgs" data-a11y-scenario="stu-orgs-heading-skip-001 stu-orgs-members-contrast-001">
        {groups.map((g) => (
          <section key={g.id} id={g.id} className="stack" aria-labelledby={`${g.id}-h`}>
            <h2 id={`${g.id}-h`}>{g.category}</h2>
            <ul className="svc-org-list">
              {g.items.map((o) => (
                <li key={o.slug} className="svc-org">
                  <H>{o.name}</H>
                  <p>{o.description}</p>
                  <p className="svc-org-meta">Meets {o.meets} · {o.location}</p>
                  <p className="svc-org-members">{o.members} members</p>
                  <SmartLink scenario="stu-orgs-email-generic-001" to={`mailto:${o.email}`} defect="Email">Email {o.name}</SmartLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="stack svc-fest" aria-labelledby="fest-heading">
        <h2 id="fest-heading">Meet the clubs at Fall Fest</h2>
        <Link to={fest.href} className="svc-flyer-link">
          <Img image="flyer-fall-festival" alt="fallfest_flyer_FINAL.png" scenario="stu-orgs-flyer-alt-001" sizes="(min-width: 40rem) 20rem, 100vw" aspect="3 / 4" />
        </Link>
      </section>

      <Callout title="Start a new club">
        <p>Register your club with the Office of Student Life in Rowan Student Union. Registered clubs follow the Student Conduct Code.</p>
        <LinkList links={[conduct]} />
      </Callout>
    </ServicePage>
  );
}
