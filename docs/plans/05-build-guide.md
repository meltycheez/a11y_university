# Plan 05 build guide (how to add a page)

Read first: [00-overview.md](00-overview.md) (guiding rules), [05-site-sections.md](05-site-sections.md) (routes, templates, tiers), [07-scenario-coverage.md](07-scenario-coverage.md) (rule catalog and distribution), [../DECISIONS.md](../DECISIONS.md) (especially ADR-010, 016–018, 021, 023–025) and [../WORLD.md](../WORLD.md) (every name must be fictional).

## Where things go

| Thing | Location |
|---|---|
| Page for `/a/b` | `src/pages/a/b.tsx`, or `src/pages/a/b/index.tsx` when `/a/b` has children. `:slug` routes: `src/pages/a/$slug.tsx`. `routes.ts` picks the file up automatically (ADR-023). Never edit `inventory.ts`. |
| Page title | `export { inventoryMeta as meta } from "~/routes/meta";` |
| Page-local components | Next to the page, e.g. `src/pages/academics/_DepartmentTemplate.tsx` (a leading `_` keeps it from looking like a route). |
| Scenarios | The area's registry file in `src/a11y/registry/` (already imported by `index.ts`). |
| CSS | The section stylesheet in `src/styles/sections/`, with the defect and its `.a11y-fix-*` override side by side (ADR-025). Scope selectors to your page or section. |

## Building blocks

