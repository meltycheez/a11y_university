# Pope Tech Accessibility Lab widget: Assistive Technology CTFs

The **Pope Tech Accessibility Lab** widget is the "Accessibility Lab" button with the Pope Tech logo in the bottom corner of every page (`Alt+Shift+A` jumps to it). Its **Fixes** tab has the Fix switches described in [ACCESSIBILITY_TESTING.md](ACCESSIBILITY_TESTING.md). Its **Challenges** tab lists three capture-the-flag (CTF) challenges and the leaderboard; each challenge itself is run from the **challenge bar** near the top of its page. Each one is a real task on a real page of the site, done with one kind of assistive technology while every accessibility issue on the page is switched on. Plan: [plans/11-ctf-pope-tech-widget.md](plans/11-ctf-pope-tech-widget.md).

| Challenge | Page | Assistive technology | Task |
|---|---|---|---|
| Application for Admission | `/admissions/apply` | Screen reader | Submit a complete application, including the referral code hidden on the Academics and program step. The form fades out once the run starts. |
| Class Registration | `/portal/registration` | Voice control | Register for MATH 101-02, CHEM 101-02 and ENGL 111-01, in that priority order. |
| Campus Map | `/campus-map` | Eye tracking | Find Hawthorne Observatory, read its after-hours code from its tooltip, and check in with it. |

## Playing

1. Go to a challenge page (the widget's Challenges tab links to all three, and closes when you get there) and find the **Pope Tech Challenge** bar near the top.
2. Enter your name and select **Start the Challenge**. Starting turns every Fix switch off and uses one attempt.
3. Follow the instructions in the bar. Its **Allowed**, **Discouraged** and **Costs points** chips show the rules at a glance; expand "More about what's allowed and what isn't" for the details. Hints, Abandon and the Fix switches are in the bar too.
4. When you finish the task, the challenge completes on its own: the page congratulates you, shows your flag (`RSU{…}`), and the score (time bonus included) is saved to the leaderboard. **Try again with all issues fixed** then turns every Fix switch on and resets the page for an unscored comparison run.

**View challenge source** shows the page's real source code and its registered accessibility issues. It costs nothing to look.

## Scoring

| | Points |
|---|---|
| Each challenge starts at | 500 |
| Each Fix category turned on during a run (once per category; Fix All counts as three) | −150 |
| Each highlight category turned on during a run (once per category) | −25 |
| Hints 1, 2 and 3 | −50, −75, −100 |
| **Show the form** (Application for Admission only: the form fades out during a run) | −50, once |
| Time bonus: 100 at the start, falling to 0 at 20 minutes | up to +100 |

Penalties can't take the score below 0 before the time bonus. Each name gets **4 attempts per challenge** (the first try plus 3 retries), and the leaderboard keeps each name's best score. Starting a run uses an attempt, even if you then reload or abandon it. The overall board adds up each name's best score in each challenge.

The screen reader and voice runs also count real mouse clicks on the page. That count shows on the result ("completed without a mouse") but doesn't change the score.

## Setting up assistive technology

- **Screen reader**
  - **NVDA** (free, Windows) with Firefox or Chrome. Use browse mode (arrow keys, `H` for headings, `F` for form fields) and Tab.
  - **JAWS** with Chrome.
  - **VoiceOver** (`Cmd+F5` on a Mac) with Safari. Use the rotor (`VO+U`).
  - Turn the screen off or look away.
- **Voice control**
  - **Voice Control** on macOS or iOS (System Settings → Accessibility → Voice Control). Use "Show numbers", "Show grid", "Click …" and "Drag from … to …".
  - **Dragon Professional** on Windows. Use "Click …", MouseGrid and "Drag that".
  - **Windows Voice Access** (Windows 11). Use "Show numbers", "Show grid" and "Drag".
- **Eye tracking**
  - **Windows Eye Control** with a supported tracker. Use the launchpad's precise mouse, drag and keyboard tools.
  - **Tobii Experience / Tobii Dynavox**.
  - **iPadOS or iOS Eye Tracking** (Settings → Accessibility → Eye Tracking).
  - A head mouse with dwell click works too.

## Facilitator checklist (shared laptop)

The leaderboard lives in this browser's `localStorage` ([ADR-061](DECISIONS.md#adr-061)). It is the only thing the site keeps across reloads.

- **Before the event**: clear old scores by deleting their rows in the leaderboard Google Sheet (there is no clear button on the site). Check that the assistive technology for each station is installed and running.
- **Between players**: nothing to do. Reloading a page resets the site; each player enters their own name.
- **After the event**: **View leaderboard** → **Export CSV** to keep the results.
- Use the same browser profile all day, and not a private window, or the board is lost when the window closes.
- Flags and scores are honor-system ([ADR-062](DECISIONS.md#adr-062)): DevTools can change them, so keep an eye on the laptop.
