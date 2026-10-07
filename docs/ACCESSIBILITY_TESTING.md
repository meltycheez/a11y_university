# Accessibility Testing Guide

Redwood State University is a static site built to be scanned. Every accessibility defect on it is
deliberate, registered, and independently toggleable. This guide covers the three defect categories, how
the toggle engine works, the registry schema, how to add a new scenario, and how to run each kind of test
against the site.

## The three categories

The floating **Pope Tech Accessibility Lab** widget ("Accessibility Lab" with the Pope Tech logo, bottom corner of every page, `Alt+Shift+A` to
jump to it; formerly "Accessibility Test Controls") has one switch per category on its **Fixes** tab. Its
**Challenges** tab lists the assistive technology CTFs ([CTF.md](CTF.md)), which run from a challenge bar on
their own pages. Each loads **OFF**; turning a switch **ON** corrects that category's defects
on the current page; turning it back off restores them. Reloading resets all three to OFF — nothing
persists (see [ADR-005](DECISIONS.md#adr-005), [ADR-048](DECISIONS.md#adr-048)).

| Category | Switch | What it covers | Detected by |
|---|---|---|---|
| **Errors** | Fix Errors | Missing alt text, unlabeled form controls, empty buttons/links, missing `lang`/`<title>`, broken/invalid ARIA, missing iframe titles, empty headings, table header mistakes, missing required ARIA parents/children, low text/UI contrast | Automated scanners flag these as errors/violations |
| **Alerts** | Fix Alerts | Suspicious or redundant alt text, skipped heading levels, tiny text, layout tables, "click here" links, device-dependent handlers, new-window links with no warning, placeholder-as-label | Automated scanners flag these for review, not as hard failures |
| **Manual** | Fix Manual Testing Issues | Keyboard traps and unreachable controls, missing/incorrect focus indicators and order, hover-only menus, unannounced status changes and live regions, session timeouts | Requires a human (or Playwright) driving a keyboard/screen reader — scanners can't reliably catch these from static markup |

This mirrors how WAVE splits its own results into Errors, Alerts, and "Features/Structure" that still need
a human to judge.

## How the toggles work

- `src/a11y/state.ts` is a plain module-level store (`a11yStore`), read via `useSyncExternalStore`. Three
  booleans (`fixErrors`, `fixAlerts`, `fixManual`), nothing else. No localStorage/sessionStorage/cookies —
  a hard reload always comes back to all-OFF, which is also what the prerendered HTML already is.
- Each toggle also flips a body class (`a11y-fix-errors` / `a11y-fix-alerts` / `a11y-fix-manual`), so
  CSS-only defects (contrast, focus indicators, layout) can be fixed with a plain stylesheet rule instead of
  a React branch — see `src/styles/fixes/*.css` and each section's own stylesheet.
- `useScenario(id)` (`src/a11y/useScenario.ts`) looks up a scenario's category, returns whether its toggle
  is ON, and registers the instance in a ref-counted "what's mounted on this page right now" set (used for
  the on-page counts and the Accessibility Lab). Components branch on its return value to render the
  defective or fixed markup/behavior.
- `useFixes(defs, prefix)` (`src/a11y/useFixes.ts`) is a thin wrapper over `useScenario` for pages with many
  small scenarios: it gives short keys (`fix("amount-fieldset")`, `mark("amount-fieldset")`) instead of
  repeating full ids.

## Registry schema and rule taxonomy

Every defect is a `ScenarioDef` (`src/a11y/registry/types.ts`), one array per site area under
`src/a11y/registry/*.ts`, combined in `src/a11y/registry/index.ts`:

```ts
interface ScenarioDef {
  id: string;                 // globally unique, "<area>-<thing>-<NNN>"
  rule: RuleKey;               // key into rules.ts — supplies category, WCAG, expected detections
  title: string;                // short name, shown in the Accessibility Lab
  description: string;          // the defect, in plain language
  fixDescription: string;       // what "Fix" does
  pages: string[];               // exact paths, a ":slug" pattern, or "*" for sitewide chrome
  component: string;             // React component that renders it
  mechanism: "markup" | "css" | "behavior" | "document";
  severity?: "minor" | "moderate" | "serious" | "critical";
  wcag?: string[];                // overrides the rule's WCAG criteria
  areas?: Area[];                  // overrides the rule's coverage areas
  detectedBy?: { wave?: string[]; axe?: string[]; manualOnly?: boolean };
}
```

`rules.ts` holds the taxonomy (about 90 rule keys) a scenario picks its `rule` from — each rule fixes the
scenario's `category`, WCAG success criteria, coverage `areas`, and expected WAVE/axe rule ids so a
scenario can't drift from its rule. See `docs/plans/07-scenario-coverage.md` for the full list and
`docs/SITE_MAP.md` for where every scenario currently lives.

## How to add a scenario

1. **Pick (or add) a rule** in `src/a11y/rules.ts`. Reuse an existing key if the defect matches one
   (missing alt, missing label, empty heading, …); add a new key only for a genuinely new defect pattern,
   with its WCAG criteria, coverage area(s), and expected WAVE/axe ids.
2. **Add a `ScenarioDef`** to that area's registry file (`src/a11y/registry/<area>.ts`) — a new `id`, the
   `rule`, `title`/`description`/`fixDescription`, the `pages` it appears on, and the `component` that
   renders it.
3. **Render it** in that component: call `useScenario(scenario.id)` (or `useFixes(...).fix(key)` on a page
   that already uses it), branch defective vs. fixed markup on the result, and put
   `data-a11y-scenario="<id>"` on the element the defect actually lives on.
4. **Verify** with `npm run build && npm run check:scenarios` (confirms the marker renders on every page the
   registry says it does, and that no unregistered marker exists) and `npm run coverage` (confirms the
   rule's coverage area still has ≥3 scenarios on ≥3 pages).

### Worked example

Adding "empty alt where the image is meaningful" to a new `TeamPhoto` component on `/about/history`:

```ts
// src/a11y/registry/about.ts
{
  id: "about-history-team-photo-alt-001",
  rule: "img-empty-alt-meaningful",
  title: "1920s faculty photo has an empty alt",
  description: "The historical faculty photo has alt=\"\", but the image is meaningful content, not decoration.",
  fixDescription: "Sets alt text describing the photo.",
  pages: ["/about/history"],
  component: "TeamPhoto",
  mechanism: "markup",
  severity: "serious",
}
```

```tsx
// The component (or a plain <img> using <Img scenario="..." fixedAlt="...">, which already does this):
const fixed = useScenario("about-history-team-photo-alt-001");
<img src="..." alt={fixed ? "Faculty of Redwood State University, c. 1924" : ""} data-a11y-scenario="about-history-team-photo-alt-001" />
```

## Testing walkthroughs

### WAVE

1. Install the [WAVE browser extension](https://wave.webaim.org/extension/).
2. Load the page with every toggle OFF (the default) and run WAVE. It reads the live DOM, so whatever the
   toggles currently show is what it scans — there's nothing to "rescan from source."
3. Open the **Pope Tech Accessibility Lab** widget, choose its **Fixes** tab, turn on **Fix Errors**, and run WAVE again on the same page without
   reloading. The Errors count should drop to (near) zero; Alerts/Manual are unaffected until their own
   switches flip.
4. Turn the switch back off and run WAVE a third time to confirm the defects returned.

### axe DevTools and the Playwright scan script

- **axe DevTools** (browser extension): same live-DOM workflow as WAVE above — scan, flip a switch, rescan.
- **`npm run scan`**: a small headless-Playwright + axe-core script for a quick before/after table from the
  terminal. Build and preview the site first, then:

  ```
  npm run build
  npm run preview          # serves build/client on :4173, in another terminal
  npm run scan -- /academics/catalog
  ```

  It prints one row per axe rule id with the violation/incomplete node count before and after clicking
  **Fix All**. `e2e/toggle-axe.spec.ts` runs the same before/after/back-off/reload cycle as an assertion
  across ~15 representative pages (all six "terrible" tier pages included) — that's the source of truth in
  CI; `npm run scan` is for spot-checking one page by hand. If port 4173 is already in use on your machine,
  serve on another port (`npx serve build/client -l 4321`) and pass it as `BASE_URL=http://localhost:4321`.

### Keyboard

Tab through each page using only the keyboard (no mouse). Checklist, all with every toggle OFF:

| Page | Try |
|---|---|
| `/academics/catalog` | Subject "Jump to" menu — opens on hover only, unreachable by keyboard |
| `/admissions/apply` | Tab order through the multi-step form; watch for focus not moving to the next step's heading |
| `/portal/registration` | Modal open/close — focus trap and restore-on-close |
| Any page with a carousel (home) | Carousel prev/next controls and dot navigation |
| `/athletics/schedule` | Sticky header covering a focused row when tabbing down the table |
| Any custom `Tabs`/`Accordion`/`Dropdown` widget in its defective variant | Arrow-key and Enter/Space behavior |

Turn on **Fix Manual Testing Issues** and repeat — each item above should become keyboard-operable.

### Screen readers

Basic passes against the portal, forms, and live regions, toggles OFF then ON:

- **NVDA (Windows)**: `/portal/registration` (does opening/closing the seat-count update get announced?),
  `/admissions/apply` (are inline validation errors announced when they appear, or only shown visually?).
- **VoiceOver (macOS)**: `/academics/courses` search — are result-count updates read out as they change?
- **Narrator (Windows)**: same two flows as NVDA, as a cross-check.

### Zoom and reflow

- Browser zoom to 200% and 400%: content should reflow to a single column with no horizontal scrollbar on
  the "reflow" coverage-area pages; the defective variant intentionally breaks this.
- Text-spacing bookmarklet (WCAG 1.4.12): apply the standard line-height/spacing overrides and confirm text
  doesn't clip or overlap once **Fix Alerts**/**Fix Manual** are on.

## Known tool differences

- **`duplicate-id`**: installed axe-core disables its generic `duplicate-id` check by default, and
  `duplicate-id-aria` only fires when the duplicated id is ARIA-referenced (none of this project's are), so
  this rule is WAVE/manual-only ([ADR-047](DECISIONS.md#adr-047)).
- **Invalid ARIA values with a browser fallback** (e.g. `aria-current="yes"`): axe files these under
  `incomplete` ("needs review"), not `violations`, since it can't be sure without human judgement — treat
  both the same way when reading a scan.
- **Hover-only menus and other CSS `:hover` reveals**: invisible to a page-load axe/WAVE scan since nothing
  is actually hidden from the accessibility tree; only a real `:hover` (or a human/keyboard pass) surfaces
  them — see `EXCEPTIONS` in `e2e/toggle-axe.spec.ts`.
- **React event delegation**: device-dependent handlers (`onmouseover` etc.) usually have no matching DOM
  attribute for WAVE's `event_handler` alert to find, since React attaches listeners at the root and
  delegates — these scenarios are registered `manualOnly` rather than expected to trip that alert
  ([ADR-030](DECISIONS.md#adr-030)).
- **`color-contrast` false "incomplete" noise**: a photo-overlay hero (axe can't resolve a background behind
  a semi-opaque pseudo-element or CSS gradient), a decorative `aria-hidden` icon glyph ("content contains
  only non-text characters"), or — specific to `e2e/toggle-axe.spec.ts`, which opens the floating
  Pope Tech Accessibility Lab widget panel before scanning — whatever that panel happens to sit over. None of these
  are real violations or tied to any scenario; they're excepted per page in that file's `EXCEPTIONS` map
  ([ADR-056](DECISIONS.md#adr-056)).
