# Plan 12: CTF playtest feedback

**Status: ✅ Done (2026-10-13).** Changed while validating against the playtest notes: Fixed-mode registration controls are named exactly their visible word (Up, Down, Add, Remove, Details), with the class code as the description; subject options are plain names and the schedule tab has no count. "Show the form −50" is listed with the other costs. The challenge is named "Head pointer for Mac", its run instructions carry the gesture cues, and starting a map run scrolls to the map. The instructions dock sits over the portal nav rail on registration, and the fixed-width map shrinks to fit beside it during a run, so it never covers a task control.

The notes show the challenges work: testers called them "really cool and really realistic". The problems are in the setup around them: a broken comparison run, instructions that scroll out of view, unclear scoring copy and a few dead ends. The fixes are grouped by where they land, with shared fixes first because every challenge benefits from them.

## Decisions to confirm before building

| # | Question | Default in this plan |
|---|---|---|
| D1 | Registration: shorten it to two courses, or add a "Remove all" button? | **Two courses** (MATH 101-02, then ENGL 111-01). It is simpler, and reordering by drag is still required. No new button. |
| D2 | Head pointer: drop panning, the "Are you still there?" map reset, or both? | **Drop the reset only during a run.** Make the observatory easy to find from search and the building list (§4), so tilting the head to pan becomes optional. |
| D3 | Rename "Eye tracking" to "Head pointer". Head pointer on Mac only, or also Windows Eye Control? | `at: "Head pointer"`, with Head Pointer for Mac listed first in the examples. Eye trackers stay in the list as allowed. |
| D4 | Should the screen reader challenge be shorter? | ✅ **Decided:** two steps, fewer fields, about 15 minutes (§2). |

## 1. Shared: challenge bar and run flow (all three challenges)

### 1a. The comparison run doesn't fix anything (the top issue: 3 of 4 testers hit it)
After **Try again with all issues fixed**, `retryWithFixes` turns on every fix. The bar then shows **Start the Challenge** again, and `startRun` calls `a11yStore.resetAll()`, so the issues come back. It also uses an attempt and turns the hint and "Show the form" penalties back on.

- `store.ts`: add `compare?: boolean` to `Run`. `startRun(id, handle, { compare })`, when comparing, skips `board.startAttempt` and calls `fixAll()` instead of `resetAll()`. `revealFlag` with `run.compare` set shows the result without recording it.
- `ChallengeBanner.tsx`: when `compare === id`, the start button reads **Start comparison run** and its help text says it isn't scored and doesn't use an attempt.
- `Running`: on a comparison run, hide the score, the penalty warning and the confirm dialogs. Hints are shown for free, the form isn't hidden, and the Fix switches are already on.
- `apply.tsx`: only fade the form (`apply-card--blind`) and run the countdown when `ctfRun && !run.compare`.

### 1b. The instructions scroll out of view (voice and head pointer)
- During a run, show the instructions in a fixed side panel (`.ctf-dock`) that the player can collapse. It holds the step list, the hints already taken, the score and Abandon. It is pinned to the right edge on wide screens and to the bottom on narrow ones, and stays out of `<main>` so it doesn't count toward the mouse-click total.
- The challenge bar keeps the full text. The dock repeats only the short version.
- Accessibility: it's a `<section aria-label="Challenge instructions">` with a real collapse button (`aria-expanded`) and no focus trap. Make sure it never covers the target controls: test at 1280px and at 375px.

### 1c. The scoring copy has too little context
Change the "Costs points" chip details, the `Scoring` list and CTF.md to say what and where:

> **Fix switches** (in this bar during a run, and in the Accessibility Lab widget) remove this page's accessibility issues for one category at a time: errors, alerts or manual testing issues. Turning one on costs 150 points the first time. Fix All turns on all three, so it costs 450.
>
> **Highlight** outlines this page's issues for one category, so you can see where they are. It costs 25 points the first time per category.

Before the run, add one line under the Start button: "Once you start, you'll find hints, the Fix switches and highlights in this bar."

### 1d. The leaderboard is a dead end
- `ChallengeBanner` uses `<Link to="/leaderboard">`. Swap it for the `LeaderboardButton` modal from `ChallengesPanel.tsx`, which already exists. It works in every stage, including **closed**, so players can see the board before they start.
- `ChallengeComplete`: add the same `LeaderboardButton` next to **Try again with all issues fixed**.

### 1e. The highlight seems not to work when its fix is on
The checkbox sits under the Fix switch, but it shows nothing once that switch is on, because no issues are left.
- `PopeTechWidget.tsx` `FixControls`: when a category is fixed and its highlight is checked, the key reads "Nothing to highlight: Fix Errors is on". Change the checkbox label from "Highlight" to "Highlight errors on the page" so it reads as its own control.

