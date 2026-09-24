# Plan 01 — Foundation

## Goal

Build a runnable React Router v7 app that prerenders every route to static HTML. It also needs shared layouts, per-section visual themes, and the global navigation shell (mega menu, audience bar, breadcrumbs, search box, footer).

## Stack setup

```bash
npm i react react-dom react-router && npm i -D @react-router/dev vite typescript   # React Router v8 framework mode
npm i minisearch
npm i -D vitest @testing-library/react @testing-library/user-event jsdom \
         @playwright/test @axe-core/playwright sharp tsx
```

`react-router.config.ts`:

```ts
import type { Config } from "@react-router/dev/config";
import { allRoutePaths } from "./src/routes/inventory";

export default {
  appDirectory: "src",
  ssr: false,                                // no server at runtime
  prerender: () => allRoutePaths(),          // every static + data-driven path
  basename: process.env.BASE_PATH ?? "/",    // GitHub Pages support
} satisfies Config;
```

- `allRoutePaths()` combines the static route list with the data-driven detail paths (faculty, news, events, athletes, and others) read from the committed JSON (plan 03).
- A route `loader` runs at **build time** during prerender. It loads only that route's data into the HTML payload, which keeps the client bundle small.
- Add a catch-all route that renders a styled 404 page. Also emit a `404.html` for hosts that support one.

## Directory layout

```
src/
  root.tsx                 # <html> shell (intentionally no lang; see plan 02), <Meta>, <Links>, A11yControl
  routes.ts                # route config (explicit, not file-based, so it stays readable)
  routes/inventory.ts      # single list of all paths + metadata (title, section, defect tier)
  layouts/
    UniversityLayout.tsx   # header, mega nav, audience bar, footer
    sections/              # per-section wrappers setting data-section + section chrome
      AdmissionsLayout.tsx  AcademicsLayout.tsx  LibraryLayout.tsx
      NewsLayout.tsx        AthleticsLayout.tsx  PortalLayout.tsx
      EmployeeLayout.tsx    GivingLayout.tsx     LabLayout.tsx
  components/              # shared UI (Card, Hero, Tabs, Accordion, Modal, DataTable, Pagination, ...)
  a11y/                    # scenario engine (plan 02)
  data/                    # JSON + generated datasets (plan 03)
  pages/                   # page components grouped by section
  styles/
    base.css tokens.css
    sections/admissions.css academics.css library.css news.css athletics.css portal.css ...
    fixes/errors.css alerts.css manual.css   # CSS applied under .a11y-fix-* body classes
public/
  images/  documents/  (fake PDFs for "link to document" alerts)
```

## Section themes (intentional inconsistency)

Each section layout sets `<div data-section="admissions">`, and its stylesheet is scoped to that attribute. All sections share the brand tokens (colors, logo, fonts) but differ in the ways a real campus site does:

| Section | Look | Era cues |
|---|---|---|
| Home, About | Current flagship: large hero, cards | Newest |
| Admissions | Marketing site: rounded buttons, gradients, big type | ~2 years old |
| Academics / departments | Older CMS: sidebar nav, smaller serif body, dense lists | ~8 years old |
| Library | Dense utility navigation, tabbed search box, many links | Its own vendor |
| News | Magazine template: wide imagery, bylines, related stories | Separate CMS |
| Events | Calendar-vendor look: grid calendar, filter chips | Vendor widget |
| Athletics | Dark, bold, sports-network style, score ticker | Outsourced |
| Giving | Clean foundation style, form-focused | Foundation site |
| Employees / HR | Plain intranet, tables | Old |
| Student portal | Enterprise software: top app bar, left rail, data grids | ERP vendor |
| Accessibility Lab | Neutral documentation style, accessible | Tooling |

## Navigation shell

- **Utility and audience bar:** Students, Faculty & Staff, Alumni, Parents, Visitors, plus Portal login, Directory, and Give.
- **Mega navigation:** About, Admissions, Academics, Research & Library, Student Life, Athletics, News & Events. Each panel has link columns and a featured card. The engine renders it in a defective mode (hover-only) and a fixed mode (disclosure buttons with Esc and arrow-key support).
- **Global search box** that routes to `/search?q=`.
- **Breadcrumbs,** generated from `inventory.ts`.
- **Large footer:** contact details, colleges, resources, policies, accessibility, campus safety, employment, maps, directory, and social icons (icon-only links are a planned defect).
- A skip link is included, but it's itself a scenario: in the defective state it points to a missing `#main` target.

## Tasks

1. Scaffold the app and configure `ssr: false` and `prerender`. Confirm that `npm run build` writes `build/client/**/index.html`.
2. Create `inventory.ts` with every route from plan 05, including `path`, `title`, `section`, `tier`, `breadcrumb`, and `searchable`.
3. Build `root.tsx`. There's no `lang` attribute on `<html>` because plan 02 adds it as a scenario. Load the base CSS, and mount the `A11yControl` placeholder.
4. Build `UniversityLayout` and the section layouts with themed CSS.
5. Build shared components in a plain, accessible **baseline** form. Plan 02 adds the defect variants.
6. Add the 404 page and a `/sitemap` page generated from the inventory.
7. Add npm scripts: `dev`, `build`, `preview` (serves `build/client` statically, for example with `npx serve`), `test`, `test:e2e`, `gen:data`, `images:optimize`.

## Acceptance criteria

- `npm run build` produces a static HTML file for every inventory path, and `npx serve build/client` serves all of them. Loading any path directly works, and so does a hard reload.
- No server runtime and no runtime API calls. Only static JSON is fetched.
- Sections look visibly different from each other but still recognizably belong to RSU.
- Layout works at 320px width, apart from the reflow defects that come later.

## Implementation notes (2026-09-24)

- **React Router v8.4** (current), Vite 8, React 19.3, TypeScript 5.9 (TS 7 was skipped for toolchain compatibility).
- React Router's CLI auto-installs `isbot` for its default server entry. It is in `dependencies`, but it is only used at build time.
- **Trailing slashes:** prerender renders every path as `/path/`, but browsers and hosts may load `/path`. Anything rendered from the pathname must use `usePathname()` (`src/routes/usePathname.ts`), which normalizes it. Use `NavItem` rather than `NavLink`. In production, React doesn't patch attribute mismatches during hydration, so a strict comparison leaves prerendered state (such as `aria-current`) wrong without any warning.
- Section chrome lives in one layout (`UniversityLayout`) driven by `layouts/sections.ts`, not separate files per section. Portal and Lab get their own shells.
- `scripts/optimize-images.mjs` was pulled forward from plan 04, so the 11 trial images are already used as heroes.
- The Accessibility Lab uses its own minimal chrome, not the university header and footer, so global chrome defects (plan 07) never show up on lab pages.
