import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Img } from "~/components/Img";
import { VideoEmbed } from "~/components/blocks";
import { Copy, Table, content } from "~/pages/admissions/_content";
import { ServicePage } from "./_ServicePage";

export { inventoryMeta as meta } from "~/routes/meta";

const CAPTION = "Students board the Green Loop shuttle at Founders Hall";

export default function Transportation() {
  const [intro, shuttle, other] = content("/students/transportation")!.sections;
  useScenario("stu-transit-route-contrast-001"); // CSS scenario (services.css)

  return (
    <ServicePage path="/students/transportation" related={other.links} className="svc-transit">
      <Callout title="Your student ID is your bus pass" tone="success">
        <p>{intro.paragraphs![0]}</p>
      </Callout>
      <figure className="svc-figure">
        <Img image="campus-transit" alt={CAPTION} scenario="stu-transit-photo-alt-redundant-001" fixedAlt="" sizes="(min-width: 60rem) 50vw, 100vw" />
        <figcaption>{CAPTION}</figcaption>
      </figure>
      <section className="stack" aria-labelledby="shuttle-heading">
        <h2 id="shuttle-heading">{shuttle.heading}</h2>
        <Table
          table={shuttle.table!}
          caption="Owl Shuttle routes on class days"
          captionScenario="stu-transit-schedule-caption-001"
          marker="stu-transit-route-contrast-001"
          renderCell={(v, _r, j) => (j === 0 ? <span className="svc-route">{v}</span> : v)}
        />
      </section>
      <section className="stack" aria-labelledby="video-heading">
        <h2 id="video-heading">New to the shuttle?</h2>
        <VideoEmbed title="How to ride the Owl Shuttle" titleScenario="stu-transit-video-title-001" />
      </section>
      <Copy s={{ ...other, links: undefined }} />
    </ServicePage>
  );
}
