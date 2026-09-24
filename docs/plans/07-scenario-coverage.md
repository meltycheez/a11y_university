# Plan 07 — Scenario Coverage

## Goal

Define the complete catalog of rule types, spread instances realistically across pages, design the six "terrible" legacy pages, and confirm the PRD's coverage checklist is met.

Target: about **60 rule types** and about **350–450 scenario instances** across the site.

> Expected WAVE and axe identifiers are best-effort. Phase 09 checks the axe IDs against the installed axe-core version and records any mismatch in the registry. Some older axe rules, such as `duplicate-id`, are deprecated in recent versions. Those scenarios are marked `manualOnly` or given WAVE-only detection.

## Rule taxonomy

### Errors (Fix Errors)
| Rule key | Example instance | WCAG | axe (approx.) |
|---|---|---|---|
| `img-missing-alt` | News lead image with no `alt` | 1.1.1 | image-alt |
| `img-empty-alt-meaningful` | `alt=""` on a chart image that carries information | 1.1.1 | (manual / WAVE) |
| `input-missing-label` | Course keyword search | 1.3.1, 4.1.2 | label |
| `select-missing-label` | Semester filter | 1.3.1, 4.1.2 | select-name |
| `button-empty` | Icon-only "Add course" | 4.1.2 | button-name |
| `link-empty` | Social icon links in the footer | 2.4.4, 4.1.2 | link-name |
| `html-lang-missing` | Global `<html>` | 3.1.1 | html-has-lang |
| `page-title-missing` | Legacy aid form, catalog | 2.4.2 | document-title |
| `heading-empty` | Card heading slot left empty | 1.3.1 | empty-heading |
| `duplicate-id` | Repeated `id="search"` in header and page | 4.1.1 (obsolete) | duplicate-id-aria where ARIA is involved |
| `aria-broken-reference` | `aria-labelledby` pointing to a missing ID | 1.3.1, 4.1.2 | aria-valid-attr-value |
| `aria-invalid-attr` | `aria-expandable="true"` typo | 4.1.2 | aria-valid-attr |
| `aria-invalid-value` | `aria-hidden="yes"` | 4.1.2 | aria-valid-attr-value |
| `iframe-missing-title` | Campus tour video embed | 4.1.2 | frame-title |
| `table-header-association` | `headers` attribute pointing to wrong cells | 1.3.1 | td-headers-attr |
| `aria-required-children` | `role="tablist"` with no tabs | 1.3.1 | aria-required-children |
| `aria-required-parent` | `role="option"` outside a listbox | 1.3.1 | aria-required-parent |
| `svg-control-unlabeled` | Map zoom SVG button | 1.1.1, 4.1.2 | svg-img-alt / button-name |
| `input-image-no-alt` | Legacy "Submit" image button | 1.1.1 | input-image-alt |
| `list-structure` | `<li>` inside `<div>` in the legacy nav | 1.3.1 | listitem |
| `aria-hidden-focusable` | Focusable link inside `aria-hidden` | 4.1.2 | aria-hidden-focus |
| `label-for-mismatch` | `<label for>` pointing to a missing ID | 1.3.1 | label |

### Alerts (Fix Alerts)
| Rule key | Example | WAVE (approx.) |
|---|---|---|
| `alt-suspicious` | `alt="IMG_4471.jpg"`, `alt="image"` | alt_suspicious |
| `alt-redundant` | Alt text duplicates the adjacent caption | alt_redundant |
| `alt-long` | 300+ character alt text | alt_long |
| `img-title-attr` | `title` attribute on an image | title_redundant |
| `link-redundant` | Card image and title link to the same URL separately | link_redundant |
| `link-generic` | "Click here," "Read more," "Learn more" | link_suspicious |
| `link-document` | PDF link with no file type or size | link_pdf / link_document |
| `link-new-window` | `target=_blank` with no warning | (manual / WAVE) |
| `underline-non-link` | Underlined emphasis text | underline |
| `heading-skipped` | h2 → h4 | heading_skipped |
| `heading-possible` | Bold paragraph used as a heading | heading_possible |
| `text-small` | 10px legal and footer text | text_small |
| `event-handler-device` | `onmouseover`-only handlers | event_handler |
| `label-orphaned` | A `<label>` associated with nothing | label_orphaned |
| `placeholder-as-label` | Inputs with a placeholder but no label (alert variant: a label exists but is hidden) | (varies) |
| `table-no-caption` | Data tables with no caption | (manual) |
| `table-layout` | Layout table in the legacy aid form | table_layout |
| `title-redundant` | `title` attribute matching the link text | title_redundant |
| `link-nearby-duplicate` | Adjacent links with the same text and different URLs | (manual) |
| `fieldset-missing` | Radio groups without a fieldset | fieldset_missing |
| `noscript-content` / `javascript-jump` | `href="javascript:void(0)"` or `href="#"` links | link_javascript |