- Layout, chrome, breadcrumbs: already done by `UniversityLayout` (don't edit).
- `~/components`: `Hero`, `Card`/`CardGrid`, `Img` (responsive, `scenario`/`fixedAlt` props), `Tabs`, `Accordion`, `Modal`, `DataTable`, `Pagination`, `Callout`, `Button`/`ButtonLink`.
- `~/components/blocks`: `ContentSection` (renders `pageContent` sections), `StatsBand`, `Quote`, `Gallery`, `VideoEmbed` (`titleScenario` → iframe-missing-title), `RelatedLinks`, `ContactCard`, `CtaBand`, `AnyLink`.
- `~/a11y/helpers`: `SmartLink` (generic / new-window / document / redundant-title links), `IconButton` (empty button), `Field` (missing / placeholder / orphaned / for-mismatch label), `Heading` (skipped / fake / empty heading).
- `useScenario(id)` from `~/a11y/useScenario` for anything else: it returns `true` when fixed and registers the instance for the counts.
- Content: `~/data/content/*` (`pageContent`, `newsContent`, `eventsContent`, `facultyProfiles`, `leadershipBios`, `collegeContent`, `departmentContent`, `programContent`), `~/data/catalog`, `~/data/site` (`SITE_NOW`). Generated datasets in `src/data/generated/*.json`: for the big ones (courses, directory, athletics, portal) read them in a route `loader` and use `useLoaderData`, so they don't bloat every page's bundle.
- Images: ids in `src/data/images.json` (`news-<slug>`, `event-<slug>`, `faculty-<slug>`, `leader-<slug>`, `athlete-<slug>`, `college-<slug>`, `dept-<slug>`, section heroes, `campus-*`). `Img` shows a placeholder for the few not generated yet.

## Every template

- Uses **at least two optional blocks**, chosen by the page's data, so pages built on one template still differ.
- Looks like its section's era (see the section themes in plan 01): the academics CMS is older and denser than admissions marketing, and so on.
- Renders real content from the data files. No Lorem Ipsum, no invented facts that contradict the content files or WORLD.md.

## Defects (ADR-024)

Write each page's own defects while building it:

1. Pick realistic defects from the plan 07 rule catalog (`src/a11y/rules.ts` has every key). Nothing corrupt or contrived: each one should look like something a real campus team shipped.
2. Budget per page, on top of global chrome (which plan 07 handles): tier **A** 0, **L** 0–2, **M** 3–8, **H** 8–15. The tier is in `inventory.ts`. Mix categories (errors, alerts, manual) and mechanisms (markup, CSS, behavior).
3. Register each one: `id` like `<area>-<page>-<what>-001` (unique), `rule`, `title`, `description` (what's wrong, plainly), `fixDescription`, `pages` (exact paths or the pattern, e.g. `/news/:slug`), `component`, `mechanism`, `severity`. Look at `src/a11y/registry/home.ts` for the format.
4. Implement both states: the defective markup is the default (and what prerenders); the fixed markup appears when the category toggle is ON. Toggles must change the real DOM or CSS, never hide scanner output. Put `data-a11y-scenario="<id>"` on each instance's root (the helpers do this for you).
5. Template-level defects (the same defect on every page of a template) are fine and realistic: register once with the pattern in `pages`.
6. Out of scope here: defect variants of shared widgets (tabs, accordion, modal, dropdown, date picker), interactive features (plan 06), global chrome defects, and the six terrible pages (plan 07). For routes owned by plan 06/07, build a static, content-complete page if your section needs it, and say so in your report.

## Checks before you finish

- `npx react-router typegen && npx tsc --noEmit` passes (ignore errors in files you don't own, but report them).
- `npx vitest run` passes.
- Don't run `npm run build` (other people build in the same tree); the lead builds and checks every route.
- Every scenario you registered is actually rendered by the pages listed in its `pages`.

## Plan 06 additions (interactive features)

Read [06-interactive-features.md](06-interactive-features.md) for your feature, and plan 07's "six terrible pages" table if your route is one of them.

**Widgets with defect variants** (pass `scenario` + `defect`; with no scenario, or once fixed, you get the accessible version):

| Widget | Import | `defect` values → rule |
|---|---|---|
| `Tabs` | `~/components/Tabs` | `broken-keys` → kbd-tabs-wrong-keys · `no-roles` → sr-visual-only-state · `bad-children` → aria-required-children |
| `Accordion` | `~/components/Accordion` | `no-state` → sr-accordion-state · `div-trigger` → kbd-div-button |
| `Modal` | `~/components/Modal` | `no-trap` → kbd-focus-trap-bad · `no-restore` → focus-not-restored · `no-semantics` → sr-modal-no-context |
| `Dropdown` | `~/components/widgets` | `mouse-only` → kbd-dropdown-inoperable (fixed = labeled native `<select>`) |
| `DatePicker` | `~/components/widgets` | `mouse-only-grid` → kbd-div-button (fixed = labeled native date input) |
| `Toast` | `~/components/widgets` | `vanishes` → sr-status-not-announced (fixed = persistent `role="status"`) |

A widget scenario is still registered by you (in your registry file) with the matching rule. Different pages may use different variants of the same widget.

**Helpers** (`~/lib/interactive`): `latency(key)` (fake 300–800 ms delay, fixed per key), `confirmationCode(seed)` (deterministic), `hash(s)`, and `createStore(initial)` for state that must survive client-side navigation but reset on reload (`store.use()` in components). No localStorage, sessionStorage, cookies, IndexedDB or URL-persisted state, ever.

**Rules for interactive pages**

- The first render must equal the prerendered HTML: derive nothing from the clock or `window` during render (use `SITE_NOW`), and read `?query` params in an effect (ADR-015).
- Every scenario must be **registered at page load**: call `useScenario(id)` in a component that is mounted on load (the form or widget root), and put its `data-a11y-scenario` marker on an element present in the prerendered HTML, even when the defect only shows after interaction (an error message, an opened modal). `npm run check:scenarios` fails otherwise.
- Defective behavior must still work with a mouse, exactly like a real shipped site (plan 06 acceptance). The fixed version must be fully operable by keyboard and screen reader (WAI-ARIA APG patterns).
- Motion: anything animated gets a `prefers-reduced-motion` story (the fixed state respects it).
- Budgets: tier **T** pages (legacy aid form, registration, donate, campus map) carry 30+ scenarios, including the signature defects in plan 07; other plan 06 pages follow their tier.
