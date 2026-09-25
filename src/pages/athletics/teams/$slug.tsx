// TeamPage template (/athletics/teams/:slug): stats band, roster, schedule/results, plus data-driven blocks
// (highlights video when the season has results, a home-game CTA when one is coming up, related news).
import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { CtaBand, RelatedLinks, StatsBand, VideoEmbed } from "~/components/blocks";
import { newsArticles } from "~/data/catalog";
import athletics from "~/data/generated/athletics.json";
import { SITE_NOW } from "~/data/site";
import type { Athletics, RosterPlayer, TeamSeason } from "~/data/types";
import { shortDate, teamImage, teamName, versus } from "../_shared";

export { inventoryMeta as meta } from "~/routes/meta";

// Stories that belong to one team (news categories are too coarse to filter by).
const teamNews: Record<string, string[]> = {
  "womens-soccer": ["womens-soccer-conference-title"],
  "mens-basketball": ["mens-basketball-season-preview"],
  "cross-country": ["cross-country-all-american"],
};

export async function loader({ params }: LoaderFunctionArgs) {
  const team = (athletics as unknown as Athletics).teams.find((t) => t.slug === params.slug);
  if (!team) throw new Response("Not found", { status: 404 });
  const news = (teamNews[team.slug] ?? []).map((slug) => ({ label: newsArticles.find((n) => n.slug === slug)!.name, href: `/news/${slug}` }));
  return { team, news };
}

export default function TeamPage() {
  const { team, news } = useLoaderData<typeof loader>();
  const name = teamName(team.slug);
  const hasResults = team.schedule.some((g) => g.result);
  const nextHome = team.schedule.find((g) => g.site === "Home" && g.date >= SITE_NOW);
  const conf = team.schedule.filter((g) => g.conference && g.result?.outcome);
  const confRecord = conf.length ? `${conf.filter((g) => g.result!.outcome === "W").length}-${conf.filter((g) => g.result!.outcome === "L").length}` : "0-0";
  const venue = team.schedule.find((g) => g.site === "Home")?.location ?? "";
  useScenario("athletics-team-stats-small-001");

  return (
    <div className="ath-team">
      <Hero title={name} kicker={`Redwood Owls · ${team.season}`} image={teamImage(team.slug)} variant="banner" lede={`${team.conference}. Head coach: ${team.headCoach}.`} />
      <div className="page-content">
        <div data-a11y-scenario="athletics-team-stats-small-001">
          <StatsBand
            label={`${name} at a glance`}
            stats={[
              { value: team.record, label: "Overall" },
              { value: confRecord, label: "Conference" },
              { value: String(team.roster.length), label: "Roster" },
              { value: venue, label: "Home venue" },
            ]}
          />
        </div>

        <Roster team={team} name={name} />
        <Schedule team={team} name={name} />

        {hasResults && (
          <VideoEmbed title={`${name} ${team.season} season highlights`} caption={`${name} highlights from the ${team.season} season.`} titleScenario="athletics-team-video-title-001" />
        )}
        {nextHome && (
          <CtaBand
            title={`Next home game: ${versus(nextHome)}`}
            text={`${shortDate(nextHome.date)} at ${nextHome.time}, ${nextHome.location}. Students get in free with their ID.`}
            action={{ label: "See the composite schedule", href: "/athletics/schedule" }}
          />
        )}
        <RelatedLinks
          title={`More ${name}`}
          links={[...news, { label: "All Owls teams", href: "/athletics/teams" }, { label: "Scores & Results", href: "/athletics/scores" }]}
        />
      </div>
    </div>
  );
}

const baseColumns: { key: keyof RosterPlayer; header: string }[] = [
  { key: "number", header: "No." },
  { key: "name", header: "Name" },
  { key: "position", header: "Pos." },
  { key: "classYear", header: "Cl." },
  { key: "height", header: "Ht." },
  { key: "hometown", header: "Hometown" },
];

/** Scenario athletics-team-roster-headers-001: the vendor template's headers attributes are off by one column. */
function Roster({ team, name }: { team: TeamSeason; name: string }) {
  const fixed = useScenario("athletics-team-roster-headers-001");
  const columns = baseColumns.filter((c) => team.roster.some((p) => p[c.key]));
  return (
    <section aria-labelledby="roster" className="stack">
      <h2 id="roster">{team.season} Roster</h2>
      <div className="table-wrap">
        <table className="data-table ath-table" data-a11y-scenario="athletics-team-roster-headers-001">
          <caption>{name} roster, {team.season}</caption>
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={c.key} {...(fixed ? { scope: "col" } : { id: `roster-h${i}` })}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {team.roster.map((p) => (
              <tr key={p.name}>
                {columns.map((c, i) => {
                  const value = c.key === "name" && p.athleteSlug ? <Link to={`/athletics/athletes/${p.athleteSlug}`}>{p.name}</Link> : p[c.key];
                  if (fixed && c.key === "name") return <th key={c.key} scope="row">{value}</th>;
                  return <td key={c.key} headers={fixed ? undefined : `roster-h${i + 1}`}>{value}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Schedule({ team, name }: { team: TeamSeason; name: string }) {
  const captionFixed = useScenario("athletics-team-schedule-caption-001");
  const confFixed = useScenario("athletics-team-conference-color-001");
  return (
    <section aria-labelledby="schedule" className="stack">
      <h2 id="schedule">Schedule & Results</h2>
      {team.slug === "mens-basketball" && (
        <p>
          <SmartLink scenario="athletics-team-schedule-pdf-001" to="/documents/mens-basketball-schedule-2026-27.pdf" fileInfo="PDF, 2 KB">Printable schedule</SmartLink>
        </p>
      )}
      <div className="table-wrap">
        <table className="data-table ath-table ath-schedule" data-a11y-scenario="athletics-team-schedule-caption-001 athletics-team-conference-color-001">
          {captionFixed && <caption>{name} schedule and results, {team.season}</caption>}
          <thead>
            <tr><th scope="col">Date</th><th scope="col">Opponent</th><th scope="col">Location</th><th scope="col">Time / Result</th></tr>
          </thead>
          <tbody>
            {team.schedule.map((g) => (
              <tr key={g.date + g.opponent} className={g.conference ? "is-conf" : undefined}>
                <td>{shortDate(g.date)}</td>
                <td>{versus(g)}{confFixed && g.conference && <span className="ath-conf-tag">Conference</span>}</td>
                <td>{g.location}</td>
                <td>{g.result ? `${g.result.outcome ? `${g.result.outcome} ` : ""}${g.result.score}` : g.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
