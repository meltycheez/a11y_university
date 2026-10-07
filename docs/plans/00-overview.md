# Implementation Plan — Overview

Source requirements: [`docs/PRD.md`](../PRD.md)

This folder breaks the PRD into ten phased plans. Each plan lists its goal, the files it creates, ordered tasks, and acceptance criteria. Work through them in order; the dependency graph below shows which phases can overlap.

| # | Plan | Summary | Status |
|---|------|---------|--------|
| 01 | [Foundation](01-foundation.md) | Scaffold, static prerendered routing, layouts, section themes, navigation shell | ✅ Done (2026-09-24) |
| 02 | [Accessibility Scenario Engine](02-scenario-engine.md) | Toggle state, scenario registry, `useScenario` primitives, floating control, counts | ✅ Done (2026-09-24) |
| 03 | [Content & Data](03-content-data.md) | Brand, seeded deterministic datasets, copy, local search index | ✅ Done (2026-09-24) |
| 04 | [Image Assets via Google Flow](04-image-assets-flow.md) | Asset manifest, Nano Banana generation in Google Flow, optimization pipeline | 🟡 In progress: 125/131 images done; 6 waiting on the Flow usage limit (2 flyers, 2 mascots, map, Sierra Blackwood redo) |
| 05 | [Site Sections](05-site-sections.md) | Every public route, templates, and the route inventory | ✅ Done (2026-09-25) |
| 06 | [Interactive Features](06-interactive-features.md) | Course search, registration, portal, forms, application, map, carousel | ✅ Done (2026-09-25) |
| 07 | [Scenario Coverage](07-scenario-coverage.md) | Full defect catalog, per-page distribution, legacy "terrible" pages | ✅ Done (2026-09-25) |
| 08 | [Accessibility Lab](08-accessibility-lab.md) | `/accessibility-lab` and its seven controlled test pages | ✅ Done (2026-09-25) |
| 09 | [Testing](09-testing.md) | Unit, component, and Playwright + axe tests that prove the toggles work | ✅ Done (2026-09-26) |
| 10 | [Docs & Deployment](10-docs-deploy.md) | README, ACCESSIBILITY_TESTING.md, SITE_MAP.md, static hosting | ✅ Done (2026-09-27) |
| 11 | [Pope Tech Widget & AT CTF](11-ctf-pope-tech-widget.md) | Rebrand the widget, add three assistive technology CTFs, scoring, source viewer, local leaderboard | ✅ Done (2026-10-01) |

Decisions made while building are logged in the [ADR register](../DECISIONS.md).

## Key decisions

| Decision | Choice | Why |
|---|---|---|
| UI framework | **React 19 + TypeScript** | Requested. Components can switch between defective and fixed markup based on state. |
| App framework | **React Router v8 in framework mode**, with `ssr: false` and `prerender` | It's a small React framework. At build time it writes a real `index.html` for every route, so all ~100 routes open directly on any static host with no server. Scanners get real HTML even before JavaScript runs. |
| Build tool | Vite (v8, bundled with React Router) | Fast, standard, outputs static files. |
| Styling | Plain CSS with custom properties: one base layer plus one stylesheet per section | Gives full control over exact defective CSS (contrast, focus, reflow). Per-section sheets create the "built by different departments" inconsistency the PRD asks for. No CSS framework, because its built-in accessibility defaults would get in the way. |
| State | Module-level store read with `useSyncExternalStore`. Memory only. | Survives client-side navigation and resets on reload. No localStorage, sessionStorage, cookies, or IndexedDB anywhere. |
| Data | Hand-written JSON for flagship content, plus a seeded PRNG generator for bulk records. Output is committed JSON. | Deterministic and reviewable, so scan results are reproducible. |
| Search | MiniSearch over a JSON index generated at build time | Runs entirely in the browser, small, handles fuzzy and prefix matching. |
| Images | Photos and illustrations from **Nano Banana in your Google Flow account**, driven through the Playwright browser. Logo and seal hand-built as SVG. | Uses your Flow plan as requested. SVG keeps the brand marks crisp and gives exact control over accessibility attributes. |
| Tests | Vitest + Testing Library for unit and component tests. Playwright + `@axe-core/playwright` for end-to-end tests. | Proves defects exist when toggles are OFF, are fixed when ON, return when OFF again, and reset on reload. |
| Hosting | Any static host. Output directory is `build/client`. | Cloudflare Pages, Netlify, Vercel static, or GitHub Pages (with a base path). |

**Fictional brand (placeholder, set in one config file):** *Redwood State University* (RSU), Arcadia Falls, California. The mascot is the Redwood Owls. The name comes from the PRD's example. Plan 03 confirms that no real institution uses it and swaps it if one does.

## Phase dependencies

```
01 Foundation
   └─► 02 Scenario Engine
          ├─► 03 Content & Data ──┐
          ├─► 04 Images (Flow) ───┤   (03 and 04 can run in parallel)
          │                       ▼
          └──────────────► 05 Site Sections ─► 06 Interactive Features
                                                    │
                                    07 Scenario Coverage (spans 05 and 06)
                                                    ▼
                                             08 Accessibility Lab
                                                    ▼
                                    09 Testing (written alongside every phase, hardened here)
                                                    ▼
                                             10 Docs & Deployment
```

The engine (02) has to exist before any page is built. Every page should be written from the start with its intended defects and fixes in place. Adding defects to finished pages afterwards is slower and produces unrealistic markup.

## Guiding rules for every phase

1. **Realistic defects only.** Every defect should look like something a real team would ship. Don't write corrupt HTML just to raise scanner counts.
2. **Every defect is registered.** A defect with no registry entry is a bug. Plan 09 enforces this in CI.
3. **Toggles change the real DOM or behavior.** They never hide scanner output.
4. **The page loads in the defective state.** The prerendered HTML is the defective state. The client starts with all toggles OFF, so hydration always matches.
5. **Reload resets everything.** No persistent storage, including for toggles.
6. **Determinism.** The same route renders the same content and the same defects on every load.
7. **Infrastructure stays accessible.** The floating control, the Accessibility Lab index, and the documentation pages are accessible by default.

## Rough effort

| Phase | Relative size |
|---|---|
| 01 Foundation | M |
| 02 Engine | M |
| 03 Content & Data | L |
| 04 Images | M (most of the time is Flow generation) |
| 05 Site Sections | XL |
| 06 Interactive | L |
| 07 Coverage | L (interleaved with 05 and 06) |
| 08 Lab | S–M |
| 09 Testing | M |
| 10 Docs & Deploy | S |
