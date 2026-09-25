// Page-local helpers for the flagship, foundation and intranet pages (about, audience, utility, giving, employees).
// `Copy` renders a pageContent section like ContentSection, but lets the page swap individual content links for
// SmartLink scenarios (the copy's own "Read more" / "Click here" links are registered defects, not accidents).
import { SmartLink } from "~/a11y/helpers";
import { AnyLink } from "~/components/blocks";
import type { Column } from "~/components/DataTable";
import type { PageSection } from "~/data/content/pages";
import { pageContent } from "~/data/content/pages";

export interface LinkScenario {
  scenario: string;
  /** Link text once fixed; omit to keep the content label. */
  text?: string;
  /** Link text while defective; defaults to the content label when `text` is set. */
  defect?: string;
  fileInfo?: string;
  newWindow?: boolean;
}

/** Content for an inventory path. Throws at build time if the copy is missing, so pages never render empty. */
export function copyFor(path: string) {
  const content = pageContent[path];
  if (!content) throw new Error(`No pageContent for ${path}`);
  return content;
}

export function Copy({ section, level = 2, links = {}, id, className }: {
  section: PageSection;
  level?: 2 | 3;
  /** Content link label -> scenario. */
  links?: Record<string, LinkScenario>;
  id?: string;
  className?: string;
}) {
  const H = `h${level}` as const;
  const headingId = id && section.heading ? `${id}-heading` : undefined;
  return (
    <section className={["stack", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      {section.heading && <H id={headingId}>{section.heading}</H>}
      {section.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
      {section.list && <ul>{section.list.map((item, i) => <li key={i}>{item}</li>)}</ul>}
      {section.links && (
        <ul className="link-list">
          {section.links.map((l) => {
            const s = links[l.label];
            return (
              <li key={l.href + l.label}>
                {s
                  ? <SmartLink scenario={s.scenario} to={l.href} defect={s.defect ?? (s.text ? l.label : undefined)} fileInfo={s.fileInfo} newWindow={s.newWindow}>{s.text ?? l.label}</SmartLink>
                  : <AnyLink href={l.href}>{l.label}</AnyLink>}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/** DataTable columns for a content table (string rows). */
export const stringColumns = (headers: string[]): Column<string[]>[] =>
  headers.map((header, i) => ({ key: String(i), header, render: (row) => row[i] }));
