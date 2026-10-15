# Plan 13: CTF booth polish (second playtest round)

**Status: ✅ Done (2026-10-14).** Built with the defaults below. D4: the two videos are Pope Tech's own, "Getting started with NVDA screen reader for Windows" and "Getting started with Mac's VoiceOver screen reader". Departure: the results keep the flag code (`RSU{…}`), which the canvas left out. Also fixed while building: the unit tests no longer reach the shared leaderboard sheet (`remote.ts` turns it off in Vitest's test mode). Feedback from a second run of the Request Information challenge on the live site, plus a design canvas of suggested content changes ([Pope Tech Challenge Start View](https://claude.ai/artifact/GPCvaGbUbfcrjKxcZrgu8W), five artboards). Builds on [plan 12](12-ctf-playtest-feedback.md). It also folds in the open issues from the plan 12 code review, because the canvas's **Play again for a better score** depends on them.

## Decisions to confirm before building

| # | Question | Default in this plan |
|---|---|---|
| D1 | The canvas only shows Request Information. Should the new layout apply to every challenge bar? | **Yes, all four.** Same structure, with each challenge's own wording, setup section and links. |
| D2 | The canvas's side panel keeps only two bullets ("The form is hidden…", "Reloading…") and drops the task steps. Was that intended? | **Keep one short "Your task" line** above those bullets. Voice and head pointer players use the panel as their only copy of the steps. |
| D3 | The canvas says "advanced screen reader challenge". The site currently says "Harder". | **Use "Advanced" everywhere**: the badge, the widget, links and the leaderboard tab. |
| D4 | The setup section has two video links with placeholder titles (`[Video 1 title]`, `[Video 2 title]`). | Use the two YouTube links as given. **Real titles needed** before release; until then, show "Screen reader basics (video)" and "Using a screen reader on forms (video)". |
| D5 | The completion view says "You're #[RANK] of [TOTAL] players". | **Show the rank once the leaderboard has loaded**; until then show only the score. It's computed from the same data as the leaderboard. |

## 1. Leaderboard dialog: context for first-time players

Feedback: a first-time player can't tell that the tabs are other challenges, or what "CTF" means. This applies wherever **View leaderboard** appears.

- **Dialog title:** "CTF Leaderboard" becomes "Pope Tech Challenges leaderboard".
- **A short intro line under the title:** "Scores from the Pope Tech Challenges at this event. Overall adds up each player's best score on the three challenges."
- **Group the tabs:** keep **Overall** first, then a visible "By challenge:" label in front of the other tabs. Screen readers get the same information through the tab list's name ("Leaderboard: overall and by challenge").
- **Name the AT in each tab:** each challenge tab gets a short line under its table heading, such as "Request Information (screen reader)". The Advanced tab says it isn't part of Overall.
- **Same wording on `/leaderboard` and `/ctf`**, so the terms match the dialog.
- Files: `src/ctf/ChallengesPanel.tsx` (`LeaderboardButton`), `src/pages/leaderboard.tsx`, `src/components/Tabs.tsx` (an optional label before the tab list, if not done in the dialog).

## 2. Leaderboard loads slowly (about 4 seconds)

Cause: every time the dialog opens, it fetches the whole Google Sheet through Apps Script, and the dialog stays empty until that finishes. Apps Script often takes 2 to 4 seconds to answer.

- **Show something immediately:** open the dialog with the last board we loaded, or with this browser's own scores if none has loaded yet. Swap in the shared sheet's scores when they arrive, with a visible "Updating scores…" note in the meantime.
- **Load early:** start loading the board when a challenge page opens and again when a run finishes, so it's usually ready before anyone clicks.
- **Short cache:** reuse a board loaded in the last 30 seconds instead of fetching again.
- **Show your own result straight away:** a score the player just finished is added to what's shown, even if the sheet hasn't returned it yet.
- Files: `src/ctf/leaderboard.ts` (`loadBoard` gets a cached copy and an in-flight promise), `src/ctf/ChallengesPanel.tsx`, `src/pages/leaderboard.tsx`, `src/pages/ctf.tsx`.

## 3. Safari: no hover feedback on Start Challenge and View leaderboard

What I checked: in Playwright's WebKit engine (Safari's engine), both buttons get the hand cursor and change color on hover, the same as Chrome. Real Safari can't be tested from this Windows machine. Likely causes:

- **The hover change is faint.** Start Challenge goes from dark navy to a slightly lighter navy, and View leaderboard from white to a very pale grey. On some screens that's hard to see.
- **Safari doesn't show hover effects in a window that isn't active**, for example when the window behind the one you clicked last is under the mouse.

Plan:
- **Make hover obvious in every browser:** underline the button text and darken the border on hover, add a clear `:focus-visible` ring to match, and keep `cursor: pointer`. This applies to every `.ctf-btn`, so the challenge bar, the dialogs and the widget all match.
- **Ask the reviewer to re-test** in Safari with the window active, after this deploys.
- Files: `src/styles/components.css`.

## 4. Challenge bar content changes (from the design canvas)

The changes for each view, in the order a player sees them.

