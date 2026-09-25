// /athletics: the outsourced sports-network front page. Score ticker is static markup here;
// its motion scenarios belong to plan 06 (#11).
import { Link, useLoaderData } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { ButtonLink } from "~/components/Button";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import { CtaBand } from "~/components/blocks";
import { athletes, newsArticles } from "~/data/catalog";
import { newsContent } from "~/data/content/news";
import athletics from "~/data/generated/athletics.json";
import { SITE_NOW } from "~/data/site";
import type { Athletics } from "~/data/types";
import { shortDate, teamImage, teamName, versus } from "./_shared";

export { inventoryMeta as meta } from "~/routes/meta";

export async function loader() {
  const { teams } = athletics as unknown as Athletics;
  const games = teams.flatMap((t) => t.schedule.map((g) => ({ ...g, team: t.slug })));
  return {
    results: games.filter((g) => g.result).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8),
    upcoming: games.filter((g) => g.date >= SITE_NOW && g.site === "Home").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6),
    records: teams.map((t) => ({ slug: t.slug, season: t.season, record: t.record })),
    headlines: newsArticles
      .filter((n) => n.category === "athletics")
      .map((n) => { const a = newsContent[n.slug]; return { slug: n.slug, title: a.title, dek: a.dek, date: a.date, image: a.image }; })
      .sort((a, b) => b.date.localeCompare(a.date)),
  };
}

