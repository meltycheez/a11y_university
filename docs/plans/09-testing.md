# Plan 09 — Testing

## Goal

Prove the defect system works. Every representative scenario must:

1. Be defective when its toggle is OFF.
2. Be fixed when its toggle is ON.
3. Return to defective when the toggle goes OFF again.
4. Reset to defective on reload.

These tests do **not** assert that the site is accessible by default.

## Layers

### 1. Unit (Vitest)
- `a11yStore`: defaults, `set`, `fixAll`, `resetAll`, body-class sync, and listener notification.
- Registry integrity: unique IDs, a valid category, a valid rule key, a valid WCAG format, every `pages` entry exists in `inventory.ts`, and every rule key has at least one scenario.
- Coverage matrix: each area has at least 3 scenarios (plan 07).
- Determinism: running the data generator twice gives identical output. The search index contains the expected "computer science" results.

### 2. Component (Vitest + Testing Library + jsdom)
Run a table-driven test over representative helpers and widgets:

```ts
it.each(cases)("%s: OFF defective → ON fixed → OFF defective", async ({ render, category, assertDefective, assertFixed }) => {
  const view = render();
  assertDefective(view);
  act(() => a11yStore.set({ [flag(category)]: true }));
  assertFixed(view);
  act(() => a11yStore.set({ [flag(category)]: false }));
  assertDefective(view);
});
```

Cases: `Img` (alt), `Field` (label), `IconButton` (name), `SmartLink` (text), `Heading` (level), Tabs (keyboard with `user-event`), Modal (focus trap and restore), MegaMenu (keyboard open), live-region announcer, and the carousel pause button.

### 3. End-to-end (Playwright against `npm run build && npx serve build/client`)
- **Route smoke:** every inventory path returns 200, renders `<main>`, and has no console errors.
- **Scenario presence:** for every scenario, visit its page and assert `[data-a11y-scenario="<id>"]` exists. This catches registry drift. Document-level scenarios use custom checks.
- **Toggle diff with axe:** on about 15 representative pages, including all six terrible pages:
  - OFF: axe violations include every expected axe rule for that page's registered error scenarios.
  - Fix Errors ON: those violations are gone for the targeted nodes.
  - OFF again: they return.
  - Reload: they're present again, and the control shows every switch unchecked.
- **Behavior checks for manual scenarios:**
  - Hover menu: pressing Enter on the trigger doesn't open it when OFF, and does when ON.
  - Modal focus restore, positive tabindex order, and the pause control on the carousel.
  - A computed-style contrast check on a sample of tokens.
  - Reflow: at a 320px viewport (the 200% zoom equivalent), check `scrollWidth > clientWidth` on the defective component when OFF and not when ON.
- **Reset on reload:** add a course, advance the application, register for an event, acknowledge a portal alert, set filters and search, reload, and assert all of it is back to its initial state.
- **No persistence:** after interactions, `localStorage.length === 0`, `sessionStorage.length === 0`, no cookies are set, and there are no IndexedDB databases.
- **Lab:** axe finds no violations on `/accessibility-lab`, and its table row count equals the registry size.

### 4. Static checks
- ESLint `no-restricted-globals` / `no-restricted-properties` for `localStorage`, `sessionStorage`, `indexedDB`, and `document.cookie`.
- A rule banning `Math.random` and `Date.now` in `src/` except in an allowlisted fake-latency utility.

## CI (GitHub Actions or similar)

`npm ci` → `lint` → `test` → `build` → `test:e2e` (Chromium). Upload the Playwright report and an axe summary JSON artifact for each run. That artifact is the before and after benchmark baseline.

## Acceptance criteria

- All layers pass in CI.
- Removing a scenario's defective branch, or leaving an unregistered defect, fails at least one test.
