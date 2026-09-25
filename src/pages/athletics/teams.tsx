// /athletics/teams: team tiles grouped by season.
import { Link, useLoaderData } from "react-router";
import { Heading } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import athletics from "~/data/generated/athletics.json";
import type { Athletics } from "~/data/types";
import { teamImage, teamName } from "./_shared";

export { inventoryMeta as meta } from "~/routes/meta";

const seasons = [
  { name: "Fall Sports", teams: ["womens-soccer", "volleyball", "cross-country"] },
  { name: "Winter Sports", teams: ["mens-basketball", "womens-basketball"] },
  { name: "Spring Sports", teams: ["baseball"] },
];

export async function loader() {
  const { teams } = athletics as unknown as Athletics;
  return { teams: teams.map((t) => ({ slug: t.slug, season: t.season, record: t.record, headCoach: t.headCoach, players: t.roster.length })) };
}

export default function TeamsIndex() {
  const { teams } = useLoaderData<typeof loader>();
  useScenario("athletics-teams-record-contrast-001");
  return (
    <div className="ath-teams" data-a11y-scenario="athletics-teams-record-contrast-001">
      <Hero title="Teams" kicker="Redwood Owls" lede="Redwood Owls varsity teams compete in the Pacific North Conference of IAA Division II." variant="banner" />
      <div className="page-content">
        {seasons.map((s) => (
          <section key={s.name} className="stack">
            <Heading scenario="athletics-teams-season-heading-001" level={2} defect="fake" className="ath-season">{s.name}</Heading>
            <ul className="ath-tiles">
              {s.teams.map((slug) => {
                const t = teams.find((x) => x.slug === slug)!;
                return <TeamTile key={slug} {...t} />;
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function TeamTile({ slug, season, record, headCoach, players }: { slug: string; season: string; record: string; headCoach: string; players: number }) {
  const redundantFixed = useScenario("athletics-teams-link-redundant-001");
  const duplicateFixed = useScenario("athletics-teams-link-duplicate-001");
  const name = teamName(slug);
  const href = `/athletics/teams/${slug}`;
  const photo = <Img image={teamImage(slug)} alt={redundantFixed ? "" : name} sizes="(min-width: 60rem) 30vw, 100vw" aspect="16 / 9" />;
  const hidden = duplicateFixed ? <span className="visually-hidden"> {name}</span> : null;
  return (
    <li className="ath-tile" data-a11y-scenario="athletics-teams-link-redundant-001 athletics-teams-link-duplicate-001">
      {redundantFixed ? photo : <Link to={href} className="ath-tile-photo">{photo}</Link>}
      <h3><Link to={href}>{name}</Link></h3>
      <p className="ath-tile-meta">{season} record: {record} · Head coach {headCoach} · {players} student-athletes</p>
      <p className="ath-tile-links">
        <Link to={`${href}#roster`}>Roster{hidden}</Link>
        <Link to={`${href}#schedule`}>Schedule{hidden}</Link>
      </p>
    </li>
  );
}
