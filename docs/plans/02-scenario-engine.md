# Plan 02 — Accessibility Scenario Engine

## Goal

Build a single, easy-to-extend system that does five things:

1. Holds the three fix toggles in memory.
2. Defines every intentional defect in a typed registry.
3. Lets components render defective or fixed markup and behavior through one hook.
4. Tracks which scenarios are mounted on the current page, for live counts.
5. Provides the floating **Accessibility Test Controls** panel.

## 1. State (`src/a11y/state.ts`)

```ts
export type Category = "error" | "alert" | "manual";
export interface A11yState { fixErrors: boolean; fixAlerts: boolean; fixManual: boolean }

const initial: A11yState = { fixErrors: false, fixAlerts: false, fixManual: false };
let state = { ...initial };            // module memory only; reload = reset
const listeners = new Set<() => void>();

export const a11yStore = {
  get: () => state,
  set(patch: Partial<A11yState>) { state = { ...state, ...patch }; syncBodyClasses(); listeners.forEach(l => l()); },
  fixAll() { this.set({ fixErrors: true, fixAlerts: true, fixManual: true }); },
  resetAll() { this.set(initial); },
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
};
// syncBodyClasses toggles .a11y-fix-errors / .a11y-fix-alerts / .a11y-fix-manual on <body>
export const useA11yState = () => useSyncExternalStore(a11yStore.subscribe, a11yStore.get, () => initial);
```

- The server snapshot is always `initial`. That guarantees prerendered HTML is defective and hydration matches it.
- **Never** use localStorage, sessionStorage, cookies, or URL parameters for toggle state. Plan 09 adds a lint rule and a test that ban these.
- Optional developer convenience: an explicit `?a11y=errors,alerts` query applies toggles once on load, for scripted before/after scans. It isn't persisted and a reload without it returns to defective. **This needs a decision** because it bends the PRD's "reload resets" rule. Leave it off by default.

## 2. Registry (`src/a11y/registry/`)

One file per site area (`global.ts`, `admissions.ts`, `academics.ts`, ...) exports scenario definitions. `index.ts` merges them and checks that IDs are unique.

```ts
export interface Scenario {
  id: string;                    // "courses-keyword-label-001"
  category: Category;            // which toggle fixes it
  rule: RuleKey;                 // taxonomy key, e.g. "missing-form-label"
  title: string;                 // short human name
  description: string;           // what is wrong, in plain words
  fixDescription: string;        // what the fix does
  pages: string[];               // route paths (or patterns like "/news/:slug")
  component: string;             // "CourseSearchForm"
  wcag: string[];                // ["1.3.1", "3.3.2", "4.1.2"]
  detectedBy: {                  // expected tool behavior (best effort)
    wave?: string[];             // e.g. ["label_missing"]
    axe?: string[];              // e.g. ["label"]
    manualOnly?: boolean;
  };
  mechanism: "markup" | "css" | "behavior" | "document";
  severity?: "minor" | "moderate" | "serious" | "critical";
}
```

`src/a11y/rules.ts` holds the **rule taxonomy**. It maps each `RuleKey` to its category, default WCAG criteria, and expected WAVE and axe identifiers. Plan 07 lists every rule key.

## 3. Component primitives

```tsx
// The one hook every defective component uses:
const fixed = useScenario("courses-keyword-label-001");   // boolean; also registers mount
```

`useScenario(id)`:

- Looks up the scenario, reads the toggle for its category, and returns `true` when fixed.
- Registers the mounted instance in a page-level `ScenarioTracker` (a context store with ref counts) so the control can count what's active on this page.
- In development, throws if the ID isn't in the registry.

Helpers for common patterns keep the defect variants readable:

| Helper | Use |
|---|---|
| `<Img scenario="..." src alt fixedAlt />` | Missing, empty, suspicious, or overlong alt text and `title` attributes |
| `<Field scenario="..." label placeholderOnly />` | Missing labels, placeholder-as-label, orphaned labels |
| `<IconButton scenario="..." icon label />` | Empty buttons and icon-only controls |
| `<SmartLink scenario="..." generic="Read more" fixed="Read more about the 2026 Research Symposium" />` | Generic, redundant, new-window, and document links |
| `<Heading scenario="..." level fixedLevel />` | Skipped levels, empty headings, fake headings |
| `useScenarioClass(id, "bad-class", "good-class")` | CSS-driven defects |
| `ScenarioMarker` attribute `data-a11y-scenario="<id>"` | Put on the root element of each instance, for tests, the lab, and highlighting |

**Document-level scenarios** use an effect in `root.tsx`:

- `global-html-lang-001`: `<html>` is prerendered without `lang`. When Fix Errors is ON, the effect sets `lang="en"`, and turning it OFF removes it.
- `*-page-title-*`: chosen routes return an empty `<title>` from `meta()`. When Fix Errors is ON, the effect sets the real title.

**CSS-driven scenarios** (contrast, focus outline, reflow, small text, underline) put the defective CSS in the section stylesheet. The fix lives in `styles/fixes/*.css` under the matching body class:

```css
/* styles/sections/academics.css */
.dept-sidebar a { color: #8a9aa6; }                 /* 2.6:1 on white — defect */
/* styles/fixes/manual.css */
.a11y-fix-manual .dept-sidebar a { color: #3d4f5c; } /* 7.9:1 */
```

Even for these, the component still calls `useScenario(id)` so the instance is registered and counted.

**Behavior-driven scenarios** (keyboard, focus, live regions, motion) switch implementations:

```tsx
const fixed = useScenario("nav-megamenu-hover-001");
return fixed ? <DisclosureMegaMenu items={items}/> : <HoverMegaMenu items={items}/>;
```

## 4. Floating control (`src/a11y/A11yControl.tsx`)

- It's a fixed panel in the bottom-right corner that can collapse to a pill. Put it in `<aside aria-label="Accessibility Test Controls">`, rendered after `<main>` in DOM order.
- It has three real switches (`<button role="switch" aria-checked>`) plus **Fix All** and **Reset All**, and a link to `/accessibility-lab`.
- It shows live per-page counts, for example `Errors: 12 active / 12 on page`, which come from the tracker filtered by toggle state.
- A polite live region announces changes such as "Fix Errors on. 12 errors corrected on this page."
- It must itself be **fully accessible**. Its styles are isolated with a `.a11y-control` scope and aren't affected by any section CSS or fix classes. It's excluded from counts.
- A keyboard shortcut (Alt+Shift+A) moves focus to the panel.

## 5. Developer ergonomics

`docs/plans/`, and later `ACCESSIBILITY_TESTING.md`, document a four-step recipe for adding a scenario:

1. Add an entry to the right registry file.
2. Call `useScenario(id)` in the component, or use a helper.
3. Write the defective and fixed branches, plus any CSS fix.
4. Add the page to `pages`. The coverage test (plan 09) then checks that it actually renders there.

## Tasks

1. Build `state.ts`, the body-class sync, and `useA11yState`.
2. Build `rules.ts` (the taxonomy skeleton; plan 07 fills it in) and the registry loader with an ID-uniqueness check.
3. Build `useScenario`, `ScenarioTracker`, and the helper components.
4. Build the document-level effects for `lang` and titles.
5. Build `A11yControl` with counts and announcements.
6. Seed about 10 example scenarios, at least three per category and one per mechanism, on the homepage. They prove the system end to end.
7. Write unit and component tests for the store, hook, helpers, and control (plan 09).

## Acceptance criteria

- With toggles OFF, the homepage DOM contains the 10 seeded defects. Each toggle fixes only its own category, and turning it OFF restores the defects.
- Client-side navigation keeps toggle state. A hard reload returns everything to OFF.
- Counts update live and are correct per page.
- Neither axe nor WAVE reports issues on the control itself.