### 4a. Start view (before Start Challenge)
- Add one line under the heading: "Pope Tech created these challenges so anyone can experience a website using different assistive technologies. **Learn more about Pope Tech Challenges**" (links to `/ctf`).
- Keep **Start Challenge** and **View leaderboard** side by side.

### 4b. Name step
- Help text becomes: "Shown on the leaderboard, so use a first name or nickname. 4 attempts per name."

### 4c. Instructions (after entering a name)
New order, top to bottom:
1. **One plain sentence on the task**, e.g. "Use only your screen reader to fill out and send the Request Information form. The challenge is complete when the form sends successfully. It takes about 5 minutes." This replaces the current brief and the "For example: NVDA…" line.
2. **Allowed / Discouraged / Costs points** chips and "More about what's allowed and what isn't", in a white box as now.
3. **"Set up your screen reader"**, open by default: the screen reader and browser pairs as one sentence, then "New to screen readers? Watch one of our videos first" with the two video links (D4). Other challenges keep their own setup sections, renamed "Set up voice control" and "Set up Head Pointer".
4. **How scoring works**, collapsed.
5. **A "Before you start" box** with three bullets: the form fades out, starting uses 1 of 4 attempts and turns off Fix switches, and hints, fixes and highlights are in the bar during the challenge, with the instructions pinned to the side.
6. **Buttons:** **Start the Challenge**, **View leaderboard**, then "Playing as {name}. Change name".
- **Removed here:** the "View challenge source" button, which moves to the completion view, and the separate "Heads up" warning (now the first bullet of "Before you start").

### 4d. Side panel during a run
- **Title:** "{Challenge} Instructions", e.g. "Request Information Instructions".
- **Contents:** score, the short task line (D2), then "The form is hidden, but your screen reader can still read it and fill it in. Focus starts on the first field." and "Reloading the page ends the run and uses up the attempt."
- **A "Need help?" line:** "Hints, Show the form and Fix switches are in the challenge bar at the top of the page. Each one costs points."
- Voice and head pointer get the same structure with their own two bullets. Head pointer keeps its gesture line, since the playtest asked for it.

### 4e. Completion view (in the challenge bar)
- **Heading and score:** "Challenge complete" heading, then the score shown large, then "You're #N of M players on the Request Information leaderboard" (D5).
- **Score breakdown table**, with each hint listed separately ("Hint 1 −50") instead of one "Hints used" line. **How scoring works** collapsed below it.
- **Status lines:** "Saved to the leaderboard as {name}. You have N attempts left on this challenge." and a **View challenge source** link.
- **Compare the experience:** "Try the challenge again with every accessibility issue fixed. This run is free and isn't scored." Then three buttons: **Try again with all issues fixed**, **Play again for a better score** and **View leaderboard**.
- **Keep going:** "Try the advanced screen reader challenge" (only where there's an advanced version) and "Explore more challenges" (`/ctf`).
- **Remove the separate green "Congratulations!" box** at the bottom of each challenge page. When a run finishes, focus moves to the "Challenge complete" heading, so screen reader users hear they finished and land on their results.
- Files: `src/ctf/ChallengeBanner.tsx` (`Finished`), `src/ctf/ChallengeComplete.tsx` (removed; its retry logic moves into `Finished`), and the four pages, which drop `<ChallengeComplete>` but keep their reset callback.

## 5. Fixes carried over from the plan 12 code review

These are needed for **Play again for a better score** to be fair:

- **A new run must start with a clean page.** Each challenge page passes one `onReset` to `ChallengeBanner`. It runs when any run starts (scored or comparison) and on Abandon. This replaces registration's `onAbandon`, and covers the Request Information form, the application, the map check-in box and the registration cart and registrations. It fixes the stale-answers bug and the "Enrolled" classes after Play again.
- **"End comparison run" gets its own dialog:** "End the comparison run? Nothing is scored." (no "attempt stays used").
- **Registration:** when an attempt is held and nothing was registered, hide the "Registered and waitlisted classes appear under Current Schedule…" line.
- **Docs:** update the stale `Run.compare` comment, and plan 12 §3, to the ENGL-first rule and the abandon reset.

## Order of work

1. §5 resets (everything else builds on them).
2. §4e completion view, plus removing the green box and moving focus.
3. §4a to §4d challenge bar content.
4. §1 and §2 leaderboard.
5. §3 hover styles.

## Verification

- **Unit tests:**
  - `onReset` runs on start and on Abandon, and a second run after Play again starts with an empty form and cart.
  - The completion view takes focus and shows the rank once the board loads.
  - "End comparison run" shows the comparison wording.
- **End-to-end:**
  - Axe checks on the new bar views and the dialog.
  - The leaderboard dialog shows content within 200 ms (cached or local) and then updates.
  - Focus lands on "Challenge complete" after finishing each challenge.
- **Browser walkthrough scripts:** update for the new copy, and run them in WebKit as well as Chromium, since the hover report came from Safari.
- **Manual:** the reviewer re-tests hover in real Safari, and one timed booth run of each challenge.
