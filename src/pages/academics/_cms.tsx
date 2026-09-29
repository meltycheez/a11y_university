// Shared bits of the academics CMS templates (academics and faculty pages).
import { useScenario } from "~/a11y/useScenario";

export const SIDEBAR_SCENARIO = "academics-sidebar-contrast-001";
export const HEADER_SCENARIO = "academics-header-contrast-001";
/** File info appended to PDF links once fixed (the generated PDFs are all about 2 KB). */
export const PDF_INFO = "PDF, 2 KB";

/**
 * Page root for every academics CMS page. Registers the section's low-contrast sidebar and section header
 * (CSS defects in cms.css keyed on `.cms-page`, since both are rendered by the shared layout).
 */
export function CmsPage({ className, children }: { className?: string; children: React.ReactNode }) {
  useScenario(SIDEBAR_SCENARIO);
  useScenario(HEADER_SCENARIO);
  return <div className={["cms-page", className].filter(Boolean).join(" ")} data-a11y-scenario={`${SIDEBAR_SCENARIO} ${HEADER_SCENARIO}`}>{children}</div>;
}

export const firstSentence = (text: string) => text.match(/^.*?[a-z)][.!?](?=\s+[A-Z]|$)/)?.[0] ?? text;

/** Impacted programs (the department overviews say so). */
export const impactedPrograms = new Set(["bs-computer-science", "bsn-nursing"]);
