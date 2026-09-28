# Verification — Plan 10 completion gate

Run 2026-09-27, against a local build (`npm run build`, commit before the plan-10 doc/deploy work is
committed). Steps 1–5 below are the automated portions of plan 10's final verification gate; step 6 needs a
live host and is left for whoever does the actual deploy (see note at the end).

## 1. Route inventory

`npm run gen:sitemap` → **210 routes** (`docs/SITE_MAP.md`), comfortably over the PRD's "approximately 100
routes" target.

## 2. Scenario inventory & coverage

`npm run coverage`:

- **819 scenarios** (205 Errors / 346 Alerts / 268 Manual), **84/84 rules used**.
- All 18 coverage areas meet the ≥3 scenarios / ≥3 pages minimum (navigation, images, links, headings,
  forms, tables, aria, keyboard, focus, contrast, reflow, dynamic, dialogs, tabs, accordions, carousels,
  custom-controls, document).
- 15 pages print as "outside tier budget" (short faculty bios under their L-tier budget; the seven
  Accessibility Lab pages, tagged tier A, intentionally carry their specimens) — pre-existing from plans
  05–08, not something plan 10 changes; the script still exits 0 since this list is informational.

`npm run check:scenarios` (after build): all 819 scenarios render their marker exactly where the registry
says, and no unregistered marker exists in the built HTML.

## 3. Full CI suite

Ran locally, all green:

| Step | Result |
|---|---|
| `npm run lint` | clean |
| `npm run typecheck` | clean |
| `npm test` | 134/134 passed (15 files) |
| `npm run build` | 210 routes prerendered, `404.html` written |
| `npm run check:scenarios` | 819/819 scenarios accounted for |
| `npm run coverage` | see §2 |
| `npm run test:e2e` | **244/244 passed** (route smoke on every route, lab index, and the 15-page toggle/reload/axe diff in `toggle-axe.spec.ts`) |

## 4. WAVE — 10 pages across every tier

WAVE is a browser extension; it can't be driven from here, so this is a checklist for a human pass (see
`docs/ACCESSIBILITY_TESTING.md` → Testing walkthroughs → WAVE). As an automated stand-in, `npm run scan`
(axe-core) was run before/after **Fix All** on the same 10 pages, spanning every tier (A/L/M/H/T):

| Page | Tier | Axe rules flagged before → after |
|---|---|---|
| `/sitemap` | A | `button-name` 1→0, `color-contrast` 1→8*, `html-has-lang` 1→0 |
| `/about/mission` | L | `button-name` 1→0, `color-contrast` 1→1, `html-has-lang` 1→0 |
| `/admissions/undergraduate` | L | `button-name` 1→0, `color-contrast` 15→15*, `html-has-lang` 1→0, `region` 1→1 |
| `/about/leadership` | M | `button-name` 1→0, `color-contrast` 7→1, `html-has-lang` 1→0, `link-name` 6→0 |
| `/academics` | M | `button-name` 1→0, `color-contrast` 8→1, `html-has-lang` 1→0, `region` 1→1 |
| `/` | H | `aria-valid-attr-value` 1→0, `button-name` 1→0, `color-contrast` 5→7*, `document-title` 1→0, `frame-title` 1→0, `heading-order` 1→0, `html-has-lang` 1→0, `image-alt` 1→0, `label` 1→0, `listitem` 4→0 |
| `/admissions/apply` | H | `aria-valid-attr-value` 1→0, `button-name` 1→0, `color-contrast` 7→7*, `html-has-lang` 1→0, `label` 3→0, `region` 1→1 |
| `/campus-map` | T | `aria-hidden-focus` 1→0, `aria-valid-attr-value` 2→0, `button-name` 5→0, `color-contrast` 39→43*, `empty-heading` 1→0, `html-has-lang` 1→0, `nested-interactive` 1→0, `select-name` 1→0, `svg-img-alt` 1→0, `tabindex` 3→0 |
| `/academics/catalog` | T | `button-name` 1→0, `color-contrast` 297→6, `html-has-lang` 1→0, `image-alt` 1→0, `link-name` 16→0, `region` 1→1, `select-name` 1→0, `td-headers-attr` 32→0 |
| `/athletics/schedule` | T | `button-name` 1→0, `color-contrast` 48→1, `heading-order` 1→0, `html-has-lang` 1→0, `image-alt` 1→0, `link-name` 37→0, `listitem` 4→0, `region` 1→1, `select-name` 1→0, `tabindex` 2→0, `td-headers-attr` 6→0 |

Every Errors-category rule (`button-name`, `html-has-lang`, `label`, `image-alt`, `link-name`,
`td-headers-attr`, …) clears to 0 with **Fix All** on, as expected. `region` staying at 1 on 4 pages is
`sr-results-no-live-region`-adjacent — an Alerts/Manual-only finding, not something Fix Errors touches, so
it's expected to persist.

\* **Observation, not a plan-10 fix:** `color-contrast` rises after Fix All on 4 of the 10 pages (`/`,
`/admissions/undergraduate`, `/admissions/apply`, `/campus-map`) instead of dropping — some fixed-state
markup (visible label/link text inserted where there was none, or newly-legible content) introduces new
low-contrast text elsewhere. Worth a follow-up pass in a future plan; out of scope for docs & deployment.

## 5. Reload reset

Covered by `e2e/reset.spec.ts` (course plan, application step, and other stateful flows) and by every
`toggle-axe.spec.ts` case's final "after reload" assertion (back to defective, all three switches
unchecked) — both included in the 244/244 above.

## 6. Deploy a preview and smoke-test

Not run from here — deploying is a live action against a real host/account. To finish this step:

1. Push to `main` (or run the `Deploy to GitHub Pages` workflow manually) to publish via
   `.github/workflows/deploy-pages.yml`, **or** connect the repo to Cloudflare Pages/Netlify/Vercel using
   the settings in the README's "Deploying" table.
2. Once live, open a few direct links across tiers (e.g. `/campus-map`, `/academics/catalog`,
   `/portal/registration`) to confirm the static host serves prerendered HTML directly, and that an unknown
   path serves `404.html`.
