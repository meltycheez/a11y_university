# Decision Register (ADRs)

Decisions answered during development. Up-front stack choices live in [plans/00-overview.md](plans/00-overview.md#key-decisions).
Add new entries at the bottom; never renumber. To reverse a decision, add a new entry that supersedes it.

| # | Date | Decision | Status | Plan |
|---|------|----------|--------|------|
| [001](#adr-001) | 2026-09-24 | React Router v8.4, Vite 8, React 19.3, TypeScript 5.9 | Accepted | 01 |
| [002](#adr-002) | 2026-09-24 | Normalize trailing slashes with `usePathname()` | Accepted | 01 |
| [003](#adr-003) | 2026-09-24 | One `UniversityLayout` driven by `sections.ts`, not a file per section | Accepted | 01 |
| [004](#adr-004) | 2026-09-24 | Accessibility Lab uses its own chrome and always sets `lang` | Accepted | 01, 02 |
| [005](#adr-005) | 2026-09-24 | No `?a11y=` query-string toggles | Accepted (default) | 02 |
| [006](#adr-006) | 2026-09-24 | Scenarios inherit category, WCAG and detections from their rule | Accepted | 02 |
| [007](#adr-007) | 2026-09-24 | Control counts unique scenarios on the page, not instances | Accepted | 02 |
| [008](#adr-008) | 2026-09-24 | Page-title scenarios render a React 19 `<title>`, not `document.title` | Accepted | 02 |
| [009](#adr-009) | 2026-09-24 | Mount tracker is a module store, not React context | Accepted | 02 |
| [010](#adr-010) | 2026-09-24 | Build helpers only when a scenario needs them | Accepted | 02 |
| [011](#adr-011) | 2026-09-24 | People, stories and events are fixed in `catalog.ts` before content and images | Accepted | 03, 04 |
| [012](#adr-012) | 2026-09-24 | Content types live with content files; generated types in `types.ts` | Accepted | 03 |
| [013](#adr-013) | 2026-09-24 | Scripts are plain `.ts` run by Node 24, no tsx | Accepted | 03 |
| [014](#adr-014) | 2026-09-24 | One PRNG stream per generated dataset | Accepted | 03 |
| [015](#adr-015) | 2026-09-24 | Search index rebuilt every build; `/search` reads `?q=` after hydration | Accepted | 03 |
| [016](#adr-016) | 2026-09-24 | Stub pages render `pageContent` until plan 05 templates exist | Accepted | 03 |
| [017](#adr-017) | 2026-09-24 | Image ids are `<group>-<slug>`; an image is "generated" when its raw file exists | Accepted | 04 |
| [018](#adr-018) | 2026-09-24 | Manifest alt flows into `image-sizes.json` and is `Img`'s default fixed alt | Accepted | 04 |
| [019](#adr-019) | 2026-09-24 | No 2K upscales or JPEG fallbacks | Accepted | 04 |
| [020](#adr-020) | 2026-09-24 | Brand marks are React SVG components in `Logo.tsx` | Accepted | 04 |
| [021](#adr-021) | 2026-09-24 | Everything named is fictional; `docs/WORLD.md` is the gazetteer | Accepted | 03, 04 |
| [022](#adr-022) | 2026-09-25 | Flow images are taken from the agent chat as `=s0` originals by a standalone runner | Accepted | 04 |
| [023](#adr-023) | 2026-09-25 | Route modules follow a file convention; no inventory edits per page | Accepted | 05 |
| [024](#adr-024) | 2026-09-25 | Plan 05 builds page-level defects with the pages; widgets, chrome and terrible pages wait | Accepted | 05, 06, 07 |
| [025](#adr-025) | 2026-09-25 | Section CSS fixes are colocated in the section stylesheet | Accepted | 05 |
| [026](#adr-026) | 2026-09-25 | `npm run build` retries the React Router build once | Accepted | 01 |
| [027](#adr-027) | 2026-09-25 | Big generated datasets are read in route loaders, sliced per page | Accepted | 05 |
| [028](#adr-028) | 2026-09-25 | A scenario lists a `:slug` pattern only when every instance has it | Accepted | 05 |
| [029](#adr-029) | 2026-09-25 | Section defects in layout chrome are scoped with `:has()` on a page root | Accepted | 05 |
| [030](#adr-030) | 2026-09-25 | Device-dependent handler scenarios are manual-only under React | Accepted | 05, 07 |
| [031](#adr-031) | 2026-09-25 | `link-javascript` defects use `href="#"` plus a click handler | Accepted | 05, 07 |
| [032](#adr-032) | 2026-09-25 | Widget defect variants are props on the shared widgets | Accepted | 06 |
| [033](#adr-033) | 2026-09-25 | Interaction-only defects carry their marker on an always-rendered container | Accepted | 06 |
| [034](#adr-034) | 2026-09-25 | Session timeouts are short, page-load based and restart on toggle | Accepted | 06 |
| [035](#adr-035) | 2026-09-25 | Scanner-visible inline handlers are added through refs where detection matters | Accepted | 06 |
| [036](#adr-036) | 2026-09-25 | Header suggestions are matching pages, not completed phrases | Accepted | 06 |
| [037](#adr-037) | 2026-09-25 | `useFixes` promoted to `~/a11y/useFixes.ts`, with a bare `id(key)` accessor | Accepted | 07 |
| [038](#adr-038) | 2026-09-25 | Terrible-page hover-only menus reveal by plain CSS `:hover`, no `:focus-within` | Accepted | 07 |
| [039](#adr-039) | 2026-09-25 | "Sticky header covers a focused row" is registered under `focus-indicator-missing` | Accepted | 07 |
| [040](#adr-040) | 2026-09-25 | Lab specimen ids get a `-<page>-lab` suffix; a shared `<Specimen>` wrapper sources all copy from the registry | Accepted | 08 |
| [041](#adr-041) | 2026-09-25 | Document-mechanism lab specimens are static code samples, not live toggles | Accepted | 08 |
| [042](#adr-042) | 2026-09-25 | No new rule keys for the ARIA page's "misused roles" / "live regions" topics | Accepted | 08 |
| [043](#adr-043) | 2026-09-25 | Lab index category filter and grouped tabs are one hand-rolled tablist, not the shared `Tabs` widget | Accepted | 08 |
| [044](#adr-044) | 2026-09-26 | ESLint: `typescript-eslint`'s bare parser config plus `eslint-plugin-react-hooks`; no custom rule plugin | Accepted | 09 |
| [045](#adr-045) | 2026-09-26 | Playwright serves the build on its own port (4319), separate from `npm run preview`'s 4173 | Accepted | 09 |
| [046](#adr-046) | 2026-09-26 | `check:scenarios` and `coverage` scripts double as plan 09's registry-integrity and scenario-presence layers | Accepted | 09 |
| [047](#adr-047) | 2026-09-26 | `duplicate-id` scenarios are WAVE/manual-only; a schedule-legend defect used the wrong element | Accepted | 07, 09 |
| [048](#adr-048) | 2026-09-26 | React Router's own `sessionStorage` scroll-restoration key is excepted from the no-persistence check | Accepted | 02, 09 |
| [049](#adr-049) | 2026-09-27 | `docs/SITE_MAP.md` generation reuses `coverage.ts`'s page-expansion logic, chained into `npm run build` | Accepted | 10 |
| [050](#adr-050) | 2026-09-27 | `npm run scan` is a manual spot-check CLI, not a CI check; `toggle-axe.spec.ts` stays the source of truth | Accepted | 10 |
| [051](#adr-051) | 2026-09-27 | GitHub Pages deploy is its own workflow, gated on push to `main` or manual dispatch | Accepted | 10 |
| [052](#adr-052) | 2026-09-27 | WAVE's completion-gate pass is left as a human checklist; `npm run scan` supplies the automated axe evidence | Accepted | 10 |
| [053](#adr-053) | 2026-09-28 | Three unregistered chrome/content bugs found via a real WAVE pass on `/` are fixed directly, not turned into scenarios | Accepted | 10 |
| [054](#adr-054) | 2026-09-28 | A second WAVE pass on `/library` found the same two bug classes again; `Hero`'s overlay gets a solid backdrop instead of a top-faded gradient | Accepted | 10 |
| [055](#adr-055) | 2026-09-28 | 13 new home-page Error scenarios added at the user's request, reusing existing rule keys; a "Key Dates" table and a newsletter signup host most of them | Accepted | — |
| [056](#adr-056) | 2026-09-28 | `contrast-text-low`/`contrast-ui-low` moved from Manual to Errors (WAVE treats them as errors); all 49 instances retuned to just-barely-pass AA; several unrelated pre-existing bugs found and fixed along the way | Accepted | — |
| [057](#adr-057) | 2026-09-28 | Home-page Errors retargeted at WAVE's own error checks; table headers are empty `<th>`s with CSS-drawn text | Accepted | — |
| [058](#adr-058) | 2026-09-28 | Site-wide sweep: no text fails contrast with Fix All on; four chrome bugs fixed, retuned fixes rechecked against their real backgrounds | Accepted | — |

---

### ADR-001
**React Router v8.4, Vite 8, React 19.3, TypeScript 5.9.** Current versions at build time. TypeScript 7 was skipped because the toolchain didn't support it yet. React Router's CLI installs `isbot` for its default server entry; it sits in `dependencies` but is only used at build time.

### ADR-002
**Normalize trailing slashes with `usePathname()`.** Prerender requests `/path/`; browsers and hosts may load `/path`. In production React does not patch attribute mismatches during hydration, so anything rendered from the pathname (for example `aria-current`) must use `src/routes/usePathname.ts`, and nav links use `NavItem` rather than `NavLink`.

### ADR-003
**One layout driven by `layouts/sections.ts`.** Section chrome differs by data (variant, site name, links), so one `UniversityLayout` with CSS variants replaces nine near-identical layout files. The portal and the lab get their own shells.

### ADR-004
**The Accessibility Lab is infrastructure.** It has its own minimal chrome, so global chrome defects never appear there. `root.tsx` renders `<html lang="en">` on `/accessibility-lab*`; the `global-html-lang-001` scenario (`HtmlLang`) is mounted only on university pages.

### ADR-005
**No `?a11y=` query-string toggles.** Plan 02 left this open. It bends the PRD's "reload resets everything" rule and nothing needs it yet; Playwright can click the switches. Revisit if scripted before/after scans with external scanners need it.

### ADR-006
**Scenarios inherit from their rule.** A registry entry names a `rule`; category, WCAG criteria and expected WAVE/axe IDs come from `rules.ts` unless the entry overrides `wcag` or `detectedBy`. There's no per-scenario category override, so a scenario can't drift from its rule's toggle.

### ADR-007
**Counts are unique scenarios mounted on the page.** Seven card images sharing one alt-text scenario count as one. This matches the registry and lab inventory. Scanner totals will be higher than the control's counts, because scanners count instances.

### ADR-008
**Page-title scenarios render `<title>` from a component.** Setting `document.title` would replace the text node React owns and leave stale titles after navigation. `ScenarioTitle` renders an empty or real `<title>`, React 19 hoists it into `<head>`, and it prerenders correctly. Routes using it return no title from `meta()`.

### ADR-009
**Mount tracker is a module-level store.** `useScenario` registers mounts with ref counts in `useScenario.ts`, read with `useSyncExternalStore`. Route changes mount and unmount page scenarios, so the set is always the current page. No context provider is needed.

### ADR-010
**Helpers on demand.** Plan 02 listed `Field`, `IconButton`, `SmartLink`, `Heading` and `useScenarioClass` helpers. Only `Img` (`scenario` and `fixedAlt` props) is built, because it's the only one the seed scenarios repeat. The others get built when plans 05–07 first need them. CSS scenarios use the body-class fix layers in `styles/fixes/*.css` and just call `useScenario(id)` to register.

### ADR-011
**Shared slugs first.** Leadership (6), profiled faculty (30), news (15), events (10) and athletes (8) are fixed in `src/data/catalog.ts` so the content writers, the data generator and the image manifest can work in parallel and still agree. Entries are never renamed or removed; extra fields live in the content files.

### ADR-012
**Content types live with content.** Hand-written copy in `src/data/content/*.ts` exports its own interfaces next to the data (`pageContent`, `newsContent`, `eventsContent`, `facultyProfiles`, `leadershipBios`, `collegeContent`, `departmentContent`, `programContent`). `src/data/types.ts` covers only generated datasets. Content files merge catalog names and titles by slug so they can't drift.

### ADR-013
**Node 24 runs the `.ts` scripts directly.** `generate-data.ts`, `make-documents.ts` and `build-search-index.ts` use Node's type stripping plus a small inline `registerHooks` resolver for the app's extensionless imports. No tsx dependency.

### ADR-014
**One PRNG stream per dataset.** mulberry32 with `SEED = 20260924` plus a per-dataset offset, so changing one dataset's generator doesn't reshuffle the others' committed JSON. `SITE_NOW = 2026-10-05` (`src/data/site.ts`) is the only "today".

### ADR-015
**Search index is a build artifact.** `npm run build` regenerates `public/search-index.json` (one entry per line for readable diffs) from the inventory, generated data and content. MiniSearch loads lazily in its own chunk. `/search` reads `?q=` in an effect, never during render, so prerendered HTML matches the first client render (same reason as ADR-002). Course results link to `/academics/courses?q=…`, which plan 06 must honor.

### ADR-016
**Stub pages show real copy.** `StubPage` renders `pageContent` generically (headings, paragraphs, lists, tables, links) so copy is reviewable now. Plan 05 replaces it with per-section templates.

### ADR-017
**Image ids and resumability.** Ids follow `<group>-<slug>` (`news-<slug>`, `event-<slug>`, `faculty-<slug>`, `leader-<slug>`, `athlete-<slug>`, `college-<slug>`, `dept-<slug>`), so templates find images by convention. There's no `generated` flag: `scripts/flow/next-batch.mjs` treats an entry as done when `assets-src/flow/<id>.jpeg` exists.

### ADR-018
**Alt text has one source.** `src/data/images.json` holds each image's good `alt`. The optimizer copies it into `src/data/image-sizes.json` (already bundled), so the prompts stay out of the client bundle. `<Img scenario>` uses it as the fixed alt unless `fixedAlt` overrides. Defective alt values (missing, file names, overlong) are passed by the scenario at the call site, not stored in the manifest.

### ADR-019
**No 2K upscales or JPEG fallbacks.** Flow's 1K originals (1376 px wide for 16:9) are the largest size. WebP works in every supported browser, and the budget (40 MB) stays comfortable. Revisit if heroes look soft on wide screens.

### ADR-020
**Brand marks are components.** `LogoMark`, `Wordmark`, `Seal` and `AthleticsMark` live in `src/components/Logo.tsx` rather than `src/assets/brand/` files, so they share one accessibility pattern (decorative unless given a `title`) and the brand color tokens.

### ADR-021
**Everything named is fictional.** The user asked for no real places, institutions, organizations, companies, products, journals, tribal nations or people. `docs/WORLD.md` is the gazetteer: every writer uses (and extends) it. Allowed real references are limited to the US/California setting, the 707 area code with 555 numbers, and generic laws, public programs and standards (FAFSA, Pell, Cal Grant, Title IX, FERPA, ADA/504, WCAG, citation styles), plus real authors and historical subjects as course material. Consequences: the ZIP is 95579 (checked as unassigned), VP Thomas Redcloud became Thomas Harlan (slug `thomas-harlan`; ADR-011's no-rename rule yields to this), the footer uses fictional social networks with generic icons, and generated building names follow the content's canonical building list.

### ADR-022
**Standalone Flow runner, chat-based capture.** Flow's Download menu crashes Chrome (under the MCP and plain Playwright alike), and mid-run Flow's agent began filing images into collections while tile URLs switched to WebP thumbnails, which broke top-of-grid detection. `scripts/flow/run-flow.mjs` drives the MCP's signed-in Chrome profile directly, starts a fresh agent session per batch, tells the agent not to use collections, takes each new image from the agent chat (`img[alt^="Option"]`), and fetches the original JPEG by rewriting the URL suffix to `=s0`. Guards delete byte-identical duplicates and wrong-aspect results so they regenerate, and the run stops cleanly on Flow's usage limit. A visual contact-sheet review is still required: one near-duplicate (a re-sent earlier image) passed both guards.

### ADR-023
**Route file convention.** `src/routes.ts` maps each inventory route without an explicit module to `src/pages/<path>.tsx` or `src/pages/<path>/index.tsx`, with `:slug` written `$slug` (`/news/:slug` → `pages/news/$slug.tsx`). Until the file exists the route renders `StubPage`. Pages use `export { inventoryMeta as meta } from "~/routes/meta"` for titles. This lets several people (or agents) add pages in parallel without touching `inventory.ts`.

### ADR-024
**Scope split for pages.** Plan 05 builds every page's content, templates and blocks, and adds that page's own defects as it's built (guiding rule: defects are written with the page), registered in the area's registry file. It does not build defect variants of shared widgets (tabs, accordion, modal, dropdown, date picker: plan 06 #12), interactive features (plan 06), global chrome defects or the six terrible pages (plan 07). Those routes get static, content-complete shells that the later plans replace. `rules.ts` now holds the full plan 07 taxonomy (about 90 keys) with coverage `areas`; the seed scenarios were renamed to those keys.

### ADR-025
**Colocated CSS fixes.** A section's defective CSS and its `.a11y-fix-errors` / `.a11y-fix-alerts` / `.a11y-fix-manual` overrides live together in that section's stylesheet (`src/styles/sections/*.css`), so each section is self-contained. `src/styles/fixes/*.css` is kept for global chrome and the home page.

### ADR-026
**Build retries once.** Prerendering occasionally fails on Windows with "Prerender: Request failed for /<path>/:" and an empty message: the request to React Router's local preview server drops. React Router's prerender runner has `retryCount`/`retryDelay`, but only `concurrency` is passed through from `react-router.config.ts`, so the `build` script runs `react-router build` a second time if the first fails. Remove this when the underlying drop is fixed upstream or traced.

### ADR-027
**Loaders for big data.** Pages that use `courses.json`, `directory.json`, `athletics.json` or `portal.json` read them in a route `loader` (run at build time during prerender) and return only the slice the page needs, so the full datasets never reach the client bundle.

### ADR-028
**Scenario page lists match reality.** A template-level scenario uses the `:slug` pattern in `pages` only when every instance renders it. Data-dependent defects (a PDF link in only some articles, a video on only some team pages) list exact paths, often generated from an exported per-instance map in the registry file so the page and the registry share one source. `npm run check:scenarios` enforces this after every build.

### ADR-029
**Chrome-level section defects without layout edits.** When a section's defect lives in layout chrome (the academics sidebar's low contrast), the section CSS scopes it with `:has(.page-root-class)` from a page-level wrapper that also carries the marker, so only the pages that register it get it.

### ADR-030
**React hides device-dependent handlers.** React attaches events by delegation, so a hover-only control has no `onmouseover` attribute for WAVE's `event_handler` alert to find. Such scenarios keep the `event-handler-device` rule but set `detectedBy: { manualOnly: true }`. Plan 07 may add a real inline `onmouseover` attribute (set through a ref) where scanner detection matters.

### ADR-031
**`javascript:` links.** React 19 blocks `javascript:` URLs, so `link-javascript` scenarios use `href="#"` with a click handler. WAVE reports `#` links under the same family; plan 09 confirms the detection.

### ADR-032
**Widget variants as props, not parallel files.** Plan 06 sketched `widgets/Tabs/TabsFixed.tsx`, `TabsBrokenKeyboard.tsx` and so on. Instead each shared widget takes `scenario` and `defect` props and switches markup internally: `Tabs` (broken-keys, no-roles, bad-children), `Accordion` (no-state, div-trigger), `Modal` (no-trap, no-restore, no-semantics), and new `Dropdown`, `DatePicker` and `Toast` in `components/widgets.tsx`. Existing callers keep the accessible version unchanged. Fixed versions follow the APG patterns, and prefer native elements where they are the accessible choice (`<select>`, `<input type="date">`, `<dialog>`). Interactive state uses `createStore` from `~/lib/interactive` (module memory, reset on reload), and fake latency is fixed per action key so runs stay reproducible.

### ADR-033
**Markers exist at load.** Defects that only appear after interaction (later form steps, error messages, opened modals, table views) register at page load, and their `data-a11y-scenario` marker sits on a container that is always rendered (the form, results list or widget root). The `Modal` `no-semantics` variant renders a hidden backdrop while closed for the same reason. This keeps on-page counts honest and lets `check:scenarios` verify every scenario from prerendered HTML.

### ADR-034
**Timeouts you can observe.** Session-timeout scenarios run from page load, not from last activity, and are short enough to watch in a test session: donate warns at 3:00 and clears at 4:00 once fixed (silently clears at 4:00 while defective); the legacy aid form uses 4:00 / 5:00. Turning the toggle on or off restarts the clock. Timers are cleared on unmount.

### ADR-035
**Inline handlers for scanners.** Where WAVE's `event_handler` detection matters (the legacy aid form's hover menu), real `onmouseover`/`onmouseout` attributes are set through a ref after hydration, and the scenario keeps the rule's default detection. Elsewhere hover-only scenarios stay `manualOnly` per ADR-030.

### ADR-036
**Search suggestions.** The header combobox suggests up to six matching pages and opens them directly; "Did you mean" on `/search` corrects each unmatched word with MiniSearch fuzzy matching. MiniSearch's own term suggestions produced unnatural phrases. Typing two characters in the header loads the search index (about 350 KB) once per session.

### ADR-037
**`useFixes` is now shared infrastructure.** Plan 06's `admissions/_useFixes.ts` carried a `ponytail:` note to promote it once a fourth page folder needed it; the two remaining terrible pages (`/academics/catalog`, `/athletics/schedule`) did. Moved to `~/a11y/useFixes.ts` unchanged apart from one addition: an exported `id(key)` bare-id accessor alongside `fix`/`mark`, for the shared widgets (`Tabs`, `Accordion`) and `SmartLink` that take a single `scenario` string rather than a marker prop. The three existing importers (apply, donate, legacy aid) were repointed; no behavior changed.

### ADR-038
**Hover-only menus stay keyboard-inoperable by construction.** The catalog's subject jump menu reveals its list with a `:hover`-only CSS rule and no `:focus-within` fallback, so there is no hidden way to reach it from a keyboard — matching the registered `kbd-hover-only-menu` defect rather than merely looking that way. The fixed state swaps the whole trigger for a real disclosure button (`aria-expanded`, click toggle, `hidden` attribute), rather than adding `:focus-within` to the same markup, since a menu that opens on both hover and focus behaves differently enough from the fixed pattern that reusing one CSS rule for both would blur the toggle.

### ADR-039
**No rule names "content covers a focused element."** The athletics composite schedule's sticky table header can visually cover a row a keyboard user just tabbed to. Plan 07's taxonomy has nothing for this (it predates WCAG 2.2's 2.4.11 Focus Not Obscured, which isn't in this project's WCAG 2.1 rule set). Registered under `focus-indicator-missing` (2.4.7) as the closest honest fit: from the user's vantage the indicator is effectively invisible, even though the browser still paints it under the header. Revisit if a future plan adds 2.4.11 to `rules.ts`.

### ADR-040
**Lab specimen ids carry a page suffix; one wrapper sources all copy.** Plan 08 asked for lab specimen ids to end in "-lab" so counts stay unambiguous from the site's own instances. Several rules (`table-header-association`, `input-missing-label`, `fieldset-missing`…) needed their own isolated specimen on more than one lab page, so ids are `<rule-slug>-<page>-lab` (e.g. `table-headers-wrong-tables-lab`) rather than a bare `-lab`, keeping every id globally unique. `pages/accessibility-lab/_Specimen.tsx` renders every specimen's heading, live-markup slot and caption (id, expected detection, live status, fix description) straight from that scenario's registry entry, so the 7 specimen pages hold only live markup, never copy that would drift from the registry.

### ADR-041
**Document-mechanism specimens are code samples.** `html-lang-missing` and `page-title-missing` can't be demonstrated live inside the lab: ADR-004 has the lab always set `<html lang>`, and a page can only carry one real `<title>`. Their lab specimens render a static before/after `<pre><code>` sample instead of a live toggle, with no `data-a11y-scenario` marker, matching how the sitewide `HtmlLang`/`ScenarioTitle` document scenarios already work.

### ADR-042
**No new rule keys for "misused roles" or "live regions."** The ARIA lab page's specimen list (plan 08) named these two topics, but `rules.ts` has no dedicated key for either. Misused roles is folded into the `aria-invalid-attr` specimen's caption as a second sentence rather than a second live element; live regions is covered by the existing `sr-results-no-live-region` rule. Consistent with ADR-039's "closest honest fit" rather than growing the taxonomy for a lab-only demo.

### ADR-043
**Category filter and grouped tabs are one control.** Plan 08 asked for both a category filter and "grouped views… as tabs" on the lab index's scenario table. The shared `Tabs` widget (`components/Tabs.tsx`) has no controlled active-tab API, and simultaneously rendering 4 hidden per-category tables just to reuse it would be the wrong shape for filtered data. The index page hand-rolls a small ARIA tablist instead (mirroring `Tabs`' keyboard handling) whose active tab (All/Errors/Alerts/Manual) doubles as the category filter, feeding one `role="tabpanel"` alongside the area/WCAG/page/text filters.

### ADR-044
**No ESLint rule plugin beyond `react-hooks`.** Plan 09's static checks (no persistence, no `Math.random`/`Date.now` outside the fake-latency helper) are all expressible with core ESLint (`no-restricted-globals`, `no-restricted-properties`), so `eslint.config.js` uses `typescript-eslint`'s `configs.base` (parser only, no opinionated rule set) rather than pulling in `recommended`/`strict`, which would surface unrelated pre-existing findings across ~200 files that no one asked to fix. `eslint-plugin-react-hooks` was added because the codebase already had targeted `// eslint-disable-line react-hooks/exhaustive-deps` comments (from plans 05–06) that referenced a rule no config had ever defined.

### ADR-045
**A dedicated e2e port.** `playwright.config.ts`'s `webServer` runs `npx serve build/client -l 4319`, not `npm run preview` (which defaults to 4173): this machine already has an unrelated long-running process bound to 4173, and `serve` silently falls back to a random port when its requested one is busy, which would have pointed Playwright at the wrong server. 4319 is unused and dedicated to this repo's e2e run.

### ADR-046
**Scenario presence and registry integrity reuse the plan 07/08 scripts.** `scripts/check-scenarios.ts` (every scenario's `data-a11y-scenario` marker present in the prerendered HTML, and vice versa) and `scripts/coverage.ts` (every rule key used, coverage-area minimums) already prove exactly what plan 09's "Registry integrity" and "Scenario presence" bullets ask for, against real build output. `src/a11y/registry/integrity.test.ts` adds the checks those scripts can't make without a build (WCAG format, `pages` entries resolving to real routes, every rule key used — this last one duplicated as a fast Vitest check since `coverage.ts` also enforces per-area minimums, a plan 07 concern). CI runs both scripts as their own steps rather than reimplementing them as Playwright tests.

### ADR-047
**`duplicate-id` has no working axe id; one legend was actually broken.** Diffing real axe-core output against `rules.ts`'s "best effort" ids (plan 09's stated job) found two things: axe-core's generic `duplicate-id` check is disabled by default in the installed version, and `duplicate-id-aria` only fires when the duplicated id is ARIA-referenced, which none of this project's `duplicate-id` scenarios are — so the rule's `axe` field was dropped, leaving it WAVE/manual-only. Separately, `/athletics/schedule`'s defective legend (`ScheduleLegend`) rendered `<span>` items instead of `<li>`, which doesn't just hide it from axe's `listitem` rule — it isn't the "list items outside a list" defect the scenario describes at all. Changed to `<li>` inside the `<div>` (still no `<ul>`/`<ol>` ancestor), matching the fixed branch's `<ul><li>` pattern; no visual change.

### ADR-048
**The framework's own scroll-restoration key is not "persistence."** Plan 09's E2E no-persistence check (`e2e/reset.spec.ts`) found `sessionStorage["react-router-scroll-positions"]` after normal navigation — React Router's built-in scroll-restoration, not app state. It carries no scenario or form data and dies with the tab, which is what plan 02's "reload resets everything" is protecting; it's excepted by name in the test rather than treated as a violation. If a future dependency adds another framework-owned storage key, except it the same way rather than loosening the check generally.

### ADR-049
**`gen-sitemap-md.ts` mirrors `coverage.ts`, doesn't share code with it.** Both scripts need "expand a scenario's `pages` (exact path, `:slug` pattern, or `*`) into concrete routes, then count page-level scenarios per route." `coverage.ts` also computes area/rule aggregates `gen-sitemap-md.ts` doesn't need, so the shared ~10 lines were duplicated rather than extracted into a module — two working scripts stay simpler than a script plus a shared-logic file for one small function. `npm run gen:sitemap` is chained onto the end of `npm run build` (after `postbuild.mjs`) so `docs/SITE_MAP.md` regenerates on every build; it doesn't read `build/client` output, so its position in the chain doesn't matter.

### ADR-050
**`npm run scan` vs `toggle-axe.spec.ts`.** Plan 10 asked for a Playwright script that prints a before/after table for one page by hand. `e2e/toggle-axe.spec.ts` already asserts the same before/Fix-All/off-again/reload cycle against expected rule ids across 15 pages — that stays the CI-enforced source of truth. `scripts/scan.ts` is a separate, deliberately dumb CLI (launch chromium, scan, click **Fix All**, scan again, `console.table` the diff) against whatever the dev already has served on `BASE_URL` (default `:4173`, matching `npm run preview`) — for spot-checking a page nothing else covers yet, not for asserting anything.

### ADR-051
**GitHub Pages gets its own workflow.** `ci.yml` runs on every push/PR and doesn't build with `BASE_PATH` set, so its `build/client` isn't valid for GitHub Pages' subpath. `.github/workflows/deploy-pages.yml` is a second workflow (build with `BASE_PATH=/a11y_university/`, `actions/deploy-pages`), triggered on push to `main` or manual dispatch, so a Pages deploy doesn't happen on every feature-branch push or PR.

### ADR-052
**WAVE's own completion-gate pass stays a human step.** WAVE is a browser extension; it can't be scripted from a plan 10 automation pass. `docs/verification.md` runs `npm run scan` (axe-core) before/after **Fix All** on 10 pages spanning every tier as the automated stand-in, and lists the same 10 pages as a checklist for whoever does the real WAVE pass. That same pass surfaced `color-contrast` rising after Fix All on 4 of the 10 pages — noted in `docs/verification.md` as a follow-up for a future plan, not fixed here: plan 10 is docs and deployment, not a defect audit.

### ADR-053
**Fixed, not registered.** A real WAVE pass on `/` (prompted by ADR-052's checklist) found three bugs that "Fix All" could never touch, because nothing routed them through the scenario engine: (1) `SiteFooter`'s social icons linked to `#social-<network>` fragments with no matching id anywhere — WAVE's "broken same-page link" — now real (fictional, `.example` TLD) external URLs, since they're not same-page links at all once they're absolute; (2) `HomeNews`'s title link and its "Read the story: …" `SmartLink` always pointed at the same href and sat adjacent in the DOM — WAVE's "redundant link" — the existing `home-news-link-redundant-001` toggle only ever addressed the photo link's redundancy, so once it (and `home-news-readmore-001`, the same `fixAlerts` toggle) is on, the title now renders as plain text instead of a second link to the same place; (3) `.wordmark-sub` (the "University" wordmark caption in the maroon header) used `--brand-gold` on `--brand-redwood`, 3.87:1 — confirmed by axe's literal color computation, not its `incomplete`/pseudo-element uncertainty bucket, and present in both toggle states — fixed with a new `--brand-gold-on-dark` token (`#e0c34a`, ≈5.4:1) scoped to that one selector, since `--brand-gold` itself is fine everywhere else it's used. None of the three became scenarios: they're plain bugs with one always-correct state, not something a tester should find "broken" and then verify a toggle fixes — unlike everything else on the site.

### ADR-054
**Same two bug classes, a different page — plus the real root cause for the contrast findings.** A WAVE pass on `/library` (with **Fix All** on) found 2 more "redundant link" pairs and 4 more "Contrast Errors," neither caused by the toggle engine:
- `QUICK_LINKS`'s "Borrow" column (`src/pages/library/index.tsx`) listed "My Library Account"/"Renew items" (both `/library/account`) and "Loan periods"/"Fines and fees" (both `/library/policies`) as four adjacent links to only two real destinations. "Renew items" was dropped (`/library/account` already lands on the renewal UI — a real site wouldn't list the same destination twice under different labels); "Loan periods" and "Fines and fees" now point at distinct fragments (`#borrowing-heading`, a new `#fines-heading` added via a new optional `id` prop on `Callout`) on `/library/policies`, since that page already has genuinely separate sections for each.
- The real root cause for the recurring `color-contrast` "incomplete" findings on hero images (`hero-kicker`/`page-title`/`hero-lede`, seen on both `/` and `/library`): `Hero`'s `::after` gradient (`components.css`) stays fully transparent until 30% down the image and only reaches 0.72 opacity at the very bottom, so text sitting higher up (a short lede, a shorter hero on a narrow viewport) can land in a nearly-transparent zone with no guaranteed contrast against whatever photo is underneath — axe can't resolve this (hence "incomplete," not "violation"), but a real render can genuinely fail depending on the photo. Manual computation confirmed the worst case (the gold kicker, `--brand-gold` at L≈0.38) fails 4.5:1 against anything short of a near-black background. Fixed by giving `.hero-body` itself a solid `rgb(0 0 0 / 0.8)` backdrop sized to its own box — independent of the hero's total height or the photo's brightness — rather than tuning gradient stops to a percentage that would only coincidentally cover the text on some pages. `data-a11y-scenario` markers, `check:scenarios`, and `coverage` are untouched: this is chrome, not a scenario.

### ADR-055
**13 new home-page Error scenarios, all reusing existing rule keys.** The user asked for more Errors on `/`, specifically ones that break screen readers while looking fine sighted, aiming for ~20 total (WAVE showed 6, matching the page's existing error-category scenario count exactly). All 13 additions reuse rule keys already in `rules.ts` — no new taxonomy — verified against a live axe scan (before/after **Fix All**) rather than assumed:

- **`KeyDatesTable`** (new section, "Key Dates This Term") hosts six: `table-header-association` (header row is `<td>`, not `<th>` — axe has no direct check for "zero header cells," matching this rule's existing WAVE/manual-only "best effort" status elsewhere), `aria-invalid-value` (`aria-sort="asc"`, not a valid enum value), `aria-invalid-attr` (the section's `aria-labelledby` misspelled `aria-labeledby` — same one-L typo as `portal-msg-labeledby-001`; applied directly to the `<section>`, not a wrapping `<div>`, so it keeps its implicit `region` role and axe's `aria-prohibited-attr`/`landmark-unique` checks stay clean in both states, unlike an earlier draft that wrapped a second, redundant `role="region"` around the table instead), `duplicate-id` (every row's "Details" button has a hardcoded `aria-labelledby` target, and axe's `duplicate-id-aria` — which ADR-047 found needs an ARIA reference to fire — catches this instance even though the codebase's other `duplicate-id` scenarios don't trigger it), `aria-required-parent` (the All/Academic/Financial filter pills are `role="tab"` with no `role="tablist"` container) and `img-empty-alt-meaningful` (an inline-SVG-as-`<img>` "deadline is approaching" icon has `alt=""`).
- **`NewsletterSignup`** (new section, "Stay Connected") hosts four: `heading-empty` (the `<h2>` is empty; a `::before { content: }` supplies the visible text), `label-for-mismatch` (the visible "Email address" `<label for>` targets a hidden honeypot input, not the real one next to it), `select-missing-label` (the frequency `<select>` sits next to a plain `<span>`, not a `<label>`) and `input-image-no-alt` (the submit control is `<input type="image">` with no `alt`).
- The hero carousel's slide-1 secondary button gets `aria-hidden-focusable`: wrapped in `aria-hidden="true"` while staying visible and clickable, so a keyboard user tabs onto a stop a screen reader never announces.
- The campus-tour section gets a second `svg-control-unlabeled` instance (a share icon button), following the same inline-`<svg>`-in-`<button>` pattern already used on `/campus-map`.

Net effect on `/`: 19 Error-category scenarios (6 existing + 13 new), plus whatever chrome-level Errors already applied sitewide. `coverage.ts`'s tier budget (H: 8–15 page-level scenarios) already listed `/` as over budget at 19 before this change; it's now further over — expected and accepted, since the user asked specifically for this page to carry unusually many severe, sighted-invisible errors, and the script's tier-budget line is informational only (it doesn't fail the build). Not part of any numbered plan; logged here as a direct, one-off content addition.

### ADR-056
**Contrast moved from Manual to Errors; every instance retuned to just-barely-pass AA.** WAVE shows `color-contrast` failures as a distinct, red "Contrast Errors" bucket — visually and functionally an error, not a judgement call — so the user asked that `Fix Errors` alone clear them, and that the fixed colors land just above the AA line (4.5:1 text, 3:1 non-text/UI) instead of the existing fixes' generous 6–11:1 margins.

- **Category move**: `contrast-text-low` and `contrast-ui-low` moved from `m(...)` to `e(...)` in `rules.ts`. Because every scenario's category is inherited from its rule (ADR-006), this single change retargeted all 49 existing instances (47 on real pages + 2 Accessibility Lab specimens) from `fixManual` to `fixErrors` with no per-scenario code change needed for the toggle logic itself — only the CSS/markup implementing each fix needed to move from `.a11y-fix-manual` to `.a11y-fix-errors` and get a new color.
- **Lab specimens relocated**: `contrast-text-low-manual-lab`/`contrast-ui-low-manual-lab` moved from `lab-manual.ts`/`manual.tsx` to `lab-errors.ts`/`errors.tsx` (new ids `contrast-text-low-errors-lab`/`contrast-ui-low-errors-lab`, following that file's one-specimen-per-rule-key convention), so the lab's own category pages stay honest about what "Fix Errors" now covers. New `styles/features/lab-errors.css` (imported from `index.css`) holds their colors.
- **49 instances retuned in parallel** (3 forked agents, ~15 files each, plus `home.ts` done by hand first as the pattern): for each, found the real background the text/border sits against (a card, a brand-color band, a dark section theme, a checked-vs-unchecked interactive state), and picked a new fixed color landing at 4.5–4.8:1 (text) or 3.0–3.3:1 (non-text), verified with a scratch `node` script computing the same WCAG relative-luminance formula axe uses, rather than eyeballed. Agents correctly left shared design tokens (`--color-text-muted`, `--color-link`, brand navy/blue) untouched where other, unrelated content relies on their full contrast — those scenarios got their own one-off hex instead of retuning the shared token.
- **Two agent misses, both a wrong-background assumption, both fixed**: `donate-chip-caption-contrast-001`'s `#767676` (4.54:1 on white) only passed 4.1:1 against the chip's own `#fbf3dc` background once *checked* — corrected to `#6e6e68` (4.63:1 against the harder case). `athletics-schedule-fine-print-contrast-001`'s fixed color was computed for "white" per its own (already-stale) description, but the page is the dark `sports` theme — corrected to `#7f7f7f` on `#121212`, and past that, the scenario's own *defective* color (`#aaaaaa`) turned out to already pass 8:1 against the real dark background, so the "before" state was never actually broken in context (predates the sports section's dark theme; the color had never been rechecked against it) — recalibrated to `#4f4f4f` (2.3:1, genuinely defective) and the description corrected to match.
- **Real pre-existing, unregistered bugs surfaced by this pass** (present before this session, invisible until `color-contrast` became a checked Error): `.pt-btn` (portal call-to-action buttons) had a background but no `color`, falling back to black-on-blue at 3.14:1 — added `color: #fff` (6.67:1). The `sports` section's dark theme (`--color-bg: #121212`) never got applied to three pieces of `athletics/schedule` chrome that predate it: `.sch-key-table`/`.sch-legend-note`/`.sch-note` hardcoded `#595959` (now `var(--color-text-muted)`), the shared `.tab[aria-selected="true"]` hardcodes `--brand-redwood` for every section (now overridden to `--brand-gold` under `.site--sports`, matching that section's own accent convention), and the sticky table header's hardcoded `background: #fff` put light-theme near-white text-on-white beneath it (now `var(--color-surface)`/`var(--color-text)`). None of these are scenarios — they're chrome bugs, fixed outright, same as ADR-053/054.
- **Two `rules.ts` "best effort" axe mappings didn't hold for specific new instances** (plan 10's own scenarios from ADR-055, not the retuning batch): `home-dates-table-headers-001` claimed `td-headers-attr` (that axe check is for dangling `headers="..."` references, not "no `<th>` at all") — overridden to WAVE-only (`th_empty`). `home-tour-share-svg-001` claimed `svg-img-alt` alongside `button-name`, but the icon is `aria-hidden`, so axe's SVG-as-image check never applies to it — overridden to `axe: ["button-name"]` only. Both use `ScenarioDef.detectedBy`, which fully replaces (not merges with) the rule's default (`registry/index.ts`), matching ADR-047's precedent that a rule's "best effort" mapping can be right for most instances and wrong for one specific manifestation.
- **`e2e/toggle-axe.spec.ts` updated for the category move**: `expectedAxeRules()` already filters by `category === "error"` dynamically, so `color-contrast` became newly expected wherever a contrast scenario lives with no code change — but its `incomplete` bucket (merged with `violations` by design, so genuine axe/WAVE-style "needs review" findings like invalid `aria-current` values still count) also catches things no toggle can ever fix: hero photo pseudo-elements, decorative `aria-hidden` glyphs, CSS gradients, and — an artifact of this test opening the floating control panel before scanning — whatever that panel happens to sit over. Excepted per page in `EXCEPTIONS` (11 pages), matching the file's existing pattern; `docs/ACCESSIBILITY_TESTING.md`'s "Known tool differences" section covers it. `e2e/behavior.spec.ts`'s dedicated `/about` contrast test toggled "Fix Manual Testing Issues" — updated to "Fix Errors".

### ADR-057
**Home-page Errors retargeted at WAVE's own checks.** WAVE's Errors count comes from its fixed list of error types (`alt_missing`, `alt_link_missing`, `alt_input_missing`, `label_missing`/`label_empty`/`label_multiple`, `title_invalid`, `language_missing`, `heading_empty`, `button_empty`, `link_empty`, `th_empty`, `aria_reference_broken`, `aria_menu_broken`, `link_skip_broken`, plus obsolete ones like `blink`/`marquee`/image maps). Most of ADR-055's additions (invalid `aria-sort`, orphaned `role="tab"`, duplicate ids, `aria-hidden` on a focusable) are real screen-reader failures but axe-only, so WAVE showed 10 errors, not ~20. And because the Key Dates header row was `<td>`, WAVE classed the whole table as a layout table (an Alert) rather than a data table with errors. Changes, all still invisible to sighted users:
- **Key Dates table**: headers are now real `<th scope="col">`, but empty in the DOM; their visible text comes from `content: attr(data-label)` (`th_empty` ×3). Each row gained an "add to calendar" link whose only content is an `<img>` with no `alt` (`alt_link_missing` ×5; axe `image-alt` + `link-name`).
- **New elsewhere on `/`**: an icon-only News search whose `<label>` holds nothing but a CSS background icon (`label_empty`); a "Popular" link row marked `<ul role="menu">` with no `menuitem` children (`aria_menu_broken`; axe `aria-required-children`); a newsletter first-name field with two `<label for>`s (`label_multiple`); the email field's `aria-describedby` pointing at a renamed id (`aria_reference_broken`); and a focus-only "Skip to key dates" link whose target id doesn't exist (`link_skip_broken`).
- Two new rule keys, since nothing in the taxonomy fit: `label-multiple` and `skip-link-broken`, both WAVE-detected only (axe has no WCAG-tagged rule for either).
- Estimated WAVE result on `/` with all toggles off: ~23 Errors across 13 types (up from 10 across 8), excluding Contrast Errors. Estimated by a scratch script emulating WAVE's checks; confirm with the extension.
- Incidental fix: the three inline-SVG data URIs on this page (warning icon, calendar icon, Subscribe image) were written with `%23` and then run through `encodeURIComponent`, double-encoding `#`, so the icons never rendered and the Subscribe image showed as a black box.

### ADR-058
**No contrast failures with Fix All on, checked on every route.** WAVE still reported 13 Contrast Errors on `/events` with Fix All on. A scratch script copying WAVE's method (computed text color against the nearest solid ancestor background, alpha-composited, 3:1 for large text; skipping text over background images/gradients and disabled controls; *including* visually hidden text, which WAVE also measures) ran on all 210 routes with Fix All on. It found:
- **Chrome bugs, not scenarios, fixed outright**: the header search's visually hidden label inherited the brand bar's white text over the white search field (192 pages; with /events' 12 "LIFE" chips and their hidden "(Student Life)" text, this accounts for WAVE's 13 exactly); `CtaBand` headings recolored by section themes that set every `h2` (`.site--cms h2`, the calendar theme) at the same specificity, putting dark text on the red band (16 pages; now `.site .cta-band h2`); the calendar's Student Life color `#1e8a5a` (4.34:1 → `#1d8658`, 4.56:1); the library's "Due soon" `#b36b00` (4.18:1 → `#ab6600`, 4.53:1).
- **ADR-056 retuned fixes that were checked against white but sit on a light tint**: `employees-policies-revised-contrast-001` (striped `#f6f6f6` rows → `#707070`), `portal-msg-date-contrast-001` (unread row `#e8f0fb` → `#646e78`), and both Accessibility Lab contrast specimens (specimen box `#f7f7f5` → `#717171` text, `#8c8c8c` border).
- Result: 0 failing text elements on all 210 routes with Fix All on. The defective state is unchanged; e2e still confirms contrast fails before fixing wherever it's asserted.
- `react-router.config.ts` now honors `BUILD_DIR` (default `build`). On Windows, a local static server started inside `build/client` (e.g. a WAVE test server) keeps the build from deleting that folder (the recurring `EBUSY` since ADR-053). Build with `BUILD_DIR=.build-tmp`, then `robocopy .build-tmp\client build\client /MIR` to update it in place.
