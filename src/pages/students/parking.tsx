import { Link, useNavigate } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Tabs } from "~/components/Tabs";
import { LinkList, Table, content } from "~/pages/admissions/_content";
import { ServicePage } from "./_ServicePage";

export { inventoryMeta as meta } from "~/routes/meta";

const PHRASE = "must display a valid permit";

export default function Parking() {
  const [intro, permits, lots, citations] = content("/students/parking")!.sections;
  const uFixed = useScenario("stu-parking-permit-underline-001");
  useScenario("stu-parking-permit-reflow-001"); // CSS scenario (services.css)
  const [before, after] = intro.paragraphs![0].split(PHRASE);

  return (
    <ServicePage
      path="/students/parking"
      image="campus-parking"
      imageScenario="stu-parking-hero-alt-001"
      contact={[{ label: "Parking Services", value: "Corporation Yard" }]}
      related={[{ label: "Transportation", href: "/students/transportation" }, { label: "Visitors", href: "/visitors" }]}
      updatedScenario="stu-parking-updated-small-001"
      className="svc-parking"
    >
      <p data-a11y-scenario="stu-parking-permit-underline-001">
        {before}{uFixed ? <strong>{PHRASE}</strong> : <u>{PHRASE}</u>}{after}
      </p>
      <BuyPermit />

      <Tabs label="Permits and lots" tabs={[
        {
          label: "Permit rates",
          content: (
            <section className="stack">
              <h2>{permits.heading}</h2>
              <Table table={permits.table!} className="svc-wide-table" marker="stu-parking-permit-reflow-001" />
            </section>
          ),
        },
        {
          label: "Lot guide",
          content: (
            <section className="stack">
              <h2>{lots.heading}</h2>
              <Table table={lots.table!} caption="Parking lots, spaces and EV chargers" captionScenario="stu-parking-lots-caption-001" headersScenario="stu-parking-lots-headers-001" idPrefix="lot" />
            </section>
          ),
        },
      ]} />

      <Callout title={citations.heading} tone="warning">
        <p>{citations.paragraphs![0]}</p>
        <p><SmartLink scenario="stu-parking-appeal-new-window-001" to="https://parking.redwoodstate.edu/appeals" newWindow>Appeal a citation online</SmartLink></p>
      </Callout>

      <section className="stack" aria-labelledby="maps-heading">
        <h2 id="maps-heading">Maps and more</h2>
        <LinkList links={citations.links!} fixes={{
          "Parking Map (PDF)": { scenario: "stu-parking-map-doc-001", text: "Parking Map", fileInfo: "PDF, 2 KB" },
          "Read more": { scenario: "stu-parking-generic-link-001", defect: "Read more", text: "Interactive campus map" },
        }} />
      </section>
    </ServicePage>
  );
}

/** stu-parking-buy-div-001: a styled <div> with a click handler instead of a link. */
function BuyPermit() {
  const fixed = useScenario("stu-parking-buy-div-001");
  const navigate = useNavigate();
  return (
    <p data-a11y-scenario="stu-parking-buy-div-001">
      {fixed
        ? <Link to="/portal/account" className="btn btn--primary">Buy a permit in RedwoodConnect</Link>
        : <span className="btn btn--primary" onClick={() => navigate("/portal/account")}>Buy a permit in RedwoodConnect</span>}
    </p>
  );
}