export default function AthleticsHome() {
  const { results, upcoming, records, headlines } = useLoaderData<typeof loader>();
  const underlineFixed = useScenario("athletics-home-underline-001");
  const captionFixed = useScenario("athletics-home-games-caption-001");
  useScenario("athletics-home-focus-001");

  return (
    <div className="ath-home" data-a11y-scenario="athletics-home-focus-001">
      <ScoreTicker results={results} />

      <Hero
        title="Redwood Owls Athletics"
        kicker="IAA Division II · Pacific North Conference"
        lede="Fourteen varsity teams, one flock. Catch the Owls in Owl Arena, on Redwood Field and on the trails of the Tanoak Creek course."
        image="athletics-hero-arena"
      >
        <ButtonLink to="/athletics/schedule">Full schedule</ButtonLink>
        <SmartLink scenario="athletics-home-tickets-window-001" to="/athletics/schedule" newWindow className="btn btn--ghost">Buy tickets</SmartLink>
      </Hero>

      <div className="page-content">
        <p className="ath-intro">
          The Redwood Owls compete in Intercollegiate Athletic Association (IAA) Division II in the Pacific North Conference.
          Home games are played in Owl Arena and on Redwood Field.{" "}
          <span data-a11y-scenario="athletics-home-underline-001">
            {underlineFixed ? <strong>Students get in free with their ID.</strong> : <u>Students get in free with their ID.</u>}
          </span>{" "}
          Look for Rowan the Redwood Owl on the sideline.
        </p>

        <Headlines items={headlines} />

        <section aria-labelledby="ath-upcoming" className="stack">
          <h2 id="ath-upcoming">Upcoming Home Games</h2>
          <div className="table-wrap">
            <table className="data-table ath-table" data-a11y-scenario="athletics-home-games-caption-001">
              {captionFixed && <caption>Upcoming Redwood Owls home games</caption>}
              <thead>
                <tr><th scope="col">Date</th><th scope="col">Sport</th><th scope="col">Opponent</th><th scope="col">Venue</th><th scope="col">Time</th></tr>
              </thead>
              <tbody>
                {upcoming.map((g) => (
                  <tr key={g.team + g.date}>
                    <td>{shortDate(g.date)}</td>
                    <td><Link to={`/athletics/teams/${g.team}`}>{teamName(g.team)}</Link></td>
                    <td>{g.opponent}</td>
                    <td>{g.location}</td>
                    <td>{g.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="ath-teams" className="stack">
          <h2 id="ath-teams">Owls Teams</h2>
          <ul className="ath-team-strip">
            {records.map((t) => (
              <li key={t.slug}>
                <Link to={`/athletics/teams/${t.slug}`} className="ath-team-strip-link">
                  <Img image={teamImage(t.slug)} alt="" sizes="(min-width: 60rem) 16vw, 50vw" aspect="4 / 3" />
                  <span className="ath-team-strip-name">{teamName(t.slug)}</span>
                  <span className="ath-team-strip-record">{t.season}: {t.record}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="ath-spotlight" className="stack">
          <h2 id="ath-spotlight">Student-Athlete Spotlight</h2>
          <ul className="ath-spotlight">
            {athletes.slice(0, 4).map((a) => (
              <li key={a.slug}>
                <Img image={`athlete-${a.slug}`} alt="" sizes="(min-width: 60rem) 20vw, 50vw" aspect="4 / 5" />
                <Link to={`/athletics/athletes/${a.slug}`}>{a.name}</Link>
                <span>{teamName(a.team)}</span>
              </li>
            ))}
          </ul>
        </section>

        <CtaBand
          title="Owls Basketball Home Opener"
          text="Men's basketball opens the season against Cascade State in Owl Arena. Wear red, bring a friend, and help us pack the house."
          action={{ label: "Event details: Owls Basketball Home Opener", href: "/events/basketball-home-opener" }}
        />

        <Social />
      </div>
    </div>
  );
}

type Result = Awaited<ReturnType<typeof loader>>["results"][number];

function ScoreTicker({ results }: { results: Result[] }) {
  const colorFixed = useScenario("athletics-home-ticker-color-001");
  useScenario("athletics-home-ticker-contrast-001");
  useScenario("athletics-home-ticker-clip-001");
  return (
    <section className="ath-ticker" aria-label="Latest scores" data-a11y-scenario="athletics-home-ticker-color-001 athletics-home-ticker-contrast-001 athletics-home-ticker-clip-001">
      <ul>
        {results.map((g) => {
          const outcome = g.result?.outcome;
          return (
            <li key={g.team + g.date} className="ath-ticker-item">
              <Link to={`/athletics/teams/${g.team}#schedule`}>
                <span className="ath-ticker-meta">{shortDate(g.date)} · {teamName(g.team)}</span>
                <span className="ath-ticker-opp">{versus(g)}</span>
                <span className={outcome ? `ath-score ath-score--${outcome}` : "ath-score"}>
                  {colorFixed && outcome && `${outcome} `}{g.result?.score}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link to="/athletics/scores" className="ath-ticker-all">All scores</Link>
    </section>
  );
}

function Headlines({ items }: { items: { slug: string; title: string; dek: string; date: string; image: string }[] }) {
  const headingFixed = useScenario("athletics-home-heading-skip-001");
  const H = headingFixed ? "h3" : "h4";
  return (
    <section aria-labelledby="ath-headlines" className="stack" data-a11y-scenario="athletics-home-heading-skip-001">
      <h2 id="ath-headlines">Owls Headlines</h2>
      <div className="ath-headlines">
        {items.map((n) => (
          <article key={n.slug} className="ath-headline">
            <Img image={n.image} scenario="athletics-home-headline-alt-001" sizes="(min-width: 60rem) 30vw, 100vw" aspect="16 / 9" />
            <p className="ath-headline-date">{shortDate(n.date)}</p>
            <H className="ath-headline-title"><Link to={`/news/${n.slug}`}>{n.title}</Link></H>
            <p>{n.dek}</p>
            <SmartLink scenario="athletics-home-readmore-001" to={`/news/${n.slug}`} defect="Read more »" className="ath-more">
              Read the story: {n.title}
            </SmartLink>
          </article>
        ))}
      </div>
    </section>
  );
}

// Generic glyphs for the fictional networks (docs/WORLD.md): camera, play button, people.
const networks = [
  { name: "PhotoPine", icon: <><rect x="3" y="7" width="18" height="13" rx="2" /><circle cx="12" cy="13.5" r="3.5" fill="#000" /></> },
  { name: "ReelWave", icon: <><rect x="2" y="5" width="20" height="14" rx="3" /><path d="M10 9v6l5-3z" fill="#000" /></> },
  { name: "WorkCircle", icon: <><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><path d="M2 20c0-4 3-6 6-6s6 2 6 6zM10 20c0-4 3-6 6-6s6 2 6 6z" /></> },
];

function Social() {
  const fixed = useScenario("athletics-home-social-empty-001");
  return (
    <section className="ath-social" aria-labelledby="ath-social-heading" data-a11y-scenario="athletics-home-social-empty-001">
      <h2 id="ath-social-heading">Follow the Owls</h2>
      <ul>
        {networks.map((n) => (
          <li key={n.name}>
            <a href={`#owls-${n.name.toLowerCase()}`}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true" focusable="false">{n.icon}</svg>
              {fixed && <span className="visually-hidden">Redwood Owls on {n.name}</span>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
