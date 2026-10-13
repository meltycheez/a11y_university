# Pope Tech Accessibility Lab widget: Assistive Technology CTFs

The **Pope Tech Accessibility Lab** widget is the "Accessibility Lab" button with the Pope Tech logo in the bottom corner of every page (`Alt+Shift+A` jumps to it). Its **Fixes** tab has the Fix switches described in [ACCESSIBILITY_TESTING.md](ACCESSIBILITY_TESTING.md). Its **Challenges** tab lists three booth-length capture-the-flag (CTF) challenges (a few minutes each), a harder screen reader challenge for players' own time, and the leaderboard; each challenge itself is run from the **challenge bar** near the top of its page. Each one is a real task on a real page of the site, done with one kind of assistive technology while every accessibility issue on the page is switched on. Plans: [plans/11-ctf-pope-tech-widget.md](plans/11-ctf-pope-tech-widget.md), playtest changes in [plans/12-ctf-playtest-feedback.md](plans/12-ctf-playtest-feedback.md).

| Challenge | Page | Assistive technology | Task |
|---|---|---|---|
| Request Information | `/admissions/request-info` | Screen reader | Fill in the form and answer its three questions (any answer, but none left unselected), then send it. Tab jumps around, the fields have no real labels, and the form fades out once the run starts. About 3–5 minutes. |
| Class Registration | `/portal/registration` | Voice control | Register for MATH 101-02 (CRN 44458) and ENGL 111-01 (CRN 43099), in that priority order. |
| Campus Map | `/campus-map` | Head pointer for Mac | Find Hawthorne Observatory (search for OBS, or pan to it), read its after-hours code from its details or tooltip, and check in with it. The "Are you still there?" reset is off during a run. |
| *Harder:* Application for Admission | `/admissions/apply` | Screen reader | Submit the two-step application (about 20 minutes with a screen reader), including the referral code hidden on the Program and submit step. Linked from Request Information. Its own leaderboard tab; not in the overall total. |

## Playing

1. Go to a challenge page (the widget's Challenges tab links to all three, and closes when you get there) and find the **Pope Tech Challenge** bar near the top.
2. Enter your name and select **Start the Challenge**. Starting turns every Fix switch off and uses one attempt.
3. Follow the instructions in the bar. During a run they are also pinned to the side of the screen (collapsible), so they stay in view while you work down the page. Its **Allowed**, **Discouraged** and **Costs points** chips show the rules at a glance; expand "More about what's allowed and what isn't" for the details. Hints, Abandon and the Fix switches are in the bar too.
4. When you finish the task, the challenge completes on its own: the page congratulates you, shows your flag (`RSU{…}`), and the score (time bonus included) is saved to the leaderboard. **Try again with all issues fixed** then turns every Fix switch on and resets the page; **Start comparison run** replays the task that way. A comparison run keeps every fix on, never hides the form, has free hints, uses no attempt and isn't scored. **View leaderboard** (in the bar and in the congratulations) opens the board in a dialog, without leaving the page.

**View challenge source** shows the page's real source code and its registered accessibility issues. It costs nothing to look.

## Scoring

| | Points |
|---|---|
| Each challenge starts at | 500 |
| Each Fix switch turned on during a run (once per category: errors, alerts, manual testing issues; Fix All counts as three) | −150 |
| Each Highlight checkbox turned on during a run (once per category) | −25 |
| Hints 1, 2 and 3 | −50, −75, −100 |
| **Show the form** (Application for Admission only: the form fades out during a run) | −50, once |
| Time bonus: 100 at the start, falling to 0 at 5 minutes (20 for the harder Application for Admission) | up to +100 |

Penalties can't take the score below 0 before the time bonus. Each name gets **4 attempts per challenge** (the first try plus 3 retries), and the leaderboard keeps each name's best score. Starting a run uses an attempt, even if you then reload or abandon it. The overall board adds up each name's best score in each of the three booth challenges; the harder challenge has its own board only.

The screen reader and voice runs also count real mouse clicks on the page. That count shows on the result ("completed without a mouse") but doesn't change the score.

## Setting up assistive technology

Each challenge bar has a collapsed **Set up your assistive technology** section with the same advice: screen reader basics, a Voice Control / Voice Access command table, and Head Pointer settings and facial expressions for the Mac. Staffed stations should be set up beforehand.

- **Screen reader**
  - **NVDA** (free, Windows) with Firefox or Chrome. Use browse mode (arrow keys, `H` for headings, `F` for form fields) and Tab.
  - **JAWS** with Chrome.
  - **VoiceOver** (`Cmd+F5` on a Mac) with Safari. Use the rotor (`VO+U`).
  - Turn the screen off or look away.
- **Voice control**
  - **Voice Control** on macOS or iOS (System Settings → Accessibility → Voice Control). Use "Show numbers", "Show grid", "Click …" and "Drag from … to …".
  - **Dragon Professional** on Windows. Use "Click …", MouseGrid and "Drag that".
  - **Windows Voice Access** (Windows 11). Use "Show numbers", "Show grid" and "Drag".
- **Head pointer**
  - **Head Pointer for Mac** (System Settings → Accessibility → Pointer Control). Suggested: pointer moves "When facing screen edges", speed 70, distance to edge 15. Alternate pointer actions: raise eyebrows to click, stick out tongue to drag and drop, smile to recalibrate. Turn on the Accessibility Keyboard to type.
  - **Windows Eye Control** with a supported tracker, or **Tobii Experience / Tobii Dynavox**: use the launchpad's click, drag and keyboard tools.
  - **iPadOS or iOS Eye Tracking** (Settings → Accessibility → Eye Tracking).

## Facilitator checklist (shared laptop)

The leaderboard lives in this browser's `localStorage` ([ADR-061](DECISIONS.md#adr-061)). It is the only thing the site keeps across reloads.

- **Before the event**: clear old scores by deleting their rows in the leaderboard Google Sheet (there is no clear button on the site). If the challenge list changed, paste [scripts/leaderboard-sheet.gs](../scripts/leaderboard-sheet.gs) into the sheet's Apps Script and redeploy it, or the sheet rejects scores from new challenges. Check that the assistive technology for each station is installed and running.
- **Between players**: nothing to do. Reloading a page resets the site; each player enters their own name.
- **After the event**: **View leaderboard** → **Export CSV** to keep the results.
- Use the same browser profile all day, and not a private window, or the board is lost when the window closes.
- Flags and scores are honor-system ([ADR-062](DECISIONS.md#adr-062)): DevTools can change them, so keep an eye on the laptop.
