import type { Category } from "./state";

export interface Rule {
  category: Category;
  wcag: string[];
  /** Expected tool identifiers (best effort). */
  wave?: string[];
  axe?: string[];
  manualOnly?: boolean;
}

// Rule taxonomy. Scenarios inherit category, WCAG criteria and expected detections from their rule.
// Plan 07 fills in the full catalog.
export const rules = {
  // Errors
  "html-lang-missing": { category: "error", wcag: ["3.1.1"], wave: ["language_missing"], axe: ["html-has-lang"] },
  "page-title-missing": { category: "error", wcag: ["2.4.2"], wave: ["title_invalid"], axe: ["document-title"] },
  "alt-missing": { category: "error", wcag: ["1.1.1"], wave: ["alt_missing"], axe: ["image-alt"] },
  "form-label-missing": { category: "error", wcag: ["1.3.1", "3.3.2", "4.1.2"], wave: ["label_missing"], axe: ["label"] },
  // Alerts
  "heading-skipped": { category: "alert", wcag: ["1.3.1"], wave: ["heading_skipped"], axe: ["heading-order"] },
  "alt-suspicious": { category: "alert", wcag: ["1.1.1"], wave: ["alt_suspicious"] },
  "text-justified": { category: "alert", wcag: ["1.4.8"], wave: ["text_justified"] },
  // Manual
  "hover-only-menu": { category: "manual", wcag: ["2.1.1"], manualOnly: true },
  "contrast-low": { category: "manual", wcag: ["1.4.3"], wave: ["contrast"], axe: ["color-contrast"] },
  "focus-indicator-missing": { category: "manual", wcag: ["2.4.7"], manualOnly: true },
} satisfies Record<string, Rule>;

export type RuleKey = keyof typeof rules;
