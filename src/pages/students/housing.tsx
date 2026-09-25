import { Heading } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Gallery, VideoEmbed } from "~/components/blocks";
import { Copy, LinkList, content, pdfFixes } from "~/pages/admissions/_content";
import { ServicePage } from "./_ServicePage";

export { inventoryMeta as meta } from "~/routes/meta";

export default function Housing() {
  const [intro, halls, llc, apply] = content("/students/housing")!.sections;
  useScenario("stu-housing-table-clip-001"); // CSS scenario (services.css)

  return (
    <ServicePage
      path="/students/housing"
      image="campus-housing-madrone"
      related={[{ label: "Dining Services", href: "/students/dining" }, { label: "Tuition & Fees", href: "/admissions/tuition" }, { label: "Parking Services", href: "/students/parking" }]}
      className="svc-housing"
    >
      <p>{intro.paragraphs![0]}</p>
      <Copy s={halls} table={{ className: "svc-halls-table", marker: "stu-housing-table-clip-001" }} />
      <Copy s={llc} heading={<Heading scenario="stu-housing-llc-heading-001" level={2} defect="skipped" defectLevel={4}>{llc.heading}</Heading>} />
      <section className="stack" aria-labelledby="madrone-heading">
        <h2 id="madrone-heading">Tour Madrone Hall</h2>
        <VideoEmbed title="Madrone Hall video tour" caption="A student resident shows a suite, the rooftop garden and the maker space." titleScenario="stu-housing-video-title-001" />
        <Gallery label="Residence life photos" images={[
          { image: "campus-housing-madrone", alt: "Two roommates unpack in a sunny residence hall room", caption: "Move-in week in Madrone Hall" },
          { image: "admissions-hero-movein", alt: "First-year students and families carry boxes into a residence hall on move-in day" },
        ]} />
      </section>
      <section className="stack" aria-labelledby="apply-heading" data-a11y-scenario="stu-housing-pdf-doc-001">
        <h2 id="apply-heading">{apply.heading}</h2>
        <Callout title="First-year housing guarantee" tone="success">
          <p>{apply.paragraphs![0]}</p>
        </Callout>
        <LinkList links={apply.links!} fixes={pdfFixes(apply.links!, "stu-housing-pdf-doc-001")} />
      </section>
    </ServicePage>
  );
}
