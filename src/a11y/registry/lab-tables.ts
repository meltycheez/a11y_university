import type { RuleKey } from "../rules";
import type { ScenarioDef } from "./types";

type Sev = NonNullable<ScenarioDef["severity"]>;
const d = (id: string, rule: RuleKey, severity: Sev, title: string, description: string, fixDescription: string): ScenarioDef =>
  ({ id, rule, pages: ["/accessibility-lab/tables"], component: "TablesLab", mechanism: "markup", severity, title, description, fixDescription });

export const labTablesScenarios: ScenarioDef[] = [
  d("table-headers-missing-tables-lab", "table-header-association", "serious",
    "Course table has no real header cells",
    "The header row is bold text in <td> cells, not <th>, so a screen reader can't tell them apart from data.",
    "Converts the header row to <th scope=\"col\"> cells."),
  d("table-headers-wrong-tables-lab", "table-header-association", "serious",
    "Enrollment table headers point at the wrong ids",
    "Data cells use headers=\"wh-c1 wh-c2\", but the header cells were re-keyed to wh-col1/wh-col2, so no cell is associated with its header.",
    "Points each cell's headers attribute at the real header ids."),
  d("table-headers-complex-tables-lab", "table-header-association", "serious",
    "Multi-level enrollment table has no header association",
    "The two-row term/level header has no headers attributes on the data cells, so a screen reader can't announce both the term and the level for a given number.",
    "Adds a headers attribute on each data cell naming both its column and row header id."),
  d("table-layout-tables-lab", "table-layout", "moderate",
    "A <table> is used for visual layout only",
    "A photo and a caption sit side by side in a <table> with no headers and nothing tabular about the content.",
    "Replaces the table with a two-column layout <div>, since the content isn't tabular data."),
  d("table-no-caption-tables-lab", "table-no-caption", "minor",
    "Library hours table has no caption",
    "The table has proper header cells but no <caption>, so its purpose isn't announced when a screen reader enters it.",
    "Adds a caption."),
];