### 1f. Highlight labels are cut off
`.a11y-hl-tag` uses `white-space: nowrap; text-overflow: ellipsis` (`components.css:189`), so long scenario titles are truncated.
- Let the tag wrap within its existing `maxWidth` (320px), with `white-space: normal`. Stacked tags then need their offset worked out from the real height, not `stack * 16`. Simplest: measure in `ScenarioHighlights` after layout, or stack tags into one flex column per element.
- Also add `title` with the full text as a hover fallback.

### 1g. Setup and command help per challenge
- Add a `setup: { heading: string; items: string[] }[]` field to `Challenge`, shown as a collapsed `<details>` named "Set up your assistive technology" in the bar. It isn't needed at the conference, where stations are set up beforehand, but it is needed anywhere else.
- Voice: the commands handout as a short table: getting started (Mac versus Windows), navigation and clicking, dictation. Link to a print version later if wanted.
- Head pointer: see §4c.

## 2. Screen reader: Application for Admission (`/admissions/apply`)

### 2a. Two steps, about 15 minutes
The form goes from three steps (about 30 fields and two essays) to two steps (11 inputs and one short answer). **Every registered scenario stays.** Each one keeps at least one field to live on, so `check:scenarios`, coverage and the Fix switches still work.

| Step | Fields kept | Scenarios they carry |
|---|---|---|
| **1. About you** | Legal first name, legal last name, date of birth (month, day, year), email, city, state, citizenship status | `tab-order` (now jumps between these 8 inputs), `dob-split`, `aria-label-junk` (email), `name-mismatch` (City and State swapped), `citizenship-radios`, `no-structure` (3 groups: Name and birth date, Contact, Citizenship) |
| **2. Program and submit** | Entry term, first-choice major, cumulative GPA, application referral code, one short answer ("Why Redwood State?", up to 50 words), summary of step 1 with Edit, certify checkbox | `term-fieldset`, `major-dropdown`, `gpa-for`, `code-image-alt`, `essay-instructions`, `review-heading-skip`, `certify-hidden` |
| Both | Step heading, progress list, Back, Next/Submit, autosave, errors | `fake-heading`, `progress-label`, `stepper-state`, `step-focus`, `back-link`, `next-name`, `live-spam`, `errors-not-announced`, `errors-vague`, `required-color`, `crest-alt`, `submit-status` |

**Removed fields:**
- Step 1: middle name, preferred name, mobile phone, street address, ZIP code, the first-generation checkbox.
- The old Academics step: high school name, high school city, graduation date, dual enrollment.
- Program: applying as (first-year or transfer), second-choice major, the housing checkbox.
- Essays: the second essay.

The personal essay becomes a 50-word short answer.

**Changes:**
- `apply.tsx`: update `STEPS`, `TAB_ORDER`, `ESSAYS`, `validateStep` (step 0 and step 1 only), `reviewRows` (one "About you" section) and `bodies`. Also update the CTF referral check in `submit`, which is now step 1 and so redundant on the same step: drop it.
- `registry/apply.ts`: fix the descriptions that name removed fields:
  - `aria-label-junk`: only Email now.
  - `no-structure`: 8 inputs, 3 groups.
  - `dob-split`: date of birth only.
  - `fake-heading`: "Step 1 of 2: About you".
  - `review-heading-skip`: the summary on step 2.
- `challenges.ts`: instructions say "both steps" and "the Program and submit step". Change hint 3 from "on the last step" to "on step 2".
- Intro copy (`pages-admissions.ts:169`): "The application takes about 15 minutes." Keep it, because it's now true and sets expectations. Update the CTA on `_AudienceLanding.tsx:40` to match.
- **Take out the dead end**: remove the **Read the Admissions FAQ** link (`apply.tsx:451`).
- Tests: `_forms.test.tsx`, `engine.test.tsx`, `e2e/ctf.spec.ts`, `e2e/reset.spec.ts` and `e2e/toggle-axe.spec.ts` all fill or count the old fields. Update their fill helpers to the new field list.
- Docs: CTF.md table row, `docs/SITE_MAP.md` if it lists the steps.

### 2b. Other
- The comparison run, scoring copy and leaderboard are covered by §1a, §1c and §1d.

## 3. Voice control: Class Registration (`/portal/registration`)

- **Fewer courses (D1)**: the target becomes MATH 101-02, then ENGL 111-01. (Later: players must add ENGL first and MATH second, so the cart always needs reordering; a wrong attempt registers nothing; abandoning clears the cart. See plan 13 §5 for the reset on every new run.) Update `CTF_ORDER` (`registration.tsx:53`), `challenges.ts` instructions and brief, the `/ctf` pitch, CTF.md, and `e2e/ctf.spec.ts`. Then the order is wrong at most once, and a remove-and-re-add costs one course, not three.
- **Sections are confusing**: in the instructions, say it the way someone outside higher ed would: "MATH 101, section 02 (CRN 43…)". Give the CRN for each one so players can use **Add by CRN** instead of searching the grid. Fewer sections per course in the data would change other pages, so leave the data alone.
- **Names are hard to say, even with fixes on**. Change the fixed-mode controls so the visible text is what you say, and the accessible name starts with that text (2.5.3):
  - Move buttons: visible "Up" and "Down", accessible names "Up, MATH 101-02" and "Down, MATH 101-02". Voice Control's "Click Up" then shows numbers to pick one.
  - Add buttons in the results: visible "Add" next to the plus icon, accessible name "Add, MATH 101-02".
  - Remove: already "Remove …". Keep it.
  - Subject options like "English (ENGL)": leave the defective state alone. When fixed, start the option text with the subject name only. Check that Voice Control's picker still lists them.
