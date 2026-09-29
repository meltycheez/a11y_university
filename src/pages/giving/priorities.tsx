import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import { CtaBand } from "~/components/blocks";
import { copyFor } from "../about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/giving/priorities");
const images: Record<string, string> = {
  "Student Success Fund": "campus-student-orgs",
  "First-Generation Scholars": "news-first-gen-scholars-expands",
  "Institute for Coastal Forest Resilience": "campus-research-forest",
  "Redwood Owls Athletics": "campus-rec-center",
  "Sequoia Library": "campus-library-interior",
};
const fundSlug = (name: string) => name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");

export default function PrioritiesPage() {
  // CSS scenarios (foundation.css).
  useScenario("giving-priorities-give-focus-001");
  useScenario("giving-priorities-title-clip-001");

  return (
    <>
      <Hero title="Giving Priorities" kicker="Redwood State Foundation" lede={content.summary} variant="banner" />
      <div className="page-content">
        <p className="lede-paragraph">
          Gifts to any of these funds are put to work right away. Each priority supports a goal of Strategic Plan 2030.
        </p>
        <ul className="priority-grid" data-a11y-scenario="giving-priorities-give-focus-001 giving-priorities-title-clip-001">
          {content.sections.map((s) => {
            const name = s.heading!;
            const readMore = s.links?.find((l) => l.label === "Read more");
            return (
              <li key={name} className="priority">
                <Img image={images[name]} scenario="giving-priorities-img-alt-001" className="priority-image" sizes="(min-width: 60rem) 30vw, 100vw" aspect="4 / 3" />
                <div className="priority-body">
                  <h2 className="priority-title">{name}</h2>
                  {s.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                  {readMore && (
                    <p>
                      <SmartLink scenario="giving-priorities-readmore-001" to={readMore.href} defect="Read more">
                        Read about the First-Generation Scholars expansion
                      </SmartLink>
                    </p>
                  )}
                  <SmartLink scenario="giving-priorities-give-duplicate-001" to={`/giving/donate?fund=${fundSlug(name)}`} defect="Give now" className="btn btn--primary priority-give">
                    Give to {name}
                  </SmartLink>
                </div>
              </li>
            );
          })}
        </ul>

        <Callout title="Not sure where to give?">
          <p>Unrestricted gifts to the Student Success Fund go wherever the need is greatest that year.</p>
        </Callout>

        <CtaBand title="Plan a larger gift" text="Talk with the Office of Advancement about naming opportunities and multi-year pledges." action={{ label: "Contact the Office of Advancement", href: "mailto:giving@redwoodstate.edu" }} />
      </div>
    </>
  );
}
