import { Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Img } from "~/components/Img";
import { Tabs } from "~/components/Tabs";
import sizes from "~/data/image-sizes.json";
import { LinkList, Table, content } from "~/pages/admissions/_content";
import { ServicePage } from "./_ServicePage";

export { inventoryMeta as meta } from "~/routes/meta";

const FLYER = "flyer-dining-hours";
const lateNight = (row: string[]) => /1[01]:00 p\.m\./.test(row[1]);
// Until the flyer is generated it isn't in image-sizes.json; the fallback is a copy of its images.json alt
// (images.json itself stays out of the client bundle, ADR-018).
const flyerText =
  (sizes as Record<string, { alt: string }>)[FLYER]?.alt ??
  "The Grove this week. Monday: rockfish tacos. Wednesday: mushroom barley stew. Friday: wood-fired pizza. Open weekdays 7 AM to 9 PM, weekends 9 AM to 8 PM.";

export default function Dining() {
  const [intro, plans, locations, menu] = content("/students/dining")!.sections;
  const textFixed = useScenario("stu-dining-flyer-text-001");
  const colorFixed = useScenario("stu-dining-late-color-001");
  const describedFixed = useScenario("stu-dining-dollars-describedby-001");
  useScenario("stu-dining-header-contrast-001"); // CSS scenario (services.css)

  return (
    <ServicePage
      path="/students/dining"
      related={[{ label: "Housing & Residential Life", href: "/students/housing" }, { label: "Tuition & Fees", href: "/admissions/tuition" }]}
      className="svc-dining"
    >
      <p>{intro.paragraphs![0]}</p>
      <figure className="svc-figure">
        <Img image="campus-dining-hall" alt="dining_hall_IMG_8834.jpg" scenario="stu-dining-photo-alt-001" fixedAlt="" sizes="(min-width: 60rem) 50vw, 100vw" />
        <figcaption>Lunch at The Grove Dining Commons.</figcaption>
      </figure>

      <div data-a11y-scenario="stu-dining-header-contrast-001">
        <Tabs label="Dining information" tabs={[
          {
            label: "Meal plans",
            content: (
              <section className="stack">
                <h2>{plans.heading}</h2>
                <Table
                  table={plans.table!}
                  caption="Meal plans and prices per semester"
                  captionScenario="stu-dining-table-caption-001"
                  marker="stu-dining-dollars-describedby-001"
                  renderHeader={(v, j) => (j === 2 ? <span aria-describedby={describedFixed ? "dining-dollars-note" : "dd-tooltip"}>{v}</span> : v)}
                />
                <p id="dining-dollars-note" className="svc-note">Dining Dollars are included with every plan and can be spent at any Redwood Dining café or the food truck.</p>
              </section>
            ),
          },
          {
            label: "Locations & hours",
            content: (
              <section className="stack">
                <h2>{locations.heading}</h2>
                {!colorFixed && <p className="svc-legend"><span className="svc-swatch svc-swatch--late" /> Purple = open late</p>}
                <Table
                  table={locations.table!}
                  caption="Dining locations and hours"
                  captionScenario="stu-dining-table-caption-001"
                  marker="stu-dining-late-color-001"
                  rowClass={(r) => (lateNight(r) ? "svc-late" : undefined)}
                  renderCell={(v, row, j) => (j === 0 && lateNight(row) && colorFixed ? <>{v} <span className="svc-tag">Open late</span></> : v)}
                />
                <p>
                  The Owl Bites food truck moves around campus. Follow{" "}
                  <SmartLink scenario="stu-dining-truck-new-window-001" to="https://photopine.example.com/RSUDining" newWindow>@RSUDining on PhotoPine</SmartLink>{" "}
                  for today's stop.
                </p>
              </section>
            ),
          },
        ]} />
      </div>

      <section className="stack svc-menu">
        <Heading scenario="stu-dining-menu-heading-001" level={2} defect="fake">{menu.heading}</Heading>
        <p>{menu.paragraphs![0]}</p>
        <figure className="svc-flyer" data-a11y-scenario="stu-dining-flyer-text-001">
          <Img image={FLYER} scenario="stu-dining-flyer-alt-001" fixedAlt={textFixed ? `${flyerText.split(".")[0]} flyer` : flyerText} sizes="(min-width: 40rem) 24rem, 100vw" aspect="3 / 4" />
          {textFixed && <figcaption><strong>Text version:</strong> {flyerText}</figcaption>}
        </figure>
        <LinkList links={menu.links!} fixes={{ "Click here for nutrition info": { scenario: "stu-dining-nutrition-generic-001", defect: "Click here for nutrition info", text: "Nutrition and allergen information" } }} />
      </section>

      <Callout title="Allergies and special diets">
        <p>Allergen information is posted at every station. Ask a manager at any location about ingredients.</p>
      </Callout>
    </ServicePage>
  );
}
