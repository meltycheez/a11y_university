# Plan 14: Advanced challenge views, error summaries, /ctf landing page

Status: Parts 1 to 4 done and deployed (9d9783f, plus Jay's new Platform and Canvas demo links on /start). Part 5 (round 4) done: 5a, 5a-2, 5c, 5e and 5f built; 5b no change; 5d deferred.

Source: Whitney's playtest feedback (Oct 15, 2026) and her design canvas "Pope Tech Advanced Challenge Views" (9 boards).

## 1. Error summaries: say what the links are for (everywhere)

Feedback: in the fixed version, the error links that jump to each problem weren't obvious. Suggested heading: "Form errors: Select the link to go to the form with an error."

The fixed summaries today:

| Page | File | Current heading (fixed) |
|---|---|---|
| Application for Admission | `src/pages/admissions/apply.tsx:429` | Please fix N problems on this step: |
| Donate | `src/pages/giving/donate.tsx:188` | Please fix N problems before continuing: |
| Legacy financial aid | `src/pages/financial-aid/legacy-application.tsx:196` | Please correct N items: |

Change: one wording on all three, keeping the count (screen reader users hear it first when the summary takes focus):

> **Form errors (2): Select a link to go to the field with the error.**

Only the fixed branch changes. The defective text ("This step has N problems. Moving you to the first one.", "Please correct the following errors:", "ERROR: Invalid input…") stays, since it's the issue being demonstrated. Update the matching unit tests and walkthrough expectations.

## 2. Referral code: easier to find in the fixed version

Feedback: in the broken version the code was read out as part of the field (the junk `aria-label` "ref_code: type R S U 7 Q 4 K"); in the fixed version you have to go looking for the image.

Change (`apply.tsx:301-308`): when `code-image-alt` is fixed, the input gets `aria-describedby` pointing at the image (`id="referral-code-img"`), so the field announces "Application referral code, edit, Your application referral code: RSU-7Q4K". It's merged with the error id when there's an error. That's a real fix pattern (the instruction is programmatically tied to the field), and the fixed run is now at least as easy as the broken one.

## 3. Challenge bar views (the design canvas)

Plan 13 already did the two orange notes (the separate completion box is gone, and focus moves to "Challenge complete" / "Comparison run complete"). What's left is a trim of each stage. The structure applies to all four challenges, since it's one component. The wording is the advanced challenge's.

| View | Changes |
|---|---|
| **Start (closed)** | Context line first, then the Advanced row. The Advanced row becomes a badge plus "Takes about 20 minutes. Scores go on this challenge's own leaderboard and don't count toward your overall total." |
| **Name** | Advanced row (same text). No other change. |
| **Instructions (ready)** | apply-sr `brief`: "Use only your screen reader to fill out and submit the two-step Application for Admission. The challenge is complete when your application is submitted." (the referral code moves to the side panel). The rules chips sit in a white card. No other change. |
| **Side panel (dock)** | Drop the "Your task:" paragraph. The list is now `panelNotes` plus the reload line. apply-sr notes: the hidden-form line, then "The application has two steps. On the Program and submit step, you also need your Application referral code. It is somewhere on that step." Booth challenges move their `task` text into their `panelNotes`, so nothing is lost. |
| **Running** | "Challenge running" and "Score: N points" on one row. One line: "{task} The full instructions stay pinned to the side of the screen." Then buttons: Get a hint (−50), Show the form (−50), **Abandon challenge** (renamed). Then a `<details open>` "Fix switches and highlights (cost points)" with "Each Fix switch costs 150 points and each highlight costs 25, the first time you use it." and the switches. **Removed while running:** Rules, Setup, Player line, numbered Instructions list, "Finishing the task…" note, leaderboard button, Scoring. Taken hints still show. apply-sr `task` becomes "Fill out and submit both steps of the application with your screen reader." |
| **Complete** | Same as now except: no flag line, and no mouse-click line (see Decisions). Keep going has only "Explore more challenges" here (apply has no harder version, so this is unchanged). |
| **Comparison (ready)** | h3 "Comparison run" and "Try the challenge again with your screen reader. Now, every issue is fixed. Notice what's different from your first try." Before you start: "Like your first run, the form fades out over 5 seconds…" and "This run isn't scored and doesn't use an attempt. Hints and Show the form don't cost points." Buttons: Start comparison run, View leaderboard, Explore more challenges. **Removed:** the yellow warning box, brief, Rules, Setup, Scoring, Playing as, and the Advanced row. |
| **Comparison (running)** | h3 "Comparison run". "Every issue is fixed. {task} The full instructions…" and "This run isn't scored, so hints and Show the form don't cost points." Buttons: Get a hint, Show the form, End comparison run. Fix switches in a collapsed `<details>` "Fix switches (all on)". |
| **Comparison complete** | White card: heading, "What felt easier this time? Each difference came from fixing an accessibility issue.", "This run wasn't scored, so your leaderboard score is unchanged. You have N attempts left on this challenge." Buttons: **Explore more challenges** (primary), Play again for a better score, View leaderboard. No "Keep going" heading. |

"Your screen reader" in the comparison copy comes from `c.at` ("your voice control", "your head pointer"), so it works for every challenge.

## 4. /ctf landing page

- **Remove the floating icons:** delete the `cp-float` animation (`ctf-page.css:16-20`). The static tilt stays.
- **h1:** "Same web. Different tools. <span>Still no problem?</span>" The page `<title>` stays.
- **Lede:** "Complete three real tasks using only a screen reader, voice control, or a head pointer. Every page is full of accessibility issues. Can you finish anyway?"
- **Advanced card:** the cards map over `allChallenges`. apply-sr gets a `PITCH` (hook "Apply to college without seeing the form.", line "A two-step application by ear, with a referral code hidden in it.", and 3 "What you'll face" items from its scenarios) and an "Advanced · about 20 minutes" badge. It's a full-width card under the three booth cards (`grid-column: 1 / -1`, with the body in two columns on wide screens), so it reads as the featured one. The "More time? Try the advanced version" line on the Request Information card goes, since the card replaces it.

## Decisions (defaults; say if you want otherwise)

1. **The flag line on the results is dropped**, as in the design. The new lede also drops "capture the flag". The flag is still computed and saved to the sheet. *Alternative: keep "Your flag: RSU{…}" as a small line.*
2. **The mouse-click line is dropped**, as in the design. It never affected the score.
3. **The trimmed running view applies to all challenges.** Voice and head pointer players lose the numbered steps in the bar, but the dock has the task. *Alternative: trim only the advanced challenge.*
4. The design's "Go to leaderboard" stays **View leaderboard**, to match every other place.
5. **Error summary wording:** "Form errors (N): Select a link to go to the field with the error." Whitney's wording plus the count.

## Tests and checks

- Unit: error summary text (apply, donate, legacy), referral `aria-describedby` in fixed mode, and /ctf renders 4 cards with the new h1.
- e2e `ctf.spec.ts`:
  - the flag assertions go to the stored result (`localStorage`) instead of `.ctf-flag`
  - "running, rules expanded" becomes a check of the ready stage
  - "Abandon challenge" label
  - "Comparison run:" text becomes the h3
- Walkthrough scripts (sr, validate-p13, extra): update the changed strings.
- typecheck, lint, all unit tests, e2e and check-scenarios. Screenshot each view next to its board.
- Docs: `docs/CTF.md` (results no longer show the flag; the landing page).

## 5. Round 4 (Whitney, Oct 15, after the deploy)

Her first four notes (/ctf icons, intro text, heading, advanced card) are part 4 above and are live. What I checked on the live site before planning the rest, with a scripted browser:
- Campus Map: the side panel shows during a run, and checking in with 7731 completes the challenge.
- End comparison run: the dialog says "Nothing is scored, and no attempt is used."

### 5a. Doing the task without starting the challenge fails silently

This is the most likely cause of three of her notes: "added the access code but didn't get a challenge complete", "no sticky instructions on this one", and "it won't go through but I'm not getting an error".

- **How it happens:** Start Challenge, then the name, opens the instructions. The **Start the Challenge** button is at the bottom of a long block (rules, open setup, scoring, Before you start). Someone who skips it and does the task gets the page's normal result ("Checked in at Hawthorne Observatory.") and nothing else: no side panel, no score.
- **Fix, on all four pages:** when the task finishes and that challenge isn't running, the page's own message adds: "This didn't count for the Pope Tech Challenge because it hasn't started. Select **Start the Challenge** in the challenge bar at the top of the page to play." It's one check in each page's existing finish handler, using `ctfStore`'s current run.
- **Also:** put the Start the Challenge button above the long instructions too? **Default: no**, the design puts it at the bottom on purpose (after Before you start). The message above covers it.
- **Ask Whitney:** which challenge she did with a mouse to get to the comparison run, so I can confirm this was the cause. Every page does show a message when a submit fails during a run (checked: Request Information "Challenge not complete yet: check …", the application's field errors, Campus Map "That code doesn't match…").

**Whitney confirmed:** on Campus Map she never selected Start the Challenge.

### 5a-2. Class Registration: "it won't go through" (confirmed)

Whitney did the Class Registration run with a mouse. Her classes were in the right final order, and she selected Register, then the checkmark. Nothing happened that she could see.

I reproduced it on the live site:
- **The cause:** adding MATH first and then ENGL gives the final order straight away, but the challenge requires ENGL to be added first (the "must reorder" rule). The page holds the registration and writes "Nothing was registered. Add ENGL 111-01 to your cart first…".
- **Why she didn't see it:** that message renders in Registration Results, about 4,000px below the cart, while the page stays scrolled at the cart. Focus also drops to the top of the page (the page's defective focus handling), so screen readers don't land on it either.

Fix:
- **Show the challenge message where the player is:** a `role="alert"` note directly under the cart's Submit enrollment request button, for both "Nothing was registered" messages and "Challenge not complete yet". It's challenge feedback, not part of the site, so it shows in scored and comparison runs alike. The copy in Registration Results is removed so there's only one.
- **Make the rule clearer up front:** the brief and side panel already say "ENGL first, then MATH, then reorder". Add "Adding them in the final order won't count." to the side panel bullet.
- **Test:** an e2e test (MATH first, then Register and the checkmark) checks that the note is in the viewport.

### 5b. End comparison run said it would use an attempt

The current code (and the live site) says "End the comparison run? Nothing is scored, and no attempt is used." Older versions (before plan 13) did say the attempt stays used, so she probably had an older page cached. **No change.** Ask her to retry after a hard refresh, with a screenshot if it still happens.

### 5c. Is the Accessibility Lab button needed?

It's the site-wide demo of the Fix switches (and its Challenges tab lists the challenges). The demo uses it outside the challenges. During a run, the challenge bar has the same Fix switches.

**Decision (Jay): remove the Accessibility Lab button on the four challenge pages only, and keep it on the rest of the site.** The four pages are `/admissions/request-info`, `/admissions/apply`, `/portal/registration` and `/campus-map`.

- **How:** the widget doesn't render on a page that has a challenge bar. The check uses the challenge paths in `challenges.ts`, so a new challenge page is covered automatically. Its `Alt+Shift+A` shortcut goes too on those pages.
- **Trade-off:** on those four pages the Fix switches and highlights are only available once a run starts, in the challenge bar. Anyone using these pages as an ordinary demo (outside a challenge) loses them there. They stay on every other page.
- **Tests to update:**
  - e2e "a Fix switch mid-run costs points" uses the widget on `/campus-map`, so it moves to the bar's switches.
  - The "Fix All, no unnamed buttons" check loops over the challenge pages, so it uses the bar there.
  - The widget's Challenges tab test still runs from `/`.
  - Add a check that the button is absent on the four pages and present on `/`.

### 5d. A "practice" (unscored) run

Whitney says not now. **Deferred.** Logged in the feedback sheet as an idea to think through: is it the same task unscored, or a different one?

### 5e. Block certain words as leaderboard names

- A short built-in list of offensive words in `src/ctf/leaderboard.ts`, checked when the name is entered (`checkStart`). The check lowercases, undoes simple swaps (0→o, 1→i, 3→e, 4→a, 5→s, @→a, $→s) and drops spaces and symbols.
- Short words match only as a whole word, so names like "Cassidy" or "Scunthorpe" still work. Longer words match anywhere.
- Message: "Please choose a different name." No dependency is added.
- **Not covered:** names posted straight to the sheet, and names already there. Delete those rows by hand.

### 5f. Head pointer views (canvas "Pope Tech Head Pointer Challenge Views")

**Instructions (ready stage)**
- **Setup:** "Set up Head Pointer on Mac", open by default, with 4 numbered steps:
  1. Turn on Head pointer.
  2. Set the options (when facing screen edges, speed 70, distance 15).
  3. Turn on the Accessibility Keyboard.
  4. Turn on Alternate pointer actions, pointing to the table below.
- **Below the steps:** "**Using Windows?** Use Eye Control or Tobii…" with a link to "Microsoft: Eye control basics in Windows", then the Apple link (same URL as now).
- **New collapsed section "Head pointer actions for this challenge":** one intro line saying these are suggestions, then a table (Action | Facial expression):
  - Left click: raise your eyebrows
  - Drag and drop: stick out your tongue to grab, then move your head
  - Scroll: point at the scroll bar, tongue, move, tongue
  - Recalibrate: smile
- **Before you start, bullet 2:** "…Your task and the head pointer actions stay pinned to the side of the screen."

**Side panel (during a run)**
- Title, Hide button, score.
- "Your task" heading with 2 numbered steps: "Find Hawthorne Observatory on the campus map." and "Enter the after-hours code in the Check in text field."
- "Head pointer actions" (open): a one-line note that these need Alternate pointer actions turned on, then the same 4 actions as a list.
- "Setup reminders" (collapsed): "Change your actions" and "Type with the on-screen keyboard", each with its settings path.
- "**Need help?** Hints and Fix switches are in the challenge bar…"
- "**Don't reload the page.** It ends the run and uses up the attempt."

**Targets:** the Hide button and the section toggles in the side panel are at least 44px tall (head pointer users click by dwelling or a facial expression).

**How it's built:** `Challenge` gets optional `panelSteps` (shown under "Your task") and `panelSections` (titled, collapsible term/definition lists). The head pointer actions are defined once and used by both the setup table and the side panel. The other three challenges keep their panels as they are. The "Don't reload" line moves to its own bold paragraph on every panel, to match.

### 5g. Tests

- Unit tests for the name filter (blocked words, leetspeak, "Cassidy" allowed) and the "hasn't started" message on Campus Map.
- e2e: the map side panel's structure, 44px toggles and an axe check.
- Re-run the round 3 checks (shot14 / probe15), plus a screenshot of each new view next to its board.
- Feedback sheet: add these rows.

## 6. Error summaries on every form (Chris, Oct 15)

With fixes on, a failed submit shows a summary at the top of the form: "Form errors (N): Select a link to go to the field with the error.", then one "Field name: reason" item per bad field. It takes focus (and is `role="alert"`), each link moves focus into its field (click or Enter), and the bad fields get `aria-invalid`.

- **Shared:** `src/components/ErrorSummary.tsx`. `useErrorSummary()` reads the browser's own checks (`required`, `type="email"`) with `noValidate`, so a form needs only a couple of lines. `focusField` is the link handler, and it finds the control inside a wrapper.
- **New summaries, each on its existing fix:**
  - Request Information (`adm-reqinfo-required-color-001`)
  - Contact (`about-contact-required-color-001`)
  - Portal profile (`portal-profile-required-color-001`)
  - Visit dialog (`visit-name-placeholder-001`, which gives the summary real field names)
  - Event registration (`events-reg-errors-001`, using its own messages)
- **Existing summaries:** Application, Donate and Financial aid keep their wording, which already names the field. Their links now focus the field instead of only scrolling. Financial aid's fields get `aria-invalid` too.
- **Left alone:** search forms (nothing to validate) and Library study rooms (one booking message, not field errors).
- **Checks:**
  - Unit test (`ErrorSummary.test.tsx`).
  - e2e (`error-summary.spec.ts`): Request Information and Contact, including axe.
  - A browser walkthrough of all 8 forms, with focus, every link and axe on each form: 48/48.
