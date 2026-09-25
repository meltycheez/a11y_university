// ProfilePage, sports theme (/athletics/athletes/:slug): headshot, bio facts, season stats, related links.
import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Img } from "~/components/Img";
import { RelatedLinks, StatsBand } from "~/components/blocks";
import { newsArticles } from "~/data/catalog";
import athletics from "~/data/generated/athletics.json";
import type { Athletics } from "~/data/types";
import { teamName } from "../_shared";

export { inventoryMeta as meta } from "~/routes/meta";

// Stories that feature the athlete or the athlete's team.
const athleteNews: Record<string, string[]> = {
  "priya-castillo": ["cross-country-all-american"],
  "maya-delgado": ["womens-soccer-conference-title"],
  "sierra-blackwood": ["womens-soccer-conference-title"],
  "jordan-whitfield": ["mens-basketball-season-preview"],
  "noah-lindgren": ["mens-basketball-season-preview"],
};

const years = { "Fr.": "Freshman", "So.": "Sophomore", "Jr.": "Junior", "Sr.": "Senior", "Gr.": "Graduate student" } as const;

export async function loader({ params }: LoaderFunctionArgs) {
  const { athletes, teams } = athletics as unknown as Athletics;
  const athlete = athletes.find((a) => a.slug === params.slug);
  if (!athlete) throw new Response("Not found", { status: 404 });
  const season = teams.find((t) => t.slug === athlete.team)!.season;
  const news = (athleteNews[athlete.slug] ?? []).map((slug) => ({ label: newsArticles.find((n) => n.slug === slug)!.name, href: `/news/${slug}` }));
  return { athlete, season, news };
}

export default function AthleteProfile() {
  const { athlete: a, season, news } = useLoaderData<typeof loader>();
  const team = teamName(a.team);
  const facts = [
    ["Position", a.position],
    ["Class", years[a.classYear]],
    ["Height", a.height],
    ["Hometown", a.hometown],
    ["High school", a.highSchool],
    ["Major", a.major],
  ].filter(([, v]) => v);

  return (
    <article className="ath-profile">
      <header className="ath-profile-head">
        <Img image={`athlete-${a.slug}`} alt="photo" scenario="athletics-athlete-photo-alt-001" className="ath-profile-photo" sizes="(min-width: 50rem) 22rem, 100vw" aspect="4 / 5" loading="eager" />
        <div>
          <p className="hero-kicker"><Link to={`/athletics/teams/${a.team}`}>{team}</Link></p>
          <h1>{a.number && <span className="ath-profile-number">#{a.number} </span>}{a.name}</h1>
          <dl className="ath-facts">
            {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </header>
      <div className="page-content">
        <StatsBand label={`${a.name}: ${season} season statistics`} stats={a.stats} />
        <RelatedLinks
          title={`More on ${a.name}`}
          links={[{ label: `${team} roster`, href: `/athletics/teams/${a.team}#roster` }, ...news, { label: "All Owls teams", href: "/athletics/teams" }]}
        />
      </div>
    </article>
  );
}
