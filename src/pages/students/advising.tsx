import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Img } from "~/components/Img";
import { content } from "~/pages/admissions/_content";
import { ServicePage } from "./_ServicePage";

export { inventoryMeta as meta } from "~/routes/meta";

export default function Advising() {
  const s = content("/students/advising")!.sections[0];
  const titleFixed = useScenario("stu-advising-img-title-001");
  return (
    <ServicePage
      path="/students/advising"
      contact={[{ label: "Location", value: "Academic Advising Center, Sequoia Library 120" }, { label: "Drop-in hours", value: "Monday–Thursday, 1–4 p.m." }]}
      related={s.links}
    >
      <figure className="svc-figure">
        <Img image="campus-library-interior" alt="" title={titleFixed ? undefined : "Sequoia Library reading room"} data-a11y-scenario="stu-advising-img-title-001" sizes="(min-width: 60rem) 40vw, 100vw" />
      </figure>
      {s.paragraphs!.map((p) => <p key={p}>{p}</p>)}
      <Callout title="How to meet with an advisor">
        <ul>{s.list!.map((item) => <li key={item}>{item}</li>)}</ul>
      </Callout>
    </ServicePage>
  );
}
