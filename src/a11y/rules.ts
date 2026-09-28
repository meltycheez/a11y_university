import type { Category } from "./state";

/** Coverage areas from the PRD's final checklist (plan 07). Every area needs 3+ scenarios on 3+ pages. */
export type Area =
  | "navigation" | "images" | "links" | "headings" | "forms" | "tables" | "aria" | "keyboard" | "focus"
  | "contrast" | "reflow" | "dynamic" | "dialogs" | "tabs" | "accordions" | "carousels" | "custom-controls" | "document";

export interface Rule {
  category: Category;
  wcag: string[];
  areas: Area[];
  /** Expected tool identifiers (best effort; plan 09 verifies axe ids against the installed axe-core). */
  wave?: string[];
  axe?: string[];
  manualOnly?: boolean;
}

const e = (wcag: string[], areas: Area[], axe?: string[], wave?: string[]): Rule => ({ category: "error", wcag, areas, axe, wave });
const a = (wcag: string[], areas: Area[], wave?: string[], axe?: string[]): Rule => ({ category: "alert", wcag, areas, wave, axe });
const m = (wcag: string[], areas: Area[], axe?: string[]): Rule => ({ category: "manual", wcag, areas, axe, manualOnly: !axe });

// Rule taxonomy (plan 07). Scenarios inherit category, WCAG, areas and expected detections from their rule.
export const rules = {
  // ---------- Errors (Fix Errors) ----------
  "img-missing-alt": e(["1.1.1"], ["images"], ["image-alt"], ["alt_missing"]),
  "img-empty-alt-meaningful": e(["1.1.1"], ["images"], undefined, ["alt_link_missing"]),
  "input-missing-label": e(["1.3.1", "3.3.2", "4.1.2"], ["forms"], ["label"], ["label_missing"]),
  "select-missing-label": e(["1.3.1", "4.1.2"], ["forms"], ["select-name"], ["label_missing"]),
  "button-empty": e(["4.1.2"], ["forms", "custom-controls"], ["button-name"], ["button_empty"]),
  "link-empty": e(["2.4.4", "4.1.2"], ["links"], ["link-name"], ["link_empty"]),
  "html-lang-missing": e(["3.1.1"], ["document"], ["html-has-lang"], ["language_missing"]),
  "page-title-missing": e(["2.4.2"], ["document", "navigation"], ["document-title"], ["title_invalid"]),
  "heading-empty": e(["1.3.1", "2.4.6"], ["headings"], ["empty-heading"], ["heading_empty"]),
  // axe-core's "duplicate-id" (any duplicate id) is disabled by default, and none of our duplicate ids are
  // ARIA-referenced, so "duplicate-id-aria" never actually fires here — plan 09 found this WAVE/manual only.
  "duplicate-id": e(["4.1.1"], ["aria"]),
  "aria-broken-reference": e(["1.3.1", "4.1.2"], ["aria"], ["aria-valid-attr-value"], ["aria_reference_broken"]),
  "aria-invalid-attr": e(["4.1.2"], ["aria"], ["aria-valid-attr"]),
  "aria-invalid-value": e(["4.1.2"], ["aria"], ["aria-valid-attr-value"]),
  "iframe-missing-title": e(["4.1.2"], ["navigation"], ["frame-title"]),
  "table-header-association": e(["1.3.1"], ["tables"], ["td-headers-attr"], ["th_empty"]),
  "aria-required-children": e(["1.3.1"], ["aria", "tabs"], ["aria-required-children"]),
  "aria-required-parent": e(["1.3.1"], ["aria"], ["aria-required-parent"]),
  "svg-control-unlabeled": e(["1.1.1", "4.1.2"], ["images", "custom-controls"], ["svg-img-alt", "button-name"]),
  "input-image-no-alt": e(["1.1.1"], ["forms", "images"], ["input-image-alt"], ["alt_input_missing"]),
  "list-structure": e(["1.3.1"], ["navigation"], ["listitem"]),
  "aria-hidden-focusable": e(["4.1.2"], ["aria", "focus"], ["aria-hidden-focus"]),
  "label-for-mismatch": e(["1.3.1"], ["forms"], ["label"], ["label_missing"]),
  // WAVE detects both as red "Contrast Errors", not Alerts — treat them as automated Errors, like WAVE does,
  // not manual judgement calls.
  "contrast-text-low": e(["1.4.3"], ["contrast"], ["color-contrast"]),
  "contrast-ui-low": e(["1.4.11"], ["contrast"]),

  // ---------- Alerts (Fix Alerts) ----------
  "alt-suspicious": a(["1.1.1"], ["images"], ["alt_suspicious"]),
  "alt-redundant": a(["1.1.1"], ["images"], ["alt_redundant"]),
  "alt-long": a(["1.1.1"], ["images"], ["alt_long"]),
  "img-title-attr": a(["1.1.1"], ["images"], ["title_redundant"]),
  "link-redundant": a(["2.4.4"], ["links"], ["link_redundant"]),
  "link-generic": a(["2.4.4"], ["links"], ["link_suspicious"]),
  "link-document": a(["2.4.4"], ["links"], ["link_pdf"]),
  "link-new-window": a(["3.2.5"], ["links"]),
  "underline-non-link": a(["1.3.1"], ["links", "contrast"], ["underline"]),
  "heading-skipped": a(["1.3.1"], ["headings"], ["heading_skipped"], ["heading-order"]),
  "heading-possible": a(["1.3.1"], ["headings"], ["heading_possible"]),
  "text-small": a(["1.4.4"], ["reflow"], ["text_small"]),
  "text-justified": a(["1.4.8"], ["reflow"], ["text_justified"]),
  "event-handler-device": a(["2.1.1"], ["keyboard"], ["event_handler"]),
  "label-orphaned": a(["1.3.1"], ["forms"], ["label_orphaned"]),
  "placeholder-as-label": a(["3.3.2"], ["forms"]),
  "table-no-caption": a(["1.3.1"], ["tables"]),
  "table-layout": a(["1.3.1"], ["tables"], ["table_layout"], ["layout-table"]),
  "title-redundant": a(["2.4.4"], ["links"], ["title_redundant"]),
  "link-nearby-duplicate": a(["2.4.4"], ["links"]),
  "fieldset-missing": a(["1.3.1"], ["forms"], ["fieldset_missing"]),
  "link-javascript": a(["2.1.1", "4.1.2"], ["links", "keyboard"], ["link_javascript"]),

  // ---------- Manual (Fix Manual Testing Issues) ----------
  "kbd-dropdown-inoperable": m(["2.1.1"], ["keyboard", "custom-controls"]),
  "kbd-hover-only-menu": m(["2.1.1"], ["keyboard", "navigation"]),
  "kbd-drag-no-alternative": m(["2.1.1", "2.5.7"], ["keyboard", "custom-controls"]),
  "kbd-carousel-unreachable": m(["2.1.1"], ["keyboard", "carousels"]),
  "kbd-tabs-wrong-keys": m(["2.1.1"], ["keyboard", "tabs"]),
  "kbd-div-button": m(["2.1.1", "4.1.2"], ["keyboard", "custom-controls"]),
  "kbd-focus-trap-bad": m(["2.1.2"], ["keyboard", "dialogs"]),
  "focus-indicator-missing": m(["2.4.7"], ["focus"]),
  "focus-order-mismatch": m(["2.4.3"], ["focus"]),
  "focus-positive-tabindex": m(["2.4.3"], ["focus"], ["tabindex"]),
  "focus-unexpected-move": m(["3.2.1"], ["focus", "dynamic"]),
  "focus-not-restored": m(["2.4.3"], ["focus", "dialogs"]),
  "focus-lost-on-update": m(["2.4.3"], ["focus", "dynamic"]),
  "sr-status-not-announced": m(["4.1.3"], ["dynamic"]),
  "sr-results-no-live-region": m(["4.1.3"], ["dynamic"]),
  "sr-errors-not-announced": m(["3.3.1", "4.1.3"], ["forms", "dynamic"]),
  "sr-modal-no-context": m(["1.3.1", "4.1.2"], ["dialogs"]),
  "sr-accordion-state": m(["4.1.2"], ["accordions"]),
  "sr-decorative-announced": m(["1.1.1"], ["images"]),
  "sr-visual-only-state": m(["1.3.1", "4.1.2"], ["custom-controls"]),
  "color-only-info": m(["1.4.1"], ["contrast"]),
  "color-only-required": m(["1.4.1", "3.3.2"], ["contrast", "forms"]),
  "color-only-error": m(["1.4.1", "3.3.1"], ["contrast", "forms"]),
  "text-in-image": m(["1.4.5"], ["images"]),
  "reflow-overflow-200": m(["1.4.10"], ["reflow"]),
  "reflow-horizontal-scroll": m(["1.4.10"], ["reflow"]),
  "reflow-clipped-text": m(["1.4.4"], ["reflow"]),
  "reflow-fixed-dimensions": m(["1.4.4", "1.4.10"], ["reflow"]),
  "text-spacing-breaks": m(["1.4.12"], ["reflow"]),
  "motion-autorotate-no-pause": m(["2.2.2"], ["carousels", "dynamic"]),
  "motion-animated-announcement": m(["2.2.2"], ["dynamic"]),
  "motion-ignores-reduced-motion": m(["2.3.3"], ["dynamic"]),
  "form-instructions-disappear": m(["3.3.2"], ["forms"]),
  "form-vague-errors": m(["3.3.1", "3.3.3"], ["forms"]),
  "form-required-unclear": m(["3.3.2"], ["forms"]),
  "form-ungrouped-controls": m(["1.3.1"], ["forms"]),
  "form-no-structure": m(["1.3.1", "2.4.6"], ["forms", "headings"]),
  "form-timeout-no-warning": m(["2.2.1"], ["forms", "dynamic"]),
} satisfies Record<string, Rule>;

export type RuleKey = keyof typeof rules;
