import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { ButtonLink } from "~/components/Button";
import { Card, CardGrid } from "~/components/Card";
import { Hero } from "~/components/Hero";
import { CtaBand, StatsBand, VideoEmbed } from "~/components/blocks";
import { Copy, content } from "./_content";

export { inventoryMeta as meta } from "~/routes/meta";

const pathImages: Record<string, string> = {
  "/admissions/undergraduate": "admissions-hero-movein",
  "/admissions/transfer": "campus-student-orgs",
  "/admissions/graduate": "campus-library-interior",
  "/admissions/international": "campus-research-forest",
};

export default function AdmissionsHome() {
  const c = content("/admissions")!;
  const [intro, paths, numbers, affordable] = c.sections;
  // CSS scenarios (marketing.css): register only.
  useScenario("adm-home-stats-contrast-001");
  useScenario("adm-home-card-clip-001");
  useScenario("adm-home-motion-001");

  return (
    <div className="adm-landing">
      <Hero title="Admissions" kicker="Redwood State University" lede={c.summary} image="admissions-hero-tour" imageAlt="">
        <SmartLink scenario="adm-home-apply-new-window-001" to="/admissions/apply" newWindow className="btn btn--primary">Apply now</SmartLink>
        <ButtonLink to="/admissions/request-info" variant="secondary">Request information</ButtonLink>
        <ButtonLink to="/admissions/visit" variant="ghost">Visit campus</ButtonLink>
      </Hero>

      <div className="page-content">
        <p className="adm-lead">{intro.paragraphs![0]}</p>

        <section className="stack adm-paths" aria-labelledby="paths-heading" data-a11y-scenario="adm-home-card-clip-001 adm-home-motion-001">
          <h2 id="paths-heading">{paths.heading}</h2>
          <CardGrid columns={4}>
            {paths.links!.map((l) => (
              <Card
                key={l.href}
                title={l.label}
                href={l.href}
                text={content(l.href)?.summary}
                image={pathImages[l.href]}
                imageAlt={l.label}
                imageScenario="adm-home-card-alt-redundant-001"
                imageFixedAlt=""
              />
            ))}
          </CardGrid>
        </section>

        <div className="adm-stats" data-a11y-scenario="adm-home-stats-contrast-001">
          <h2 className="visually-hidden">{numbers.heading}</h2>
          <StatsBand
            label={numbers.heading!}
            stats={numbers.list!.map((item) => {
              const [value, ...rest] = item.split(" ");
              return { value, label: rest.join(" ") };
            })}
          />
        </div>

        <section className="stack adm-video" aria-labelledby="tour-heading">
          <h2 id="tour-heading">Take the virtual tour</h2>
          <VideoEmbed title="Redwood State campus tour video" caption="Walk Canopy Green, Sequoia Library and Madrone Hall with a student tour guide." titleScenario="adm-home-video-title-001" />
        </section>

        <Copy s={affordable} className="adm-band" />

        <CtaBand title="Applications for fall 2027 open October 1" text="Apply between October 1 and December 1 for priority consideration." action={{ label: "See how to apply", href: "/admissions/process" }} />
      </div>
    </div>
  );
}
