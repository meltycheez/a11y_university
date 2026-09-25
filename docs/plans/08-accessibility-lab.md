# Plan 08 — Accessibility Lab

## Goal

Build `/accessibility-lab`, a clearly labeled developer page that lists every intentional scenario, plus seven controlled test pages. The lab index and its tooling are **accessible by default**.

## `/accessibility-lab` (index)

- Its header explains what the site is and how the toggles work, and links to `ACCESSIBILITY_TESTING.md` content.
- **Summary band:** totals by category, the current toggle state, and the rule count.
- **Coverage matrix:** coverage areas × categories, with counts. This is generated from the registry.
- **Scenario table:** an accessible, sortable data table with a caption, `scope` headers, and sort buttons that update `aria-sort`. Columns:

| Issue | Category | Rule | Page(s) | Component | WCAG | Expected detection (WAVE / axe / manual) | Current status | Fixed by |
|---|---|---|---|---|---|---|---|---|

- "Current status" is live, for example *Active* or *Fixed by Fix Errors*, based on the toggle state.
- Page links go straight to each instance. `?highlight=<id>` outlines the element on the target page and scrolls it into view. This only affects presentation, doesn't persist, and doesn't change accessibility semantics (a CSS outline on `[data-a11y-scenario=id]`).
- Filters for category, area, page, and WCAG criterion, plus text search. The result count is announced through a live region.
- Grouped views for Errors, Alerts, and Manual Testing, as tabs that follow the correct ARIA pattern.
- **Export:** "Download registry JSON" builds a Blob from the in-memory registry for benchmarking. This is a client-side download, not a network request.
- **Page inventory:** every route with its tier and its registered scenario count.

## Controlled test pages

Each page shows small, isolated specimens. Each specimen is a `<section>` with a heading, the live specimen (defective or fixed per toggle), and a caption naming the scenario ID, the expected tool finding, and what the fix changes. The surrounding page chrome stays accessible, so scanner results come only from the specimens.

| Route | Specimens |
|---|---|
| `/accessibility-lab/errors` | One specimen per error rule |
| `/accessibility-lab/alerts` | One per alert rule |
| `/accessibility-lab/manual` | Contrast, color-only, motion, reflow, and text-in-image specimens, with testing instructions ("Tab to the button; observe no focus ring") |
| `/accessibility-lab/forms` | Labeling, grouping, instructions, errors, required fields, timeouts |
| `/accessibility-lab/keyboard` | Dropdown, menu, tabs, modal, drag-drop, carousel, positive tabindex |
| `/accessibility-lab/tables` | Missing headers, wrong `headers`, layout table, no caption, complex multi-level headers |
| `/accessibility-lab/aria` | Broken references, invalid attributes and values, missing required children and parents, `aria-hidden` focus, misused roles, live regions |

Test pages reuse the **same scenario components** as the site, so they're controlled copies of the real defects rather than separate demos. They register their own scenario IDs with the suffix `-lab` so counts stay unambiguous.

## Tasks

1. Build the accessible `DataTable`, filters, and tabs for the lab.
2. Build the index with its summary, matrix, table, filters, and export.
3. Build the highlight query handler.
4. Build the seven specimen pages.
5. Run axe on the lab index and each page's chrome (excluding the specimens) and confirm zero violations.

## Acceptance criteria

- Every registry entry appears in the lab, and every page link lands on a route where that scenario renders.
- Status updates live when toggles change.
- axe reports no violations on the lab index.

## Implementation notes (2026-09-25)

- **Shared `<Specimen id>` wrapper** (`pages/accessibility-lab/_Specimen.tsx`) renders every specimen's heading, live markup slot and caption (id, expected detection, live fixed/active status, fix description) straight from that scenario's registry entry, so the 7 specimen pages contain only live markup and never duplicate copy that already lives in the registry.
- **Ids get a page suffix** (`<rule-slug>-<page>-lab`, e.g. `img-missing-alt-errors-lab`), a small generalization of the plan's plain `-lab` suffix: several rules (`table-header-association`, `input-missing-label`, `fieldset-missing`…) get their own isolated specimen on more than one lab page, and ids must stay globally unique.
- **Coverage generated in `~/a11y/coverage.ts`**: `categoryTotals`, `areaCategoryMatrix`, `expandPages` (mirrors `scripts/check-scenarios.ts`'s page-expansion logic for `"*"` and `:slug` patterns) and `pageInventory`, all pure functions over the live registry so the lab can't drift from what actually renders.
- **Category filter and the "grouped tabs" requirement are one control**: a hand-rolled ARIA tablist in the index page (not the shared `Tabs` widget, which has no controlled active-tab API) whose active tab (All/Errors/Alerts/Manual) doubles as the category filter, combined underneath with area, WCAG-criterion, page-substring and text filters. A single `role="tabpanel"` swaps content rather than rendering four hidden panels.
- **`?highlight=<id>` is global infrastructure**: `~/a11y/useHighlight.ts`, mounted once in `root.tsx` next to `A11yControl`, outlines the first `[data-a11y-scenario]` match and scrolls it into view on every route, not just the lab.
- **Document-mechanism specimens are code samples, not live toggles.** `html-lang-missing` and `page-title-missing` can't be demonstrated inside the lab: ADR-004 always sets `<html lang>` there, and a page can only have one real `<title>`. Both render a static before/after `<pre><code>` sample instead, with no `data-a11y-scenario` marker — consistent with how the sitewide `HtmlLang`/`ScenarioTitle` document scenarios already work.
- **No new rule keys.** The ARIA page's "misused roles" and "live regions" topics (from the plan's specimen list) are folded into existing rules rather than inventing new ones: misused roles is a second sentence on the `aria-invalid-attr` specimen's caption, live regions is `sr-results-no-live-region`.
- Final counts: 87 new lab specimens across the 7 pages (errors 22, alerts 22, manual 13, forms 12, keyboard 7, tables 5, aria 7) plus the index. `npm run check:scenarios` (819/819 render where registered) and `npm run coverage` (84/84 rules used) both pass; `npm run typecheck`, `npm run build` and the Vitest suite (127 tests) are all clean.
- Not done here (plan 09 territory): Playwright/axe verification that the lab index itself reports zero violations, and per-page chrome-only axe runs on the 7 specimen pages.