### Manual (Fix Manual Testing Issues)
| Group | Rule keys |
|---|---|
| Keyboard | `kbd-dropdown-inoperable`, `kbd-hover-only-menu`, `kbd-drag-no-alternative`, `kbd-carousel-unreachable`, `kbd-tabs-wrong-keys`, `kbd-div-button`, `kbd-focus-trap-bad` |
| Focus | `focus-indicator-missing`, `focus-order-mismatch`, `focus-positive-tabindex`, `focus-unexpected-move`, `focus-not-restored`, `focus-lost-on-update` |
| Screen reader | `sr-status-not-announced`, `sr-results-no-live-region`, `sr-errors-not-announced`, `sr-modal-no-context`, `sr-accordion-state`, `sr-decorative-announced`, `sr-visual-only-state` |
| Visual | `contrast-text-low`, `contrast-ui-low`, `color-only-info`, `color-only-required`, `color-only-error`, `text-in-image` |
| Zoom / reflow | `reflow-overflow-200`, `reflow-horizontal-scroll`, `reflow-clipped-text`, `reflow-fixed-dimensions`, `text-spacing-breaks` |
| Motion | `motion-autorotate-no-pause`, `motion-animated-announcement`, `motion-ignores-reduced-motion` |
| Forms | `form-instructions-disappear`, `form-vague-errors`, `form-required-unclear`, `form-ungrouped-controls`, `form-no-structure`, `form-timeout-no-warning` |

## Distribution

- Use tiers from plan 05. The registry gets a `tier` summary per route, and the lab shows actual counts.
- **Global chrome defects** (header, mega menu, footer) appear on *every* page. Keep them to a moderate set, about 3 errors, 5 alerts, and 3 manual, so clean-ish pages still register as light.
- Section chrome adds section-specific defects. For example, every academics page has the low-contrast sidebar and the skipped heading in its template.
- Page-specific defects make up the rest.
- A few pages (`/about/mission`, `/accessibility`, some profiles) should end up with **only the global defects plus 0–2 more**, to meet the PRD's "only 2–3 issues" tier. Consider an optional `lightChrome` variant of the footer for those pages.

## The six terrible pages

| Page | Signature defects |
|---|---|
| Legacy Financial Aid Form | Layout tables, no title, no labels, image submit button, CAPTCHA image, `javascript:` links, timeout with no warning, tiny text, color-only required fields, positive tabindex chaos |
| Old Course Catalog | h1 → h4 jumps, bold-paragraph headings, 200+ "View" links, tables without headers, `<font>`-style small low-contrast text, a hover-only subject menu, a horizontal scroll table at 200% zoom |
| Campus Map | See plan 06 #10 |
| Athletics Schedule | Dense tables without captions or headers, icon-only ticket, TV, and result icons, win/loss shown by color only, a sticky header that covers the focused element |
| Student Registration | See plan 06 #2 |
| Donation Form | See plan 06 #7 |

## Coverage checklist (PRD final requirement)

The lab (plan 08) and a test (plan 09) generate this matrix automatically from the registry. Each area needs at least 3 scenarios across at least 3 pages:

navigation · images · links · headings · forms · tables · ARIA · keyboard · focus · contrast · responsive/reflow · dynamic content · dialogs · tabs · accordions · carousels · custom controls

Add a `areas: Area[]` field to `Scenario` to support this.

## Tasks

1. Finalize `rules.ts` with all rule keys and metadata.
2. Build the chrome scenarios, then the template-level scenarios, then page-level scenarios as each page is built in plan 05 and 06.
3. Design and build the six terrible pages.
4. Keep checking the coverage matrix and fill any gaps.

## Acceptance criteria

- Every rule key has at least one instance, and every coverage area has at least 3 scenarios.
- Per-page counts cover the full tier range, from about 3 to 40+ issues.
- Running axe with all toggles OFF on a sample of 20 pages reports violations for the expected axe rule IDs. With all toggles ON, the **registered** violations are gone. Any unregistered leftovers are either fixed or registered.
