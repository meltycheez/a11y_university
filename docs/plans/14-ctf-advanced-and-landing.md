# Plan 14: Advanced challenge views, error summaries, /ctf landing page

Status: Done (plus Jay's new Platform and Canvas demo links on /start)

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
