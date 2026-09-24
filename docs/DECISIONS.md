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
