import { useScenario } from "~/a11y/useScenario";
import { Specimen } from "./_Specimen";

export { inventoryMeta as meta } from "~/routes/meta";

function MissingHeadersSpecimen() {
  const id = "table-headers-missing-tables-lab";
  const fixed = useScenario(id);
  // Cast to a single tag for TS purposes only; the runtime tag name still switches between th/td.
  const HeadCell = (fixed ? "th" : "td") as "th";
  const headProps = fixed ? { scope: "col" as const } : { style: { fontWeight: 700 } };
  return (
    <table className="data-table" data-a11y-scenario={id}>
      <tbody>
        <tr>
          <HeadCell {...headProps}>Course</HeadCell>
          <HeadCell {...headProps}>Units</HeadCell>
        </tr>
        <tr><td>Intro to Redwood Ecology</td><td>4</td></tr>
        <tr><td>California Water Policy</td><td>3</td></tr>
      </tbody>
    </table>
  );
}

function WrongHeadersSpecimen() {
  const id = "table-headers-wrong-tables-lab";
  const fixed = useScenario(id);
  return (
    <table className="data-table" data-a11y-scenario={id}>
      <thead>
        <tr>
          <th id="wh-col1" scope="col">Term</th>
          <th id="wh-col2" scope="col">Enrollment</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td headers={fixed ? "wh-col1" : "wh-c1"}>Fall 2026</td>
          <td headers={fixed ? "wh-col2" : "wh-c2"}>4,812</td>
        </tr>
      </tbody>
    </table>
  );
}

function ComplexHeadersSpecimen() {
  const id = "table-headers-complex-tables-lab";
  const fixed = useScenario(id);
  const headersFor = (col: "fall" | "spring", row: "ug" | "grad") => (fixed ? `ch-${col} ch-${row}` : undefined);
  return (
    <table className="data-table" data-a11y-scenario={id}>
      <thead>
        <tr>
          <th></th>
          <th id="ch-fall" scope="colgroup">Fall</th>
          <th id="ch-spring" scope="colgroup">Spring</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th id="ch-ug" scope="row">Undergraduate</th>
          <td headers={headersFor("fall", "ug")}>3,920</td>
          <td headers={headersFor("spring", "ug")}>3,780</td>
        </tr>
        <tr>
          <th id="ch-grad" scope="row">Graduate</th>
          <td headers={headersFor("fall", "grad")}>892</td>
          <td headers={headersFor("spring", "grad")}>860</td>
        </tr>
      </tbody>
    </table>
  );
}

function LayoutTableSpecimen() {
  const id = "table-layout-tables-lab";
  const fixed = useScenario(id);
  const photo = <span aria-hidden="true" style={{ display: "inline-block", width: 80, height: 60, background: "#ccc", borderRadius: 4 }} />;
  const fact = <p>Redwood State was founded in 1911 along the Arcadia Falls redwood coast.</p>;
  if (fixed) {
    return (
      <div data-a11y-scenario={id} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", alignItems: "center" }}>
        <div>{photo}</div>
        <div>{fact}</div>
      </div>
    );
  }
  return (
    <table data-a11y-scenario={id}>
      <tbody>
        <tr>
          <td>{photo}</td>
          <td>{fact}</td>
        </tr>
      </tbody>
    </table>
  );
}

function NoCaptionSpecimen() {
  const id = "table-no-caption-tables-lab";
  const fixed = useScenario(id);
  return (
    <table className="data-table" data-a11y-scenario={id}>
      {fixed && <caption>Library hours by day</caption>}
      <thead>
        <tr><th scope="col">Day</th><th scope="col">Hours</th></tr>
      </thead>
      <tbody>
        <tr><td>Weekdays</td><td>7:30 a.m.–midnight</td></tr>
        <tr><td>Weekends</td><td>9 a.m.–8 p.m.</td></tr>
      </tbody>
    </table>
  );
}

export default function TablesLab() {
  return (
    <>
      <h1>Table Specimens</h1>
      <p>
        Each table below isolates one data-table defect. Screen reader users rely on header association and captions to understand
        tabular data outside of its visual layout.
      </p>
      <Specimen id="table-headers-missing-tables-lab"><MissingHeadersSpecimen /></Specimen>
      <Specimen id="table-headers-wrong-tables-lab"><WrongHeadersSpecimen /></Specimen>
      <Specimen id="table-headers-complex-tables-lab"><ComplexHeadersSpecimen /></Specimen>
      <Specimen id="table-layout-tables-lab"><LayoutTableSpecimen /></Specimen>
      <Specimen id="table-no-caption-tables-lab"><NoCaptionSpecimen /></Specimen>
    </>
  );
}
