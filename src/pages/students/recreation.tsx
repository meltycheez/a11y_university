import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Img } from "~/components/Img";
import { Tabs } from "~/components/Tabs";
import { CtaBand } from "~/components/blocks";
import { Table, content } from "~/pages/admissions/_content";
import { ServicePage } from "./_ServicePage";

export { inventoryMeta as meta } from "~/routes/meta";

export default function Recreation() {
  const [intro, hours, programs] = content("/students/recreation")!.sections;
  useScenario("stu-rec-hours-clip-001"); // CSS scenario (services.css)

  return (
    <ServicePage path="/students/recreation" related={[{ label: "Student Organizations", href: "/students/organizations" }, { label: "Athletics", href: "/athletics" }]} className="svc-rec">
      <figure className="svc-figure">
        <Img image="campus-rec-center" scenario="stu-rec-photo-alt-001" sizes="(min-width: 60rem) 50vw, 100vw" />
      </figure>
      <p>{intro.paragraphs![0]}</p>
      <Tabs label="Recreation information" tabs={[
        {
          label: "Hours",
          content: (
            <section className="stack">
              <h2>{hours.heading}</h2>
              <Table table={hours.table!} caption="Recreation facility hours" captionScenario="stu-rec-hours-caption-001" className="svc-rec-hours" marker="stu-rec-hours-clip-001" />
            </section>
          ),
        },
        {
          label: "Programs",
          content: (
            <section className="stack">
              <h2>{programs.heading}</h2>
              <ul>{programs.list!.map((p) => <li key={p}>{p}</li>)}</ul>
              <p>
                <SmartLink scenario="stu-rec-outdoor-new-window-001" to="https://rec.redwoodstate.edu/outdoor" newWindow>Sign up for an Outdoor Adventures trip</SmartLink>
              </p>
            </section>
          ),
        },
      ]} />
      <CtaBand title="Free for enrolled students" text="Your Recreation Center Fee covers the climbing wall, pool, fitness floor and group fitness classes." action={{ label: "See Tuition & Fees", href: "/admissions/tuition" }} />
    </ServicePage>
  );
}
