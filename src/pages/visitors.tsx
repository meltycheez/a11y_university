import { SmartLink } from "~/a11y/helpers";
import { Hero } from "~/components/Hero";
import { Gallery, RelatedLinks, VideoEmbed } from "~/components/blocks";
import { copyFor } from "./about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/visitors");
const [directions, stay] = content.sections;

export default function VisitorsPage() {
  return (
    <>
      <Hero title="Visitors" kicker="Welcome to Redwood State" lede={content.summary} image="visitors-hero-welcome" />
      <div className="page-content">
        <section className="stack" aria-labelledby="getting-here-heading">
          <h2 id="getting-here-heading">Getting here</h2>
          {directions.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
          <p>
            Coming by bus? Coastline Transit and the Coastline Connector stop on Canopy Drive.{" "}
            <SmartLink scenario="audience-visitors-transit-newwindow-001" to="/students/transportation" newWindow>
              Transit routes and schedules
            </SmartLink>
          </p>
        </section>

        <VideoEmbed
          title="Virtual campus tour"
          caption="A six-minute walk from Founders Hall to Canopy Green, Sequoia Library, and the Rowan Student Union."
          titleScenario="audience-visitors-tour-title-001"
        />

        <section className="stack" aria-labelledby="stay-heading">
          <h2 id="stay-heading">{stay.heading}</h2>
          <ul>{stay.list?.map((s) => <li key={s}>{s}</li>)}</ul>
        </section>

        <Gallery
          label="Around campus"
          images={[
            { image: "campus-library-interior", alt: "Students study at long wooden tables in the timber-beamed library reading room", caption: "Sequoia Library reading room" },
            { image: "campus-research-forest", alt: "A boardwalk trail winds into the university research forest", caption: "Tanoak Creek Research Forest trail" },
            { image: "campus-student-orgs", alt: "Students browse club tables at the involvement fair", caption: "Involvement fair on Canopy Green" },
          ]}
        />

        <RelatedLinks title="Plan your visit" links={directions.links!} />
      </div>
    </>
  );
}
