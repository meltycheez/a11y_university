// Page-local helpers shared by the admissions, financial aid and student services pages: render one
// `pageContent` section with optional per-link and per-table defects. Accessible unless a scenario is passed.
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { AnyLink } from "~/components/blocks";
import type { PageSection } from "~/data/content/pages";
import { pageContent } from "~/data/content/pages";

export const content = (path: string) => pageContent[path];

type TableData = NonNullable<PageSection["table"]>;

export interface TableProps {
  table: TableData;
  /** Caption used when the content has none. */
  caption?: string;
  /** table-no-caption: the caption renders only when fixed. */
  captionScenario?: string;
  /**
   * table-header-association: cells use `headers`/`id` pairs; while defective the `headers` tokens still
   * carry the old column ids from before the CMS table was re-keyed, so they point at nothing.
   */
  headersScenario?: string;
  /** Unique prefix for header ids (required with headersScenario). */
  idPrefix?: string;
  className?: string;
  /** Per-row class, e.g. to highlight a row. */
  rowClass?: (row: string[], i: number) => string | undefined;
  /** Custom cell / header rendering (defaults to the text). */
  renderCell?: (value: string, row: string[], col: number) => React.ReactNode;
  renderHeader?: (value: string, col: number) => React.ReactNode;
  /** Extra marker ids for CSS scenarios styled on this table. */
  marker?: string;
}

export function Table({ table, caption, captionScenario, headersScenario, idPrefix = "t", className, rowClass, renderCell = (v) => v, renderHeader = (v) => v, marker }: TableProps) {
  const captionFixed = useScenario(captionScenario);
  const headersFixed = useScenario(headersScenario);
  const cap = table.caption ?? caption;
  const markers = [captionScenario, headersScenario, marker].filter(Boolean).join(" ") || undefined;
  const colId = (j: number) => `${idPrefix}-${headersFixed ? "col" : "c"}${j}`;
  const rowId = (i: number) => `${idPrefix}-${headersFixed ? "row" : "r"}${i}`;
  return (
    <div className={["table-scroll", className].filter(Boolean).join(" ")} data-a11y-scenario={markers}>
      <table>
        {cap && captionFixed && <caption>{cap}</caption>}
        <thead>
          <tr>
            {table.columns.map((c, j) =>
              headersScenario ? <th key={c} id={`${idPrefix}-col${j}`}>{renderHeader(c, j)}</th> : <th key={c} scope="col">{renderHeader(c, j)}</th>,
            )}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className={rowClass?.(row, i)}>
              {row.map((cell, j) =>
                j === 0
                  ? headersScenario
                    ? <th key={j} id={`${idPrefix}-row${i}`} headers={colId(0)}>{renderCell(cell, row, j)}</th>
                    : <th key={j} scope="row">{renderCell(cell, row, j)}</th>
                  : headersScenario
                    ? <td key={j} headers={`${colId(j)} ${rowId(i)}`}>{renderCell(cell, row, j)}</td>
                    : <td key={j}>{renderCell(cell, row, j)}</td>,
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Per-link overrides keyed by the content label: SmartLink props (scenario, fixed text, defect text, fileInfo…). */
export type LinkFixes = Record<string, { scenario: string; text?: string; defect?: string; fileInfo?: string; newWindow?: boolean }>;

export function LinkList({ links, fixes = {}, className = "link-list" }: { links: { label: string; href: string }[]; fixes?: LinkFixes; className?: string }) {
  return (
    <ul className={className}>
      {links.map((l) => {
        const f = fixes[l.label];
        return (
          <li key={l.href + l.label}>
            {f
              ? <SmartLink scenario={f.scenario} to={l.href} defect={f.defect} fileInfo={f.fileInfo} newWindow={f.newWindow}>{f.text ?? l.label}</SmartLink>
              : <AnyLink href={l.href}>{l.label}</AnyLink>}
          </li>
        );
      })}
    </ul>
  );
}

interface CopyProps {
  s: PageSection;
  level?: 2 | 3;
  /** Replaces the section heading (e.g. a <Heading> scenario helper). */
  heading?: React.ReactNode;
  table?: Omit<TableProps, "table">;
  links?: LinkFixes;
  className?: string;
  children?: React.ReactNode;
}

/** One content section: heading, paragraphs, list, table, links, then any extra children. */
export function Copy({ s, level = 2, heading, table, links, className, children }: CopyProps) {
  const H = `h${level}` as const;
  return (
    <section className={["stack", className].filter(Boolean).join(" ")}>
      {heading ?? (s.heading && <H>{s.heading}</H>)}
      {s.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
      {s.list && <ul>{s.list.map((item, i) => <li key={i}>{item}</li>)}</ul>}
      {s.table && <Table table={s.table} {...table} />}
      {s.links && <LinkList links={s.links} fixes={links} />}
      {children}
    </section>
  );
}

/** Strips "(PDF)" from content labels; the fixed state appends type and size instead (link-document). */
export function pdfFixes(links: { label: string }[], scenario: string): LinkFixes {
  return Object.fromEntries(
    links.filter((l) => l.label.endsWith("(PDF)")).map((l) => [l.label, { scenario, text: l.label.replace(/\s*\(PDF\)$/, ""), fileInfo: "PDF, 2 KB" }]),
  );
}