- **Reordering by voice in the defective state**: drag-only stays, because it's the point. The hint already says to drag with the grid. Add a sentence to hint 2: "or remove classes and add them back in order".
- Comparison run: §1a.

## 4. Head pointer: Campus Map (`/campus-map`)

### 4a. Name and difficulty (D2, D3)
- `challenges.ts`: `at: "Head pointer"`, with `atExamples` starting "Head Pointer (macOS)". Rewrite the brief and rules to say "head or eyes" instead of "eyes only". Update the `/ctf` pitch (`map-eyes` copy and icon label), `AT_ICONS`, the leaderboard labels and CTF.md. Keep the id `map-eyes` so saved scores still match.
- Turn off `campus-map-timeout-001` while a run is active (`campus-map.tsx:59`). Keep the scenario and its fix for normal browsing. Remove hint 3, or replace it.

### 4b. The observatory can't be found, and the code is only in the tooltip
- Add Hawthorne Observatory (OBS) to the building directory table under the map (in `pages.ts` `/campus-map`), so the code can be looked up and then searched for.
- Building details: when a building has `accessCode`, show "After-hours access code: 7731" under **Hours** in `BuildingDetail`. The tooltip stays one way to find it. The panel and its **Learn more** route become the second.
- Instruction 1: "Find it on the map, or search for it by name or by its code from the building directory."

### 4c. Head pointer setup content (§1g)
Draft, to be replaced with the author's better copy later:
- System Settings → Accessibility → Pointer Control → Alternate pointer actions: **Raise eyebrows** for left click, **Stick out tongue** for drag and drop, **Smile** to recalibrate.
- Head Pointer: Pointer moves "when facing screen edges", pointer speed 70, distance to edge 15.
- Accessibility → Keyboard → turn on the **Accessibility Keyboard** for typing.
- Gesture cues in the instructions: "To scroll: point at the scroll bar, stick out your tongue to grab it, move your head, stick it out again to drop."
- Add a link to Apple's [pointer control settings guide](https://support.apple.com/guide/mac-help/change-pointer-control-settings-accessibility-unac899/mac) for now, and plan to write our own resource.

## 4b. Booth-length challenges (added after playtest)

Further feedback: booth challenges should take a few minutes, with harder ones for players' own time. The voice and head pointer challenges were already about 2–4 minutes; the two-step application was still 8–15.

- New booth screen reader challenge **Request Information** (`reqinfo-sr`, `/admissions/request-info`): one form, the page's five registered issues plus a new jumping Tab order (`adm-reqinfo-tab-order-001`), the shared fade-out (`ctf/useBlindRun.ts`). Task: fill in name and email and answer the three questions; any answer works, but every radio group and list starts unselected and can't be left that way.
- **Application for Admission** becomes the harder version (`advanced`): linked from Request Information's bar, congratulations, the widget and /ctf; its own leaderboard tab, left out of the overall total.
- Time bonus per challenge (`timeLimitMin`): 0 at 5 minutes for booth challenges, 20 for the harder one.

## 5. Not in this plan (backlog)
- Another way to use the site: "find the issues with WAVE" or video-only challenges. This is a new challenge type and needs its own plan.
- Link each highlighted issue to its documentation (registry `docs` URL).
- Using these challenges in other content areas.

## Files touched
`src/ctf/{store,challenges,ChallengeBanner,ChallengeComplete,ChallengesPanel}.ts(x)`, a new dock in `ChallengeBanner.tsx` (no new file unless it grows), `src/a11y/{PopeTechWidget,ScenarioHighlights}.tsx`, `src/styles/components.css`, `src/styles/features/ctf-page.css`, `src/pages/{ctf,campus-map}.tsx`, `src/pages/admissions/apply.tsx`, `src/pages/portal/registration.tsx`, `src/data/content/{pages,pages-admissions}.ts`, `docs/CTF.md`.

## Verification
- `store.test.ts`: a comparison run uses no attempt, records nothing and keeps every fix on.
- `e2e/ctf.spec.ts`:
  - The comparison run starts with the fixes on and the apply form visible.
  - The apply CTF completes in two steps with the new field list.
  - Every `apply-*` scenario still mounts on the page (`check:scenarios`).
  - The registration flag works with two courses.
  - The map run never shows the timeout.
  - The observatory code appears in the details panel.
  - The leaderboard modal opens from the bar and from the complete message.
  - The existing axe checks pass with the dock open.
- Manual: replay each challenge with its assistive technology (VoiceOver, Voice Control, Head Pointer) once, in a normal run and in a comparison run.
