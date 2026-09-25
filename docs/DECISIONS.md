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
