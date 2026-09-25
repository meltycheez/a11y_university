// /athletics/scores: every completed result, newest first, with a sport filter.
import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { teams as teamList } from "~/data/catalog";
import athletics from "~/data/generated/athletics.json";
import type { Athletics } from "~/data/types";
import { shortDate, teamName, versus } from "./_shared";

export { inventoryMeta as meta } from "~/routes/meta";

const outcomeText = { W: "Win", L: "Loss", T: "Tie" } as const;

export async function loader() {
  const { teams } = athletics as unknown as Athletics;
  return {
    results: teams
      .flatMap((t) => t.schedule.filter((g) => g.result).map((g) => ({ ...g, team: t.slug, year: g.date.slice(0, 4) })))
      .sort((a, b) => b.date.localeCompare(a.date)),
  };
}

export default function ScoresPage() {
  const { results } = useLoaderData<typeof loader>();
  const [sport, setSport] = useState("all");
  const labelFixed = useScenario("athletics-scores-select-label-001");
  const captionFixed = useScenario("athletics-scores-caption-001");
  useScenario("athletics-scores-reflow-001");
  const rows = sport === "all" ? results : results.filter((r) => r.team === sport);

  return (
    <div className="ath-scores">
      <Hero title="Scores & Results" kicker="Redwood Owls" lede="Recent scores and results for the Redwood Owls." variant="banner" />
      <div className="page-content">
        <p>Results are posted within an hour of the final whistle. Box scores are available for basketball, soccer, volleyball, and baseball.</p>

        <div className="ath-filter" data-a11y-scenario="athletics-scores-select-label-001">
          {labelFixed && <label htmlFor="ath-sport">Show results for</label>}
          <select id="ath-sport" value={sport} onChange={(e) => setSport(e.target.value)}>
            <option value="all">All sports</option>
            {teamList.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
          <span className="ath-filter-count">{rows.length} results</span>
        </div>

        <div className="ath-scores-wrap" data-a11y-scenario="athletics-scores-reflow-001">
          <table className="data-table ath-table ath-scores-table" data-a11y-scenario="athletics-scores-caption-001">
            {captionFixed && <caption>Results: {sport === "all" ? "all sports" : teamName(sport)}</caption>}
            <thead>
              <tr><th scope="col">Date</th><th scope="col">Sport</th><th scope="col">Opponent</th><th scope="col">Site</th><th scope="col">Result</th><th scope="col"><span className="visually-hidden">Details</span></th></tr>
            </thead>
            <tbody>
              {rows.map((g) => (
                <tr key={g.team + g.date}>
                  <td>{shortDate(g.date)}, {g.year}</td>
                  <td><Link to={`/athletics/teams/${g.team}`}>{teamName(g.team)}</Link></td>
                  <td>{versus(g)}{g.conference && " *"}</td>
                  <td>{g.location}</td>
                  <td>{g.result?.outcome && <strong>{outcomeText[g.result.outcome]}, </strong>}{g.result?.score}</td>
                  <td>
                    <SmartLink scenario="athletics-scores-details-generic-001" to={`/athletics/teams/${g.team}#schedule`} defect="Details">
                      {teamName(g.team)} {versus(g)}, {shortDate(g.date)}
                    </SmartLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ath-note">* Pacific North Conference game. All times Pacific.</p>
      </div>
    </div>
  );
}
