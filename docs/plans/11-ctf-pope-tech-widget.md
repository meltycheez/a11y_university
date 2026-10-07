# Plan 11 — Pope Tech Widget & Assistive Technology CTF

**Status: ✅ Done (2026-10-01).** Changed after review: everything for one challenge (§3's start form, run, result and source button) lives in the challenge bar on its page, and the widget's Challenges tab is the same everywhere (challenge list, leaderboard, scoring); it no longer opens on Challenges on a CTF page. Where the build departs from this plan, see [ADR-061 to ADR-063](../DECISIONS.md#adr-061). Player and facilitator guide: [CTF.md](../CTF.md).

## Goal

Rebrand the floating "Accessibility Test Controls" as the **Pope Tech Widget** and add a capture-the-flag (CTF) mode on top of it. Each CTF is a task on a real university page that the player must finish **with a specific assistive technology (AT)** while the site's defects are switched on. Fixing defects or asking for hints costs points. Scores go to one shared leaderboard.

Three CTFs at launch:

| # | Page | AT | Task | Why this page |
|---|------|----|------|---------------|
| 1 | `/admissions/apply` | Screen reader | Submit a valid application to reveal the flag | Already a five-step form with 15 scenarios. We add the worst screen reader defects on top. |
| 2 | `/portal/registration` | Voice control (Voice Control, Dragon, Voice Access) | Register for three named sections in a given priority order | It has drag-to-reorder, icon buttons, and custom tabs. Voice users fail mainly on names: unnamed controls and visible text that doesn't match the accessible name (2.5.3) force them onto mouse-grid and drag commands. |
| 3 | `/campus-map` | Eye tracking / dwell click (Tobii, Windows Eye Control, iOS Eye Tracking) | Find a building that is off screen and read its after-hours access code | Pointer-heavy: drag-only pan, tiny zoom buttons, building details shown only on hover, and SVG shapes for targets. Eye tracking fails mainly on target size, hover, drag, and time limits. |

## Non-negotiables carried forward

- The widget is **infrastructure**. It must stay fully accessible (WCAG 2.2 AA), never register scenarios, and keep its keyboard shortcut (Alt+Shift+A). The CTF panel, modals, and leaderboard follow the same rule. The challenge pages are hard to use; the widget never is.
- Pages must still prerender in their defective default state. CTF defects are ordinary registered scenarios (each with a fix and an entry in the registry), so `check:scenarios`, `coverage`, and the axe e2e toggle tests cover them automatically.
- **PRD conflict (needs an ADR):** the PRD bans localStorage for *application state*. CTF progress inside a run stays in module memory and still resets on reload. The leaderboard is the one exception: it lives in `localStorage` under a single key (see §4). The site and fix toggles never read it, so a reload still restores the site's default state. Log this as ADR-061 and add a one-line amendment to `docs/PRD.md`.

## 1. Rebrand: the Pope Tech Widget

Files: `src/a11y/A11yControl.tsx` (rename it to `PopeTechWidget.tsx`, which also updates `root.tsx`), `src/styles/chrome.css` (or wherever `.a11y-control` lives), and a new `public/brand/pope-tech-mark.svg`.

- Collapsed state: one circular button, 56px, fixed at the bottom right. It shows only the Pope Tech mark taken from the official logo on pope.tech (download the SVG once and commit it; never hotlink it). Give it `aria-label="Pope Tech Widget"`, keep `aria-expanded` and `aria-controls`, and add a visible tooltip on hover and focus. The mark is decorative (`alt=""`) because the button already has a name.
  - Confirm with Pope Tech's brand owner that the mark can be used this way before shipping.
- Expanded state: a panel with the heading "Pope Tech Widget" and two tabs, using the existing accessible `Tabs` component in its fixed variant:
  1. **Fixes**: today's switches, highlight checkboxes, Fix All / Reset All, and the Lab link, unchanged.
  2. **Challenges**: see §3.
- On a CTF page, the panel opens on the Challenges tab.
- Rename `aria-label="Accessibility Test Controls"` everywhere it appears: `e2e/behavior.spec.ts`, `e2e/toggle-axe.spec.ts`, `scripts/scan.ts`, `scripts/wave.ts`, `src/a11y/engine.test.tsx`, `src/pages/accessibility-lab/index.tsx`, `docs/ACCESSIBILITY_TESTING.md`, and `docs/PRD.md`. The scan scripts exclude the widget by this name, so a missed rename means the widget's own markup leaks into scan results.

## 2. CTF engine

New files: `src/ctf/challenges.ts` (data), `src/ctf/store.ts` (run state), and `src/ctf/flag.ts`.

```ts
// challenges.ts: one record per CTF. This is the single source for the widget list, the page banner and the leaderboard.
interface Challenge {
  id: "apply-sr" | "registration-voice" | "map-eyes";
  path: string;            // "/admissions/apply"
  title: string;
  at: string;              // "Screen reader"
  atExamples: string[];    // ["NVDA + Firefox", "JAWS + Chrome", "VoiceOver + Safari"]
  basePoints: number;      // 500
  instructions: string[];  // shown in the widget once the challenge has started
  hints: string[];         // revealed one at a time, each costing points
}
```

- **Run state** (`store.ts`): `{ challengeId, startedAt, fixesUsed: Set<Category>, highlightsUsed, hintsUsed, finished, flag }`. Use the same module-store pattern as `a11y/state.ts`: memory only, so a reload ends the run (and the instructions tell players this).
- **Starting**: the page shows a "Start the Challenge" button. The widget does the same thing for the current page.
  - Starting first asks for a handle (a labeled text input, 1–24 characters).
  - Then it calls `a11yStore.resetAll()`, so a run always begins with every defect on.
- **Attempts**: each handle gets 4 attempts per challenge (the first try plus 3 retries).
  - An attempt counts when it starts, so abandoning a run or reloading the page uses one up.
  - The attempt count is saved in the leaderboard storage (§4), so a reload doesn't reset it.
  - When a handle has no attempts left, Start is disabled and a message next to it says "No attempts left for <handle> on this challenge."
- **Penalties** (the store subscribes to `a11yStore`):
  - Turning on any Fix switch during a run: −150 the first time per category, then nothing more. With all three categories that is −450, which leaves a floor above zero. Fix All counts as all three.
  - Turning on a highlight checkbox: −25 per category.
  - Each hint: −50, −75, −100 (cost rises with each hint).
  - Time bonus: up to +100, falling linearly to 0 at 20 minutes. Treat it as a tiebreaker, not the main score.
- **Flag**: `RSU{<slug>-<8 hex>}`. The hex is a short hash of the challenge id plus the run's values (for the apply CTF, the applicant name and a code that the player can only find on the page). It is computed at the moment of success, so it is never a plain string in the bundle. This is an honor system: anyone who reads the source can forge a flag. That's acceptable when the laptop is supervised.
- **Mouse-use signal** (screen reader and voice CTFs only): count `pointerdown` events with `pointerType === "mouse"` inside `<main>` during the run. Show the count on the result ("completed without a mouse" badge) but take no points for it. AT can produce synthetic clicks, and we can't detect which AT is in use, so this stays informational.

## 3. Widget: Challenges tab

- **Not on a CTF page**: list all three CTFs with links, the AT each one requires, the base points, and your best score this session (from memory). Below the list, add "View leaderboard" and "How scoring works".
- **On a CTF page, before starting**: the AT required, a short brief, a "Start the Challenge" button that mirrors the one on the page, and a "View challenge source" button.
- **During a run**: the full instructions, a live score in a `role="status"` region (polite, announced only when it changes), a "Get a hint (−N)" button that asks for confirmation, and an "Abandon" button.
- **After finishing**: the flag, a score breakdown, and the number of attempts left. The score saves automatically (§4).
- **Source modal**: use the existing `Modal` in its fixed variant. Show the page component's source and its scenario registry file, loaded with Vite `?raw` imports (for example `import src from "~/pages/admissions/apply.tsx?raw"`), and load them lazily inside the modal so the source text stays out of the page bundle. Show the code in `<pre><code>` with no syntax highlighter; a new dependency isn't justified. Give the scroll region a label and `tabindex="0"` so keyboard users can scroll it.
  - Showing source is free. Players will see how the defects work, which is the point of the training.

## 4. Leaderboard (one shared laptop, localStorage)

Every participant plays on the same machine, so the leaderboard is local to that browser. There is no backend.

- New file `src/ctf/leaderboard.ts` (about 30 lines). It stores `{ handle, challengeId, attempts, best?: { score, flag, finishedAt, noMouse } }[]` as JSON under the key `rsu-ctf-leaderboard`.
  - Wrap every read and write in try/catch. A private window, blocked storage, or the prerender step must give an empty board, never a crash.
  - Read the board only in effects or event handlers, never during render, so the prerendered HTML and hydration still match.
- **Starting a run** increases `attempts` by 1.
- **Finishing a run** replaces `best` when the new score is higher. Only scores from finished runs reach the board.
- **Leaderboard view** in the widget: a table (caption, `<th scope>`) with tabs for Overall and each CTF, showing the top 25. Overall is the sum of each handle's best score per challenge.
- **Facilitator controls**, for a laptop shared at an event:
  - "Clear leaderboard", behind a confirmation dialog only. No PIN (decided 2026-10-01). Clearing also resets every handle's attempt count.
  - "Export CSV", a `Blob` download, so results survive a browser reset.
- Handles render as text only (React escapes them), with no HTML.
- Honor-based, the same as the flags (§2): anyone with DevTools can edit the board. That's acceptable on a supervised laptop.

## 5. CTF 1: Application for Admission (screen reader)

Page: `src/pages/admissions/apply.tsx`. Registry: `src/a11y/registry/apply.ts` (the 15 existing scenarios plus about 10 new ones). The goal is a form that can be finished with a screen reader but is miserable to finish.

**Success condition:** a submitted application with all required fields, plus one **challenge code** (`RSU-7Q4K`) entered in a new "Application referral code" field. The code appears only as text inside an image whose `alt` is useless ("image123.png"), and the true value is reachable through a broken long-description link. Screen reader players have to work out how to get it, for example with the NVDA image description or OCR features, or by following the `aria-describedby` reference that points at a visually hidden but present element.

New scenarios, each with a fixed variant:

| Key | Rule | Defect |
|---|---|---|
| `tab-order` | `focus-order-mismatch` | On step 1, a script scrambles Tab between the fields (Last name → ZIP → First name → Email…). Focus enters and leaves the form normally (changed from positive `tabindex`, which pulled focus ahead of the whole page). |
| `name-mismatch` | `label-for-mismatch` | Labels are swapped on City and State, so each field announces the other's name. |
| `aria-label-junk` | (new rule `aria-label-poor` if none exists) | Inputs have `aria-label="email_addr"`, which overrides a good visible label. |
| `code-image-alt` | `alt-suspicious` | The referral-code image has `alt="image123.png"`. |
| `crest-alt` | `alt-redundant` / `alt-long` | The decorative crest has a 400-character alt text. |
| `next-name` | `button-empty` | Next is an icon-only `<button>` with no name (built as a real button so axe flags it; ADR-063). |
| `certify-hidden` | `aria-hidden-focusable` | The certify checkbox sits inside `aria-hidden="true"`. |
| `live-spam` | (new rule `sr-live-region-noisy`) | An "autosaving…" `aria-live="assertive"` region fires every 60 seconds. |
| `fake-heading` | `heading-possible` | Step titles are bold `<div>`s. |
| `citizenship-radios` | `input-missing-label` | Citizenship is now a radio group: bare radios with plain text after them, no labels and no fieldset. |

Steps:
1. Add the scenarios to `rules.ts` (only where a rule is missing) and to `registry/apply.ts`.
2. Implement each one with `fix("…")` branches, following the existing pattern in the page.
3. Add the challenge-code image (generate it in Flow like the other images, or use an SVG with text drawn as paths) and the referral field.
4. When the CTF is active and the submission succeeds, show the flag in the confirmation. Outside a CTF run the page behaves exactly as it does today.
5. Write the instructions and three hints.

## 6. CTF 2: Registration (voice control)

Page: `/portal/registration`. The task: add MATH 101-02, CHEM 101-02 and ENGL 111-01 (Spring 2027, CRNs 44458, 45934 and 43099) to the cart, order them by priority in that order, and register.

New defects that hurt voice users specifically:
- **Label-in-name mismatches** (2.5.3): visible "Add" buttons are named `aria-label="Enroll in section"`, and visible "Search" is named "Find".
- **Drag-only priority reordering** (already present, `kbd-drag-no-alternative`). Voice players must use mouse-grid or "drag" commands.
- **Duplicate visible names**: twelve visible "Add" buttons with no differentiators, so "Click Add" triggers numbered overlays every time.
- **Tiny targets** for the remove "×" (16px, 2.5.8).
- **A control with no name** that has to be clicked to confirm the conflict warning.

## 7. CTF 3: Campus Map (eye tracking)

Page: `/campus-map`. The task: find the "Hawthorne Observatory" (placed off screen at the default pan), dwell on it to open the tooltip, and enter the after-hours code shown there into the "Check-in" box.

New defects that hurt eye tracking specifically:
- **Tooltip disappears** after 2 seconds, or as soon as the pointer drifts 8px (1.4.13). The code is 7731.
- **12px zoom buttons** placed 4px apart (2.5.8).
- **Drag-only pan** (already present). Dwell-drag is slow and error-prone.
- **A 60-second "Are you still there?" timeout** with an 18px "Continue" target (2.2.1).
- **An animated "Parking update" banner** that moves the content below it (2.2.2), so dwell targets shift.

## 8. Tests

- Unit (`src/ctf/store.test.ts`): starting a run resets the fixes; each penalty is applied once per category; hint costs rise; the flag is deterministic for the same inputs; the score never drops below 0.
- Component (extend `engine.test.tsx`): the widget button is named "Pope Tech Widget"; the Challenges tab lists 3 CTFs; on `/admissions/apply` the tab shows screen reader instructions.
- E2E (new `e2e/ctf.spec.ts`): complete the apply CTF with the keyboard only (Playwright drives the a11y tree through `getByRole` wherever the defects allow, falling back to `locator`); the flag appears; turning a fix on mid-run shows the penalty; axe reports **zero** violations on the widget panel and modal in every state.
- Existing suites: `check:scenarios` and `coverage` pick up the new scenarios automatically. Update the expected counts.
- Leaderboard (`src/ctf/leaderboard.test.ts`):
  - it keeps each handle's best score per challenge
  - a 5th start is refused, and an abandoned run still counts as an attempt
  - it adds up the overall totals correctly
  - it returns an empty board when `localStorage` throws
  - Clear empties the board
- E2E: save a score, reload, and the score is still on the board while every fix toggle is back off.

## 9. Docs

- New `docs/CTF.md`: the rules, scoring, per-CTF AT setup tips (NVDA, VoiceOver, Voice Control, Dragon, Eye Control), and a facilitator checklist (clearing the board before an event, exporting the CSV afterward).
- New ADRs: 061 (localStorage exception for the leaderboard only), 062 (honor-system flags), 063 (renaming the widget and the change to the scan-exclusion selector).
- Add plan 11 to the table in `00-overview.md`.

## Order of work

1. Rebrand plus the renames, then green tests (S)
2. CTF engine and the Challenges tab, with no challenge wired yet (M)
3. CTF 1: apply defects, code image, flag (M)
4. Source modal (S)
5. Local leaderboard (S)
6. CTFs 2 and 3 (M each)
7. Docs and ADRs (S)

## Decisions (2026-10-01)

1. The leaderboard lives only in `localStorage` on one shared laptop.
2. "Clear leaderboard" needs a confirmation dialog only, with no PIN.
3. Each highlight checkbox costs −25 points.
4. Each handle gets the first try plus at most 3 retries per challenge, and the board keeps the best score.
5. The widget keeps the existing terms: Errors, Alerts, and Manual Testing Issues.
